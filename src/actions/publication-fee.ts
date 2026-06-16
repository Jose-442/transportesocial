"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PUBLICATION_FEE_EUR } from "@/lib/constants";
import {
  countUserPublications,
  hasFreePublicationSlot,
  requiresPublicationPayment,
} from "@/lib/publications";
import { getStripeServer } from "@/lib/stripe/server";
import {
  parsePublicationDest,
  publicationFeeTipo,
  suscribirRequeridaHref,
  type PublicationDest,
} from "@/lib/publication-flow";
import type { Profile } from "@/types/database";
import { getOrCreateProfile } from "@/lib/profile";

type PublicationCreditMetadata = {
  dest: PublicationDest;
  consumed: boolean;
  fase: "pre_publicacion";
};

export async function getProfileForPublication(): Promise<{
  userId: string;
  profile: Pick<Profile, "trial_ends_at" | "subscription_active">;
} | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const result = await getOrCreateProfile(supabase, user);
  if (result.error || !result.profile) return null;

  const { trial_ends_at, subscription_active } = result.profile;
  return {
    userId: user.id,
    profile: { trial_ends_at, subscription_active },
  };
}

export async function hasPublicationCredit(
  userId: string,
  dest: PublicationDest
): Promise<boolean> {
  const supabase = await createClient();
  const tipo = publicationFeeTipo(dest);

  const { data } = await supabase
    .from("transacciones")
    .select("id")
    .eq("user_id", userId)
    .eq("tipo", tipo)
    .eq("estado_escrow", "liberado")
    .filter("metadata->>dest", "eq", dest)
    .filter("metadata->>consumed", "eq", "false")
    .filter("metadata->>fase", "eq", "pre_publicacion")
    .limit(1)
    .maybeSingle();

  return Boolean(data);
}

export async function hasPublicationAccess(
  userId: string,
  profile: Pick<Profile, "subscription_active">,
  dest: PublicationDest
): Promise<boolean> {
  if (!profile.subscription_active) {
    return false;
  }

  const count = await countUserPublications(userId);
  if (hasFreePublicationSlot(count)) {
    return true;
  }

  return hasPublicationCredit(userId, dest);
}

export async function requirePublicationAccess(dest: PublicationDest) {
  const session = await getProfileForPublication();
  if (!session) {
    redirect(
      `/login?redirect=${encodeURIComponent(dest)}`
    );
  }

  if (!session.profile.subscription_active) {
    redirect(suscribirRequeridaHref(dest));
  }

  const allowed = await hasPublicationAccess(
    session.userId,
    session.profile,
    dest
  );

  if (!allowed) {
    redirect(`/aportacion?dest=${encodeURIComponent(dest)}`);
  }
}

export async function shouldConsumePublicationCredit(
  userId: string,
  profile: Pick<Profile, "subscription_active">
): Promise<boolean> {
  return requiresPublicationPayment(userId, profile);
}

export async function consumePublicationCredit(
  userId: string,
  dest: PublicationDest,
  entityKey: "ruta_id" | "bulto_id",
  entityId: string
) {
  const supabase = await createClient();
  const tipo = publicationFeeTipo(dest);

  const { data: credit } = await supabase
    .from("transacciones")
    .select("id, metadata")
    .eq("user_id", userId)
    .eq("tipo", tipo)
    .eq("estado_escrow", "liberado")
    .filter("metadata->>dest", "eq", dest)
    .filter("metadata->>consumed", "eq", "false")
    .filter("metadata->>fase", "eq", "pre_publicacion")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (!credit) return;

  const metadata = (credit.metadata ?? {}) as Record<string, unknown>;
  await supabase
    .from("transacciones")
    .update({
      metadata: {
        ...metadata,
        consumed: true,
        [entityKey]: entityId,
      },
    })
    .eq("id", credit.id);
}

export async function confirmPublicationPayment(
  paymentIntentId: string,
  destRaw: string
): Promise<{ error?: string; dest?: PublicationDest }> {
  const dest = parsePublicationDest(destRaw);
  if (!dest) return { error: "Destino no válido." };

  const session = await getProfileForPublication();
  if (!session) return { error: "Debes iniciar sesión." };

  if (!session.profile.subscription_active) {
    return { error: "Necesitas una suscripción activa." };
  }

  const needsPayment = await requiresPublicationPayment(
    session.userId,
    session.profile
  );

  if (!needsPayment) {
    return { dest };
  }

  if (await hasPublicationCredit(session.userId, dest)) {
    return { dest };
  }

  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("transacciones")
    .select("id")
    .eq("stripe_payment_intent_id", paymentIntentId)
    .maybeSingle();

  if (existing) {
    return { dest };
  }

  const stripe = getStripeServer();
  const intent = await stripe.paymentIntents.retrieve(paymentIntentId);

  if (intent.status !== "succeeded") {
    return { error: "El pago no se ha completado." };
  }

  const expectedAmount = Math.round(PUBLICATION_FEE_EUR * 100);
  if (intent.amount !== expectedAmount || intent.currency !== "eur") {
    return { error: "Importe de pago no válido." };
  }

  if (intent.metadata?.user_id !== session.userId) {
    return { error: "Pago no asociado a tu cuenta." };
  }

  if (intent.metadata?.dest !== dest) {
    return { error: "Destino de pago no válido." };
  }

  const tipo = publicationFeeTipo(dest);

  const { error } = await supabase.from("transacciones").insert({
    user_id: session.userId,
    stripe_payment_intent_id: intent.id,
    tipo,
    monto: PUBLICATION_FEE_EUR,
    estado_escrow: "liberado",
    metadata: {
      dest,
      consumed: false,
      fase: "pre_publicacion",
    } satisfies PublicationCreditMetadata,
  });

  if (error) return { error: error.message };

  return { dest };
}

export async function assertCanPublish(
  profile: Pick<Profile, "trial_ends_at" | "subscription_active">,
  userId: string,
  dest: PublicationDest
): Promise<{ error?: string }> {
  if (!profile.subscription_active) {
    return {
      error: "Necesitas una suscripción activa para publicar.",
    };
  }

  const allowed = await hasPublicationAccess(userId, profile, dest);
  if (!allowed) {
    return {
      error:
        "Debes abonar la aportación de publicación antes de publicar.",
    };
  }

  return {};
}
