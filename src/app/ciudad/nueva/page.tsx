import { PublicarCiudadForm } from "@/components/ciudad/PublicarCiudadForm";
import { requirePublicationAccess } from "@/actions/publication-fee";

export const dynamic = "force-dynamic";

export const metadata = { title: "Publicar trayecto en mi ciudad" };

export default async function NuevaCiudadPage() {
  await requirePublicationAccess("/ciudad/nueva");

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold leading-snug text-zinc-900 sm:text-2xl">
          Publicar trayecto en mi ciudad
        </h1>
        <p className="mt-1 text-sm text-zinc-600">
          Solo si ya ibas a hacer ese recorrido. Burgos, Aranda de Duero,
          Miranda de Ebro, Logroño, Palencia, Santander, Torrelavega,
          Castro-Urdiales, Vitoria-Gasteiz, Pamplona, Tudela, León,
          San Andrés del Rabanedo, Ponferrada, Soria, Segovia, Valladolid, Zamora, Zaragoza, Gijón, Lugo, Ourense, Pontevedra, Vigo, Vilagarcía de Arousa, A Coruña, Santiago de Compostela, Ferrol, Narón, Oleiros, Bilbao, Barakaldo, Getxo, Portugalete, Santurtzi, Basauri, San Sebastián, Irun, Errenteria, Barcelona, L'Hospitalet de Llobregat, Badalona, Santa Coloma de Gramenet, Cornellà de Llobregat, Sant Boi de Llobregat, Viladecans, El Prat de Llobregat, Esplugues de Llobregat, Gavà, Montcada i Reixac, Terrassa, Sabadell, Mataró, Sant Cugat del Vallès, Rubí, Vilanova i la Geltrú, Castelldefels, Granollers, Cerdanyola del Vallès, Mollet del Vallès, Barberà del Vallès, Manresa, Sitges, Sant Pere de Ribes, Vic, Igualada, Vilafranca del Penedès, Tarragona, Reus, El Vendrell, Cambrils, Tortosa, Calafell, Salou, Ávila, Salamanca, Madrid, Móstoles, Alcalá de Henares, Leganés, Getafe, Fuenlabrada, Alcorcón, Torrejón de Ardoz, Parla, Alcobendas, Rivas-Vaciamadrid, Las Rozas de Madrid, San Sebastián de los Reyes, Pozuelo de Alarcón, Valdemoro, Coslada, Majadahonda, Collado Villalba, Boadilla del Monte, Aranjuez y Arganda del Rey. La calle se concreta
          en el chat.
        </p>
      </div>
      <PublicarCiudadForm />
    </div>
  );
}
