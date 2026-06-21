"use client";

const IOS_GUIDE_TEXT =
  'SI TU MÓVIL ES UN IPHONE PULSA EL BOTON DE COMPARTIR. SI NO APARECE, PULSA EN LAS 3 RAYITAS HORIZONTALES Y VIAJA POR EL DESPLEGABLE HASTA ESE BOTÓN "COMPARTIR". EN EL DESPLEGABLE QUE SALE BUSCA "AÑADIR A PANTALLA DE INICIO" (EL ICONO DEL + DENTRO DE UN CUADRO) Y PULSA "AÑADIR"';

type PwaIosInstallGuideProps = {
  open: boolean;
  onClose: () => void;
};

function ShareIcon() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 4v8" />
      <path d="M8.5 8.5 12 4.5 15.5 8.5" />
      <path d="M6 12v6a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-6" />
    </svg>
  );
}

export function PwaIosInstallGuide({ open, onClose }: PwaIosInstallGuideProps) {
  if (!open) return null;

  return (
    <div
      id="ts-pwa-ios-guide"
      className="ts-pwa-ios-guide md:hidden"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="ts-pwa-ios-box"
        role="dialog"
        aria-modal="true"
        aria-label="Instrucciones para instalar en iPhone"
      >
        <div className="ts-pwa-share-ico">
          <ShareIcon />
        </div>
        <p className="ts-pwa-ios-txt">{IOS_GUIDE_TEXT}</p>
        <button type="button" className="ts-pwa-ios-ok" onClick={onClose}>
          Entendido
        </button>
      </div>
    </div>
  );
}
