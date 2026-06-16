const STORAGE_KEY = "transporte-social-registro-draft";

type StoredPhoto = {
  name: string;
  type: string;
  dataUrl: string;
};

export type RegisterDraft = {
  displayName: string;
  email: string;
  password: string;
  photo: StoredPhoto | null;
};

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function dataUrlToFile(photo: StoredPhoto): File {
  const base64 = photo.dataUrl.split(",")[1] ?? "";
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new File([bytes], photo.name, { type: photo.type });
}

export function loadRegisterDraft(): RegisterDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as RegisterDraft;
  } catch {
    return null;
  }
}

export function draftToFoto(draft: RegisterDraft): File | null {
  if (!draft.photo) return null;
  try {
    return dataUrlToFile(draft.photo);
  } catch {
    return null;
  }
}

export async function saveRegisterDraft(
  displayName: string,
  email: string,
  password: string,
  foto: File | null
) {
  if (typeof window === "undefined") return;

  let photo: StoredPhoto | null = null;
  if (foto) {
    try {
      const dataUrl = await fileToDataUrl(foto);
      photo = { name: foto.name, type: foto.type, dataUrl };
    } catch {
      photo = null;
    }
  }

  const draft: RegisterDraft = { displayName, email, password, photo };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  } catch {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ displayName, email, password, photo: null })
      );
    } catch {
      // Sin espacio: no bloqueamos el registro.
    }
  }
}

export function clearRegisterDraft() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
