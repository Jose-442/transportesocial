/**
 * Barrios y polígonos cerrados.
 * Burgos: reglamento de distritos del Ayuntamiento, 2020.
 * Aranda de Duero: reuniones de barrios del Ayuntamiento, 2026, más San Francisco
 * (plan general) y los polígonos del plan.
 * Miranda de Ebro: nombres que usa el Ayuntamiento; sin Miranda Sur (sigue en proyecto).
 * Logroño: barrios que nombra el Ayuntamiento en los distritos y en las obras por barrio;
 * polígonos Cantabria, Las Cañas y La Portalada (plan municipal 2024-2027).
 * Palencia: 12 barrios del plano municipal y del avance del plan de 2026.
 * Polígonos Nuestra Señora de los Ángeles, San Antolín, Villalobón y El Poligonillo.
 * Santander: nombres del plano municipal de 2026, de los consejos de distrito
 * y del estudio municipal de polígonos.
 * Torrelavega: núcleos del municipio y barrios del plan general.
 * Polígono Tanos-Viérnoles. Las Excavadas y La Hilera siguen en proyecto.
 * Castro-Urdiales: juntas vecinales, pedanías y barrios que nombra el Ayuntamiento.
 * Polígonos Vallegón y La Tejera.
 */
export type TipoZona = "barrio" | "poligono";

export const ETIQUETA_MUNICIPIO_URBANO =
  "Municipios de las de 30.000 habitantes";

export type ZonaCiudad = {
  nombre: string;
  tipo: TipoZona;
};

export type CiudadUrbana = {
  id: string;
  nombre: string;
  /** Igual que el municipio en el resto de la web: «Burgos (Burgos)». */
  etiqueta: string;
  zonas: ZonaCiudad[];
};

const BARRIOS_BURGOS: ZonaCiudad[] = [
  { nombre: "Gamonal Norte", tipo: "barrio" },
  { nombre: "Gamonal Sur", tipo: "barrio" },
  { nombre: "G-9", tipo: "barrio" },
  { nombre: "Capiscol", tipo: "barrio" },
  { nombre: "San Cristóbal", tipo: "barrio" },
  { nombre: "Villímar", tipo: "barrio" },
  { nombre: "Centro Histórico", tipo: "barrio" },
  { nombre: "Centro", tipo: "barrio" },
  { nombre: "Los Vadillos", tipo: "barrio" },
  { nombre: "Río Vena", tipo: "barrio" },
  { nombre: "Los Ríos - Vista Alegre", tipo: "barrio" },
  { nombre: "San Pedro de la Fuente", tipo: "barrio" },
  { nombre: "Fuentecillas", tipo: "barrio" },
  { nombre: "San Juan Bautista", tipo: "barrio" },
  { nombre: "Huelgas - El Pilar", tipo: "barrio" },
  { nombre: "San Julián", tipo: "barrio" },
  { nombre: "El Crucero - San José", tipo: "barrio" },
  { nombre: "Centro Sur", tipo: "barrio" },
  { nombre: "San Pedro y San Felices", tipo: "barrio" },
  { nombre: "Villatoro", tipo: "barrio" },
  { nombre: "Villayuda - La Ventilla", tipo: "barrio" },
  { nombre: "Villalonquéjar (barrio)", tipo: "barrio" },
  { nombre: "Villagonzalo Arenas", tipo: "barrio" },
  { nombre: "Villafría", tipo: "barrio" },
  { nombre: "Cótar", tipo: "barrio" },
  { nombre: "Cortes", tipo: "barrio" },
];

const POLIGONOS_BURGOS: ZonaCiudad[] = [
  { nombre: "Villalonquéjar I", tipo: "poligono" },
  { nombre: "Villalonquéjar II", tipo: "poligono" },
  { nombre: "Villalonquéjar III", tipo: "poligono" },
  { nombre: "Villalonquéjar IV", tipo: "poligono" },
  { nombre: "Burgos Este", tipo: "poligono" },
  { nombre: "Monte de la Abadesa", tipo: "poligono" },
];

const BARRIOS_ARANDA: ZonaCiudad[] = [
  { nombre: "La Aguilera", tipo: "barrio" },
  { nombre: "Costaján", tipo: "barrio" },
  { nombre: "Sinovas", tipo: "barrio" },
  { nombre: "La Calabaza", tipo: "barrio" },
  { nombre: "La Estación", tipo: "barrio" },
  { nombre: "El Polígono", tipo: "barrio" },
  { nombre: "Allendeduero", tipo: "barrio" },
  { nombre: "Tenerías", tipo: "barrio" },
  { nombre: "San Francisco", tipo: "barrio" },
  { nombre: "Zona Centro", tipo: "barrio" },
  { nombre: "Santa Catalina", tipo: "barrio" },
  { nombre: "Ferial-Bañuelos", tipo: "barrio" },
  { nombre: "Las Casitas", tipo: "barrio" },
];

const POLIGONOS_ARANDA: ZonaCiudad[] = [
  { nombre: "Polígono Allendeduero", tipo: "poligono" },
  { nombre: "Prado Marina", tipo: "poligono" },
  { nombre: "Polígono Norte", tipo: "poligono" },
  { nombre: "Carretera de Palencia", tipo: "poligono" },
];

const BARRIOS_MIRANDA: ZonaCiudad[] = [
  { nombre: "Aquende", tipo: "barrio" },
  { nombre: "Allende", tipo: "barrio" },
  { nombre: "Anduva", tipo: "barrio" },
  { nombre: "Barriada de San Juan", tipo: "barrio" },
  { nombre: "Bardauri", tipo: "barrio" },
  { nombre: "Bayas", tipo: "barrio" },
  { nombre: "Ensanche", tipo: "barrio" },
  { nombre: "El Crucero", tipo: "barrio" },
  { nombre: "La Charca", tipo: "barrio" },
  { nombre: "Las Matillas", tipo: "barrio" },
  { nombre: "Los Ángeles", tipo: "barrio" },
  { nombre: "Los Corrales", tipo: "barrio" },
  { nombre: "Valverde de Miranda", tipo: "barrio" },
];

const POLIGONOS_MIRANDA: ZonaCiudad[] = [
  { nombre: "Polígono de Bayas", tipo: "poligono" },
  { nombre: "Ircio", tipo: "poligono" },
];

const BARRIOS_LOGRONO: ZonaCiudad[] = [
  { nombre: "Casco Antiguo", tipo: "barrio" },
  { nombre: "San Antonio", tipo: "barrio" },
  { nombre: "Ciudad de Santiago", tipo: "barrio" },
  { nombre: "El Campillo", tipo: "barrio" },
  { nombre: "Centro", tipo: "barrio" },
  { nombre: "El Carmen", tipo: "barrio" },
  { nombre: "Madre de Dios", tipo: "barrio" },
  { nombre: "San José", tipo: "barrio" },
  { nombre: "Lobete", tipo: "barrio" },
  { nombre: "Los Lirios", tipo: "barrio" },
  { nombre: "Varea", tipo: "barrio" },
  { nombre: "Cascajos", tipo: "barrio" },
  { nombre: "La Estrella", tipo: "barrio" },
  { nombre: "San Adrián", tipo: "barrio" },
  { nombre: "Siete Infantes", tipo: "barrio" },
  { nombre: "Las Gaunas", tipo: "barrio" },
  { nombre: "El Arco", tipo: "barrio" },
  { nombre: "La Cava", tipo: "barrio" },
  { nombre: "Fardachón", tipo: "barrio" },
  { nombre: "Yagüe", tipo: "barrio" },
  { nombre: "El Cortijo", tipo: "barrio" },
  { nombre: "El Cubo", tipo: "barrio" },
  { nombre: "Valdegastea", tipo: "barrio" },
];

const POLIGONOS_LOGRONO: ZonaCiudad[] = [
  { nombre: "Cantabria", tipo: "poligono" },
  { nombre: "Las Cañas", tipo: "poligono" },
  { nombre: "La Portalada", tipo: "poligono" },
];

const BARRIOS_PALENCIA: ZonaCiudad[] = [
  { nombre: "Centro", tipo: "barrio" },
  { nombre: "San Pablo y Santa Marina", tipo: "barrio" },
  { nombre: "San Antonio", tipo: "barrio" },
  { nombre: "El Cristo", tipo: "barrio" },
  { nombre: "Ave María", tipo: "barrio" },
  { nombre: "San Juanillo", tipo: "barrio" },
  { nombre: "Pan y Guindas", tipo: "barrio" },
  { nombre: "Campo de la Juventud", tipo: "barrio" },
  { nombre: "Santiago", tipo: "barrio" },
  { nombre: "Avenida de Madrid", tipo: "barrio" },
  { nombre: "El Carmen", tipo: "barrio" },
  { nombre: "Allende el Río", tipo: "barrio" },
];

const POLIGONOS_PALENCIA: ZonaCiudad[] = [
  { nombre: "Nuestra Señora de los Ángeles", tipo: "poligono" },
  { nombre: "San Antolín", tipo: "poligono" },
  { nombre: "Villalobón", tipo: "poligono" },
  { nombre: "El Poligonillo", tipo: "poligono" },
];

const BARRIOS_SANTANDER: ZonaCiudad[] = [
  { nombre: "Centro", tipo: "barrio" },
  { nombre: "Puertochico", tipo: "barrio" },
  { nombre: "El Sardinero", tipo: "barrio" },
  { nombre: "Tetuán", tipo: "barrio" },
  { nombre: "Castilla-Hermida", tipo: "barrio" },
  { nombre: "Barrio Pesquero", tipo: "barrio" },
  { nombre: "Barrio del Rey", tipo: "barrio" },
  { nombre: "Río de la Pila", tipo: "barrio" },
  { nombre: "Perines", tipo: "barrio" },
  { nombre: "Pronillo", tipo: "barrio" },
  { nombre: "Ciudad Jardín", tipo: "barrio" },
  { nombre: "Grupo San Luis", tipo: "barrio" },
  { nombre: "Grupo San Francisco", tipo: "barrio" },
  { nombre: "Cazoña", tipo: "barrio" },
  { nombre: "La Albericia", tipo: "barrio" },
  { nombre: "El Alisal", tipo: "barrio" },
  { nombre: "Piedras Blancas", tipo: "barrio" },
  { nombre: "Peñacastillo", tipo: "barrio" },
  { nombre: "Nueva Montaña", tipo: "barrio" },
  { nombre: "Adarzo", tipo: "barrio" },
  { nombre: "Camarreal", tipo: "barrio" },
  { nombre: "Lluja", tipo: "barrio" },
  { nombre: "Cajo", tipo: "barrio" },
  { nombre: "Campogiro", tipo: "barrio" },
  { nombre: "La Remonta", tipo: "barrio" },
  { nombre: "Monte", tipo: "barrio" },
  { nombre: "Corbanera", tipo: "barrio" },
  { nombre: "Cueto", tipo: "barrio" },
  { nombre: "Valdenoja", tipo: "barrio" },
  { nombre: "La Maruca", tipo: "barrio" },
  { nombre: "El Mazo", tipo: "barrio" },
  { nombre: "Rostrío", tipo: "barrio" },
  { nombre: "San Román", tipo: "barrio" },
  { nombre: "Virgen del Mar", tipo: "barrio" },
  { nombre: "El Castillo", tipo: "barrio" },
];

const POLIGONOS_SANTANDER: ZonaCiudad[] = [
  { nombre: "Puerto de Santander", tipo: "poligono" },
  { nombre: "Candina", tipo: "poligono" },
  { nombre: "Polígono de la Albericia", tipo: "poligono" },
  { nombre: "El Campón", tipo: "poligono" },
  { nombre: "Polígono Nueva Montaña", tipo: "poligono" },
  { nombre: "Faustino Cavadas", tipo: "poligono" },
  { nombre: "Parayas", tipo: "poligono" },
  { nombre: "Herrera Oria", tipo: "poligono" },
  { nombre: "Elegarcu", tipo: "poligono" },
  { nombre: "Mercasantander", tipo: "poligono" },
  { nombre: "Primero de Mayo", tipo: "poligono" },
  { nombre: "Ciudad del Transportista", tipo: "poligono" },
  { nombre: "Raos", tipo: "poligono" },
];

const BARRIOS_TORRELAVEGA: ZonaCiudad[] = [
  { nombre: "Centro", tipo: "barrio" },
  { nombre: "Covadonga", tipo: "barrio" },
  { nombre: "Ciudad Vergel", tipo: "barrio" },
  { nombre: "Nueva Ciudad", tipo: "barrio" },
  { nombre: "Miravalles", tipo: "barrio" },
  { nombre: "La Inmobiliaria", tipo: "barrio" },
  { nombre: "El Zapatón", tipo: "barrio" },
  { nombre: "Campuzano", tipo: "barrio" },
  { nombre: "Tanos", tipo: "barrio" },
  { nombre: "Sierrapando", tipo: "barrio" },
  { nombre: "Barreda", tipo: "barrio" },
  { nombre: "Ganzo", tipo: "barrio" },
  { nombre: "Duález", tipo: "barrio" },
  { nombre: "Torres", tipo: "barrio" },
  { nombre: "Viérnoles", tipo: "barrio" },
  { nombre: "La Montaña", tipo: "barrio" },
  { nombre: "San Ramón", tipo: "barrio" },
];

const POLIGONOS_TORRELAVEGA: ZonaCiudad[] = [
  { nombre: "Tanos-Viérnoles", tipo: "poligono" },
];

const BARRIOS_CASTRO: ZonaCiudad[] = [
  { nombre: "Casco histórico", tipo: "barrio" },
  { nombre: "Los Marineros", tipo: "barrio" },
  { nombre: "Brazomar", tipo: "barrio" },
  { nombre: "Cotolino", tipo: "barrio" },
  { nombre: "Ostende", tipo: "barrio" },
  { nombre: "Campijo", tipo: "barrio" },
  { nombre: "Allendelagua", tipo: "barrio" },
  { nombre: "Cerdigo", tipo: "barrio" },
  { nombre: "Islares", tipo: "barrio" },
  { nombre: "Lusa", tipo: "barrio" },
  { nombre: "Mioño", tipo: "barrio" },
  { nombre: "Ontón", tipo: "barrio" },
  { nombre: "Oriñón", tipo: "barrio" },
  { nombre: "Otañes", tipo: "barrio" },
  { nombre: "Sámano", tipo: "barrio" },
  { nombre: "Santullán", tipo: "barrio" },
  { nombre: "Sonabia", tipo: "barrio" },
  { nombre: "Talledo", tipo: "barrio" },
];

const POLIGONOS_CASTRO: ZonaCiudad[] = [
  { nombre: "Vallegón", tipo: "poligono" },
  { nombre: "La Tejera", tipo: "poligono" },
];

export const CIUDADES_URBANAS: CiudadUrbana[] = [
  {
    id: "burgos",
    nombre: "Burgos",
    etiqueta: "Burgos (Burgos)",
    zonas: [...BARRIOS_BURGOS, ...POLIGONOS_BURGOS],
  },
  {
    id: "aranda",
    nombre: "Aranda de Duero",
    etiqueta: "Aranda de Duero (Burgos)",
    zonas: [...BARRIOS_ARANDA, ...POLIGONOS_ARANDA],
  },
  {
    id: "miranda",
    nombre: "Miranda de Ebro",
    etiqueta: "Miranda de Ebro (Burgos)",
    zonas: [...BARRIOS_MIRANDA, ...POLIGONOS_MIRANDA],
  },
  {
    id: "logrono",
    nombre: "Logroño",
    etiqueta: "Logroño (La Rioja)",
    zonas: [...BARRIOS_LOGRONO, ...POLIGONOS_LOGRONO],
  },
  {
    id: "palencia",
    nombre: "Palencia",
    etiqueta: "Palencia (Palencia)",
    zonas: [...BARRIOS_PALENCIA, ...POLIGONOS_PALENCIA],
  },
  {
    id: "santander",
    nombre: "Santander",
    etiqueta: "Santander (Cantabria)",
    zonas: [...BARRIOS_SANTANDER, ...POLIGONOS_SANTANDER],
  },
  {
    id: "torrelavega",
    nombre: "Torrelavega",
    etiqueta: "Torrelavega (Cantabria)",
    zonas: [...BARRIOS_TORRELAVEGA, ...POLIGONOS_TORRELAVEGA],
  },
  {
    id: "castro",
    nombre: "Castro-Urdiales",
    etiqueta: "Castro-Urdiales (Cantabria)",
    zonas: [...BARRIOS_CASTRO, ...POLIGONOS_CASTRO],
  },
];

export function ciudadUrbana(id: string): CiudadUrbana | null {
  const limpio = id.trim().toLowerCase();
  return CIUDADES_URBANAS.find((c) => c.id === limpio) ?? null;
}

export function etiquetaZona(zona: ZonaCiudad): string {
  if (zona.tipo !== "poligono") return zona.nombre;
  const ya = zona.nombre.toLocaleLowerCase("es");
  if (ya.startsWith("polígono") || ya.startsWith("poligono")) return zona.nombre;
  return `Polígono · ${zona.nombre}`;
}

export function zonaDeCiudad(
  ciudad: CiudadUrbana,
  nombre: string
): ZonaCiudad | null {
  const pedido = nombre.trim();
  return ciudad.zonas.find((z) => z.nombre === pedido) ?? null;
}

export function tituloTrayectoCiudad(ruta: {
  origen: string;
  destino: string;
  en_ciudad?: boolean | null;
  barrio_origen?: string | null;
  barrio_destino?: string | null;
}): string {
  if (ruta.en_ciudad && ruta.barrio_origen && ruta.barrio_destino) {
    return `${ruta.barrio_origen} → ${ruta.barrio_destino}`;
  }
  return "";
}
