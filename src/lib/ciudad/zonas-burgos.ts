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
 * Vitoria-Gasteiz: 28 barrios del plano municipal (sin las tres «zonas rurales»,
 * porque los pueblos van con su nombre) y los núcleos del Ayuntamiento.
 * Ocho polígonos de la página de industria del Ayuntamiento.
 * Pamplona: listado de barrios del Ayuntamiento y los nombres que usan
 * los concejales de barrio. Polígonos Landaben, Agustinos y los de al lado
 * que la gente usa con Pamplona: Cordovilla, Morea, Talluntxe,
 * Ciudad del Transporte y Mugazuri.
 * Tudela: barrios que recoge el plan general (el Casco Viejo va aparte,
 * como núcleo histórico). Queiles es el mismo sitio que La Albea.
 * Polígonos de la página de industria del Ayuntamiento: Municipal,
 * Las Labradas, Montes de Cierzo, La Serna, Centro de Servicios,
 * La Barrena y AA4. El Área Logística sigue sin hacerse: es La Serna 2.
 * León: barrios de la página de concejales de barrio del Ayuntamiento.
 * Oteruelo es Oteruelo de la Valdoncina. Polígono 58 y Polígono 10
 * son barrios de viviendas. Polígonos: Onzonilla (el Polígono Industrial
 * de León) y el Parque Tecnológico de León.
 * San Andrés del Rabanedo: pueblos y barrios de la página del Ayuntamiento.
 * Polígono industrial de Trobajo del Camino.
 * Ponferrada: núcleos del padrón del Ayuntamiento, más Casco Antiguo,
 * La Rosaleda, Puente Boeza y San Antonio. Polígonos del municipio:
 * La Llanada, el del Bierzo, Cantalobos, La Martina, La Barca, Dehesas,
 * Montearenas, Los Poulones y El Bayo.
 * Soria: asociaciones de vecinos que subvenciona el Ayuntamiento,
 * incluidos los cuatro barrios rurales. La Barriada (Yagüe).
 * Polígonos Las Casas y Valcorba.
 * Segovia: los 19 barrios de los presupuestos participativos del Ayuntamiento.
 * Polígonos El Cerro, Hontoria y El Acueducto.
 * Valladolid: las zonas estadísticas del Ayuntamiento.
 * Polígonos Argales, San Cristóbal, Carrascal y Berrocal.
 * Zamora: barrios del registro municipal de asociaciones de vecinos.
 * Polígonos Los Llanos, La Hiniesta y La Hiniesta Ampliación.
 * Zaragoza: juntas municipales, los cuatro barrios del Distrito Sur
 * y los catorce barrios rurales. Polígonos del listado municipal.
 * Gijón: barrios y parroquias del reglamento de distritos.
 * Polígonos del listado de áreas industriales del Ayuntamiento.
 * Lugo: barrios que nombra el Ayuntamiento y las 54 parroquias del Concello.
 * Polígonos O Ceao y As Gándaras.
 * Ourense: barrios de los centros cívicos y de las líneas de bus del Concello,
 * y las parroquias del padrón. Polígonos Quintela y Seixalbo.
 * Pontevedra: barrios de la estrategia urbana del Concello y las parroquias del padrón.
 * Polígonos O Campiño y O Vao.
 * Vigo: barrios del núcleo urbano y parroquias del plan general del Concello.
 * Polígonos Balaídos y el parque tecnológico de Valadares.
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

const BARRIOS_VITORIA: ZonaCiudad[] = [
  { nombre: "Casco Viejo", tipo: "barrio" },
  { nombre: "Ensanche", tipo: "barrio" },
  { nombre: "Lovaina", tipo: "barrio" },
  { nombre: "Coronación", tipo: "barrio" },
  { nombre: "El Pilar", tipo: "barrio" },
  { nombre: "Gazalbide", tipo: "barrio" },
  { nombre: "Txagorritxu", tipo: "barrio" },
  { nombre: "San Martín", tipo: "barrio" },
  { nombre: "Zaramaga", tipo: "barrio" },
  { nombre: "Anglo-Vasco", tipo: "barrio" },
  { nombre: "Arantzabela", tipo: "barrio" },
  { nombre: "Santiago", tipo: "barrio" },
  { nombre: "Aranbizkarra", tipo: "barrio" },
  { nombre: "Arana", tipo: "barrio" },
  { nombre: "Desamparados", tipo: "barrio" },
  { nombre: "Judimendi", tipo: "barrio" },
  { nombre: "Santa Lucía", tipo: "barrio" },
  { nombre: "Adurtza", tipo: "barrio" },
  { nombre: "San Cristóbal", tipo: "barrio" },
  { nombre: "Mendizorrotza", tipo: "barrio" },
  { nombre: "Ariznabarra", tipo: "barrio" },
  { nombre: "Ali", tipo: "barrio" },
  { nombre: "Sansomendi", tipo: "barrio" },
  { nombre: "Arriaga-Lakua", tipo: "barrio" },
  { nombre: "Abetxuko", tipo: "barrio" },
  { nombre: "Zabalgana", tipo: "barrio" },
  { nombre: "Salburua", tipo: "barrio" },
  { nombre: "Goikolarra", tipo: "barrio" },
  { nombre: "Aberasturi", tipo: "barrio" },
  { nombre: "Andollu", tipo: "barrio" },
  { nombre: "Arcaute", tipo: "barrio" },
  { nombre: "Arkaia", tipo: "barrio" },
  { nombre: "Argandoña", tipo: "barrio" },
  { nombre: "Askartza", tipo: "barrio" },
  { nombre: "Betoño", tipo: "barrio" },
  { nombre: "Bolívar", tipo: "barrio" },
  { nombre: "Elorriaga", tipo: "barrio" },
  { nombre: "Gámiz", tipo: "barrio" },
  { nombre: "Ilarratza", tipo: "barrio" },
  { nombre: "Jungitu", tipo: "barrio" },
  { nombre: "Lubiano", tipo: "barrio" },
  { nombre: "Matauko", tipo: "barrio" },
  { nombre: "Oreitia", tipo: "barrio" },
  { nombre: "Otazu", tipo: "barrio" },
  { nombre: "Ullibarri-Arrazua", tipo: "barrio" },
  { nombre: "Ullibarri de los Olleros", tipo: "barrio" },
  { nombre: "Villafranca", tipo: "barrio" },
  { nombre: "Zerio", tipo: "barrio" },
  { nombre: "Aretxabaleta", tipo: "barrio" },
  { nombre: "Ariñez", tipo: "barrio" },
  { nombre: "Armentia", tipo: "barrio" },
  { nombre: "Berrostegieta", tipo: "barrio" },
  { nombre: "Castillo", tipo: "barrio" },
  { nombre: "Eskibel", tipo: "barrio" },
  { nombre: "Gardelegi", tipo: "barrio" },
  { nombre: "Gometxa", tipo: "barrio" },
  { nombre: "Lasarte", tipo: "barrio" },
  { nombre: "Lermanda", tipo: "barrio" },
  { nombre: "Margarita", tipo: "barrio" },
  { nombre: "Mendiola", tipo: "barrio" },
  { nombre: "Monasterioguren", tipo: "barrio" },
  { nombre: "Subijana de Álava", tipo: "barrio" },
  { nombre: "Zuazo de Vitoria", tipo: "barrio" },
  { nombre: "Zumeltzu", tipo: "barrio" },
  { nombre: "Amarita", tipo: "barrio" },
  { nombre: "Antezana", tipo: "barrio" },
  { nombre: "Arangiz", tipo: "barrio" },
  { nombre: "Artatza-Foronda", tipo: "barrio" },
  { nombre: "Asteguieta", tipo: "barrio" },
  { nombre: "Crispijana", tipo: "barrio" },
  { nombre: "Estarrona", tipo: "barrio" },
  { nombre: "Foronda", tipo: "barrio" },
  { nombre: "Gamarra Mayor", tipo: "barrio" },
  { nombre: "Gamarra Menor", tipo: "barrio" },
  { nombre: "Gobeo", tipo: "barrio" },
  { nombre: "Gereña", tipo: "barrio" },
  { nombre: "Hueto Abajo", tipo: "barrio" },
  { nombre: "Hueto Arriba", tipo: "barrio" },
  { nombre: "Legarda", tipo: "barrio" },
  { nombre: "Lopidana", tipo: "barrio" },
  { nombre: "Mandojana", tipo: "barrio" },
  { nombre: "Martioda", tipo: "barrio" },
  { nombre: "Mendiguren", tipo: "barrio" },
  { nombre: "Mendoza", tipo: "barrio" },
  { nombre: "Miñano Mayor", tipo: "barrio" },
  { nombre: "Miñano Menor", tipo: "barrio" },
  { nombre: "Retana", tipo: "barrio" },
  { nombre: "Ullibarri-Viña", tipo: "barrio" },
  { nombre: "Yurre", tipo: "barrio" },
];

const POLIGONOS_VITORIA: ZonaCiudad[] = [
  { nombre: "Ali-Gobeo", tipo: "poligono" },
  { nombre: "Ansoleta-Uritiasolo-C.Palacios", tipo: "poligono" },
  { nombre: "Polígono Armentia", tipo: "poligono" },
  { nombre: "Arriaga", tipo: "poligono" },
  { nombre: "Betoño-Larragana", tipo: "poligono" },
  { nombre: "Gamarra-Betoño", tipo: "poligono" },
  { nombre: "Jundiz", tipo: "poligono" },
  { nombre: "Parque Tecnológico de Álava", tipo: "poligono" },
];

const BARRIOS_PAMPLONA: ZonaCiudad[] = [
  { nombre: "Abejeras-Azpilagaña", tipo: "barrio" },
  { nombre: "Beloso", tipo: "barrio" },
  { nombre: "Buztintxuri", tipo: "barrio" },
  { nombre: "Casco Viejo", tipo: "barrio" },
  { nombre: "Erripagaña", tipo: "barrio" },
  { nombre: "Etxabakoitz", tipo: "barrio" },
  { nombre: "Ezkaba", tipo: "barrio" },
  { nombre: "Ensanche I", tipo: "barrio" },
  { nombre: "Ensanche II", tipo: "barrio" },
  { nombre: "Iturrama", tipo: "barrio" },
  { nombre: "Lezkairu", tipo: "barrio" },
  { nombre: "Ermitagaña", tipo: "barrio" },
  { nombre: "Mendebaldea", tipo: "barrio" },
  { nombre: "Mendillorri", tipo: "barrio" },
  { nombre: "Milagrosa", tipo: "barrio" },
  { nombre: "Rochapea", tipo: "barrio" },
  { nombre: "San Jorge", tipo: "barrio" },
  { nombre: "San Juan", tipo: "barrio" },
  { nombre: "Txantrea", tipo: "barrio" },
  { nombre: "Arrosadía", tipo: "barrio" },
  { nombre: "Bidezar", tipo: "barrio" },
  { nombre: "Santa María la Real", tipo: "barrio" },
];

const POLIGONOS_PAMPLONA: ZonaCiudad[] = [
  { nombre: "Landaben", tipo: "poligono" },
  { nombre: "Agustinos", tipo: "poligono" },
  { nombre: "Cordovilla", tipo: "poligono" },
  { nombre: "Morea", tipo: "poligono" },
  { nombre: "Talluntxe", tipo: "poligono" },
  { nombre: "Ciudad del Transporte", tipo: "poligono" },
  { nombre: "Mugazuri", tipo: "poligono" },
];

const BARRIOS_TUDELA: ZonaCiudad[] = [
  { nombre: "Casco Viejo", tipo: "barrio" },
  { nombre: "Azucarera", tipo: "barrio" },
  { nombre: "Centro", tipo: "barrio" },
  { nombre: "De la Música", tipo: "barrio" },
  { nombre: "Elola", tipo: "barrio" },
  { nombre: "Gardachales", tipo: "barrio" },
  { nombre: "Griseras", tipo: "barrio" },
  { nombre: "Instituto", tipo: "barrio" },
  { nombre: "Lourdes", tipo: "barrio" },
  { nombre: "Queiles", tipo: "barrio" },
  { nombre: "Velilla", tipo: "barrio" },
  { nombre: "Virgen de la Cabeza", tipo: "barrio" },
];

const POLIGONOS_TUDELA: ZonaCiudad[] = [
  { nombre: "Polígono Industrial Municipal", tipo: "poligono" },
  { nombre: "Las Labradas", tipo: "poligono" },
  { nombre: "Montes de Cierzo", tipo: "poligono" },
  { nombre: "La Serna", tipo: "poligono" },
  { nombre: "Centro de Servicios", tipo: "poligono" },
  { nombre: "La Barrena", tipo: "poligono" },
  { nombre: "AA4", tipo: "poligono" },
];

const BARRIOS_LEON: ZonaCiudad[] = [
  { nombre: "La Palomera", tipo: "barrio" },
  { nombre: "San Lorenzo", tipo: "barrio" },
  { nombre: "Mariano Andrés", tipo: "barrio" },
  { nombre: "Ventas", tipo: "barrio" },
  { nombre: "San Pedro", tipo: "barrio" },
  { nombre: "La Serna", tipo: "barrio" },
  { nombre: "Fernández Ladreda", tipo: "barrio" },
  { nombre: "La Lastra", tipo: "barrio" },
  { nombre: "Barrio Húmedo", tipo: "barrio" },
  { nombre: "Santa Marina", tipo: "barrio" },
  { nombre: "Mercado", tipo: "barrio" },
  { nombre: "Polígono 58", tipo: "barrio" },
  { nombre: "Área 17", tipo: "barrio" },
  { nombre: "El Soto", tipo: "barrio" },
  { nombre: "Trobajo del Cerecedo", tipo: "barrio" },
  { nombre: "Eras de Renueva", tipo: "barrio" },
  { nombre: "Centro", tipo: "barrio" },
  { nombre: "Área 18", tipo: "barrio" },
  { nombre: "Chantría", tipo: "barrio" },
  { nombre: "San Claudio", tipo: "barrio" },
  { nombre: "Crucero", tipo: "barrio" },
  { nombre: "Pinilla", tipo: "barrio" },
  { nombre: "La Vega", tipo: "barrio" },
  { nombre: "Puente Castro", tipo: "barrio" },
  { nombre: "San Mamés", tipo: "barrio" },
  { nombre: "La Inmaculada", tipo: "barrio" },
  { nombre: "Armunia", tipo: "barrio" },
  { nombre: "Polígono 10", tipo: "barrio" },
  { nombre: "El Ejido", tipo: "barrio" },
  { nombre: "Santa Ana", tipo: "barrio" },
  { nombre: "Oteruelo", tipo: "barrio" },
  { nombre: "Cantamilanos", tipo: "barrio" },
  { nombre: "La Asunción", tipo: "barrio" },
  { nombre: "San Esteban", tipo: "barrio" },
];

const POLIGONOS_LEON: ZonaCiudad[] = [
  { nombre: "Onzonilla", tipo: "poligono" },
  { nombre: "Parque Tecnológico de León", tipo: "poligono" },
];

const BARRIOS_SAN_ANDRES: ZonaCiudad[] = [
  { nombre: "Trobajo del Camino", tipo: "barrio" },
  { nombre: "San Andrés del Rabanedo", tipo: "barrio" },
  { nombre: "Villabalter", tipo: "barrio" },
  { nombre: "Ferral del Bernesga", tipo: "barrio" },
  { nombre: "Pinilla", tipo: "barrio" },
  { nombre: "Paraíso-Cantinas", tipo: "barrio" },
  { nombre: "La Sal", tipo: "barrio" },
];

const POLIGONOS_SAN_ANDRES: ZonaCiudad[] = [
  { nombre: "Polígono Industrial de Trobajo", tipo: "poligono" },
];

const BARRIOS_PONFERRADA: ZonaCiudad[] = [
  { nombre: "Casco Antiguo", tipo: "barrio" },
  { nombre: "La Rosaleda", tipo: "barrio" },
  { nombre: "Puente Boeza", tipo: "barrio" },
  { nombre: "San Antonio", tipo: "barrio" },
  { nombre: "Compostilla", tipo: "barrio" },
  { nombre: "Cuatrovientos", tipo: "barrio" },
  { nombre: "La Placa", tipo: "barrio" },
  { nombre: "Flores del Sil", tipo: "barrio" },
  { nombre: "La Martina", tipo: "barrio" },
  { nombre: "Bárcena del Bierzo", tipo: "barrio" },
  { nombre: "Bouzas", tipo: "barrio" },
  { nombre: "Campo", tipo: "barrio" },
  { nombre: "Urbanización Patricia", tipo: "barrio" },
  { nombre: "Carracedo de Compludo", tipo: "barrio" },
  { nombre: "Columbrianos", tipo: "barrio" },
  { nombre: "Compludo", tipo: "barrio" },
  { nombre: "Dehesas", tipo: "barrio" },
  { nombre: "Espinoso de Compludo", tipo: "barrio" },
  { nombre: "Fuentesnuevas", tipo: "barrio" },
  { nombre: "Lombillo de los Barrios", tipo: "barrio" },
  { nombre: "Manzanedo de Valdueza", tipo: "barrio" },
  { nombre: "Montes de Valdueza", tipo: "barrio" },
  { nombre: "Otero", tipo: "barrio" },
  { nombre: "Ozuela", tipo: "barrio" },
  { nombre: "Palacios de Compludo", tipo: "barrio" },
  { nombre: "Peñalba de Santiago", tipo: "barrio" },
  { nombre: "Rimor", tipo: "barrio" },
  { nombre: "Salas de los Barrios", tipo: "barrio" },
  { nombre: "San Andrés de Montejos", tipo: "barrio" },
  { nombre: "San Clemente de Valdueza", tipo: "barrio" },
  { nombre: "San Cristóbal de Valdueza", tipo: "barrio" },
  { nombre: "San Adrián de Valdueza", tipo: "barrio" },
  { nombre: "San Esteban de Valdueza", tipo: "barrio" },
  { nombre: "San Lorenzo", tipo: "barrio" },
  { nombre: "Santo Tomás de las Ollas", tipo: "barrio" },
  { nombre: "Toral de Merayo", tipo: "barrio" },
  { nombre: "Valdecañada", tipo: "barrio" },
  { nombre: "Valdefrancos", tipo: "barrio" },
  { nombre: "Villanueva de Valdueza", tipo: "barrio" },
  { nombre: "Villar de los Barrios", tipo: "barrio" },
];

const POLIGONOS_PONFERRADA: ZonaCiudad[] = [
  { nombre: "La Llanada", tipo: "poligono" },
  { nombre: "Polígono Industrial del Bierzo", tipo: "poligono" },
  { nombre: "Cantalobos", tipo: "poligono" },
  { nombre: "Polígono La Martina", tipo: "poligono" },
  { nombre: "La Barca", tipo: "poligono" },
  { nombre: "Polígono Dehesas", tipo: "poligono" },
  { nombre: "Montearenas", tipo: "poligono" },
  { nombre: "Los Poulones", tipo: "poligono" },
  { nombre: "El Bayo", tipo: "poligono" },
];

const BARRIOS_SORIA: ZonaCiudad[] = [
  { nombre: "Casco Viejo", tipo: "barrio" },
  { nombre: "El Calaverón", tipo: "barrio" },
  { nombre: "San Pedro", tipo: "barrio" },
  { nombre: "La Barriada (Yagüe)", tipo: "barrio" },
  { nombre: "Santa Bárbara", tipo: "barrio" },
  { nombre: "Los Pajaritos", tipo: "barrio" },
  { nombre: "Los Royales", tipo: "barrio" },
  { nombre: "Las Casas", tipo: "barrio" },
  { nombre: "Toledillo", tipo: "barrio" },
  { nombre: "Pedrajas", tipo: "barrio" },
  { nombre: "Oteruelos", tipo: "barrio" },
];

const POLIGONOS_SORIA: ZonaCiudad[] = [
  { nombre: "Polígono Industrial Las Casas", tipo: "poligono" },
  { nombre: "Valcorba", tipo: "poligono" },
];

const BARRIOS_SEGOVIA: ZonaCiudad[] = [
  { nombre: "Casco Histórico", tipo: "barrio" },
  { nombre: "El Salvador", tipo: "barrio" },
  { nombre: "San Millán", tipo: "barrio" },
  { nombre: "San Lorenzo", tipo: "barrio" },
  { nombre: "San Marcos", tipo: "barrio" },
  { nombre: "San José", tipo: "barrio" },
  { nombre: "Santo Tomás", tipo: "barrio" },
  { nombre: "Santa Eulalia", tipo: "barrio" },
  { nombre: "Cristo del Mercado", tipo: "barrio" },
  { nombre: "La Albuera", tipo: "barrio" },
  { nombre: "Nueva Segovia", tipo: "barrio" },
  { nombre: "Puente de Hierro", tipo: "barrio" },
  { nombre: "Zamarramala", tipo: "barrio" },
  { nombre: "Hontoria", tipo: "barrio" },
  { nombre: "Madrona", tipo: "barrio" },
  { nombre: "Fuentemilanos", tipo: "barrio" },
  { nombre: "Revenga", tipo: "barrio" },
  { nombre: "Torredondo", tipo: "barrio" },
  { nombre: "Perogordo", tipo: "barrio" },
];

const POLIGONOS_SEGOVIA: ZonaCiudad[] = [
  { nombre: "El Cerro", tipo: "poligono" },
  { nombre: "Polígono Industrial de Hontoria", tipo: "poligono" },
  { nombre: "El Acueducto", tipo: "poligono" },
];

const BARRIOS_VALLADOLID: ZonaCiudad[] = [
  { nombre: "Centro", tipo: "barrio" },
  { nombre: "Caño Argales", tipo: "barrio" },
  { nombre: "Universidad", tipo: "barrio" },
  { nombre: "San Pablo", tipo: "barrio" },
  { nombre: "San Nicolás", tipo: "barrio" },
  { nombre: "San Miguel", tipo: "barrio" },
  { nombre: "Circular", tipo: "barrio" },
  { nombre: "San Juan", tipo: "barrio" },
  { nombre: "San Juan II", tipo: "barrio" },
  { nombre: "Vadillos", tipo: "barrio" },
  { nombre: "Batallas", tipo: "barrio" },
  { nombre: "Hospital", tipo: "barrio" },
  { nombre: "Rondilla", tipo: "barrio" },
  { nombre: "Santa Clara", tipo: "barrio" },
  { nombre: "Huerta del Rey (Alta)", tipo: "barrio" },
  { nombre: "Huerta del Rey (Baja)", tipo: "barrio" },
  { nombre: "Huerta del Rey (Media)", tipo: "barrio" },
  { nombre: "Gavilla", tipo: "barrio" },
  { nombre: "Paseo Zorrilla (Bajo)", tipo: "barrio" },
  { nombre: "Campo Grande", tipo: "barrio" },
  { nombre: "Pajarillos Bajos", tipo: "barrio" },
  { nombre: "Pilarica", tipo: "barrio" },
  { nombre: "Belén", tipo: "barrio" },
  { nombre: "San Pedro Regalado", tipo: "barrio" },
  { nombre: "Barrio España", tipo: "barrio" },
  { nombre: "Avenida de Burgos-Canal de Castilla", tipo: "barrio" },
  { nombre: "Girón", tipo: "barrio" },
  { nombre: "Insonusa", tipo: "barrio" },
  { nombre: "Parquesol", tipo: "barrio" },
  { nombre: "Arturo Eyríes (Alto)", tipo: "barrio" },
  { nombre: "Arturo Eyríes (Bajo)", tipo: "barrio" },
  {
    nombre: "Las Villas-Cañada Puente Duero-Covaresa-Parque Alameda-Paula López",
    tipo: "barrio",
  },
  { nombre: "La Rubia", tipo: "barrio" },
  { nombre: "Arturo León", tipo: "barrio" },
  { nombre: "Cuatro de Marzo", tipo: "barrio" },
  { nombre: "Paseo de Zorrilla (Alto)", tipo: "barrio" },
  { nombre: "Barriada de la Guardia Civil", tipo: "barrio" },
  { nombre: "Camino de la Esperanza", tipo: "barrio" },
  { nombre: "Delicias", tipo: "barrio" },
  { nombre: "Caamaño-Las Viudas", tipo: "barrio" },
  { nombre: "Páramo San Isidro-Poblado Esperanza", tipo: "barrio" },
  { nombre: "Pajarillos Altos", tipo: "barrio" },
  { nombre: "Las Flores", tipo: "barrio" },
  { nombre: "La Overuela-Navabuena", tipo: "barrio" },
  { nombre: "El Pinar de Antequera", tipo: "barrio" },
  { nombre: "Puente Duero", tipo: "barrio" },
];

const POLIGONOS_VALLADOLID: ZonaCiudad[] = [
  { nombre: "Polígono de Argales", tipo: "poligono" },
  { nombre: "San Cristóbal", tipo: "poligono" },
  { nombre: "Carrascal", tipo: "poligono" },
  { nombre: "Berrocal", tipo: "poligono" },
];

const BARRIOS_ZAMORA: ZonaCiudad[] = [
  { nombre: "Casco Antiguo", tipo: "barrio" },
  { nombre: "Barrios Bajos-La Horta", tipo: "barrio" },
  { nombre: "Cabañales", tipo: "barrio" },
  { nombre: "Olivares", tipo: "barrio" },
  { nombre: "San Isidro", tipo: "barrio" },
  { nombre: "Espíritu Santo", tipo: "barrio" },
  { nombre: "Obelisco", tipo: "barrio" },
  { nombre: "Pinilla", tipo: "barrio" },
  { nombre: "San Frontis", tipo: "barrio" },
  { nombre: "Carrascal", tipo: "barrio" },
  { nombre: "San José Obrero", tipo: "barrio" },
  { nombre: "San Lázaro", tipo: "barrio" },
  { nombre: "Valorio", tipo: "barrio" },
  { nombre: "Villagodio", tipo: "barrio" },
  { nombre: "La Lana", tipo: "barrio" },
  { nombre: "Pantoja", tipo: "barrio" },
  { nombre: "Las Viñas", tipo: "barrio" },
  { nombre: "Los Bloques", tipo: "barrio" },
  { nombre: "Los Bloques Ministerios", tipo: "barrio" },
  { nombre: "San Lorenzo", tipo: "barrio" },
  { nombre: "Ciudad Jardín", tipo: "barrio" },
  { nombre: "Barriada de Asturias", tipo: "barrio" },
  { nombre: "La Alberca", tipo: "barrio" },
  { nombre: "La Villarina", tipo: "barrio" },
  { nombre: "Los Arenales", tipo: "barrio" },
  { nombre: "Vista Alegre", tipo: "barrio" },
  { nombre: "Alto de los Curas", tipo: "barrio" },
  { nombre: "Tres Cruces", tipo: "barrio" },
  { nombre: "San Blas", tipo: "barrio" },
  { nombre: "Peña Trevinca", tipo: "barrio" },
];

const POLIGONOS_ZAMORA: ZonaCiudad[] = [
  { nombre: "Los Llanos", tipo: "poligono" },
  { nombre: "La Hiniesta", tipo: "poligono" },
  { nombre: "La Hiniesta Ampliación", tipo: "poligono" },
];

const BARRIOS_ZARAGOZA: ZonaCiudad[] = [
  { nombre: "Casco Histórico", tipo: "barrio" },
  { nombre: "Centro", tipo: "barrio" },
  { nombre: "Delicias", tipo: "barrio" },
  { nombre: "Universidad", tipo: "barrio" },
  { nombre: "San José", tipo: "barrio" },
  { nombre: "Las Fuentes", tipo: "barrio" },
  { nombre: "La Almozara", tipo: "barrio" },
  { nombre: "Oliver-Valdefierro", tipo: "barrio" },
  { nombre: "Torrero-La Paz", tipo: "barrio" },
  { nombre: "El Rabal", tipo: "barrio" },
  { nombre: "Actur-Rey Fernando", tipo: "barrio" },
  { nombre: "Casablanca", tipo: "barrio" },
  { nombre: "Santa Isabel", tipo: "barrio" },
  { nombre: "Miralbueno", tipo: "barrio" },
  { nombre: "Sur", tipo: "barrio" },
  { nombre: "Valdespartera", tipo: "barrio" },
  { nombre: "Montecanal", tipo: "barrio" },
  { nombre: "Rosales del Canal", tipo: "barrio" },
  { nombre: "Arcosur", tipo: "barrio" },
  { nombre: "Alfocea", tipo: "barrio" },
  { nombre: "Casetas", tipo: "barrio" },
  { nombre: "Garrapinillos", tipo: "barrio" },
  { nombre: "Juslibol", tipo: "barrio" },
  { nombre: "La Cartuja Baja", tipo: "barrio" },
  { nombre: "Montañana", tipo: "barrio" },
  { nombre: "Monzalbarba", tipo: "barrio" },
  { nombre: "Movera", tipo: "barrio" },
  { nombre: "Peñaflor", tipo: "barrio" },
  { nombre: "San Gregorio", tipo: "barrio" },
  { nombre: "San Juan de Mozarrifar", tipo: "barrio" },
  { nombre: "Torrecilla de Valmadrid", tipo: "barrio" },
  { nombre: "Venta del Olivar", tipo: "barrio" },
  { nombre: "Villarrapa", tipo: "barrio" },
];

const POLIGONOS_ZARAGOZA: ZonaCiudad[] = [
  { nombre: "Polígono Malpica", tipo: "poligono" },
  { nombre: "Cogullada", tipo: "poligono" },
  { nombre: "PLAZA", tipo: "poligono" },
  { nombre: "Mercazaragoza", tipo: "poligono" },
  { nombre: "Ciudad del Transporte", tipo: "poligono" },
  { nombre: "Argualas", tipo: "poligono" },
  { nombre: "Parque Tecnológico de Reciclado López Soriano", tipo: "poligono" },
  { nombre: "Alcalde Caballero", tipo: "poligono" },
  { nombre: "Antiguas Naves Jesús Vicente", tipo: "poligono" },
  { nombre: "Dinamiza", tipo: "poligono" },
  { nombre: "El Pilar", tipo: "poligono" },
  { nombre: "Empresarium", tipo: "poligono" },
  { nombre: "Europa I", tipo: "poligono" },
  { nombre: "Europa II", tipo: "poligono" },
  { nombre: "Insider", tipo: "poligono" },
  { nombre: "La Unión I", tipo: "poligono" },
  { nombre: "La Unión II", tipo: "poligono" },
  { nombre: "Las Navas", tipo: "poligono" },
  { nombre: "Las Ventas", tipo: "poligono" },
  { nombre: "Los Arcos", tipo: "poligono" },
  { nombre: "Miguel Servet", tipo: "poligono" },
  { nombre: "Miraflores", tipo: "poligono" },
  { nombre: "Molino del Pilar", tipo: "poligono" },
  { nombre: "Montemolín", tipo: "poligono" },
  { nombre: "Puerta Norte", tipo: "poligono" },
  { nombre: "Quattro", tipo: "poligono" },
  { nombre: "San Valero", tipo: "poligono" },
  { nombre: "Tecnum", tipo: "poligono" },
  { nombre: "Valseca", tipo: "poligono" },
  { nombre: "Vista Bella", tipo: "poligono" },
];

const BARRIOS_GIJON: ZonaCiudad[] = [
  { nombre: "El Centro", tipo: "barrio" },
  { nombre: "Cimavilla", tipo: "barrio" },
  { nombre: "Laviada", tipo: "barrio" },
  { nombre: "L'Arena", tipo: "barrio" },
  { nombre: "El Coto", tipo: "barrio" },
  { nombre: "El Bibio-Parque", tipo: "barrio" },
  { nombre: "Les Mestes", tipo: "barrio" },
  { nombre: "Viesques", tipo: "barrio" },
  { nombre: "Ceares (Ciares)", tipo: "barrio" },
  { nombre: "El Llano", tipo: "barrio" },
  { nombre: "Pumarín", tipo: "barrio" },
  { nombre: "Montevil", tipo: "barrio" },
  { nombre: "Contrueces", tipo: "barrio" },
  { nombre: "El Polígono", tipo: "barrio" },
  { nombre: "Nuevo Gijón (La Peral)", tipo: "barrio" },
  { nombre: "Santa Bárbara", tipo: "barrio" },
  { nombre: "Perchera-La Braña", tipo: "barrio" },
  { nombre: "Roces", tipo: "barrio" },
  { nombre: "Nuevo Roces", tipo: "barrio" },
  { nombre: "La Calzada", tipo: "barrio" },
  { nombre: "Jove (Xove)", tipo: "barrio" },
  { nombre: "Tremañes", tipo: "barrio" },
  { nombre: "El Natahoyo", tipo: "barrio" },
  { nombre: "Moreda", tipo: "barrio" },
  { nombre: "Cabueñes", tipo: "barrio" },
  { nombre: "Caldones", tipo: "barrio" },
  { nombre: "Castiello Bernueces", tipo: "barrio" },
  { nombre: "Deva", tipo: "barrio" },
  { nombre: "Fano", tipo: "barrio" },
  { nombre: "Fresno", tipo: "barrio" },
  { nombre: "Granda", tipo: "barrio" },
  { nombre: "L'Abadía Cenero", tipo: "barrio" },
  { nombre: "La Pedrera", tipo: "barrio" },
  { nombre: "Leorio (Llorio)", tipo: "barrio" },
  { nombre: "Llavandera", tipo: "barrio" },
  { nombre: "Porceyo", tipo: "barrio" },
  { nombre: "Puao", tipo: "barrio" },
  { nombre: "Ruedes", tipo: "barrio" },
  { nombre: "Samartín de Güerces", tipo: "barrio" },
  { nombre: "San Andrés de los Tacones", tipo: "barrio" },
  { nombre: "Santurio", tipo: "barrio" },
  { nombre: "Serín", tipo: "barrio" },
  { nombre: "Somió", tipo: "barrio" },
  { nombre: "Tremañes (sur)", tipo: "barrio" },
  { nombre: "Valdornón", tipo: "barrio" },
  { nombre: "Vega", tipo: "barrio" },
  { nombre: "Veriña", tipo: "barrio" },
];

const POLIGONOS_GIJON: ZonaCiudad[] = [
  { nombre: "Bankunión I", tipo: "poligono" },
  { nombre: "Bankunión 2", tipo: "poligono" },
  { nombre: "Bankunión 2B", tipo: "poligono" },
  { nombre: "Somonte 1", tipo: "poligono" },
  { nombre: "Somonte 2", tipo: "poligono" },
  { nombre: "Polígono de La Calzada", tipo: "poligono" },
  { nombre: "La Juvería", tipo: "poligono" },
  { nombre: "La Juvería 2", tipo: "poligono" },
  { nombre: "La Peñona", tipo: "poligono" },
  { nombre: "Maximino Vega", tipo: "poligono" },
  { nombre: "Mora Garay y Balagón", tipo: "poligono" },
  { nombre: "Promosa", tipo: "poligono" },
  { nombre: "Roces-Porceyo", tipo: "poligono" },
  { nombre: "Roces-Puente Seco", tipo: "poligono" },
  { nombre: "Roces 1B", tipo: "poligono" },
  { nombre: "Roces 2", tipo: "poligono" },
  { nombre: "Roces 3", tipo: "poligono" },
  { nombre: "Roces 4", tipo: "poligono" },
  { nombre: "Roces 5", tipo: "poligono" },
  { nombre: "Roces I-12", tipo: "poligono" },
  { nombre: "Roces I-13", tipo: "poligono" },
  { nombre: "Roces I-14", tipo: "poligono" },
  { nombre: "Polígono La Vega", tipo: "poligono" },
  { nombre: "Lloreda", tipo: "poligono" },
  { nombre: "Los Campones", tipo: "poligono" },
  { nombre: "Parque Científico Tecnológico", tipo: "poligono" },
];

const BARRIOS_LUGO: ZonaCiudad[] = [
  { nombre: "Recinto amurallado", tipo: "barrio" },
  { nombre: "San Roque", tipo: "barrio" },
  { nombre: "Recatelo", tipo: "barrio" },
  { nombre: "A Tinería", tipo: "barrio" },
  { nombre: "O Carme", tipo: "barrio" },
  { nombre: "A Cheda", tipo: "barrio" },
  { nombre: "A Ponte", tipo: "barrio" },
  { nombre: "Fonte dos Ranchos", tipo: "barrio" },
  { nombre: "A Tolda", tipo: "barrio" },
  { nombre: "Acea de Olga", tipo: "barrio" },
  { nombre: "Fingoi", tipo: "barrio" },
  { nombre: "A Milagrosa", tipo: "barrio" },
  { nombre: "Feijoo", tipo: "barrio" },
  { nombre: "A Piringalla", tipo: "barrio" },
  { nombre: "Albeiros", tipo: "barrio" },
  { nombre: "Paradai", tipo: "barrio" },
  { nombre: "As Fontiñas", tipo: "barrio" },
  { nombre: "A Chanca", tipo: "barrio" },
  { nombre: "Sagrado Corazón", tipo: "barrio" },
  { nombre: "As Gándaras", tipo: "barrio" },
  { nombre: "Galegos", tipo: "barrio" },
  { nombre: "Xuíz", tipo: "barrio" },
  { nombre: "Montirón", tipo: "barrio" },
  { nombre: "Garabolos", tipo: "barrio" },
  { nombre: "A Residencia", tipo: "barrio" },
  { nombre: "Abella", tipo: "barrio" },
  { nombre: "Adai (Santa María Madanela)", tipo: "barrio" },
  { nombre: "Santa María Alta (Santa María)", tipo: "barrio" },
  { nombre: "Alto (San Xoán)", tipo: "barrio" },
  { nombre: "Anxos (San Mamede)", tipo: "barrio" },
  { nombre: "Bacurín (San Miguel)", tipo: "barrio" },
  { nombre: "Bascuas (Santa María)", tipo: "barrio" },
  { nombre: "Bazar (San Remixio)", tipo: "barrio" },
  { nombre: "Benade (Santo Estevo)", tipo: "barrio" },
  { nombre: "Bocamaos (San Xiao)", tipo: "barrio" },
  { nombre: "Bóveda (Sta. Eulalia)", tipo: "barrio" },
  { nombre: "Boveda (Sta. María)", tipo: "barrio" },
  { nombre: "Burgo (San Vicente)", tipo: "barrio" },
  { nombre: "Calde (San Pedro)", tipo: "barrio" },
  { nombre: "Camoira (Santo Estevo)", tipo: "barrio" },
  { nombre: "Campo (San Xoan)", tipo: "barrio" },
  { nombre: "Carballido (San Martiño)", tipo: "barrio" },
  { nombre: "Castro (Santo Andre)", tipo: "barrio" },
  { nombre: "Coeo (San Vicente)", tipo: "barrio" },
  { nombre: "Coeses (Santa María Madanela)", tipo: "barrio" },
  { nombre: "Cuiña (Santa Eulalia)", tipo: "barrio" },
  { nombre: "Esperante (Santa Eulalia)", tipo: "barrio" },
  { nombre: "Fixos (Santa Marta)", tipo: "barrio" },
  { nombre: "Gondar (Santa María)", tipo: "barrio" },
  { nombre: "Labio (San Pedro)", tipo: "barrio" },
  { nombre: "Lamas (Santa Eulalia)", tipo: "barrio" },
  { nombre: "Mazoi (Santa Eulalia)", tipo: "barrio" },
  { nombre: "Meilán (Santiago)", tipo: "barrio" },
  { nombre: "Mera (San Pedro)", tipo: "barrio" },
  { nombre: "Monte de Meda (Santa María Madanela)", tipo: "barrio" },
  { nombre: "Muxa (San Salvador)", tipo: "barrio" },
  { nombre: "Ombreiro (San Martiño)", tipo: "barrio" },
  { nombre: "Orbazai (San Miguel)", tipo: "barrio" },
  { nombre: "Outeiro (San Salvador)", tipo: "barrio" },
  { nombre: "Pedreda (San Vicente)", tipo: "barrio" },
  { nombre: "Pena (San Xoán)", tipo: "barrio" },
  { nombre: "Pías (San Vicente)", tipo: "barrio" },
  { nombre: "Piñeiro (San Martiño)", tipo: "barrio" },
  { nombre: "Piúgos (Santiago)", tipo: "barrio" },
  { nombre: "Poutomillos (San Martiño)", tipo: "barrio" },
  { nombre: "Progalo (Santiago)", tipo: "barrio" },
  { nombre: "Recimil (San Lourenzo)", tipo: "barrio" },
  { nombre: "Ribas de Miño (San Mamede)", tipo: "barrio" },
  { nombre: "Romean (San Pedro)", tipo: "barrio" },
  { nombre: "Rubias (San Xiao)", tipo: "barrio" },
  { nombre: "Saa (Santiago)", tipo: "barrio" },
  { nombre: "Santa Cristina de San Romao (Santa Cristina)", tipo: "barrio" },
  { nombre: "Santa Comba (San Pedro)", tipo: "barrio" },
  { nombre: "Santa María de Muxa", tipo: "barrio" },
  { nombre: "Soñar (San Pedro)", tipo: "barrio" },
  { nombre: "Teixeiro (Santa María)", tipo: "barrio" },
  { nombre: "Tirimol (San Xoan)", tipo: "barrio" },
  { nombre: "Torible (Santa María)", tipo: "barrio" },
  { nombre: "Veral (San Vicente)", tipo: "barrio" },
  { nombre: "Vilachá de Mera (San Xiao)", tipo: "barrio" },
];

const POLIGONOS_LUGO: ZonaCiudad[] = [
  { nombre: "O Ceao", tipo: "poligono" },
  { nombre: "Polígono As Gándaras", tipo: "poligono" },
];

const BARRIOS_OURENSE: ZonaCiudad[] = [
  { nombre: "Centro histórico", tipo: "barrio" },
  { nombre: "O Posío", tipo: "barrio" },
  { nombre: "San Francisco", tipo: "barrio" },
  { nombre: "A Carballeira", tipo: "barrio" },
  { nombre: "O Couto", tipo: "barrio" },
  { nombre: "As Lagoas", tipo: "barrio" },
  { nombre: "A Ponte", tipo: "barrio" },
  { nombre: "A Chavasqueira", tipo: "barrio" },
  { nombre: "Oira", tipo: "barrio" },
  { nombre: "O Vinteún", tipo: "barrio" },
  { nombre: "Peliquín", tipo: "barrio" },
  { nombre: "Mariñamansa", tipo: "barrio" },
  { nombre: "A Cuña", tipo: "barrio" },
  { nombre: "A Residencia", tipo: "barrio" },
  { nombre: "Berrocás", tipo: "barrio" },
  { nombre: "O Polvorín", tipo: "barrio" },
  { nombre: "Arrabaldo (Santa Cruz)", tipo: "barrio" },
  { nombre: "Beiro (Santa Baia)", tipo: "barrio" },
  { nombre: "Canedo (San Miguel)", tipo: "barrio" },
  { nombre: "Ceboliño (Bo Xesús)", tipo: "barrio" },
  { nombre: "Cudeiro (San Pedro)", tipo: "barrio" },
  { nombre: "Montealegre (A Milagrosa)", tipo: "barrio" },
  { nombre: "O Castro de Beiro (Santo André)", tipo: "barrio" },
  { nombre: "Palmés (San Mamede)", tipo: "barrio" },
  { nombre: "Rairo (Santa Lucía)", tipo: "barrio" },
  { nombre: "Reza (Santa María)", tipo: "barrio" },
  { nombre: "Santa Mariña do Monte (Santa Mariña)", tipo: "barrio" },
  { nombre: "Seixalbo (San Breixo)", tipo: "barrio" },
  { nombre: "Trasalba (San Pedro)", tipo: "barrio" },
  { nombre: "Untes (Santo Estevo)", tipo: "barrio" },
  { nombre: "Velle (Santa Marta)", tipo: "barrio" },
  { nombre: "Vilar de Astrés (Purísima Concepción)", tipo: "barrio" },
  { nombre: "Vista Fermosa (San Xosé)", tipo: "barrio" },
];

const POLIGONOS_OURENSE: ZonaCiudad[] = [
  { nombre: "Polígono Quintela", tipo: "poligono" },
  { nombre: "Polígono Seixalbo", tipo: "poligono" },
];

const BARRIOS_PONTEVEDRA: ZonaCiudad[] = [
  { nombre: "Centro histórico", tipo: "barrio" },
  { nombre: "Ensanche", tipo: "barrio" },
  { nombre: "A Moureira", tipo: "barrio" },
  { nombre: "As Corbaceiras", tipo: "barrio" },
  { nombre: "O Burgo", tipo: "barrio" },
  { nombre: "A Xunqueira", tipo: "barrio" },
  { nombre: "Campolongo", tipo: "barrio" },
  { nombre: "Mollavao", tipo: "barrio" },
  { nombre: "A Eiriña", tipo: "barrio" },
  { nombre: "A Seca", tipo: "barrio" },
  { nombre: "Os Salgueiriños", tipo: "barrio" },
  { nombre: "O Castañal", tipo: "barrio" },
  { nombre: "A Parda", tipo: "barrio" },
  { nombre: "Valdecorvos", tipo: "barrio" },
  { nombre: "San Mauro", tipo: "barrio" },
  { nombre: "Monte Porreiro", tipo: "barrio" },
  { nombre: "O Gorgullón", tipo: "barrio" },
  { nombre: "Ponte Muíños", tipo: "barrio" },
  { nombre: "Estribela", tipo: "barrio" },
  { nombre: "Placeres", tipo: "barrio" },
  { nombre: "A Canicouva (Santo Estevo)", tipo: "barrio" },
  { nombre: "A Virxe do Camiño (Virxe do Camiño)", tipo: "barrio" },
  { nombre: "Alba (Santa María)", tipo: "barrio" },
  { nombre: "Bora (Santa Mariña)", tipo: "barrio" },
  { nombre: "Campañó (San Pedro)", tipo: "barrio" },
  { nombre: "Cerponzóns (San Vicente)", tipo: "barrio" },
  { nombre: "Lérez (San Salvador)", tipo: "barrio" },
  { nombre: "Lourizán (Santo André)", tipo: "barrio" },
  { nombre: "Marcón (San Miguel)", tipo: "barrio" },
  { nombre: "Mourente (Santa María)", tipo: "barrio" },
  { nombre: "Ponte Sampaio (Santa María)", tipo: "barrio" },
  { nombre: "Salcedo (San Martiño)", tipo: "barrio" },
  { nombre: "Santa María de Xeve (Santa María)", tipo: "barrio" },
  { nombre: "Tomeza (San Pedro)", tipo: "barrio" },
  { nombre: "Verducido (San Martiño)", tipo: "barrio" },
  { nombre: "Xeve (Santo André)", tipo: "barrio" },
];

const POLIGONOS_PONTEVEDRA: ZonaCiudad[] = [
  { nombre: "O Campiño", tipo: "poligono" },
  { nombre: "O Vao", tipo: "poligono" },
];

const BARRIOS_VIGO: ZonaCiudad[] = [
  { nombre: "Casco Vello", tipo: "barrio" },
  { nombre: "O Berbés", tipo: "barrio" },
  { nombre: "Centro", tipo: "barrio" },
  { nombre: "O Calvario", tipo: "barrio" },
  { nombre: "Bouzas", tipo: "barrio" },
  { nombre: "Coia", tipo: "barrio" },
  { nombre: "As Travesas", tipo: "barrio" },
  { nombre: "Alcabre (Santa Baia)", tipo: "barrio" },
  { nombre: "Beade (Santo Estevo)", tipo: "barrio" },
  { nombre: "Bembrive (Santiago)", tipo: "barrio" },
  { nombre: "Cabral (Santa Mariña)", tipo: "barrio" },
  { nombre: "Candeán (San Cristovo)", tipo: "barrio" },
  { nombre: "Castrelos (Santa María)", tipo: "barrio" },
  { nombre: "Comesaña (Santo André)", tipo: "barrio" },
  { nombre: "Coruxo (San Salvador)", tipo: "barrio" },
  { nombre: "Freixeiro (San Tomé)", tipo: "barrio" },
  { nombre: "Lavadores (Santa Cristina)", tipo: "barrio" },
  { nombre: "Matamá (San Pedro)", tipo: "barrio" },
  { nombre: "Navia (San Paio)", tipo: "barrio" },
  { nombre: "Oia (San Miguel)", tipo: "barrio" },
  { nombre: "Saiáns (San Xurxo)", tipo: "barrio" },
  { nombre: "Sárdoma (San Pedro)", tipo: "barrio" },
  { nombre: "Teis (San Salvador)", tipo: "barrio" },
  { nombre: "Valadares (Santo André)", tipo: "barrio" },
  { nombre: "Zamáns (San Mamede)", tipo: "barrio" },
  { nombre: "Cíes (San Francisco)", tipo: "barrio" },
];

const POLIGONOS_VIGO: ZonaCiudad[] = [
  { nombre: "Polígono de Balaídos", tipo: "poligono" },
  { nombre: "Parque Tecnológico de Valadares", tipo: "poligono" },
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
  {
    id: "vitoria",
    nombre: "Vitoria-Gasteiz",
    etiqueta: "Vitoria-Gasteiz (Álava)",
    zonas: [...BARRIOS_VITORIA, ...POLIGONOS_VITORIA],
  },
  {
    id: "pamplona",
    nombre: "Pamplona",
    etiqueta: "Pamplona (Navarra)",
    zonas: [...BARRIOS_PAMPLONA, ...POLIGONOS_PAMPLONA],
  },
  {
    id: "tudela",
    nombre: "Tudela",
    etiqueta: "Tudela (Navarra)",
    zonas: [...BARRIOS_TUDELA, ...POLIGONOS_TUDELA],
  },
  {
    id: "leon",
    nombre: "León",
    etiqueta: "León (León)",
    zonas: [...BARRIOS_LEON, ...POLIGONOS_LEON],
  },
  {
    id: "sanandres",
    nombre: "San Andrés del Rabanedo",
    etiqueta: "San Andrés del Rabanedo (León)",
    zonas: [...BARRIOS_SAN_ANDRES, ...POLIGONOS_SAN_ANDRES],
  },
  {
    id: "ponferrada",
    nombre: "Ponferrada",
    etiqueta: "Ponferrada (León)",
    zonas: [...BARRIOS_PONFERRADA, ...POLIGONOS_PONFERRADA],
  },
  {
    id: "soria",
    nombre: "Soria",
    etiqueta: "Soria (Soria)",
    zonas: [...BARRIOS_SORIA, ...POLIGONOS_SORIA],
  },
  {
    id: "segovia",
    nombre: "Segovia",
    etiqueta: "Segovia (Segovia)",
    zonas: [...BARRIOS_SEGOVIA, ...POLIGONOS_SEGOVIA],
  },
  {
    id: "valladolid",
    nombre: "Valladolid",
    etiqueta: "Valladolid (Valladolid)",
    zonas: [...BARRIOS_VALLADOLID, ...POLIGONOS_VALLADOLID],
  },
  {
    id: "zamora",
    nombre: "Zamora",
    etiqueta: "Zamora (Zamora)",
    zonas: [...BARRIOS_ZAMORA, ...POLIGONOS_ZAMORA],
  },
  {
    id: "zaragoza",
    nombre: "Zaragoza",
    etiqueta: "Zaragoza (Zaragoza)",
    zonas: [...BARRIOS_ZARAGOZA, ...POLIGONOS_ZARAGOZA],
  },
  {
    id: "gijon",
    nombre: "Gijón",
    etiqueta: "Gijón (Asturias)",
    zonas: [...BARRIOS_GIJON, ...POLIGONOS_GIJON],
  },
  {
    id: "lugo",
    nombre: "Lugo",
    etiqueta: "Lugo (Lugo)",
    zonas: [...BARRIOS_LUGO, ...POLIGONOS_LUGO],
  },
  {
    id: "ourense",
    nombre: "Ourense",
    etiqueta: "Ourense (Ourense)",
    zonas: [...BARRIOS_OURENSE, ...POLIGONOS_OURENSE],
  },
  {
    id: "pontevedra",
    nombre: "Pontevedra",
    etiqueta: "Pontevedra (Pontevedra)",
    zonas: [...BARRIOS_PONTEVEDRA, ...POLIGONOS_PONTEVEDRA],
  },
  {
    id: "vigo",
    nombre: "Vigo",
    etiqueta: "Vigo (Pontevedra)",
    zonas: [...BARRIOS_VIGO, ...POLIGONOS_VIGO],
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
