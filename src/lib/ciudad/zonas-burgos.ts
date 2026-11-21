// @ts-nocheck — archivo enorme: sin esto el build de Vercel petaba (Maximum call stack size exceeded).
/**
 * Barrios y polígonos cerrados.
 * Burgos: reglamento de distritos del Ayuntamiento, 2020.
 * Sin Centro Histórico ni Centro Sur.
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
 * Camargo: debajo de Santander, detrás de la capital y delante de Castro-Urdiales. Los barrios de la lista y doce polígonos.
 * Camargo está en las dos listas. El barrio se queda con el nombre corto. El polígono sale con la marca delante.
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
 * Vilagarcía de Arousa: parroquias del nomenclátor de Galicia de 2026, más Vilaxoán.
 * Polígonos Bamio, Trabanca y O Pousadoiro.
 * A Estrada: debajo de Pontevedra, detrás de la capital y delante de Cangas. Las parroquias de la lista y los dos polígonos.
 * A Estrada (casco urbano) es el casco. A Estrada no entra aparte.
 * Ribeira es barrio. Polígono Industrial de Ribeira entra aparte.
 * Toedo es barrio. Polígono Industrial de Toedo entra aparte.
 * Parada y Paradela quedan las dos.
 * Cangas: debajo de Pontevedra, detrás de A Estrada y delante de Lalín. Los barrios de la lista y los dos polígonos.
 * Cangas (casco urbano) es el casco. Cangas no entra aparte.
 * A Serra de Nacente y A Serra de Poente quedan las dos.
 * Lalín: debajo de Pontevedra, detrás de Cangas y delante de Marín. Los barrios de la lista y las dos áreas industriales.
 * Lalín (casco urbano) es el casco. Lalín no entra aparte.
 * Botos es barrio. Polígono Industrial de Botos entra aparte.
 * Marín: debajo de Pontevedra, detrás de Lalín y delante de Redondela. Los barrios de la lista y la zona industrial del puerto.
 * Marín no entra como barrio.
 * Redondela: debajo de Pontevedra, detrás de Marín y delante de Vigo. Los barrios de la lista y el polígono O Muro.
 * Redondela (casco urbano) es el casco. Redondela no entra aparte.
 * Asnelle de Abaixo y Asnelle de Arriba quedan las dos.
 * A Coruña: barrios del plano del Concello. Sin los muelles.
 * Polígonos Agrela, Pocomaco, Vío, el Parque Ofimático y Someso.
 * Santiago de Compostela: zonas del Concello y parroquias del padrón.
 * Polígonos Tambre, Boisaca y Costa Vella.
 * Ferrol: barrios del plano del Concello y parroquias del padrón.
 * Polígonos Caranza y A Gándara.
 * Narón: barrios del casco urbano del Concello y parroquias del padrón.
 * Polígonos Río do Pozo, A Gándara y As Lagoas.
 * Oleiros: parroquias del padrón, más Santa Cristina, Bastiagueiro y O Real.
 * Polígono Icaria.
 * Bilbao: barrios del plano del Ayuntamiento de 2023 y los núcleos rurales del plan.
 * Zorrotzaurre va como zona. Los polígonos de al lado están fuera del municipio.
 * Barakaldo: los 12 barrios del Ayuntamiento (2026) y las zonas que ese texto nombra.
 * Polígonos Kareaga Norte y Beurko Viejo.
 * Getxo: los barrios del Ayuntamiento y las zonas del plan de 2026.
 * Polígono Industrial Errotatxu.
 * Portugalete: barrios de EUSTAT 2025 y las zonas que nombra el Ayuntamiento.
 * Polígono Industrial Ballonti.
 * Santurtzi: barrios de EUSTAT 2025. Kabiezes es Cabieces.
 * Polígonos Balparda y El Árbol.
 * Basauri: barrios de EUSTAT 2025. Kareaga es Careaga. Bidebieta es la Estación.
 * Polígono Industrial Artunduaga.
 * Durango: debajo de Bilbao, detrás de Basauri y delante de Erandio. Los barrios de la lista y los ocho polígonos.
 * Montorreta, San Roke y Tabira están en las dos listas. El barrio se queda con el nombre corto. El polígono sale con la marca delante.
 * Landako es barrio. Landako Elkartegia entra aparte.
 * Arriandi, Mallabiena y Trañapadura no entran. Son de Iurreta o de Abadiño.
 * Durango no entra como barrio.
 * Erandio: debajo de Bilbao, detrás de Durango y delante de Galdakao. Los siete barrios y los dos polígonos nombrados.
 * Axpe y Axpe-Industrialdeak quedan los dos.
 * Los otros espacios de actividad económica no entran. No vienen con nombre en la lista.
 * Erandio no entra como barrio.
 * Galdakao: debajo de Bilbao, detrás de Erandio y delante de Getxo. Los barrios de la lista y los diez polígonos.
 * Aperribai está en las dos listas. El barrio se queda con el nombre corto. El polígono sale con la marca delante.
 * Izaga e Itzaga quedan los dos.
 * Urreta es polígono. Urreta-Egia es barrio.
 * Zuhatzu es barrio. Zuhatzu-Zuazo es polígono.
 * Galdakao no entra como barrio.
 * Leioa: debajo de Bilbao, detrás de Getxo y delante de Portugalete. Los barrios de la lista y los nueve polígonos.
 * Ibaiondo está en las dos listas. El barrio se queda con el nombre corto. El polígono sale con la marca delante.
 * Parque Empresarial Ibaiondo entra aparte.
 * Lamiako es polígono. Lamiako-Txopoeta es barrio.
 * Las zonas de al lado que no están en la lista no entran.
 * Leioa no entra como barrio.
 * San Sebastián: los 19 barrios del Ayuntamiento. Centro es Erdialdea.
 * Polígonos del directorio de Gipuzkoa. El 27 es Torrua Zahar.
 * Irun: barrios de EUSTAT 2025 y los que recorre el Ayuntamiento.
 * Dunboa es Dumboa. Behobia va aparte de Bidasoa. Polígono 54 es Azken Portu.
 * Errenteria: barrios de EUSTAT 2025. Rentería es el mismo municipio.
 * Polígonos Egiburuberri, Masti-Loidi, Olibet, Txirrita-Maleo y Aranguren.
 * Barcelona: los 73 barrios del Ayuntamiento.
 * Polígonos Zona Franca, Mercabarna, Bon Pastor, Torrent de l'Estadella,
 * La Verneda Industrial, Montsolís y 22@.
 * L'Hospitalet: los 13 barrios del Ayuntamiento. Granvia Sud es barrio.
 * Polígonos Pedrosa, Carretera del Mig y los tres de Santa Eulàlia.
 * Badalona: los 34 barrios del Ayuntamiento.
 * Polígonos Badalona Sud y Badalona Nord. Can Ribó es el Nord.
 * Santa Coloma de Gramenet: los 17 barrios del Ayuntamiento.
 * Polígono del Bosc Llarg i les Canyes.
 * Cornellà de Llobregat: los 7 barrios del Ayuntamiento.
 * Polígonos Famades, Solanes y Est. Almeda es barrio.
 * Sant Boi de Llobregat: los 6 distritos del Ayuntamiento.
 * Ocho polígonos urbanos. La zona del aeropuerto queda fuera.
 * Viladecans: los barrios de las tres regidurías de distrito.
 * Polígonos Business Park, Ca n'Alemany, Can Calderon, Agròpolis
 * y el industrial Centre.
 * El Prat de Llobregat: los 9 barrios del área metropolitana
 * y el Eixample Sud. Polígonos de las zonas de actividad económica.
 * Esplugues de Llobregat: los 10 barrios del Ayuntamiento.
 * El Gall, La Plana y Montesa son también las zonas industriales.
 * Gavà: los barrios de las regidurías de barrio.
 * Polígonos del Parc Empresarial: Les Massotes, La Post, Les Parets,
 * El Camí Ral, El Regàs y La Marina.
 * Montcada i Reixac: los 10 barrios del Ayuntamiento.
 * Polígonos de los mapas municipales. Can Cuiàs es barrio y polígono.
 * Terrassa: los barrios del mapa del Ayuntamiento.
 * Polígonos industriales del mismo mapa. Segle XX y Can Palet salen una vez.
 * Sabadell: los barrios de los siete distritos.
 * Polígonos de actividad económica. Can Roqueta y Can Feu salen una vez.
 * Mataró: los 12 barrios del mapa del Ayuntamiento.
 * Siete polígonos. Pla d'en Boet es barrio y polígono.
 * Sant Cugat del Vallès: los barrios del padrón municipal,
 * también los de Valldoreix. Siete parques empresariales.
 * Can Calopa, Ca n'Ametller y La Guinardera salen una vez.
 * Rubí: los 23 barrios del Ayuntamiento.
 * Los 11 polígonos del mapa municipal.
 * Vilanova i la Geltrú: los barrios de la página del Ayuntamiento.
 * Los 12 polígonos del censo municipal.
 * Castelldefels: los 19 barrios del Ayuntamiento.
 * El polígono industrial del Camí Ral, el parque tecnológico y Pla de Carat.
 * Granollers: los 17 barrios del mapa municipal.
 * Los 7 polígonos de la sede electrónica.
 * Cerdanyola del Vallès: los barrios y los 9 polígonos de la lista.
 * Mollet del Vallès: los barrios y los 5 polígonos de la lista.
 * Barberà del Vallès: los barrios y los polígonos de la lista.
 * Manresa: los barrios y los polígonos de la lista.
 * Sitges: los barrios y los polígonos de la lista.
 * Sant Pere de Ribes: los barrios y los polígonos de la lista.
 * Vic: los barrios y los polígonos de la lista.
 * Igualada: los barrios y los polígonos de la lista.
 * Vilafranca del Penedès: los barrios y los polígonos de la lista.
 * Tarragona: los barrios y los polígonos de la lista.
 * Reus: los barrios y los polígonos de la lista.
 * El Vendrell: los barrios y los polígonos de la lista.
 * Cambrils: los barrios y los polígonos de la lista.
 * Tortosa: los barrios y los polígonos de la lista.
 * Calafell: los barrios y los polígonos de la lista.
 * Salou: los barrios de la lista.
 * Vila-seca: debajo de Tarragona, detrás de Tortosa. Los barrios de la lista y los siete polígonos.
 * Gran Indústria I y Gran Indústria II quedan las dos.
 * Vila-seca no entra como barrio.
 * Lleida: los barrios y los polígonos de la lista.
 * Girona: capital, en negrita, detrás de Cuenca y delante de Granada. Los barrios de la lista y cinco polígonos.
 * Carme – Vista Alegre, Domeny – Taialà, Figuerola – Bonastruc, Montilivi – La Creueta, Palau – Avellaneda – Mas Xirgu, Pedreres – Fora Muralla y Pla de Palau – Sant Pau quedan con esos nombres.
 * Avellaneda y Mas Xirgu entran como polígono. En el barrio van dentro de Palau – Avellaneda – Mas Xirgu.
 * Pressupostos participats - Ajuntament de Girona+3 es la fuente. No entra en el desplegable.
 * Girona no entra como barrio.
 * Lloret de Mar: debajo de Girona, detrás de la capital y delante de Granada. Los barrios de la lista y tres polígonos.
 * Mas Arboç – Sant Quirze queda con ese nombre.
 * Zona Industrial de Lloret de Mar (carretera de Vidreres), Polígono Industrial Sector 3 B-13 y Zona Industrial Nau B2, Sector Q entran los tres.
 * Lloret de Mar no entra como barrio.
 * Ávila: los barrios y los polígonos de la lista.
 * Salamanca: los barrios y los polígonos de la lista.
 * Madrid: los 131 barrios oficiales y las áreas industriales de la lista.
 * Móstoles: los barrios y los polígonos de la lista.
 * Alcalá de Henares: los barrios y los polígonos de la lista.
 * Leganés: los barrios y los polígonos de la lista.
 * Getafe: los barrios y los polígonos de la lista.
 * Fuenlabrada: los barrios y los polígonos de la lista.
 * Alcorcón: los barrios y los polígonos de la lista.
 * San José de Valderas queda como barrio.
 * Torrejón de Ardoz: los barrios y los polígonos de la lista.
 * Las Fronteras queda como barrio.
 * Parla: los barrios y los polígonos de la lista.
 * Alcobendas: los barrios y los polígonos de la lista.
 * Fuente Hito, Valdelasfuentes, Fuentelucha, Arroyo de la Vega y El Juncal quedan como barrio.
 * Rivas-Vaciamadrid: los barrios y los polígonos de la lista.
 * Las Rozas de Madrid: los barrios y los polígonos de la lista.
 * Európolis queda solo como polígono.
 * San Sebastián de los Reyes: los barrios y los polígonos de la lista.
 * Pozuelo de Alarcón: los barrios y los polígonos de la lista.
 * Valdemoro: los barrios y los polígonos de la lista.
 * Coslada: los barrios y los polígonos de la lista.
 * Ciudad 70 queda como Ciudad 70 (Ciudad San Pablo).
 * Barrio del Jarama sin la nota del desarrollo.
 * Majadahonda: los barrios y los polígonos de la lista.
 * El Carralero queda como barrio. Polígono Industrial Carralero como polígono.
 * Los Satélites queda como barrio.
 * Mejorada del Campo: debajo de Madrid, detrás de Majadahonda y delante de Móstoles. Los barrios de la lista y los once polígonos.
 * Las Acacias es barrio. Acacias es polígono.
 * Mejorada entra como polígono. Mejorada del Campo no entra como barrio.
 * Paracuellos de Jarama: debajo de Madrid, detrás de Navalcarnero y delante de Parla. Los barrios de la lista y los nueve polígonos.
 * El Cervellón I, II y III quedan los tres.
 * Paracuellos de Jarama no entra como barrio.
 * San Martín de la Vega: debajo de Madrid, detrás de San Fernando de Henares y delante de San Sebastián de los Reyes. Los barrios de la lista y el polígono Aimayr (Almayr).
 * Las fábricas de dentro de Aimayr no entran aparte.
 * San Martín de la Vega no entra como barrio.
 * Torrelodones: debajo de Madrid, detrás de Torrejón de Ardoz y delante de Tres Cantos. Los barrios de la lista. Sin polígonos.
 * Torrelodones no entra como barrio.
 * Villanueva de la Cañada: debajo de Madrid, detrás de Valdemoro. Los barrios de la lista y los dos polígonos.
 * Villanueva de la Cañada no entra como barrio.
 * Villaviciosa de Odón: debajo de Madrid, detrás de Villanueva de la Cañada. Los barrios de la lista y los tres polígonos.
 * El Bosque, El Bosque Alto y El Bosque Bajo quedan los tres.
 * Castillo y Castillo de Villaviciosa quedan los dos.
 * Villaviciosa de Odón no entra como barrio.
 * Collado Villalba: los barrios y los polígonos de la lista.
 * Los Llanos queda como barrio. Polígono Industrial Los Llanos como polígono.
 * Los Negrales queda en Collado Villalba.
 * Boadilla del Monte: los barrios y los polígonos de la lista.
 * Prado del Espino queda como Parque Empresarial Prado del Espino.
 * Aranjuez: los barrios y los polígonos de la lista.
 * Industrial Gonzalo Chacón y Polígono Industrial Gonzalo Chacón quedan los dos.
 * Cortijo de San Isidro y Real Cortijo de San Isidro quedan los dos.
 * Arganda del Rey: los barrios y los polígonos de la lista.
 * Cañal, El queda con el nombre así.
 * El Guijar queda como barrio. Polígono El Guijar como polígono.
 * Colmenar Viejo: los barrios y los polígonos de la lista.
 * Arcos, Los y Cerrillo, El quedan con el nombre así.
 * Pinto: los barrios y los polígonos de la lista.
 * Rábida, La queda con el nombre así.
 * La Estación no entra: queda Pinto-Estación.
 * Tres Cantos: los sectores y los polígonos de la lista.
 * Soto de Viñuelas queda como barrio.
 * San Fernando de Henares: los barrios y los polígonos de la lista.
 * Arroyomolinos: los barrios y los polígonos de la lista.
 * Castañeras, Las; Carrizos, Los; Castillo, El; Dehesa, La y Encinar, El quedan con el nombre así.
 * Galapagar: los núcleos y las zonas empresariales de la lista.
 * Navalcarnero: los barrios y los polígonos de la lista.
 * San Isidro queda como barrio. Polígono San Isidro como polígono.
 * Sevilla: los barrios y los polígonos de la lista.
 * Arenal, El queda con el nombre así.
 * Polígono Norte y Polígono Sur quedan como barrio.
 * PISA, PIBO y el Aljarafe no entran.
 * Dos Hermanas: los barrios y los polígonos de la lista.
 * Ibarburu queda como barrio. Polígono Ibarburu como polígono.
 * Fuente del Rey queda como barrio. Polígono Fuente del Rey como polígono.
 * Barrio Centro no entra: queda Casco Antiguo.
 * Alcalá de Guadaíra: los barrios y los polígonos de la lista.
 * Las Lirios no entra: queda Los Lirios.
 * Utrera: los barrios y los polígonos de la lista.
 * Ibárrburu queda con el nombre así.
 * Mairena del Aljarafe: los barrios y los polígonos de la lista.
 * PISA entra en Mairena del Aljarafe, no en Sevilla.
 * La Rinconada: los barrios y los polígonos de la lista.
 * El Gordillo queda como barrio. Polígono El Gordillo como polígono.
 * Écija: los barrios y los polígonos de la lista.
 * Villanueva del Rey queda como barrio. Polígono Villanueva del Rey como polígono.
 * Los Palacios y Villafranca: los barrios y los polígonos de la lista.
 * El Trobal queda como barrio. Polígono El Trobal como polígono.
 * Maribáñez queda como barrio. Polígono Maribáñez como polígono.
 * Coria del Río: los barrios y los polígonos de la lista.
 * Carmona: los barrios y los polígonos de la lista.
 * Málaga: los barrios y los polígonos de la lista.
 * El Viso queda como barrio. Polígono El Viso como polígono.
 * La Pelusa queda como barrio. Polígono La Pelusa como polígono.
 * Marbella: las dos listas de barrios, sin repetir el mismo nombre.
 * Cancelada no entra: es de Estepona.
 * Elviria, La Campana, Las Albarizas y Nueva Campana quedan como barrio.
 * Polígono Elviria, Polígono La Campana, Polígono Las Albarizas y Polígono Nueva Campana como polígono.
 * San Pedro Alcántara queda como barrio. San Pedro de Alcántara como polígono.
 * Mijas: las dos listas de barrios, sin repetir el mismo nombre.
 * Entrerríos y La Torre quedan como barrio. Polígono Entrerríos y Polígono La Torre como polígono.
 * Vélez-Málaga: los barrios y los polígonos de la lista.
 * Arroyo de la Miel no entra: es de Benalmádena.
 * Fuengirola: los barrios y los polígonos de la lista.
 * Estepona: lista revisada. Cancelada entra aquí.
 * Polígono Industrial Llano del Negro pasa a Polígono Industrial Llanos del Negro.
 * Zona de Servicios de Estepona sale. Entra Polígono Industrial Ampliación de Llanos del Negro.
 * Benalmádena: los barrios y los polígonos de la lista.
 * Arroyo de la Miel entra aquí como barrio. Polígono Industrial Arroyo de la Miel como polígono.
 * La Leala queda como barrio. Polígono Industrial La Léala como polígono.
 * Torremolinos: los barrios y los polígonos de la lista.
 * El Pinillo, La Colina y Los Pinares quedan como barrio.
 * Parque Empresarial El Pinillo, Polígono Industrial La Colina (zona productiva) y Zona Empresarial Los Pinares como polígono.
 * Rincón de la Victoria: los barrios y las cuatro áreas de la lista.
 * Benagalbón y Cotomar quedan como barrio.
 * Cala del Moral (La) queda como barrio. Área comercial de La Cala del Moral como polígono.
 * Alhaurín de la Torre: los barrios y los polígonos de la lista.
 * Alhaurín el Grande: debajo de Málaga, detrás de Alhaurín de la Torre y delante de Antequera. Los barrios de la lista y los dos polígonos.
 * Alhaurín el Grande no entra como barrio.
 * Cártama: debajo de Málaga, detrás de Benalmádena y delante de Coín. Los barrios de la lista y los dos polígonos.
 * Aljaima y Nueva Aljaima quedan los dos.
 * Cártama no entra como barrio.
 * Coín: debajo de Málaga, detrás de Cártama y delante de Estepona. Los barrios de la lista y los cinco polígonos.
 * Coín no entra como barrio.
 * Antequera: los barrios, los núcleos rurales y los polígonos de la lista.
 * Villanueva de Cauche y Los Nogales entran una sola vez.
 * Ronda: los barrios, las pedanías y los polígonos de la lista.
 * Los Prados entra una sola vez. El Fuerte queda como barrio. Polígono Industrial El Fuerte como polígono.
 * Huelva: los barrios y los polígonos de la lista. Polígono San Sebastián queda como barrio.
 * Tartessos queda como barrio. Polígono Industrial Tartessos como polígono.
 * Almonte: debajo de Huelva, detrás de la capital y delante de Huesca. El casco, los tres núcleos y los cuatro polígonos.
 * Almonte (casco urbano) es el casco. Cabezudos, El Rocío y Matalascañas entran como zonas del municipio.
 * Ballestares entra como polígono.
 * Almonte no entra como barrio.
 * Almería: los barrios y los polígonos de la lista.
 * El Puche queda como barrio. Polígono El Puche como polígono.
 * Roquetas de Mar: las dos listas de barrios y los polígonos.
 * Cortijos de Marín y La Algaida quedan como barrio.
 * Polígono Industrial Cortijos de Marín y Polígono Industrial La Algaida como polígono.
 * El Ejido: las dos listas de barrios y los polígonos.
 * Balerma y La Redonda quedan como barrio.
 * Polígono Industrial Balerma y Polígono Industrial La Redonda como polígono.
 * Níjar: los barrios y los polígonos de la lista.
 * Lucena: los barrios y los polígonos de la lista.
 * La Torca queda como barrio. Polígono Industrial La Torca como polígono.
 * Los Polvillares queda como barrio. Polígono Industrial Los Polvillares como polígono.
 * Motril: barrios del plan general y núcleos del Ayuntamiento.
 * Las Angustias y Las Monjas quedan juntas: Las Angustias-Las Monjas.
 * El Pilar-Manuel Peña. San Antonio-Calle Ancha. Puerto-Varadero. Las Explanadas.
 * Zona Comercial de La Puchilla queda como barrio.
 * El Vadillo queda como barrio. Polígono Industrial El Vadillo como polígono.
 * Jaén: los barrios y los polígonos de la lista.
 * Polígono del Valle queda como barrio. Polígono Industrial del Valle como polígono.
 * Granada: los barrios y los polígonos de la lista.
 * Cartuja queda como barrio. Polígono Cartuja como polígono.
 * Almuñécar: debajo de Granada, detrás de la capital y delante de Motril. Los barrios de la lista y los dos polígonos.
 * La Paloma está en las dos listas. El barrio se queda con el nombre corto. El polígono sale con la marca delante.
 * Taramay es barrio. Polígono Industrial Taramay entra aparte.
 * Almuñécar no entra como barrio.
 * Linares: los barrios y los polígonos de la lista.
 * La Zarzuela queda como barrio. Polígono Industrial La Zarzuela como polígono.
 * Andújar: los barrios y los polígonos de la lista.
 * San Eufrasio queda como barrio. Sector San Eufrasio también, con ese nombre.
 * Úbeda: los barrios y los polígonos de la lista.
 * Urbanización Huertañalda queda como barrio. Polígono Agrícola Huertañalda como polígono.
 * Solana de Torralba queda como barrio. Polígono Industrial Las Naves (Solana de Torralba) como polígono.
 * Córdoba: los barrios y los polígonos de la lista.
 * Polígono de Poniente queda como barrio. Polígono Industrial de Poniente como polígono.
 * Alicante: los barrios y los polígonos de la lista.
 * Babel queda como barrio. Polígono Babel queda como barrio. Polígono Industrial de Babel como polígono.
 * Rabasa queda como barrio. Polígono Industrial Rabasa como polígono.
 * Pla de la Vallonga queda como barrio. Polígono Industrial Pla de la Vallonga como polígono.
 * Polígono San Blas queda como barrio. Polígono Industrial de San Blas como polígono.
 * San Nicolás de Bari queda como barrio. Lo Morant-San Nicolás de Bari también, con ese nombre.
 * Área Industrial Aguamarga y Zona Industrial de Agua Amarga quedan las dos, cada una con su nombre.
 * Elche: los barrios, las pedanías y los polígonos de la lista.
 * Altabix entra una sola vez. Altabix Nuevo-Ciudad Deportiva queda aparte.
 * La Galia entra una sola vez.
 * Carrús, Carrús Este y Carrús Oeste quedan los tres.
 * San Antón y Sant Antoni quedan los dos.
 * Saladas queda como barrio. Polígono Industrial de Las Saladas como polígono.
 * Llano de San José queda como barrio. Polígono Industrial de Llano de San José como polígono.
 * Matola queda como barrio. Polígono Industrial de Matola como polígono.
 * Peña de las Águilas queda como barrio. Polígono Industrial de Peña de las Águilas como polígono.
 * Altabix queda como barrio. Área Industrial de Altabix y Polígono Industrial de Altabix como polígono.
 * Carrús queda como barrio. Área Industrial de Carrús y Polígono Industrial de Carrús como polígono.
 * Torrevieja: los barrios y los polígonos de la lista.
 * La Hoya queda como barrio. Polígono Industrial La Hoya como polígono.
 * El Acequión y Playa del Acequión quedan los dos.
 * Los Náufragos y Playa de los Náufragos quedan los dos.
 * Polígono Industrial Salinas de Torrevieja y Zona Industrial Salinas de Torrevieja quedan las dos.
 * Orihuela: los barrios y los polígonos de la lista.
 * El Escorratel queda como barrio. Zona industrial de El Escorratel (área de actividad vinculada a Puente Alto) como polígono.
 * La Murada queda como barrio. Polígono Industrial de La Murada como polígono.
 * Campoamor, Dehesa de Campoamor y Lomas de Campoamor quedan los tres.
 * La Zenia y La Zenia II quedan las dos.
 * Playa Flamenca I y Playa Flamenca II quedan las dos.
 * Benidorm: los barrios y los polígonos de la lista.
 * El Rincón de Loix y Racó de l'Oix quedan los dos.
 * Mont Benidorm queda como barrio. Urbanización Mont Benidorm también, con ese nombre.
 * La Huerta y L'Horta quedan las dos.
 * Levante, Ensanche Levante y Zona Playa de Levante quedan las tres.
 * Poniente queda como barrio. Urbanización Playa de Poniente también, con ese nombre.
 * Benidorm Centro y Zona Centro quedan los dos.
 * Área industrial y comercial PP 3/1 y Polígono Industrial PP 3/1 «Industrial» quedan los dos.
 * El PP 3/1 es el sector previsto, no un polígono en marcha.
 * Alcoy: los barrios y los polígonos de la lista.
 * Baradello Gelat y Baradello de Moya quedan los dos.
 * Cotes Altes y Cotes Baixes quedan las dos.
 * San Vicente del Raspeig: los barrios y los polígonos de la lista.
 * Barrio de Santa Isabel y Colonia de Santa Isabel quedan las dos.
 * Pla Contxeta y Pla Olivera quedan las dos.
 * Elda: los barrios y los polígonos de la lista.
 * La Fraternidad y Nueva Fraternidad quedan las dos.
 * Agualejas y Las Aguarejas quedan las dos.
 * La Torreta queda como barrio. Polígono Industrial La Torreta-Río como polígono.
 * Polígono Industrial Finca Lacy y Polígono Industrial Finca Lacy, segunda fase quedan los dos.
 * Dénia: los barrios y los polígonos de la lista.
 * Jesús Pobre entra una sola vez.
 * La Pedrera entra una sola vez.
 * Baix la Mar, Baix la Mar-Darrere del Castell y Darrere del Castell quedan los tres.
 * Les Marines, Les Marines Nord, Les Marines Sud y Las Marinas quedan las cuatro.
 * La Jara (La Xara) y La Xara quedan las dos.
 * Centro-Port y Port-Centre quedan los dos.
 * Campaments y Oeste-Campaments quedan los dos.
 * Les Deveses y Deveses-Bassot quedan las dos.
 * Santa Pola: los barrios y los polígonos de la lista.
 * Tamarit queda como barrio. Playa Tamarit también, con ese nombre.
 * Varadero queda como barrio. Ensanche Varadero también, con ese nombre.
 * Zona de Levante y Ensanche de Levante quedan las dos.
 * Zona de Poniente y Ensanche de Poniente quedan las dos.
 * Villajoyosa: los barrios y los polígonos de la lista.
 * El Paradís queda como barrio. Urbanización Villajoyosa Paradís también, con ese nombre.
 * El Torres queda como barrio. Área Industrial El Torres y Parc Empresarial El Torres como polígono.
 * Cala Torres, Torres I y Torres II quedan los tres.
 * La Malladeta queda como barrio. Urbanización Mirador de la Malladeta también, con ese nombre.
 * Poble Nou queda como barrio. Área Industrial Poble Nou-Camino Viejo de Valencia como polígono.
 * Villena: los barrios y los polígonos de la lista.
 * Barrio del Mercado y Zona del Mercado quedan los dos.
 * Polígono Industrial El Rubial I y Polígono Industrial El Rubial II-Casa del Padre quedan los dos.
 * Petrer: los barrios y los polígonos de la lista.
 * Almafrà queda como barrio. Almafrà Centro también, con ese nombre.
 * Barrio de La Frontera y La Frontera quedan las dos.
 * La Loma Badá y Lloma Bada quedan las dos.
 * Barrio de San Rafael queda como barrio. Parque San Rafael también, con ese nombre.
 * Salinetas queda como barrio. Polígono Industrial Salinetas y Polígono Industrial Acceso a Salinetas como polígono.
 * Guirney queda como barrio. Polígono Industrial Guirney-San Rafael como polígono.
 * El Campello: los barrios y los polígonos de la lista.
 * Almadraba queda como barrio. La Almadraba también, con ese nombre.
 * Bonalba, Bonalba Alta y Bonalba Baja quedan las tres.
 * Coveta Fumà y La Coveta Fumada quedan las dos.
 * Muchavista queda como barrio. Urbanización Mutxavista también, con ese nombre.
 * San Ramón queda como barrio. Polígono Industrial San Ramón como polígono.
 * El Mesell queda como barrio. Polígono Industrial El Pla del Mesell como polígono.
 * Puerto Pesquero de El Campello es polígono. En el desplegable se ve con «Polígono ·» delante.
 * Crevillent: los barrios y los polígonos de la lista.
 * Barrio de la Estación queda como barrio. I-4 (La Estación) como polígono.
 * Industrial Este e Industrial Oeste quedan los dos.
 * Ningún polígono de Crevillent empieza por «Polígono». En el desplegable se ve con «Polígono ·» delante.
 * Jávea: el municipio sale como «Jávea (Xàbia)». Los barrios y los polígonos de la lista.
 * Cala del Portitxol, El Portichol y Portitxol quedan los tres.
 * Cala Granadella y Granadella quedan las dos.
 * Costa Nova y Costa Nova Panorama quedan las dos.
 * Cansalades queda como barrio. Zona Empresarial de Les Cansalades como polígono.
 * Arenal queda como barrio. Zona Comercial y Empresarial del Arenal como polígono.
 * Puerto queda como barrio. Zona Comercial y Empresarial del Puerto como polígono.
 * Zona Empresarial de Les Cansalades, Zona Comercial y Empresarial del Arenal y Zona Comercial y Empresarial del Puerto se ven con «Polígono ·» delante.
 * Huesca: capital, en negrita. Los barrios y los polígonos de la lista.
 * Polígono 25 y Polígono 29 quedan como barrio, en el grupo de barrios.
 * Parque Tecnológico Walqa y Plataforma Logística Huesca Sur (PLHUS) son polígono. En el desplegable se ven con «Polígono ·» delante.
 * heraldo.es+4 es la fuente. No entra en el desplegable.
 * Teruel: capital, en negrita. Los barrios y los polígonos de la lista.
 * Parque Empresarial La Paz, Plataforma Aeroportuaria de Teruel (PLATA) y Plataforma Logístico-Industrial de Teruel (PLATEA) son polígono. En el desplegable se ven con «Polígono ·» delante.
 * Toledo: capital, en negrita. Los barrios y los polígonos de la lista.
 * La Abadía queda como barrio. Parque Empresarial de la Abadía como polígono. En el desplegable se ve con «Polígono ·» delante.
 * Buenavista y Tres Culturas-Finca Buenavista quedan las dos, como barrio.
 * Santa María de Benquerencia (zona residencial) queda como barrio. Polígono Industrial de Santa María de Benquerencia como polígono.
 * Talavera de la Reina: debajo de Toledo. Los barrios y los polígonos de la lista.
 * Patrocinio queda como barrio. Patrocinio San José también, como barrio. Polígono Industrial Patrocinio San José como polígono.
 * Talavera la Nueva queda como barrio. Polígono Industrial Talavera la Nueva II como polígono.
 * Illescas: debajo de Toledo, delante de Talavera de la Reina. Los barrios y los polígonos de la lista.
 * El Señorío de Illescas queda como barrio. La Alameda del Señorío también, como barrio. Polígono Industrial Señorío de Illescas como polígono.
 * Los Pradillos queda como barrio. Polígono Industrial Los Pradillos como polígono.
 * Veredilla queda como barrio. Polígono Industrial La Veredilla, Polígono Industrial Veredilla II, Polígono Industrial Veredilla III y Polígono Industrial La Veredilla III quedan los cuatro.
 * Parque Industrial y Tecnológico de Illescas (ITAC) y Plataforma Central Iberum son polígono. En el desplegable se ven con «Polígono ·» delante.
 * Seseña: debajo de Illescas y delante de Talavera de la Reina. Los barrios y los polígonos de la lista.
 * La Estación queda como barrio. Polígono Industrial La Estación como polígono.
 * Seseña Nuevo y Seseña Viejo quedan las dos, como barrio.
 * Valencia: capital, en negrita. Los barrios y los polígonos de la lista.
 * Faitanar estaba dos veces. Entra una sola vez.
 * Sant Antoni y San Antonio quedan las dos.
 * Sant Isidre queda como barrio. San Isidro también, como barrio. Polígono Industrial de San Isidro como polígono.
 * Sant Marcel·lí y San Marcelino quedan las dos.
 * Benimàmet queda como barrio. Polígono Industrial Benimàmet como polígono.
 * Vara de Quart queda como barrio. Área Empresarial Vara de Quart y Polígono Industrial Vara de Quart como polígono.
 * La Punta queda como barrio. Polígono Industrial de la Punta como polígono.
 * Natzaret queda como barrio. Polígono Industrial de Nazaret como polígono, con esa otra escritura.
 * Área Empresarial Vara de Quart, Parque Empresarial Fuente del Jarro, Parque Empresarial Táctica, Parque Tecnológico de València y Zona Industrial de la Avenida del Cid se ven con «Polígono ·» delante.
 * Torrent: debajo de Valencia. Los barrios y los polígonos de la lista.
 * 1.º Ensanche, 2.º Ensanche y 3.º Ensanche quedan los tres.
 * Calicanto y Cumbres de Calicanto quedan las dos.
 * El Vedat y Monte Vedat quedan las dos.
 * El Molí está en barrios y en polígonos con el mismo nombre. Entra una sola vez, como barrio.
 * Mas del Jutge queda como barrio. Mas del Jutge (Masía del Juez) como polígono. En el desplegable se ve con «Polígono ·» delante.
 * Toll i l'Alberca es polígono. En el desplegable se ve con «Polígono ·» delante.
 * Gandia: debajo de Valencia, delante de Torrent. Los barrios y los polígonos de la lista.
 * Alqueria de Martorell estaba dos veces. Entra una sola vez.
 * L'Ermita de Marxuquera, Marxuquera Alta y Marxuquera Baixa quedan las tres.
 * Monte Pino y Monte Sol quedan las dos.
 * Parc de l'Alqueria Nova (Parc Sant Pere) queda con ese nombre.
 * Paterna: debajo de Gandia y delante de Torrent. Los barrios y los polígonos de la lista.
 * Loma Llarga-Valterna y Lloma Llarga quedan las dos.
 * Parque Científico de la Universitat de València, Parque Empresarial Táctica y Parque Tecnológico de Paterna son polígono. En el desplegable se ven con «Polígono ·» delante.
 * Sagunto: debajo de Paterna y delante de Torrent. Los barrios y los polígonos de la lista.
 * Los Monasterios queda como barrio. Urbanización Los Monasterios también, con ese nombre.
 * Puerto de Sagunto queda como barrio. Puerto Marítimo de Sagunto como polígono. En el desplegable se ve con «Polígono ·» delante.
 * Parque Empresarial Parc Sagunt I y Parque Empresarial Parc Sagunt II quedan los dos. En el desplegable se ven con «Polígono ·» delante.
 * Alzira: debajo de Valencia, delante de Gandia. Los barrios y los polígonos de la lista.
 * Sant Bernat queda como barrio. Urbanización San Bernat también, con ese nombre.
 * El Pla de Corbera queda como barrio. Parque Empresarial El Pla, Polígono Industrial El Pla y Sector PPI-11 El Pla como polígono.
 * Carretera de Albalat queda como barrio. Polígono Industrial número 2 (Carretera de Albalat) como polígono.
 * Polígono Ciudad del Transporte y Sector PPI-08 Ciudad del Transporte quedan los dos.
 * Parque Empresarial El Pla, Sector PPI-08 Ciudad del Transporte y Sector PPI-11 El Pla se ven con «Polígono ·» delante.
 * Mislata: debajo de Gandia y delante de Paterna. Los barrios y el polígono de la lista.
 * Polígono Industrial Nou d'Octubre (Polígono Industrial de Mislata) queda con ese nombre.
 * Mislata+1 es la fuente. No entra en el desplegable.
 * Burjassot: debajo de Alzira y delante de Gandia. Los barrios y los polígonos de la lista.
 * Zona de Parque Albán queda como barrio. Zona Empresarial Parque Albán como polígono. En el desplegable se ve con «Polígono ·» delante.
 * Parque Comercial Ademuz es polígono. En el desplegable se ve con «Polígono ·» delante.
 * transparencia.burjassot.org+3 es la fuente. No entra en el desplegable.
 * Ontinyent: debajo de Mislata y delante de Paterna. Los barrios del plan de movilidad del Ayuntamiento y los cinco polígonos del censo de la Generalitat.
 * La Vila, El Raval-Poble Nou y Cantereria quedan los tres.
 * Sant Josep, Sant Rafael y El Llombo quedan los tres.
 * Les Casetes queda como barrio. El Ayuntamiento también las llama Las Casitas. Entra una sola vez.
 * Polígono Industrial El Pla y Polígono Industrial El Pla Área 27 y 30 bis quedan los dos.
 * Polígono Industrial Área 45 Pla de Sant Vicent es el de Sant Vicent.
 * Polígono Terciario AH-37 es el de la carretera de Valencia. El plan antiguo lo llamaba polígono Avenida de Valencia. Entra una sola vez, con el nombre del censo.
 * Aldaia: debajo de Alaquàs y delante de Alzira. Los barrios y los polígonos del plan de emergencias del Ayuntamiento.
 * Sant Antoni-Sant Miquel-Santa Rita, Tama, Brillantina, Casc Antic y Colonia-Mercat quedan los cinco.
 * Barri del Cristo queda como barrio. Polígono Industrial Del Cristo como polígono.
 * Barri del Cayo, Barranquet Alto y Calle Sur quedan los tres. Hort de Melcior es el diseminado de esa zona. Entra como Calle Sur.
 * Centro Comercial Bonaire es polígono. En el desplegable se ve con «Polígono ·» delante.
 * Manises: debajo de Gandia y delante de Mislata. Los barrios que nombra el Ayuntamiento y los tres polígonos del censo de la Generalitat.
 * El Carme queda con ese nombre. El Carmen es el mismo barrio. Entra una sola vez.
 * Socusa queda con ese nombre.
 * Sant Jeroni es la parte de Manises. La barriada sigue al otro lado, en Quart de Poblet.
 * Sant Francesc queda con ese nombre. San Francisco es el mismo barrio. Entra una sola vez.
 * La Cova queda como barrio. Polígono Industrial La Cova como polígono.
 * Parc Empresarial Aeroport es polígono. En el desplegable se ve con «Polígono ·» delante.
 * Xirivella: debajo de Xàtiva. Los barrios del plan de emergencias del Ayuntamiento, más El Cano, y los tres polígonos del censo de la Generalitat.
 * Barri Sant Ramon y Mont de Pietat quedan los dos. El plan también escribe Barri Mont Pietat. Entra como Mont de Pietat.
 * Barri de la Llum y Vicentica La Serrana quedan las dos.
 * El Cano queda como barrio.
 * Sant Josep desapareció. No entra. Alqueria Nova es parte del Barri de la Llum. No entra aparte.
 * Verge de la Salut, Mare de Déu de la Salut y Virgen de La Salud son el mismo polígono. Entra una sola vez, como Polígono Industrial Verge de la Salut.
 * Els Oficis es la ampliación y queda aparte. Zamarra queda con ese nombre. La finca Samarra no entra.
 * Sector D y Sector E son de esa zona industrial. No entran aparte.
 * Vara de Quart sigue en Valencia. No entra en Xirivella.
 * Centro Comercial Gran Turia es polígono. En el desplegable se ve con «Polígono ·» delante.
 * Xàtiva: debajo de Torrent y delante de Xirivella. Los doce barrios y las cuatro pedanías.
 * Núcleo histórico es el barrio de Santa María. Distrito Ciudad es el mismo. Entra una sola vez.
 * Torre de Lloris, Anahuir, Sorió y El Realengo quedan las cuatro, como barrio.
 * Camí de l'Estret es polígono. En el desplegable se ve con «Polígono ·» delante.
 * Polígono A queda con ese nombre. El censo de 2023 solo deja estos dos.
 * Catarroja: debajo de Burjassot y delante de Gandia. Los siete barrios del plan de servicios sociales y El Port.
 * Raval-Pilar queda con ese nombre. El Raval es el mismo barrio. Entra una sola vez.
 * Regió-Florida-Villa Carme queda con ese nombre.
 * Fumeral-Institut queda con ese nombre. El Ayuntamiento también lo llama Instituto-Fumeral. Entra una sola vez.
 * El Port queda como barrio.
 * Polígono Industrial El Bony es el único del censo.
 * Alaquàs: debajo de Valencia y delante de Aldaia. Los barrios del plan general, más El Olivar, y los dos polígonos del censo.
 * Centro Histórico queda con ese nombre.
 * Barrio de Ave María queda con ese nombre. El plan también escribe Barrio del Ave María. Entra una sola vez.
 * Barri de Sant Vicent, Barri de San Fermín, Barri del Carme y Barri Roig quedan los cuatro.
 * El Olivar queda como barrio.
 * Polígono Industrial El Bovalar y Polígono Industrial Els Mollons quedan los dos. El Bovalar no entra como barrio.
 * Castellón de la Plana: capital de Castellón, en negrita, detrás de Cádiz y delante de Ciudad Real. Los barrios de la lista y dieciocho polígonos.
 * Censal y Sensal quedan las dos. Grao (Grau) queda con ese nombre.
 * Grupo San Agustín y San Agustín quedan los dos. Grupo San Lorenzo y San Lorenzo quedan los dos.
 * Castellón de la Plana no entra como barrio.
 * Vila-real: debajo de Castellón de la Plana, detrás de la capital y delante de Vinaròs. Los barrios de la lista y nueve polígonos.
 * Melilla (Casas Capote) queda con ese nombre. Vila-real no entra como barrio.
 * Vinaròs: debajo de Castellón de la Plana, detrás de Vila-real y delante de Ciudad Real. Los barrios de la lista y cinco polígonos.
 * Ensanche – Avenida Juan XXIII y Ensanche – Zona Cementerio quedan las dos.
 * Zona Hospital–Estación, Zona Norte, Zona Sur y Zona del Puig quedan las cuatro.
 * Vinaròs no entra como barrio.
 * Badajoz: capital, en negrita. Los barrios del listado, las ocho pedanías y Bótoa. Los tres polígonos.
 * Cerro Gordo y Mirador de Cerro Gordo quedan los dos.
 * La U.V.A. queda como barrio. Santa Engracia también.
 * Alcazaba, Alvarado, Balboa, Gévora, Novelda del Guadiana, Sagrajas, Valdebótoa y Villafranco del Guadiana quedan las ocho, como barrio.
 * Bótoa queda como barrio. Es la aldea.
 * Plataforma Logística del Suroeste Europeo y Parque Científico y Tecnológico de Extremadura son polígono. En el desplegable se ven con «Polígono ·» delante.
 * Mérida: debajo de Badajoz. Los barrios de los distritos y los núcleos del padrón. Los siete polígonos.
 * Casco Histórico queda con ese nombre. El centro es el mismo sitio. Entra una sola vez.
 * Miralrío queda con ese nombre. El padrón también escribe Miralrio. Entra una sola vez.
 * Nuestra Señora de la Antigua queda con ese nombre. El plano también dice La Antigua. Entra una sola vez.
 * Estación de El Carrascalejo queda con ese nombre. También se escribe Estación de El Carrascal y Estación de Carrascalejo. Entra una sola vez.
 * Nueva Ciudad queda como barrio. No entra como polígono.
 * El Prado, Reina Sofía y Carrión quedan como barrio y, aparte, como polígono.
 * Polígono Industrial El Prado entra una sola vez. La ampliación es el mismo polígono.
 * Polígono Industrial CEPANSA queda con esas siglas. También se escribe Cepansa. Entra una sola vez.
 * Polígono Industrial Albarregas queda sin acento. Polígono Industrial ExpacioMérida queda junto. También se escribe Expacio Mérida. Entra una sola vez.
 * La Casera no entra. El plano de 2016 la rotula y la agenda urbana no la cuenta entre los polígonos.
 * Don Benito: debajo de Badajoz y delante de Mérida. Los seis barrios de las fiestas y los siete poblados. Los cuatro polígonos.
 * San Gregorio queda con ese nombre. También se llama Santa María. Entra una sola vez.
 * La Piedad queda con ese nombre.
 * El Torviscal queda con ese nombre. También se escribe Torviscal. Entra una sola vez.
 * Gargáligas queda con acento.
 * San Isidro queda como barrio y, aparte, como polígono.
 * Polígono Industrial San Isidro entra una sola vez. Las fases son el mismo polígono.
 * Polígono Industrial Cepansa, Polígono Industrial Isaac Peral y Polígono Industrial Las Cumbres quedan los tres. Cepansa entra una sola vez.
 * Las Albercas es el parque y no entra como barrio. El polígono de Avante es un proyecto y no entra.
 * Almendralejo: debajo de Badajoz y delante de Don Benito. Los doce barrios del listado. Los tres polígonos.
 * San José queda con ese nombre. El ensanche sur es el mismo barrio.
 * Santiago queda con ese nombre. Alberca-Santiago es la zona norte.
 * San Marcos queda una sola vez. Es la colonia.
 * El Mercado queda con ese nombre. La agenda también dice Barrio del Mercado. Entra una sola vez.
 * Polígono Industrial Las Picadas entra una sola vez. Las Picadas I y Las Picadas II son el mismo polígono.
 * Polígono Industrial Tierra de Barros y Polígono Industrial Carretera de Badajoz quedan los dos.
 * El margen ferroviario no entra como barrio.
 * Cáceres: capital, en negrita. Los barrios del callejero del Ayuntamiento y las tres pedanías. Los cinco polígonos.
 * Cabezarubia queda con una erre. También se escribe Cabezarrubia. Entra una sola vez.
 * Cánovas, Espíritu Santo, Estación, Nuevo Cáceres, Parque del Príncipe y Río Tinto quedan con acento.
 * Casa Plata queda separado. El callejero lo escribe junto.
 * Nuevo Cáceres queda con ese nombre. También se llama San Antonio. Entra una sola vez.
 * Vistahermosa queda junto. El distrito también escribe Vista Hermosa. Entra una sola vez.
 * R-66-A (El Arco) y R-66-B (Parque del Príncipe) quedan con ese nombre.
 * Estación Arroyo-Malpartida, Rincón de Ballesteros y Valdesalor quedan las tres, como barrio.
 * Pinilla no entra aparte. Dehesa de los Caballos tampoco.
 * Charca Musia, Aldea Moret, La Mejostilla y Las Capellanías entran como polígono. Mejostilla, el barrio, queda aparte.
 * Polígono Ganadero queda con ese nombre. Las Capellanías también se escribe Capellanías. Entra una sola vez.
 * Plasencia: debajo de Cáceres. Los veinticinco barrios. El polígono.
 * San Gil y Pradochano quedan como barrio. Son las dos pedanías.
 * Polígono Industrial de Plasencia entra una sola vez. Cepansa y Dehesa de los Caballos son el mismo polígono.
 * Murcia: capital, en negrita. Los veintiocho barrios del núcleo y las cincuenta y cinco pedanías. Los dos polígonos.
 * La Paz y Vistabella quedan los dos. San Basilio y Santa María de Gracia quedan los dos.
 * Infante Juan Manuel queda con ese nombre. El distrito también escribe Infante Don Juan Manuel. Entra una sola vez.
 * Guadalupe queda con ese nombre. También se llama Guadalupe de Maciascoque. Entra una sola vez.
 * Javalí Viejo queda con ese nombre. También se llama El Lugarico. Entra una sola vez.
 * La Alberca queda con ese nombre. También se escribe Alberca de las Torres. Entra una sola vez.
 * San Benito-Barrio del Progreso queda con ese nombre. El mapa también escribe San Benito-Progreso. Entra una sola vez.
 * Valladolises y Lo Jurado queda con ese nombre.
 * Espinardo queda como barrio. Ya no es pedanía.
 * Polígono Industrial Oeste y Polígono Industrial Cabezo Cortado quedan los dos. Cabezo Cortado I es el mismo. El Oeste entra en Murcia.
 * Cartagena: debajo de Murcia. Las diputaciones, el casco y las localidades grandes. Los tres polígonos.
 * Casco Antiguo queda con ese nombre. El padrón llama Cartagena a ese núcleo.
 * San Antonio Abad queda con ese nombre. También se llama San Antón. Entra una sola vez.
 * El Lentiscar queda con ese nombre. El padrón también escribe Lentiscar. Entra una sola vez.
 * El Beal queda con ese nombre. El padrón también escribe Beal. Entra una sola vez.
 * Los Gabatos queda con ese nombre. También se escribe Los Gatos. Entra una sola vez.
 * La Manga del Mar Menor queda con ese nombre. El padrón también escribe La Manga. Entra una sola vez.
 * El Estrecho de San Ginés queda con ese nombre.
 * Polígono de Santa Ana queda como barrio.
 * Polígono Industrial Cabezo Beaza, Polígono Industrial Los Camachos y Polígono Industrial La Palma quedan los tres. Las fases son el mismo polígono.
 * Escombreras queda como diputación. El valle no entra aparte.
 * Lorca: debajo de Murcia, después de Cartagena. Los doce barrios del padrón y las pedanías. Los tres polígonos.
 * Los Ángeles-Apolonia queda con ese nombre. Apolonia, Los Ángeles y Fuerzas Armadas no entran aparte.
 * San José queda con ese nombre. Alfonso X no entra aparte.
 * Santiago queda con ese nombre. San Juan no entra aparte.
 * Santa Quiteria y Virgen de las Huertas quedan las dos.
 * Sutullena queda como barrio. San Fernando no entra aparte.
 * Tiata-La Granja queda con ese nombre. Tiata y La Granja son la misma pedanía.
 * La Escucha queda con ese nombre. El padrón también escribe Escucha. Entra una sola vez.
 * El Río queda con ese nombre.
 * La Torrecilla queda con ese nombre. El padrón también escribe Torrecilla. Entra una sola vez.
 * Hinojar queda con ese nombre. También se escribe Hinójar. Entra una sola vez.
 * Pozo Higuera queda con ese nombre. También se escribe Pozo de la Higuera. Entra una sola vez.
 * Culebrina queda. Está en el catálogo de pedanías.
 * Polígono Industrial Saprelorca queda con ese nombre. También se llama Polígono Industrial de Lorca. Las fases son el mismo polígono.
 * Polígono La Serrata queda con ese nombre. Los sectores son el mismo polígono.
 * Polígono Industrial La Hoya queda como polígono. La Hoya del pueblo queda como pedanía.
 * Molina de Segura: debajo de Murcia, después de Lorca. Los barrios de la ordenanza, las urbanizaciones y las pedanías. Los cinco polígonos.
 * Fátima-Sifón queda con ese nombre. Fátima y El Sifón no entran aparte.
 * San José-Los Ángeles queda con ese nombre. San José y Los Ángeles no entran aparte.
 * Santa Rita queda con ese nombre. También se llama Balsa del Lino. Entra una sola vez.
 * La Molineta queda con ese nombre. Las Yeseras y La Barceloneta no entran aparte.
 * Cañada de las Eras no entra aparte. Queda en San Antonio y en San Miguel.
 * El Panderón queda con ese nombre. El Panderón II es el mismo.
 * La Quinta queda con ese nombre. También se llama Tierra Cálida. Entra una sola vez.
 * Casa de Maximino queda con ese nombre. También se llama Finca Maximino. Entra una sola vez.
 * La Torrealta queda con ese nombre. También se escribe Torrealta. Entra una sola vez.
 * La Ribera queda con ese nombre. También se llama Ribera de Molina. Entra una sola vez.
 * El Llano queda con ese nombre. También se llama Llano de Molina. Entra una sola vez.
 * Campotéjar Alta y Campotéjar Baja quedan las dos.
 * Polígono Industrial El Tapiado, Polígono Industrial La Serreta, Polígono Industrial La Polvorista, Polígono Industrial La Estrella y Polígono Industrial Hercas quedan los cinco.
 * La Serreta Este y La Serreta Oeste son el mismo polígono. La Polvorista Norte y La Polvorista Sur también.
 * Molina Norte y Profusa no entran. Siguen en proyecto.
 * Alcantarilla: debajo de Murcia, antes de Cartagena. Los barrios de la web y los del plano de delegados. Tres polígonos.
 * Campoamor queda con ese nombre. Norte y Sur no entran aparte.
 * Vistabella queda con ese nombre. Este y Oeste no entran aparte.
 * Las Tejeras queda con ese nombre. El plano también escribe Tejeras. Entra una sola vez.
 * Cayitas queda con ese nombre. También se llama La Esencia. Entra una sola vez.
 * San José Obrero queda con ese nombre. Campico no entra aparte.
 * Huerto de los Frailes y San Francisco queda con ese nombre.
 * Santa María queda con ese nombre. Javalí Nuevo es de Murcia.
 * Cabezo Gordo queda con ese nombre. La carretera de Barqueros no entra aparte.
 * Cabezo Verde queda como barrio. El polígono entra aparte.
 * El Potrox queda como barrio.
 * Polígono Industrial Cabezo Verde, Polígono Industrial La Coroneja y Parque Empresarial San Andrés quedan los tres.
 * El Polígono Industrial Oeste ya está en Murcia. No entra otra vez.
 * Torre-Pacheco: debajo de Murcia, después de Molina de Segura. Los barrios del casco y las once pedanías. Los seis polígonos.
 * Los Olmos-Hoyamorena queda con ese nombre. Los Olmos y Hoyamorena son la misma pedanía.
 * Dolores de Pacheco queda con ese nombre. También se escribe Dolores. Entra una sola vez.
 * Los Meroños queda con ese nombre. También se escribe Meroños. Entra una sola vez.
 * La Hortichuela queda con ese nombre. También se escribe Hortichuela. Entra una sola vez.
 * Camachos queda con ese nombre. También se escribe Los Camachos. Entra una sola vez.
 * Los Infiernos no entra. No está entre las once pedanías.
 * Parque Industrial Polaris queda con ese nombre. También se llama Polaris World. Entra una sola vez.
 * La ampliación de La Estrella es el mismo polígono.
 * Águilas: debajo de Murcia, antes de Alcantarilla. Las diputaciones, las localidades y los barrios del casco. Un polígono.
 * Barranco queda con ese nombre. También se escribe Barranco de los Asensios. Entra una sola vez.
 * El Cocón queda con ese nombre. También se escribe Cocón. Entra una sola vez.
 * Cope queda con ese nombre. Marina de Cope, Cuesta de Gos y El Garrobillo no entran aparte.
 * Campo es la diputación. Las localidades entran con su nombre.
 * El Hornillo queda con ese nombre. Costas del Hornillo es el mismo.
 * Las Majadas y Las Molinetas quedan las dos. El cementerio viejo no entra aparte.
 * Polígono Industrial El Labradorcico queda con ese nombre. También se llama Las Majadas. El barrio Las Majadas entra aparte.
 * Yecla: debajo de Murcia, después de Torre-Pacheco. Los barrios del casco, Raspay y el campo. Los tres polígonos.
 * García Lorca queda con ese nombre. También se llama Federico García Lorca. Entra una sola vez.
 * Las Herratillas queda con ese nombre. También se escribe Herratillas. Entra una sola vez.
 * El Sol queda con ese nombre.
 * Santa Bárbara y La Pedrera quedan las dos. Casas Altas no entra aparte.
 * Raspay es la pedanía. Campo Abajo y Campo Arriba quedan las dos.
 * Polígono Industrial Urbayecla, Polígono Industrial Las Teresas y Polígono Industrial La Herrada quedan los tres.
 * San Javier: debajo de Murcia, entre Molina de Segura y Torre-Pacheco. Las pedanías y los barrios. Los dos polígonos.
 * Ciudad del Aire queda con ese nombre. También se llama Colonia Julio Ruiz de Alda. Entra una sola vez.
 * Los Cabos queda con ese nombre.
 * La Manga del Mar Menor entra en San Javier. En Cartagena ya está la suya.
 * Polígono Industrial Venta del Pino y Polígono Industrial Los Urreas quedan los dos. Las fases de Los Urreas son el mismo polígono.
 * San Pedro del Pinatar: debajo de Murcia, detrás de San Javier y delante de Torre-Pacheco. Los barrios de la lista y el polígono Las Beatas.
 * San Pedro del Pinatar (casco urbano) es el casco. San Pedro del Pinatar no entra aparte.
 * Cieza: debajo de Murcia, entre Cartagena y Lorca. Los seis barrios del mapa y las pedanías del padrón. Los tres polígonos.
 * La Era-La Asunción queda con ese nombre. También se escribe La Era-Asunción. Entra una sola vez.
 * Residencial Ascoy queda como barrio. Ascoy queda como pedanía.
 * Cabezo de la Fuensantilla no entra aparte. Queda en La Horta. Fuensantilla entra como núcleo.
 * Polígono Industrial Los Prados, Polígono Industrial Sierra Ascoy y Polígono del Búho quedan los tres. Los Prados y El Búho no son el mismo.
 * El polígono de Ascoy entra como Polígono Industrial Sierra Ascoy.
 * Cieza Norte no entra. Sigue en proyecto.
 * Mazarrón: debajo de Murcia, entre Lorca y Molina de Segura. El núcleo, el Puerto, Bolnuevo y las pedanías del padrón.
 * El núcleo del padrón entra como Mazarrón. Es el casco.
 * Puerto de Mazarrón entra. No es pedanía. Es el otro núcleo.
 * Bolnuevo entra. La pedanía del padrón es Moreras. Bolnuevo es el pueblo de la costa.
 * Las Moreras entra como Moreras. La Majada entra como Majada. El Saladillo entra como Saladillo. La Atalaya entra como Atalaya.
 * El Alamillo, Las Balsicas y Los Lorentes no entran aparte. Quedan en Balsicas.
 * Ifre y Cañada de Gallego entran juntos, como Ifre-Cañada de Gallego. Ifre y Pastrana entran juntos, como Ifre-Pastrana.
 * Camposol no entra aparte. Queda en Saladillo.
 * El Margajón no entra. No tiene habitantes.
 * No hay un polígono con nombre propio.
 * Totana: debajo de Murcia, entre Torre-Pacheco y Yecla. Los barrios del casco y las ocho pedanías. El polígono.
 * La Era Alta queda con ese nombre. También se escribe Era Alta. Entra una sola vez.
 * San José queda con ese nombre. También se escribe Barrio de San José. Entra una sola vez.
 * El Paretón-Cantareros queda con ese nombre. El padrón lo escribe Paretón. También se escribe El Paretón. Cantareros no entra aparte.
 * Ñorica queda con ese nombre. También se escribe La Ñorica. Entra una sola vez.
 * Raiguero queda con ese nombre. También se escribe El Raiguero. Raiguero Bajo no entra aparte.
 * Lébor queda con ese nombre. También se escribe Lebor. Entra una sola vez.
 * Carivete no entra aparte. Queda en Las Viñas.
 * Polígono Industrial El Saladar queda con ese nombre. También se llama Polígono Industrial de Totana. Las calles del polígono no entran aparte.
 * Albacete: capital, en negrita, delante de Alicante. Los barrios de los distritos y los núcleos del padrón. Los polígonos del municipio.
 * Fátima y Franciscanos quedan con ese nombre. El Ensanche no entra aparte.
 * Polígono San Antón es barrio. Está en dos distritos. Entra una sola vez.
 * Campollano es barrio. El polígono entra como Parque Empresarial Campollano. También se escribe Parque Empresarial de Campollano.
 * Polígono Industrial Romica queda con ese nombre. También se escribe Polígono Industrial de Romica.
 * Cerrolobo queda con ese nombre. También se escribe Cerro Lobo.
 * Los Llanos, Los Llanos del Águila y la Base Aérea de Los Llanos quedan los tres.
 * San Antonio y San Antonio Abad quedan los dos.
 * Centro es el casco. La urbanización entra como Urbanización Centro.
 * Huerta de Monroy entra una sola vez.
 * Las Cañicas queda con ese nombre. También se escribe Cañicas.
 * El polígono de Ajusa entra como Polígono Industrial de la Automoción.
 * Los polígonos de los pueblos de al lado no entran.
 * Hellín: debajo de Albacete, justo detrás de la capital. El barrio de San Rafael, El Calvario, Santa Bárbara y las doce pedanías. Los tres polígonos.
 * El Calvario queda con ese nombre. Las dos partes del catastro son el mismo barrio.
 * Las Minas queda con ese nombre. También se escribe Minas.
 * La Horca queda con ese nombre. También se escribe Horca.
 * Nava de Campaña queda con ese nombre. También se escribe Nava de Campana.
 * Torre Uchea queda con ese nombre. También se escribe Uchea.
 * Rincón del Moro queda con ese nombre.
 * El Lugarico no entra aparte. Queda en Agra.
 * Polígono Industrial La Losilla queda con ese nombre. Las fases son el mismo polígono.
 * Polígono Industrial de la Fuente queda con ese nombre.
 * Polígono Industrial San Rafael queda con ese nombre. La tercera fase es el mismo. El barrio San Rafael entra aparte.
 * Ciudad Real: capital, en negrita, delante de Córdoba. Los veinte barrios de la delimitación de 2016 y los tres polígonos.
 * Plaza Mayor, Los Ángeles y El Perchel entran una sola vez. El distrito los parte, pero son el mismo barrio.
 * Puerta de Toledo-Atalaya queda con ese nombre. Puerta de Toledo y Atalaya no entran aparte.
 * Puerta de Santa María queda con ese nombre. También se escribe Puerta Santa María.
 * Santa María, San Pedro y Santiago son los barrios antiguos. No entran aparte.
 * Oriente y La Corredera son el mismo sitio. No entran aparte.
 * Poniente, Alarcos y La Peseta son el mismo barrio antiguo. Entra Camino de Alarcos.
 * Pío XII y Jacobo Roldán no entran. No están en la delimitación.
 * Polígono Industrial Avanzado queda con ese nombre. También se llama polígono de la Carretera de Carrión. Puerta del AVE no entra aparte.
 * Polígono Industrial Larache y Polígono Industrial Puerta de Toledo quedan los dos. Larache y Puerta de Toledo-Atalaya siguen como barrios.
 * Puertollano: debajo de Ciudad Real, justo detrás de la capital. Los once barrios del Ayuntamiento y los tres polígonos.
 * Las Mercedes queda con ese nombre. También se llama El Pino.
 * Fraternidad queda con ese nombre. Las 600 son una zona de ese barrio. No entran aparte.
 * El Villar queda con ese nombre. También se escribe El Villar de Puertollano.
 * Constitución queda con ese nombre. También se llama Abulagar y La Constitución.
 * Centro Sur queda con ese nombre. Centro no entra aparte.
 * Polígono Industrial La Nava queda con ese nombre. También se escribe polígono industrial de La Nava. La Nava I y La Nava III son el mismo polígono.
 * Polígono Industrial Sepes queda con ese nombre. También se escribe Polígono Industrial de Sepes.
 * Polígono Aragonesas queda con ese nombre. Industrias Aragonesas es la empresa. No entra aparte.
 * El complejo de Repsol no entra. No es un polígono.
 * Tomelloso: debajo de Ciudad Real, detrás de Puertollano. Los nueve barrios del pleno y los polígonos del centro de empresas.
 * San José Obrero queda con ese nombre. También se escribe de San José Obrero.
 * San Antonio queda con ese nombre. También se escribe de San Antonio.
 * Nuevo Tomelloso queda con ese nombre. También se escribe del Nuevo Tomelloso.
 * José María del Moral queda con ese nombre. La mayúscula de Del es el mismo barrio.
 * El Carmen es el barrio del Carmen. Carmen y Del Carmen no entran aparte.
 * El Pilar es el barrio del Pilar. Pilar y Del Pilar no entran aparte.
 * Maternidad es el barrio de Maternidad. De Maternidad no entra aparte.
 * San Juan es el barrio de San Juan. De San Juan no entra aparte.
 * Europa queda con ese nombre. También se escribe de Europa.
 * Polígono Industrial Los Portales queda con ese nombre. También se llama Parque Empresarial Los Portales y polígono SEPES.
 * Polígono Industrial El Bombo queda con ese nombre. También se escribe Polígono El Bombo.
 * El 23 y el 32 son dos polígonos. El folleto los escribe juntos como 23-32. No entran con ese nombre.
 * Virgen de las Viñas y Bodegas Fundador son bodegas. No entran aparte.
 * Alcázar de San Juan: debajo de Ciudad Real, delante de Puertollano. Los barrios de la lista y los dos polígonos.
 * Goya, La Pradera, La Paz, Los Devis, Los Multicines, San Francisco y Santa María quedan con ese nombre. La palabra Barrio no entra.
 * El Arenal es el barrio del Arenal. Arenal no entra aparte.
 * Casco Antiguo queda con ese nombre. También se escribe Barrio del Casco Antiguo.
 * El Porvenir es el barrio del Porvenir. Porvenir no entra aparte.
 * Parque Viejo, Castelar, Cruz Roja y Zona Centro quedan con ese nombre. La palabra Barrio no entra.
 * Urbanización Avenida Pablo Iglesias queda con ese nombre. También se escribe Urbanización Av. Pablo Iglesias.
 * Polígono Industrial Alces queda con ese nombre. Las fases I, II y III son el mismo polígono.
 * Polígono Industrial Emilio Castro queda con ese nombre. Las fases son el mismo polígono.
 * Valdepeñas: debajo de Ciudad Real, detrás de Tomelloso. Los barrios de la lista y los ocho polígonos.
 * Fátima, Juan Alcaide, La Manzana, Los Llanos, Virgen de la Cabeza y Zona Centro quedan con ese nombre. La palabra Barrio no entra.
 * El Cristo es el barrio del Cristo. Cristo no entra aparte.
 * El Lucero es el barrio del Lucero. Lucero no entra aparte.
 * Cachiporro sigue como barrio. El polígono se llama Polígono Industrial El Cachiporro.
 * Consolación sigue como barrio. El polígono se llama Polígono Logístico de Consolación.
 * Polígono Industrial Entrecaminos queda con ese nombre. Las fases I y II son el mismo polígono.
 * Cuenca: capital, en negrita, detrás de Lucena y delante de Granada. Los barrios de la lista y los diez polígonos.
 * Cerro de la Estrella queda con ese nombre. Antes se llamaba Cerro de la Horca. No entra aparte.
 * Cólliga y Colliguilla quedan las dos.
 * Los Tiradores Altos y Los Tiradores Bajos quedan los dos.
 * Guadalajara: capital, en negrita, detrás de Motril. Los barrios de la lista y los seis polígonos.
 * Los Escritores queda con ese nombre. La palabra Barrio no entra.
 * Balconcillo sigue como barrio. El polígono se llama Polígono Industrial El Balconcillo.
 * Taracena sigue como barrio. La zona industrial entra aparte.
 * Polígono Industrial El Henares y Polígono Industrial El Henares-Ampliación quedan los dos.
 * Azuqueca de Henares: debajo de Guadalajara, justo detrás de la capital. Los barrios de la lista y los siete polígonos.
 * La Estación queda con ese nombre. La palabra Barrio no entra.
 * El Vallejo es el barrio del Vallejo. Vallejo no entra aparte. Parque del Vallejo entra aparte.
 * El Foro es el barrio del Foro. Foro no entra aparte.
 * Polígono Industrial Aida I y Polígono Industrial Aida II quedan los dos.
 * Oviedo: capital de Asturias, en negrita, detrás de Ourense y delante de Avilés. Los barrios de la lista y los nueve polígonos.
 * Olloniego sigue como barrio. El polígono se llama Polígono Industrial Olloniego.
 * Tudela Veguín sigue como barrio. El polígono se llama Polígono Industrial de Tudela Veguín.
 * Trubia sigue como barrio. El área industrial entra aparte.
 * Área Industrial de Olloniego-Tudela y Polígono Industrial de Olloniego-Tudela quedan los dos.
 * Ames: debajo de A Coruña, justo detrás de la capital y delante de Arteixo. Los barrios de la lista y un polígono.
 * Parque Empresarial Novo Milladoiro queda con ese nombre. Polígono Industrial de O Milladoiro es el mismo sitio. No entra aparte.
 * O Milladoiro sigue como barrio.
 * Bertamiráns y Bertamiráns – O Bosque quedan los dos. Igual Bugallido, Ortoño y Piñeiro con su zona de al lado.
 * Arteixo: debajo de A Coruña, detrás de Ames y delante de Carballo. Los barrios de la lista y los cinco polígonos.
 * Arteixo entra también como barrio, como lo escribiste.
 * Morás sigue como barrio. El parque empresarial entra aparte.
 * Suevos sigue como barrio. El parque empresarial entra aparte. Suevos de Abaixo y Suevos de Arriba quedan los dos.
 * Barrañán y Barrañán de Arriba quedan los dos. Igual Chamín, Oseiro y Sol y Mar con su zona de al lado.
 * Carballo: debajo de A Coruña, detrás de Arteixo y delante de Culleredo. Los barrios de la lista y los tres polígonos.
 * Carballo entra también como barrio, como lo escribiste.
 * Bértoa sigue como barrio. Parque Empresarial de Bértoa queda con ese nombre. Las fases I y II son el mismo polígono.
 * Culleredo: debajo de A Coruña, detrás de Carballo y delante de Ferrol. Los barrios de la lista y los cinco polígonos.
 * Culleredo entra también como barrio, como lo escribiste.
 * A Marisqueira sigue como barrio. El polígono se llama Polígono Industrial A Marisqueira.
 * Alvedro sigue como barrio. El parque empresarial entra aparte.
 * Ledoño sigue como barrio. El centro logístico y la zona industrial entran aparte, los dos.
 * Ribeira: debajo de A Coruña, detrás de Oleiros y delante de Santiago de Compostela. Los barrios de la lista y los dos polígonos.
 * Ribeira (Santa Uxía) queda con ese nombre. Ribeira no entra aparte.
 * Oleiros y Palmeira siguen como barrios. El polígono nuevo entra aparte, con el nombre entero.
 * Areeiros y Areeiros de Carreira quedan los dos. Deán Grande y Deán Pequeno quedan los dos.
 * La Nucía: debajo de Alicante, detrás de Jávea (Xàbia) y delante de Orihuela. Los barrios de la lista y un polígono.
 * La Nucía Pueblo queda con ese nombre. La Nucía no entra aparte.
 * Colina, La queda con ese nombre, como lo escribiste.
 * Nou Espai I y Nou Espai II quedan los dos.
 * Arcos Este, Arcos Norte y Los Arcos quedan los tres. Pinar de Garaita y Pla de Garaita quedan los dos.
 * Avilés: debajo de Oviedo, justo detrás de la capital y delante de Gijón. Los barrios de la lista y los seis polígonos.
 * Polígono de La Magdalena queda como barrio. El polígono se llama Polígono Industrial de La Magdalena.
 * Valliniello sigue como barrio. El polígono se llama Polígono Industrial de Valliniello.
 * San Juan de Nieva sigue como barrio. La zona industrial entra aparte.
 * Parque Empresarial Principado de Asturias (PEPA) queda con ese nombre. PEPA es el mismo parque.
 * Langreo: debajo de Oviedo, detrás de Gijón y delante de Mieres. Los barrios de la lista y los once polígonos.
 * La Felguera sigue como barrio. La Felguera - Barrio Urquijo, La Felguera - Grupo San Pedro y La Felguera - Grupo La Concordia quedan las tres.
 * Barros y Riaño y Lada siguen como barrios. Sus polígonos entran aparte.
 * Polígono Industrial Riaño I, Riaño II y Riaño III quedan los tres.
 * Mieres: debajo de Oviedo, detrás de Langreo y delante de Siero. Los barrios de la lista y los once polígonos.
 * Mieres del Camín queda con ese nombre. Mieres no entra aparte.
 * Ablaña, Baiña, Loredo, Ujo y Vega de Arriba siguen como barrios. Sus polígonos entran aparte.
 * Polígono Industrial Baiña (Vega de Baiña) queda con ese nombre. Vega de Baiña no entra aparte.
 * Polígono Industrial Las Lleras (Ujo) queda con ese nombre.
 * Siero: debajo de Oviedo, detrás de Mieres y delante de Palencia. Los barrios de la lista y los veintitrés polígonos.
 * La Pola Siero queda con ese nombre. Siero no entra aparte.
 * Granda y Viella están en las dos listas. El barrio se queda con el nombre corto. El polígono sale con la marca delante.
 * El Berrón sigue como barrio. Berrón Este, Berrón Oeste y Berrón Sur quedan los tres.
 * Bobes, Lieres y Lugones siguen como barrios. Bobes-San Miguel, Lieres-Solvay, Lugones Norte y Lugones Sur entran aparte.
 * Carbayín Alto, Carbayín Bajo y Santa Marta de Carbayín quedan los tres.
 * Martorell: debajo de Barcelona, detrás de Manresa y delante de Mataró. Los barrios de la lista y los ocho polígonos.
 * Martorell Vell (La Vila) queda con ese nombre. Martorell no entra aparte.
 * Can Bros y Rosanes están en las dos listas. El barrio se queda con el nombre corto. El polígono sale con la marca delante.
 * Can Cases sigue como barrio. Can Cases–Can Sunyol entra aparte.
 * Polígono SEAT y Polígono Solvay quedan con ese nombre.
 * Santa Perpètua de Mogoda: debajo de Barcelona, detrás de Santa Coloma de Gramenet y delante de Sitges. Los barrios de la lista y los doce polígonos.
 * Mogoda queda como barrio. Santa Perpètua de Mogoda no entra aparte.
 * La Florida y Santiga están en las dos listas. El barrio se queda con el nombre corto. El polígono sale con la marca delante.
 * Can Vinyalets y Can Vinyals quedan los dos.
 * El sector Alstom de la visita de mayo de 2026 no entra. La lista más reciente tiene doce polígonos.
 * Palma: capital de Illes Balears, detrás de Palencia y delante de Pamplona. Los 62 barrios de la lista y once polígonos.
 * Son Ferriol está en las dos listas. El barrio se queda con el nombre corto. El polígono sale con la marca delante.
 * Calvià: debajo de Illes Balears, detrás de Palma y delante de Ciutadella de Menorca. Los barrios de la lista y un polígono.
 * Calvià Vila queda con ese nombre. Calvià no entra aparte.
 * Son Bugadelles queda como polígono.
 * Ciutadella de Menorca: debajo de Illes Balears, detrás de Calvià y delante de Llucmajor. Los barrios de la lista y un polígono.
 * Ciutadella (casco urbano) queda con ese nombre. Ciutadella de Menorca no entra aparte.
 * Polígono Industrial de Ciutadella (POICI) queda con ese nombre.
 * Llucmajor: debajo de Illes Balears, detrás de Ciutadella de Menorca y delante de Manacor. Los barrios de la lista y dos polígonos.
 * Llucmajor (casco urbano) queda con ese nombre. Llucmajor no entra aparte.
 * Son Noguera y Son Fosquet quedan como polígonos.
 * Manacor: debajo de Illes Balears, detrás de Llucmajor y delante de Maó. Los barrios de la lista y tres polígonos.
 * Manacor (casco urbano) queda con ese nombre. Manacor no entra aparte.
 * s’Illot queda con ese nombre. Son Talent queda como polígono.
 * Maó: debajo de Illes Balears, detrás de Manacor y delante de Marratxí. Los barrios de la lista y un polígono.
 * Maó (casco urbano) queda con ese nombre. Maó no entra aparte.
 * POIMA (Polígono Industrial de Maó) queda con ese nombre.
 * Marratxí: debajo de Illes Balears, detrás de Maó y delante de Santa Eulària des Riu. Los barrios de la lista y dos polígonos.
 * Can Rubiol queda como polígono. Polígono Industrial de Marratxí queda con ese nombre.
 * Santa Eulària des Riu: debajo de Illes Balears, detrás de Marratxí y delante de Pamplona. Los barrios de la lista y seis polígonos.
 * Santa Eulària des Riu (casco urbano) queda con ese nombre. Santa Eulària des Riu no entra aparte.
 * Can Negre está en las dos listas. El barrio se queda con el nombre corto. El polígono sale con la marca delante.
 * Cádiz: capital, detrás de Plasencia y delante de Algeciras. Los barrios de la lista y cuatro polígonos.
 * Recinto Exterior de la Zona Franca y Recinto Interior de la Zona Franca quedan los dos.
 * Algeciras: debajo de Cádiz, justo detrás de la capital y delante de Arcos de la Frontera. Los barrios de la lista y cuatro polígonos.
 * Arcos de la Frontera: debajo de Cádiz, detrás de Algeciras y delante de Chiclana de la Frontera. Los barrios de la lista y cuatro polígonos.
 * El Retiro y Jédula están en las dos listas. El barrio se queda con el nombre corto. El polígono sale con la marca delante.
 * Chiclana de la Frontera: debajo de Cádiz, detrás de Arcos de la Frontera y delante de El Puerto de Santa María. Los barrios de la lista y seis polígonos.
 * Pelagatos I y Pelagatos II (Miralrío) quedan los dos.
 * El Puerto de Santa María: debajo de Cádiz, detrás de Chiclana de la Frontera y delante de Jerez de la Frontera. Los barrios de la lista y once polígonos.
 * Las Salinas de Levante, Poniente, San José Alto y San José Bajo quedan las cuatro.
 * Jerez de la Frontera: debajo de Cádiz, detrás de El Puerto de Santa María y delante de Puerto Real. Los barrios y núcleos de la lista y diecinueve polígonos.
 * El Portal, Estella del Marqués y Pozoalbero están en las dos listas. El barrio se queda con el nombre corto. El polígono sale con la marca delante.
 * Puerto Real: debajo de Cádiz, detrás de Jerez de la Frontera y delante de San Roque. Los barrios de la lista y cinco polígonos.
 * Río San Pedro sigue como barrio. El polígono se llama Río San Pedro – Zona Industrial.
 * San Roque: debajo de Cádiz, detrás de Puerto Real y delante de Sanlúcar de Barrameda. Los barrios de la lista y cuatro polígonos.
 * San Roque (casco urbano) queda con ese nombre. San Roque no entra aparte.
 * Guadarranque está en las dos listas. El barrio se queda con el nombre corto. El polígono sale con la marca delante.
 * Campamento sigue como barrio. El polígono se llama Campamento (Incosur).
 * Sanlúcar de Barrameda: debajo de Cádiz, detrás de San Roque y delante de Ciudad Real. Los barrios de la lista y tres polígonos.
 * La Gallarda y Las Palmeras están en las dos listas. El barrio se queda con el nombre corto. El polígono sale con la marca delante.
 * Sanlúcar de Barrameda no entra como barrio.
 * Las Palmas de Gran Canaria: capital de Las Palmas, en negrita, detrás de Jaén y delante de León. Los barrios de la lista y ocho polígonos.
 * Barranco Seco, Escaleritas y Miller Bajo están en las dos listas. El barrio se queda con el nombre corto. El polígono sale con la marca delante.
 * Las Torres – Lomo Blanco queda como una sola zona industrial.
 * Ayuntamiento de Las Palmas+3 y Ayuntamiento de Las Palmas+2 son fuentes. No entran en el desplegable.
 * Las Palmas de Gran Canaria no entra como barrio.
 * Agüimes: debajo de Las Palmas de Gran Canaria, detrás de la capital y delante de Arucas. Los barrios de la lista y dos polígonos.
 * Agüimes (casco) queda con ese nombre. Agüimes no entra aparte.
 * Polígono Residencial de Arinaga es barrio. Polígono Industrial de Arinaga es polígono.
 * Espinales (Los) es barrio. Espinales Industrial es polígono.
 * Arucas: debajo de Las Palmas de Gran Canaria, detrás de Agüimes y delante de Ingenio. Los barrios de la lista. Sin polígonos.
 * Arucas (casco) queda con ese nombre. Arucas no entra aparte.
 * El Portichuelo, Hoya López y Rosa Silva entran. Montaña Blanca entra una sola vez.
 * Ingenio: debajo de Las Palmas de Gran Canaria, detrás de Arucas y delante de La Oliva. Los barrios de la lista y tres polígonos.
 * Ingenio (casco urbano) queda con ese nombre. Ingenio no entra aparte.
 * La Pasadilla y Pasadilla quedan las dos. Las Majoreras es barrio. Las Majoreras – Lomo el Cardón es polígono.
 * transparencia.ingenio.es+5 es la fuente. No entra en el desplegable.
 * La Oliva: debajo de Las Palmas de Gran Canaria, detrás de Ingenio y delante de Puerto del Rosario. Los barrios de la lista y dos polígonos.
 * La Oliva (casco) queda con ese nombre. La Oliva no entra aparte.
 * El Cotillo (Tostón) queda con ese nombre.
 * Puerto del Rosario: debajo de Las Palmas de Gran Canaria, detrás de La Oliva y delante de San Bartolomé de Tirajana. Los barrios de la lista y seis polígonos.
 * Puerto del Rosario (casco urbano) queda con ese nombre. Puerto del Rosario no entra aparte.
 * El Matorral está en las dos listas. El barrio se queda con el nombre corto. El polígono sale con la marca delante.
 * Barranco de Negrín no entra: sigue en urbanización junto a Risco Prieto.
 * Ayuntamiento de Puerto del Rosario Fuerteventura+5 es la fuente. No entra en el desplegable.
 * San Bartolomé de Tirajana: debajo de Las Palmas de Gran Canaria, detrás de Puerto del Rosario y delante de Santa Lucía de Tirajana. Los barrios de la lista y dos polígonos.
 * San Bartolomé (Tunte) y Tunte quedan las dos. San Bartolomé de Tirajana no entra como barrio.
 * El Tablero es barrio. Polígono Industrial El Tablero es polígono. Juan Grande es barrio. Juan Grande Industrial es polígono.
 * Santa Lucía de Tirajana: debajo de Las Palmas de Gran Canaria, detrás de San Bartolomé de Tirajana y delante de Telde. Los barrios de la lista y tres polígonos.
 * Santa Lucía (casco) queda con ese nombre. Santa Lucía de Tirajana no entra como barrio.
 * Rosiana, Rosiana Alta y Rosiana Baja quedan las tres.
 * El Doctoral es barrio. El Doctoral Industrial es polígono. La Blanca es barrio. La Blanca – Zona Industrial Agrícola es polígono.
 * El Parque Tecnológico de Santa Lucía no entra: sigue urbanizable en desarrollo.
 * TI_V1_MEM_INF.docx+5 es la fuente. No entra en el desplegable.
 * Telde: debajo de Las Palmas de Gran Canaria, detrás de Santa Lucía de Tirajana y delante de León. Los barrios de la lista y catorce polígonos.
 * El Goro y Jinámar están en las dos listas. El barrio se queda con el nombre corto. El polígono sale con la marca delante.
 * El Goro II y El Goro III quedan los dos. Salinetas es barrio. Las Salinetas es polígono.
 * Telde no entra como barrio. Ayuntamiento de Telde+1 y Ayuntamiento de Telde+6 son fuentes. No entran.
 * Santa Cruz de Tenerife: capital de Santa Cruz de Tenerife, en negrita, detrás de San Sebastián y delante de Santander. Los barrios de la lista y doce polígonos.
 * Chamberí y Cueva Bermeja están en barrio y en zona industrial, con nombre distinto en el polígono.
 * Mayorazgo es barrio. El Mayorazgo (polígono industrial) es polígono. Moraditas es barrio. Las Moraditas (zona industrial) es polígono.
 * Costa Sur y El Mayorazgo son los dos polígonos propiamente dichos; el resto entran como zonas industriales.
 * Santa Cruz de Tenerife no entra como barrio. Urbanismo Santa Cruz+1 y Santa Cruz de Tenerife+2 son fuentes. No entran.
 * Adeje: debajo de Santa Cruz de Tenerife, detrás de la capital y delante de Santander. Los barrios de la lista y dos polígonos.
 * Adeje Casco queda con ese nombre. Adeje no entra aparte.
 * Los Olivos está en las dos listas. El barrio se queda con el nombre corto. El polígono sale con la marca delante.
 * Las fases de La Atalaya no entran aparte. Gobierno de Canarias+2 y Ayuntamiento de Adeje+1 son fuentes. No entran.
 */
export type TipoZona = "barrio" | "poligono";

export const ETIQUETA_MUNICIPIO_URBANO =
  "Municipios de más de 25000 habitantes";

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
  { nombre: "Los Vadillos", tipo: "barrio" },
  { nombre: "Río Vena", tipo: "barrio" },
  { nombre: "Los Ríos - Vista Alegre", tipo: "barrio" },
  { nombre: "San Pedro de la Fuente", tipo: "barrio" },
  { nombre: "Fuentecillas", tipo: "barrio" },
  { nombre: "San Juan Bautista (Barriada Yagüe)", tipo: "barrio" },
  { nombre: "Huelgas - El Pilar", tipo: "barrio" },
  { nombre: "San Julián", tipo: "barrio" },
  { nombre: "El Crucero - San José", tipo: "barrio" },
  { nombre: "San Pedro y San Felices", tipo: "barrio" },
  { nombre: "Villatoro", tipo: "barrio" },
  { nombre: "Villayuda - La Ventilla", tipo: "barrio" },
  { nombre: "Villalonquéjar (barrio)", tipo: "barrio" },
  { nombre: "Villagonzalo Arenas", tipo: "barrio" },
  { nombre: "Villafría", tipo: "barrio" },
  { nombre: "Cótar", tipo: "barrio" },
  { nombre: "Cortes", tipo: "barrio" },
  { nombre: "La Cellophane", tipo: "barrio" },
  { nombre: "Los Parralillos", tipo: "barrio" },
  { nombre: "Juan XXIII", tipo: "barrio" },
  { nombre: "San Agustín", tipo: "barrio" },
  { nombre: "Centro", tipo: "barrio" },
];

const POLIGONOS_BURGOS: ZonaCiudad[] = [
  { nombre: "Polígono Industrial Villalonquéjar I", tipo: "poligono" },
  { nombre: "Polígono Industrial Villalonquéjar II", tipo: "poligono" },
  { nombre: "Polígono Industrial Villalonquéjar III", tipo: "poligono" },
  { nombre: "Polígono Industrial Villalonquéjar IV", tipo: "poligono" },
  { nombre: "Polígono Industrial Gamonal", tipo: "poligono" },
  { nombre: "Polígono Industrial Gamonal-Villímar", tipo: "poligono" },
  { nombre: "Polígono Industrial Villayuda", tipo: "poligono" },
  { nombre: "Polígono Industrial Castañares", tipo: "poligono" },
  { nombre: "Polígono Industrial Monte de la Abadesa", tipo: "poligono" },
  { nombre: "Polígono Industrial Pentasa I", tipo: "poligono" },
  { nombre: "Polígono Industrial Pentasa II", tipo: "poligono" },
  { nombre: "Polígono Industrial Alto de la Varga", tipo: "poligono" },
  { nombre: "Polígono Industrial Villafría", tipo: "poligono" },
  { nombre: "Área Industrial Fábrica Nacional de Moneda y Timbre (FNMT)", tipo: "poligono" },
  { nombre: "Área Industrial Carretera de Madrid", tipo: "poligono" },
  { nombre: "Polígono Empresarial Landa", tipo: "poligono" },
  { nombre: "Polígono Empresarial Inbisa-Landa", tipo: "poligono" },
  { nombre: "Polígono Empresarial Automoba-Hipercor", tipo: "poligono" },
  { nombre: "Centro de Transportes de Burgos", tipo: "poligono" },
  { nombre: "Parque Tecnológico de Burgos", tipo: "poligono" },
  { nombre: "Centro de Actividades Económicas (CAE)", tipo: "poligono" },
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

const BARRIOS_CAMARGO: ZonaCiudad[] = [
  { nombre: "Cacicedo", tipo: "barrio" },
  { nombre: "Camargo", tipo: "barrio" },
  { nombre: "Escobedo", tipo: "barrio" },
  { nombre: "Herrera", tipo: "barrio" },
  { nombre: "Igollo", tipo: "barrio" },
  { nombre: "Maliaño", tipo: "barrio" },
  { nombre: "Muriedas", tipo: "barrio" },
  { nombre: "Revilla", tipo: "barrio" },
];

const POLIGONOS_CAMARGO: ZonaCiudad[] = [
  { nombre: "Polígono · Camargo", tipo: "poligono" },
  { nombre: "Cross", tipo: "poligono" },
  { nombre: "Elegarcu", tipo: "poligono" },
  { nombre: "La Cerrada", tipo: "poligono" },
  { nombre: "La Esprilla", tipo: "poligono" },
  { nombre: "La Maruca", tipo: "poligono" },
  { nombre: "La Verde", tipo: "poligono" },
  { nombre: "Ojaiz", tipo: "poligono" },
  { nombre: "Parayas", tipo: "poligono" },
  { nombre: "Raos", tipo: "poligono" },
  { nombre: "Ría del Carmen", tipo: "poligono" },
  { nombre: "Trascueto", tipo: "poligono" },
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

const BARRIOS_VILAGARCIA: ZonaCiudad[] = [
  { nombre: "Vilagarcía (Santa Baia)", tipo: "barrio" },
  { nombre: "O Carril (Santiago)", tipo: "barrio" },
  { nombre: "Vilaxoán", tipo: "barrio" },
  { nombre: "Arealonga (Santa Baia)", tipo: "barrio" },
  { nombre: "Bamio (San Xens)", tipo: "barrio" },
  { nombre: "Cea (San Pedro)", tipo: "barrio" },
  { nombre: "Cornazo (San Pedro)", tipo: "barrio" },
  { nombre: "Fontecarmoa (San Pedro)", tipo: "barrio" },
  { nombre: "Rubiáns (Santa María)", tipo: "barrio" },
  { nombre: "Sobradelo (San Salvador)", tipo: "barrio" },
  { nombre: "Sobrán (San Martiño)", tipo: "barrio" },
  { nombre: "Solobeira (San Fins)", tipo: "barrio" },
];

const POLIGONOS_VILAGARCIA: ZonaCiudad[] = [
  { nombre: "Polígono Bamio", tipo: "poligono" },
  { nombre: "Trabanca", tipo: "poligono" },
  { nombre: "O Pousadoiro", tipo: "poligono" },
];

const BARRIOS_A_ESTRADA: ZonaCiudad[] = [
  { nombre: "A Estrada (casco urbano)", tipo: "barrio" },
  { nombre: "Agar", tipo: "barrio" },
  { nombre: "Aguións", tipo: "barrio" },
  { nombre: "Arca", tipo: "barrio" },
  { nombre: "Arnois", tipo: "barrio" },
  { nombre: "Baloira", tipo: "barrio" },
  { nombre: "Barbude", tipo: "barrio" },
  { nombre: "Barcala", tipo: "barrio" },
  { nombre: "Berres", tipo: "barrio" },
  { nombre: "Callobre", tipo: "barrio" },
  { nombre: "Cereixo", tipo: "barrio" },
  { nombre: "Codeseda", tipo: "barrio" },
  { nombre: "Cora", tipo: "barrio" },
  { nombre: "Couso", tipo: "barrio" },
  { nombre: "Curantes", tipo: "barrio" },
  { nombre: "Frades", tipo: "barrio" },
  { nombre: "Guimarei", tipo: "barrio" },
  { nombre: "Lagartóns", tipo: "barrio" },
  { nombre: "Lamas", tipo: "barrio" },
  { nombre: "Liripio", tipo: "barrio" },
  { nombre: "Loimil", tipo: "barrio" },
  { nombre: "Matalobos", tipo: "barrio" },
  { nombre: "Moreira", tipo: "barrio" },
  { nombre: "Nigoi", tipo: "barrio" },
  { nombre: "Oca", tipo: "barrio" },
  { nombre: "Olives", tipo: "barrio" },
  { nombre: "Orazo", tipo: "barrio" },
  { nombre: "Ouzande", tipo: "barrio" },
  { nombre: "Parada", tipo: "barrio" },
  { nombre: "Paradela", tipo: "barrio" },
  { nombre: "Pardemarín", tipo: "barrio" },
  { nombre: "Remesar", tipo: "barrio" },
  { nombre: "Ribeira", tipo: "barrio" },
  { nombre: "Ribela", tipo: "barrio" },
  { nombre: "Riobó", tipo: "barrio" },
  { nombre: "Rubín", tipo: "barrio" },
  { nombre: "Sabucedo", tipo: "barrio" },
  { nombre: "San Miguel de Barcala", tipo: "barrio" },
  { nombre: "San Miguel de Castro", tipo: "barrio" },
  { nombre: "San Pedro de Ancorados", tipo: "barrio" },
  { nombre: "San Tomé de Ancorados", tipo: "barrio" },
  { nombre: "San Xiao de Vea", tipo: "barrio" },
  { nombre: "San Xurxo de Vea", tipo: "barrio" },
  { nombre: "Santa Cristina de Vea", tipo: "barrio" },
  { nombre: "Santeles", tipo: "barrio" },
  { nombre: "Santo André de Vea", tipo: "barrio" },
  { nombre: "A Somoza", tipo: "barrio" },
  { nombre: "Souto", tipo: "barrio" },
  { nombre: "Tabeirós", tipo: "barrio" },
  { nombre: "Toedo", tipo: "barrio" },
  { nombre: "Vinseiro", tipo: "barrio" },
];

const POLIGONOS_A_ESTRADA: ZonaCiudad[] = [
  { nombre: "Polígono Industrial de Toedo", tipo: "poligono" },
  { nombre: "Polígono Industrial de Ribeira", tipo: "poligono" },
];

const BARRIOS_CANGAS: ZonaCiudad[] = [
  { nombre: "A Alada", tipo: "barrio" },
  { nombre: "A Madalena", tipo: "barrio" },
  { nombre: "A Parada", tipo: "barrio" },
  { nombre: "A Pedreira", tipo: "barrio" },
  { nombre: "A Retirosa", tipo: "barrio" },
  { nombre: "A Rozada", tipo: "barrio" },
  { nombre: "A Serra de Nacente", tipo: "barrio" },
  { nombre: "A Serra de Poente", tipo: "barrio" },
  { nombre: "Aldán", tipo: "barrio" },
  { nombre: "Ameixide", tipo: "barrio" },
  { nombre: "Arneles", tipo: "barrio" },
  { nombre: "Balea", tipo: "barrio" },
  { nombre: "Cangas (casco urbano)", tipo: "barrio" },
  { nombre: "Cimadevila", tipo: "barrio" },
  { nombre: "Cunchido", tipo: "barrio" },
  { nombre: "Donón", tipo: "barrio" },
  { nombre: "Erbello", tipo: "barrio" },
  { nombre: "Gandón", tipo: "barrio" },
  { nombre: "Liméns", tipo: "barrio" },
  { nombre: "Menduiña", tipo: "barrio" },
  { nombre: "Nerga", tipo: "barrio" },
  { nombre: "O Castelo", tipo: "barrio" },
  { nombre: "O Carballal", tipo: "barrio" },
  { nombre: "O Cruceiro", tipo: "barrio" },
  { nombre: "O Outeiro", tipo: "barrio" },
  { nombre: "O Piñeiro", tipo: "barrio" },
  { nombre: "O Seixo", tipo: "barrio" },
  { nombre: "O Viso", tipo: "barrio" },
  { nombre: "O Igrexario", tipo: "barrio" },
  { nombre: "Pinténs", tipo: "barrio" },
  { nombre: "Romarigo", tipo: "barrio" },
  { nombre: "San Pedro", tipo: "barrio" },
  { nombre: "San Roque do Monte", tipo: "barrio" },
  { nombre: "Santa Marta", tipo: "barrio" },
  { nombre: "Vilanova", tipo: "barrio" },
  { nombre: "Vilariño", tipo: "barrio" },
  { nombre: "Viñó", tipo: "barrio" },
];

const POLIGONOS_CANGAS: ZonaCiudad[] = [
  { nombre: "A Portela", tipo: "poligono" },
  { nombre: "Alto de San Cosme", tipo: "poligono" },
];

const BARRIOS_LALIN: ZonaCiudad[] = [
  { nombre: "A Laxe", tipo: "barrio" },
  { nombre: "A Xesta", tipo: "barrio" },
  { nombre: "Botos", tipo: "barrio" },
  { nombre: "Catasós", tipo: "barrio" },
  { nombre: "Donramiro", tipo: "barrio" },
  { nombre: "Filgueira", tipo: "barrio" },
  { nombre: "Goiás", tipo: "barrio" },
  { nombre: "Lalín (casco urbano)", tipo: "barrio" },
  { nombre: "Moneixas", tipo: "barrio" },
  { nombre: "Noceda", tipo: "barrio" },
  { nombre: "O Corpiño", tipo: "barrio" },
  { nombre: "O Castro", tipo: "barrio" },
  { nombre: "Prado", tipo: "barrio" },
  { nombre: "Sello", tipo: "barrio" },
  { nombre: "Soutolongo", tipo: "barrio" },
  { nombre: "Vilatuxe", tipo: "barrio" },
  { nombre: "Zobra", tipo: "barrio" },
];

const POLIGONOS_LALIN: ZonaCiudad[] = [
  { nombre: "Polígono Industrial de Botos", tipo: "poligono" },
  { nombre: "Parque Empresarial Lalín 2000", tipo: "poligono" },
];

const BARRIOS_MARIN: ZonaCiudad[] = [
  { nombre: "A Cañota", tipo: "barrio" },
  { nombre: "A Lameira", tipo: "barrio" },
  { nombre: "A Pedreira", tipo: "barrio" },
  { nombre: "A Raña", tipo: "barrio" },
  { nombre: "A Veigaverde", tipo: "barrio" },
  { nombre: "Aguete", tipo: "barrio" },
  { nombre: "Ardán", tipo: "barrio" },
  { nombre: "Barriada de la Maestranza", tipo: "barrio" },
  { nombre: "Barriada de San Pedro", tipo: "barrio" },
  { nombre: "Cantodarea", tipo: "barrio" },
  { nombre: "Casco Vello", tipo: "barrio" },
  { nombre: "Mogor", tipo: "barrio" },
  { nombre: "O Campo", tipo: "barrio" },
  { nombre: "O Igrexario", tipo: "barrio" },
  { nombre: "O Sequelo", tipo: "barrio" },
  { nombre: "San Xián", tipo: "barrio" },
  { nombre: "Seixo", tipo: "barrio" },
  { nombre: "Sete Espadas", tipo: "barrio" },
  { nombre: "Vista Alegre", tipo: "barrio" },
];

const POLIGONOS_MARIN: ZonaCiudad[] = [
  { nombre: "Puerto de Marín (zona industrial y logística portuaria)", tipo: "poligono" },
];

const BARRIOS_REDONDELA: ZonaCiudad[] = [
  { nombre: "A Portela", tipo: "barrio" },
  { nombre: "Asnelle de Abaixo", tipo: "barrio" },
  { nombre: "Asnelle de Arriba", tipo: "barrio" },
  { nombre: "Cabeiro", tipo: "barrio" },
  { nombre: "Cedeira", tipo: "barrio" },
  { nombre: "Cesantes", tipo: "barrio" },
  { nombre: "Chapela", tipo: "barrio" },
  { nombre: "Negros", tipo: "barrio" },
  { nombre: "Quintela", tipo: "barrio" },
  { nombre: "Reboreda", tipo: "barrio" },
  { nombre: "Redondela (casco urbano)", tipo: "barrio" },
  { nombre: "Saxamonde", tipo: "barrio" },
  { nombre: "Trasmañó", tipo: "barrio" },
  { nombre: "Ventosela", tipo: "barrio" },
  { nombre: "Vilar de Infesta", tipo: "barrio" },
  { nombre: "O Viso", tipo: "barrio" },
];

const POLIGONOS_REDONDELA: ZonaCiudad[] = [
  { nombre: "O Muro", tipo: "poligono" },
];

const BARRIOS_CORUNA: ZonaCiudad[] = [
  { nombre: "Cidade Vella", tipo: "barrio" },
  { nombre: "Peixaría", tipo: "barrio" },
  { nombre: "Orzán", tipo: "barrio" },
  { nombre: "Monte Alto", tipo: "barrio" },
  { nombre: "Orillamar", tipo: "barrio" },
  { nombre: "Centro", tipo: "barrio" },
  { nombre: "As Atochas", tipo: "barrio" },
  { nombre: "As Lagoas", tipo: "barrio" },
  { nombre: "Agra de San Amaro", tipo: "barrio" },
  { nombre: "A Torre", tipo: "barrio" },
  { nombre: "Durmideiras", tipo: "barrio" },
  { nombre: "Pelamios", tipo: "barrio" },
  { nombre: "Zalaeta", tipo: "barrio" },
  { nombre: "A Maestranza", tipo: "barrio" },
  { nombre: "O Parrote", tipo: "barrio" },
  { nombre: "Xardíns do Recheo", tipo: "barrio" },
  { nombre: "Agra do Orzán", tipo: "barrio" },
  { nombre: "Riazor", tipo: "barrio" },
  { nombre: "Ensanche de Riazor", tipo: "barrio" },
  { nombre: "Cidade Xardín", tipo: "barrio" },
  { nombre: "Labañou", tipo: "barrio" },
  { nombre: "Sagrada Familia", tipo: "barrio" },
  { nombre: "O Ventorrillo", tipo: "barrio" },
  { nombre: "San Roque de Fóra", tipo: "barrio" },
  { nombre: "Santa Margarida", tipo: "barrio" },
  { nombre: "Peruleiro", tipo: "barrio" },
  { nombre: "Cidade Escolar", tipo: "barrio" },
  { nombre: "Paseo das Pontes", tipo: "barrio" },
  { nombre: "Ensanche", tipo: "barrio" },
  { nombre: "Os Castros", tipo: "barrio" },
  { nombre: "Os Mallos", tipo: "barrio" },
  { nombre: "A Gaiteira", tipo: "barrio" },
  { nombre: "A Falperra (Gurugú)", tipo: "barrio" },
  { nombre: "Catro Camiños", tipo: "barrio" },
  { nombre: "Juan Flórez", tipo: "barrio" },
  { nombre: "Santa Lucía", tipo: "barrio" },
  { nombre: "A Cubela", tipo: "barrio" },
  { nombre: "San Diego", tipo: "barrio" },
  { nombre: "A Sardiñeira", tipo: "barrio" },
  { nombre: "Vioño", tipo: "barrio" },
  { nombre: "Estación de Autobuses", tipo: "barrio" },
  { nombre: "Novos Xulgados", tipo: "barrio" },
  { nombre: "Ronda de Outeiro", tipo: "barrio" },
  { nombre: "Matogrande", tipo: "barrio" },
  { nombre: "Barrio das Flores", tipo: "barrio" },
  { nombre: "Lonzas", tipo: "barrio" },
  { nombre: "Estación", tipo: "barrio" },
  { nombre: "Polígono de Elviña 1ª Fase", tipo: "barrio" },
  { nombre: "Polígono de Elviña 2ª Fase", tipo: "barrio" },
  { nombre: "Ponte da Pedra", tipo: "barrio" },
  { nombre: "Xuxán", tipo: "barrio" },
  { nombre: "Eirís de Abaixo", tipo: "barrio" },
  { nombre: "Eirís de Arriba", tipo: "barrio" },
  { nombre: "Oza", tipo: "barrio" },
  { nombre: "Santa María de Oza", tipo: "barrio" },
  { nombre: "Castrillón", tipo: "barrio" },
  { nombre: "Monelos", tipo: "barrio" },
  { nombre: "Monserrat", tipo: "barrio" },
  { nombre: "Monte das Moas", tipo: "barrio" },
  { nombre: "Monte Mero", tipo: "barrio" },
  { nombre: "A Pasaxe", tipo: "barrio" },
  { nombre: "Poboado da Pasaxe", tipo: "barrio" },
  { nombre: "Parque de Eirís", tipo: "barrio" },
  { nombre: "Palavea", tipo: "barrio" },
  { nombre: "As Xubias", tipo: "barrio" },
  { nombre: "Casablanca", tipo: "barrio" },
  { nombre: "Río de Quintas", tipo: "barrio" },
  { nombre: "Fábrica de Armas", tipo: "barrio" },
  { nombre: "San Vicenzo de Elviña", tipo: "barrio" },
  { nombre: "Castro de Elviña", tipo: "barrio" },
  { nombre: "A Zapateira", tipo: "barrio" },
  { nombre: "Monte da Zapateira", tipo: "barrio" },
  { nombre: "Agra do Foxo", tipo: "barrio" },
  { nombre: "Campus Universitario de Elviña", tipo: "barrio" },
  { nombre: "Campus Universitario da Zapateira", tipo: "barrio" },
  { nombre: "O Escorial", tipo: "barrio" },
  { nombre: "Urbanización Valaire", tipo: "barrio" },
  { nombre: "Mesoiro", tipo: "barrio" },
  { nombre: "Novo Mesoiro", tipo: "barrio" },
  { nombre: "Feáns", tipo: "barrio" },
  { nombre: "Urbanización Breogán", tipo: "barrio" },
  { nombre: "Obradoiro", tipo: "barrio" },
  { nombre: "A Silva", tipo: "barrio" },
  { nombre: "O Birloque", tipo: "barrio" },
  { nombre: "Someso", tipo: "barrio" },
  { nombre: "San Cristovo das Viñas", tipo: "barrio" },
  { nombre: "Cances", tipo: "barrio" },
  { nombre: "As Rañas", tipo: "barrio" },
  { nombre: "Poboado das Rañas", tipo: "barrio" },
  { nombre: "A Moura", tipo: "barrio" },
  { nombre: "Comeanda", tipo: "barrio" },
  { nombre: "O Martinete", tipo: "barrio" },
  { nombre: "San Pedro de Visma", tipo: "barrio" },
  { nombre: "Os Rosais", tipo: "barrio" },
  { nombre: "Penamoa", tipo: "barrio" },
  { nombre: "O Portiño", tipo: "barrio" },
  { nombre: "A Gramela", tipo: "barrio" },
  { nombre: "Monte de San Pedro", tipo: "barrio" },
  { nombre: "Monte as Arcas", tipo: "barrio" },
  { nombre: "Monte Currelos", tipo: "barrio" },
  { nombre: "Monte Patelo", tipo: "barrio" },
  { nombre: "O Campanario", tipo: "barrio" },
  { nombre: "Bens", tipo: "barrio" },
  { nombre: "Nostián", tipo: "barrio" },
  { nombre: "San Xosé", tipo: "barrio" },
  { nombre: "A Artística", tipo: "barrio" },
  { nombre: "O Petón", tipo: "barrio" },
];

const POLIGONOS_CORUNA: ZonaCiudad[] = [
  { nombre: "Parque Empresarial de Agrela", tipo: "poligono" },
  { nombre: "Parque Empresarial de Pocomaco", tipo: "poligono" },
  { nombre: "Parque Empresarial de Vío", tipo: "poligono" },
  { nombre: "Parque Ofimático", tipo: "poligono" },
  { nombre: "Polígono de Someso", tipo: "poligono" },
];

const BARRIOS_SANTIAGO: ZonaCiudad[] = [
  { nombre: "Zona Monumental", tipo: "barrio" },
  { nombre: "Ensanche", tipo: "barrio" },
  { nombre: "Porta do Camiño", tipo: "barrio" },
  { nombre: "As Fontiñas", tipo: "barrio" },
  { nombre: "As Cancelas", tipo: "barrio" },
  { nombre: "Galeras", tipo: "barrio" },
  { nombre: "Santa Marta", tipo: "barrio" },
  { nombre: "Vite", tipo: "barrio" },
  { nombre: "Pontepedriña", tipo: "barrio" },
  { nombre: "Sar", tipo: "barrio" },
  { nombre: "San Lázaro (Santiago)", tipo: "barrio" },
  { nombre: "Vista Alegre (San Xoán)", tipo: "barrio" },
  { nombre: "Conxo (Santa María)", tipo: "barrio" },
  { nombre: "O Castiñeiriño (Nosa Señora de Fátima)", tipo: "barrio" },
  { nombre: "San Caetano (Santiago)", tipo: "barrio" },
  { nombre: "San Paio (Santiago)", tipo: "barrio" },
  { nombre: "A Peregrina (Santa María)", tipo: "barrio" },
  { nombre: "Figueiras (Santa María)", tipo: "barrio" },
  { nombre: "O Eixo (San Cristovo)", tipo: "barrio" },
  { nombre: "Aríns (San Martiño)", tipo: "barrio" },
  { nombre: "Bando (Santa Eulalia)", tipo: "barrio" },
  { nombre: "A Barciela (Santo André)", tipo: "barrio" },
  { nombre: "Busto (San Pedro)", tipo: "barrio" },
  { nombre: "O Carballal (San Xulián)", tipo: "barrio" },
  { nombre: "Cesar (Santa María)", tipo: "barrio" },
  { nombre: "A Enfesta (San Cristovo)", tipo: "barrio" },
  { nombre: "Fecha (San Xoán)", tipo: "barrio" },
  { nombre: "Santa Cristina de Fecha (Santa Cristina)", tipo: "barrio" },
  { nombre: "Grixoa (Santa María)", tipo: "barrio" },
  { nombre: "Laraño (San Martiño)", tipo: "barrio" },
  { nombre: "Marantes (San Vicente)", tipo: "barrio" },
  { nombre: "Marrozos (Santa María)", tipo: "barrio" },
  { nombre: "Nemenzo (Santa Cristina)", tipo: "barrio" },
  { nombre: "Sabugueira (San Paio)", tipo: "barrio" },
  { nombre: "Vidán (Divino Salvador)", tipo: "barrio" },
  { nombre: "Verdía (Santa Mariña)", tipo: "barrio" },
  { nombre: "Villestro (Santa María)", tipo: "barrio" },
];

const POLIGONOS_SANTIAGO: ZonaCiudad[] = [
  { nombre: "Polígono do Tambre", tipo: "poligono" },
  { nombre: "Boisaca", tipo: "poligono" },
  { nombre: "Costa Vella", tipo: "poligono" },
];

const BARRIOS_FERROL: ZonaCiudad[] = [
  { nombre: "Ferrol Vello", tipo: "barrio" },
  { nombre: "A Magdalena", tipo: "barrio" },
  { nombre: "Canido", tipo: "barrio" },
  { nombre: "Ensanche A", tipo: "barrio" },
  { nombre: "Ensanche B (Ultramar)", tipo: "barrio" },
  { nombre: "Recimil", tipo: "barrio" },
  { nombre: "Esteiro", tipo: "barrio" },
  { nombre: "Caranza", tipo: "barrio" },
  { nombre: "San Xoán-Bertón", tipo: "barrio" },
  { nombre: "Santa Mariña", tipo: "barrio" },
  { nombre: "Catabois", tipo: "barrio" },
  { nombre: "Santa Icía", tipo: "barrio" },
  { nombre: "San Felipe", tipo: "barrio" },
  { nombre: "Serantes (San Salvador)", tipo: "barrio" },
  { nombre: "A Cabana (Santo Antonio)", tipo: "barrio" },
  { nombre: "A Graña (Santa Rosa de Viterbo)", tipo: "barrio" },
  { nombre: "Brión (Santa María)", tipo: "barrio" },
  { nombre: "Doniños (San Román)", tipo: "barrio" },
  { nombre: "San Xurxo da Mariña (San Xurxo)", tipo: "barrio" },
  { nombre: "Esmelle (San Xoán)", tipo: "barrio" },
  { nombre: "Covas (San Martiño)", tipo: "barrio" },
  { nombre: "Marmancón (San Pedro)", tipo: "barrio" },
  { nombre: "Mandiá (Santa Uxía)", tipo: "barrio" },
  { nombre: "Leixa (San Pedro)", tipo: "barrio" },
  { nombre: "Santa Cecilia de Trasancos (Santa Cecilia)", tipo: "barrio" },
];

const POLIGONOS_FERROL: ZonaCiudad[] = [
  { nombre: "Polígono de Caranza", tipo: "poligono" },
  { nombre: "Polígono de A Gándara", tipo: "poligono" },
];

const BARRIOS_NARON: ZonaCiudad[] = [
  { nombre: "A Gándara", tipo: "barrio" },
  { nombre: "Alto do Castiñeiro", tipo: "barrio" },
  { nombre: "O Couto", tipo: "barrio" },
  { nombre: "Santa Icía", tipo: "barrio" },
  { nombre: "Piñeiros", tipo: "barrio" },
  { nombre: "Xuvia", tipo: "barrio" },
  { nombre: "A Solaina", tipo: "barrio" },
  { nombre: "Freixeiro", tipo: "barrio" },
  { nombre: "Castro (Santa María)", tipo: "barrio" },
  { nombre: "Doso (San Lourenzo)", tipo: "barrio" },
  { nombre: "San Xiao de Narón (San Xiao)", tipo: "barrio" },
  { nombre: "Pedroso (San Salvador)", tipo: "barrio" },
  { nombre: "Sedes (Santo Estevo)", tipo: "barrio" },
  { nombre: "Trasancos (San Mateo)", tipo: "barrio" },
  { nombre: "O Val (Santa María a Maior)", tipo: "barrio" },
];

const POLIGONOS_NARON: ZonaCiudad[] = [
  { nombre: "Río do Pozo", tipo: "poligono" },
  { nombre: "Polígono da Gándara", tipo: "poligono" },
  { nombre: "Polígono das Lagoas", tipo: "poligono" },
];

const BARRIOS_OLEIROS: ZonaCiudad[] = [
  { nombre: "Perillo (Santa Locaia)", tipo: "barrio" },
  { nombre: "Santa Cristina", tipo: "barrio" },
  { nombre: "Bastiagueiro", tipo: "barrio" },
  { nombre: "Liáns (Santaia)", tipo: "barrio" },
  { nombre: "San Pedro de Nós (San Pedro)", tipo: "barrio" },
  { nombre: "Iñás (San Xorxe)", tipo: "barrio" },
  { nombre: "Dorneda (San Martiño)", tipo: "barrio" },
  { nombre: "Oleiros (Santa María)", tipo: "barrio" },
  { nombre: "O Real", tipo: "barrio" },
  { nombre: "Maianca (San Cosme)", tipo: "barrio" },
  { nombre: "Serantes (San Xián)", tipo: "barrio" },
  { nombre: "Dexo (Santa María)", tipo: "barrio" },
];

const POLIGONOS_OLEIROS: ZonaCiudad[] = [
  { nombre: "Icaria", tipo: "poligono" },
];

const BARRIOS_BILBAO: ZonaCiudad[] = [
  { nombre: "Arangoiti", tipo: "barrio" },
  { nombre: "Ibarrekolanda", tipo: "barrio" },
  { nombre: "San Ignacio - Elorrieta", tipo: "barrio" },
  { nombre: "San Pedro de Deustu - La Ribera", tipo: "barrio" },
  { nombre: "Zorrotzaurre", tipo: "barrio" },
  { nombre: "Castaños", tipo: "barrio" },
  { nombre: "Matiko - Ciudad Jardín", tipo: "barrio" },
  { nombre: "Uribarri", tipo: "barrio" },
  { nombre: "Zurbaran - Arabella", tipo: "barrio" },
  { nombre: "Otxarkoaga", tipo: "barrio" },
  { nombre: "Txurdinaga", tipo: "barrio" },
  { nombre: "Begoña", tipo: "barrio" },
  { nombre: "Santutxu", tipo: "barrio" },
  { nombre: "Bolueta", tipo: "barrio" },
  { nombre: "Casco Viejo", tipo: "barrio" },
  { nombre: "Atxuri", tipo: "barrio" },
  { nombre: "Bilbao La Vieja", tipo: "barrio" },
  { nombre: "San Francisco", tipo: "barrio" },
  { nombre: "Zabala", tipo: "barrio" },
  { nombre: "Solokoetxe", tipo: "barrio" },
  { nombre: "La Peña", tipo: "barrio" },
  { nombre: "Iturralde", tipo: "barrio" },
  { nombre: "San Adrián", tipo: "barrio" },
  { nombre: "Miribilla", tipo: "barrio" },
  { nombre: "Abando", tipo: "barrio" },
  { nombre: "Indautxu", tipo: "barrio" },
  { nombre: "Ametzola", tipo: "barrio" },
  { nombre: "Iralabarri", tipo: "barrio" },
  { nombre: "Errekaldeberri - Larraskitu", tipo: "barrio" },
  { nombre: "Iturrigorri - Peñascal", tipo: "barrio" },
  { nombre: "Uretamendi", tipo: "barrio" },
  { nombre: "Basurtu", tipo: "barrio" },
  { nombre: "Altamira", tipo: "barrio" },
  { nombre: "Olabeaga", tipo: "barrio" },
  { nombre: "Masustegi - Monte Caramelo", tipo: "barrio" },
  { nombre: "Zorrotza", tipo: "barrio" },
  { nombre: "Buia", tipo: "barrio" },
  { nombre: "Seberetxe", tipo: "barrio" },
  { nombre: "San Justo", tipo: "barrio" },
  { nombre: "Azkarai", tipo: "barrio" },
];

const POLIGONOS_BILBAO: ZonaCiudad[] = [];

const BARRIOS_BARAKALDO: ZonaCiudad[] = [
  { nombre: "Centro", tipo: "barrio" },
  { nombre: "Zaballa", tipo: "barrio" },
  { nombre: "Rontegi", tipo: "barrio" },
  { nombre: "Beurko", tipo: "barrio" },
  { nombre: "Bagatza", tipo: "barrio" },
  { nombre: "Santa Teresa", tipo: "barrio" },
  { nombre: "Lasesarre", tipo: "barrio" },
  { nombre: "Desertu-Urban", tipo: "barrio" },
  { nombre: "El Carmen", tipo: "barrio" },
  { nombre: "Larrea", tipo: "barrio" },
  { nombre: "San Vicente", tipo: "barrio" },
  { nombre: "Zuazo", tipo: "barrio" },
  { nombre: "Arteagabeitia", tipo: "barrio" },
  { nombre: "Ansio", tipo: "barrio" },
  { nombre: "Retuerto", tipo: "barrio" },
  { nombre: "Kareaga", tipo: "barrio" },
  { nombre: "Bengolea", tipo: "barrio" },
  { nombre: "El Regato", tipo: "barrio" },
  { nombre: "Gorostiza", tipo: "barrio" },
  { nombre: "Gurutzeta (Cruces)", tipo: "barrio" },
  { nombre: "Basatxu", tipo: "barrio" },
  { nombre: "Tranviarios", tipo: "barrio" },
  { nombre: "La Dinamita", tipo: "barrio" },
  { nombre: "La Constancia", tipo: "barrio" },
  { nombre: "Lutxana", tipo: "barrio" },
  { nombre: "Llano", tipo: "barrio" },
  { nombre: "Burtzeña", tipo: "barrio" },
  { nombre: "Peñaskuren", tipo: "barrio" },
  { nombre: "Kadagua", tipo: "barrio" },
  { nombre: "Kastrexana", tipo: "barrio" },
  { nombre: "Santa Agueda", tipo: "barrio" },
  { nombre: "Zubileta", tipo: "barrio" },
];

const POLIGONOS_BARAKALDO: ZonaCiudad[] = [
  { nombre: "Polígono Kareaga Norte", tipo: "poligono" },
  { nombre: "Beurko Viejo", tipo: "poligono" },
];

const BARRIOS_GETXO: ZonaCiudad[] = [
  { nombre: "Algorta", tipo: "barrio" },
  { nombre: "Algorta Centro", tipo: "barrio" },
  { nombre: "Algorta Este", tipo: "barrio" },
  { nombre: "Algorta Frente Costero", tipo: "barrio" },
  { nombre: "Puerto Viejo", tipo: "barrio" },
  { nombre: "Andra Mari (Santa María)", tipo: "barrio" },
  { nombre: "La Galea", tipo: "barrio" },
  { nombre: "Neguri", tipo: "barrio" },
  { nombre: "Zugazarte", tipo: "barrio" },
  { nombre: "Las Arenas (Areeta)", tipo: "barrio" },
  { nombre: "Romo", tipo: "barrio" },
  { nombre: "Santa Eugenia", tipo: "barrio" },
  { nombre: "Aiboa", tipo: "barrio" },
  { nombre: "Gobeloki", tipo: "barrio" },
  { nombre: "Konporte", tipo: "barrio" },
  { nombre: "Fadura", tipo: "barrio" },
  { nombre: "Etxezuri", tipo: "barrio" },
  { nombre: "Villa de Plentzia", tipo: "barrio" },
  { nombre: "Zubilleta", tipo: "barrio" },
];

const POLIGONOS_GETXO: ZonaCiudad[] = [
  { nombre: "Polígono Industrial Errotatxu", tipo: "poligono" },
];

const BARRIOS_PORTUGALETE: ZonaCiudad[] = [
  { nombre: "Casco Viejo", tipo: "barrio" },
  { nombre: "Centro", tipo: "barrio" },
  { nombre: "Abaro", tipo: "barrio" },
  { nombre: "Buenavista", tipo: "barrio" },
  { nombre: "Vista Alegre", tipo: "barrio" },
  { nombre: "Zona Nueva", tipo: "barrio" },
  { nombre: "Peñota", tipo: "barrio" },
  { nombre: "Azeta", tipo: "barrio" },
  { nombre: "Abatxolo", tipo: "barrio" },
  { nombre: "Repélega", tipo: "barrio" },
  { nombre: "Rivas", tipo: "barrio" },
  { nombre: "La Florida", tipo: "barrio" },
  { nombre: "Mugakoa", tipo: "barrio" },
  { nombre: "Campazar (Kanpazar)", tipo: "barrio" },
  { nombre: "San Roque", tipo: "barrio" },
];

const POLIGONOS_PORTUGALETE: ZonaCiudad[] = [
  { nombre: "Polígono Industrial Ballonti", tipo: "poligono" },
];

const BARRIOS_SANTURTZI: ZonaCiudad[] = [
  { nombre: "Balparda", tipo: "barrio" },
  { nombre: "Buena Vista", tipo: "barrio" },
  { nombre: "Kabiezes (Cabieces)", tipo: "barrio" },
  { nombre: "Coscojales", tipo: "barrio" },
  { nombre: "Cuesta Hospital", tipo: "barrio" },
  { nombre: "El Bullón", tipo: "barrio" },
  { nombre: "El Campón", tipo: "barrio" },
  { nombre: "El Cotillo", tipo: "barrio" },
  { nombre: "El Parque", tipo: "barrio" },
  { nombre: "Fontuso", tipo: "barrio" },
  { nombre: "Kai-Alde", tipo: "barrio" },
  { nombre: "La Chicharra", tipo: "barrio" },
  { nombre: "Las Viñas", tipo: "barrio" },
  { nombre: "Lauaxeta", tipo: "barrio" },
  { nombre: "Mamariga", tipo: "barrio" },
  { nombre: "Mirabueno", tipo: "barrio" },
  { nombre: "Nafarroa", tipo: "barrio" },
  { nombre: "Peñota", tipo: "barrio" },
  { nombre: "Portalada", tipo: "barrio" },
  { nombre: "Ranzari", tipo: "barrio" },
  { nombre: "San Juan", tipo: "barrio" },
  { nombre: "Torquillas", tipo: "barrio" },
];

const POLIGONOS_SANTURTZI: ZonaCiudad[] = [
  { nombre: "Polígono Balparda", tipo: "poligono" },
  { nombre: "Polígono El Árbol", tipo: "poligono" },
];

const BARRIOS_BASAURI: ZonaCiudad[] = [
  { nombre: "Ariz", tipo: "barrio" },
  { nombre: "Arizgoiti", tipo: "barrio" },
  { nombre: "Basozelai", tipo: "barrio" },
  { nombre: "Bentakoiko", tipo: "barrio" },
  { nombre: "Berriotxoa-Soloarte", tipo: "barrio" },
  { nombre: "Kareaga (Careaga)", tipo: "barrio" },
  { nombre: "El Calero (Kareaga Goikoa)", tipo: "barrio" },
  { nombre: "Bidebieta (Estación)", tipo: "barrio" },
  { nombre: "Hernán Cortés", tipo: "barrio" },
  { nombre: "Matadero (Gaztañabaltza)", tipo: "barrio" },
  { nombre: "Pozokoetxe", tipo: "barrio" },
  { nombre: "San Miguel (Elexalde)", tipo: "barrio" },
  { nombre: "San Pedro", tipo: "barrio" },
  { nombre: "Urbi", tipo: "barrio" },
  { nombre: "Virgen de Begoña", tipo: "barrio" },
];

const POLIGONOS_BASAURI: ZonaCiudad[] = [
  { nombre: "Polígono Industrial Artunduaga", tipo: "poligono" },
];

const BARRIOS_DURANGO: ZonaCiudad[] = [
  { nombre: "Aramotz", tipo: "barrio" },
  { nombre: "Ezkurdi", tipo: "barrio" },
  { nombre: "Errotaritxuena", tipo: "barrio" },
  { nombre: "Ibaizabal", tipo: "barrio" },
  { nombre: "Landako", tipo: "barrio" },
  { nombre: "Madalena", tipo: "barrio" },
  { nombre: "Montorreta", tipo: "barrio" },
  { nombre: "San Fausto", tipo: "barrio" },
  { nombre: "San Ignacio", tipo: "barrio" },
  { nombre: "San Roke", tipo: "barrio" },
  { nombre: "Tabira", tipo: "barrio" },
  { nombre: "Txibitena", tipo: "barrio" },
  { nombre: "Zabalarra", tipo: "barrio" },
];

const POLIGONOS_DURANGO: ZonaCiudad[] = [
  { nombre: "Aliendalde", tipo: "poligono" },
  { nombre: "Astolabeitia", tipo: "poligono" },
  { nombre: "Eguzkitza", tipo: "poligono" },
  { nombre: "Landako Elkartegia", tipo: "poligono" },
  { nombre: "Polígono · Montorreta", tipo: "poligono" },
  { nombre: "Polígono · San Roke", tipo: "poligono" },
  { nombre: "Polígono · Tabira", tipo: "poligono" },
  { nombre: "Urbitarte", tipo: "poligono" },
];

const BARRIOS_ERANDIO: ZonaCiudad[] = [
  { nombre: "Altzaga", tipo: "barrio" },
  { nombre: "Arriaga", tipo: "barrio" },
  { nombre: "Asua", tipo: "barrio" },
  { nombre: "Astrabudua", tipo: "barrio" },
  { nombre: "Erandiogoikoa", tipo: "barrio" },
  { nombre: "Goierri", tipo: "barrio" },
  { nombre: "Lutxana-Enekuri", tipo: "barrio" },
];

const POLIGONOS_ERANDIO: ZonaCiudad[] = [
  { nombre: "Axpe", tipo: "poligono" },
  { nombre: "Axpe-Industrialdeak", tipo: "poligono" },
];

const BARRIOS_GALDAKAO: ZonaCiudad[] = [
  { nombre: "Aperribai", tipo: "barrio" },
  { nombre: "Bekea", tipo: "barrio" },
  { nombre: "Bengoetxe", tipo: "barrio" },
  { nombre: "Elexalde", tipo: "barrio" },
  { nombre: "Eitzaga", tipo: "barrio" },
  { nombre: "Jugo", tipo: "barrio" },
  { nombre: "Kurtzea (Kurutze)", tipo: "barrio" },
  { nombre: "Olabarrieta", tipo: "barrio" },
  { nombre: "Plazakoetxe", tipo: "barrio" },
  { nombre: "Urreta-Egia", tipo: "barrio" },
  { nombre: "Zabalea", tipo: "barrio" },
  { nombre: "Zamakoa", tipo: "barrio" },
  { nombre: "Zuhatzu", tipo: "barrio" },
  { nombre: "Zuatzaurre", tipo: "barrio" },
  { nombre: "Tximelarre", tipo: "barrio" },
];

const POLIGONOS_GALDAKAO: ZonaCiudad[] = [
  { nombre: "Polígono · Aperribai", tipo: "poligono" },
  { nombre: "Erletxe", tipo: "poligono" },
  { nombre: "Guturribai", tipo: "poligono" },
  { nombre: "Iru-Bide", tipo: "poligono" },
  { nombre: "Izaga", tipo: "poligono" },
  { nombre: "Itzaga", tipo: "poligono" },
  { nombre: "Merkadillo", tipo: "poligono" },
  { nombre: "Urreta", tipo: "poligono" },
  { nombre: "Usansolo industrial", tipo: "poligono" },
  { nombre: "Zuhatzu-Zuazo", tipo: "poligono" },
];

const BARRIOS_LEIOA: ZonaCiudad[] = [
  { nombre: "Aketxe", tipo: "barrio" },
  { nombre: "Aldekoena", tipo: "barrio" },
  { nombre: "Artatza", tipo: "barrio" },
  { nombre: "Artatzagana", tipo: "barrio" },
  { nombre: "Basaez", tipo: "barrio" },
  { nombre: "Elexalde", tipo: "barrio" },
  { nombre: "Ibaiondo", tipo: "barrio" },
  { nombre: "Ikea", tipo: "barrio" },
  { nombre: "Iturribide", tipo: "barrio" },
  { nombre: "Lamiako-Txopoeta", tipo: "barrio" },
  { nombre: "Lertutza", tipo: "barrio" },
  { nombre: "Mendibil", tipo: "barrio" },
  { nombre: "Ondiz", tipo: "barrio" },
  { nombre: "Peruri", tipo: "barrio" },
  { nombre: "Pinueta", tipo: "barrio" },
  { nombre: "Santi Mami", tipo: "barrio" },
  { nombre: "Santa Ana", tipo: "barrio" },
  { nombre: "Santsoena", tipo: "barrio" },
  { nombre: "Sarriena", tipo: "barrio" },
  { nombre: "Tellería", tipo: "barrio" },
  { nombre: "Udondo", tipo: "barrio" },
  { nombre: "Zuhatzu", tipo: "barrio" },
];

const POLIGONOS_LEIOA: ZonaCiudad[] = [
  { nombre: "Dow Chemical", tipo: "poligono" },
  { nombre: "Polígono · Ibaiondo", tipo: "poligono" },
  { nombre: "Ibarabarri", tipo: "poligono" },
  { nombre: "Iparraguirre", tipo: "poligono" },
  { nombre: "Lamiako", tipo: "poligono" },
  { nombre: "Parque Tecnológico de Euskadi – Campus Leioa", tipo: "poligono" },
  { nombre: "Ribera de Axpe", tipo: "poligono" },
  { nombre: "Peri Astrabudua", tipo: "poligono" },
  { nombre: "Parque Empresarial Ibaiondo", tipo: "poligono" },
];

const BARRIOS_SAN_SEBASTIAN: ZonaCiudad[] = [
  { nombre: "Centro (Erdialdea)", tipo: "barrio" },
  { nombre: "Gros", tipo: "barrio" },
  { nombre: "Egia", tipo: "barrio" },
  { nombre: "Amara Berri", tipo: "barrio" },
  { nombre: "Antiguo (Antigua)", tipo: "barrio" },
  { nombre: "Aiete", tipo: "barrio" },
  { nombre: "Añorga", tipo: "barrio" },
  { nombre: "Ibaeta", tipo: "barrio" },
  { nombre: "Igeldo", tipo: "barrio" },
  { nombre: "Loiola", tipo: "barrio" },
  { nombre: "Martutene", tipo: "barrio" },
  { nombre: "Intxaurrondo", tipo: "barrio" },
  { nombre: "Miracruz - Bidebieta (Mirakruz)", tipo: "barrio" },
  { nombre: "Altza", tipo: "barrio" },
  { nombre: "Ategorrieta - Ulia", tipo: "barrio" },
  { nombre: "Miramon - Zorroaga", tipo: "barrio" },
  { nombre: "Zubieta", tipo: "barrio" },
  { nombre: "Landarbaso (Landerbaso)", tipo: "barrio" },
  { nombre: "Oberan (Oarain)", tipo: "barrio" },
];

const POLIGONOS_SAN_SEBASTIAN: ZonaCiudad[] = [
  { nombre: "Igara", tipo: "poligono" },
  { nombre: "Zuatzu", tipo: "poligono" },
  { nombre: "Belartza", tipo: "poligono" },
  { nombre: "Polígono 27 (Torrua Zahar)", tipo: "poligono" },
  { nombre: "Eskusaitzeta", tipo: "poligono" },
  { nombre: "Molinao", tipo: "poligono" },
  { nombre: "Antzita", tipo: "poligono" },
  { nombre: "Artxipi", tipo: "poligono" },
  { nombre: "Bugati", tipo: "poligono" },
  { nombre: "Errekalde", tipo: "poligono" },
  { nombre: "Parque Científico y Tecnológico de Gipuzkoa", tipo: "poligono" },
];

const BARRIOS_IRUN: ZonaCiudad[] = [
  { nombre: "Centro", tipo: "barrio" },
  { nombre: "Parte Vieja (Casco Viejo)", tipo: "barrio" },
  { nombre: "Anaka (Puiana)", tipo: "barrio" },
  { nombre: "Anzaran", tipo: "barrio" },
  { nombre: "Azken Portu", tipo: "barrio" },
  { nombre: "Belaskoenea", tipo: "barrio" },
  { nombre: "Beraun-Santiago", tipo: "barrio" },
  { nombre: "Behobia", tipo: "barrio" },
  { nombre: "Bidasoa", tipo: "barrio" },
  { nombre: "Dunboa", tipo: "barrio" },
  { nombre: "Lapice (Elitxu)", tipo: "barrio" },
  { nombre: "Larreaundi", tipo: "barrio" },
  { nombre: "Paseo Colón - Mendibil", tipo: "barrio" },
  { nombre: "El Pinar", tipo: "barrio" },
  { nombre: "Pío XII", tipo: "barrio" },
  { nombre: "San Miguel", tipo: "barrio" },
  { nombre: "Uranzu - Artía", tipo: "barrio" },
  { nombre: "Ventas-Landetxa", tipo: "barrio" },
  { nombre: "Urdanibia", tipo: "barrio" },
  { nombre: "Arbes", tipo: "barrio" },
  { nombre: "Meaka", tipo: "barrio" },
  { nombre: "Olaberria", tipo: "barrio" },
];

const POLIGONOS_IRUN: ZonaCiudad[] = [
  { nombre: "Araso", tipo: "poligono" },
  { nombre: "Arretxe-Ugalde", tipo: "poligono" },
  { nombre: "Gabiria-Ventas", tipo: "poligono" },
  { nombre: "Agirretxe-Oianzabaleta", tipo: "poligono" },
  { nombre: "Bidaurre-Ureder", tipo: "poligono" },
  { nombre: "Eskortza-Txumarraga", tipo: "poligono" },
  { nombre: "Aranibar", tipo: "poligono" },
  { nombre: "Primauteko Errota", tipo: "poligono" },
  { nombre: "Fosforera", tipo: "poligono" },
  { nombre: "Zaisa", tipo: "poligono" },
  { nombre: "Polígono 54", tipo: "poligono" },
  { nombre: "Anaka Sur (Hegoaldea)", tipo: "poligono" },
  { nombre: "Anaka Norte (Iparraldea)", tipo: "poligono" },
  { nombre: "Alto Arretxe", tipo: "poligono" },
];

const BARRIOS_ERRENTERIA: ZonaCiudad[] = [
  { nombre: "Centro", tipo: "barrio" },
  { nombre: "Alaberga-Versalles", tipo: "barrio" },
  { nombre: "Beraun", tipo: "barrio" },
  { nombre: "Capuchinos", tipo: "barrio" },
  { nombre: "Gabierrota-Larzabal", tipo: "barrio" },
  { nombre: "Galtzaraborda", tipo: "barrio" },
  { nombre: "Gaztaño-Agustinas", tipo: "barrio" },
  { nombre: "Iztieta", tipo: "barrio" },
  { nombre: "Olibet-Casas Nuevas", tipo: "barrio" },
  { nombre: "Pontika", tipo: "barrio" },
  { nombre: "Zona Rural", tipo: "barrio" },
];

const POLIGONOS_ERRENTERIA: ZonaCiudad[] = [
  { nombre: "Egiburuberri", tipo: "poligono" },
  { nombre: "Masti-Loidi", tipo: "poligono" },
  { nombre: "Olibet", tipo: "poligono" },
  { nombre: "Txirrita-Maleo", tipo: "poligono" },
  { nombre: "Aranguren", tipo: "poligono" },
];

const BARRIOS_BARCELONA: ZonaCiudad[] = [
  { nombre: "el Raval", tipo: "barrio" },
  { nombre: "el Barri Gòtic", tipo: "barrio" },
  { nombre: "la Barceloneta", tipo: "barrio" },
  { nombre: "Sant Pere, Santa Caterina i la Ribera", tipo: "barrio" },
  { nombre: "el Fort Pienc", tipo: "barrio" },
  { nombre: "la Sagrada Família", tipo: "barrio" },
  { nombre: "la Dreta de l'Eixample", tipo: "barrio" },
  { nombre: "l'Antiga Esquerra de l'Eixample", tipo: "barrio" },
  { nombre: "la Nova Esquerra de l'Eixample", tipo: "barrio" },
  { nombre: "Sant Antoni", tipo: "barrio" },
  { nombre: "el Poble-sec", tipo: "barrio" },
  { nombre: "la Marina del Prat Vermell", tipo: "barrio" },
  { nombre: "la Marina de Port", tipo: "barrio" },
  { nombre: "la Font de la Guatlla", tipo: "barrio" },
  { nombre: "Hostafrancs", tipo: "barrio" },
  { nombre: "la Bordeta", tipo: "barrio" },
  { nombre: "Sants - Badal", tipo: "barrio" },
  { nombre: "Sants", tipo: "barrio" },
  { nombre: "les Corts", tipo: "barrio" },
  { nombre: "la Maternitat i Sant Ramon", tipo: "barrio" },
  { nombre: "Pedralbes", tipo: "barrio" },
  { nombre: "Vallvidrera, el Tibidabo i les Planes", tipo: "barrio" },
  { nombre: "Sarrià", tipo: "barrio" },
  { nombre: "les Tres Torres", tipo: "barrio" },
  { nombre: "Sant Gervasi - la Bonanova", tipo: "barrio" },
  { nombre: "Sant Gervasi - Galvany", tipo: "barrio" },
  { nombre: "el Putxet i el Farró", tipo: "barrio" },
  { nombre: "Vallcarca i els Penitents", tipo: "barrio" },
  { nombre: "el Coll", tipo: "barrio" },
  { nombre: "la Salut", tipo: "barrio" },
  { nombre: "la Vila de Gràcia", tipo: "barrio" },
  { nombre: "el Camp d'en Grassot i Gràcia Nova", tipo: "barrio" },
  { nombre: "el Baix Guinardó", tipo: "barrio" },
  { nombre: "Can Baró", tipo: "barrio" },
  { nombre: "el Guinardó", tipo: "barrio" },
  { nombre: "la Font d'en Fargues", tipo: "barrio" },
  { nombre: "el Carmel", tipo: "barrio" },
  { nombre: "la Teixonera", tipo: "barrio" },
  { nombre: "Sant Genís dels Agudells", tipo: "barrio" },
  { nombre: "Montbau", tipo: "barrio" },
  { nombre: "la Vall d'Hebron", tipo: "barrio" },
  { nombre: "la Clota", tipo: "barrio" },
  { nombre: "Horta", tipo: "barrio" },
  { nombre: "Vilapicina i la Torre Llobeta", tipo: "barrio" },
  { nombre: "Porta", tipo: "barrio" },
  { nombre: "el Turó de la Peira", tipo: "barrio" },
  { nombre: "Can Peguera", tipo: "barrio" },
  { nombre: "la Guineueta", tipo: "barrio" },
  { nombre: "Canyelles", tipo: "barrio" },
  { nombre: "les Roquetes", tipo: "barrio" },
  { nombre: "Verdun", tipo: "barrio" },
  { nombre: "la Prosperitat", tipo: "barrio" },
  { nombre: "la Trinitat Nova", tipo: "barrio" },
  { nombre: "Torre Baró", tipo: "barrio" },
  { nombre: "Ciutat Meridiana", tipo: "barrio" },
  { nombre: "Vallbona", tipo: "barrio" },
  { nombre: "la Trinitat Vella", tipo: "barrio" },
  { nombre: "Baró de Viver", tipo: "barrio" },
  { nombre: "el Bon Pastor", tipo: "barrio" },
  { nombre: "Sant Andreu", tipo: "barrio" },
  { nombre: "la Sagrera", tipo: "barrio" },
  { nombre: "el Congrés i els Indians", tipo: "barrio" },
  { nombre: "Navas", tipo: "barrio" },
  { nombre: "el Camp de l'Arpa del Clot", tipo: "barrio" },
  { nombre: "el Clot", tipo: "barrio" },
  { nombre: "el Parc i la Llacuna del Poblenou", tipo: "barrio" },
  { nombre: "la Vila Olímpica del Poblenou", tipo: "barrio" },
  { nombre: "el Poblenou", tipo: "barrio" },
  { nombre: "Diagonal Mar i el Front Marítim del Poblenou", tipo: "barrio" },
  { nombre: "el Besòs i el Maresme", tipo: "barrio" },
  { nombre: "Provençals del Poblenou", tipo: "barrio" },
  { nombre: "Sant Martí de Provençals", tipo: "barrio" },
  { nombre: "la Verneda i la Pau", tipo: "barrio" },
];

const POLIGONOS_BARCELONA: ZonaCiudad[] = [
  { nombre: "Zona Franca", tipo: "poligono" },
  { nombre: "Mercabarna", tipo: "poligono" },
  { nombre: "Bon Pastor", tipo: "poligono" },
  { nombre: "Torrent de l'Estadella", tipo: "poligono" },
  { nombre: "La Verneda Industrial", tipo: "poligono" },
  { nombre: "Montsolís", tipo: "poligono" },
  { nombre: "22@", tipo: "poligono" },
];

const BARRIOS_HOSPITALET: ZonaCiudad[] = [
  { nombre: "Centre", tipo: "barrio" },
  { nombre: "Sanfeliu", tipo: "barrio" },
  { nombre: "Sant Josep", tipo: "barrio" },
  { nombre: "La Torrassa", tipo: "barrio" },
  { nombre: "Collblanc", tipo: "barrio" },
  { nombre: "Santa Eulàlia", tipo: "barrio" },
  { nombre: "Granvia Sud", tipo: "barrio" },
  { nombre: "La Florida", tipo: "barrio" },
  { nombre: "Les Planes", tipo: "barrio" },
  { nombre: "Can Serra", tipo: "barrio" },
  { nombre: "Pubilla Cases", tipo: "barrio" },
  { nombre: "El Gornal", tipo: "barrio" },
  { nombre: "Bellvitge", tipo: "barrio" },
];

const POLIGONOS_HOSPITALET: ZonaCiudad[] = [
  { nombre: "Pedrosa", tipo: "poligono" },
  { nombre: "Carretera del Mig", tipo: "poligono" },
  { nombre: "Santa Eulàlia-Provençana", tipo: "poligono" },
  { nombre: "Santa Eulàlia-Narcís Monturiol", tipo: "poligono" },
  { nombre: "Santa Eulàlia-Martí i Codolar", tipo: "poligono" },
];

const BARRIOS_BADALONA: ZonaCiudad[] = [
  { nombre: "Casagemes", tipo: "barrio" },
  { nombre: "Manresà", tipo: "barrio" },
  { nombre: "Centre", tipo: "barrio" },
  { nombre: "Coll i Pujol", tipo: "barrio" },
  { nombre: "Progrés", tipo: "barrio" },
  { nombre: "Canyadó", tipo: "barrio" },
  { nombre: "Dalt la Vila", tipo: "barrio" },
  { nombre: "Sant Crist", tipo: "barrio" },
  { nombre: "Sistrells", tipo: "barrio" },
  { nombre: "Lloreda", tipo: "barrio" },
  { nombre: "Nova Lloreda", tipo: "barrio" },
  { nombre: "Puigfred", tipo: "barrio" },
  { nombre: "La Pau", tipo: "barrio" },
  { nombre: "Montigalà", tipo: "barrio" },
  { nombre: "Canyet", tipo: "barrio" },
  { nombre: "Mas Ram", tipo: "barrio" },
  { nombre: "Bufalà", tipo: "barrio" },
  { nombre: "Pomar", tipo: "barrio" },
  { nombre: "Pomar de Dalt", tipo: "barrio" },
  { nombre: "Morera", tipo: "barrio" },
  { nombre: "Les Guixeres", tipo: "barrio" },
  { nombre: "Bonavista", tipo: "barrio" },
  { nombre: "La Salut", tipo: "barrio" },
  { nombre: "Sant Joan de Llefià", tipo: "barrio" },
  { nombre: "Sant Mori de Llefià", tipo: "barrio" },
  { nombre: "Sant Antoni de Llefià", tipo: "barrio" },
  { nombre: "Gorg", tipo: "barrio" },
  { nombre: "La Mora", tipo: "barrio" },
  { nombre: "Congrés", tipo: "barrio" },
  { nombre: "Can Claris", tipo: "barrio" },
  { nombre: "Raval", tipo: "barrio" },
  { nombre: "Artigues", tipo: "barrio" },
  { nombre: "Sant Roc", tipo: "barrio" },
  { nombre: "El Remei", tipo: "barrio" },
];

const POLIGONOS_BADALONA: ZonaCiudad[] = [
  { nombre: "Badalona Sud", tipo: "poligono" },
  { nombre: "Badalona Nord", tipo: "poligono" },
];

const BARRIOS_SANTA_COLOMA: ZonaCiudad[] = [
  { nombre: "Centre", tipo: "barrio" },
  { nombre: "Can Mariner", tipo: "barrio" },
  { nombre: "Llatí", tipo: "barrio" },
  { nombre: "Riera Alta", tipo: "barrio" },
  { nombre: "Cementiri Vell", tipo: "barrio" },
  { nombre: "Singuerlín", tipo: "barrio" },
  { nombre: "Les Oliveres", tipo: "barrio" },
  { nombre: "Can Franquesa", tipo: "barrio" },
  { nombre: "Guinardera", tipo: "barrio" },
  { nombre: "Serra de Marina", tipo: "barrio" },
  { nombre: "Can Calvet", tipo: "barrio" },
  { nombre: "Riu Nord", tipo: "barrio" },
  { nombre: "Riu Sud", tipo: "barrio" },
  { nombre: "Raval", tipo: "barrio" },
  { nombre: "Santa Rosa", tipo: "barrio" },
  { nombre: "Safaretjos", tipo: "barrio" },
  { nombre: "Fondo", tipo: "barrio" },
];

const POLIGONOS_SANTA_COLOMA: ZonaCiudad[] = [
  { nombre: "Bosc Llarg i les Canyes", tipo: "poligono" },
];

const BARRIOS_CORNELLA: ZonaCiudad[] = [
  { nombre: "Centre", tipo: "barrio" },
  { nombre: "Riera", tipo: "barrio" },
  { nombre: "Almeda", tipo: "barrio" },
  { nombre: "Fontsanta-Fatjó", tipo: "barrio" },
  { nombre: "El Pedró", tipo: "barrio" },
  { nombre: "La Gavarra", tipo: "barrio" },
  { nombre: "Sant Ildefons", tipo: "barrio" },
];

const POLIGONOS_CORNELLA: ZonaCiudad[] = [
  { nombre: "Famades", tipo: "poligono" },
  { nombre: "Solanes", tipo: "poligono" },
  { nombre: "Est", tipo: "poligono" },
];

const BARRIOS_VILADECANS: ZonaCiudad[] = [
  { nombre: "Sant Jordi-Gabrielistes", tipo: "barrio" },
  { nombre: "Barri Sales", tipo: "barrio" },
  { nombre: "Barri Antic", tipo: "barrio" },
  { nombre: "Eixample Centre", tipo: "barrio" },
  { nombre: "Torre-roja", tipo: "barrio" },
  { nombre: "Campreciós", tipo: "barrio" },
  { nombre: "Llevant", tipo: "barrio" },
  { nombre: "Montserratina", tipo: "barrio" },
  { nombre: "Mas Ratés", tipo: "barrio" },
  { nombre: "Molí-Can Ginestar", tipo: "barrio" },
  { nombre: "Torrent Ballester", tipo: "barrio" },
  { nombre: "Alba-rosa", tipo: "barrio" },
  { nombre: "Can Guardiola", tipo: "barrio" },
  { nombre: "Can Palmer", tipo: "barrio" },
  { nombre: "Can Batllori", tipo: "barrio" },
  { nombre: "Hispanitat", tipo: "barrio" },
  { nombre: "Hospital Roca", tipo: "barrio" },
  { nombre: "Can Sellarès", tipo: "barrio" },
  { nombre: "Congrés", tipo: "barrio" },
  { nombre: "Mil·lenari", tipo: "barrio" },
];

const POLIGONOS_VILADECANS: ZonaCiudad[] = [
  { nombre: "Viladecans Business Park", tipo: "poligono" },
  { nombre: "Ca n'Alemany", tipo: "poligono" },
  { nombre: "Can Calderon", tipo: "poligono" },
  { nombre: "Agròpolis", tipo: "poligono" },
  { nombre: "Polígono industrial Centre", tipo: "poligono" },
];

const BARRIOS_EL_PRAT: ZonaCiudad[] = [
  { nombre: "Llevant-Marina", tipo: "barrio" },
  { nombre: "Nucli antic", tipo: "barrio" },
  { nombre: "Centre", tipo: "barrio" },
  { nombre: "la Granja", tipo: "barrio" },
  { nombre: "Sant Cosme", tipo: "barrio" },
  { nombre: "Sant Jordi-Ribera Baixa", tipo: "barrio" },
  { nombre: "les Palmeres", tipo: "barrio" },
  { nombre: "la Barceloneta", tipo: "barrio" },
  { nombre: "Cases de la Seda", tipo: "barrio" },
  { nombre: "Eixample Sud", tipo: "barrio" },
];

const POLIGONOS_EL_PRAT: ZonaCiudad[] = [
  { nombre: "Ca l'Alaio", tipo: "poligono" },
  { nombre: "Cal Saio", tipo: "poligono" },
  { nombre: "Enkalene", tipo: "poligono" },
  { nombre: "Estruch", tipo: "poligono" },
  { nombre: "Fondo d'en Peixo", tipo: "poligono" },
  { nombre: "Mas Mateu", tipo: "poligono" },
  { nombre: "Pratenc", tipo: "poligono" },
  { nombre: "Urgoiti-Ponsich", tipo: "poligono" },
  { nombre: "Mas Blau I", tipo: "poligono" },
  { nombre: "Mas Blau II", tipo: "poligono" },
  { nombre: "Prat Nord", tipo: "poligono" },
  { nombre: "ZAL-Prat", tipo: "poligono" },
  { nombre: "Plana del Galet", tipo: "poligono" },
  { nombre: "Aeroport", tipo: "poligono" },
];

const BARRIOS_ESPLUGUES: ZonaCiudad[] = [
  { nombre: "Can Clota", tipo: "barrio" },
  { nombre: "Can Vidalet", tipo: "barrio" },
  { nombre: "Centre", tipo: "barrio" },
  { nombre: "Ciutat Diagonal", tipo: "barrio" },
  { nombre: "El Gall", tipo: "barrio" },
  { nombre: "Finestrelles", tipo: "barrio" },
  { nombre: "La Mallola", tipo: "barrio" },
  { nombre: "La Miranda", tipo: "barrio" },
  { nombre: "La Plana", tipo: "barrio" },
  { nombre: "Montesa", tipo: "barrio" },
];

const POLIGONOS_ESPLUGUES: ZonaCiudad[] = [];

const BARRIOS_GAVA: ZonaCiudad[] = [
  { nombre: "Centre", tipo: "barrio" },
  { nombre: "Barceloneta", tipo: "barrio" },
  { nombre: "Àngela Roca", tipo: "barrio" },
  { nombre: "Can Serra Balet", tipo: "barrio" },
  { nombre: "Ausiàs March", tipo: "barrio" },
  { nombre: "Can Ribes", tipo: "barrio" },
  { nombre: "Les Ferreres", tipo: "barrio" },
  { nombre: "Ca n'Espinós", tipo: "barrio" },
  { nombre: "Bòbiles", tipo: "barrio" },
  { nombre: "Diagonal", tipo: "barrio" },
  { nombre: "Santa Teresa", tipo: "barrio" },
  { nombre: "Les Colomeres", tipo: "barrio" },
  { nombre: "La Sentiu", tipo: "barrio" },
  { nombre: "Bruguers", tipo: "barrio" },
  { nombre: "Can Tintorer", tipo: "barrio" },
  { nombre: "Can Pere Bori", tipo: "barrio" },
  { nombre: "Can Tries", tipo: "barrio" },
  { nombre: "Gavà Mar", tipo: "barrio" },
];

const POLIGONOS_GAVA: ZonaCiudad[] = [
  { nombre: "Les Massotes", tipo: "poligono" },
  { nombre: "La Post", tipo: "poligono" },
  { nombre: "Les Parets", tipo: "poligono" },
  { nombre: "El Camí Ral", tipo: "poligono" },
  { nombre: "El Regàs", tipo: "poligono" },
  { nombre: "La Marina", tipo: "poligono" },
];

const BARRIOS_MONTCADA: ZonaCiudad[] = [
  { nombre: "Mas Rampinyo", tipo: "barrio" },
  { nombre: "Mas Duran", tipo: "barrio" },
  { nombre: "Can Sant Joan", tipo: "barrio" },
  { nombre: "Terra Nostra", tipo: "barrio" },
  { nombre: "Montcada Centre", tipo: "barrio" },
  { nombre: "La Ribera", tipo: "barrio" },
  { nombre: "Vallençana-Reixac", tipo: "barrio" },
  { nombre: "Font Pudenta-Muntanyeta", tipo: "barrio" },
  { nombre: "Can Cuiàs", tipo: "barrio" },
  { nombre: "Montcada Nova-Pla d'en Coll", tipo: "barrio" },
];

const POLIGONOS_MONTCADA: ZonaCiudad[] = [
  { nombre: "Pla d'en Coll", tipo: "poligono" },
  { nombre: "Can Milans", tipo: "poligono" },
  { nombre: "La Granja", tipo: "poligono" },
  { nombre: "Foinvasa", tipo: "poligono" },
  { nombre: "Molí d'en Bisbe", tipo: "poligono" },
  { nombre: "Can Tapioles", tipo: "poligono" },
  { nombre: "La Ferreria", tipo: "poligono" },
  { nombre: "Hermes", tipo: "poligono" },
  { nombre: "Coll de Montcada", tipo: "poligono" },
  { nombre: "Asland", tipo: "poligono" },
];

const BARRIOS_TERRASSA: ZonaCiudad[] = [
  { nombre: "Can Parellada", tipo: "barrio" },
  { nombre: "Les Fonts", tipo: "barrio" },
  { nombre: "Can Jofresa", tipo: "barrio" },
  { nombre: "Guadalhorce", tipo: "barrio" },
  { nombre: "Can Palet II", tipo: "barrio" },
  { nombre: "Xúquer", tipo: "barrio" },
  { nombre: "Montserrat", tipo: "barrio" },
  { nombre: "Vilardell", tipo: "barrio" },
  { nombre: "Torre-sana", tipo: "barrio" },
  { nombre: "Les Arenes / La Grípia / Can Montllor", tipo: "barrio" },
  { nombre: "Sant Llorenç", tipo: "barrio" },
  { nombre: "Sant Pere Nord", tipo: "barrio" },
  { nombre: "Ègara", tipo: "barrio" },
  { nombre: "Ca n'Anglada", tipo: "barrio" },
  { nombre: "Plaça Catalunya / Escola Industrial", tipo: "barrio" },
  { nombre: "Cementiri Vell", tipo: "barrio" },
  { nombre: "Centre", tipo: "barrio" },
  { nombre: "Vallparadís", tipo: "barrio" },
  { nombre: "Antic Poble de Sant Pere", tipo: "barrio" },
  { nombre: "Sant Pere", tipo: "barrio" },
  { nombre: "Can Tusell", tipo: "barrio" },
  { nombre: "Pla del Bon Aire", tipo: "barrio" },
  { nombre: "Can Roca", tipo: "barrio" },
  { nombre: "Poble Nou / Zona Esportiva", tipo: "barrio" },
  { nombre: "Torrent d'en Pere Parres", tipo: "barrio" },
  { nombre: "Can Boada Casc Antic", tipo: "barrio" },
  { nombre: "Ca n'Aurell", tipo: "barrio" },
  { nombre: "La Maurina", tipo: "barrio" },
  { nombre: "La Cogullada", tipo: "barrio" },
  { nombre: "Segle XX", tipo: "barrio" },
  { nombre: "Can Palet", tipo: "barrio" },
  { nombre: "Roc Blanc", tipo: "barrio" },
  { nombre: "Can Boada del Pi", tipo: "barrio" },
  { nombre: "Can Gonteres", tipo: "barrio" },
  { nombre: "Can Palet de Vista Alegre", tipo: "barrio" },
  { nombre: "Vista Alegre", tipo: "barrio" },
  { nombre: "Les Martines", tipo: "barrio" },
  { nombre: "Pla del Bon Aire - El Garrot", tipo: "barrio" },
  { nombre: "Font de l'Espardenyera", tipo: "barrio" },
  { nombre: "Els Caus Els Pinetons", tipo: "barrio" },
];

const POLIGONOS_TERRASSA: ZonaCiudad[] = [
  { nombre: "Can Farcan", tipo: "poligono" },
  { nombre: "Santa Margarida I", tipo: "poligono" },
  { nombre: "Santa Margarida II", tipo: "poligono" },
  { nombre: "Can Guitard", tipo: "poligono" },
  { nombre: "Colom II", tipo: "poligono" },
  { nombre: "Els Bellots", tipo: "poligono" },
  { nombre: "Sector Montserrat", tipo: "poligono" },
  { nombre: "Can Gorgs", tipo: "poligono" },
  { nombre: "La Grípia", tipo: "poligono" },
  { nombre: "Can Petit", tipo: "poligono" },
  { nombre: "Puigbarral", tipo: "poligono" },
  { nombre: "Can Parellada industrial", tipo: "poligono" },
  { nombre: "Carrer d'Alemanya", tipo: "poligono" },
  { nombre: "Santa Eulàlia", tipo: "poligono" },
];

const BARRIOS_SABADELL: ZonaCiudad[] = [
  { nombre: "El Centre", tipo: "barrio" },
  { nombre: "Hostafrans", tipo: "barrio" },
  { nombre: "Covadonga", tipo: "barrio" },
  { nombre: "Nostra Llar", tipo: "barrio" },
  { nombre: "Sol i Padris", tipo: "barrio" },
  { nombre: "Avinguda-Eixample", tipo: "barrio" },
  { nombre: "La Creu Alta", tipo: "barrio" },
  { nombre: "Can Puiggener", tipo: "barrio" },
  { nombre: "Rodal de Togores", tipo: "barrio" },
  { nombre: "Ca n'Oriac", tipo: "barrio" },
  { nombre: "Torreguitart", tipo: "barrio" },
  { nombre: "Torrent del Capellà", tipo: "barrio" },
  { nombre: "La Plana del Pintor", tipo: "barrio" },
  { nombre: "Sant Julià", tipo: "barrio" },
  { nombre: "La Roureda", tipo: "barrio" },
  { nombre: "Can Deu", tipo: "barrio" },
  { nombre: "Rodal de St. Julià", tipo: "barrio" },
  { nombre: "La Concòrdia", tipo: "barrio" },
  { nombre: "Can Llong", tipo: "barrio" },
  { nombre: "Castellarnau", tipo: "barrio" },
  { nombre: "Rodal Berardo", tipo: "barrio" },
  { nombre: "Cifuentes", tipo: "barrio" },
  { nombre: "Can Rull", tipo: "barrio" },
  { nombre: "Gràcia", tipo: "barrio" },
  { nombre: "Can Feu", tipo: "barrio" },
  { nombre: "La Serra d'en Camaró", tipo: "barrio" },
  { nombre: "Els Merinals", tipo: "barrio" },
  { nombre: "Can Gambús", tipo: "barrio" },
  { nombre: "Rodal Oest", tipo: "barrio" },
  { nombre: "La Creu de Barberà", tipo: "barrio" },
  { nombre: "Les Termes", tipo: "barrio" },
  { nombre: "Espronceda", tipo: "barrio" },
  { nombre: "Campoamor", tipo: "barrio" },
  { nombre: "Sant Pau de Riu-Sec", tipo: "barrio" },
  { nombre: "El Raval d'Amàlia", tipo: "barrio" },
  { nombre: "El Poblenou", tipo: "barrio" },
  { nombre: "Torre-romeu", tipo: "barrio" },
  { nombre: "Can Roqueta", tipo: "barrio" },
  { nombre: "El Rodal de la Serra de Sant Iscle", tipo: "barrio" },
  { nombre: "Rodal Est", tipo: "barrio" },
];

const POLIGONOS_SABADELL: ZonaCiudad[] = [
  { nombre: "Sud-Oest", tipo: "poligono" },
  { nombre: "Parc Industrial Riu Ripoll", tipo: "poligono" },
  { nombre: "Gràcia Nord", tipo: "poligono" },
  { nombre: "Gràcia Sud", tipo: "poligono" },
  { nombre: "Sabadell Parc Empresarial", tipo: "poligono" },
];

const BARRIOS_MATARO: ZonaCiudad[] = [
  { nombre: "Peramàs", tipo: "barrio" },
  { nombre: "Centre", tipo: "barrio" },
  { nombre: "Escorxador", tipo: "barrio" },
  { nombre: "Rocafonda", tipo: "barrio" },
  { nombre: "Vista Alegre", tipo: "barrio" },
  { nombre: "Els Molins", tipo: "barrio" },
  { nombre: "Cirera", tipo: "barrio" },
  { nombre: "La Llàntia", tipo: "barrio" },
  { nombre: "El Palau", tipo: "barrio" },
  { nombre: "Cerdanyola", tipo: "barrio" },
  { nombre: "Pla d'en Boet", tipo: "barrio" },
  { nombre: "Eixample", tipo: "barrio" },
];

const POLIGONOS_MATARO: ZonaCiudad[] = [
  { nombre: "Mata-Rocafonda", tipo: "poligono" },
  { nombre: "Balançó i Boter", tipo: "poligono" },
  { nombre: "Hortes del Camí Ral", tipo: "poligono" },
  { nombre: "Vallveric", tipo: "poligono" },
  { nombre: "El Rengle I", tipo: "poligono" },
  { nombre: "El Rengle II", tipo: "poligono" },
];

const BARRIOS_SANT_CUGAT: ZonaCiudad[] = [
  { nombre: "Eixample Sud", tipo: "barrio" },
  { nombre: "Centre", tipo: "barrio" },
  { nombre: "Parc Central", tipo: "barrio" },
  { nombre: "El Colomer", tipo: "barrio" },
  { nombre: "Can Gatxet", tipo: "barrio" },
  { nombre: "Pla de la Pagesa", tipo: "barrio" },
  { nombre: "Arxiu", tipo: "barrio" },
  { nombre: "Sant Domènec Est", tipo: "barrio" },
  { nombre: "Golf", tipo: "barrio" },
  { nombre: "Costa del Golf", tipo: "barrio" },
  { nombre: "Can Trabal", tipo: "barrio" },
  { nombre: "Coll Favà", tipo: "barrio" },
  { nombre: "Can Magí Nord", tipo: "barrio" },
  { nombre: "Can Magí Sud", tipo: "barrio" },
  { nombre: "Sant Francesc", tipo: "barrio" },
  { nombre: "Monestir", tipo: "barrio" },
  { nombre: "Torre Blanca", tipo: "barrio" },
  { nombre: "Torre Negra", tipo: "barrio" },
  { nombre: "Can Bell", tipo: "barrio" },
  { nombre: "Calado", tipo: "barrio" },
  { nombre: "Can Gordi", tipo: "barrio" },
  { nombre: "Collserola - Centre", tipo: "barrio" },
  { nombre: "Volpelleres", tipo: "barrio" },
  { nombre: "Can Barata", tipo: "barrio" },
  { nombre: "Galliners", tipo: "barrio" },
  { nombre: "Can Sant Joan Nord", tipo: "barrio" },
  { nombre: "Can Sant Joan Sud", tipo: "barrio" },
  { nombre: "La Guinardera", tipo: "barrio" },
  { nombre: "Sant Domènec Oest", tipo: "barrio" },
  { nombre: "Roquetes", tipo: "barrio" },
  { nombre: "Mira-sol", tipo: "barrio" },
  { nombre: "Mas Gener", tipo: "barrio" },
  { nombre: "Can Cabassa", tipo: "barrio" },
  { nombre: "Ca n'Ametller", tipo: "barrio" },
  { nombre: "Can Mates Nord", tipo: "barrio" },
  { nombre: "Can Mates Est", tipo: "barrio" },
  { nombre: "Can Mates Oest", tipo: "barrio" },
  { nombre: "Bell Indret", tipo: "barrio" },
  { nombre: "Colònia Oller", tipo: "barrio" },
  { nombre: "La Serreta", tipo: "barrio" },
  { nombre: "La Muntanyesa", tipo: "barrio" },
  { nombre: "Can Llobet", tipo: "barrio" },
  { nombre: "Casino", tipo: "barrio" },
  { nombre: "Turó del Fumet", tipo: "barrio" },
  { nombre: "Buscarons", tipo: "barrio" },
  { nombre: "Sol i Aire", tipo: "barrio" },
  { nombre: "Collserola - Floresta", tipo: "barrio" },
  { nombre: "Mas Fortuny", tipo: "barrio" },
  { nombre: "Sant Medir", tipo: "barrio" },
  { nombre: "Les Planes", tipo: "barrio" },
  { nombre: "Can Cortés", tipo: "barrio" },
  { nombre: "Can Borrull", tipo: "barrio" },
  { nombre: "Collserola - Les Planes", tipo: "barrio" },
  { nombre: "Sant Jaume", tipo: "barrio" },
  { nombre: "La Barceloneta", tipo: "barrio" },
  { nombre: "Can Cadena", tipo: "barrio" },
  { nombre: "Ca n'Enric La Miranda", tipo: "barrio" },
  { nombre: "Mas Fuster", tipo: "barrio" },
  { nombre: "Aqualonga", tipo: "barrio" },
  { nombre: "Rossinyol", tipo: "barrio" },
  { nombre: "Mas Roig", tipo: "barrio" },
  { nombre: "Les Bobines", tipo: "barrio" },
  { nombre: "Montmany", tipo: "barrio" },
  { nombre: "Regadiu", tipo: "barrio" },
  { nombre: "Can Casulleres", tipo: "barrio" },
  { nombre: "Colònia Montserrat", tipo: "barrio" },
  { nombre: "Can Calopa", tipo: "barrio" },
  { nombre: "Collserola - Valldoreix", tipo: "barrio" },
];

const POLIGONOS_SANT_CUGAT: ZonaCiudad[] = [
  { nombre: "Can Sant Joan", tipo: "poligono" },
  { nombre: "Can Mates", tipo: "poligono" },
  { nombre: "Sant Mamet", tipo: "poligono" },
  { nombre: "Can Magí-Can Calders", tipo: "poligono" },
];

const BARRIOS_RUBI: ZonaCiudad[] = [
  { nombre: "Can Fatjó", tipo: "barrio" },
  { nombre: "Sant Jordi Park", tipo: "barrio" },
  { nombre: "Can Serrafossà – La Perla", tipo: "barrio" },
  { nombre: "Can Ximelis", tipo: "barrio" },
  { nombre: "Els Avets", tipo: "barrio" },
  { nombre: "Castellnou – Can Mir", tipo: "barrio" },
  { nombre: "Can Solà", tipo: "barrio" },
  { nombre: "Can Barceló - Vallespark", tipo: "barrio" },
  { nombre: "Sant Muç", tipo: "barrio" },
  { nombre: "Ca n’Alzamora", tipo: "barrio" },
  { nombre: "Can Vallhonrat", tipo: "barrio" },
  { nombre: "25 de Setembre", tipo: "barrio" },
  { nombre: "Les Torres", tipo: "barrio" },
  { nombre: "Centre", tipo: "barrio" },
  { nombre: "Plana del Castell", tipo: "barrio" },
  { nombre: "Ca n’Oriol", tipo: "barrio" },
  { nombre: "Zona Nord - La Serreta", tipo: "barrio" },
  { nombre: "Can Rosés", tipo: "barrio" },
  { nombre: "El Progrés - Rubí 2000", tipo: "barrio" },
  { nombre: "Mercat", tipo: "barrio" },
  { nombre: "Plana de Can Bertran", tipo: "barrio" },
  { nombre: "Sector Z", tipo: "barrio" },
  { nombre: "El Pinar", tipo: "barrio" },
];

const POLIGONOS_RUBI: ZonaCiudad[] = [
  { nombre: "CiT 1A Can Vallhonrat", tipo: "poligono" },
  { nombre: "CiT 1B Can Jardí", tipo: "poligono" },
  { nombre: "CiT 1D Rubí Sud", tipo: "poligono" },
  { nombre: "CiT 1E Can Alzamora", tipo: "poligono" },
  { nombre: "CiT 1F Cova Solera", tipo: "poligono" },
  { nombre: "CiT 1G Sant Genís", tipo: "poligono" },
  { nombre: "CiT 3A Can Sant Joan Oest", tipo: "poligono" },
  { nombre: "CiT 5A Ctra. Terrassa", tipo: "poligono" },
  { nombre: "CiT 5B La Llana- Can Serra", tipo: "poligono" },
  { nombre: "CiT 5C Molí de la Bastida", tipo: "poligono" },
  { nombre: "CiT 5D Can Rosés", tipo: "poligono" },
];

const BARRIOS_VILANOVA: ZonaCiudad[] = [
  { nombre: "L'Aragai", tipo: "barrio" },
  { nombre: "L'Armanyà", tipo: "barrio" },
  { nombre: "Barri de Mar", tipo: "barrio" },
  { nombre: "Can Marquès", tipo: "barrio" },
  { nombre: "Casernes", tipo: "barrio" },
  { nombre: "Centrevila", tipo: "barrio" },
  { nombre: "La Collada - Els Sis Camins", tipo: "barrio" },
  { nombre: "Fondo Somella", tipo: "barrio" },
  { nombre: "La Geltrú", tipo: "barrio" },
  { nombre: "Masia Nova", tipo: "barrio" },
  { nombre: "Molí de Vent", tipo: "barrio" },
  { nombre: "Nucli Antic", tipo: "barrio" },
  { nombre: "Plaça de La Sardana", tipo: "barrio" },
  { nombre: "Prat de Vilanova", tipo: "barrio" },
  { nombre: "Ribes Roges", tipo: "barrio" },
  { nombre: "Sant Joan", tipo: "barrio" },
  { nombre: "Santa Maria", tipo: "barrio" },
  { nombre: "Tacó", tipo: "barrio" },
];

const POLIGONOS_VILANOVA: ZonaCiudad[] = [
  { nombre: "Masia d'en Frederic", tipo: "poligono" },
  { nombre: "Masia del Notari", tipo: "poligono" },
  { nombre: "Masia del Notari – Pirelli", tipo: "poligono" },
  { nombre: "Polígono industrial Masia Barreres", tipo: "poligono" },
  { nombre: "Sector Marquès", tipo: "poligono" },
  { nombre: "Industrial Roquetes", tipo: "poligono" },
  { nombre: "La Bòbila", tipo: "poligono" },
  { nombre: "Torrent de Santa Magdalena", tipo: "poligono" },
  { nombre: "Sínia de les Vaques", tipo: "poligono" },
  { nombre: "Industrial Roquetes Subsector V", tipo: "poligono" },
  { nombre: "La Pastera", tipo: "poligono" },
  { nombre: "Industrial La Plana", tipo: "poligono" },
];

const BARRIOS_CASTELLDEFELS: ZonaCiudad[] = [
  { nombre: "Baixador", tipo: "barrio" },
  { nombre: "Bellamar", tipo: "barrio" },
  { nombre: "Les Botigues", tipo: "barrio" },
  { nombre: "Can Roca", tipo: "barrio" },
  { nombre: "El Castell-Poble Vell", tipo: "barrio" },
  { nombre: "Els Canyars", tipo: "barrio" },
  { nombre: "Centre", tipo: "barrio" },
  { nombre: "Gran Via Mar", tipo: "barrio" },
  { nombre: "Lluminetes", tipo: "barrio" },
  { nombre: "Mar-i-Sol", tipo: "barrio" },
  { nombre: "Montmar", tipo: "barrio" },
  { nombre: "La Pineda", tipo: "barrio" },
  { nombre: "El Poal", tipo: "barrio" },
  { nombre: "Zona Universitària", tipo: "barrio" },
  { nombre: "Camí Ral", tipo: "barrio" },
  { nombre: "Vista Alegre", tipo: "barrio" },
  { nombre: "Can Bou", tipo: "barrio" },
  { nombre: "Muntanyeta", tipo: "barrio" },
  { nombre: "Can Vinader", tipo: "barrio" },
];

const POLIGONOS_CASTELLDEFELS: ZonaCiudad[] = [
  { nombre: "Polígono Industrial del Camí Ral", tipo: "poligono" },
  { nombre: "Parc Mediterrani de la Tecnologia", tipo: "poligono" },
  { nombre: "Pla de Carat", tipo: "poligono" },
];

const BARRIOS_GRANOLLERS: ZonaCiudad[] = [
  { nombre: "Can Bassa", tipo: "barrio" },
  { nombre: "Can Gili", tipo: "barrio" },
  { nombre: "Can Mònic", tipo: "barrio" },
  { nombre: "Centre", tipo: "barrio" },
  { nombre: "Congost", tipo: "barrio" },
  { nombre: "Font Verda", tipo: "barrio" },
  { nombre: "Granollers Nord", tipo: "barrio" },
  { nombre: "Instituts", tipo: "barrio" },
  { nombre: "Joan Prim", tipo: "barrio" },
  { nombre: "L'Hostal", tipo: "barrio" },
  { nombre: "Lledoner", tipo: "barrio" },
  { nombre: "Palou", tipo: "barrio" },
  { nombre: "Ponent", tipo: "barrio" },
  { nombre: "Sant Miquel", tipo: "barrio" },
  { nombre: "Sota el Camí Ral", tipo: "barrio" },
  { nombre: "Tres Torres", tipo: "barrio" },
  { nombre: "Zona Industrial", tipo: "barrio" },
];

const POLIGONOS_GRANOLLERS: ZonaCiudad[] = [
  { nombre: "El Congost", tipo: "poligono" },
  { nombre: "Jordi Camp", tipo: "poligono" },
  { nombre: "Palou Nord", tipo: "poligono" },
  { nombre: "Font del Ràdium", tipo: "poligono" },
  { nombre: "El Coll de la Manya", tipo: "poligono" },
  { nombre: "El Ramassar", tipo: "poligono" },
  { nombre: "Cal Gordi - Can Català", tipo: "poligono" },
];

const BARRIOS_CERDANYOLA: ZonaCiudad[] = [
  { nombre: "Antolí", tipo: "barrio" },
  { nombre: "Av. Catalunya", tipo: "barrio" },
  { nombre: "Banús", tipo: "barrio" },
  { nombre: "Barri de Baix", tipo: "barrio" },
  { nombre: "Barri de Dalt", tipo: "barrio" },
  { nombre: "Bellaterra", tipo: "barrio" },
  { nombre: "Bonasort", tipo: "barrio" },
  { nombre: "Can Cerdà", tipo: "barrio" },
  { nombre: "Can Fatjó dels Aurons", tipo: "barrio" },
  { nombre: "Can Planas", tipo: "barrio" },
  { nombre: "Can Serra", tipo: "barrio" },
  { nombre: "Can Xarau", tipo: "barrio" },
  { nombre: "Canaletes", tipo: "barrio" },
  { nombre: "Cerdanyola 2000", tipo: "barrio" },
  { nombre: "Centre", tipo: "barrio" },
  { nombre: "Centre Direccional", tipo: "barrio" },
  { nombre: "Cordelles", tipo: "barrio" },
  { nombre: "Els Gorgs", tipo: "barrio" },
  { nombre: "Els Mayols", tipo: "barrio" },
  { nombre: "Els Xops", tipo: "barrio" },
  { nombre: "Farigola", tipo: "barrio" },
  { nombre: "Font d'en Fargues", tipo: "barrio" },
  { nombre: "La Fàngola", tipo: "barrio" },
  { nombre: "La Sínia", tipo: "barrio" },
  { nombre: "Les Fontetes", tipo: "barrio" },
  { nombre: "Martinica", tipo: "barrio" },
  { nombre: "Montflorit", tipo: "barrio" },
  { nombre: "Parc de l'Alba", tipo: "barrio" },
  { nombre: "Parc Tecnològic del Vallès", tipo: "barrio" },
  { nombre: "Parcers", tipo: "barrio" },
  { nombre: "Plana del Castell", tipo: "barrio" },
  { nombre: "Pont Vell", tipo: "barrio" },
  { nombre: "Quatre Cantons", tipo: "barrio" },
  { nombre: "Sant Pau", tipo: "barrio" },
  { nombre: "Sant Ramon", tipo: "barrio" },
  { nombre: "Santa Rosa", tipo: "barrio" },
  { nombre: "Serragalliners", tipo: "barrio" },
  { nombre: "Serraparera", tipo: "barrio" },
  { nombre: "Terranova", tipo: "barrio" },
  { nombre: "Tiana", tipo: "barrio" },
  { nombre: "Turonet", tipo: "barrio" },
  { nombre: "Turó de Sant Pau", tipo: "barrio" },
  { nombre: "Universitat Autònoma de Barcelona (UAB)", tipo: "barrio" },
  { nombre: "Uralita", tipo: "barrio" },
  { nombre: "Vila Universitària", tipo: "barrio" },
  { nombre: "Xarau", tipo: "barrio" },
];

const POLIGONOS_CERDANYOLA: ZonaCiudad[] = [
  { nombre: "Can Fatjó Nord", tipo: "poligono" },
  { nombre: "Can Fatjó Sud", tipo: "poligono" },
  { nombre: "Can Mitjans", tipo: "poligono" },
  { nombre: "Carretera de Barcelona", tipo: "poligono" },
  { nombre: "La Bòbila", tipo: "poligono" },
  { nombre: "La Clota", tipo: "poligono" },
  { nombre: "Polizur", tipo: "poligono" },
  { nombre: "Riviere – Can Mitjans", tipo: "poligono" },
  { nombre: "Santa Anna – Xarau", tipo: "poligono" },
];

const BARRIOS_MOLLET: ZonaCiudad[] = [
  { nombre: "Área del Tir Olímpico", tipo: "barrio" },
  { nombre: "Barri de Can Borrell", tipo: "barrio" },
  { nombre: "Barri de Can Pantiquet", tipo: "barrio" },
  { nombre: "Barri de la Casilla", tipo: "barrio" },
  { nombre: "Barri de la Plana Lledó", tipo: "barrio" },
  { nombre: "Barri de la Riera Seca", tipo: "barrio" },
  { nombre: "Barri del Calderí", tipo: "barrio" },
  { nombre: "Barri del Centre", tipo: "barrio" },
  { nombre: "Barri de l'Estació de França", tipo: "barrio" },
  { nombre: "Barri de l'Estació del Nord", tipo: "barrio" },
  { nombre: "Barri dels Col·legis Nous", tipo: "barrio" },
  { nombre: "Barri de Lourdes", tipo: "barrio" },
  { nombre: "Barri de Santa Rosa", tipo: "barrio" },
  { nombre: "Gallecs", tipo: "barrio" },
  { nombre: "Mollet Centre", tipo: "barrio" },
  { nombre: "Montseny", tipo: "barrio" },
  { nombre: "Sant Jordi", tipo: "barrio" },
  { nombre: "Sant Vicenç", tipo: "barrio" },
  { nombre: "Vicenç Plantada", tipo: "barrio" },
  { nombre: "Xarranca", tipo: "barrio" },
];

const POLIGONOS_MOLLET: ZonaCiudad[] = [
  { nombre: "Can Magarola", tipo: "poligono" },
  { nombre: "Can Magre", tipo: "poligono" },
  { nombre: "Can Prat", tipo: "poligono" },
  { nombre: "La Farinera", tipo: "poligono" },
  { nombre: "Mas Regà", tipo: "poligono" },
];

const BARRIOS_BARBERA: ZonaCiudad[] = [
  { nombre: "Barri Antic", tipo: "barrio" },
  { nombre: "Barri de l'Estació", tipo: "barrio" },
  { nombre: "Barri de la Romànica", tipo: "barrio" },
  { nombre: "Barri de Can Gorgs", tipo: "barrio" },
  { nombre: "Can Gorgs II", tipo: "barrio" },
  { nombre: "Can Llobet", tipo: "barrio" },
  { nombre: "Can Rabella", tipo: "barrio" },
  { nombre: "Can Serra", tipo: "barrio" },
  { nombre: "Ca n'Esteper", tipo: "barrio" },
  { nombre: "Centre", tipo: "barrio" },
  { nombre: "Colònia Estaper", tipo: "barrio" },
  { nombre: "Creu de Barberà", tipo: "barrio" },
  { nombre: "Eixample", tipo: "barrio" },
  { nombre: "Espronceda", tipo: "barrio" },
  { nombre: "La Romànica", tipo: "barrio" },
  { nombre: "Les Termes", tipo: "barrio" },
  { nombre: "Molí d'en Santo", tipo: "barrio" },
  { nombre: "Parc Central", tipo: "barrio" },
  { nombre: "Parc d'Europa", tipo: "barrio" },
  { nombre: "Parc Europa", tipo: "barrio" },
  { nombre: "Santiga", tipo: "barrio" },
  { nombre: "Torre Mateu", tipo: "barrio" },
  { nombre: "Zona Nord", tipo: "barrio" },
];

const POLIGONOS_BARBERA: ZonaCiudad[] = [
  { nombre: "Can Gorgs", tipo: "poligono" },
  { nombre: "Can Salvatella", tipo: "poligono" },
  { nombre: "Joan Mateu", tipo: "poligono" },
  { nombre: "Polígono A", tipo: "poligono" },
  { nombre: "Polígono B", tipo: "poligono" },
  { nombre: "Polígono C", tipo: "poligono" },
  { nombre: "Provasa", tipo: "poligono" },
  { nombre: "Ronda Santa Maria", tipo: "poligono" },
  { nombre: "Santiga – Provasa", tipo: "poligono" },
  { nombre: "Santa Maria", tipo: "poligono" },
];

const BARRIOS_MANRESA: ZonaCiudad[] = [
  { nombre: "Barri Antic", tipo: "barrio" },
  { nombre: "Balconada", tipo: "barrio" },
  { nombre: "Bases de Manresa", tipo: "barrio" },
  { nombre: "Cal Gravat", tipo: "barrio" },
  { nombre: "Cal Perramon", tipo: "barrio" },
  { nombre: "Cal Sabata", tipo: "barrio" },
  { nombre: "Carretera de Santpedor", tipo: "barrio" },
  { nombre: "Els Comtals", tipo: "barrio" },
  { nombre: "Escodines", tipo: "barrio" },
  { nombre: "Farreres", tipo: "barrio" },
  { nombre: "Font dels Capellans", tipo: "barrio" },
  { nombre: "Guix", tipo: "barrio" },
  { nombre: "Guix – Pujada Roja", tipo: "barrio" },
  { nombre: "La Guia", tipo: "barrio" },
  { nombre: "La Parada", tipo: "barrio" },
  { nombre: "Les Cots", tipo: "barrio" },
  { nombre: "Mion", tipo: "barrio" },
  { nombre: "Miralpeix", tipo: "barrio" },
  { nombre: "Parc Tecnològic de la Catalunya Central", tipo: "barrio" },
  { nombre: "Passeig i Rodalies", tipo: "barrio" },
  { nombre: "Plaça Catalunya – Saldes", tipo: "barrio" },
  { nombre: "Pla dels Vinyats", tipo: "barrio" },
  { nombre: "Plana del Pont Nou", tipo: "barrio" },
  { nombre: "Poble Nou", tipo: "barrio" },
  { nombre: "Poal", tipo: "barrio" },
  { nombre: "Puigberenguer", tipo: "barrio" },
  { nombre: "Pujada Roja", tipo: "barrio" },
  { nombre: "Sant Pau", tipo: "barrio" },
  { nombre: "Sagrada Família", tipo: "barrio" },
  { nombre: "Santa Caterina", tipo: "barrio" },
  { nombre: "Suanya", tipo: "barrio" },
  { nombre: "Tossal dels Cigalons", tipo: "barrio" },
  { nombre: "Valldaura", tipo: "barrio" },
  { nombre: "Vic – Remei", tipo: "barrio" },
  { nombre: "Viladordis", tipo: "barrio" },
  { nombre: "El Xup", tipo: "barrio" },
];

const POLIGONOS_MANRESA: ZonaCiudad[] = [
  { nombre: "Bufalvent", tipo: "poligono" },
  { nombre: "Comtals I", tipo: "poligono" },
  { nombre: "Comtals II", tipo: "poligono" },
  { nombre: "Passeig del Riu", tipo: "poligono" },
  { nombre: "Pont Nou I", tipo: "poligono" },
  { nombre: "Pont Nou II", tipo: "poligono" },
  { nombre: "Sant Joan d'en Coll", tipo: "poligono" },
  { nombre: "Trullols", tipo: "poligono" },
  { nombre: "Els Dolors", tipo: "poligono" },
  { nombre: "Els Dolors II", tipo: "poligono" },
  { nombre: "El Guix", tipo: "poligono" },
];

const BARRIOS_SITGES: ZonaCiudad[] = [
  { nombre: "Aiguadolç", tipo: "barrio" },
  { nombre: "Baix Fondac", tipo: "barrio" },
  { nombre: "Can Girona", tipo: "barrio" },
  { nombre: "Can Güell", tipo: "barrio" },
  { nombre: "Can Pei", tipo: "barrio" },
  { nombre: "Cases del Sord", tipo: "barrio" },
  { nombre: "Cases Noves", tipo: "barrio" },
  { nombre: "Casc Antic – Centre", tipo: "barrio" },
  { nombre: "Garraf", tipo: "barrio" },
  { nombre: "Garraf Dos", tipo: "barrio" },
  { nombre: "La Bòbila", tipo: "barrio" },
  { nombre: "La Llevantina", tipo: "barrio" },
  { nombre: "La Marina d'Aiguadolç", tipo: "barrio" },
  { nombre: "La Plana", tipo: "barrio" },
  { nombre: "La Plana Est", tipo: "barrio" },
  { nombre: "Les Botigues de Sitges", tipo: "barrio" },
  { nombre: "Les Botigues – Rat Penat", tipo: "barrio" },
  { nombre: "Els Molins", tipo: "barrio" },
  { nombre: "L'Oasis", tipo: "barrio" },
  { nombre: "Madriguera", tipo: "barrio" },
  { nombre: "Miralpeix", tipo: "barrio" },
  { nombre: "Montgavina", tipo: "barrio" },
  { nombre: "Nucli Antic", tipo: "barrio" },
  { nombre: "Parc de Mar", tipo: "barrio" },
  { nombre: "Passeig Marítim", tipo: "barrio" },
  { nombre: "Plans d'Aiguadolç", tipo: "barrio" },
  { nombre: "Poble de Garraf", tipo: "barrio" },
  { nombre: "Poble Sec – Pins Vens", tipo: "barrio" },
  { nombre: "Quintmar", tipo: "barrio" },
  { nombre: "Rat-Penat", tipo: "barrio" },
  { nombre: "Sant Crispí", tipo: "barrio" },
  { nombre: "Sant Sebastià", tipo: "barrio" },
  { nombre: "Santa Bàrbara", tipo: "barrio" },
  { nombre: "Sínia Morera", tipo: "barrio" },
  { nombre: "Terramar", tipo: "barrio" },
  { nombre: "Vallcarca", tipo: "barrio" },
  { nombre: "Vallpineda", tipo: "barrio" },
  { nombre: "Vallpineda – Santa Bàrbara", tipo: "barrio" },
  { nombre: "Vinyet", tipo: "barrio" },
];

const POLIGONOS_SITGES: ZonaCiudad[] = [
  { nombre: "Mas Alba", tipo: "poligono" },
  { nombre: "Vallcarca – Uniland", tipo: "poligono" },
];

const BARRIOS_SANT_PERE: ZonaCiudad[] = [
  { nombre: "Amèriques, Les", tipo: "barrio" },
  { nombre: "Autòdrom", tipo: "barrio" },
  { nombre: "Bòbila, La", tipo: "barrio" },
  { nombre: "Can Girabals", tipo: "barrio" },
  { nombre: "Can Giralt", tipo: "barrio" },
  { nombre: "Can Jove", tipo: "barrio" },
  { nombre: "Can Lloses – Can Marcer", tipo: "barrio" },
  { nombre: "Can Macià", tipo: "barrio" },
  { nombre: "Can Mestre", tipo: "barrio" },
  { nombre: "Can Pere de la Plana", tipo: "barrio" },
  { nombre: "Can Puig", tipo: "barrio" },
  { nombre: "Carç, El", tipo: "barrio" },
  { nombre: "Cards, Els", tipo: "barrio" },
  { nombre: "Cervereta", tipo: "barrio" },
  { nombre: "Colls, Els", tipo: "barrio" },
  { nombre: "Garrofers, Els", tipo: "barrio" },
  { nombre: "Mas Alba", tipo: "barrio" },
  { nombre: "Mas d'en Serra", tipo: "barrio" },
  { nombre: "Mas Parés de Dalt", tipo: "barrio" },
  { nombre: "Mas Solers", tipo: "barrio" },
  { nombre: "Mercat – Parc Central", tipo: "barrio" },
  { nombre: "Minivilles", tipo: "barrio" },
  { nombre: "Mirador de Sitges", tipo: "barrio" },
  { nombre: "Palou Alt, El", tipo: "barrio" },
  { nombre: "Parellades, Les", tipo: "barrio" },
  { nombre: "Pineda Parc", tipo: "barrio" },
  { nombre: "Puigmoltó", tipo: "barrio" },
  { nombre: "Racó, El", tipo: "barrio" },
  { nombre: "Ribes", tipo: "barrio" },
  { nombre: "Rocamar", tipo: "barrio" },
  { nombre: "Roquetes, Les", tipo: "barrio" },
  { nombre: "Sant Camil (Hospital)", tipo: "barrio" },
  { nombre: "Sota-ribes", tipo: "barrio" },
  { nombre: "Solicrup", tipo: "barrio" },
  { nombre: "Torre del Veguer", tipo: "barrio" },
  { nombre: "Torres, Les", tipo: "barrio" },
  { nombre: "Vallpineda", tipo: "barrio" },
  { nombre: "Vilanoveta", tipo: "barrio" },
  { nombre: "Vinyals, Els", tipo: "barrio" },
  { nombre: "Viñedos – Can Macià", tipo: "barrio" },
];

const POLIGONOS_SANT_PERE: ZonaCiudad[] = [
  { nombre: "Tecnològic – Can Puig", tipo: "poligono" },
  { nombre: "Variant C-31", tipo: "poligono" },
];

const BARRIOS_VIC: ZonaCiudad[] = [
  { nombre: "Barri de l'Estadi", tipo: "barrio" },
  { nombre: "Barri del Nord", tipo: "barrio" },
  { nombre: "Barri del Remei", tipo: "barrio" },
  { nombre: "Barri dels Caputxins", tipo: "barrio" },
  { nombre: "Barri dels Molins", tipo: "barrio" },
  { nombre: "Barri Osona", tipo: "barrio" },
  { nombre: "Barri Santa Anna", tipo: "barrio" },
  { nombre: "Barri Serra-de-senferm", tipo: "barrio" },
  { nombre: "Barri Sant Llàtzer – Quatre Estacions", tipo: "barrio" },
  { nombre: "Barri del Sucre", tipo: "barrio" },
  { nombre: "Barri de la Calla", tipo: "barrio" },
  { nombre: "Barri de l'Horta Vermella", tipo: "barrio" },
  { nombre: "Barri del Carrer Sant Pere", tipo: "barrio" },
  { nombre: "Centre Històric", tipo: "barrio" },
  { nombre: "Castell d'en Planes", tipo: "barrio" },
  { nombre: "El Nadal", tipo: "barrio" },
  { nombre: "El Portal de Queralt", tipo: "barrio" },
  { nombre: "La Guixa", tipo: "barrio" },
  { nombre: "La Serra", tipo: "barrio" },
  { nombre: "Sentfores", tipo: "barrio" },
  { nombre: "Zona del Seminari", tipo: "barrio" },
  { nombre: "Zona de l'Hospital", tipo: "barrio" },
  { nombre: "Zona de la Plaça Major", tipo: "barrio" },
  { nombre: "Zona de la Carretera de Roda", tipo: "barrio" },
  { nombre: "Zona de la Carretera de Manlleu", tipo: "barrio" },
  { nombre: "Zona de la Carretera de Barcelona", tipo: "barrio" },
];

const POLIGONOS_VIC: ZonaCiudad[] = [
  { nombre: "El Bruguer", tipo: "poligono" },
  { nombre: "Les Casasses", tipo: "poligono" },
  { nombre: "Malloles", tipo: "poligono" },
  { nombre: "Mas Beuló", tipo: "poligono" },
  { nombre: "Mas de Bigas", tipo: "poligono" },
  { nombre: "Mas d'en Prat", tipo: "poligono" },
  { nombre: "Parc d'Activitats Econòmiques d'Osona Nord", tipo: "poligono" },
  { nombre: "Parc d'Activitats Econòmiques d'Osona Sud", tipo: "poligono" },
  { nombre: "Sot dels Pradals", tipo: "poligono" },
];

const BARRIOS_IGUALADA: ZonaCiudad[] = [
  { nombre: "Barri de Fàtima", tipo: "barrio" },
  { nombre: "Barri de Sant Agustí", tipo: "barrio" },
  { nombre: "Barri de Sant Crist", tipo: "barrio" },
  { nombre: "Barri de Sant Jaume de Sesoliveres", tipo: "barrio" },
  { nombre: "Barri de Set Camins", tipo: "barrio" },
  { nombre: "Barri del Poble Sec", tipo: "barrio" },
  { nombre: "Barri del Rec", tipo: "barrio" },
  { nombre: "Barri del Xipreret", tipo: "barrio" },
  { nombre: "Barri de Cal Font", tipo: "barrio" },
  { nombre: "Barri de Santa Caterina", tipo: "barrio" },
  { nombre: "Barri de l'Aurora", tipo: "barrio" },
  { nombre: "Barri de les Flors", tipo: "barrio" },
  { nombre: "Barri de Montserrat", tipo: "barrio" },
  { nombre: "Barri de les Comes", tipo: "barrio" },
  { nombre: "Barri de la Soledat", tipo: "barrio" },
  { nombre: "Barri de la Zona Escolar", tipo: "barrio" },
  { nombre: "Barri de l'Antic Escorxador", tipo: "barrio" },
  { nombre: "Barri de Pla de la Massa", tipo: "barrio" },
  { nombre: "Barri de Ses Oliveres", tipo: "barrio" },
  { nombre: "Centre Històric", tipo: "barrio" },
  { nombre: "Eixample", tipo: "barrio" },
  { nombre: "Molí Nou", tipo: "barrio" },
  { nombre: "Nucli Antic", tipo: "barrio" },
  { nombre: "Pla de la Massa", tipo: "barrio" },
  { nombre: "Sant Jaume Sesoliveres", tipo: "barrio" },
  { nombre: "Set Camins", tipo: "barrio" },
];

const POLIGONOS_IGUALADA: ZonaCiudad[] = [
  { nombre: "Les Comes", tipo: "poligono" },
  { nombre: "El Rec", tipo: "poligono" },
  { nombre: "Polígono Industrial Les Comes", tipo: "poligono" },
  { nombre: "Polígono Industrial del Rec", tipo: "poligono" },
];

const BARRIOS_VILAFRANCA: ZonaCiudad[] = [
  { nombre: "Barceloneta – Sant Magí", tipo: "barrio" },
  { nombre: "Bordallet", tipo: "barrio" },
  { nombre: "Cal Salines", tipo: "barrio" },
  { nombre: "Carrer d'en Pere Pau", tipo: "barrio" },
  { nombre: "Centre de la Vila", tipo: "barrio" },
  { nombre: "Ciutat Jardí", tipo: "barrio" },
  { nombre: "L'Espirall", tipo: "barrio" },
  { nombre: "La Girada", tipo: "barrio" },
  { nombre: "La Serreta", tipo: "barrio" },
  { nombre: "Les Clotes", tipo: "barrio" },
  { nombre: "Molí d'en Rovira", tipo: "barrio" },
  { nombre: "Poble Nou", tipo: "barrio" },
  { nombre: "Sant Julià", tipo: "barrio" },
];

const POLIGONOS_VILAFRANCA: ZonaCiudad[] = [
  { nombre: "Els Cirerers", tipo: "poligono" },
  { nombre: "Estació de Mercaderies – Les Fonts", tipo: "poligono" },
  { nombre: "Domenys I", tipo: "poligono" },
  { nombre: "Domenys II", tipo: "poligono" },
  { nombre: "Domenys III", tipo: "poligono" },
  { nombre: "Domenys IV", tipo: "poligono" },
  { nombre: "Llevant", tipo: "poligono" },
  { nombre: "Marges Alts", tipo: "poligono" },
  { nombre: "PAU 10", tipo: "poligono" },
  { nombre: "PAU 19 – Carretera de Barcelona", tipo: "poligono" },
  { nombre: "Pous d'en Rossell", tipo: "poligono" },
  { nombre: "Porroig", tipo: "poligono" },
  { nombre: "Rocallisa", tipo: "poligono" },
  { nombre: "Sud-Oest", tipo: "poligono" },
  { nombre: "Tigsa", tipo: "poligono" },
  { nombre: "Vallmoll", tipo: "poligono" },
  { nombre: "Avinguda de Tarragona", tipo: "poligono" },
  { nombre: "Avinguda de Barcelona", tipo: "poligono" },
];

const BARRIOS_TARRAGONA: ZonaCiudad[] = [
  { nombre: "Albada, l'", tipo: "barrio" },
  { nombre: "Arrabassada", tipo: "barrio" },
  { nombre: "Barri del Port", tipo: "barrio" },
  { nombre: "Bon Sol", tipo: "barrio" },
  { nombre: "Bonavista", tipo: "barrio" },
  { nombre: "Boscos de Tarragona", tipo: "barrio" },
  { nombre: "Cala Romana", tipo: "barrio" },
  { nombre: "Campclar", tipo: "barrio" },
  { nombre: "Campus Catalunya (URV)", tipo: "barrio" },
  { nombre: "Campus Sescelades (URV)", tipo: "barrio" },
  { nombre: "Colls Majors", tipo: "barrio" },
  { nombre: "Coves del Llorito", tipo: "barrio" },
  { nombre: "Eixample", tipo: "barrio" },
  { nombre: "El Miracle", tipo: "barrio" },
  { nombre: "El Pilar", tipo: "barrio" },
  { nombre: "El Pinatell", tipo: "barrio" },
  { nombre: "El Rodolat del Moro", tipo: "barrio" },
  { nombre: "El Serrallo", tipo: "barrio" },
  { nombre: "Els Cocons", tipo: "barrio" },
  { nombre: "Els Gavarres", tipo: "barrio" },
  { nombre: "Els Montgons", tipo: "barrio" },
  { nombre: "Els Quatre Garrofers", tipo: "barrio" },
  { nombre: "Entrepins", tipo: "barrio" },
  { nombre: "Escipió", tipo: "barrio" },
  { nombre: "Ferran", tipo: "barrio" },
  { nombre: "Gran Indústria", tipo: "barrio" },
  { nombre: "Hospital Universitari Joan XXIII", tipo: "barrio" },
  { nombre: "Icomar", tipo: "barrio" },
  { nombre: "La Floresta", tipo: "barrio" },
  { nombre: "La Granja", tipo: "barrio" },
  { nombre: "La Mora", tipo: "barrio" },
  { nombre: "La Savinosa", tipo: "barrio" },
  { nombre: "La Vileta de Mar", tipo: "barrio" },
  { nombre: "Les Moreres", tipo: "barrio" },
  { nombre: "Les Pinedes", tipo: "barrio" },
  { nombre: "Mas Corsini", tipo: "barrio" },
  { nombre: "Mas d'en Pastor", tipo: "barrio" },
  { nombre: "Mas del Frare", tipo: "barrio" },
  { nombre: "Mas del Moro", tipo: "barrio" },
  { nombre: "Monnars", tipo: "barrio" },
  { nombre: "Nou Eixample Nord", tipo: "barrio" },
  { nombre: "Parc Central", tipo: "barrio" },
  { nombre: "Parc Riuclar", tipo: "barrio" },
  { nombre: "Parc Tecnològic i Universitari (PPU-59)", tipo: "barrio" },
  { nombre: "Part Alta", tipo: "barrio" },
  { nombre: "Pedrol", tipo: "barrio" },
  { nombre: "Riu Clar", tipo: "barrio" },
  { nombre: "Sant Marc", tipo: "barrio" },
  { nombre: "Sant Pere i Sant Pau", tipo: "barrio" },
  { nombre: "Sant Ramon", tipo: "barrio" },
  { nombre: "Sant Salvador", tipo: "barrio" },
  { nombre: "Santa Isabel", tipo: "barrio" },
  { nombre: "Solimar", tipo: "barrio" },
  { nombre: "Tamarit", tipo: "barrio" },
  { nombre: "Torreforta", tipo: "barrio" },
  { nombre: "Zona Portuària", tipo: "barrio" },
];

const POLIGONOS_TARRAGONA: ZonaCiudad[] = [
  { nombre: "Campsa", tipo: "poligono" },
  { nombre: "Entrevies", tipo: "poligono" },
  { nombre: "Francolí", tipo: "poligono" },
  { nombre: "Les Gavarres", tipo: "poligono" },
  { nombre: "Polígono Francolí", tipo: "poligono" },
  { nombre: "Polígono Industrial Entrevies", tipo: "poligono" },
  { nombre: "Polígono Industrial Riu Clar", tipo: "poligono" },
  { nombre: "Polígono PPU-9", tipo: "poligono" },
  { nombre: "Polígono PPU-10", tipo: "poligono" },
  { nombre: "Polígono PPU-13", tipo: "poligono" },
  { nombre: "Polígono PPU-38 (ampliación Riu Clar)", tipo: "poligono" },
  { nombre: "Polígono PPU-54 (CIM El Camp)", tipo: "poligono" },
];

const BARRIOS_REUS: ZonaCiudad[] = [
  { nombre: "Aigüesverds", tipo: "barrio" },
  { nombre: "Artiga", tipo: "barrio" },
  { nombre: "Barri Gaudí", tipo: "barrio" },
  { nombre: "Barri Fortuny", tipo: "barrio" },
  { nombre: "Barri Juroca", tipo: "barrio" },
  { nombre: "Barri Montserrat", tipo: "barrio" },
  { nombre: "Barri Sant Josep Obrer", tipo: "barrio" },
  { nombre: "Barri de la Immaculada", tipo: "barrio" },
  { nombre: "Barri de la Misericòrdia", tipo: "barrio" },
  { nombre: "Barri Niloga", tipo: "barrio" },
  { nombre: "Barri Sol i Vista", tipo: "barrio" },
  { nombre: "Bellisens", tipo: "barrio" },
  { nombre: "Gaudimar", tipo: "barrio" },
  { nombre: "Juncosa", tipo: "barrio" },
  { nombre: "La Carpa", tipo: "barrio" },
  { nombre: "Les Palmeres", tipo: "barrio" },
  { nombre: "Mas Abelló", tipo: "barrio" },
  { nombre: "Mas Carpa", tipo: "barrio" },
  { nombre: "Mas d'Iglésies", tipo: "barrio" },
  { nombre: "Mas Ferrer", tipo: "barrio" },
  { nombre: "Mas Iglesias", tipo: "barrio" },
  { nombre: "Mas Pellicer", tipo: "barrio" },
  { nombre: "Mas Pallisser", tipo: "barrio" },
  { nombre: "Mas Vilanova", tipo: "barrio" },
  { nombre: "Masó", tipo: "barrio" },
  { nombre: "Mercader", tipo: "barrio" },
  { nombre: "Moixí", tipo: "barrio" },
  { nombre: "Parcel·les Casas", tipo: "barrio" },
  { nombre: "Parc Tecnoparc", tipo: "barrio" },
  { nombre: "Passatge de la Misericòrdia", tipo: "barrio" },
  { nombre: "Pelai", tipo: "barrio" },
  { nombre: "Pi", tipo: "barrio" },
  { nombre: "Pinar, el", tipo: "barrio" },
  { nombre: "Quintana", tipo: "barrio" },
  { nombre: "Residencial Blancafort", tipo: "barrio" },
  { nombre: "Reus Centre", tipo: "barrio" },
  { nombre: "Sant Joan", tipo: "barrio" },
  { nombre: "Solivista", tipo: "barrio" },
];

const POLIGONOS_REUS: ZonaCiudad[] = [
  { nombre: "Agro-Reus", tipo: "poligono" },
  { nombre: "Bescós", tipo: "poligono" },
  { nombre: "CIMALSA – CIM del Camp", tipo: "poligono" },
  { nombre: "Dyna", tipo: "poligono" },
  { nombre: "La Roureda", tipo: "poligono" },
  { nombre: "Mas Batlle", tipo: "poligono" },
  { nombre: "Mas de les Ànimes", tipo: "poligono" },
  { nombre: "Mas Sunyer", tipo: "poligono" },
  { nombre: "Nirsa", tipo: "poligono" },
  { nombre: "Polígono de la Carretera de Montblanc", tipo: "poligono" },
  { nombre: "Vegé", tipo: "poligono" },
];

const BARRIOS_EL_VENDRELL: ZonaCiudad[] = [
  { nombre: "Aciomar – Cintoi", tipo: "barrio" },
  { nombre: "Baronia del Mar", tipo: "barrio" },
  { nombre: "Barri de França", tipo: "barrio" },
  { nombre: "Bell-lloc", tipo: "barrio" },
  { nombre: "Bonavista", tipo: "barrio" },
  { nombre: "Brisamar", tipo: "barrio" },
  { nombre: "Cal Salines", tipo: "barrio" },
  { nombre: "Coma-ruga", tipo: "barrio" },
  { nombre: "Coma-ruga Parc", tipo: "barrio" },
  { nombre: "Creu de Coma-ruga", tipo: "barrio" },
  { nombre: "Creu del Vendrell", tipo: "barrio" },
  { nombre: "Edèn Parc", tipo: "barrio" },
  { nombre: "El Francàs", tipo: "barrio" },
  { nombre: "El Nou Vendrell", tipo: "barrio" },
  { nombre: "El Oasis", tipo: "barrio" },
  { nombre: "El Romaní", tipo: "barrio" },
  { nombre: "El Sanatori", tipo: "barrio" },
  { nombre: "Els Garrofers", tipo: "barrio" },
  { nombre: "Els Masos", tipo: "barrio" },
  { nombre: "Estació de Sant Vicenç", tipo: "barrio" },
  { nombre: "La Franquesa", tipo: "barrio" },
  { nombre: "La Llança", tipo: "barrio" },
  { nombre: "La Plana de Bonavista", tipo: "barrio" },
  { nombre: "La Platja del Francàs", tipo: "barrio" },
  { nombre: "Mas Astor", tipo: "barrio" },
  { nombre: "Mas Borràs", tipo: "barrio" },
  { nombre: "Mas d'en Gual", tipo: "barrio" },
  { nombre: "Masia Blanca", tipo: "barrio" },
  { nombre: "Mas Leví", tipo: "barrio" },
  { nombre: "Nirvana", tipo: "barrio" },
  { nombre: "Oasis – Eden Parc", tipo: "barrio" },
  { nombre: "Parc Empresarial Els Masets", tipo: "barrio" },
  { nombre: "Pic i Martí", tipo: "barrio" },
  { nombre: "Requesens", tipo: "barrio" },
  { nombre: "Sant Jordi", tipo: "barrio" },
  { nombre: "Sant Salvador", tipo: "barrio" },
  { nombre: "Sant Vicenç de Calders", tipo: "barrio" },
  { nombre: "Socies Català", tipo: "barrio" },
  { nombre: "Tancat", tipo: "barrio" },
  { nombre: "Torreblanca", tipo: "barrio" },
  { nombre: "Vendrell (Centre)", tipo: "barrio" },
  { nombre: "Vendrellmar", tipo: "barrio" },
  { nombre: "Vives", tipo: "barrio" },
  { nombre: "Xalet Blanco", tipo: "barrio" },
];

const POLIGONOS_EL_VENDRELL: ZonaCiudad[] = [
  { nombre: "La Cometa I", tipo: "poligono" },
  { nombre: "La Muntanyeta", tipo: "poligono" },
  { nombre: "Riera de Banyeres", tipo: "poligono" },
  { nombre: "Casa Larrienaga", tipo: "poligono" },
  { nombre: "Edèn Parc Nord", tipo: "poligono" },
  { nombre: "Els Masets", tipo: "poligono" },
  { nombre: "Les Mates", tipo: "poligono" },
];

const BARRIOS_CAMBRILS: ZonaCiudad[] = [
  { nombre: "Ardiaca", tipo: "barrio" },
  { nombre: "Barri Marítim", tipo: "barrio" },
  { nombre: "Cambrils", tipo: "barrio" },
  { nombre: "Cambrils Badia", tipo: "barrio" },
  { nombre: "Cambrils Mediterrània", tipo: "barrio" },
  { nombre: "Cambrils Platja", tipo: "barrio" },
  { nombre: "Cambrils Port", tipo: "barrio" },
  { nombre: "Cambrils Nord", tipo: "barrio" },
  { nombre: "Cavet", tipo: "barrio" },
  { nombre: "El Mas d'en Bosc", tipo: "barrio" },
  { nombre: "El Prat d'en Forés", tipo: "barrio" },
  { nombre: "Eixample de la Platja", tipo: "barrio" },
  { nombre: "Eixample de la Vila", tipo: "barrio" },
  { nombre: "Els Antígons", tipo: "barrio" },
  { nombre: "Els Tallats", tipo: "barrio" },
  { nombre: "Estrella de Cambrils", tipo: "barrio" },
  { nombre: "Golf de Sant Jordi", tipo: "barrio" },
  { nombre: "Horta de Santa Maria", tipo: "barrio" },
  { nombre: "Jardins de Vilafortuny", tipo: "barrio" },
  { nombre: "La Cava", tipo: "barrio" },
  { nombre: "La Dorada", tipo: "barrio" },
  { nombre: "La Llosa", tipo: "barrio" },
  { nombre: "L'Albereda", tipo: "barrio" },
  { nombre: "L'Ardiaca Nord", tipo: "barrio" },
  { nombre: "L'Hort del Cuchillo", tipo: "barrio" },
  { nombre: "Mar de Cambrils", tipo: "barrio" },
  { nombre: "Nou Cambrils", tipo: "barrio" },
  { nombre: "Parc de Samà", tipo: "barrio" },
  { nombre: "Parellada", tipo: "barrio" },
  { nombre: "Platja de Vilafortuny", tipo: "barrio" },
  { nombre: "Platges del Sud", tipo: "barrio" },
  { nombre: "Proacosa", tipo: "barrio" },
  { nombre: "Sol de Cambrils", tipo: "barrio" },
  { nombre: "Tàrraco", tipo: "barrio" },
  { nombre: "Urcavisa", tipo: "barrio" },
  { nombre: "Verge del Carme", tipo: "barrio" },
  { nombre: "Vilafortuny", tipo: "barrio" },
  { nombre: "Vilafortuny II", tipo: "barrio" },
];

const POLIGONOS_CAMBRILS: ZonaCiudad[] = [
  { nombre: "Belianes Nord", tipo: "poligono" },
  { nombre: "Belianes Sud", tipo: "poligono" },
  { nombre: "Belianes Est", tipo: "poligono" },
  { nombre: "Les Comes", tipo: "poligono" },
];

const BARRIOS_TORTOSA: ZonaCiudad[] = [
  { nombre: "Centre (Centro)", tipo: "barrio" },
  { nombre: "Eixample", tipo: "barrio" },
  { nombre: "El Temple", tipo: "barrio" },
  { nombre: "Ferreries", tipo: "barrio" },
  { nombre: "Grup del Temple", tipo: "barrio" },
  { nombre: "La Simpàtica", tipo: "barrio" },
  { nombre: "Mare de Déu de la Roca", tipo: "barrio" },
  { nombre: "Nucli Antic (Casco Antiguo)", tipo: "barrio" },
  { nombre: "Quatre Camins", tipo: "barrio" },
  { nombre: "Remolins", tipo: "barrio" },
  { nombre: "Rastre", tipo: "barrio" },
  { nombre: "Sant Josep de la Muntanya", tipo: "barrio" },
  { nombre: "Sant Llàtzer", tipo: "barrio" },
  { nombre: "Santa Clara", tipo: "barrio" },
  { nombre: "California", tipo: "barrio" },
  { nombre: "Els Molins del Comte", tipo: "barrio" },
  { nombre: "La Petja", tipo: "barrio" },
  { nombre: "Mig Camí", tipo: "barrio" },
  { nombre: "Pimpí", tipo: "barrio" },
  { nombre: "Sant Bernabé", tipo: "barrio" },
  { nombre: "Torre Gassia", tipo: "barrio" },
  { nombre: "Voraparc", tipo: "barrio" },
];

const POLIGONOS_TORTOSA: ZonaCiudad[] = [
  { nombre: "Polígono Industrial Baix Ebre", tipo: "poligono" },
  { nombre: "Polígono Industrial Catalunya Sud", tipo: "poligono" },
  { nombre: "Polígono Industrial Els Portals", tipo: "poligono" },
  { nombre: "Polígono Industrial Ferreries", tipo: "poligono" },
  { nombre: "Polígono Industrial Pla de l'Estació", tipo: "poligono" },
];

const BARRIOS_CALAFELL: ZonaCiudad[] = [
  { nombre: "Calafell Poble (casco antiguo)", tipo: "barrio" },
  { nombre: "Calafell Platja", tipo: "barrio" },
  { nombre: "Calafell Residencial", tipo: "barrio" },
  { nombre: "El Prat de Calafell", tipo: "barrio" },
  { nombre: "El Vilarenc", tipo: "barrio" },
  { nombre: "La Sínia", tipo: "barrio" },
  { nombre: "El Sindicat", tipo: "barrio" },
  { nombre: "Solà-Forcada", tipo: "barrio" },
  { nombre: "Masia de la Font", tipo: "barrio" },
  { nombre: "Miramar Residencial", tipo: "barrio" },
  { nombre: "Vilamar", tipo: "barrio" },
  { nombre: "Segur de Calafell – zona playa", tipo: "barrio" },
  { nombre: "Segur de Dalt", tipo: "barrio" },
  { nombre: "Segur de Calafell – zona montaña", tipo: "barrio" },
  { nombre: "Alorda Park", tipo: "barrio" },
  { nombre: "Bellamar", tipo: "barrio" },
  { nombre: "Bellamel", tipo: "barrio" },
  { nombre: "Bonanova", tipo: "barrio" },
  { nombre: "Calafell Parc", tipo: "barrio" },
  { nombre: "El Mas Mel", tipo: "barrio" },
  { nombre: "El Mas Romeu", tipo: "barrio" },
  { nombre: "L'Estany", tipo: "barrio" },
  { nombre: "La Baronia del Mar", tipo: "barrio" },
  { nombre: "Les Brises", tipo: "barrio" },
  { nombre: "Les Vil·les", tipo: "barrio" },
  { nombre: "Mas de la Mel", tipo: "barrio" },
  { nombre: "Parc Empresarial", tipo: "barrio" },
  { nombre: "Romaní", tipo: "barrio" },
  { nombre: "Valldemar", tipo: "barrio" },
];

const POLIGONOS_CALAFELL: ZonaCiudad[] = [
  { nombre: "Parc Empresarial de Calafell", tipo: "poligono" },
  { nombre: "Polígono Industrial de la Sínia", tipo: "poligono" },
  { nombre: "Zona industrial de la carretera de Bellvei", tipo: "poligono" },
];

const BARRIOS_SALOU: ZonaCiudad[] = [
  { nombre: "Barenys", tipo: "barrio" },
  { nombre: "Barri de la Salut", tipo: "barrio" },
  { nombre: "Capellans", tipo: "barrio" },
  { nombre: "Centre (Centro)", tipo: "barrio" },
  { nombre: "Carles Buïgas", tipo: "barrio" },
  { nombre: "Eixample Turístic – Primer Eixample", tipo: "barrio" },
  { nombre: "Eixample Turístic – Segon Eixample", tipo: "barrio" },
  { nombre: "Els Pilons", tipo: "barrio" },
  { nombre: "Emprius", tipo: "barrio" },
  { nombre: "Nucli Antic (casco antiguo)", tipo: "barrio" },
  { nombre: "Ponent", tipo: "barrio" },
  { nombre: "Llevant", tipo: "barrio" },
  { nombre: "Terrer", tipo: "barrio" },
  { nombre: "Zona Esportiva i Rural", tipo: "barrio" },
  { nombre: "Bosc Gran", tipo: "barrio" },
  { nombre: "Cap de Salou", tipo: "barrio" },
  { nombre: "Colina del Sol", tipo: "barrio" },
  { nombre: "Covamar", tipo: "barrio" },
  { nombre: "Dunamar", tipo: "barrio" },
  { nombre: "Els Bergants", tipo: "barrio" },
  { nombre: "Mirador de Salou", tipo: "barrio" },
  { nombre: "Nostra Senyora de Núria", tipo: "barrio" },
  { nombre: "Pinomar", tipo: "barrio" },
  { nombre: "Port Pirata", tipo: "barrio" },
  { nombre: "Taufana", tipo: "barrio" },
  { nombre: "Vil·lings", tipo: "barrio" },
  { nombre: "Xalets de Salou", tipo: "barrio" },
  { nombre: "Xalets dels Prats", tipo: "barrio" },
  { nombre: "Zona Estival", tipo: "barrio" },
  { nombre: "Zona Estival Baviera", tipo: "barrio" },
  { nombre: "Zona Estival Alta", tipo: "barrio" },
  { nombre: "Centre Recreatiu Turístic (CRT)", tipo: "barrio" },
  { nombre: "Complex Turístic Integrat (CTI)", tipo: "barrio" },
];

const POLIGONOS_SALOU: ZonaCiudad[] = [];

const BARRIOS_VILA_SECA: ZonaCiudad[] = [
  { nombre: "El Colomí", tipo: "barrio" },
  { nombre: "La Formiga", tipo: "barrio" },
  { nombre: "La Plana", tipo: "barrio" },
  { nombre: "La Pineda", tipo: "barrio" },
  { nombre: "Miramar", tipo: "barrio" },
  { nombre: "Nucli Antic (casco antiguo)", tipo: "barrio" },
];

const POLIGONOS_VILA_SECA: ZonaCiudad[] = [
  { nombre: "Creu de la Beguda", tipo: "poligono" },
  { nombre: "Gran Indústria I", tipo: "poligono" },
  { nombre: "Gran Indústria II", tipo: "poligono" },
  { nombre: "L'Alba (Parque Tecnológico y de Servicios)", tipo: "poligono" },
  { nombre: "L'Estació", tipo: "poligono" },
  { nombre: "Polígono Químico Sur", tipo: "poligono" },
  { nombre: "Zona industrial de la avenida de Ramon d'Olzina", tipo: "poligono" },
];

const BARRIOS_LLEIDA: ZonaCiudad[] = [
  { nombre: "Balàfia", tipo: "barrio" },
  { nombre: "Barri de Noguerola", tipo: "barrio" },
  { nombre: "Barri del Clot", tipo: "barrio" },
  { nombre: "Barri dels Instituts", tipo: "barrio" },
  { nombre: "Barri dels Templers", tipo: "barrio" },
  { nombre: "Barri del Secà de Sant Pere", tipo: "barrio" },
  { nombre: "Blocs Joan Carles", tipo: "barrio" },
  { nombre: "Bordeta", tipo: "barrio" },
  { nombre: "Butsènit", tipo: "barrio" },
  { nombre: "Camp d'Esports", tipo: "barrio" },
  { nombre: "Cappont", tipo: "barrio" },
  { nombre: "Centre Històric", tipo: "barrio" },
  { nombre: "Ciutat Jardí", tipo: "barrio" },
  { nombre: "Horta de Lleida", tipo: "barrio" },
  { nombre: "Joc de la Bola", tipo: "barrio" },
  { nombre: "La Mariola", tipo: "barrio" },
  { nombre: "La Sardera Alta", tipo: "barrio" },
  { nombre: "La Sardera Baixa", tipo: "barrio" },
  { nombre: "Llívia", tipo: "barrio" },
  { nombre: "Mangraners", tipo: "barrio" },
  { nombre: "Pardinyes", tipo: "barrio" },
  { nombre: "Pius XII - Germanor", tipo: "barrio" },
  { nombre: "Raimat", tipo: "barrio" },
  { nombre: "Rambla de Ferran - Estació", tipo: "barrio" },
  { nombre: "Sucs", tipo: "barrio" },
  { nombre: "Suquets", tipo: "barrio" },
  { nombre: "Turó de Gardeny", tipo: "barrio" },
  { nombre: "Universitat", tipo: "barrio" },
  { nombre: "Zona Alta - Ricard Viñes", tipo: "barrio" },
  { nombre: "Zona de Fleming", tipo: "barrio" },
];

const POLIGONOS_LLEIDA: ZonaCiudad[] = [
  { nombre: "Activa Park", tipo: "poligono" },
  { nombre: "CIM Lleida", tipo: "poligono" },
  { nombre: "Parc Agrobiotech Lleida", tipo: "poligono" },
  { nombre: "Polígono Industrial Camí dels Frares", tipo: "poligono" },
  { nombre: "Polígono Industrial El Segre", tipo: "poligono" },
  { nombre: "Polígono Industrial Torre Solé", tipo: "poligono" },
  { nombre: "Polígono Industrial Vilanoveta", tipo: "poligono" },
  { nombre: "Polígono Industrial de Gardeny", tipo: "poligono" },
  { nombre: "Zona Industrial de la N-240", tipo: "poligono" },
];

const BARRIOS_GIRONA: ZonaCiudad[] = [
  { nombre: "Barri Vell", tipo: "barrio" },
  { nombre: "Campdorà", tipo: "barrio" },
  { nombre: "Can Gibert del Pla", tipo: "barrio" },
  { nombre: "Carme – Vista Alegre", tipo: "barrio" },
  { nombre: "Devesa-Güell", tipo: "barrio" },
  { nombre: "Domeny – Taialà", tipo: "barrio" },
  { nombre: "Eixample", tipo: "barrio" },
  { nombre: "Est", tipo: "barrio" },
  { nombre: "Figuerola – Bonastruc", tipo: "barrio" },
  { nombre: "Font de la Pólvora", tipo: "barrio" },
  { nombre: "Fontajau", tipo: "barrio" },
  { nombre: "Germans Sàbat", tipo: "barrio" },
  { nombre: "Grup Sant Daniel", tipo: "barrio" },
  { nombre: "Mas Catofa", tipo: "barrio" },
  { nombre: "Mas Ramada", tipo: "barrio" },
  { nombre: "Mercadal", tipo: "barrio" },
  { nombre: "Montilivi – La Creueta", tipo: "barrio" },
  { nombre: "Montjuïc", tipo: "barrio" },
  { nombre: "Palau – Avellaneda – Mas Xirgu", tipo: "barrio" },
  { nombre: "Pedreres – Fora Muralla", tipo: "barrio" },
  { nombre: "Pedret", tipo: "barrio" },
  { nombre: "Pla de Palau – Sant Pau", tipo: "barrio" },
  { nombre: "Pont Major", tipo: "barrio" },
  { nombre: "Pujada de la Torrassa", tipo: "barrio" },
  { nombre: "Sant Daniel", tipo: "barrio" },
  { nombre: "Sant Narcís", tipo: "barrio" },
  { nombre: "Sant Ponç", tipo: "barrio" },
  { nombre: "Santa Eugènia", tipo: "barrio" },
  { nombre: "Torre de Taialà", tipo: "barrio" },
  { nombre: "Torre Gironella", tipo: "barrio" },
  { nombre: "Vila-roja", tipo: "barrio" },
];

const POLIGONOS_GIRONA: ZonaCiudad[] = [
  { nombre: "Avellaneda", tipo: "poligono" },
  { nombre: "Carretera de Sant Feliu", tipo: "poligono" },
  { nombre: "Mas Xirgu", tipo: "poligono" },
  { nombre: "Pla d'Abastaments", tipo: "poligono" },
  { nombre: "Torroella-Nestlé", tipo: "poligono" },
];

const BARRIOS_LLORET: ZonaCiudad[] = [
  { nombre: "Alegries", tipo: "barrio" },
  { nombre: "Barri dels Pescadors", tipo: "barrio" },
  { nombre: "Barri de la Riera", tipo: "barrio" },
  { nombre: "Bloch", tipo: "barrio" },
  { nombre: "Can Ballell", tipo: "barrio" },
  { nombre: "Can Carbó", tipo: "barrio" },
  { nombre: "Can Coll d'Horta", tipo: "barrio" },
  { nombre: "Can Ribalaigua", tipo: "barrio" },
  { nombre: "Can Sabata", tipo: "barrio" },
  { nombre: "Condado del Jaruco", tipo: "barrio" },
  { nombre: "Els Llorers", tipo: "barrio" },
  { nombre: "Els Pinars", tipo: "barrio" },
  { nombre: "Fenals", tipo: "barrio" },
  { nombre: "Font Bandina", tipo: "barrio" },
  { nombre: "Font de Sant Llorenç", tipo: "barrio" },
  { nombre: "La Creu de Lloret", tipo: "barrio" },
  { nombre: "La Montgoda", tipo: "barrio" },
  { nombre: "La Riviera", tipo: "barrio" },
  { nombre: "La Soleia", tipo: "barrio" },
  { nombre: "Lloret Blau", tipo: "barrio" },
  { nombre: "Lloret de Dalt", tipo: "barrio" },
  { nombre: "Lloret Residencial", tipo: "barrio" },
  { nombre: "Lloret Verd", tipo: "barrio" },
  { nombre: "Mas Baell", tipo: "barrio" },
  { nombre: "Mas Arboç – Sant Quirze", tipo: "barrio" },
  { nombre: "Mas Romeu Residencial", tipo: "barrio" },
  { nombre: "Mas Vilà", tipo: "barrio" },
  { nombre: "El Molí", tipo: "barrio" },
  { nombre: "Montlloret", tipo: "barrio" },
  { nombre: "Monterrey", tipo: "barrio" },
  { nombre: "Normax", tipo: "barrio" },
  { nombre: "Nucli Antic", tipo: "barrio" },
  { nombre: "Papalús", tipo: "barrio" },
  { nombre: "Puig d'en Pla", tipo: "barrio" },
  { nombre: "Puigventós", tipo: "barrio" },
  { nombre: "Roca Grossa", tipo: "barrio" },
  { nombre: "Santa Clotilde", tipo: "barrio" },
  { nombre: "Santa Cristina", tipo: "barrio" },
  { nombre: "Serra Brava", tipo: "barrio" },
  { nombre: "Sepulcre Romà", tipo: "barrio" },
  { nombre: "Sol i Terra", tipo: "barrio" },
  { nombre: "Solterra", tipo: "barrio" },
  { nombre: "Suro Gros", tipo: "barrio" },
  { nombre: "Turó de Lloret", tipo: "barrio" },
  { nombre: "UCSA", tipo: "barrio" },
  { nombre: "Urcasa", tipo: "barrio" },
  { nombre: "Vinya Rosa", tipo: "barrio" },
];

const POLIGONOS_LLORET: ZonaCiudad[] = [
  {
    nombre: "Zona Industrial de Lloret de Mar (carretera de Vidreres)",
    tipo: "poligono",
  },
  { nombre: "Polígono Industrial Sector 3 B-13", tipo: "poligono" },
  { nombre: "Zona Industrial Nau B2, Sector Q", tipo: "poligono" },
];

const BARRIOS_AVILA: ZonaCiudad[] = [
  { nombre: "Academia", tipo: "barrio" },
  { nombre: "Arrabal del Puente", tipo: "barrio" },
  { nombre: "Centro", tipo: "barrio" },
  { nombre: "Ciudad Deportiva", tipo: "barrio" },
  { nombre: "Dehesa del Pinar", tipo: "barrio" },
  { nombre: "El Rastro", tipo: "barrio" },
  { nombre: "Extramuros", tipo: "barrio" },
  { nombre: "La Cacharra", tipo: "barrio" },
  { nombre: "La Encarnación", tipo: "barrio" },
  { nombre: "La Toledana", tipo: "barrio" },
  { nombre: "Las Vacas", tipo: "barrio" },
  { nombre: "Recinto Amurallado", tipo: "barrio" },
  { nombre: "San Antonio", tipo: "barrio" },
  { nombre: "San Nicolás", tipo: "barrio" },
  { nombre: "Santiago", tipo: "barrio" },
  { nombre: "Santo Tomás – Universidad", tipo: "barrio" },
  { nombre: "Tiro de Pichón", tipo: "barrio" },
  { nombre: "Valle Amblés", tipo: "barrio" },
  { nombre: "Zurra", tipo: "barrio" },
  { nombre: "Cordel de las Moruchas", tipo: "barrio" },
  { nombre: "Fuentes Claras", tipo: "barrio" },
  { nombre: "Hervencias Residencial", tipo: "barrio" },
  { nombre: "Hervencias Altas", tipo: "barrio" },
  { nombre: "La Viña", tipo: "barrio" },
  { nombre: "Las Alondras", tipo: "barrio" },
  { nombre: "Las Moruchas", tipo: "barrio" },
  { nombre: "Pinar de las Hervencias", tipo: "barrio" },
  { nombre: "Residencial La Alondra", tipo: "barrio" },
];

const POLIGONOS_AVILA: ZonaCiudad[] = [
  { nombre: "Las Hervencias", tipo: "poligono" },
  { nombre: "Parque Empresarial Pinar de las Hervencias", tipo: "poligono" },
  { nombre: "Vicolozano", tipo: "poligono" },
  { nombre: "Vicolozano II", tipo: "poligono" },
  { nombre: "Vicolozano III-A", tipo: "poligono" },
  { nombre: "Centro Logístico CyLoG", tipo: "poligono" },
];

const BARRIOS_SALAMANCA: ZonaCiudad[] = [
  { nombre: "Alamedilla", tipo: "barrio" },
  { nombre: "Alambres – San Buenaventura", tipo: "barrio" },
  { nombre: "Arrabal", tipo: "barrio" },
  { nombre: "Barrio Blanco", tipo: "barrio" },
  { nombre: "Buenos Aires", tipo: "barrio" },
  { nombre: "Capuchinos", tipo: "barrio" },
  { nombre: "Carmelitas Oeste (Barrio del Oeste)", tipo: "barrio" },
  { nombre: "El Carmen", tipo: "barrio" },
  { nombre: "Centro", tipo: "barrio" },
  { nombre: "Chamberí", tipo: "barrio" },
  { nombre: "Chinchibarra", tipo: "barrio" },
  { nombre: "Delicias", tipo: "barrio" },
  { nombre: "Estación", tipo: "barrio" },
  { nombre: "Fontana", tipo: "barrio" },
  { nombre: "Garrido Norte", tipo: "barrio" },
  { nombre: "Garrido Sur", tipo: "barrio" },
  { nombre: "Glorieta – Ciudad Jardín", tipo: "barrio" },
  { nombre: "Hospital", tipo: "barrio" },
  { nombre: "Labradores", tipo: "barrio" },
  { nombre: "La Platina", tipo: "barrio" },
  { nombre: "La Vega", tipo: "barrio" },
  { nombre: "Montalvo", tipo: "barrio" },
  { nombre: "Pizarrales", tipo: "barrio" },
  { nombre: "Prosperidad", tipo: "barrio" },
  { nombre: "Puente Ladrillo", tipo: "barrio" },
  { nombre: "Rollo", tipo: "barrio" },
  { nombre: "Salesas", tipo: "barrio" },
  { nombre: "San Bernardo", tipo: "barrio" },
  { nombre: "San Cristóbal – Claras", tipo: "barrio" },
  { nombre: "San Esteban", tipo: "barrio" },
  { nombre: "San Isidro", tipo: "barrio" },
  { nombre: "San José", tipo: "barrio" },
  { nombre: "San Juan", tipo: "barrio" },
  { nombre: "San Vicente", tipo: "barrio" },
  { nombre: "Sancti-Spíritus", tipo: "barrio" },
  { nombre: "Santo Tomás", tipo: "barrio" },
  { nombre: "Tejares", tipo: "barrio" },
  { nombre: "Tenerías", tipo: "barrio" },
  { nombre: "Teso de la Feria", tipo: "barrio" },
  { nombre: "Tormes", tipo: "barrio" },
  { nombre: "Universidad", tipo: "barrio" },
  { nombre: "Úrsulas – San Marcos", tipo: "barrio" },
  { nombre: "Vidal", tipo: "barrio" },
  { nombre: "Vistahermosa", tipo: "barrio" },
  { nombre: "Zurguén", tipo: "barrio" },
  { nombre: "Huerta Otea", tipo: "barrio" },
  { nombre: "Campus Miguel de Unamuno", tipo: "barrio" },
  { nombre: "Finca de Vista Hermosa", tipo: "barrio" },
  { nombre: "Aldehuela de los Guzmanes", tipo: "barrio" },
  { nombre: "Salas Pombo", tipo: "barrio" },
];

const POLIGONOS_SALAMANCA: ZonaCiudad[] = [
  { nombre: "El Montalvo I", tipo: "poligono" },
  { nombre: "El Montalvo II", tipo: "poligono" },
  { nombre: "El Montalvo III", tipo: "poligono" },
  { nombre: "La Serna", tipo: "poligono" },
  { nombre: "Mercasalamanca – ZALDESA", tipo: "poligono" },
  { nombre: "Puerto Seco de Salamanca – ZALDESA", tipo: "poligono" },
];

const BARRIOS_MADRID: ZonaCiudad[] = [
  { nombre: "Palacio", tipo: "barrio" },
  { nombre: "Embajadores", tipo: "barrio" },
  { nombre: "Cortes", tipo: "barrio" },
  { nombre: "Justicia", tipo: "barrio" },
  { nombre: "Universidad", tipo: "barrio" },
  { nombre: "Sol", tipo: "barrio" },
  { nombre: "Imperial", tipo: "barrio" },
  { nombre: "Acacias", tipo: "barrio" },
  { nombre: "Chopera", tipo: "barrio" },
  { nombre: "Legazpi", tipo: "barrio" },
  { nombre: "Delicias", tipo: "barrio" },
  { nombre: "Palos de la Frontera", tipo: "barrio" },
  { nombre: "Atocha", tipo: "barrio" },
  { nombre: "Pacífico", tipo: "barrio" },
  { nombre: "Adelfas", tipo: "barrio" },
  { nombre: "Estrella", tipo: "barrio" },
  { nombre: "Ibiza", tipo: "barrio" },
  { nombre: "Los Jerónimos", tipo: "barrio" },
  { nombre: "Niño Jesús", tipo: "barrio" },
  { nombre: "Recoletos", tipo: "barrio" },
  { nombre: "Goya", tipo: "barrio" },
  { nombre: "Fuente del Berro", tipo: "barrio" },
  { nombre: "Guindalera", tipo: "barrio" },
  { nombre: "Lista", tipo: "barrio" },
  { nombre: "Castellana", tipo: "barrio" },
  { nombre: "El Viso", tipo: "barrio" },
  { nombre: "Prosperidad", tipo: "barrio" },
  { nombre: "Ciudad Jardín", tipo: "barrio" },
  { nombre: "Hispanoamérica", tipo: "barrio" },
  { nombre: "Nueva España", tipo: "barrio" },
  { nombre: "Castilla", tipo: "barrio" },
  { nombre: "Bellas Vistas", tipo: "barrio" },
  { nombre: "Cuatro Caminos", tipo: "barrio" },
  { nombre: "Castillejos", tipo: "barrio" },
  { nombre: "Almenara", tipo: "barrio" },
  { nombre: "Valdeacederas", tipo: "barrio" },
  { nombre: "Berruguete", tipo: "barrio" },
  { nombre: "Gaztambide", tipo: "barrio" },
  { nombre: "Arapiles", tipo: "barrio" },
  { nombre: "Trafalgar", tipo: "barrio" },
  { nombre: "Almagro", tipo: "barrio" },
  { nombre: "Ríos Rosas", tipo: "barrio" },
  { nombre: "Vallehermoso", tipo: "barrio" },
  { nombre: "El Pardo", tipo: "barrio" },
  { nombre: "Fuentelarreina", tipo: "barrio" },
  { nombre: "Peñagrande", tipo: "barrio" },
  { nombre: "Pilar", tipo: "barrio" },
  { nombre: "La Paz", tipo: "barrio" },
  { nombre: "Valverde", tipo: "barrio" },
  { nombre: "Mirasierra", tipo: "barrio" },
  { nombre: "El Goloso", tipo: "barrio" },
  { nombre: "Casa de Campo", tipo: "barrio" },
  { nombre: "Argüelles", tipo: "barrio" },
  { nombre: "Ciudad Universitaria", tipo: "barrio" },
  { nombre: "Valdezarza", tipo: "barrio" },
  { nombre: "Valdemarín", tipo: "barrio" },
  { nombre: "El Plantío", tipo: "barrio" },
  { nombre: "Aravaca", tipo: "barrio" },
  { nombre: "Los Cármenes", tipo: "barrio" },
  { nombre: "Puerta del Ángel", tipo: "barrio" },
  { nombre: "Lucero", tipo: "barrio" },
  { nombre: "Aluche", tipo: "barrio" },
  { nombre: "Campamento", tipo: "barrio" },
  { nombre: "Cuatro Vientos", tipo: "barrio" },
  { nombre: "Águilas", tipo: "barrio" },
  { nombre: "Comillas", tipo: "barrio" },
  { nombre: "Opañel", tipo: "barrio" },
  { nombre: "San Isidro", tipo: "barrio" },
  { nombre: "Vista Alegre", tipo: "barrio" },
  { nombre: "Puerta Bonita", tipo: "barrio" },
  { nombre: "Buenavista", tipo: "barrio" },
  { nombre: "Abrantes", tipo: "barrio" },
  { nombre: "Orcasitas", tipo: "barrio" },
  { nombre: "Orcasur", tipo: "barrio" },
  { nombre: "San Fermín", tipo: "barrio" },
  { nombre: "Almendrales", tipo: "barrio" },
  { nombre: "Moscardó", tipo: "barrio" },
  { nombre: "Zofío", tipo: "barrio" },
  { nombre: "Pradolongo", tipo: "barrio" },
  { nombre: "Entrevías", tipo: "barrio" },
  { nombre: "San Diego", tipo: "barrio" },
  { nombre: "Palomeras Bajas", tipo: "barrio" },
  { nombre: "Palomeras Sureste", tipo: "barrio" },
  { nombre: "Portazgo", tipo: "barrio" },
  { nombre: "Numancia", tipo: "barrio" },
  { nombre: "Pavones", tipo: "barrio" },
  { nombre: "Horcajo", tipo: "barrio" },
  { nombre: "Marroquina", tipo: "barrio" },
  { nombre: "Media Legua", tipo: "barrio" },
  { nombre: "Fontarrón", tipo: "barrio" },
  { nombre: "Vinateros", tipo: "barrio" },
  { nombre: "Ventas", tipo: "barrio" },
  { nombre: "Pueblo Nuevo", tipo: "barrio" },
  { nombre: "Quintana", tipo: "barrio" },
  { nombre: "La Concepción", tipo: "barrio" },
  { nombre: "San Pascual", tipo: "barrio" },
  { nombre: "San Juan Bautista", tipo: "barrio" },
  { nombre: "Colina", tipo: "barrio" },
  { nombre: "Atalaya", tipo: "barrio" },
  { nombre: "Costillares", tipo: "barrio" },
  { nombre: "Palomas", tipo: "barrio" },
  { nombre: "Piovera", tipo: "barrio" },
  { nombre: "Canillas", tipo: "barrio" },
  { nombre: "Pinar del Rey", tipo: "barrio" },
  { nombre: "Apóstol Santiago", tipo: "barrio" },
  { nombre: "Valdefuentes", tipo: "barrio" },
  { nombre: "Villaverde Alto – Casco Histórico de Villaverde", tipo: "barrio" },
  { nombre: "San Cristóbal", tipo: "barrio" },
  { nombre: "Butarque", tipo: "barrio" },
  { nombre: "Los Rosales", tipo: "barrio" },
  { nombre: "Ángeles", tipo: "barrio" },
  { nombre: "Casco Histórico de Vallecas", tipo: "barrio" },
  { nombre: "Santa Eugenia", tipo: "barrio" },
  { nombre: "Ensanche de Vallecas", tipo: "barrio" },
  { nombre: "Casco Histórico de Vicálvaro", tipo: "barrio" },
  { nombre: "Valdebernardo", tipo: "barrio" },
  { nombre: "Valderrivas", tipo: "barrio" },
  { nombre: "El Cañaveral", tipo: "barrio" },
  { nombre: "Simancas", tipo: "barrio" },
  { nombre: "Hellín", tipo: "barrio" },
  { nombre: "Amposta", tipo: "barrio" },
  { nombre: "Arcos", tipo: "barrio" },
  { nombre: "Rosas", tipo: "barrio" },
  { nombre: "Rejas", tipo: "barrio" },
  { nombre: "Canillejas", tipo: "barrio" },
  { nombre: "El Salvador", tipo: "barrio" },
  { nombre: "Alameda de Osuna", tipo: "barrio" },
  { nombre: "Aeropuerto", tipo: "barrio" },
  { nombre: "Casco Histórico de Barajas", tipo: "barrio" },
  { nombre: "Timón", tipo: "barrio" },
  { nombre: "Corralejos", tipo: "barrio" },
];

const POLIGONOS_MADRID: ZonaCiudad[] = [
  { nombre: "General Lacy", tipo: "poligono" },
  { nombre: "Paseo Imperial", tipo: "poligono" },
  { nombre: "Pontones – Imperial – Alejandro Dumas", tipo: "poligono" },
  { nombre: "Méndez Álvaro", tipo: "poligono" },
  { nombre: "Ronda de Atocha", tipo: "poligono" },
  { nombre: "Méndez Álvaro – Planetario", tipo: "poligono" },
  { nombre: "Pajaritos", tipo: "poligono" },
  { nombre: "Luis Mitjans", tipo: "poligono" },
  { nombre: "Monteagudo", tipo: "poligono" },
  { nombre: "Vizconde de Matamala", tipo: "poligono" },
  { nombre: "Marqués de Mondéjar", tipo: "poligono" },
  { nombre: "Costa Rica", tipo: "poligono" },
  { nombre: "López de Hoyos", tipo: "poligono" },
  { nombre: "Calle Lérida", tipo: "poligono" },
  { nombre: "Cardenal Herrera Oria", tipo: "poligono" },
  { nombre: "Carretera de Burgos", tipo: "poligono" },
  { nombre: "Cerro de las Cuevas", tipo: "poligono" },
  { nombre: "Los Vascos", tipo: "poligono" },
  { nombre: "Avenida de la Aviación", tipo: "poligono" },
  { nombre: "General Ricardos", tipo: "poligono" },
  { nombre: "Aguacate", tipo: "poligono" },
  { nombre: "Tamames – Aguacate", tipo: "poligono" },
  { nombre: "Avenida de Córdoba", tipo: "poligono" },
  { nombre: "Antonio López", tipo: "poligono" },
  { nombre: "Carretera de San Martín", tipo: "poligono" },
  { nombre: "Las Carolinas", tipo: "poligono" },
  { nombre: "De Torros", tipo: "poligono" },
  { nombre: "Antonio López 109", tipo: "poligono" },
  { nombre: "Calle Expropiación", tipo: "poligono" },
  { nombre: "Camino de Valderribas", tipo: "poligono" },
  { nombre: "Polígono Industrial Norte de la Avenida de la Albufera", tipo: "poligono" },
  { nombre: "San Toribio", tipo: "poligono" },
  { nombre: "Avenida de América", tipo: "poligono" },
  { nombre: "Juan Pérez Zúñiga", tipo: "poligono" },
  { nombre: "Casco de Canillas", tipo: "poligono" },
  { nombre: "Ulises", tipo: "poligono" },
  { nombre: "Polígono Industrial de Manoteras", tipo: "poligono" },
  { nombre: "Vía Borde de Hortaleza", tipo: "poligono" },
  { nombre: "Zona Industrial de Sanchinarro", tipo: "poligono" },
  { nombre: "El Águila", tipo: "poligono" },
  { nombre: "Talbot", tipo: "poligono" },
  { nombre: "Hierros Madrid – Renault", tipo: "poligono" },
  { nombre: "Boetticher", tipo: "poligono" },
  { nombre: "San Erasmo", tipo: "poligono" },
  { nombre: "Camino de Getafe", tipo: "poligono" },
  { nombre: "Ifasa", tipo: "poligono" },
  { nombre: "Polígono Industrial de Villaverde", tipo: "poligono" },
  { nombre: "Aristrain – Estándar Alcatel", tipo: "poligono" },
  { nombre: "Calle Euskalduna", tipo: "poligono" },
  { nombre: "Parque de Automoción", tipo: "poligono" },
  { nombre: "Lenguas Este", tipo: "poligono" },
  { nombre: "Paseo de Ferroviarios", tipo: "poligono" },
  { nombre: "El Salobral", tipo: "poligono" },
  { nombre: "La Resina", tipo: "poligono" },
  { nombre: "Los Llanos", tipo: "poligono" },
  { nombre: "Polígono Industrial El Gato", tipo: "poligono" },
  { nombre: "Los Aguados", tipo: "poligono" },
  { nombre: "Vereda del Salobral", tipo: "poligono" },
  { nombre: "Ateinsa", tipo: "poligono" },
  { nombre: "Zona de Butarque", tipo: "poligono" },
  { nombre: "Polígono Industrial de Vallecas", tipo: "poligono" },
  { nombre: "Calle Luis I", tipo: "poligono" },
  { nombre: "Santa Luisa", tipo: "poligono" },
  { nombre: "Zona Industrial del Ensanche de Vallecas", tipo: "poligono" },
  { nombre: "La Atalayuela", tipo: "poligono" },
  { nombre: "Valdecarros", tipo: "poligono" },
  { nombre: "Polígono Industrial de Vicálvaro", tipo: "poligono" },
  { nombre: "Finca Valdecarante", tipo: "poligono" },
  { nombre: "La Marsala", tipo: "poligono" },
  { nombre: "Cerro Almodóvar Sur", tipo: "poligono" },
  { nombre: "La Dehesa", tipo: "poligono" },
  { nombre: "La Cuqueña", tipo: "poligono" },
  { nombre: "Zona Industrial La Catalana", tipo: "poligono" },
  { nombre: "Zona Industrial del Cañaveral", tipo: "poligono" },
  { nombre: "Zona Industrial de Los Ahijones", tipo: "poligono" },
  { nombre: "Zona Industrial de Los Berrocales", tipo: "poligono" },
  { nombre: "Julián Camarillo", tipo: "poligono" },
  { nombre: "Julián Camarillo Norte", tipo: "poligono" },
  { nombre: "Polígono de Las Mercedes", tipo: "poligono" },
  { nombre: "Enasa", tipo: "poligono" },
  { nombre: "Emilio Muñoz", tipo: "poligono" },
  { nombre: "Avenida de Aragón – Albasanz", tipo: "poligono" },
  { nombre: "Quinta de los Molinos Industrial", tipo: "poligono" },
  { nombre: "Josefa Valcárcel", tipo: "poligono" },
  { nombre: "Colonia Fin de Semana", tipo: "poligono" },
  { nombre: "Reserva Ferroviaria Fin de Semana", tipo: "poligono" },
  { nombre: "Colonia Aeropuerto", tipo: "poligono" },
  { nombre: "Zona Industrial de Iberia", tipo: "poligono" },
  { nombre: "Alameda de Osuna – N-II", tipo: "poligono" },
  { nombre: "Sector III – Olivar de la Hinojosa", tipo: "poligono" },
  { nombre: "Medina de Pomar", tipo: "poligono" },
  { nombre: "Ensanche de Barajas", tipo: "poligono" },
];

const BARRIOS_MOSTOLES: ZonaCiudad[] = [
  { nombre: "Azorín", tipo: "barrio" },
  { nombre: "Casco Antiguo", tipo: "barrio" },
  { nombre: "Cerro Prieto", tipo: "barrio" },
  { nombre: "El Recreo", tipo: "barrio" },
  { nombre: "El Soto", tipo: "barrio" },
  { nombre: "Estoril I", tipo: "barrio" },
  { nombre: "Estoril II", tipo: "barrio" },
  { nombre: "La Carcavilla", tipo: "barrio" },
  { nombre: "La Loma", tipo: "barrio" },
  { nombre: "La Luna", tipo: "barrio" },
  { nombre: "La Princesa", tipo: "barrio" },
  { nombre: "Las Nieves", tipo: "barrio" },
  { nombre: "Los Rosales", tipo: "barrio" },
  { nombre: "Parque Vosa", tipo: "barrio" },
  { nombre: "Pinar de Móstoles", tipo: "barrio" },
  { nombre: "Pinares Llanos", tipo: "barrio" },
  { nombre: "San Fernando", tipo: "barrio" },
  { nombre: "Sotoverde", tipo: "barrio" },
  { nombre: "Villaeuropa", tipo: "barrio" },
  { nombre: "Villafontana", tipo: "barrio" },
  { nombre: "Móstoles Sur (PAU-4)", tipo: "barrio" },
  { nombre: "Parque Coimbra", tipo: "barrio" },
  { nombre: "Colonia del Guadarrama", tipo: "barrio" },
];

const POLIGONOS_MOSTOLES: ZonaCiudad[] = [
  { nombre: "Polígono Industrial Arroyomolinos", tipo: "poligono" },
  { nombre: "Polígono Industrial La Fuensanta", tipo: "poligono" },
  { nombre: "Polígono Industrial La Fuensanta II", tipo: "poligono" },
  { nombre: "Polígono Industrial Regordoño", tipo: "poligono" },
  { nombre: "Polígono Industrial Los Rosales", tipo: "poligono" },
  { nombre: "Polígono Industrial Las Nieves", tipo: "poligono" },
  { nombre: "Polígono Industrial Expansión", tipo: "poligono" },
  { nombre: "Polígono Industrial nº 1", tipo: "poligono" },
  { nombre: "Móstoles Industrial", tipo: "poligono" },
  { nombre: "Zona Industrial Las Pajarillas", tipo: "poligono" },
  { nombre: "Zona Industrial Las Monjas", tipo: "poligono" },
];

const BARRIOS_ALCALA: ZonaCiudad[] = [
  { nombre: "Casco Histórico o Centro", tipo: "barrio" },
  { nombre: "El Chorrillo", tipo: "barrio" },
  { nombre: "Campo del Ángel", tipo: "barrio" },
  { nombre: "La Garena", tipo: "barrio" },
  { nombre: "La Rinconada", tipo: "barrio" },
  { nombre: "Reyes Católicos", tipo: "barrio" },
  { nombre: "Nueva Alcalá", tipo: "barrio" },
  { nombre: "Venecia", tipo: "barrio" },
  { nombre: "San Isidro", tipo: "barrio" },
  { nombre: "Juan de Austria", tipo: "barrio" },
  { nombre: "El Val", tipo: "barrio" },
  { nombre: "Virgen del Val", tipo: "barrio" },
  { nombre: "El Juncal", tipo: "barrio" },
  { nombre: "El Ensanche", tipo: "barrio" },
  { nombre: "Espartales Norte", tipo: "barrio" },
  { nombre: "Espartales Sur", tipo: "barrio" },
  { nombre: "Ciudad del Aire", tipo: "barrio" },
  { nombre: "El Pilar", tipo: "barrio" },
  { nombre: "La Ciudadela", tipo: "barrio" },
  { nombre: "Lope de Vega", tipo: "barrio" },
  { nombre: "Ronda Fiscal", tipo: "barrio" },
  { nombre: "El Olivar", tipo: "barrio" },
  { nombre: "Las Sedas", tipo: "barrio" },
  { nombre: "Universidad", tipo: "barrio" },
  { nombre: "Jardín de Alcalá", tipo: "barrio" },
  { nombre: "Los Gorriones", tipo: "barrio" },
  { nombre: "Urbanización El Pilar", tipo: "barrio" },
];

const POLIGONOS_ALCALA: ZonaCiudad[] = [
  { nombre: "Polígono Industrial Camporroso", tipo: "poligono" },
  { nombre: "Polígono Industrial Bañuelos", tipo: "poligono" },
  { nombre: "Polígono Industrial La Garena", tipo: "poligono" },
  { nombre: "Polígono Industrial El Chorrillo", tipo: "poligono" },
  { nombre: "Polígono Industrial El Nilo", tipo: "poligono" },
  { nombre: "Polígono Industrial La Esgaravita", tipo: "poligono" },
  { nombre: "Polígono Industrial El Encín", tipo: "poligono" },
  { nombre: "Polígono Industrial El Descubrimiento", tipo: "poligono" },
  { nombre: "Polígono Industrial Azkue", tipo: "poligono" },
  { nombre: "Polígono Industrial Santa Rosa", tipo: "poligono" },
  { nombre: "Polígono Industrial Camarmilla", tipo: "poligono" },
  { nombre: "Polígono Industrial Europa", tipo: "poligono" },
  { nombre: "Polígono Industrial Puerta de Alcalá", tipo: "poligono" },
  { nombre: "Polígono Industrial Vía Complutense", tipo: "poligono" },
  { nombre: "Polígono Industrial Camino del Cementerio", tipo: "poligono" },
  { nombre: "Polígono Industrial Antigua Carretera de Ajalvir", tipo: "poligono" },
  { nombre: "Polígono Industrial Casarrubios", tipo: "poligono" },
  { nombre: "Polígono Industrial de Pesados", tipo: "poligono" },
  { nombre: "Polígono Industrial Galiana", tipo: "poligono" },
  { nombre: "Polígono Industrial INBISA I", tipo: "poligono" },
  { nombre: "Polígono Industrial INBISA II", tipo: "poligono" },
  { nombre: "Área Industrial Reyes Católicos", tipo: "poligono" },
  { nombre: "Área Industrial La Garena", tipo: "poligono" },
];

const BARRIOS_LEGANES: ZonaCiudad[] = [
  { nombre: "Arroyo Culebro", tipo: "barrio" },
  { nombre: "Batallas", tipo: "barrio" },
  { nombre: "Campo de Tiro", tipo: "barrio" },
  { nombre: "El Carrascal", tipo: "barrio" },
  { nombre: "Centro o Casco Antiguo", tipo: "barrio" },
  { nombre: "Conquistadores", tipo: "barrio" },
  { nombre: "Derechos Humanos", tipo: "barrio" },
  { nombre: "Descubridores", tipo: "barrio" },
  { nombre: "Escritores", tipo: "barrio" },
  { nombre: "Vereda de los Estudiantes", tipo: "barrio" },
  { nombre: "Las Flores", tipo: "barrio" },
  { nombre: "La Fortuna", tipo: "barrio" },
  { nombre: "Leganés Norte", tipo: "barrio" },
  { nombre: "Los Frailes", tipo: "barrio" },
  { nombre: "Los Santos", tipo: "barrio" },
  { nombre: "Poza del Agua", tipo: "barrio" },
  { nombre: "Quinto Centenario", tipo: "barrio" },
  { nombre: "San Nicasio", tipo: "barrio" },
  { nombre: "Valdepelayo", tipo: "barrio" },
  { nombre: "Vírgenes", tipo: "barrio" },
  { nombre: "Zarzaquemada Norte", tipo: "barrio" },
  { nombre: "Zarzaquemada Sur", tipo: "barrio" },
  { nombre: "Solagua", tipo: "barrio" },
];

const POLIGONOS_LEGANES: ZonaCiudad[] = [
  { nombre: "El Portillo – Ciudad del Automóvil", tipo: "poligono" },
  { nombre: "La Laguna", tipo: "poligono" },
  { nombre: "Leganés Tecnológico (LEGATEC)", tipo: "poligono" },
  { nombre: "Nuestra Señora de Butarque", tipo: "poligono" },
  { nombre: "Polvoranca", tipo: "poligono" },
  { nombre: "Polvoranca-Estación (antigua zona de Tabacalera)", tipo: "poligono" },
  { nombre: "Prado Overa", tipo: "poligono" },
  { nombre: "San José de Valderas", tipo: "poligono" },
  { nombre: "Sur-M50 (PP10-Neinor)", tipo: "poligono" },
  { nombre: "Puerta de Carabanchel", tipo: "poligono" },
];

const BARRIOS_GETAFE: ZonaCiudad[] = [
  { nombre: "Buenavista", tipo: "barrio" },
  { nombre: "Centro", tipo: "barrio" },
  { nombre: "El Bercial", tipo: "barrio" },
  { nombre: "Getafe Norte", tipo: "barrio" },
  { nombre: "Juan de la Cierva", tipo: "barrio" },
  { nombre: "La Alhóndiga", tipo: "barrio" },
  { nombre: "Las Margaritas", tipo: "barrio" },
  { nombre: "Los Molinos", tipo: "barrio" },
  { nombre: "Perales del Río", tipo: "barrio" },
  { nombre: "San Isidro", tipo: "barrio" },
  { nombre: "Sector III", tipo: "barrio" },
  { nombre: "Arroyo Culebro", tipo: "barrio" },
  { nombre: "El Casar", tipo: "barrio" },
  { nombre: "El Rosón", tipo: "barrio" },
  { nombre: "Kelvinator", tipo: "barrio" },
];

const POLIGONOS_GETAFE: ZonaCiudad[] = [
  { nombre: "Área Empresarial Andalucía", tipo: "poligono" },
  { nombre: "Centro Logístico de Abastecimiento (CLA)", tipo: "poligono" },
  { nombre: "Parque Empresarial La Carpetania I", tipo: "poligono" },
  { nombre: "Parque Empresarial La Carpetania II", tipo: "poligono" },
  { nombre: "Polígono Industrial El Lomo", tipo: "poligono" },
  { nombre: "Polígono Industrial El Culebro", tipo: "poligono" },
  { nombre: "Polígono Industrial Los Ángeles", tipo: "poligono" },
  { nombre: "Polígono Industrial Los Gavilanes", tipo: "poligono" },
  { nombre: "Polígono Industrial Los Olivos", tipo: "poligono" },
  { nombre: "Polígono Industrial San Marcos", tipo: "poligono" },
  { nombre: "TecnoGetafe (Área Tecnológica del Sur)", tipo: "poligono" },
];

const BARRIOS_FUENLABRADA: ZonaCiudad[] = [
  { nombre: "Avanzada", tipo: "barrio" },
  { nombre: "Arroyo-La Fuente", tipo: "barrio" },
  { nombre: "Casco Antiguo o Centro", tipo: "barrio" },
  { nombre: "Cerro-El Molino", tipo: "barrio" },
  { nombre: "El Naranjo", tipo: "barrio" },
  { nombre: "El Vivero", tipo: "barrio" },
  { nombre: "La Cueva", tipo: "barrio" },
  { nombre: "La Serna", tipo: "barrio" },
  { nombre: "Loranca", tipo: "barrio" },
  { nombre: "Nuevo Versalles", tipo: "barrio" },
  { nombre: "Parque Europa", tipo: "barrio" },
  { nombre: "Parque de Miraflores", tipo: "barrio" },
  { nombre: "San Gregorio", tipo: "barrio" },
  { nombre: "Universidad-Hospital", tipo: "barrio" },
  { nombre: "La Fuente", tipo: "barrio" },
  { nombre: "Belén", tipo: "barrio" },
  { nombre: "Castilla la Vieja", tipo: "barrio" },
  { nombre: "El Camino", tipo: "barrio" },
  { nombre: "Polvoranca", tipo: "barrio" },
  { nombre: "Fuenlabrada II", tipo: "barrio" },
  { nombre: "Universidad", tipo: "barrio" },
  { nombre: "La Pollina", tipo: "barrio" },
  { nombre: "El Arroyo", tipo: "barrio" },
  { nombre: "La Avanzada", tipo: "barrio" },
];

const POLIGONOS_FUENLABRADA: ZonaCiudad[] = [
  { nombre: "Acedinos", tipo: "poligono" },
  { nombre: "Cantueña", tipo: "poligono" },
  { nombre: "Cobo Calleja", tipo: "poligono" },
  { nombre: "El Palomo", tipo: "poligono" },
  { nombre: "La Vega II", tipo: "poligono" },
  { nombre: "Los Gallegos", tipo: "poligono" },
  { nombre: "Pico de la Mira", tipo: "poligono" },
  { nombre: "Pozoblanco", tipo: "poligono" },
  { nombre: "Sevilla", tipo: "poligono" },
  { nombre: "Sierra Elvira", tipo: "poligono" },
  { nombre: "Sonsoles", tipo: "poligono" },
  { nombre: "Vereda del Tempranar", tipo: "poligono" },
  { nombre: "Calfersa", tipo: "poligono" },
  { nombre: "Cordel de la Carrera", tipo: "poligono" },
  { nombre: "Niño del Remedio", tipo: "poligono" },
  { nombre: "La Piqueta", tipo: "poligono" },
  { nombre: "Uranga", tipo: "poligono" },
  { nombre: "La Laguna", tipo: "poligono" },
  { nombre: "Campo Hermoso", tipo: "poligono" },
  { nombre: "Carretera de Humanes Este", tipo: "poligono" },
  { nombre: "La Estación", tipo: "poligono" },
  { nombre: "Codein", tipo: "poligono" },
  { nombre: "Berruguete", tipo: "poligono" },
  { nombre: "Circunvalación Sur", tipo: "poligono" },
  { nombre: "Carretera de Humanes", tipo: "poligono" },
  { nombre: "El Álamo I", tipo: "poligono" },
  { nombre: "El Álamo II", tipo: "poligono" },
  { nombre: "Constitución Norte", tipo: "poligono" },
  { nombre: "Constitución Sur", tipo: "poligono" },
  { nombre: "La Albarreja", tipo: "poligono" },
  { nombre: "Cuesta Olivilla", tipo: "poligono" },
  { nombre: "La Vega I", tipo: "poligono" },
  { nombre: "Moraleja", tipo: "poligono" },
  { nombre: "Valdonaire", tipo: "poligono" },
  { nombre: "Carretera de Humanes Norte", tipo: "poligono" },
  { nombre: "Vereda de Bañuelos", tipo: "poligono" },
  { nombre: "La Toca I", tipo: "poligono" },
  { nombre: "La Toca II", tipo: "poligono" },
  { nombre: "Codein Cruce", tipo: "poligono" },
  { nombre: "Cruce I", tipo: "poligono" },
  { nombre: "Cruce II", tipo: "poligono" },
];

const BARRIOS_ALCORCON: ZonaCiudad[] = [
  { nombre: "Campodón", tipo: "barrio" },
  { nombre: "Casco Antiguo", tipo: "barrio" },
  { nombre: "Ensanche Sur", tipo: "barrio" },
  { nombre: "Fuente Cisneros", tipo: "barrio" },
  { nombre: "Fuente del Palomar", tipo: "barrio" },
  { nombre: "Hogar 68", tipo: "barrio" },
  { nombre: "Igueldo", tipo: "barrio" },
  { nombre: "La Rivota", tipo: "barrio" },
  { nombre: "Las Torres", tipo: "barrio" },
  { nombre: "Los Castillos", tipo: "barrio" },
  { nombre: "Montepríncipe", tipo: "barrio" },
  { nombre: "Ondarreta", tipo: "barrio" },
  { nombre: "Parque El Lucero", tipo: "barrio" },
  { nombre: "Parque Lisboa", tipo: "barrio" },
  { nombre: "Parque Mayor", tipo: "barrio" },
  { nombre: "Parque Oeste", tipo: "barrio" },
  { nombre: "Parque Ondarreta", tipo: "barrio" },
  { nombre: "Prado de Santo Domingo", tipo: "barrio" },
  { nombre: "San José de Valderas", tipo: "barrio" },
  { nombre: "Santo Domingo", tipo: "barrio" },
  { nombre: "Torres Bellas", tipo: "barrio" },
];

const POLIGONOS_ALCORCON: ZonaCiudad[] = [
  { nombre: "Industrias Especiales", tipo: "poligono" },
  { nombre: "Urtinsa I", tipo: "poligono" },
  { nombre: "Urtinsa II", tipo: "poligono" },
  { nombre: "Ventorro del Cano", tipo: "poligono" },
];

const BARRIOS_TORREJON: ZonaCiudad[] = [
  { nombre: "Aldovea", tipo: "barrio" },
  { nombre: "Barrio del Castillo", tipo: "barrio" },
  { nombre: "Barrio del Rosario", tipo: "barrio" },
  { nombre: "Barrio San Benito", tipo: "barrio" },
  { nombre: "Barrio Verde", tipo: "barrio" },
  { nombre: "Cañada", tipo: "barrio" },
  { nombre: "Casco Antiguo o Centro", tipo: "barrio" },
  { nombre: "Ciudad Jardín del Rosario", tipo: "barrio" },
  { nombre: "Coivisa", tipo: "barrio" },
  { nombre: "El Juncal", tipo: "barrio" },
  { nombre: "El Saucar", tipo: "barrio" },
  { nombre: "Fresnos", tipo: "barrio" },
  { nombre: "Jardines de la Solana", tipo: "barrio" },
  { nombre: "La Mancha Amarilla", tipo: "barrio" },
  { nombre: "La Zarzuela", tipo: "barrio" },
  { nombre: "Las Fronteras", tipo: "barrio" },
  { nombre: "Las Veredillas", tipo: "barrio" },
  { nombre: "Los Berrocales del Jarama", tipo: "barrio" },
  { nombre: "Los Villares", tipo: "barrio" },
  { nombre: "Mancha Amarilla", tipo: "barrio" },
  { nombre: "Parque Cataluña", tipo: "barrio" },
  { nombre: "Parque Europa", tipo: "barrio" },
  { nombre: "Parque Granada", tipo: "barrio" },
  { nombre: "Parque Murguía", tipo: "barrio" },
  { nombre: "Parque Orbasa", tipo: "barrio" },
  { nombre: "Parque Florencia", tipo: "barrio" },
  { nombre: "Rosaleda-Prado Ardoz", tipo: "barrio" },
  { nombre: "San José", tipo: "barrio" },
  { nombre: "Santiago Apóstol", tipo: "barrio" },
  { nombre: "Soto del Henares", tipo: "barrio" },
  { nombre: "Soto Norte", tipo: "barrio" },
  { nombre: "Torrenieve", tipo: "barrio" },
  { nombre: "Torrepista", tipo: "barrio" },
  { nombre: "Torrejón 2000", tipo: "barrio" },
  { nombre: "Torreparque", tipo: "barrio" },
  { nombre: "Valrey", tipo: "barrio" },
  { nombre: "Veredillas", tipo: "barrio" },
  { nombre: "Barrio de la Estación", tipo: "barrio" },
  { nombre: "Barrio de los Cobos", tipo: "barrio" },
  { nombre: "Quinta de la Solana", tipo: "barrio" },
];

const POLIGONOS_TORREJON: ZonaCiudad[] = [
  { nombre: "Casablanca", tipo: "poligono" },
  { nombre: "Ctra. de Loeches", tipo: "poligono" },
  { nombre: "El Jardín", tipo: "poligono" },
  { nombre: "El Preceptor", tipo: "poligono" },
  { nombre: "El Rosal", tipo: "poligono" },
  { nombre: "El Xiabre", tipo: "poligono" },
  { nombre: "La Galeana", tipo: "poligono" },
  { nombre: "La Yegua", tipo: "poligono" },
  { nombre: "Las Monjas", tipo: "poligono" },
  { nombre: "Los Almendros", tipo: "poligono" },
  { nombre: "Los Girasoles", tipo: "poligono" },
  { nombre: "Parque Empresarial San Fernando", tipo: "poligono" },
  { nombre: "Parque Industrial El Charco de los Peces", tipo: "poligono" },
  { nombre: "San Fernando Norte", tipo: "poligono" },
  { nombre: "San Fernando Sur", tipo: "poligono" },
  { nombre: "Polígono Industrial El Rosario", tipo: "poligono" },
  { nombre: "Polígono Industrial Las Polvaredas", tipo: "poligono" },
];

const BARRIOS_TORRELODONES: ZonaCiudad[] = [
  { nombre: "Casco Urbano (Pueblo)", tipo: "barrio" },
  { nombre: "Colonia de la Estación", tipo: "barrio" },
  { nombre: "El Gasco", tipo: "barrio" },
  { nombre: "La Berzosilla", tipo: "barrio" },
  { nombre: "Los Bomberos", tipo: "barrio" },
  { nombre: "Los Peñascales", tipo: "barrio" },
  { nombre: "Los Prados", tipo: "barrio" },
  { nombre: "Los Robles", tipo: "barrio" },
  { nombre: "Las Marías", tipo: "barrio" },
  { nombre: "Las Rozuelas", tipo: "barrio" },
  { nombre: "Montealegre", tipo: "barrio" },
  { nombre: "La Cañada", tipo: "barrio" },
  { nombre: "Barrio Vasco", tipo: "barrio" },
];

const POLIGONOS_TORRELODONES: ZonaCiudad[] = [];

const BARRIOS_PARLA: ZonaCiudad[] = [
  { nombre: "Barrio 2001", tipo: "barrio" },
  { nombre: "Casco Viejo", tipo: "barrio" },
  { nombre: "Centro", tipo: "barrio" },
  { nombre: "El Nido", tipo: "barrio" },
  { nombre: "Fuentebella (Fuente Bella)", tipo: "barrio" },
  { nombre: "Inlasa (Parque Inlasa)", tipo: "barrio" },
  { nombre: "La Ermita", tipo: "barrio" },
  { nombre: "La Granja", tipo: "barrio" },
  { nombre: "La Laguna (Laguna Park)", tipo: "barrio" },
  { nombre: "La Fuente", tipo: "barrio" },
  { nombre: "Las Américas", tipo: "barrio" },
  { nombre: "Pryconsa", tipo: "barrio" },
  { nombre: "San Ramón", tipo: "barrio" },
  { nombre: "San Fermín", tipo: "barrio" },
  { nombre: "Villa Juventus I", tipo: "barrio" },
  { nombre: "Villa Juventus II", tipo: "barrio" },
  { nombre: "Parla Este", tipo: "barrio" },
  { nombre: "El Leguario", tipo: "barrio" },
  { nombre: "Leguario Norte", tipo: "barrio" },
  { nombre: "Leguario Sur", tipo: "barrio" },
  { nombre: "Las Estrellas", tipo: "barrio" },
  { nombre: "Los Planetas", tipo: "barrio" },
  { nombre: "Las Constelaciones", tipo: "barrio" },
  { nombre: "Parque de las Comunidades de España", tipo: "barrio" },
  { nombre: "Flor del Sur", tipo: "barrio" },
  { nombre: "El Prado", tipo: "barrio" },
  { nombre: "Las Eras", tipo: "barrio" },
  { nombre: "Las Olivas", tipo: "barrio" },
  { nombre: "El Lavadero", tipo: "barrio" },
  { nombre: "Casas Bajas", tipo: "barrio" },
];

const POLIGONOS_PARLA: ZonaCiudad[] = [
  { nombre: "Polígono Industrial Cerro del Rubal", tipo: "poligono" },
  { nombre: "Polígono Industrial Ciudad de Parla", tipo: "poligono" },
  { nombre: "Polígono Industrial García Rivera (Buenavista)", tipo: "poligono" },
  { nombre: "Polígono Industrial La Ermita", tipo: "poligono" },
  { nombre: "Polígono Industrial Los Borrachitos", tipo: "poligono" },
  { nombre: "Parque Empresarial y Tecnológico Parla Progresa (PAU-5)", tipo: "poligono" },
];

const BARRIOS_ALCOBENDAS: ZonaCiudad[] = [
  { nombre: "Casco Antiguo", tipo: "barrio" },
  { nombre: "Ensanche Este", tipo: "barrio" },
  { nombre: "Ensanche Norte", tipo: "barrio" },
  { nombre: "Ensanche Noroeste", tipo: "barrio" },
  { nombre: "Ensanche Oeste", tipo: "barrio" },
  { nombre: "Ensanche Sudoeste", tipo: "barrio" },
  { nombre: "Fuentelucha", tipo: "barrio" },
  { nombre: "La Zaporra", tipo: "barrio" },
  { nombre: "Valdelasfuentes", tipo: "barrio" },
  { nombre: "Fuente Hito", tipo: "barrio" },
  { nombre: "El Juncal", tipo: "barrio" },
  { nombre: "Arroyo de la Vega", tipo: "barrio" },
  { nombre: "La Carrascosa I", tipo: "barrio" },
  { nombre: "La Carrascosa II", tipo: "barrio" },
  { nombre: "Tupperware", tipo: "barrio" },
  { nombre: "Carretera de Fuencarral", tipo: "barrio" },
  { nombre: "La Moraleja", tipo: "barrio" },
  { nombre: "El Soto de La Moraleja", tipo: "barrio" },
  { nombre: "El Encinar de los Reyes", tipo: "barrio" },
  { nombre: "Cuesta Blanca", tipo: "barrio" },
];

const POLIGONOS_ALCOBENDAS: ZonaCiudad[] = [
  { nombre: "Polígono Industrial de Alcobendas", tipo: "poligono" },
  { nombre: "Parque Empresarial Valdelacasa", tipo: "poligono" },
  { nombre: "Parque Empresarial Casablanca I", tipo: "poligono" },
  { nombre: "Parque Empresarial Casablanca II", tipo: "poligono" },
  { nombre: "Parque Empresarial Arroyo de la Vega", tipo: "poligono" },
  { nombre: "Parque Empresarial La Moraleja", tipo: "poligono" },
  { nombre: "Parque Empresarial Omega", tipo: "poligono" },
  { nombre: "Parque Empresarial Miniparc", tipo: "poligono" },
  { nombre: "Zona empresarial El Juncal", tipo: "poligono" },
];

const BARRIOS_RIVAS: ZonaCiudad[] = [
  { nombre: "Barrio Oeste", tipo: "barrio" },
  { nombre: "Covibar", tipo: "barrio" },
  { nombre: "Pablo Iglesias", tipo: "barrio" },
  { nombre: "La Partija", tipo: "barrio" },
  { nombre: "La Luna", tipo: "barrio" },
  { nombre: "Cristo de Rivas", tipo: "barrio" },
  { nombre: "Barrio Centro", tipo: "barrio" },
  { nombre: "Santa Mónica", tipo: "barrio" },
  { nombre: "Bellavista", tipo: "barrio" },
  { nombre: "José Hierro", tipo: "barrio" },
  { nombre: "Cómic", tipo: "barrio" },
  { nombre: "Cerro de la Cabaña", tipo: "barrio" },
  { nombre: "Los Montecillos", tipo: "barrio" },
  { nombre: "Olivar de la Partija", tipo: "barrio" },
  { nombre: "Las Urbanizaciones", tipo: "barrio" },
  { nombre: "Barrio Este", tipo: "barrio" },
  { nombre: "Casco Antiguo (Rivas Pueblo)", tipo: "barrio" },
  { nombre: "Rivas Futura", tipo: "barrio" },
  { nombre: "Avenida del Levante", tipo: "barrio" },
  { nombre: "Camino Bajo de Rivas", tipo: "barrio" },
  { nombre: "Mirador Norte", tipo: "barrio" },
  { nombre: "Mirador Sur", tipo: "barrio" },
  { nombre: "Las Colinas", tipo: "barrio" },
];

const POLIGONOS_RIVAS: ZonaCiudad[] = [
  { nombre: "Polígono Industrial de Santa Ana", tipo: "poligono" },
  { nombre: "Área de Servicios Santa Ana", tipo: "poligono" },
  { nombre: "Polígono Industrial La Deseada", tipo: "poligono" },
  { nombre: "Polígono Industrial Capanegra", tipo: "poligono" },
  { nombre: "Zona Industrial Urbana (Los Areneros)", tipo: "poligono" },
  { nombre: "Zona Industrial La Estación", tipo: "poligono" },
  { nombre: "Zona Industrial El Campillo", tipo: "poligono" },
  { nombre: "Parque Empresarial Rivas Futura", tipo: "poligono" },
];

const BARRIOS_LAS_ROZAS: ZonaCiudad[] = [
  { nombre: "Alto Lazarejo", tipo: "barrio" },
  { nombre: "Alto del Abajón", tipo: "barrio" },
  { nombre: "Barrio de RENFE-Talgo", tipo: "barrio" },
  { nombre: "Bellavista", tipo: "barrio" },
  { nombre: "Buenos Aires", tipo: "barrio" },
  { nombre: "Casco Urbano", tipo: "barrio" },
  { nombre: "Club de Golf", tipo: "barrio" },
  { nombre: "Coruña XXI", tipo: "barrio" },
  { nombre: "Coto del Pardo", tipo: "barrio" },
  { nombre: "Dehesa de Navalcarbón", tipo: "barrio" },
  { nombre: "El Abajón", tipo: "barrio" },
  { nombre: "El Cantizal", tipo: "barrio" },
  { nombre: "El Encinar", tipo: "barrio" },
  { nombre: "El Encinar de Las Matas", tipo: "barrio" },
  { nombre: "El Garzo", tipo: "barrio" },
  { nombre: "El Montecillo", tipo: "barrio" },
  { nombre: "El Pedrosillo", tipo: "barrio" },
  { nombre: "El Pinar", tipo: "barrio" },
  { nombre: "El Reloj", tipo: "barrio" },
  { nombre: "El Tomillar", tipo: "barrio" },
  { nombre: "Entremontes", tipo: "barrio" },
  { nombre: "Eurógar", tipo: "barrio" },
  { nombre: "Jardines del César", tipo: "barrio" },
  { nombre: "La Chopera", tipo: "barrio" },
  { nombre: "La Cornisa-Yucatán", tipo: "barrio" },
  { nombre: "La Marazuela", tipo: "barrio" },
  { nombre: "La Marazuela Vieja", tipo: "barrio" },
  { nombre: "La Marazuela Nueva", tipo: "barrio" },
  { nombre: "La Hiedra", tipo: "barrio" },
  { nombre: "Las Matas", tipo: "barrio" },
  { nombre: "Las Palomas", tipo: "barrio" },
  { nombre: "Los Castillos", tipo: "barrio" },
  { nombre: "Los Peñascales", tipo: "barrio" },
  { nombre: "Maracaibo", tipo: "barrio" },
  { nombre: "Molino de la Hoz", tipo: "barrio" },
  { nombre: "Monte Rozas", tipo: "barrio" },
  { nombre: "Monte Verde", tipo: "barrio" },
  { nombre: "Parque Matas", tipo: "barrio" },
  { nombre: "Parque Rozas", tipo: "barrio" },
  { nombre: "Punta Galea", tipo: "barrio" },
  { nombre: "Sector IX", tipo: "barrio" },
  { nombre: "Valle del Roncal", tipo: "barrio" },
  { nombre: "Villarrozas", tipo: "barrio" },
  { nombre: "Yucatán", tipo: "barrio" },
];

const POLIGONOS_LAS_ROZAS: ZonaCiudad[] = [
  { nombre: "Polígono Industrial Európolis", tipo: "poligono" },
  { nombre: "Parque Empresarial Las Rozas", tipo: "poligono" },
  { nombre: "Europa Empresarial", tipo: "poligono" },
  { nombre: "Parque Empresarial Alvia", tipo: "poligono" },
  { nombre: "Parque Empresarial Tripark", tipo: "poligono" },
  { nombre: "Parque Empresarial de Camilo José Cela", tipo: "poligono" },
];

const BARRIOS_SS_REYES: ZonaCiudad[] = [
  { nombre: "Casco Antiguo", tipo: "barrio" },
  { nombre: "Sacramento", tipo: "barrio" },
  { nombre: "El Chaparral", tipo: "barrio" },
  { nombre: "Ensanche Este", tipo: "barrio" },
  { nombre: "Ensanche Oeste", tipo: "barrio" },
  { nombre: "Ensanche Autonomías", tipo: "barrio" },
  { nombre: "Barrio de los Arroyos", tipo: "barrio" },
  { nombre: "La Zaporra", tipo: "barrio" },
  { nombre: "El Praderón", tipo: "barrio" },
  { nombre: "Rosa Luxemburgo", tipo: "barrio" },
  { nombre: "Santa Bárbara-Baunatal", tipo: "barrio" },
  { nombre: "Dehesa Vieja", tipo: "barrio" },
  { nombre: "Dehesa Vieja Norte", tipo: "barrio" },
  { nombre: "Dehesa Vieja Sur", tipo: "barrio" },
  { nombre: "Dehesa Vieja Oeste", tipo: "barrio" },
  { nombre: "Tempranales", tipo: "barrio" },
  { nombre: "Tempranales Este", tipo: "barrio" },
  { nombre: "Tempranales Oeste", tipo: "barrio" },
  { nombre: "Tejas Verdes", tipo: "barrio" },
  { nombre: "Pilar de Abajo", tipo: "barrio" },
  { nombre: "La Marina", tipo: "barrio" },
  { nombre: "Moscatelares Residencial", tipo: "barrio" },
  { nombre: "La Granjilla", tipo: "barrio" },
  { nombre: "Fuente del Fresno", tipo: "barrio" },
  { nombre: "Fresno Norte", tipo: "barrio" },
  { nombre: "Club de Campo", tipo: "barrio" },
  { nombre: "Ciudalcampo", tipo: "barrio" },
];

const POLIGONOS_SS_REYES: ZonaCiudad[] = [
  { nombre: "Polígono Industrial Norte", tipo: "poligono" },
  { nombre: "Polígono Industrial Norte-Los Alamillos", tipo: "poligono" },
  { nombre: "Polígono Industrial Sur", tipo: "poligono" },
  { nombre: "Polígono Industrial La Hoya", tipo: "poligono" },
  { nombre: "Polígono Industrial Moscatelares", tipo: "poligono" },
  { nombre: "Zona empresarial Moscatelares Comercial", tipo: "poligono" },
  { nombre: "Zona empresarial Comercial Dehesa Vieja", tipo: "poligono" },
];

const BARRIOS_POZUELO: ZonaCiudad[] = [
  { nombre: "Casco Urbano (Pueblo)", tipo: "barrio" },
  { nombre: "Zona de la Estación", tipo: "barrio" },
  { nombre: "Avenida de Europa", tipo: "barrio" },
  { nombre: "Húmera", tipo: "barrio" },
  { nombre: "Prado de Somosaguas", tipo: "barrio" },
  { nombre: "Colonia de Los Ángeles", tipo: "barrio" },
  { nombre: "Ciudad de la Imagen", tipo: "barrio" },
  { nombre: "Somosaguas Centro", tipo: "barrio" },
  { nombre: "Somosaguas Norte", tipo: "barrio" },
  { nombre: "Somosaguas A", tipo: "barrio" },
  { nombre: "Somosaguas B", tipo: "barrio" },
  { nombre: "Somosaguas Sur", tipo: "barrio" },
  { nombre: "La Finca", tipo: "barrio" },
  { nombre: "Casablanca", tipo: "barrio" },
  { nombre: "Bularas", tipo: "barrio" },
  { nombre: "Monteclaro", tipo: "barrio" },
  { nombre: "Villas de Monteclaro", tipo: "barrio" },
  { nombre: "Montealina", tipo: "barrio" },
  { nombre: "Prado Largo", tipo: "barrio" },
  { nombre: "La Cabaña", tipo: "barrio" },
  { nombre: "Montegancedo", tipo: "barrio" },
  { nombre: "Ampliación Casa de Campo", tipo: "barrio" },
  { nombre: "Las Encinas", tipo: "barrio" },
  { nombre: "Cerro de los Gamos", tipo: "barrio" },
  { nombre: "La Alamedilla", tipo: "barrio" },
  { nombre: "Los Horcajos", tipo: "barrio" },
  { nombre: "Prado Real", tipo: "barrio" },
  { nombre: "La Solana", tipo: "barrio" },
  { nombre: "Vereda de los Pinos", tipo: "barrio" },
  { nombre: "El Montecillo (Húmera)", tipo: "barrio" },
  { nombre: "Los Miradores", tipo: "barrio" },
  { nombre: "La Huerta Grande", tipo: "barrio" },
  { nombre: "Retamares", tipo: "barrio" },
  { nombre: "Casablanca (sector residencial)", tipo: "barrio" },
];

const POLIGONOS_POZUELO: ZonaCiudad[] = [
  { nombre: "Polígono Industrial de la M-40", tipo: "poligono" },
  { nombre: "Polígono Industrial Ciudad de la Imagen", tipo: "poligono" },
  { nombre: "Parque Empresarial La Finca", tipo: "poligono" },
  { nombre: "Parque Empresarial Ática", tipo: "poligono" },
  { nombre: "Parque Empresarial Avenida de Europa", tipo: "poligono" },
  { nombre: "Parque Empresarial Cerro de los Gamos", tipo: "poligono" },
  { nombre: "Parque Empresarial Foro de Somosaguas", tipo: "poligono" },
  { nombre: "Parque Empresarial IMCE", tipo: "poligono" },
];

const BARRIOS_VALDEMORO: ZonaCiudad[] = [
  { nombre: "Benelux", tipo: "barrio" },
  { nombre: "Brezo", tipo: "barrio" },
  { nombre: "Campo Olivar", tipo: "barrio" },
  { nombre: "Canto Negro", tipo: "barrio" },
  { nombre: "El Caracol", tipo: "barrio" },
  { nombre: "Casco Antiguo", tipo: "barrio" },
  { nombre: "El Castillo", tipo: "barrio" },
  { nombre: "Cercado del Marqués", tipo: "barrio" },
  { nombre: "La Corita", tipo: "barrio" },
  { nombre: "Duque de Ahumada", tipo: "barrio" },
  { nombre: "Egido del Cristo", tipo: "barrio" },
  { nombre: "El Majuelo Norte", tipo: "barrio" },
  { nombre: "Eras de la Cruz", tipo: "barrio" },
  { nombre: "Eras del Sol", tipo: "barrio" },
  { nombre: "La Estación", tipo: "barrio" },
  { nombre: "Extremadura", tipo: "barrio" },
  { nombre: "Fuente de la Villa", tipo: "barrio" },
  { nombre: "Fuente Vieja", tipo: "barrio" },
  { nombre: "Guardia Civil", tipo: "barrio" },
  { nombre: "La Iglesia", tipo: "barrio" },
  { nombre: "El Juncarejo", tipo: "barrio" },
  { nombre: "Marquesa de Villa Antonia", tipo: "barrio" },
  { nombre: "Marte", tipo: "barrio" },
  { nombre: "Mediterráneo", tipo: "barrio" },
  { nombre: "Neptuno", tipo: "barrio" },
  { nombre: "Nuevo Valdemoro", tipo: "barrio" },
  { nombre: "Paraje Merino", tipo: "barrio" },
  { nombre: "Parque Tierno Galván", tipo: "barrio" },
  { nombre: "Paseo de la Estación", tipo: "barrio" },
  { nombre: "El Peralejo", tipo: "barrio" },
  { nombre: "La Picota", tipo: "barrio" },
  { nombre: "La Piña", tipo: "barrio" },
  { nombre: "Plaza de Castilla", tipo: "barrio" },
  { nombre: "Pozo de San Pedro", tipo: "barrio" },
  { nombre: "El Puente", tipo: "barrio" },
  { nombre: "Puerta del Moro", tipo: "barrio" },
  { nombre: "La Rambla", tipo: "barrio" },
  { nombre: "El Redondal", tipo: "barrio" },
  { nombre: "El Restón", tipo: "barrio" },
  { nombre: "Reyes Católicos", tipo: "barrio" },
  { nombre: "Río Nilo", tipo: "barrio" },
  { nombre: "San Antón", tipo: "barrio" },
  { nombre: "San Vicente de Paúl", tipo: "barrio" },
  { nombre: "Sendero del Olmo", tipo: "barrio" },
  { nombre: "El Soto", tipo: "barrio" },
  { nombre: "La Taeña", tipo: "barrio" },
  { nombre: "Tinto Enrique", tipo: "barrio" },
  { nombre: "Valle de San Sebastián", tipo: "barrio" },
  { nombre: "Los Yesares", tipo: "barrio" },
];

const POLIGONOS_VALDEMORO: ZonaCiudad[] = [
  { nombre: "Polígono Industrial Albresa", tipo: "poligono" },
  { nombre: "Polígono Industrial La Carrehuela", tipo: "poligono" },
  { nombre: "Polígono Industrial El Corte Inglés", tipo: "poligono" },
  { nombre: "Polígono Industrial La Postura", tipo: "poligono" },
  { nombre: "Polígono Industrial Las Canteras", tipo: "poligono" },
  { nombre: "Polígono Industrial El Prado (Paseo del Prado)", tipo: "poligono" },
  { nombre: "Polígono Industrial Rompecubas", tipo: "poligono" },
  { nombre: "Polígono Industrial Valmor", tipo: "poligono" },
  { nombre: "Polígono Industrial La Peluquera", tipo: "poligono" },
  { nombre: "Polígono Industrial Yesos Ibéricos", tipo: "poligono" },
];

const BARRIOS_VILLANUEVA_CANADA: ZonaCiudad[] = [
  { nombre: "Casco Urbano", tipo: "barrio" },
  { nombre: "El Valle de los Rosales", tipo: "barrio" },
  { nombre: "Guadamonte", tipo: "barrio" },
  { nombre: "La Mocha Chica", tipo: "barrio" },
  { nombre: "La Raya del Palancar", tipo: "barrio" },
  { nombre: "Villafranca del Castillo", tipo: "barrio" },
];

const POLIGONOS_VILLANUEVA_CANADA: ZonaCiudad[] = [
  { nombre: "Polígono Industrial Calle Navarra", tipo: "poligono" },
  { nombre: "Polígono Industrial Sector IV – La Pasada", tipo: "poligono" },
];

const BARRIOS_VILLAVICIOSA: ZonaCiudad[] = [
  { nombre: "Alamillo", tipo: "barrio" },
  { nombre: "Alhambra", tipo: "barrio" },
  { nombre: "Antonio Machado", tipo: "barrio" },
  { nombre: "Campodón", tipo: "barrio" },
  { nombre: "Casco Antiguo", tipo: "barrio" },
  { nombre: "Castillo", tipo: "barrio" },
  { nombre: "Castillo de Villaviciosa", tipo: "barrio" },
  { nombre: "Cerro de las Nieves", tipo: "barrio" },
  { nombre: "El Bosque", tipo: "barrio" },
  { nombre: "El Bosque Alto", tipo: "barrio" },
  { nombre: "El Bosque Bajo", tipo: "barrio" },
  { nombre: "El Cerrillo", tipo: "barrio" },
  { nombre: "El Vaillo", tipo: "barrio" },
  { nombre: "Ensanche", tipo: "barrio" },
  { nombre: "La Bruja", tipo: "barrio" },
  { nombre: "La Vega", tipo: "barrio" },
  { nombre: "Las Salinas", tipo: "barrio" },
  { nombre: "Los Montes de la Villa", tipo: "barrio" },
  { nombre: "Monreal", tipo: "barrio" },
  { nombre: "Río Guadarrama y Casa de Roque", tipo: "barrio" },
  { nombre: "Sacedón", tipo: "barrio" },
  { nombre: "Señorío de Villaviciosa", tipo: "barrio" },
  { nombre: "Tenería", tipo: "barrio" },
];

const POLIGONOS_VILLAVICIOSA: ZonaCiudad[] = [
  { nombre: "La Florida", tipo: "poligono" },
  { nombre: "Pinares Llanos", tipo: "poligono" },
  { nombre: "Quitapesares (Villapark)", tipo: "poligono" },
];

const BARRIOS_COSLADA: ZonaCiudad[] = [
  { nombre: "Casco (Coslada Pueblo)", tipo: "barrio" },
  { nombre: "Barrio del Puerto", tipo: "barrio" },
  { nombre: "Valleaguado Norte", tipo: "barrio" },
  { nombre: "Valleaguado Sur", tipo: "barrio" },
  { nombre: "La Cañada", tipo: "barrio" },
  { nombre: "Las Conejeras", tipo: "barrio" },
  { nombre: "El Esparragal", tipo: "barrio" },
  { nombre: "La Colina", tipo: "barrio" },
  { nombre: "Ciudad 70 (Ciudad San Pablo)", tipo: "barrio" },
  { nombre: "La Espinilla", tipo: "barrio" },
  { nombre: "Parque Blanco", tipo: "barrio" },
  { nombre: "Barrio de Santiago", tipo: "barrio" },
  { nombre: "Barrio de la Estación", tipo: "barrio" },
  { nombre: "Barrio del Jarama", tipo: "barrio" },
  { nombre: "Zona de La Rambla", tipo: "barrio" },
  { nombre: "Zona residencial del entorno del Hospital", tipo: "barrio" },
  { nombre: "Zona de la Estación", tipo: "barrio" },
];

const POLIGONOS_COSLADA: ZonaCiudad[] = [
  { nombre: "Polígono Industrial de Coslada", tipo: "poligono" },
  { nombre: "Polígono Industrial La Estación", tipo: "poligono" },
  { nombre: "Polígono Industrial Logística", tipo: "poligono" },
  { nombre: "Polígono Industrial Puerto Seco", tipo: "poligono" },
  { nombre: "Zona Industrial de Coslada", tipo: "poligono" },
  { nombre: "Centro de Transportes de Coslada (CTC)", tipo: "poligono" },
  { nombre: "Centro Integral de Transportes (CIT)", tipo: "poligono" },
  { nombre: "Parque Empresarial Advance", tipo: "poligono" },
  { nombre: "Polígono Escofet", tipo: "poligono" },
  { nombre: "SEGRO Park Coslada I", tipo: "poligono" },
  { nombre: "SEGRO Park Coslada III", tipo: "poligono" },
  { nombre: "Prologis Park Coslada", tipo: "poligono" },
  { nombre: "Coslada Complex", tipo: "poligono" },
  { nombre: "Centro de Empresas de Base Tecnológica", tipo: "poligono" },
  { nombre: "Centro de Excelencia Empresarial de Coslada", tipo: "poligono" },
];

const BARRIOS_MAJADAHONDA: ZonaCiudad[] = [
  { nombre: "Airesol", tipo: "barrio" },
  { nombre: "Airesol III", tipo: "barrio" },
  { nombre: "Atenea", tipo: "barrio" },
  { nombre: "Azata", tipo: "barrio" },
  { nombre: "Bahía Blanca", tipo: "barrio" },
  { nombre: "Baymar", tipo: "barrio" },
  { nombre: "Cabañas, Las", tipo: "barrio" },
  { nombre: "Camino Huerta Vieja", tipo: "barrio" },
  { nombre: "Casas Blancas", tipo: "barrio" },
  { nombre: "Casco Antiguo", tipo: "barrio" },
  { nombre: "Cerro de la Mina", tipo: "barrio" },
  { nombre: "Cerro de las Norias", tipo: "barrio" },
  { nombre: "Cerro del Aire", tipo: "barrio" },
  { nombre: "Cerro del Espino", tipo: "barrio" },
  { nombre: "Cleveles", tipo: "barrio" },
  { nombre: "Colón", tipo: "barrio" },
  { nombre: "Charaima", tipo: "barrio" },
  { nombre: "Delfines, Los", tipo: "barrio" },
  { nombre: "Delta", tipo: "barrio" },
  { nombre: "Deportivo Espino", tipo: "barrio" },
  { nombre: "El Carralero", tipo: "barrio" },
  { nombre: "El Tejar", tipo: "barrio" },
  { nombre: "Erillas, Las", tipo: "barrio" },
  { nombre: "Fuente Blanca", tipo: "barrio" },
  { nombre: "Fuente Marcela", tipo: "barrio" },
  { nombre: "Granadilla, La", tipo: "barrio" },
  { nombre: "Gran Vía", tipo: "barrio" },
  { nombre: "Granja del Conde", tipo: "barrio" },
  { nombre: "Heras, Las", tipo: "barrio" },
  { nombre: "Herradura, La", tipo: "barrio" },
  { nombre: "Horizonte", tipo: "barrio" },
  { nombre: "Hospital Puerta de Hierro", tipo: "barrio" },
  { nombre: "Huertas, Las", tipo: "barrio" },
  { nombre: "Iberduero", tipo: "barrio" },
  { nombre: "Interland", tipo: "barrio" },
  { nombre: "La Sacedilla", tipo: "barrio" },
  { nombre: "Las Mimbreras", tipo: "barrio" },
  { nombre: "Las Norias", tipo: "barrio" },
  { nombre: "Los Olmos", tipo: "barrio" },
  { nombre: "Los Porches", tipo: "barrio" },
  { nombre: "Los Robles", tipo: "barrio" },
  { nombre: "Mavi-Deli", tipo: "barrio" },
  { nombre: "Monte El Pinar", tipo: "barrio" },
  { nombre: "Monte Luxor", tipo: "barrio" },
  { nombre: "Monte del Pilar", tipo: "barrio" },
  { nombre: "Monteclaro", tipo: "barrio" },
  { nombre: "Negrillos", tipo: "barrio" },
  { nombre: "Novaserra", tipo: "barrio" },
  { nombre: "Parque Colón", tipo: "barrio" },
  { nombre: "El Paular", tipo: "barrio" },
  { nombre: "Pinar del Plantío", tipo: "barrio" },
  { nombre: "Praderas, Las", tipo: "barrio" },
  { nombre: "Puerta de Madrid", tipo: "barrio" },
  { nombre: "Puerta Sierra", tipo: "barrio" },
  { nombre: "Residencial Majadahonda", tipo: "barrio" },
  { nombre: "Valle del Arcipreste", tipo: "barrio" },
  { nombre: "Valle de la Oliva", tipo: "barrio" },
  { nombre: "Los Satélites", tipo: "barrio" },
  { nombre: "Roza Martín", tipo: "barrio" },
  { nombre: "Valles de la Mina", tipo: "barrio" },
];

const POLIGONOS_MAJADAHONDA: ZonaCiudad[] = [
  { nombre: "Paraje I+D", tipo: "poligono" },
  { nombre: "Polígono Industrial Carralero", tipo: "poligono" },
];

const BARRIOS_MEJORADA: ZonaCiudad[] = [
  { nombre: "El Balcón", tipo: "barrio" },
  { nombre: "El Olivar Grande", tipo: "barrio" },
  { nombre: "El Tallar", tipo: "barrio" },
  { nombre: "El Trébol", tipo: "barrio" },
  { nombre: "La Elleta", tipo: "barrio" },
  { nombre: "La Granja", tipo: "barrio" },
  { nombre: "La Vega", tipo: "barrio" },
  { nombre: "Las Acacias", tipo: "barrio" },
  { nombre: "Los Ángeles", tipo: "barrio" },
  { nombre: "Los Olivos", tipo: "barrio" },
  { nombre: "Valdecelada", tipo: "barrio" },
  { nombre: "Villaflores", tipo: "barrio" },
];

const POLIGONOS_MEJORADA: ZonaCiudad[] = [
  { nombre: "Acacias", tipo: "poligono" },
  { nombre: "Aragón", tipo: "poligono" },
  { nombre: "Camino Alto de Velilla", tipo: "poligono" },
  { nombre: "Inducamp", tipo: "poligono" },
  { nombre: "La Huerta", tipo: "poligono" },
  { nombre: "La Ladrillera Sur", tipo: "poligono" },
  { nombre: "La Raya de Velilla", tipo: "poligono" },
  { nombre: "Magdaleno", tipo: "poligono" },
  { nombre: "Mejorada", tipo: "poligono" },
  { nombre: "Miralrío", tipo: "poligono" },
  { nombre: "Prado Concejal", tipo: "poligono" },
];

const BARRIOS_PARACUELLOS: ZonaCiudad[] = [
  { nombre: "Altos de Jarama", tipo: "barrio" },
  { nombre: "Belvis de Jarama", tipo: "barrio" },
  { nombre: "Berrocales de Jarama", tipo: "barrio" },
  { nombre: "Casco Antiguo", tipo: "barrio" },
  { nombre: "El Avalón", tipo: "barrio" },
  { nombre: "El Picón", tipo: "barrio" },
  { nombre: "La Paleta", tipo: "barrio" },
  { nombre: "Las Cometas", tipo: "barrio" },
  { nombre: "Miramadrid", tipo: "barrio" },
  { nombre: "Poblado del INTA", tipo: "barrio" },
  { nombre: "Residencial Jarama", tipo: "barrio" },
  { nombre: "Valti", tipo: "barrio" },
];

const POLIGONOS_PARACUELLOS: ZonaCiudad[] = [
  { nombre: "El Cervellón I", tipo: "poligono" },
  { nombre: "El Cervellón II", tipo: "poligono" },
  { nombre: "El Cervellón III", tipo: "poligono" },
  { nombre: "Igarsa", tipo: "poligono" },
  { nombre: "La Granja", tipo: "poligono" },
  { nombre: "Las Huertas", tipo: "poligono" },
  { nombre: "Los Caces", tipo: "poligono" },
  { nombre: "Los Polvorines", tipo: "poligono" },
  { nombre: "La Perla", tipo: "poligono" },
];

const BARRIOS_COLLADO_VILLALBA: ZonaCiudad[] = [
  { nombre: "Altavista", tipo: "barrio" },
  { nombre: "Arroyo Arriba", tipo: "barrio" },
  { nombre: "Balconada, La", tipo: "barrio" },
  { nombre: "Batalla de Bailén", tipo: "barrio" },
  { nombre: "Cantos Altos", tipo: "barrio" },
  { nombre: "Casco Antiguo", tipo: "barrio" },
  { nombre: "Cerca, La", tipo: "barrio" },
  { nombre: "Colonia Avenida", tipo: "barrio" },
  { nombre: "Colonia Los Valles", tipo: "barrio" },
  { nombre: "Dehesa Boyal", tipo: "barrio" },
  { nombre: "El Gorronal", tipo: "barrio" },
  { nombre: "El Matadero", tipo: "barrio" },
  { nombre: "El Pilar", tipo: "barrio" },
  { nombre: "El Soto", tipo: "barrio" },
  { nombre: "Fontenebro", tipo: "barrio" },
  { nombre: "Jardines de Villalba", tipo: "barrio" },
  { nombre: "La Chopera", tipo: "barrio" },
  { nombre: "Las Eras", tipo: "barrio" },
  { nombre: "Las Suertes", tipo: "barrio" },
  { nombre: "Las Costas", tipo: "barrio" },
  { nombre: "Los Belgas", tipo: "barrio" },
  { nombre: "Los Llanos", tipo: "barrio" },
  { nombre: "Los Negrales", tipo: "barrio" },
  { nombre: "Los Valles", tipo: "barrio" },
  { nombre: "Mirador de la Sierra", tipo: "barrio" },
  { nombre: "Mirasierra", tipo: "barrio" },
  { nombre: "Montenebros I", tipo: "barrio" },
  { nombre: "Montenebros II", tipo: "barrio" },
  { nombre: "Parque de la Coruña", tipo: "barrio" },
  { nombre: "Parque Sierra", tipo: "barrio" },
  { nombre: "Peñanevada II", tipo: "barrio" },
  { nombre: "Peñanevada III", tipo: "barrio" },
  { nombre: "Peñanevada IV", tipo: "barrio" },
  { nombre: "Pradillo Herrero", tipo: "barrio" },
  { nombre: "Prado de los Enebros", tipo: "barrio" },
  { nombre: "Romacalderas", tipo: "barrio" },
  { nombre: "Villalba Estación", tipo: "barrio" },
  { nombre: "Villalba Pueblo", tipo: "barrio" },
  { nombre: "Vial Sur", tipo: "barrio" },
  { nombre: "Virgen del Enebral", tipo: "barrio" },
];

const POLIGONOS_COLLADO_VILLALBA: ZonaCiudad[] = [
  { nombre: "Polígono Industrial Granjillas P-5", tipo: "poligono" },
  { nombre: "Polígono Industrial Itelevasa", tipo: "poligono" },
  { nombre: "Polígono Industrial Jabonería", tipo: "poligono" },
  { nombre: "Polígono Industrial Los Llanos", tipo: "poligono" },
  { nombre: "Polígono Industrial P-29", tipo: "poligono" },
  { nombre: "Polígono Industrial Roma-Caldera", tipo: "poligono" },
  { nombre: "Parque Empresarial Sierra Norte", tipo: "poligono" },
];

const BARRIOS_BOADILLA: ZonaCiudad[] = [
  { nombre: "Bonanza", tipo: "barrio" },
  { nombre: "Casco Antiguo", tipo: "barrio" },
  { nombre: "Cortijo Norte", tipo: "barrio" },
  { nombre: "Cortijo Sur", tipo: "barrio" },
  { nombre: "El Encinar", tipo: "barrio" },
  { nombre: "El Olivar", tipo: "barrio" },
  { nombre: "El Pastel", tipo: "barrio" },
  { nombre: "El Olivar de Mirabal", tipo: "barrio" },
  { nombre: "Ensanche de Boadilla", tipo: "barrio" },
  { nombre: "La Cárcava", tipo: "barrio" },
  { nombre: "Las Eras", tipo: "barrio" },
  { nombre: "Las Lomas", tipo: "barrio" },
  { nombre: "Monte de las Encinas", tipo: "barrio" },
  { nombre: "Montepríncipe", tipo: "barrio" },
  { nombre: "Parque Boadilla", tipo: "barrio" },
  { nombre: "Pino Centinela", tipo: "barrio" },
  { nombre: "Residencial Siglo XXI", tipo: "barrio" },
  { nombre: "Sector B", tipo: "barrio" },
  { nombre: "Sector S", tipo: "barrio" },
  { nombre: "Valdecabañas", tipo: "barrio" },
  { nombre: "Valdepastores", tipo: "barrio" },
  { nombre: "Valenoso", tipo: "barrio" },
  { nombre: "Viñas Viejas", tipo: "barrio" },
  { nombre: "Los Fresnos", tipo: "barrio" },
];

const POLIGONOS_BOADILLA: ZonaCiudad[] = [
  { nombre: "Ciudad Financiera del Banco Santander", tipo: "poligono" },
  { nombre: "Parque Empresarial Prado del Espino", tipo: "poligono" },
  { nombre: "Sector Terciario 4.2", tipo: "poligono" },
  { nombre: "Zona Empresarial Sur", tipo: "poligono" },
];

const BARRIOS_ARANJUEZ: ZonaCiudad[] = [
  { nombre: "Agfa", tipo: "barrio" },
  { nombre: "Alpajés", tipo: "barrio" },
  { nombre: "Barrio de la Estación", tipo: "barrio" },
  { nombre: "Barrio de las Aves", tipo: "barrio" },
  { nombre: "Barrio de las Moreras", tipo: "barrio" },
  { nombre: "Barrio de OPA", tipo: "barrio" },
  { nombre: "Ciudad de las Artes", tipo: "barrio" },
  { nombre: "Colonia Aviación Norte", tipo: "barrio" },
  { nombre: "Colonia Aviación Sur", tipo: "barrio" },
  { nombre: "Colonia de Cables", tipo: "barrio" },
  { nombre: "Colonia El Progreso", tipo: "barrio" },
  { nombre: "Colonia Militar", tipo: "barrio" },
  { nombre: "Colonia Palomitas", tipo: "barrio" },
  { nombre: "Cortijo de San Isidro", tipo: "barrio" },
  { nombre: "El Deleite", tipo: "barrio" },
  { nombre: "El Mirador de Aranjuez", tipo: "barrio" },
  { nombre: "El Pinar de Aranjuez", tipo: "barrio" },
  { nombre: "El Vergel", tipo: "barrio" },
  { nombre: "Foso-Moreras", tipo: "barrio" },
  { nombre: "Jardín de Narváez", tipo: "barrio" },
  { nombre: "Jardín de Oñate", tipo: "barrio" },
  { nombre: "La Montaña (PAU de La Montaña)", tipo: "barrio" },
  { nombre: "Las Olivas", tipo: "barrio" },
  { nombre: "Nuevo Aranjuez", tipo: "barrio" },
  { nombre: "Palacio", tipo: "barrio" },
  { nombre: "Plaza de Toros", tipo: "barrio" },
  { nombre: "Real Cortijo de San Isidro", tipo: "barrio" },
  { nombre: "Residencial Alba II", tipo: "barrio" },
  { nombre: "Residencial Monte Jardín", tipo: "barrio" },
  { nombre: "San Estanislao", tipo: "barrio" },
  { nombre: "Vista Real", tipo: "barrio" },
];

const POLIGONOS_ARANJUEZ: ZonaCiudad[] = [
  { nombre: "Industrial AGFA", tipo: "poligono" },
  { nombre: "Industrial Gonzalo Chacón", tipo: "poligono" },
  { nombre: "Industrial Las Tejeras", tipo: "poligono" },
  { nombre: "Industrial Mar Chico", tipo: "poligono" },
  { nombre: "Industrial Naval", tipo: "poligono" },
  { nombre: "Industrial Penicilina", tipo: "poligono" },
  { nombre: "Industrial Pirelli", tipo: "poligono" },
  { nombre: "Industrial Puente Barcas", tipo: "poligono" },
  { nombre: "Industrial de la Estación", tipo: "poligono" },
  { nombre: "Polígono Industrial Gonzalo Chacón", tipo: "poligono" },
  { nombre: "Polígono Industrial del Automóvil", tipo: "poligono" },
];

const BARRIOS_ARGANDA: ZonaCiudad[] = [
  { nombre: "Área de Centralidad", tipo: "barrio" },
  { nombre: "Casco Antiguo", tipo: "barrio" },
  { nombre: "Cerro de la Castaña", tipo: "barrio" },
  { nombre: "Cerro de la Perlita", tipo: "barrio" },
  { nombre: "Colonia de los Almendros", tipo: "barrio" },
  { nombre: "El Guijar", tipo: "barrio" },
  { nombre: "El Grillero", tipo: "barrio" },
  { nombre: "El Romeral", tipo: "barrio" },
  { nombre: "Ensanche de Los Villares", tipo: "barrio" },
  { nombre: "La Campaña", tipo: "barrio" },
  { nombre: "La Poveda", tipo: "barrio" },
  { nombre: "Los Villares", tipo: "barrio" },
  { nombre: "Nuevo Guijar", tipo: "barrio" },
  { nombre: "Puerta de la Dehesa", tipo: "barrio" },
  { nombre: "Valdemaría", tipo: "barrio" },
  { nombre: "Valdelarcipreste", tipo: "barrio" },
];

const POLIGONOS_ARGANDA: ZonaCiudad[] = [
  { nombre: "Borondo", tipo: "poligono" },
  { nombre: "Cañal, El", tipo: "poligono" },
  { nombre: "Cysa", tipo: "poligono" },
  { nombre: "El Alquitón", tipo: "poligono" },
  { nombre: "El Estrechillo", tipo: "poligono" },
  { nombre: "Polígono El Guijar", tipo: "poligono" },
  { nombre: "El Malvar", tipo: "poligono" },
  { nombre: "El Olivar", tipo: "poligono" },
  { nombre: "El Rincón", tipo: "poligono" },
  { nombre: "Finanzauto", tipo: "poligono" },
  { nombre: "José María Llanos", tipo: "poligono" },
  { nombre: "Las Monjas", tipo: "poligono" },
  { nombre: "Los Robles", tipo: "poligono" },
  { nombre: "San Roque", tipo: "poligono" },
  { nombre: "San Sebastián", tipo: "poligono" },
  { nombre: "Valdepeñas", tipo: "poligono" },
  { nombre: "Velasco", tipo: "poligono" },
];

const BARRIOS_COLMENAR: ZonaCiudad[] = [
  { nombre: "Adelfillas", tipo: "barrio" },
  { nombre: "Alto Eugenio", tipo: "barrio" },
  { nombre: "Arcos, Los", tipo: "barrio" },
  { nombre: "Arroyo Espino", tipo: "barrio" },
  { nombre: "Casco Antiguo", tipo: "barrio" },
  { nombre: "Cerca Tejera", tipo: "barrio" },
  { nombre: "Cerrillo, El", tipo: "barrio" },
  { nombre: "Cristo del Perdón – La Magdalena", tipo: "barrio" },
  { nombre: "Dos Castillas", tipo: "barrio" },
  { nombre: "El Pozanco", tipo: "barrio" },
  { nombre: "El Redondillo", tipo: "barrio" },
  { nombre: "El Vivero", tipo: "barrio" },
  { nombre: "Fuente Santa", tipo: "barrio" },
  { nombre: "La Colina de las Torres", tipo: "barrio" },
  { nombre: "La Corredera", tipo: "barrio" },
  { nombre: "La Estación – El Rosario", tipo: "barrio" },
  { nombre: "La Lanera", tipo: "barrio" },
  { nombre: "Las Vegas", tipo: "barrio" },
  { nombre: "Los Residenciales", tipo: "barrio" },
  { nombre: "Navallar", tipo: "barrio" },
  { nombre: "Prado Rosales", tipo: "barrio" },
  { nombre: "Puente Nuevo", tipo: "barrio" },
  { nombre: "Puente Viejo", tipo: "barrio" },
  { nombre: "San Andrés", tipo: "barrio" },
  { nombre: "San Crispín", tipo: "barrio" },
  { nombre: "San José", tipo: "barrio" },
  { nombre: "Santa Lucía", tipo: "barrio" },
  { nombre: "Santa Teresa de Ávila", tipo: "barrio" },
  { nombre: "Virgen del Carmen", tipo: "barrio" },
  { nombre: "Virgen del Pilar", tipo: "barrio" },
  { nombre: "Vista Nevada", tipo: "barrio" },
];

const POLIGONOS_COLMENAR: ZonaCiudad[] = [
  { nombre: "Polígono Industrial Artesanos", tipo: "poligono" },
  { nombre: "Polígono Industrial La Mina", tipo: "poligono" },
  { nombre: "Polígono Industrial La Yedra", tipo: "poligono" },
  { nombre: "Polígono Industrial Sur", tipo: "poligono" },
];

const BARRIOS_PINTO: ZonaCiudad[] = [
  { nombre: "8 de Marzo", tipo: "barrio" },
  { nombre: "Buenos Aires", tipo: "barrio" },
  { nombre: "Cañada Real de Toledo", tipo: "barrio" },
  { nombre: "Egido", tipo: "barrio" },
  { nombre: "Ferrocarril", tipo: "barrio" },
  { nombre: "Indiana", tipo: "barrio" },
  { nombre: "La Calera", tipo: "barrio" },
  { nombre: "La Cristina", tipo: "barrio" },
  { nombre: "La Tenería", tipo: "barrio" },
  { nombre: "La Tenería II", tipo: "barrio" },
  { nombre: "Las Cristinas", tipo: "barrio" },
  { nombre: "Los Cisnes", tipo: "barrio" },
  { nombre: "Maestra María del Rosario", tipo: "barrio" },
  { nombre: "Parque Europa", tipo: "barrio" },
  { nombre: "Parque Norte", tipo: "barrio" },
  { nombre: "Prado", tipo: "barrio" },
  { nombre: "Rábida, La", tipo: "barrio" },
  { nombre: "San Antón", tipo: "barrio" },
  { nombre: "Santo Domingo de Silos", tipo: "barrio" },
];

const POLIGONOS_PINTO: ZonaCiudad[] = [
  { nombre: "Área Empresarial Andalucía", tipo: "poligono" },
  { nombre: "El Cascajal", tipo: "poligono" },
  { nombre: "El Esparragal", tipo: "poligono" },
  { nombre: "Industrial Norte (Sector 1)", tipo: "poligono" },
  { nombre: "Industrial Oeste (Sector 5)", tipo: "poligono" },
  { nombre: "Las Arenas", tipo: "poligono" },
  { nombre: "Las Chimeneas", tipo: "poligono" },
  { nombre: "Mateu Cromo", tipo: "poligono" },
  { nombre: "Pinto-Estación", tipo: "poligono" },
  { nombre: "Parque Empresarial Las Aves", tipo: "poligono" },
  { nombre: "Parque Industrial Sector 2", tipo: "poligono" },
];

const BARRIOS_TRES_CANTOS: ZonaCiudad[] = [
  { nombre: "América", tipo: "barrio" },
  { nombre: "Centro – Estación", tipo: "barrio" },
  { nombre: "Descubridores", tipo: "barrio" },
  { nombre: "Embarcaciones", tipo: "barrio" },
  { nombre: "Forestal", tipo: "barrio" },
  { nombre: "Foresta", tipo: "barrio" },
  { nombre: "Islas", tipo: "barrio" },
  { nombre: "Literatos", tipo: "barrio" },
  { nombre: "Mares", tipo: "barrio" },
  { nombre: "Músicos", tipo: "barrio" },
  { nombre: "Nuevo Tres Cantos", tipo: "barrio" },
  { nombre: "Océanos", tipo: "barrio" },
  { nombre: "Oficios", tipo: "barrio" },
  { nombre: "Pintores", tipo: "barrio" },
  { nombre: "Planetas", tipo: "barrio" },
  { nombre: "Pueblos", tipo: "barrio" },
  { nombre: "Soto de Viñuelas", tipo: "barrio" },
  { nombre: "Residencial El Pinar", tipo: "barrio" },
];

const POLIGONOS_TRES_CANTOS: ZonaCiudad[] = [
  { nombre: "Parque Empresarial Euronova", tipo: "poligono" },
  { nombre: "Parque Empresarial UA-3 / UA-4", tipo: "poligono" },
  { nombre: "Parque Tecnológico de Madrid", tipo: "poligono" },
  { nombre: "Parque Tecnológico Nuevo Tres Cantos", tipo: "poligono" },
  { nombre: "Polígono Industrial de Tres Cantos (Zona Industrial Este)", tipo: "poligono" },
  { nombre: "Polígono Industrial Sur", tipo: "poligono" },
  { nombre: "Polígono Industrial Valdelaosa", tipo: "poligono" },
  { nombre: "Zona Industrial Oeste", tipo: "poligono" },
];

const BARRIOS_SAN_FERNANDO: ZonaCiudad[] = [
  { nombre: "Barrio de la OTAN", tipo: "barrio" },
  { nombre: "Casco Antiguo", tipo: "barrio" },
  { nombre: "Colonia Montserrat", tipo: "barrio" },
  { nombre: "Ciudad Parque Henares", tipo: "barrio" },
  { nombre: "El Ensanche", tipo: "barrio" },
  { nombre: "El Ferial", tipo: "barrio" },
  { nombre: "Parque Henares", tipo: "barrio" },
  { nombre: "Zona Centro", tipo: "barrio" },
  { nombre: "Zona de la Estación", tipo: "barrio" },
  { nombre: "Zona del Hospital", tipo: "barrio" },
];

const POLIGONOS_SAN_FERNANDO: ZonaCiudad[] = [
  { nombre: "El Barral (Parque Logístico)", tipo: "poligono" },
  { nombre: "La Fuentecilla", tipo: "poligono" },
  { nombre: "Las Fronteras", tipo: "poligono" },
  { nombre: "Parque Empresarial Best Point", tipo: "poligono" },
  { nombre: "Parque Empresarial de San Fernando", tipo: "poligono" },
  { nombre: "Parque Empresarial San Fernando II", tipo: "poligono" },
  { nombre: "Parque Industrial San Fernando Centro", tipo: "poligono" },
  { nombre: "Parque Industrial San Fernando Norte", tipo: "poligono" },
  { nombre: "Parque Industrial San Fernando Sur", tipo: "poligono" },
  { nombre: "Parque Industrial SUP I-2", tipo: "poligono" },
  { nombre: "Parque Industrial SUP I-4", tipo: "poligono" },
  { nombre: "Parque Industrial SUE-5", tipo: "poligono" },
  { nombre: "Polígono Industrial Puerta de Madrid", tipo: "poligono" },
  { nombre: "Prologis Park San Fernando", tipo: "poligono" },
];

const BARRIOS_SAN_MARTIN_VEGA: ZonaCiudad[] = [
  { nombre: "Casco Antiguo", tipo: "barrio" },
  { nombre: "El Jardín", tipo: "barrio" },
  { nombre: "El Quiñón", tipo: "barrio" },
  { nombre: "El Ensanche", tipo: "barrio" },
  { nombre: "La Cañada", tipo: "barrio" },
  { nombre: "Los Hoteles", tipo: "barrio" },
  { nombre: "Santa Elena", tipo: "barrio" },
  { nombre: "Vallequillas Norte", tipo: "barrio" },
  { nombre: "Vallequillas Sur", tipo: "barrio" },
  { nombre: "El Pingarrón", tipo: "barrio" },
];

const POLIGONOS_SAN_MARTIN_VEGA: ZonaCiudad[] = [
  { nombre: "Aimayr (Almayr)", tipo: "poligono" },
];

const BARRIOS_ARROYOMOLINOS: ZonaCiudad[] = [
  { nombre: "Abedul", tipo: "barrio" },
  { nombre: "Álamo", tipo: "barrio" },
  { nombre: "Arroyo de la Dehesa", tipo: "barrio" },
  { nombre: "Casco Antiguo", tipo: "barrio" },
  { nombre: "Castañeras, Las", tipo: "barrio" },
  { nombre: "Cantabria", tipo: "barrio" },
  { nombre: "Carretera de Fuenlabrada", tipo: "barrio" },
  { nombre: "Carrizos, Los", tipo: "barrio" },
  { nombre: "Castillo, El", tipo: "barrio" },
  { nombre: "Cervantes", tipo: "barrio" },
  { nombre: "Ciudad Jardín Este", tipo: "barrio" },
  { nombre: "Ciudad Jardín Oeste", tipo: "barrio" },
  { nombre: "Dehesa, La", tipo: "barrio" },
  { nombre: "El Bosque", tipo: "barrio" },
  { nombre: "Encinar, El", tipo: "barrio" },
  { nombre: "Javalambre", tipo: "barrio" },
  { nombre: "La Cárcaba", tipo: "barrio" },
  { nombre: "La Rinconada", tipo: "barrio" },
  { nombre: "Los Mosquitos", tipo: "barrio" },
  { nombre: "Los Monteros", tipo: "barrio" },
  { nombre: "Montemolinos", tipo: "barrio" },
  { nombre: "Molino Perdido", tipo: "barrio" },
  { nombre: "Nuevo Arroyomolinos", tipo: "barrio" },
  { nombre: "Parque Arroyomolinos", tipo: "barrio" },
  { nombre: "Plaza Mayor", tipo: "barrio" },
  { nombre: "Río Tajo", tipo: "barrio" },
  { nombre: "Zarzalejo", tipo: "barrio" },
];

const POLIGONOS_ARROYOMOLINOS: ZonaCiudad[] = [
  { nombre: "Valdearenal Norte", tipo: "poligono" },
  { nombre: "Valdearenal Sur", tipo: "poligono" },
  { nombre: "Valdefuentes", tipo: "poligono" },
];

const BARRIOS_GALAPAGAR: ZonaCiudad[] = [
  { nombre: "Bellavista", tipo: "barrio" },
  { nombre: "Colonia España", tipo: "barrio" },
  { nombre: "Colonia Torrelodones", tipo: "barrio" },
  { nombre: "El Encinar – San Alberto Magno", tipo: "barrio" },
  { nombre: "El Guijo", tipo: "barrio" },
  { nombre: "El Pocillo", tipo: "barrio" },
  { nombre: "Fuente la Teja", tipo: "barrio" },
  { nombre: "Galapagar Casco", tipo: "barrio" },
  { nombre: "La Navata", tipo: "barrio" },
  { nombre: "Las Cuestas", tipo: "barrio" },
  { nombre: "Las Minas", tipo: "barrio" },
  { nombre: "Los Chopos", tipo: "barrio" },
  { nombre: "Los Jarales", tipo: "barrio" },
  { nombre: "Los Ranchos", tipo: "barrio" },
  { nombre: "Molino de la Hoz", tipo: "barrio" },
  { nombre: "Parquelagos", tipo: "barrio" },
  { nombre: "Roncesvalles", tipo: "barrio" },
  { nombre: "Vista Nevada", tipo: "barrio" },
  { nombre: "Vedado de la Monja", tipo: "barrio" },
  { nombre: "Las Cuevas", tipo: "barrio" },
  { nombre: "Congosto", tipo: "barrio" },
  { nombre: "Colonia de los Peregrinos", tipo: "barrio" },
  { nombre: "Riomonte", tipo: "barrio" },
  { nombre: "Los Enebros", tipo: "barrio" },
  { nombre: "Los Rosales", tipo: "barrio" },
  { nombre: "Buenos Aires", tipo: "barrio" },
  { nombre: "Galapark", tipo: "barrio" },
  { nombre: "El Rincón", tipo: "barrio" },
  { nombre: "Monte Ana", tipo: "barrio" },
  { nombre: "Nido del Águila", tipo: "barrio" },
];

const POLIGONOS_GALAPAGAR: ZonaCiudad[] = [
  { nombre: "Centro de Negocios de Galapagar", tipo: "poligono" },
  { nombre: "Zona empresarial de La Navata", tipo: "poligono" },
  { nombre: "Zona empresarial del casco urbano", tipo: "poligono" },
];

const BARRIOS_NAVALCARNERO: ZonaCiudad[] = [
  { nombre: "Buenavista", tipo: "barrio" },
  { nombre: "Calypo", tipo: "barrio" },
  { nombre: "Caño Viejo", tipo: "barrio" },
  { nombre: "Canto Pelín", tipo: "barrio" },
  { nombre: "Cuesta Pajares", tipo: "barrio" },
  { nombre: "El Pinar", tipo: "barrio" },
  { nombre: "El Silo", tipo: "barrio" },
  { nombre: "La Candelaria", tipo: "barrio" },
  { nombre: "La Dehesa", tipo: "barrio" },
  { nombre: "La Estación", tipo: "barrio" },
  { nombre: "La Perdiguera", tipo: "barrio" },
  { nombre: "San Andrés", tipo: "barrio" },
  { nombre: "San Antón", tipo: "barrio" },
  { nombre: "San Isidro", tipo: "barrio" },
  { nombre: "San Juan", tipo: "barrio" },
  { nombre: "Villarino", tipo: "barrio" },
];

const POLIGONOS_NAVALCARNERO: ZonaCiudad[] = [
  { nombre: "Alparrache I", tipo: "poligono" },
  { nombre: "Alparrache II", tipo: "poligono" },
  { nombre: "Carril Toledano", tipo: "poligono" },
  { nombre: "Industrial Sector 4", tipo: "poligono" },
  { nombre: "Mancigordo", tipo: "poligono" },
  { nombre: "Polígono San Isidro", tipo: "poligono" },
];

const BARRIOS_SEVILLA: ZonaCiudad[] = [
  { nombre: "Aeropuerto Viejo", tipo: "barrio" },
  { nombre: "Alfalfa", tipo: "barrio" },
  { nombre: "Amate", tipo: "barrio" },
  { nombre: "Arenal, El", tipo: "barrio" },
  { nombre: "Árbol Gordo", tipo: "barrio" },
  { nombre: "Avenida de la Paz", tipo: "barrio" },
  { nombre: "Barriada de Pineda", tipo: "barrio" },
  { nombre: "Bami", tipo: "barrio" },
  { nombre: "Barriada Pino Montano", tipo: "barrio" },
  { nombre: "Barrio León", tipo: "barrio" },
  { nombre: "Bellavista", tipo: "barrio" },
  { nombre: "Begoña-Santa Catalina", tipo: "barrio" },
  { nombre: "Cerro del Águila", tipo: "barrio" },
  { nombre: "Ciudad Jardín", tipo: "barrio" },
  { nombre: "Cisneo Alto", tipo: "barrio" },
  { nombre: "Condequinto", tipo: "barrio" },
  { nombre: "Consolación", tipo: "barrio" },
  { nombre: "El Cerezo", tipo: "barrio" },
  { nombre: "El Juncal-Híspalis", tipo: "barrio" },
  { nombre: "El Plantinar", tipo: "barrio" },
  { nombre: "El Porvenir", tipo: "barrio" },
  { nombre: "El Prado-Parque de María Luisa", tipo: "barrio" },
  { nombre: "El Rocío", tipo: "barrio" },
  { nombre: "El Tardón", tipo: "barrio" },
  { nombre: "Encarnación-Regina", tipo: "barrio" },
  { nombre: "Feria", tipo: "barrio" },
  { nombre: "Heliópolis", tipo: "barrio" },
  { nombre: "Hermandades-La Carrasca", tipo: "barrio" },
  { nombre: "Huerta de Santa Teresa", tipo: "barrio" },
  { nombre: "Juan XXIII", tipo: "barrio" },
  { nombre: "La Bachillera", tipo: "barrio" },
  { nombre: "La Calzada", tipo: "barrio" },
  { nombre: "La Florida", tipo: "barrio" },
  { nombre: "La Oliva", tipo: "barrio" },
  { nombre: "La Plata", tipo: "barrio" },
  { nombre: "La Rosaleda", tipo: "barrio" },
  { nombre: "La Salle", tipo: "barrio" },
  { nombre: "Las Avenidas", tipo: "barrio" },
  { nombre: "Las Letanías", tipo: "barrio" },
  { nombre: "Los Arcos", tipo: "barrio" },
  { nombre: "Los Carteros", tipo: "barrio" },
  { nombre: "Los Pájaros", tipo: "barrio" },
  { nombre: "Los Príncipes-La Fontanilla", tipo: "barrio" },
  { nombre: "Macarena", tipo: "barrio" },
  { nombre: "Nervión", tipo: "barrio" },
  { nombre: "Palmete", tipo: "barrio" },
  { nombre: "Parque Alcosa", tipo: "barrio" },
  { nombre: "Parque Atlántico-Las Dalias", tipo: "barrio" },
  { nombre: "Parque Flores", tipo: "barrio" },
  { nombre: "Parque Miraflores", tipo: "barrio" },
  { nombre: "Pino Montano", tipo: "barrio" },
  { nombre: "Polígono Norte", tipo: "barrio" },
  { nombre: "Polígono Sur", tipo: "barrio" },
  { nombre: "Rochelambert", tipo: "barrio" },
  { nombre: "San Bernardo", tipo: "barrio" },
  { nombre: "San Gil", tipo: "barrio" },
  { nombre: "San Jerónimo", tipo: "barrio" },
  { nombre: "San Julián", tipo: "barrio" },
  { nombre: "San Lorenzo", tipo: "barrio" },
  { nombre: "San Pablo", tipo: "barrio" },
  { nombre: "San Vicente", tipo: "barrio" },
  { nombre: "Santa Aurelia", tipo: "barrio" },
  { nombre: "Santa Clara", tipo: "barrio" },
  { nombre: "Santa Cruz", tipo: "barrio" },
  { nombre: "Santa Justa", tipo: "barrio" },
  { nombre: "Sevilla Este", tipo: "barrio" },
  { nombre: "Torreblanca", tipo: "barrio" },
  { nombre: "Triana", tipo: "barrio" },
  { nombre: "Valdezorras", tipo: "barrio" },
  { nombre: "Villegas", tipo: "barrio" },
];

const POLIGONOS_SEVILLA: ZonaCiudad[] = [
  { nombre: "Astilleros", tipo: "poligono" },
  { nombre: "Avenida de la Prensa", tipo: "poligono" },
  { nombre: "Calonge", tipo: "poligono" },
  { nombre: "Carretera Amarilla (PICA)", tipo: "poligono" },
  { nombre: "El Pino", tipo: "poligono" },
  { nombre: "La Chaparrilla", tipo: "poligono" },
  { nombre: "La Negrilla", tipo: "poligono" },
  { nombre: "Parque Empresarial Nuevo Torneo", tipo: "poligono" },
  { nombre: "Parque Empresarial PICA", tipo: "poligono" },
  { nombre: "Parque Empresarial Torneo", tipo: "poligono" },
  { nombre: "Parque Industrial San Jerónimo", tipo: "poligono" },
  { nombre: "Parque Logístico de Carmona", tipo: "poligono" },
  { nombre: "Store", tipo: "poligono" },
  { nombre: "Torrecuéllar", tipo: "poligono" },
  { nombre: "Zona Franca de Sevilla", tipo: "poligono" },
  { nombre: "Zona de Actividades Logísticas (ZAL)", tipo: "poligono" },
];

const BARRIOS_DOS_HERMANAS: ZonaCiudad[] = [
  { nombre: "Casco Antiguo", tipo: "barrio" },
  { nombre: "La Pólvora", tipo: "barrio" },
  { nombre: "La Moneda", tipo: "barrio" },
  { nombre: "Las Cruces", tipo: "barrio" },
  { nombre: "El Inglés", tipo: "barrio" },
  { nombre: "Venta Bermeja", tipo: "barrio" },
  { nombre: "La Lagunilla", tipo: "barrio" },
  { nombre: "Los Molinos", tipo: "barrio" },
  { nombre: "Juan de la Cosa", tipo: "barrio" },
  { nombre: "Las Infantas", tipo: "barrio" },
  { nombre: "Los Potros", tipo: "barrio" },
  { nombre: "Los Príncipes", tipo: "barrio" },
  { nombre: "Las Ganchosas", tipo: "barrio" },
  { nombre: "La Victoria", tipo: "barrio" },
  { nombre: "Federico Mayo", tipo: "barrio" },
  { nombre: "San Hilario", tipo: "barrio" },
  { nombre: "Virgen de los Reyes", tipo: "barrio" },
  { nombre: "Santa Teresa", tipo: "barrio" },
  { nombre: "Santa Ana", tipo: "barrio" },
  { nombre: "San Pablo", tipo: "barrio" },
  { nombre: "San Rafael", tipo: "barrio" },
  { nombre: "Cantely", tipo: "barrio" },
  { nombre: "Las Mercedes", tipo: "barrio" },
  { nombre: "Doña Mercedes", tipo: "barrio" },
  { nombre: "Virgen del Rocío", tipo: "barrio" },
  { nombre: "Virgen de Valme", tipo: "barrio" },
  { nombre: "Virgen de la Luz", tipo: "barrio" },
  { nombre: "El Palancar", tipo: "barrio" },
  { nombre: "Ciudad Blanca", tipo: "barrio" },
  { nombre: "Las Torres", tipo: "barrio" },
  { nombre: "Costa del Sol", tipo: "barrio" },
  { nombre: "El Chaparral", tipo: "barrio" },
  { nombre: "Ibarburu", tipo: "barrio" },
  { nombre: "Los Montecillos", tipo: "barrio" },
  { nombre: "Cerro Blanco", tipo: "barrio" },
  { nombre: "Vistazul", tipo: "barrio" },
  { nombre: "Consolación", tipo: "barrio" },
  { nombre: "Pacheco", tipo: "barrio" },
  { nombre: "Pachico", tipo: "barrio" },
  { nombre: "La Fábrica", tipo: "barrio" },
  { nombre: "Julio Carrasco", tipo: "barrio" },
  { nombre: "El Marquesado", tipo: "barrio" },
  { nombre: "El Palmarillo", tipo: "barrio" },
  { nombre: "Parque Giralda", tipo: "barrio" },
  { nombre: "Las Portadas", tipo: "barrio" },
  { nombre: "La Motilla", tipo: "barrio" },
  { nombre: "El Castillo", tipo: "barrio" },
  { nombre: "El Caballo", tipo: "barrio" },
  { nombre: "El Galope", tipo: "barrio" },
  { nombre: "La Hacienda", tipo: "barrio" },
  { nombre: "Huerta del Pilar", tipo: "barrio" },
  { nombre: "Huerta del Pilar II", tipo: "barrio" },
  { nombre: "Entrenúcleos", tipo: "barrio" },
  { nombre: "Montequinto", tipo: "barrio" },
  { nombre: "Condequinto", tipo: "barrio" },
  { nombre: "Olivar de Quintos", tipo: "barrio" },
  { nombre: "Fuente del Rey", tipo: "barrio" },
  { nombre: "Adriano", tipo: "barrio" },
  { nombre: "Entrepinares", tipo: "barrio" },
  { nombre: "Los Valeros", tipo: "barrio" },
  { nombre: "Casquero", tipo: "barrio" },
  { nombre: "Buenavista", tipo: "barrio" },
  { nombre: "San Federico de Echaguy", tipo: "barrio" },
  { nombre: "Parquequinto", tipo: "barrio" },
  { nombre: "Intercivitas", tipo: "barrio" },
  { nombre: "Intercivitas II", tipo: "barrio" },
  { nombre: "Residencial Hespérides", tipo: "barrio" },
  { nombre: "Doña Jimena", tipo: "barrio" },
  { nombre: "Los Merinales", tipo: "barrio" },
  { nombre: "Las Viñas Chicas", tipo: "barrio" },
  { nombre: "Las Cabreras", tipo: "barrio" },
  { nombre: "Nueva Andalucía", tipo: "barrio" },
  { nombre: "La Jimena", tipo: "barrio" },
  { nombre: "La Jimena II", tipo: "barrio" },
  { nombre: "La Peña", tipo: "barrio" },
  { nombre: "Las Luisas", tipo: "barrio" },
  { nombre: "Montelirio", tipo: "barrio" },
  { nombre: "Las Cazorlas Chicas", tipo: "barrio" },
  { nombre: "Olivos de Maestre", tipo: "barrio" },
  { nombre: "Castillo de la Serrezuela", tipo: "barrio" },
  { nombre: "Los Rosales", tipo: "barrio" },
  { nombre: "Beatriz del Campo", tipo: "barrio" },
  { nombre: "El Rincón", tipo: "barrio" },
  { nombre: "Polvero", tipo: "barrio" },
  { nombre: "La Corchuela", tipo: "barrio" },
  { nombre: "Hacienda de Maestre", tipo: "barrio" },
  { nombre: "El Romeral", tipo: "barrio" },
];

const POLIGONOS_DOS_HERMANAS: ZonaCiudad[] = [
  { nombre: "Carretera de la Isla", tipo: "poligono" },
  { nombre: "Megapark", tipo: "poligono" },
  { nombre: "Aceitunero", tipo: "poligono" },
  { nombre: "Polígono Ibarburu", tipo: "poligono" },
  { nombre: "La Palmera", tipo: "poligono" },
  { nombre: "Polígono Fuente del Rey", tipo: "poligono" },
  { nombre: "Industrial Autovía", tipo: "poligono" },
  { nombre: "Orippo", tipo: "poligono" },
  { nombre: "Dehesa de Valme", tipo: "poligono" },
  { nombre: "Parque Empresarial La Isla", tipo: "poligono" },
  { nombre: "Zona Industrial Autovía I", tipo: "poligono" },
  { nombre: "Zona Industrial Autovía II", tipo: "poligono" },
];

const BARRIOS_ALCALA_GUADAIRA: ZonaCiudad[] = [
  { nombre: "Barrio Nuevo", tipo: "barrio" },
  { nombre: "Barriada La Liebre", tipo: "barrio" },
  { nombre: "Barriada Pablo VI", tipo: "barrio" },
  { nombre: "Barro Blanco", tipo: "barrio" },
  { nombre: "Campo de las Beatas", tipo: "barrio" },
  { nombre: "Casco Antiguo", tipo: "barrio" },
  { nombre: "Cerro Blanco", tipo: "barrio" },
  { nombre: "Cerro del Moro", tipo: "barrio" },
  { nombre: "El Algarrobo", tipo: "barrio" },
  { nombre: "El Barrero", tipo: "barrio" },
  { nombre: "El Castillo – San Miguel", tipo: "barrio" },
  { nombre: "El Duque", tipo: "barrio" },
  { nombre: "El Perejil", tipo: "barrio" },
  { nombre: "El Zacatín", tipo: "barrio" },
  { nombre: "La Concepción", tipo: "barrio" },
  { nombre: "La Juncosa", tipo: "barrio" },
  { nombre: "La Mina", tipo: "barrio" },
  { nombre: "La Paz", tipo: "barrio" },
  { nombre: "La Plazuela", tipo: "barrio" },
  { nombre: "Las Mairenas", tipo: "barrio" },
  { nombre: "Los Carambolos", tipo: "barrio" },
  { nombre: "Los Cercadillos", tipo: "barrio" },
  { nombre: "Los Lirios", tipo: "barrio" },
  { nombre: "Los Toreros", tipo: "barrio" },
  { nombre: "Pinares de Oromana", tipo: "barrio" },
  { nombre: "Rabesa", tipo: "barrio" },
  { nombre: "San Rafael", tipo: "barrio" },
  { nombre: "Santa Lucía", tipo: "barrio" },
  { nombre: "Silos", tipo: "barrio" },
  { nombre: "Torrequinto", tipo: "barrio" },
  { nombre: "Urbanización Las Encinas", tipo: "barrio" },
  { nombre: "Urbanización Residencial Sevilla Golf", tipo: "barrio" },
  { nombre: "Venta La Liebre", tipo: "barrio" },
];

const POLIGONOS_ALCALA_GUADAIRA: ZonaCiudad[] = [
  { nombre: "Complejo Tecnológico de Servicios Avanzados", tipo: "poligono" },
  { nombre: "Parque Empresarial Alcalá de Guadaíra", tipo: "poligono" },
  { nombre: "Parque Empresarial Alcalá X", tipo: "poligono" },
  { nombre: "Parque Empresarial Bansur", tipo: "poligono" },
  { nombre: "Parque Empresarial Cabeza Hermosa", tipo: "poligono" },
  { nombre: "Parque Empresarial El Chaparral", tipo: "poligono" },
  { nombre: "Parque Empresarial Hacienda Dolores", tipo: "poligono" },
  { nombre: "Parque Empresarial La Red Sur", tipo: "poligono" },
  { nombre: "Parque Empresarial Los Palillos", tipo: "poligono" },
  { nombre: "Parque Empresarial Piedra Hincada", tipo: "poligono" },
  { nombre: "Parque Empresarial Polysol", tipo: "poligono" },
  { nombre: "Parque Empresarial San Nicolás", tipo: "poligono" },
  { nombre: "Parque Empresarial Vereda de Cuchipanda", tipo: "poligono" },
  { nombre: "Parque Industrial y Empresarial Recisur", tipo: "poligono" },
  { nombre: "Parque Metropolitano Alcalá", tipo: "poligono" },
  { nombre: "Polígono Industrial Alcalá X", tipo: "poligono" },
  { nombre: "Polígono Industrial Cementera", tipo: "poligono" },
  { nombre: "Polígono Industrial Chaparrejo", tipo: "poligono" },
  { nombre: "Polígono Industrial Cristalería", tipo: "poligono" },
  { nombre: "Polígono Industrial Cuchipanda", tipo: "poligono" },
  { nombre: "Polígono Industrial El Cruce", tipo: "poligono" },
  { nombre: "Polígono Industrial Espaldillas", tipo: "poligono" },
  { nombre: "Polígono Industrial Fridex", tipo: "poligono" },
  { nombre: "Polígono Industrial La Cancela", tipo: "poligono" },
  { nombre: "Polígono Industrial La Liebre", tipo: "poligono" },
  { nombre: "Polígono Industrial La Red Norte", tipo: "poligono" },
  { nombre: "Polígono Industrial La Red Sur", tipo: "poligono" },
  { nombre: "Polígono Industrial La Red XXI", tipo: "poligono" },
  { nombre: "Polígono Industrial Laguna Larga", tipo: "poligono" },
  { nombre: "Polígono Industrial Los Palillos", tipo: "poligono" },
  { nombre: "Polígono Industrial Palmetillo", tipo: "poligono" },
  { nombre: "Polígono Industrial Pero Mingo", tipo: "poligono" },
  { nombre: "Polígono Industrial Piedra Hincada", tipo: "poligono" },
  { nombre: "Polígono Industrial Polysol", tipo: "poligono" },
  { nombre: "Polígono Industrial Recisur", tipo: "poligono" },
  { nombre: "Polígono Industrial Venta La Liebre", tipo: "poligono" },
];

const BARRIOS_UTRERA: ZonaCiudad[] = [
  { nombre: "Arroyo del Búho", tipo: "barrio" },
  { nombre: "Bencarrón", tipo: "barrio" },
  { nombre: "Casas Cerros", tipo: "barrio" },
  { nombre: "Centro", tipo: "barrio" },
  { nombre: "Cerro de la Palma", tipo: "barrio" },
  { nombre: "Coca de la Piñera", tipo: "barrio" },
  { nombre: "Consolación", tipo: "barrio" },
  { nombre: "Don Pablo", tipo: "barrio" },
  { nombre: "Doña Jacinta", tipo: "barrio" },
  { nombre: "Doña Jacinta Baja", tipo: "barrio" },
  { nombre: "El Chaparral", tipo: "barrio" },
  { nombre: "El Comodoro", tipo: "barrio" },
  { nombre: "El Junquillo", tipo: "barrio" },
  { nombre: "El Mulero", tipo: "barrio" },
  { nombre: "El Poeta", tipo: "barrio" },
  { nombre: "El Recuero", tipo: "barrio" },
  { nombre: "El Saltillo", tipo: "barrio" },
  { nombre: "El Tinte", tipo: "barrio" },
  { nombre: "El Vicario", tipo: "barrio" },
  { nombre: "Huerta de la Salud", tipo: "barrio" },
  { nombre: "Ibárrburu", tipo: "barrio" },
  { nombre: "La Alborra", tipo: "barrio" },
  { nombre: "La Aguardientera", tipo: "barrio" },
  { nombre: "La Estación", tipo: "barrio" },
  { nombre: "La Fontanilla", tipo: "barrio" },
  { nombre: "La Jordana", tipo: "barrio" },
  { nombre: "La Juncosa", tipo: "barrio" },
  { nombre: "La Marquesita", tipo: "barrio" },
  { nombre: "La Minilla", tipo: "barrio" },
  { nombre: "La Novenera", tipo: "barrio" },
  { nombre: "La Pacheca", tipo: "barrio" },
  { nombre: "La Pachequilla", tipo: "barrio" },
  { nombre: "La Paz", tipo: "barrio" },
  { nombre: "La Romana", tipo: "barrio" },
  { nombre: "La Ruana", tipo: "barrio" },
  { nombre: "La Vereda", tipo: "barrio" },
  { nombre: "Las Cuevas", tipo: "barrio" },
  { nombre: "Las Ganchosas", tipo: "barrio" },
  { nombre: "Las Infantas", tipo: "barrio" },
  { nombre: "Las Torres", tipo: "barrio" },
  { nombre: "Los Adrianes", tipo: "barrio" },
  { nombre: "Los Granadillos", tipo: "barrio" },
  { nombre: "Los Hermanos", tipo: "barrio" },
  { nombre: "Los Muleros", tipo: "barrio" },
  { nombre: "Los Molinos", tipo: "barrio" },
  { nombre: "Los Pinos del Nevero", tipo: "barrio" },
  { nombre: "Los Rebolaos", tipo: "barrio" },
  { nombre: "Los Salesianos", tipo: "barrio" },
  { nombre: "Madres Carmelitas", tipo: "barrio" },
  { nombre: "Mateo Pablo", tipo: "barrio" },
  { nombre: "Nueva Andalucía", tipo: "barrio" },
  { nombre: "Puyón", tipo: "barrio" },
  { nombre: "Urbanización Casablanca", tipo: "barrio" },
  { nombre: "Urbanización La Herradera", tipo: "barrio" },
  { nombre: "Vistalegre", tipo: "barrio" },
  { nombre: "Virgen de los Reyes", tipo: "barrio" },
];

const POLIGONOS_UTRERA: ZonaCiudad[] = [
  { nombre: "Carretera Amarilla", tipo: "poligono" },
  { nombre: "El Limonar", tipo: "poligono" },
  { nombre: "El Torno", tipo: "poligono" },
  { nombre: "Innovatorno", tipo: "poligono" },
  { nombre: "La Aurora", tipo: "poligono" },
  { nombre: "La Morera", tipo: "poligono" },
  { nombre: "Las Marías Bajas", tipo: "poligono" },
  { nombre: "Orippo", tipo: "poligono" },
];

const BARRIOS_MAIRENA_ALJARAFE: ZonaCiudad[] = [
  { nombre: "Calahoyas", tipo: "barrio" },
  { nombre: "Casco Antiguo", tipo: "barrio" },
  { nombre: "Cavaleri", tipo: "barrio" },
  { nombre: "Ciudad Aljarafe", tipo: "barrio" },
  { nombre: "Ciudad Expo", tipo: "barrio" },
  { nombre: "Ciudad Jardín del Aljarafe", tipo: "barrio" },
  { nombre: "El Almendral", tipo: "barrio" },
  { nombre: "El Rosario", tipo: "barrio" },
  { nombre: "Estacada del Marqués", tipo: "barrio" },
  { nombre: "Hacienda Los Olivos", tipo: "barrio" },
  { nombre: "Java", tipo: "barrio" },
  { nombre: "La Prusiana", tipo: "barrio" },
  { nombre: "La Señora", tipo: "barrio" },
  { nombre: "Las Brisas I", tipo: "barrio" },
  { nombre: "Las Brisas II", tipo: "barrio" },
  { nombre: "Las Tinajas", tipo: "barrio" },
  { nombre: "Las Tres Barras", tipo: "barrio" },
  { nombre: "Lepanto", tipo: "barrio" },
  { nombre: "Los Alcores", tipo: "barrio" },
  { nombre: "Nuevo Bulevar", tipo: "barrio" },
  { nombre: "Poniente Norte", tipo: "barrio" },
  { nombre: "Poniente Sur", tipo: "barrio" },
  { nombre: "Puebla del Marqués", tipo: "barrio" },
  { nombre: "Simón Verde", tipo: "barrio" },
  { nombre: "Cañada de Porzuna", tipo: "barrio" },
  { nombre: "Mampela", tipo: "barrio" },
  { nombre: "Pinar de Simón Verde", tipo: "barrio" },
  { nombre: "Residencial Aljarasol", tipo: "barrio" },
  { nombre: "Ribera de Porzuna", tipo: "barrio" },
  { nombre: "Urbanización del Bus", tipo: "barrio" },
  { nombre: "Virgen del Rocío", tipo: "barrio" },
];

const POLIGONOS_MAIRENA_ALJARAFE: ZonaCiudad[] = [
  { nombre: "Parque Industrial y de Servicios del Aljarafe (PISA)", tipo: "poligono" },
  { nombre: "Polígono Industrial Hacienda Peralta", tipo: "poligono" },
];

const BARRIOS_LA_RINCONADA: ZonaCiudad[] = [
  { nombre: "Casavacas", tipo: "barrio" },
  { nombre: "El Castellón", tipo: "barrio" },
  { nombre: "El Gordillo", tipo: "barrio" },
  { nombre: "El Tejar", tipo: "barrio" },
  { nombre: "La Rinconada (casco urbano)", tipo: "barrio" },
  { nombre: "Las Cortillas", tipo: "barrio" },
  { nombre: "Nueva Jarilla", tipo: "barrio" },
  { nombre: "San José de la Rinconada", tipo: "barrio" },
  { nombre: "Tarazona", tipo: "barrio" },
  { nombre: "Tarazonilla", tipo: "barrio" },
  { nombre: "Urbanización La Rata", tipo: "barrio" },
  { nombre: "Urbanización Los Abetos", tipo: "barrio" },
  { nombre: "Urbanización Los Serafines", tipo: "barrio" },
  { nombre: "Urbanización Verónica", tipo: "barrio" },
];

const POLIGONOS_LA_RINCONADA: ZonaCiudad[] = [
  { nombre: "Aerópolis (Parque Tecnológico Aeroespacial de Andalucía)", tipo: "poligono" },
  { nombre: "El Cáñamo I", tipo: "poligono" },
  { nombre: "El Cáñamo II", tipo: "poligono" },
  { nombre: "El Cáñamo III", tipo: "poligono" },
  { nombre: "Polígono El Gordillo", tipo: "poligono" },
  { nombre: "El Malecón", tipo: "poligono" },
  { nombre: "Espartales I", tipo: "poligono" },
  { nombre: "Espartales II", tipo: "poligono" },
  { nombre: "La Jarilla (Polígono Agroalimentario)", tipo: "poligono" },
  { nombre: "Majaravique", tipo: "poligono" },
  { nombre: "NACOISA", tipo: "poligono" },
  { nombre: "Polígono 28 de Febrero", tipo: "poligono" },
  { nombre: "Santa Marta", tipo: "poligono" },
  { nombre: "Torre Pavas", tipo: "poligono" },
];

const BARRIOS_ECIJA: ZonaCiudad[] = [
  { nombre: "Astigi (Urbanización)", tipo: "barrio" },
  { nombre: "Barriada Colonda", tipo: "barrio" },
  { nombre: "Barriada El Limero", tipo: "barrio" },
  { nombre: "Barriada San Hermenegildo", tipo: "barrio" },
  { nombre: "Cerro de San Cristóbal", tipo: "barrio" },
  { nombre: "Cerro Perea", tipo: "barrio" },
  { nombre: "El Picadero", tipo: "barrio" },
  { nombre: "El Valle", tipo: "barrio" },
  { nombre: "Isla Redonda", tipo: "barrio" },
  { nombre: "Isla Redonda-La Aceñuela", tipo: "barrio" },
  { nombre: "La Alcarrachela", tipo: "barrio" },
  { nombre: "La Fuensanta", tipo: "barrio" },
  { nombre: "La Merced", tipo: "barrio" },
  { nombre: "Las Moreras", tipo: "barrio" },
  { nombre: "San Gil", tipo: "barrio" },
  { nombre: "Vía Augusta (Cuesta Blanca)", tipo: "barrio" },
  { nombre: "Villanueva del Rey", tipo: "barrio" },
];

const POLIGONOS_ECIJA: ZonaCiudad[] = [
  { nombre: "El Barrero", tipo: "poligono" },
  { nombre: "El Limero", tipo: "poligono" },
  { nombre: "El Mirador", tipo: "poligono" },
  { nombre: "Fuensanta-Virgen del Rocío", tipo: "poligono" },
  { nombre: "La Campiña", tipo: "poligono" },
  { nombre: "La Lagunilla", tipo: "poligono" },
  { nombre: "Los Tejares", tipo: "poligono" },
  { nombre: "Maza y Marín", tipo: "poligono" },
  { nombre: "Parque Industrial Sedesa", tipo: "poligono" },
  { nombre: "Quinta Machado", tipo: "poligono" },
  { nombre: "Polígono Villanueva del Rey", tipo: "poligono" },
];

const BARRIOS_LOS_PALACIOS: ZonaCiudad[] = [
  { nombre: "Barriada de las Flores", tipo: "barrio" },
  { nombre: "Barriada de las Suertes", tipo: "barrio" },
  { nombre: "Casco Histórico", tipo: "barrio" },
  { nombre: "Centro", tipo: "barrio" },
  { nombre: "Centro-Oeste", tipo: "barrio" },
  { nombre: "El Cuzco (urbanización)", tipo: "barrio" },
  { nombre: "El Pino (urbanización)", tipo: "barrio" },
  { nombre: "El Trobal", tipo: "barrio" },
  { nombre: "La Almazara", tipo: "barrio" },
  { nombre: "La Bodeguilla (urbanización)", tipo: "barrio" },
  { nombre: "La Nana", tipo: "barrio" },
  { nombre: "La Señuela (parcelaciones)", tipo: "barrio" },
  { nombre: "Las Dos Anitas (urbanización)", tipo: "barrio" },
  { nombre: "Las Nieves (urbanización)", tipo: "barrio" },
  { nombre: "Maribáñez", tipo: "barrio" },
  { nombre: "Villarubia", tipo: "barrio" },
];

const POLIGONOS_LOS_PALACIOS: ZonaCiudad[] = [
  { nombre: "Almudeyne", tipo: "poligono" },
  { nombre: "El Muro", tipo: "poligono" },
  { nombre: "El Pradillo", tipo: "poligono" },
  { nombre: "Polígono El Trobal", tipo: "poligono" },
  { nombre: "Los Chapatales", tipo: "poligono" },
  { nombre: "Polígono Maribáñez", tipo: "poligono" },
  { nombre: "Palenquivir (Parque Logístico Empresarial)", tipo: "poligono" },
  { nombre: "Santa Lucía", tipo: "poligono" },
];

const BARRIOS_CORIA: ZonaCiudad[] = [
  { nombre: "Barriada de Cuatro Caminos", tipo: "barrio" },
  { nombre: "Barriada de La Paz", tipo: "barrio" },
  { nombre: "Barrio del Guadalquivir", tipo: "barrio" },
  { nombre: "Buenavista", tipo: "barrio" },
  { nombre: "Casco Antiguo", tipo: "barrio" },
  { nombre: "Centro", tipo: "barrio" },
  { nombre: "La Hermandad", tipo: "barrio" },
  { nombre: "La Vega", tipo: "barrio" },
  { nombre: "Santa Isabel", tipo: "barrio" },
  { nombre: "Tixe", tipo: "barrio" },
  { nombre: "Urbanización Carramolos (Los Carramolos)", tipo: "barrio" },
  { nombre: "Urbanización Hoyo del Duende", tipo: "barrio" },
  { nombre: "Urbanización Ugena", tipo: "barrio" },
];

const POLIGONOS_CORIA: ZonaCiudad[] = [
  { nombre: "Polígono Industrial Coria", tipo: "poligono" },
  { nombre: "Polígono Industrial El Rocío", tipo: "poligono" },
  { nombre: "Polígono Industrial La Estrella", tipo: "poligono" },
  { nombre: "Polígono Industrial La Ladrillera", tipo: "poligono" },
];

const BARRIOS_CARMONA: ZonaCiudad[] = [
  { nombre: "Alcázar de Arriba", tipo: "barrio" },
  { nombre: "Anfiteatro", tipo: "barrio" },
  { nombre: "Barrio de Arriba", tipo: "barrio" },
  { nombre: "Barrio de San Blas", tipo: "barrio" },
  { nombre: "Barrio de San Felipe", tipo: "barrio" },
  { nombre: "Barrio de Santiago", tipo: "barrio" },
  { nombre: "Buenavista", tipo: "barrio" },
  { nombre: "Camposol", tipo: "barrio" },
  { nombre: "Cantera Chica", tipo: "barrio" },
  { nombre: "El Almendral", tipo: "barrio" },
  { nombre: "El Cerrillo", tipo: "barrio" },
  { nombre: "El Corzo", tipo: "barrio" },
  { nombre: "El Real", tipo: "barrio" },
  { nombre: "El Socorro", tipo: "barrio" },
  { nombre: "Frutales del Alcor", tipo: "barrio" },
  { nombre: "Guadajoz", tipo: "barrio" },
  { nombre: "Huerta Nueva", tipo: "barrio" },
  { nombre: "La Barca", tipo: "barrio" },
  { nombre: "La Calera", tipo: "barrio" },
  { nombre: "La Celada", tipo: "barrio" },
  { nombre: "La Cierva", tipo: "barrio" },
  { nombre: "La Baronesa", tipo: "barrio" },
  { nombre: "La Necrópolis", tipo: "barrio" },
  { nombre: "Las Monjas", tipo: "barrio" },
  { nombre: "Las Palmas", tipo: "barrio" },
  { nombre: "Los Jinetes", tipo: "barrio" },
  { nombre: "Los Nietos", tipo: "barrio" },
  { nombre: "Los Pinos de la Algabarra", tipo: "barrio" },
  { nombre: "Los Villas", tipo: "barrio" },
  { nombre: "Matallana (Virgen del Rocío)", tipo: "barrio" },
  { nombre: "Pino Grande", tipo: "barrio" },
  { nombre: "Pradollano", tipo: "barrio" },
  { nombre: "Residencial Norte", tipo: "barrio" },
  { nombre: "San Francisco", tipo: "barrio" },
  { nombre: "Santa Fe", tipo: "barrio" },
  { nombre: "Torrelaguna", tipo: "barrio" },
  { nombre: "Villarosa", tipo: "barrio" },
];

const POLIGONOS_CARMONA: ZonaCiudad[] = [
  { nombre: "Brenes", tipo: "poligono" },
  { nombre: "El Pilero", tipo: "poligono" },
  { nombre: "Hytasa", tipo: "poligono" },
  { nombre: "Parque Logístico de Carmona", tipo: "poligono" },
  { nombre: "Parque Logístico e Industrial de Carmona", tipo: "poligono" },
];

const BARRIOS_MALAGA: ZonaCiudad[] = [
  { nombre: "25 Años de Paz", tipo: "barrio" },
  { nombre: "26 de Febrero", tipo: "barrio" },
  { nombre: "503 Viviendas", tipo: "barrio" },
  { nombre: "7200 Viviendas", tipo: "barrio" },
  { nombre: "Aeropuerto Base Aérea", tipo: "barrio" },
  { nombre: "Alegría de la Huerta", tipo: "barrio" },
  { nombre: "Alcalde Díaz Zafra", tipo: "barrio" },
  { nombre: "Arroyo de los Ángeles", tipo: "barrio" },
  { nombre: "Arroyo España", tipo: "barrio" },
  { nombre: "Atabal Este", tipo: "barrio" },
  { nombre: "Ave María", tipo: "barrio" },
  { nombre: "Baños del Carmen", tipo: "barrio" },
  { nombre: "Barcenillas", tipo: "barrio" },
  { nombre: "Bellavista", tipo: "barrio" },
  { nombre: "Buenavista", tipo: "barrio" },
  { nombre: "Camino del Colmenar", tipo: "barrio" },
  { nombre: "Campos Elíseos", tipo: "barrio" },
  { nombre: "Carlinda", tipo: "barrio" },
  { nombre: "Carranque", tipo: "barrio" },
  { nombre: "Castillo de Santa Catalina", tipo: "barrio" },
  { nombre: "Cerrado de Calderón", tipo: "barrio" },
  { nombre: "Churriana", tipo: "barrio" },
  { nombre: "Ciudad Jardín", tipo: "barrio" },
  { nombre: "Clavero", tipo: "barrio" },
  { nombre: "Conde de Ureña", tipo: "barrio" },
  { nombre: "Cortijo Alto", tipo: "barrio" },
  { nombre: "Cortijo Bazán", tipo: "barrio" },
  { nombre: "Cortijo de Mazas", tipo: "barrio" },
  { nombre: "Cortijo de Torres", tipo: "barrio" },
  { nombre: "Cortijo Vallejo", tipo: "barrio" },
  { nombre: "Cruz del Humilladero", tipo: "barrio" },
  { nombre: "Cristo de la Epidemia", tipo: "barrio" },
  { nombre: "Dos Hermanas", tipo: "barrio" },
  { nombre: "Echeverría del Palo", tipo: "barrio" },
  { nombre: "El Atabal", tipo: "barrio" },
  { nombre: "El Bulto", tipo: "barrio" },
  { nombre: "El Candado", tipo: "barrio" },
  { nombre: "El Chaparral", tipo: "barrio" },
  { nombre: "El Chanquete", tipo: "barrio" },
  { nombre: "El Coronel", tipo: "barrio" },
  { nombre: "El Cuartón", tipo: "barrio" },
  { nombre: "El Duende", tipo: "barrio" },
  { nombre: "El Drago", tipo: "barrio" },
  { nombre: "El Ejido", tipo: "barrio" },
  { nombre: "El Higueral", tipo: "barrio" },
  { nombre: "El Limonar", tipo: "barrio" },
  { nombre: "El Mayorazgo", tipo: "barrio" },
  { nombre: "El Molinillo", tipo: "barrio" },
  { nombre: "El Morlaco", tipo: "barrio" },
  { nombre: "El Olivar", tipo: "barrio" },
  { nombre: "El Palo", tipo: "barrio" },
  { nombre: "El Polvorín", tipo: "barrio" },
  { nombre: "El Rocío", tipo: "barrio" },
  { nombre: "El Tomillar", tipo: "barrio" },
  { nombre: "El Torcal", tipo: "barrio" },
  { nombre: "El Viso", tipo: "barrio" },
  { nombre: "Ensanche Centro", tipo: "barrio" },
  { nombre: "Explanada de la Estación", tipo: "barrio" },
  { nombre: "Florisol", tipo: "barrio" },
  { nombre: "Fuente Alegre", tipo: "barrio" },
  { nombre: "Gamarra", tipo: "barrio" },
  { nombre: "Guadalmar", tipo: "barrio" },
  { nombre: "Hacienda Altamira", tipo: "barrio" },
  { nombre: "Hacienda Cabello", tipo: "barrio" },
  { nombre: "Hacienda Clavero", tipo: "barrio" },
  { nombre: "Hacienda Los Montes", tipo: "barrio" },
  { nombre: "Hacienda Miramar", tipo: "barrio" },
  { nombre: "Hacienda Paredes", tipo: "barrio" },
  { nombre: "Haza Carpintero", tipo: "barrio" },
  { nombre: "Haza Cuevas", tipo: "barrio" },
  { nombre: "Haza del Campillo", tipo: "barrio" },
  { nombre: "Haza Onda", tipo: "barrio" },
  { nombre: "Herrera Oria", tipo: "barrio" },
  { nombre: "Huelin", tipo: "barrio" },
  { nombre: "Huerta Nueva", tipo: "barrio" },
  { nombre: "Jardín de Málaga", tipo: "barrio" },
  { nombre: "Jarazmín", tipo: "barrio" },
  { nombre: "La Alcubilla", tipo: "barrio" },
  { nombre: "La Araña", tipo: "barrio" },
  { nombre: "La Asunción", tipo: "barrio" },
  { nombre: "La Caleta", tipo: "barrio" },
  { nombre: "La Cañada de los Ingleses", tipo: "barrio" },
  { nombre: "La Cizaña", tipo: "barrio" },
  { nombre: "La Florida", tipo: "barrio" },
  { nombre: "La Goleta", tipo: "barrio" },
  { nombre: "La Luz", tipo: "barrio" },
  { nombre: "La Malagueta", tipo: "barrio" },
  { nombre: "La Manía", tipo: "barrio" },
  { nombre: "La Merced", tipo: "barrio" },
  { nombre: "La Mosca", tipo: "barrio" },
  { nombre: "La Palma", tipo: "barrio" },
  { nombre: "La Palmilla", tipo: "barrio" },
  { nombre: "La Paz", tipo: "barrio" },
  { nombre: "La Pelusa", tipo: "barrio" },
  { nombre: "La Pelusilla", tipo: "barrio" },
  { nombre: "La Princesa", tipo: "barrio" },
  { nombre: "La Roca", tipo: "barrio" },
  { nombre: "La Trinidad", tipo: "barrio" },
  { nombre: "La Unión", tipo: "barrio" },
  { nombre: "La Victoria", tipo: "barrio" },
  { nombre: "Lagunillas", tipo: "barrio" },
  { nombre: "Las Acacias", tipo: "barrio" },
  { nombre: "Las Chapas", tipo: "barrio" },
  { nombre: "Las Delicias", tipo: "barrio" },
  { nombre: "Las Flores", tipo: "barrio" },
  { nombre: "Las Morillas", tipo: "barrio" },
  { nombre: "Las Palmeras", tipo: "barrio" },
  { nombre: "Las Virreinas", tipo: "barrio" },
  { nombre: "Los Almendros", tipo: "barrio" },
  { nombre: "Los Antonios", tipo: "barrio" },
  { nombre: "Los Castillejos", tipo: "barrio" },
  { nombre: "Los Cipreses", tipo: "barrio" },
  { nombre: "Los Guindos", tipo: "barrio" },
  { nombre: "Los Millones", tipo: "barrio" },
  { nombre: "Los Naranjos", tipo: "barrio" },
  { nombre: "Los Paseros", tipo: "barrio" },
  { nombre: "Los Pinos", tipo: "barrio" },
  { nombre: "Los Prados", tipo: "barrio" },
  { nombre: "Los Tilos", tipo: "barrio" },
  { nombre: "Los Viveros", tipo: "barrio" },
  { nombre: "Mangas Verdes", tipo: "barrio" },
  { nombre: "Mármoles", tipo: "barrio" },
  { nombre: "Martiricos", tipo: "barrio" },
  { nombre: "Miraflores", tipo: "barrio" },
  { nombre: "Miraflores Alto", tipo: "barrio" },
  { nombre: "Miraflores de los Ángeles", tipo: "barrio" },
  { nombre: "Miraflores del Palo", tipo: "barrio" },
  { nombre: "Miramar", tipo: "barrio" },
  { nombre: "Miramar del Palo", tipo: "barrio" },
  { nombre: "Monte de Gibralfaro", tipo: "barrio" },
  { nombre: "Monte Dorado", tipo: "barrio" },
  { nombre: "Monte Sancha", tipo: "barrio" },
  { nombre: "Nueva Málaga", tipo: "barrio" },
  { nombre: "Olías", tipo: "barrio" },
  { nombre: "Olletas", tipo: "barrio" },
  { nombre: "Parque Clavero", tipo: "barrio" },
  { nombre: "Parque Mediterráneo", tipo: "barrio" },
  { nombre: "Parque del Sur", tipo: "barrio" },
  { nombre: "Parque Victoria Eugenia", tipo: "barrio" },
  { nombre: "Pedregalejo", tipo: "barrio" },
  { nombre: "Pedregalejo Playa", tipo: "barrio" },
  { nombre: "Perchel Norte", tipo: "barrio" },
  { nombre: "Perchel Sur", tipo: "barrio" },
  { nombre: "Pinares de Olletas", tipo: "barrio" },
  { nombre: "Pinares de San Antón", tipo: "barrio" },
  { nombre: "Playa Virginia", tipo: "barrio" },
  { nombre: "Playas del Palo", tipo: "barrio" },
  { nombre: "Portada Alta", tipo: "barrio" },
  { nombre: "Puerta Blanca", tipo: "barrio" },
  { nombre: "Puerto de la Torre", tipo: "barrio" },
  { nombre: "Puertosol", tipo: "barrio" },
  { nombre: "Sacaba Beach", tipo: "barrio" },
  { nombre: "Sagrada Familia", tipo: "barrio" },
  { nombre: "San Andrés", tipo: "barrio" },
  { nombre: "San Alberto", tipo: "barrio" },
  { nombre: "San Alberto II", tipo: "barrio" },
  { nombre: "San Felipe Neri", tipo: "barrio" },
  { nombre: "San Francisco", tipo: "barrio" },
  { nombre: "San Isidro", tipo: "barrio" },
  { nombre: "San José", tipo: "barrio" },
  { nombre: "San Martín", tipo: "barrio" },
  { nombre: "San Miguel", tipo: "barrio" },
  { nombre: "Santa Amalia", tipo: "barrio" },
  { nombre: "Santa Cristina", tipo: "barrio" },
  { nombre: "Santa Isabel", tipo: "barrio" },
  { nombre: "Santa Julia", tipo: "barrio" },
  { nombre: "Santa Marta", tipo: "barrio" },
  { nombre: "Santa Paula-Miramar", tipo: "barrio" },
  { nombre: "Segalerva", tipo: "barrio" },
  { nombre: "Sierra Blanquilla", tipo: "barrio" },
  { nombre: "Suárez", tipo: "barrio" },
  { nombre: "Tabacalera", tipo: "barrio" },
  { nombre: "Tiro de Pichón", tipo: "barrio" },
  { nombre: "Torre de San Telmo", tipo: "barrio" },
  { nombre: "Torre del Río", tipo: "barrio" },
  { nombre: "Torres de la Serna", tipo: "barrio" },
  { nombre: "Valle de los Galanes", tipo: "barrio" },
  { nombre: "Ventaja Alta", tipo: "barrio" },
  { nombre: "Virgen de las Angustias", tipo: "barrio" },
  { nombre: "Virgen del Carmen", tipo: "barrio" },
  { nombre: "Vistafranca", tipo: "barrio" },
];

const POLIGONOS_MALAGA: ZonaCiudad[] = [
  { nombre: "Amoniaco", tipo: "poligono" },
  { nombre: "El Álamo", tipo: "poligono" },
  { nombre: "El Tarajal", tipo: "poligono" },
  { nombre: "Polígono El Viso", tipo: "poligono" },
  { nombre: "Guadalhorce", tipo: "poligono" },
  { nombre: "Guadaljaire", tipo: "poligono" },
  { nombre: "Haza Augusta", tipo: "poligono" },
  { nombre: "Haza de la Cruz", tipo: "poligono" },
  { nombre: "Haza Angosta", tipo: "poligono" },
  { nombre: "Intelhorce", tipo: "poligono" },
  { nombre: "La Azucarera", tipo: "poligono" },
  { nombre: "La Estrella", tipo: "poligono" },
  { nombre: "La Huertecilla", tipo: "poligono" },
  { nombre: "Polígono La Pelusa", tipo: "poligono" },
  { nombre: "Mi Málaga", tipo: "poligono" },
  { nombre: "Pérez Texeira", tipo: "poligono" },
  { nombre: "Pilar del Prado", tipo: "poligono" },
  { nombre: "Polígono Alameda", tipo: "poligono" },
  { nombre: "Polígono Carranza", tipo: "poligono" },
  { nombre: "Polígono de Cártama", tipo: "poligono" },
  { nombre: "Polígono Ordoñez", tipo: "poligono" },
  { nombre: "Polígono Ronda Exterior", tipo: "poligono" },
  { nombre: "Polígono San Luis", tipo: "poligono" },
  { nombre: "Polígono Valdicio", tipo: "poligono" },
  { nombre: "Santa Bárbara", tipo: "poligono" },
  { nombre: "Santa Cruz", tipo: "poligono" },
  { nombre: "Santa Teresa", tipo: "poligono" },
  { nombre: "Trevénez", tipo: "poligono" },
  { nombre: "Villa Rosa", tipo: "poligono" },
  { nombre: "Centro de Transporte de Mercancías", tipo: "poligono" },
  { nombre: "Parque Empresarial Alameda", tipo: "poligono" },
  { nombre: "Parque Empresarial Guadalhorce", tipo: "poligono" },
  { nombre: "Parque Empresarial San Luis", tipo: "poligono" },
  { nombre: "Parque Empresarial Santa Cruz", tipo: "poligono" },
  { nombre: "Parque Empresarial Santa Teresa", tipo: "poligono" },
  { nombre: "Parque Empresarial El Viso", tipo: "poligono" },
  { nombre: "Parque Tecnológico de Andalucía (PTA)", tipo: "poligono" },
  { nombre: "Parque Empresarial Azucarera", tipo: "poligono" },
  { nombre: "Mercamálaga", tipo: "poligono" },
];

const BARRIOS_MARBELLA: ZonaCiudad[] = [
  { nombre: "Albarizas", tipo: "barrio" },
  { nombre: "Alcántara", tipo: "barrio" },
  { nombre: "Alicate", tipo: "barrio" },
  { nombre: "Altos de Marbella", tipo: "barrio" },
  { nombre: "Artola", tipo: "barrio" },
  { nombre: "Arroyo Primero", tipo: "barrio" },
  { nombre: "Artola Alta", tipo: "barrio" },
  { nombre: "Bahía de Marbella", tipo: "barrio" },
  { nombre: "Barrio Alto", tipo: "barrio" },
  { nombre: "Bello Horizonte", tipo: "barrio" },
  { nombre: "Cabopino", tipo: "barrio" },
  { nombre: "Calvario", tipo: "barrio" },
  { nombre: "Camoján", tipo: "barrio" },
  { nombre: "Cascada de Camoján", tipo: "barrio" },
  { nombre: "Casco Antiguo de Marbella", tipo: "barrio" },
  { nombre: "Costabella", tipo: "barrio" },
  { nombre: "Cortijo Blanco", tipo: "barrio" },
  { nombre: "Divina Pastora", tipo: "barrio" },
  { nombre: "El Ángel", tipo: "barrio" },
  { nombre: "El Barrio", tipo: "barrio" },
  { nombre: "El Capricho", tipo: "barrio" },
  { nombre: "El Ingenio", tipo: "barrio" },
  { nombre: "Elviria", tipo: "barrio" },
  { nombre: "Fuente Nueva", tipo: "barrio" },
  { nombre: "Guadalmina Alta", tipo: "barrio" },
  { nombre: "Guadalmina Baja", tipo: "barrio" },
  { nombre: "Hacienda Las Chapas", tipo: "barrio" },
  { nombre: "Huerta Belón", tipo: "barrio" },
  { nombre: "La Campana", tipo: "barrio" },
  { nombre: "La Carolina", tipo: "barrio" },
  { nombre: "La Milla de Oro", tipo: "barrio" },
  { nombre: "La Patera", tipo: "barrio" },
  { nombre: "La Torrecilla", tipo: "barrio" },
  { nombre: "Las Chapas", tipo: "barrio" },
  { nombre: "Las Lomas", tipo: "barrio" },
  { nombre: "Las Medranas", tipo: "barrio" },
  { nombre: "Las Petunias", tipo: "barrio" },
  { nombre: "Linda Vista", tipo: "barrio" },
  { nombre: "Lomas de Marbella Club", tipo: "barrio" },
  { nombre: "Los Monteros", tipo: "barrio" },
  { nombre: "Los Naranjos", tipo: "barrio" },
  { nombre: "Los Pacos", tipo: "barrio" },
  { nombre: "Marbella Centro", tipo: "barrio" },
  { nombre: "Marbella Este", tipo: "barrio" },
  { nombre: "Marbella Oeste", tipo: "barrio" },
  { nombre: "Marbesa", tipo: "barrio" },
  { nombre: "Miraflores", tipo: "barrio" },
  { nombre: "Nagüeles", tipo: "barrio" },
  { nombre: "Nueva Alcántara", tipo: "barrio" },
  { nombre: "Nueva Andalucía", tipo: "barrio" },
  { nombre: "Nueva Campana", tipo: "barrio" },
  { nombre: "Nueva Marbella", tipo: "barrio" },
  { nombre: "Palo Alto", tipo: "barrio" },
  { nombre: "Parque de Nagüeles", tipo: "barrio" },
  { nombre: "Puerto Banús", tipo: "barrio" },
  { nombre: "Puya", tipo: "barrio" },
  { nombre: "Río Real", tipo: "barrio" },
  { nombre: "Rodeo Alto", tipo: "barrio" },
  { nombre: "San Pedro Alcántara", tipo: "barrio" },
  { nombre: "Santa Marta", tipo: "barrio" },
  { nombre: "Sierra Blanca", tipo: "barrio" },
  { nombre: "Trapiche", tipo: "barrio" },
  { nombre: "Valdeolletas", tipo: "barrio" },
  { nombre: "Xarblanca", tipo: "barrio" },
  { nombre: "Alhambra del Mar", tipo: "barrio" },
  { nombre: "Alta Vista", tipo: "barrio" },
  { nombre: "Altos Reales", tipo: "barrio" },
  { nombre: "Ancón", tipo: "barrio" },
  { nombre: "Andasol", tipo: "barrio" },
  { nombre: "Arroyo de las Casas", tipo: "barrio" },
  { nombre: "Arroyo de las Piedras", tipo: "barrio" },
  { nombre: "Arroyo de Nagüeles", tipo: "barrio" },
  { nombre: "Arroyo Segundo", tipo: "barrio" },
  { nombre: "Artola Baja", tipo: "barrio" },
  { nombre: "Atalaya Río Verde", tipo: "barrio" },
  { nombre: "Balcones de Sierra Blanca", tipo: "barrio" },
  { nombre: "Balcón de San Pedro", tipo: "barrio" },
  { nombre: "Bello Horizonte I", tipo: "barrio" },
  { nombre: "Bello Horizonte II", tipo: "barrio" },
  { nombre: "Bello Horizonte III", tipo: "barrio" },
  { nombre: "Bosquemar", tipo: "barrio" },
  { nombre: "Casablanca", tipo: "barrio" },
  { nombre: "Centro Marbella", tipo: "barrio" },
  { nombre: "Cerro del Espartal", tipo: "barrio" },
  { nombre: "Cerrado de Elviria", tipo: "barrio" },
  { nombre: "Ciudad Jardín", tipo: "barrio" },
  { nombre: "Ciudad Internacional", tipo: "barrio" },
  { nombre: "Conde de Iza", tipo: "barrio" },
  { nombre: "Coral Beach", tipo: "barrio" },
  { nombre: "Cortijo de Nagüelles", tipo: "barrio" },
  { nombre: "Costa Bella", tipo: "barrio" },
  { nombre: "Coto de los Dolores", tipo: "barrio" },
  { nombre: "Cuatro Vientos", tipo: "barrio" },
  { nombre: "El Barronal", tipo: "barrio" },
  { nombre: "El Cénit", tipo: "barrio" },
  { nombre: "El Cruce", tipo: "barrio" },
  { nombre: "El Gamonal", tipo: "barrio" },
  { nombre: "El Mirador", tipo: "barrio" },
  { nombre: "El Olivar", tipo: "barrio" },
  { nombre: "El Real", tipo: "barrio" },
  { nombre: "El Real de Zaragoza", tipo: "barrio" },
  { nombre: "El Rocío", tipo: "barrio" },
  { nombre: "El Trapiche", tipo: "barrio" },
  { nombre: "Ensanche Sur", tipo: "barrio" },
  { nombre: "Francisco Norte", tipo: "barrio" },
  { nombre: "Fuentes del Rodeo", tipo: "barrio" },
  { nombre: "Golf de Río Real", tipo: "barrio" },
  { nombre: "Golden Beach", tipo: "barrio" },
  { nombre: "Guadalmar", tipo: "barrio" },
  { nombre: "Guadaiza", tipo: "barrio" },
  { nombre: "Hacienda Cortés", tipo: "barrio" },
  { nombre: "Haza del Conde", tipo: "barrio" },
  { nombre: "Hispania", tipo: "barrio" },
  { nombre: "Holanducía", tipo: "barrio" },
  { nombre: "Huerta de los Cristales", tipo: "barrio" },
  { nombre: "Huerta del Café", tipo: "barrio" },
  { nombre: "Huerta del Prado", tipo: "barrio" },
  { nombre: "La Alcazaba", tipo: "barrio" },
  { nombre: "La Alzambra", tipo: "barrio" },
  { nombre: "La Bajadilla", tipo: "barrio" },
  { nombre: "La Cantera", tipo: "barrio" },
  { nombre: "La Caridad", tipo: "barrio" },
  { nombre: "La Coneja", tipo: "barrio" },
  { nombre: "La Dama de Noche", tipo: "barrio" },
  { nombre: "La Merced", tipo: "barrio" },
  { nombre: "La Montúa", tipo: "barrio" },
  { nombre: "La Pavona Real", tipo: "barrio" },
  { nombre: "La Paz", tipo: "barrio" },
  { nombre: "La Pepina", tipo: "barrio" },
  { nombre: "La Virginia", tipo: "barrio" },
  { nombre: "Las Albarizas", tipo: "barrio" },
  { nombre: "Las Cancelas", tipo: "barrio" },
  { nombre: "Las Cañas Beach", tipo: "barrio" },
  { nombre: "Las Cumbres de Elviria", tipo: "barrio" },
  { nombre: "Las Mimosas", tipo: "barrio" },
  { nombre: "Las Palmas", tipo: "barrio" },
  { nombre: "Las Torres", tipo: "barrio" },
  { nombre: "Lindasol", tipo: "barrio" },
  { nombre: "Linda Vista Alta", tipo: "barrio" },
  { nombre: "Linda Vista Norte", tipo: "barrio" },
  { nombre: "Linda Vista Playa", tipo: "barrio" },
  { nombre: "Llanos de San Ramón", tipo: "barrio" },
  { nombre: "Lomas de Río Verde", tipo: "barrio" },
  { nombre: "Lomas del Pozuelo", tipo: "barrio" },
  { nombre: "Lomas del Puerto", tipo: "barrio" },
  { nombre: "Lomas del Virrey", tipo: "barrio" },
  { nombre: "Los Altos de Marbella", tipo: "barrio" },
  { nombre: "Los Ángeles", tipo: "barrio" },
  { nombre: "Los Catalanes", tipo: "barrio" },
  { nombre: "Los Magnolios", tipo: "barrio" },
  { nombre: "Los Pinos", tipo: "barrio" },
  { nombre: "Los Pinos del Ángel", tipo: "barrio" },
  { nombre: "Los Porqueroles", tipo: "barrio" },
  { nombre: "Los Verdiales", tipo: "barrio" },
  { nombre: "Lunamar", tipo: "barrio" },
  { nombre: "Marbella Club", tipo: "barrio" },
  { nombre: "Marbella del Este", tipo: "barrio" },
  { nombre: "Marbella Mar", tipo: "barrio" },
  { nombre: "Marbella-Sierra Blanca", tipo: "barrio" },
  { nombre: "Marqués del Duero", tipo: "barrio" },
  { nombre: "Molino de Viento", tipo: "barrio" },
  { nombre: "Montecarlo", tipo: "barrio" },
  { nombre: "Monte Paraiso", tipo: "barrio" },
  { nombre: "Palm Beach", tipo: "barrio" },
  { nombre: "Peñuelas", tipo: "barrio" },
  { nombre: "Pinar de las Chapas", tipo: "barrio" },
  { nombre: "Pinomar", tipo: "barrio" },
  { nombre: "Playa del Arenal", tipo: "barrio" },
  { nombre: "Playas Andaluzas", tipo: "barrio" },
  { nombre: "Playas Españolas", tipo: "barrio" },
  { nombre: "Plaza de Toros", tipo: "barrio" },
  { nombre: "Puente Romano", tipo: "barrio" },
  { nombre: "Puerta del Mar", tipo: "barrio" },
  { nombre: "Rancho Hotel", tipo: "barrio" },
  { nombre: "Rancho Wellington", tipo: "barrio" },
  { nombre: "Reserva de los Monteros", tipo: "barrio" },
  { nombre: "La Reserva de Marbella I", tipo: "barrio" },
  { nombre: "La Reserva de Marbella II", tipo: "barrio" },
  { nombre: "Residencial Tiempo Libre", tipo: "barrio" },
  { nombre: "Ricmar", tipo: "barrio" },
  { nombre: "Río Verde Playa", tipo: "barrio" },
  { nombre: "Rocío de Nagüeles", tipo: "barrio" },
  { nombre: "Salto del Agua", tipo: "barrio" },
  { nombre: "San Antonio", tipo: "barrio" },
  { nombre: "San Bernabé", tipo: "barrio" },
  { nombre: "San Enrique", tipo: "barrio" },
  { nombre: "San Francisco", tipo: "barrio" },
  { nombre: "San José", tipo: "barrio" },
  { nombre: "Santa Clara", tipo: "barrio" },
  { nombre: "Santa Margarita", tipo: "barrio" },
  { nombre: "Santa María", tipo: "barrio" },
  { nombre: "Señorío de Marbella", tipo: "barrio" },
  { nombre: "Supermanzana A", tipo: "barrio" },
  { nombre: "Supermanzana B", tipo: "barrio" },
  { nombre: "Supermanzana C", tipo: "barrio" },
  { nombre: "Supermanzana D", tipo: "barrio" },
  { nombre: "Supermanzana F", tipo: "barrio" },
  { nombre: "Supermanzana G", tipo: "barrio" },
  { nombre: "Supermanzana H", tipo: "barrio" },
  { nombre: "Supermanzana J-K-L", tipo: "barrio" },
  { nombre: "Tiro Pichón", tipo: "barrio" },
  { nombre: "Torres Murciano", tipo: "barrio" },
  { nombre: "Trading Finca", tipo: "barrio" },
  { nombre: "Valle del Sol", tipo: "barrio" },
  { nombre: "Ventura del Mar", tipo: "barrio" },
  { nombre: "Ventevació", tipo: "barrio" },
  { nombre: "Villa Parra", tipo: "barrio" },
  { nombre: "Virgen del Pilar", tipo: "barrio" },
  { nombre: "Vistamar", tipo: "barrio" },
];

const POLIGONOS_MARBELLA: ZonaCiudad[] = [
  { nombre: "Costa del Sol", tipo: "poligono" },
  { nombre: "Polígono Elviria", tipo: "poligono" },
  { nombre: "Incomar", tipo: "poligono" },
  { nombre: "Polígono La Campana", tipo: "poligono" },
  { nombre: "La Ermita", tipo: "poligono" },
  { nombre: "La Quinta", tipo: "poligono" },
  { nombre: "Polígono Las Albarizas", tipo: "poligono" },
  { nombre: "Polígono Nueva Campana", tipo: "poligono" },
  { nombre: "San Pedro de Alcántara", tipo: "poligono" },
];

const BARRIOS_MIJAS: ZonaCiudad[] = [
  { nombre: "Alvar", tipo: "barrio" },
  { nombre: "El Cañadón", tipo: "barrio" },
  { nombre: "El Sierrezuela", tipo: "barrio" },
  { nombre: "Esparragales", tipo: "barrio" },
  { nombre: "Las Lomas de Mijas Golf", tipo: "barrio" },
  { nombre: "Las Yucas", tipo: "barrio" },
  { nombre: "Los Espartales", tipo: "barrio" },
  { nombre: "Alcaparra, La", tipo: "barrio" },
  { nombre: "Alquería, La", tipo: "barrio" },
  { nombre: "Altaverde", tipo: "barrio" },
  { nombre: "Arroyo de la Cala", tipo: "barrio" },
  { nombre: "Arroyo de las Palmas", tipo: "barrio" },
  { nombre: "Arroyo Real", tipo: "barrio" },
  { nombre: "Buenavista", tipo: "barrio" },
  { nombre: "Buganvillas", tipo: "barrio" },
  { nombre: "Cala Golf", tipo: "barrio" },
  { nombre: "Calahonda", tipo: "barrio" },
  { nombre: "Calahonda Royale", tipo: "barrio" },
  { nombre: "Calypso", tipo: "barrio" },
  { nombre: "Campo Mijas", tipo: "barrio" },
  { nombre: "Casafuerte", tipo: "barrio" },
  { nombre: "Cerros del Águila", tipo: "barrio" },
  { nombre: "Cerrado de Elviria", tipo: "barrio" },
  { nombre: "Chaparral", tipo: "barrio" },
  { nombre: "Chaparral de la Condesa", tipo: "barrio" },
  { nombre: "Cielo Mijas", tipo: "barrio" },
  { nombre: "Colinas de la Cala", tipo: "barrio" },
  { nombre: "Cosmópolis", tipo: "barrio" },
  { nombre: "Cortijo Calahonda Norte", tipo: "barrio" },
  { nombre: "Cortijo Calahonda Sur", tipo: "barrio" },
  { nombre: "Cortijo Chico", tipo: "barrio" },
  { nombre: "Doña Lola", tipo: "barrio" },
  { nombre: "Doña Pilar", tipo: "barrio" },
  { nombre: "El Bombo", tipo: "barrio" },
  { nombre: "El Coto", tipo: "barrio" },
  { nombre: "El Faro", tipo: "barrio" },
  { nombre: "El Faro de Calaburras", tipo: "barrio" },
  { nombre: "El Hornillo", tipo: "barrio" },
  { nombre: "El Juncal", tipo: "barrio" },
  { nombre: "El Lagarejo", tipo: "barrio" },
  { nombre: "El Olivar", tipo: "barrio" },
  { nombre: "El Puerto", tipo: "barrio" },
  { nombre: "Entrerríos", tipo: "barrio" },
  { nombre: "Espartales", tipo: "barrio" },
  { nombre: "Esmeralda", tipo: "barrio" },
  { nombre: "Finca Ana María", tipo: "barrio" },
  { nombre: "Finca Calahonda", tipo: "barrio" },
  { nombre: "Finca El Jinete", tipo: "barrio" },
  { nombre: "Finca Mi Capricho", tipo: "barrio" },
  { nombre: "Haza del Algarrobo", tipo: "barrio" },
  { nombre: "Huerta Alta", tipo: "barrio" },
  { nombre: "Huerta San Antonio", tipo: "barrio" },
  { nombre: "Jarales de Alhamar", tipo: "barrio" },
  { nombre: "La Cala de Mijas", tipo: "barrio" },
  { nombre: "La Capellanía", tipo: "barrio" },
  { nombre: "La Cortijera", tipo: "barrio" },
  { nombre: "La Esperanza", tipo: "barrio" },
  { nombre: "La Loma", tipo: "barrio" },
  { nombre: "La Noria", tipo: "barrio" },
  { nombre: "La Ponderosa", tipo: "barrio" },
  { nombre: "La Sierrezuela", tipo: "barrio" },
  { nombre: "La Torre", tipo: "barrio" },
  { nombre: "Las Adelfas", tipo: "barrio" },
  { nombre: "Las Farolas", tipo: "barrio" },
  { nombre: "Las Lagunas", tipo: "barrio" },
  { nombre: "Las Lomas de Mijas", tipo: "barrio" },
  { nombre: "Las Mimosas", tipo: "barrio" },
  { nombre: "Las Muñequeras", tipo: "barrio" },
  { nombre: "Las Terrazas", tipo: "barrio" },
  { nombre: "Los Claveles", tipo: "barrio" },
  { nombre: "Media Legua", tipo: "barrio" },
  { nombre: "Miraflores", tipo: "barrio" },
  { nombre: "Mijas Golf", tipo: "barrio" },
  { nombre: "Mijas La Nueva", tipo: "barrio" },
  { nombre: "Mijas Pueblo", tipo: "barrio" },
  { nombre: "Moana", tipo: "barrio" },
  { nombre: "Osunillas", tipo: "barrio" },
  { nombre: "Peñablanquilla", tipo: "barrio" },
  { nombre: "Polarsol", tipo: "barrio" },
  { nombre: "Prado Marina", tipo: "barrio" },
  { nombre: "Puebla Aida", tipo: "barrio" },
  { nombre: "Puebla Tranquila", tipo: "barrio" },
  { nombre: "Pueblo La Campana", tipo: "barrio" },
  { nombre: "Pueblo Mijitas", tipo: "barrio" },
  { nombre: "Riviera del Sol", tipo: "barrio" },
  { nombre: "Rosa de Piedras", tipo: "barrio" },
  { nombre: "Santa Rosa", tipo: "barrio" },
  { nombre: "Sitio de Calahonda", tipo: "barrio" },
  { nombre: "Sitio de Valtocado", tipo: "barrio" },
  { nombre: "Solvillas", tipo: "barrio" },
  { nombre: "Torrenueva", tipo: "barrio" },
  { nombre: "Torreblanca del Sol", tipo: "barrio" },
  { nombre: "Valtocado", tipo: "barrio" },
  { nombre: "Vista Verde", tipo: "barrio" },
];

const POLIGONOS_MIJAS: ZonaCiudad[] = [
  { nombre: "Camino de Campanales", tipo: "poligono" },
  { nombre: "Carretera de Mijas-Fuengirola", tipo: "poligono" },
  { nombre: "Polígono Entrerríos", tipo: "poligono" },
  { nombre: "Polígono La Torre", tipo: "poligono" },
  { nombre: "La Vega", tipo: "poligono" },
  { nombre: "Los Perales", tipo: "poligono" },
  { nombre: "San Rafael", tipo: "poligono" },
];

const BARRIOS_VELEZ_MALAGA: ZonaCiudad[] = [
  { nombre: "Almayate Alto", tipo: "barrio" },
  { nombre: "Almayate Bajo", tipo: "barrio" },
  { nombre: "Almayate Costa", tipo: "barrio" },
  { nombre: "Benajarafe", tipo: "barrio" },
  { nombre: "Benajarafe Costa", tipo: "barrio" },
  { nombre: "Benajarafe Pueblo", tipo: "barrio" },
  { nombre: "Cajiz", tipo: "barrio" },
  { nombre: "Caleta de Vélez", tipo: "barrio" },
  { nombre: "Chilches", tipo: "barrio" },
  { nombre: "Chilches Costa", tipo: "barrio" },
  { nombre: "El Capitán", tipo: "barrio" },
  { nombre: "El Limonar", tipo: "barrio" },
  { nombre: "El Trapiche", tipo: "barrio" },
  { nombre: "Lagos", tipo: "barrio" },
  { nombre: "Mezquitilla", tipo: "barrio" },
  { nombre: "Playa del Capitán", tipo: "barrio" },
  { nombre: "Pueblo Nuevo de la Axarquía", tipo: "barrio" },
  { nombre: "Santa María", tipo: "barrio" },
  { nombre: "Torre del Mar", tipo: "barrio" },
  { nombre: "Triana", tipo: "barrio" },
  { nombre: "Valle-Niza", tipo: "barrio" },
  { nombre: "Vélez-Málaga (Casco Histórico)", tipo: "barrio" },
  { nombre: "Zona de Baviera Golf", tipo: "barrio" },
  { nombre: "Zona residencial El Truche", tipo: "barrio" },
  { nombre: "Zona residencial Finca Baviera", tipo: "barrio" },
];

const POLIGONOS_VELEZ_MALAGA: ZonaCiudad[] = [
  { nombre: "El Higueral", tipo: "poligono" },
  { nombre: "El Zamorano (Los Zamoranos)", tipo: "poligono" },
  { nombre: "Explanada de la Estación", tipo: "poligono" },
  { nombre: "La Mata", tipo: "poligono" },
  { nombre: "La Matita – El Olivarillo", tipo: "poligono" },
  { nombre: "La Pañoleta – Campiñuela", tipo: "poligono" },
  { nombre: "Parque Tecnoalimentario de Vélez-Málaga", tipo: "poligono" },
  { nombre: "Polígono Industrial Cajiz", tipo: "poligono" },
  { nombre: "Prado del Rey", tipo: "poligono" },
  { nombre: "Trops", tipo: "poligono" },
  { nombre: "Xarqui", tipo: "poligono" },
  { nombre: "Zona de Mercovélez", tipo: "poligono" },
];

const BARRIOS_FUENGIROLA: ZonaCiudad[] = [
  { nombre: "Carvajal", tipo: "barrio" },
  { nombre: "Centro", tipo: "barrio" },
  { nombre: "El Boquetillo", tipo: "barrio" },
  { nombre: "El Ejido", tipo: "barrio" },
  { nombre: "El Higuerón", tipo: "barrio" },
  { nombre: "La Campana", tipo: "barrio" },
  { nombre: "La Loma", tipo: "barrio" },
  { nombre: "Las Gaviotas", tipo: "barrio" },
  { nombre: "Las Yucas", tipo: "barrio" },
  { nombre: "Los Boliches", tipo: "barrio" },
  { nombre: "Los Núcleos", tipo: "barrio" },
  { nombre: "Los Pacos", tipo: "barrio" },
  { nombre: "Miramar", tipo: "barrio" },
  { nombre: "Pueblo López", tipo: "barrio" },
  { nombre: "Pueblo Lucía", tipo: "barrio" },
  { nombre: "San Cayetano", tipo: "barrio" },
  { nombre: "Torreblanca", tipo: "barrio" },
  { nombre: "Zona Puerto Deportivo", tipo: "barrio" },
  { nombre: "Zona Sohail", tipo: "barrio" },
  { nombre: "Zona Virgen del Carmen", tipo: "barrio" },
  { nombre: "Zona Yeseras", tipo: "barrio" },
  { nombre: "Colina Blanca", tipo: "barrio" },
  { nombre: "Higuerón West", tipo: "barrio" },
  { nombre: "La Reserva del Higuerón", tipo: "barrio" },
  { nombre: "Las Pérgolas", tipo: "barrio" },
  { nombre: "Puebla Blanca", tipo: "barrio" },
  { nombre: "Residencial Panorámica", tipo: "barrio" },
  { nombre: "Torreblanca del Sol", tipo: "barrio" },
];

const POLIGONOS_FUENGIROLA: ZonaCiudad[] = [
  { nombre: "Polígono Industrial La Morena", tipo: "poligono" },
  { nombre: "Polígono Industrial Las Salinas", tipo: "poligono" },
  { nombre: "Polígono Industrial Los Campanales", tipo: "poligono" },
  { nombre: "Polígono Industrial Rancho Hermoso", tipo: "poligono" },
  { nombre: "Polígono Industrial San Rafael", tipo: "poligono" },
];

const BARRIOS_ESTEPONA: ZonaCiudad[] = [
  { nombre: "Alcazaba Beach", tipo: "barrio" },
  { nombre: "Aldea del Sol", tipo: "barrio" },
  { nombre: "Altos de Antequera", tipo: "barrio" },
  { nombre: "Altos de Calancha", tipo: "barrio" },
  { nombre: "Altos de Estepona", tipo: "barrio" },
  { nombre: "Arena Beach", tipo: "barrio" },
  { nombre: "Arroyo Vaquero", tipo: "barrio" },
  { nombre: "Atalaya", tipo: "barrio" },
  { nombre: "Bahía Azul", tipo: "barrio" },
  { nombre: "Bahía Dorada", tipo: "barrio" },
  { nombre: "Bahía Doncella", tipo: "barrio" },
  { nombre: "Bahía de Estepona", tipo: "barrio" },
  { nombre: "Bel Air", tipo: "barrio" },
  { nombre: "Benamara", tipo: "barrio" },
  { nombre: "Benatalaya", tipo: "barrio" },
  { nombre: "Buenas Noches", tipo: "barrio" },
  { nombre: "Cancelada", tipo: "barrio" },
  { nombre: "Casasola", tipo: "barrio" },
  { nombre: "Centro", tipo: "barrio" },
  { nombre: "Costalita", tipo: "barrio" },
  { nombre: "Costa Natura", tipo: "barrio" },
  { nombre: "Diana", tipo: "barrio" },
  { nombre: "Diana Park", tipo: "barrio" },
  { nombre: "Dominion Beach", tipo: "barrio" },
  { nombre: "Don Pedro", tipo: "barrio" },
  { nombre: "El Campanario", tipo: "barrio" },
  { nombre: "El Coral", tipo: "barrio" },
  { nombre: "El Padrón", tipo: "barrio" },
  { nombre: "El Paraíso", tipo: "barrio" },
  { nombre: "El Pirata", tipo: "barrio" },
  { nombre: "El Presidente", tipo: "barrio" },
  { nombre: "El Velerín", tipo: "barrio" },
  { nombre: "Estepona Golf", tipo: "barrio" },
  { nombre: "Guadalobón", tipo: "barrio" },
  { nombre: "Guadalmansa", tipo: "barrio" },
  { nombre: "Hacienda del Sol", tipo: "barrio" },
  { nombre: "Isdabe", tipo: "barrio" },
  { nombre: "La Gaspara", tipo: "barrio" },
  { nombre: "La Lobilla", tipo: "barrio" },
  { nombre: "La Resina", tipo: "barrio" },
  { nombre: "Las Mesas", tipo: "barrio" },
  { nombre: "Las Salinas", tipo: "barrio" },
  { nombre: "Las Joyas", tipo: "barrio" },
  { nombre: "Las Lomas", tipo: "barrio" },
  { nombre: "Los Llanos", tipo: "barrio" },
  { nombre: "Los Reales", tipo: "barrio" },
  { nombre: "Mar y Sierra", tipo: "barrio" },
  { nombre: "Mirador de Estepona Hills", tipo: "barrio" },
  { nombre: "Moches", tipo: "barrio" },
  { nombre: "Nueva Atalaya", tipo: "barrio" },
  { nombre: "Nueva Milla de Oro", tipo: "barrio" },
  { nombre: "Parque Antena", tipo: "barrio" },
  { nombre: "Paraíso-Barronal", tipo: "barrio" },
  { nombre: "Playa Bella", tipo: "barrio" },
  { nombre: "Playa del Sol", tipo: "barrio" },
  { nombre: "Puerto Deportivo", tipo: "barrio" },
  { nombre: "Puerto Paraíso", tipo: "barrio" },
  { nombre: "Puerto Romano", tipo: "barrio" },
  { nombre: "Punta de la Doncella", tipo: "barrio" },
  { nombre: "Punta Plata", tipo: "barrio" },
  { nombre: "Rancho del Rocío", tipo: "barrio" },
  { nombre: "Saladillo", tipo: "barrio" },
  { nombre: "Saladavieja", tipo: "barrio" },
  { nombre: "Seghers", tipo: "barrio" },
  { nombre: "Selwo", tipo: "barrio" },
  { nombre: "Sierra Bermeja", tipo: "barrio" },
  { nombre: "Torre Bermeja", tipo: "barrio" },
  { nombre: "Torre de Guadalmansa", tipo: "barrio" },
  { nombre: "Valle Romano", tipo: "barrio" },
  { nombre: "Villacana", tipo: "barrio" },
];

const POLIGONOS_ESTEPONA: ZonaCiudad[] = [
  { nombre: "Polígono Industrial José Martín Méndez", tipo: "poligono" },
  { nombre: "Polígono Industrial Llanos del Negro", tipo: "poligono" },
  { nombre: "Polígono Industrial Ampliación de Llanos del Negro", tipo: "poligono" },
];

const BARRIOS_BENALMADENA: ZonaCiudad[] = [
  { nombre: "Arenal Golf", tipo: "barrio" },
  { nombre: "Arroyo de la Miel", tipo: "barrio" },
  { nombre: "Arroyo Hondo", tipo: "barrio" },
  { nombre: "Atalaya", tipo: "barrio" },
  { nombre: "Avenida de las Palmeras", tipo: "barrio" },
  { nombre: "Benalmádena Costa", tipo: "barrio" },
  { nombre: "Benalmádena Pueblo", tipo: "barrio" },
  { nombre: "Benalmar", tipo: "barrio" },
  { nombre: "Benalmádena Golf", tipo: "barrio" },
  { nombre: "Benamaina", tipo: "barrio" },
  { nombre: "Béjar", tipo: "barrio" },
  { nombre: "Bellavista", tipo: "barrio" },
  { nombre: "Bonanza", tipo: "barrio" },
  { nombre: "Capellanía (La)", tipo: "barrio" },
  { nombre: "Carola", tipo: "barrio" },
  { nombre: "Casablanca", tipo: "barrio" },
  { nombre: "Cortijo de Torrequebrada", tipo: "barrio" },
  { nombre: "El Higuerón", tipo: "barrio" },
  { nombre: "El Tomillar Alto", tipo: "barrio" },
  { nombre: "Finca Doña María", tipo: "barrio" },
  { nombre: "Hacienda de Torrequebrada", tipo: "barrio" },
  { nombre: "Hacienda San Fernando", tipo: "barrio" },
  { nombre: "La Leala", tipo: "barrio" },
  { nombre: "La Perla", tipo: "barrio" },
  { nombre: "La Sierrezuela", tipo: "barrio" },
  { nombre: "Las Brisas", tipo: "barrio" },
  { nombre: "Las Flores", tipo: "barrio" },
  { nombre: "Las Mimosas", tipo: "barrio" },
  { nombre: "Los Nadales", tipo: "barrio" },
  { nombre: "Los Pinos", tipo: "barrio" },
  { nombre: "Monte Alto", tipo: "barrio" },
  { nombre: "Montealto II", tipo: "barrio" },
  { nombre: "Pueblo Evita", tipo: "barrio" },
  { nombre: "Pueblo Quinta", tipo: "barrio" },
  { nombre: "Rancho Domingo", tipo: "barrio" },
  { nombre: "Reserva del Higuerón", tipo: "barrio" },
  { nombre: "Retamar", tipo: "barrio" },
  { nombre: "Santangelo", tipo: "barrio" },
  { nombre: "Santangelo Norte", tipo: "barrio" },
  { nombre: "Santangelo Sur", tipo: "barrio" },
  { nombre: "Solymar", tipo: "barrio" },
  { nombre: "Torremar", tipo: "barrio" },
  { nombre: "Torremuelle", tipo: "barrio" },
  { nombre: "Torrequebrada", tipo: "barrio" },
  { nombre: "Veracruz", tipo: "barrio" },
  { nombre: "Veracruz Norte", tipo: "barrio" },
  { nombre: "Veracruz Sur", tipo: "barrio" },
  { nombre: "Veracruz Oeste", tipo: "barrio" },
  { nombre: "Yuca", tipo: "barrio" },
];

const POLIGONOS_BENALMADENA: ZonaCiudad[] = [
  { nombre: "Polígono Industrial Arroyo de la Miel", tipo: "poligono" },
  { nombre: "Polígono Industrial El Tomillar", tipo: "poligono" },
  { nombre: "Polígono Industrial La Léala", tipo: "poligono" },
];

const BARRIOS_CARTAMA: ZonaCiudad[] = [
  { nombre: "Aljaima", tipo: "barrio" },
  { nombre: "Cártama Pueblo", tipo: "barrio" },
  { nombre: "Cártama Estación", tipo: "barrio" },
  { nombre: "Doñana", tipo: "barrio" },
  { nombre: "El Sexmo", tipo: "barrio" },
  { nombre: "Nueva Aljaima", tipo: "barrio" },
  { nombre: "Sierra de Gibralgalia", tipo: "barrio" },
  { nombre: "Sierra Llana", tipo: "barrio" },
  { nombre: "Tres Leguas", tipo: "barrio" },
  { nombre: "Atalaya de Cártama", tipo: "barrio" },
];

const POLIGONOS_CARTAMA: ZonaCiudad[] = [
  { nombre: "El Cerro", tipo: "poligono" },
  { nombre: "Fahala", tipo: "poligono" },
];

const BARRIOS_COIN: ZonaCiudad[] = [
  { nombre: "Alberos", tipo: "barrio" },
  { nombre: "Caballo Blanco", tipo: "barrio" },
  { nombre: "El Rodeo", tipo: "barrio" },
  { nombre: "Huertas Viejas", tipo: "barrio" },
  { nombre: "Jardines del Guadalhorce", tipo: "barrio" },
  { nombre: "Las Delicias", tipo: "barrio" },
  { nombre: "Los Montecillos", tipo: "barrio" },
  { nombre: "Los Nebrales", tipo: "barrio" },
  { nombre: "Miralmonte", tipo: "barrio" },
  { nombre: "Miravalle", tipo: "barrio" },
  { nombre: "Río Garrote", tipo: "barrio" },
  { nombre: "Sierra Chica", tipo: "barrio" },
  { nombre: "Sierra Gorda", tipo: "barrio" },
  { nombre: "Viña Borrego", tipo: "barrio" },
];

const POLIGONOS_COIN: ZonaCiudad[] = [
  { nombre: "Cantarranas", tipo: "poligono" },
  { nombre: "La Trocha", tipo: "poligono" },
  { nombre: "Nuestra Señora de Lourdes", tipo: "poligono" },
  { nombre: "Parque Empresarial Coín", tipo: "poligono" },
  { nombre: "Río Cuevas", tipo: "poligono" },
];

const BARRIOS_TORREMOLINOS: ZonaCiudad[] = [
  { nombre: "Altos del Olivar", tipo: "barrio" },
  { nombre: "Altos del Toril", tipo: "barrio" },
  { nombre: "Aquapark", tipo: "barrio" },
  { nombre: "Benyamina", tipo: "barrio" },
  { nombre: "Cantarranas", tipo: "barrio" },
  { nombre: "Cañada de los Cardos", tipo: "barrio" },
  { nombre: "Centro", tipo: "barrio" },
  { nombre: "El Bajondillo", tipo: "barrio" },
  { nombre: "El Calvario", tipo: "barrio" },
  { nombre: "El Olivar", tipo: "barrio" },
  { nombre: "El Paraíso", tipo: "barrio" },
  { nombre: "El Pinar", tipo: "barrio" },
  { nombre: "El Pinillo", tipo: "barrio" },
  { nombre: "El Saltillo", tipo: "barrio" },
  { nombre: "Eurosol", tipo: "barrio" },
  { nombre: "Jardines del Pinillo", tipo: "barrio" },
  { nombre: "La Carihuela", tipo: "barrio" },
  { nombre: "La Colina", tipo: "barrio" },
  { nombre: "La Leala", tipo: "barrio" },
  { nombre: "La Nogalera", tipo: "barrio" },
  { nombre: "Las Estrellas", tipo: "barrio" },
  { nombre: "Los Álamos", tipo: "barrio" },
  { nombre: "Los Nidos", tipo: "barrio" },
  { nombre: "Los Palacios", tipo: "barrio" },
  { nombre: "Los Pinares", tipo: "barrio" },
  { nombre: "Los Tres Caballeros", tipo: "barrio" },
  { nombre: "Montemar", tipo: "barrio" },
  { nombre: "Monte Real", tipo: "barrio" },
  { nombre: "Playamar", tipo: "barrio" },
  { nombre: "Pinillo Norte", tipo: "barrio" },
  { nombre: "Pinillo Sur", tipo: "barrio" },
  { nombre: "Senda del Pilar", tipo: "barrio" },
  { nombre: "Torremolinos Centro", tipo: "barrio" },
];

const POLIGONOS_TORREMOLINOS: ZonaCiudad[] = [
  { nombre: "Parque Empresarial El Pinillo", tipo: "poligono" },
  { nombre: "Polígono Industrial La Colina (zona productiva)", tipo: "poligono" },
  { nombre: "Zona Empresarial Los Pinares", tipo: "poligono" },
];

const BARRIOS_RINCON_VICTORIA: ZonaCiudad[] = [
  { nombre: "Añoreta", tipo: "barrio" },
  { nombre: "Añoreta Baja", tipo: "barrio" },
  { nombre: "Añoreta Golf", tipo: "barrio" },
  { nombre: "Añoreta Golf - Paraíso del Sol", tipo: "barrio" },
  { nombre: "Arenal Marina Golf", tipo: "barrio" },
  { nombre: "Balcón del Golf", tipo: "barrio" },
  { nombre: "Benagalbón", tipo: "barrio" },
  { nombre: "Brisas del Sur", tipo: "barrio" },
  { nombre: "Calabahía", tipo: "barrio" },
  { nombre: "Calaflores", tipo: "barrio" },
  { nombre: "Cala del Moral (La)", tipo: "barrio" },
  { nombre: "Camino Viejo de Vélez", tipo: "barrio" },
  { nombre: "Cortijo Blanco", tipo: "barrio" },
  { nombre: "Cotomar", tipo: "barrio" },
  { nombre: "Cumbres del Golf", tipo: "barrio" },
  { nombre: "El Cantal", tipo: "barrio" },
  { nombre: "El Olivar", tipo: "barrio" },
  { nombre: "Gran Sol", tipo: "barrio" },
  { nombre: "Jardines de la Factoria", tipo: "barrio" },
  { nombre: "Jardines del Golf", tipo: "barrio" },
  { nombre: "La Zenaida", tipo: "barrio" },
  { nombre: "Las Palmas", tipo: "barrio" },
  { nombre: "Las Pedrizas", tipo: "barrio" },
  { nombre: "Lo Cea", tipo: "barrio" },
  { nombre: "Los Cabreras", tipo: "barrio" },
  { nombre: "Los Catalanes", tipo: "barrio" },
  { nombre: "Los Cortijos", tipo: "barrio" },
  { nombre: "Los Delgados", tipo: "barrio" },
  { nombre: "Los Jarales", tipo: "barrio" },
  { nombre: "Mar Paraíso Golf", tipo: "barrio" },
  { nombre: "Montesol", tipo: "barrio" },
  { nombre: "Parque Victoria", tipo: "barrio" },
  { nombre: "Paraisos del Golf", tipo: "barrio" },
  { nombre: "Pinar de Añoreta", tipo: "barrio" },
  { nombre: "Playa del Rincón", tipo: "barrio" },
  { nombre: "Rincón de la Victoria (Centro)", tipo: "barrio" },
  { nombre: "Rincón del Sol", tipo: "barrio" },
  { nombre: "Señorío de la Victoria", tipo: "barrio" },
  { nombre: "Torre de Benagalbón", tipo: "barrio" },
  { nombre: "Vistas del Golf", tipo: "barrio" },
];

const POLIGONOS_RINCON_VICTORIA: ZonaCiudad[] = [
  { nombre: "Área empresarial de Benagalbón", tipo: "poligono" },
  { nombre: "Área comercial de La Cala del Moral", tipo: "poligono" },
  { nombre: "Área comercial de Rincón de la Victoria", tipo: "poligono" },
  { nombre: "Zona empresarial de Cotomar", tipo: "poligono" },
];

const BARRIOS_ALHAURIN_TORRE: ZonaCiudad[] = [
  { nombre: "Alamillo", tipo: "barrio" },
  { nombre: "Altos de Viñagrande", tipo: "barrio" },
  { nombre: "Barrio de la Alegría", tipo: "barrio" },
  { nombre: "Barrio Viejo", tipo: "barrio" },
  { nombre: "Bellavista de Zambrana", tipo: "barrio" },
  { nombre: "Blas Infante", tipo: "barrio" },
  { nombre: "Camino de la Acequia", tipo: "barrio" },
  { nombre: "Capellanía (La)", tipo: "barrio" },
  { nombre: "Carranque", tipo: "barrio" },
  { nombre: "Cortijos del Sol", tipo: "barrio" },
  { nombre: "El Cerro", tipo: "barrio" },
  { nombre: "El Cordobés", tipo: "barrio" },
  { nombre: "El Lagar", tipo: "barrio" },
  { nombre: "El Limón", tipo: "barrio" },
  { nombre: "El Romeral", tipo: "barrio" },
  { nombre: "Ermita del Cerro", tipo: "barrio" },
  { nombre: "Fuensanguínea", tipo: "barrio" },
  { nombre: "Huerta Alta", tipo: "barrio" },
  { nombre: "Huerta Nueva", tipo: "barrio" },
  { nombre: "Huerto Coscorrón", tipo: "barrio" },
  { nombre: "Huerto de la Rosa", tipo: "barrio" },
  { nombre: "Jardines de Alhaurín", tipo: "barrio" },
  { nombre: "La Alquería", tipo: "barrio" },
  { nombre: "Lagar de las Pitas", tipo: "barrio" },
  { nombre: "Loma de Cantarranas", tipo: "barrio" },
  { nombre: "Los Tomillares", tipo: "barrio" },
  { nombre: "Mestanza", tipo: "barrio" },
  { nombre: "Molina", tipo: "barrio" },
  { nombre: "Peñón", tipo: "barrio" },
  { nombre: "Piamonte", tipo: "barrio" },
  { nombre: "Pinos de Alhaurín", tipo: "barrio" },
  { nombre: "Platero I", tipo: "barrio" },
  { nombre: "Platero II", tipo: "barrio" },
  { nombre: "Puerta Alhaurín", tipo: "barrio" },
  { nombre: "Puertatorre", tipo: "barrio" },
  { nombre: "Retamar", tipo: "barrio" },
  { nombre: "Santa Amalia", tipo: "barrio" },
  { nombre: "Santa Clara", tipo: "barrio" },
  { nombre: "Tabico", tipo: "barrio" },
  { nombre: "Tabico Alto", tipo: "barrio" },
  { nombre: "Taralpe", tipo: "barrio" },
  { nombre: "Torre Alquería", tipo: "barrio" },
  { nombre: "Torrealquería", tipo: "barrio" },
  { nombre: "Torresol", tipo: "barrio" },
  { nombre: "Viñagrande", tipo: "barrio" },
  { nombre: "Zapata", tipo: "barrio" },
  { nombre: "Zambrana", tipo: "barrio" },
];

const POLIGONOS_ALHAURIN_TORRE: ZonaCiudad[] = [
  { nombre: "Polígono Industrial La Moraga", tipo: "poligono" },
  { nombre: "Polígono Industrial Las Américas", tipo: "poligono" },
  { nombre: "Polígono Industrial Laurotorre", tipo: "poligono" },
  { nombre: "Polígono Industrial Zamorilla", tipo: "poligono" },
];

const BARRIOS_ALHAURIN_GRANDE: ZonaCiudad[] = [
  { nombre: "Alhaurín Golf", tipo: "barrio" },
  { nombre: "Buenavista", tipo: "barrio" },
  { nombre: "El Cigarral", tipo: "barrio" },
  { nombre: "El Parral", tipo: "barrio" },
  { nombre: "El Zángano", tipo: "barrio" },
  { nombre: "Fuente del Perro", tipo: "barrio" },
  { nombre: "Interlén", tipo: "barrio" },
  { nombre: "La Chíchara", tipo: "barrio" },
  { nombre: "La Paca", tipo: "barrio" },
  { nombre: "Villafranco del Guadalhorce", tipo: "barrio" },
];

const POLIGONOS_ALHAURIN_GRANDE: ZonaCiudad[] = [
  { nombre: "Los Pedregales", tipo: "poligono" },
  { nombre: "La Rosa", tipo: "poligono" },
];

const BARRIOS_ANTEQUERA: ZonaCiudad[] = [
  { nombre: "Albarizas", tipo: "barrio" },
  { nombre: "Altos de Santa Catalina", tipo: "barrio" },
  { nombre: "Antequera Golf", tipo: "barrio" },
  { nombre: "Barrio del Carmen", tipo: "barrio" },
  { nombre: "Barrio del Hospital", tipo: "barrio" },
  { nombre: "Barrio de San Juan", tipo: "barrio" },
  { nombre: "Barrio de Santiago", tipo: "barrio" },
  { nombre: "Barrio de Veracruz", tipo: "barrio" },
  { nombre: "Bobadilla", tipo: "barrio" },
  { nombre: "Bobadilla Estación", tipo: "barrio" },
  { nombre: "Camino de la Estación", tipo: "barrio" },
  { nombre: "Camino de las Yeseras", tipo: "barrio" },
  { nombre: "Cartaojal", tipo: "barrio" },
  { nombre: "Centro", tipo: "barrio" },
  { nombre: "Colonia de Santa Ana", tipo: "barrio" },
  { nombre: "El Arenal", tipo: "barrio" },
  { nombre: "El Maulí", tipo: "barrio" },
  { nombre: "El Pontón", tipo: "barrio" },
  { nombre: "Ensanche Oeste", tipo: "barrio" },
  { nombre: "Fuente de la Mora", tipo: "barrio" },
  { nombre: "La Joya", tipo: "barrio" },
  { nombre: "La Pesquera", tipo: "barrio" },
  { nombre: "La Verónica", tipo: "barrio" },
  { nombre: "Las Lagunillas", tipo: "barrio" },
  { nombre: "Las Peñuelas", tipo: "barrio" },
  { nombre: "Los Llanos", tipo: "barrio" },
  { nombre: "Los Nogales", tipo: "barrio" },
  { nombre: "Mirador de Santa Catalina", tipo: "barrio" },
  { nombre: "Parque Nueva Antequera", tipo: "barrio" },
  { nombre: "Parquesol", tipo: "barrio" },
  { nombre: "Puerta de Granada", tipo: "barrio" },
  { nombre: "Santa Catalina", tipo: "barrio" },
  { nombre: "Santa María", tipo: "barrio" },
  { nombre: "Urbanización El Molino", tipo: "barrio" },
  { nombre: "Urbanización La Quinta", tipo: "barrio" },
  { nombre: "Villanueva de Cauche", tipo: "barrio" },
  { nombre: "Cañadas de Pareja", tipo: "barrio" },
  { nombre: "Llanos de Antequera", tipo: "barrio" },
  { nombre: "Barriada Ortiz Recio", tipo: "barrio" },
];

const POLIGONOS_ANTEQUERA: ZonaCiudad[] = [
  { nombre: "Centro Logístico de Antequera (CLA / CLAA)", tipo: "poligono" },
  { nombre: "Parque Empresarial de Antequera (PEAN)", tipo: "poligono" },
  { nombre: "Parque Empresarial Este", tipo: "poligono" },
  { nombre: "Parque Empresarial Oeste", tipo: "poligono" },
  { nombre: "Polígono Industrial Azucarera", tipo: "poligono" },
  { nombre: "Polígono Industrial de Antequera (PIA)", tipo: "poligono" },
];

const BARRIOS_RONDA: ZonaCiudad[] = [
  { nombre: "Arenal", tipo: "barrio" },
  { nombre: "Barrio de El Carmen", tipo: "barrio" },
  { nombre: "Barrio de San Francisco", tipo: "barrio" },
  { nombre: "Barrio de San Rafael", tipo: "barrio" },
  { nombre: "Barrio de San Cristóbal", tipo: "barrio" },
  { nombre: "Barrio de Padre Jesús", tipo: "barrio" },
  { nombre: "Barrio del Mercadillo", tipo: "barrio" },
  { nombre: "Barrio del Sur", tipo: "barrio" },
  { nombre: "Casco Histórico (La Ciudad)", tipo: "barrio" },
  { nombre: "Centro", tipo: "barrio" },
  { nombre: "El Fuerte", tipo: "barrio" },
  { nombre: "El Arenal", tipo: "barrio" },
  { nombre: "El Olivar de las Monjas", tipo: "barrio" },
  { nombre: "La Dehesa", tipo: "barrio" },
  { nombre: "La Planilla", tipo: "barrio" },
  { nombre: "La Torrecilla", tipo: "barrio" },
  { nombre: "Las Quinientas", tipo: "barrio" },
  { nombre: "Llano de la Estación", tipo: "barrio" },
  { nombre: "Los Lacasitos", tipo: "barrio" },
  { nombre: "Los Pinos", tipo: "barrio" },
  { nombre: "Los Prados", tipo: "barrio" },
  { nombre: "Partidas Norte", tipo: "barrio" },
  { nombre: "Partidas Sur", tipo: "barrio" },
  { nombre: "Zona Juzgados-La Feria", tipo: "barrio" },
  { nombre: "La Cimada", tipo: "barrio" },
  { nombre: "Los Villalones", tipo: "barrio" },
  { nombre: "Puerto Sauco", tipo: "barrio" },
  { nombre: "Los Ventorrillos", tipo: "barrio" },
  { nombre: "Montecorto", tipo: "barrio" },
  { nombre: "Serrato", tipo: "barrio" },
];

const POLIGONOS_RONDA: ZonaCiudad[] = [
  { nombre: "Polígono Industrial El Fuerte", tipo: "poligono" },
  { nombre: "Polígono Industrial La Serranía", tipo: "poligono" },
];

const BARRIOS_HUELVA: ZonaCiudad[] = [
  { nombre: "Adoratrices", tipo: "barrio" },
  { nombre: "Balbueno", tipo: "barrio" },
  { nombre: "Barrio Obrero (Reina Victoria)", tipo: "barrio" },
  { nombre: "Barrio de la Hispanidad", tipo: "barrio" },
  { nombre: "Barrio de la Navidad", tipo: "barrio" },
  { nombre: "Barrio de la Victoria", tipo: "barrio" },
  { nombre: "Cardeñas", tipo: "barrio" },
  { nombre: "Centro", tipo: "barrio" },
  { nombre: "El Carmen", tipo: "barrio" },
  { nombre: "El Conquero", tipo: "barrio" },
  { nombre: "El Higueral", tipo: "barrio" },
  { nombre: "El Matadero", tipo: "barrio" },
  { nombre: "El Polvorín", tipo: "barrio" },
  { nombre: "El Rocío", tipo: "barrio" },
  { nombre: "El Seminario", tipo: "barrio" },
  { nombre: "El Torrejón", tipo: "barrio" },
  { nombre: "Guadalupe", tipo: "barrio" },
  { nombre: "Huerta Mena", tipo: "barrio" },
  { nombre: "Isla Chica", tipo: "barrio" },
  { nombre: "Jardines Sierra de Huelva", tipo: "barrio" },
  { nombre: "José Antonio", tipo: "barrio" },
  { nombre: "La Alquería", tipo: "barrio" },
  { nombre: "La Cinta", tipo: "barrio" },
  { nombre: "La Condesa", tipo: "barrio" },
  { nombre: "La Florida", tipo: "barrio" },
  { nombre: "La Merced", tipo: "barrio" },
  { nombre: "La Orden", tipo: "barrio" },
  { nombre: "La Ribera", tipo: "barrio" },
  { nombre: "Las Colonias", tipo: "barrio" },
  { nombre: "Las Tres Ventanas", tipo: "barrio" },
  { nombre: "Los Rosales", tipo: "barrio" },
  { nombre: "Martín Alonso Pinzón", tipo: "barrio" },
  { nombre: "Marismas del Odiel", tipo: "barrio" },
  { nombre: "Marismas del Titán", tipo: "barrio" },
  { nombre: "Molino de la Vega", tipo: "barrio" },
  { nombre: "Parque Moret", tipo: "barrio" },
  { nombre: "Pescadería", tipo: "barrio" },
  { nombre: "Pérez Cubillas", tipo: "barrio" },
  { nombre: "Pinar de Balbueno", tipo: "barrio" },
  { nombre: "Polígono San Sebastián", tipo: "barrio" },
  { nombre: "Príncipe Felipe", tipo: "barrio" },
  { nombre: "Príncipe Juan Carlos", tipo: "barrio" },
  { nombre: "Punta del Sebo", tipo: "barrio" },
  { nombre: "San Antonio", tipo: "barrio" },
  { nombre: "San Sebastián", tipo: "barrio" },
  { nombre: "Santa Lucía", tipo: "barrio" },
  { nombre: "Santa Marta", tipo: "barrio" },
  { nombre: "Santa María del Pilar", tipo: "barrio" },
  { nombre: "Tartessos", tipo: "barrio" },
  { nombre: "Verdeluz", tipo: "barrio" },
  { nombre: "Viaplana", tipo: "barrio" },
  { nombre: "Vicente Yáñez Pinzón", tipo: "barrio" },
  { nombre: "Vistalegre", tipo: "barrio" },
  { nombre: "Zafra", tipo: "barrio" },
];

const POLIGONOS_HUELVA: ZonaCiudad[] = [
  { nombre: "Polígono Industrial El Rincón", tipo: "poligono" },
  { nombre: "Polígono Industrial Fortiz", tipo: "poligono" },
  { nombre: "Polígono Industrial Francisco Montenegro", tipo: "poligono" },
  { nombre: "Polígono Industrial La Esperanza", tipo: "poligono" },
  { nombre: "Polígono Industrial La Luz", tipo: "poligono" },
  { nombre: "Polígono Industrial La Paz", tipo: "poligono" },
  { nombre: "Polígono Industrial Las Yucas-Cardeñas", tipo: "poligono" },
  { nombre: "Polígono Industrial Marismas del Polvorín", tipo: "poligono" },
  { nombre: "Polígono Industrial Peguerillas", tipo: "poligono" },
  { nombre: "Polígono Industrial Pesquero Norte", tipo: "poligono" },
  { nombre: "Polígono Industrial Polirrosa", tipo: "poligono" },
  { nombre: "Polígono Industrial Romeralejo", tipo: "poligono" },
  { nombre: "Polígono Industrial San Diego", tipo: "poligono" },
  { nombre: "Polígono Industrial Tartessos", tipo: "poligono" },
  { nombre: "Huelva Empresarial", tipo: "poligono" },
  { nombre: "La Lunita", tipo: "poligono" },
  { nombre: "Las Metas", tipo: "poligono" },
  { nombre: "Miraval", tipo: "poligono" },
  { nombre: "Mirador del Odiel", tipo: "poligono" },
  { nombre: "Naviluz", tipo: "poligono" },
  { nombre: "Pavipresa", tipo: "poligono" },
  { nombre: "Vaciadero Norte", tipo: "poligono" },
];

const BARRIOS_ALMONTE: ZonaCiudad[] = [
  { nombre: "Almonte (casco urbano)", tipo: "barrio" },
  { nombre: "Cabezudos", tipo: "barrio" },
  { nombre: "El Rocío", tipo: "barrio" },
  { nombre: "Matalascañas", tipo: "barrio" },
];

const POLIGONOS_ALMONTE: ZonaCiudad[] = [
  { nombre: "Ballestares", tipo: "poligono" },
  { nombre: "Camino Alto", tipo: "poligono" },
  { nombre: "El Tomillar", tipo: "poligono" },
  { nombre: "Matalagrana", tipo: "poligono" },
];

const BARRIOS_ALMERIA: ZonaCiudad[] = [
  { nombre: "500 Viviendas", tipo: "barrio" },
  { nombre: "Altamira", tipo: "barrio" },
  { nombre: "Barrio Alto", tipo: "barrio" },
  { nombre: "Barrio Araceli", tipo: "barrio" },
  { nombre: "Barrio de Los Ángeles", tipo: "barrio" },
  { nombre: "Barrio San Luis", tipo: "barrio" },
  { nombre: "Cabo de Gata", tipo: "barrio" },
  { nombre: "Casco Histórico", tipo: "barrio" },
  { nombre: "Castell del Rey", tipo: "barrio" },
  { nombre: "Centro", tipo: "barrio" },
  { nombre: "Cerro de San Cristóbal", tipo: "barrio" },
  { nombre: "Ciudad Jardín", tipo: "barrio" },
  { nombre: "Costacabana", tipo: "barrio" },
  { nombre: "Cortijo Grande", tipo: "barrio" },
  { nombre: "Cruz de Caravaca", tipo: "barrio" },
  { nombre: "Cuevas de los Medinas", tipo: "barrio" },
  { nombre: "Cuevas de los Úbedas", tipo: "barrio" },
  { nombre: "El Alquián", tipo: "barrio" },
  { nombre: "El Diezmo", tipo: "barrio" },
  { nombre: "El Puche", tipo: "barrio" },
  { nombre: "El Toyo", tipo: "barrio" },
  { nombre: "Fuentecica", tipo: "barrio" },
  { nombre: "La Almadraba de Monteleva", tipo: "barrio" },
  { nombre: "La Cañada de San Urbano", tipo: "barrio" },
  { nombre: "La Chanca", tipo: "barrio" },
  { nombre: "La Esperanza", tipo: "barrio" },
  { nombre: "La Goleta", tipo: "barrio" },
  { nombre: "Las Chocillas", tipo: "barrio" },
  { nombre: "Los Almendros", tipo: "barrio" },
  { nombre: "Los Molinos", tipo: "barrio" },
  { nombre: "Nueva Almería", tipo: "barrio" },
  { nombre: "Nueva Andalucía", tipo: "barrio" },
  { nombre: "Oliveros", tipo: "barrio" },
  { nombre: "Pescadería", tipo: "barrio" },
  { nombre: "Piedras Redondas", tipo: "barrio" },
  { nombre: "Plaza de Toros", tipo: "barrio" },
  { nombre: "Pujaire", tipo: "barrio" },
  { nombre: "Retamar", tipo: "barrio" },
  { nombre: "Regiones", tipo: "barrio" },
  { nombre: "Ruescas", tipo: "barrio" },
  { nombre: "San Félix", tipo: "barrio" },
  { nombre: "Santa Rita", tipo: "barrio" },
  { nombre: "Tagarete", tipo: "barrio" },
  { nombre: "Torrecárdenas", tipo: "barrio" },
  { nombre: "Vega de Acá", tipo: "barrio" },
  { nombre: "Villablanca", tipo: "barrio" },
  { nombre: "Zapillo", tipo: "barrio" },
];

const POLIGONOS_ALMERIA: ZonaCiudad[] = [
  { nombre: "Avenida de Monserrat", tipo: "poligono" },
  { nombre: "Polígono El Puche", tipo: "poligono" },
  { nombre: "La Celulosa", tipo: "poligono" },
  { nombre: "La Mezquita", tipo: "poligono" },
  { nombre: "La Molineta", tipo: "poligono" },
  { nombre: "Parque Científico-Tecnológico de Almería (PITA)", tipo: "poligono" },
  { nombre: "Puerto Comercial de Almería", tipo: "poligono" },
  { nombre: "San Carlos", tipo: "poligono" },
  { nombre: "Sector 20 (SEPES)", tipo: "poligono" },
];

const BARRIOS_ROQUETAS: ZonaCiudad[] = [
  { nombre: "Aguadulce", tipo: "barrio" },
  { nombre: "Aguadulce Norte", tipo: "barrio" },
  { nombre: "Aguadulce Sur", tipo: "barrio" },
  { nombre: "Campillo del Moro", tipo: "barrio" },
  { nombre: "Cortijos de Marín", tipo: "barrio" },
  { nombre: "El Parador de las Hortichuelas", tipo: "barrio" },
  { nombre: "El Puerto", tipo: "barrio" },
  { nombre: "El Sabinar", tipo: "barrio" },
  { nombre: "El Solanillo", tipo: "barrio" },
  { nombre: "La Algaida", tipo: "barrio" },
  { nombre: "La Romanilla", tipo: "barrio" },
  { nombre: "Las Losas", tipo: "barrio" },
  { nombre: "Las Marinas", tipo: "barrio" },
  { nombre: "Las Salinas", tipo: "barrio" },
  { nombre: "Los Bajos", tipo: "barrio" },
  { nombre: "Playa Serena", tipo: "barrio" },
  { nombre: "Roquetas Centro", tipo: "barrio" },
  { nombre: "Roquetas Pueblo", tipo: "barrio" },
  { nombre: "Urbanización de Roquetas de Mar (La Urba)", tipo: "barrio" },
  { nombre: "Buenavista", tipo: "barrio" },
  { nombre: "El Puerto - La Romanilla", tipo: "barrio" },
  { nombre: "La Gloria", tipo: "barrio" },
  { nombre: "Las Colinas", tipo: "barrio" },
  { nombre: "Las Salinas de San Rafael", tipo: "barrio" },
  { nombre: "Los Melilleros", tipo: "barrio" },
  { nombre: "Villa África", tipo: "barrio" },
];

const POLIGONOS_ROQUETAS: ZonaCiudad[] = [
  { nombre: "Polígono Industrial Cortijos de Marín", tipo: "poligono" },
  { nombre: "Polígono Industrial Gran Plaza", tipo: "poligono" },
  { nombre: "Polígono Industrial La Algaida", tipo: "poligono" },
];

const BARRIOS_EL_EJIDO: ZonaCiudad[] = [
  { nombre: "Almerimar", tipo: "barrio" },
  { nombre: "Balerma", tipo: "barrio" },
  { nombre: "Ejido Norte", tipo: "barrio" },
  { nombre: "Ejido Sur", tipo: "barrio" },
  { nombre: "Ensenada de San Miguel", tipo: "barrio" },
  { nombre: "Guardias Viejas", tipo: "barrio" },
  { nombre: "La Redonda", tipo: "barrio" },
  { nombre: "Las Norias de Daza", tipo: "barrio" },
  { nombre: "Matagorda", tipo: "barrio" },
  { nombre: "Pampanico", tipo: "barrio" },
  { nombre: "Paraíso Al Mar", tipo: "barrio" },
  { nombre: "San Agustín", tipo: "barrio" },
  { nombre: "San Silvestre", tipo: "barrio" },
  { nombre: "Santa María del Águila", tipo: "barrio" },
  { nombre: "Tarambana", tipo: "barrio" },
  { nombre: "Almerimar Centro", tipo: "barrio" },
  { nombre: "Almerimar Playa", tipo: "barrio" },
  { nombre: "Bahía de San Miguel", tipo: "barrio" },
  { nombre: "Ejido Beach", tipo: "barrio" },
  { nombre: "Ejido Norte Residencial", tipo: "barrio" },
  { nombre: "Ejido Sur Residencial", tipo: "barrio" },
  { nombre: "Pampanico Alto", tipo: "barrio" },
  { nombre: "Paraíso Al Mar Residencial", tipo: "barrio" },
  { nombre: "Urbanización Entreverde", tipo: "barrio" },
];

const POLIGONOS_EL_EJIDO: ZonaCiudad[] = [
  { nombre: "Polígono Industrial Avenida de Ciavieja", tipo: "poligono" },
  { nombre: "Polígono Industrial Balerma", tipo: "poligono" },
  { nombre: "Polígono Industrial Carretera N-340", tipo: "poligono" },
  { nombre: "Polígono Industrial Ciavieja", tipo: "poligono" },
  { nombre: "Polígono Industrial La Costa", tipo: "poligono" },
  { nombre: "Polígono Industrial La Redonda", tipo: "poligono" },
  { nombre: "Polígono Industrial Las Norias", tipo: "poligono" },
  { nombre: "Polígono Industrial Puesto Rubio (Las Norias)", tipo: "poligono" },
];

const BARRIOS_NIJAR: ZonaCiudad[] = [
  { nombre: "Agua Amarga", tipo: "barrio" },
  { nombre: "Atochares", tipo: "barrio" },
  { nombre: "Boca de los Frailes", tipo: "barrio" },
  { nombre: "Campohermoso", tipo: "barrio" },
  { nombre: "Cuevas del Lino", tipo: "barrio" },
  { nombre: "El Barranquete", tipo: "barrio" },
  { nombre: "El Jabonero", tipo: "barrio" },
  { nombre: "El Rodón", tipo: "barrio" },
  { nombre: "El Viso", tipo: "barrio" },
  { nombre: "Fernán Pérez", tipo: "barrio" },
  { nombre: "Huebro", tipo: "barrio" },
  { nombre: "La Fabriquilla", tipo: "barrio" },
  { nombre: "La Fuensanta", tipo: "barrio" },
  { nombre: "La Isleta del Moro", tipo: "barrio" },
  { nombre: "La Joya", tipo: "barrio" },
  { nombre: "Las Casillas", tipo: "barrio" },
  { nombre: "Las Hortichuelas", tipo: "barrio" },
  { nombre: "Las Negras", tipo: "barrio" },
  { nombre: "Las Norias", tipo: "barrio" },
  { nombre: "Las Presillas", tipo: "barrio" },
  { nombre: "Los Albaricoques", tipo: "barrio" },
  { nombre: "Los Cortijillos", tipo: "barrio" },
  { nombre: "Los Grillos", tipo: "barrio" },
  { nombre: "Los Nietos", tipo: "barrio" },
  { nombre: "Níjar", tipo: "barrio" },
  { nombre: "Pozo de los Frailes", tipo: "barrio" },
  { nombre: "Pozo del Capitán", tipo: "barrio" },
  { nombre: "Pueblo Blanco", tipo: "barrio" },
  { nombre: "Pujaire", tipo: "barrio" },
  { nombre: "Rodalquilar", tipo: "barrio" },
  { nombre: "Ruescas", tipo: "barrio" },
  { nombre: "Saladar y Leche", tipo: "barrio" },
  { nombre: "San Isidro", tipo: "barrio" },
  { nombre: "San José", tipo: "barrio" },
  { nombre: "Torre del Campo", tipo: "barrio" },
  { nombre: "Venta del Pobre", tipo: "barrio" },
  { nombre: "Vistabella", tipo: "barrio" },
];

const POLIGONOS_NIJAR: ZonaCiudad[] = [
  { nombre: "Área Logística de Níjar", tipo: "poligono" },
  { nombre: "Parque Industrial Balsaseca", tipo: "poligono" },
];

const BARRIOS_LUCENA: ZonaCiudad[] = [
  { nombre: "Barrio de Araceli", tipo: "barrio" },
  { nombre: "Barrio de San Jorge", tipo: "barrio" },
  { nombre: "Barrio García del Barrio", tipo: "barrio" },
  { nombre: "Campo de Aras", tipo: "barrio" },
  { nombre: "Cristo Marroquí", tipo: "barrio" },
  { nombre: "El Valle", tipo: "barrio" },
  { nombre: "Era del Santo", tipo: "barrio" },
  { nombre: "Fuensanta", tipo: "barrio" },
  { nombre: "Hermanos Álvarez Quintero", tipo: "barrio" },
  { nombre: "Jauja", tipo: "barrio" },
  { nombre: "La Barrera", tipo: "barrio" },
  { nombre: "La Campuzana", tipo: "barrio" },
  { nombre: "La Estación", tipo: "barrio" },
  { nombre: "La Hoja", tipo: "barrio" },
  { nombre: "La Torca", tipo: "barrio" },
  { nombre: "Las Delicias", tipo: "barrio" },
  { nombre: "Las Navas del Selpillar", tipo: "barrio" },
  { nombre: "Las Poleares", tipo: "barrio" },
  { nombre: "Las Vegas", tipo: "barrio" },
  { nombre: "Los Olivares", tipo: "barrio" },
  { nombre: "Los Polvillares", tipo: "barrio" },
  { nombre: "Nela de las Nieves", tipo: "barrio" },
  { nombre: "Quebracarreteras", tipo: "barrio" },
  { nombre: "Santiago", tipo: "barrio" },
  { nombre: "Santa Lucía", tipo: "barrio" },
  { nombre: "Tinajerías", tipo: "barrio" },
  { nombre: "El Zarpazo", tipo: "barrio" },
];

const POLIGONOS_LUCENA: ZonaCiudad[] = [
  { nombre: "Parque Empresarial Príncipe Felipe", tipo: "poligono" },
  { nombre: "Polígono Industrial Carretera de Rute", tipo: "poligono" },
  { nombre: "Polígono Industrial Carretera de Puente Genil", tipo: "poligono" },
  { nombre: "Polígono Industrial Cerro Gordo", tipo: "poligono" },
  { nombre: "Polígono Industrial La Torca", tipo: "poligono" },
  { nombre: "Polígono Industrial Las Palomas", tipo: "poligono" },
  { nombre: "Polígono Industrial Las Peñuelas", tipo: "poligono" },
  { nombre: "Polígono Industrial La Viñuela", tipo: "poligono" },
  { nombre: "Polígono Industrial Los Polvillares", tipo: "poligono" },
  { nombre: "Polígono Industrial Los Santos", tipo: "poligono" },
  { nombre: "Polígono Industrial Los Yesares", tipo: "poligono" },
  { nombre: "Polígono Industrial Pilar de la Dehesa", tipo: "poligono" },
  { nombre: "Polígono Industrial Puente Vadillo", tipo: "poligono" },
  { nombre: "Polígono Industrial Río Lucena", tipo: "poligono" },
  { nombre: "Polígono Industrial Vereda de Castro", tipo: "poligono" },
  { nombre: "Polígono Industrial Camino de la Torca", tipo: "poligono" },
];

const BARRIOS_MOTRIL: ZonaCiudad[] = [
  { nombre: "Aguas del Hospital-La Matraquilla", tipo: "barrio" },
  { nombre: "Calle Cuevas-La Fabriquilla", tipo: "barrio" },
  { nombre: "Casas Nuevas-Divina Pastora", tipo: "barrio" },
  { nombre: "Casco Antiguo", tipo: "barrio" },
  { nombre: "Centro Comercial", tipo: "barrio" },
  { nombre: "Cerrillo Jaime", tipo: "barrio" },
  { nombre: "El Pilar-Manuel Peña", tipo: "barrio" },
  { nombre: "El Vadillo", tipo: "barrio" },
  { nombre: "Hospital-Aviación", tipo: "barrio" },
  { nombre: "Huerto del Capitán-Piedrabuena", tipo: "barrio" },
  { nombre: "La Garnatilla", tipo: "barrio" },
  { nombre: "Las Angustias-Las Monjas", tipo: "barrio" },
  { nombre: "Las Explanadas", tipo: "barrio" },
  { nombre: "Las Ventillas", tipo: "barrio" },
  { nombre: "Los Álamos-San Fernando", tipo: "barrio" },
  { nombre: "Los Tablones", tipo: "barrio" },
  { nombre: "Playa de Poniente", tipo: "barrio" },
  { nombre: "Playa Granada", tipo: "barrio" },
  { nombre: "Puntalón", tipo: "barrio" },
  { nombre: "Puerto-Varadero", tipo: "barrio" },
  { nombre: "San Antonio-Calle Ancha", tipo: "barrio" },
  { nombre: "Santa Adela", tipo: "barrio" },
  { nombre: "Zona Comercial de La Puchilla", tipo: "barrio" },
];

const POLIGONOS_MOTRIL: ZonaCiudad[] = [
  { nombre: "Polígono Industrial Alborán", tipo: "poligono" },
  { nombre: "Polígono Industrial El Vadillo", tipo: "poligono" },
  { nombre: "Polígono Industrial Las Algaidas", tipo: "poligono" },
  { nombre: "Polígono Industrial del Puerto de Motril", tipo: "poligono" },
  { nombre: "Zona de Actividades Logísticas del Puerto de Motril (ZAL)", tipo: "poligono" },
];

const BARRIOS_ALMUNECAR: ZonaCiudad[] = [
  { nombre: "Almuñécar centro", tipo: "barrio" },
  { nombre: "Barrio de San Miguel", tipo: "barrio" },
  { nombre: "Barrio de San Sebastián", tipo: "barrio" },
  { nombre: "Cabria", tipo: "barrio" },
  { nombre: "Campo de Tiro", tipo: "barrio" },
  { nombre: "Cantarriján", tipo: "barrio" },
  { nombre: "Cerro Gordo", tipo: "barrio" },
  { nombre: "Cotobro", tipo: "barrio" },
  { nombre: "Curumbico", tipo: "barrio" },
  { nombre: "La Herradura", tipo: "barrio" },
  { nombre: "La Paloma", tipo: "barrio" },
  { nombre: "La Galera", tipo: "barrio" },
  { nombre: "Las Golondrinas", tipo: "barrio" },
  { nombre: "Las Palomas", tipo: "barrio" },
  { nombre: "Los Berengueles", tipo: "barrio" },
  { nombre: "Los Pinos", tipo: "barrio" },
  { nombre: "Lo Colorado", tipo: "barrio" },
  { nombre: "Marina del Este", tipo: "barrio" },
  { nombre: "Punta de la Mona", tipo: "barrio" },
  { nombre: "San Antonio", tipo: "barrio" },
  { nombre: "San Nicolás", tipo: "barrio" },
  { nombre: "Taramay", tipo: "barrio" },
  { nombre: "Torrecuevas", tipo: "barrio" },
  { nombre: "Velilla", tipo: "barrio" },
];

const POLIGONOS_ALMUNECAR: ZonaCiudad[] = [
  { nombre: "Polígono · La Paloma", tipo: "poligono" },
  { nombre: "Polígono Industrial Taramay", tipo: "poligono" },
];

const BARRIOS_JAEN: ZonaCiudad[] = [
  { nombre: "El Almendral", tipo: "barrio" },
  { nombre: "El Arrabalejo", tipo: "barrio" },
  { nombre: "El Tomillo", tipo: "barrio" },
  { nombre: "Egido de Belén", tipo: "barrio" },
  { nombre: "Expansión Norte", tipo: "barrio" },
  { nombre: "Fuente de la Peña", tipo: "barrio" },
  { nombre: "Gran Bulevar", tipo: "barrio" },
  { nombre: "Jabalcuz", tipo: "barrio" },
  { nombre: "Judería", tipo: "barrio" },
  { nombre: "La Alcantarilla", tipo: "barrio" },
  { nombre: "La Glorieta", tipo: "barrio" },
  { nombre: "La Granja", tipo: "barrio" },
  { nombre: "La Magdalena", tipo: "barrio" },
  { nombre: "La Merced", tipo: "barrio" },
  { nombre: "La Victoria", tipo: "barrio" },
  { nombre: "Las Canteras", tipo: "barrio" },
  { nombre: "Las Fuentezuelas", tipo: "barrio" },
  { nombre: "Las Lagunillas", tipo: "barrio" },
  { nombre: "Loma del Royo", tipo: "barrio" },
  { nombre: "Los Robles", tipo: "barrio" },
  { nombre: "Marroquíes Bajos", tipo: "barrio" },
  { nombre: "Peñamefécit", tipo: "barrio" },
  { nombre: "Protegidas-La Concordia", tipo: "barrio" },
  { nombre: "Puente de la Sierra", tipo: "barrio" },
  { nombre: "Puente Jontoya", tipo: "barrio" },
  { nombre: "Puente Nuevo", tipo: "barrio" },
  { nombre: "Puente Tablas", tipo: "barrio" },
  { nombre: "San Bartolomé", tipo: "barrio" },
  { nombre: "San Felipe", tipo: "barrio" },
  { nombre: "San Ildefonso-La Alameda", tipo: "barrio" },
  { nombre: "San Juan", tipo: "barrio" },
  { nombre: "San Roque", tipo: "barrio" },
  { nombre: "San Sebastián", tipo: "barrio" },
  { nombre: "San Vicente de Paúl", tipo: "barrio" },
  { nombre: "Santa Isabel", tipo: "barrio" },
  { nombre: "Santa María del Valle", tipo: "barrio" },
  { nombre: "Sagrada Familia", tipo: "barrio" },
  { nombre: "Sagrario", tipo: "barrio" },
  { nombre: "Tiro Nacional", tipo: "barrio" },
  { nombre: "Valdeastillas", tipo: "barrio" },
  { nombre: "Valparaíso", tipo: "barrio" },
  { nombre: "Vaciacostales", tipo: "barrio" },
  { nombre: "Cerro Molina", tipo: "barrio" },
  { nombre: "Las Infantas", tipo: "barrio" },
  { nombre: "La Imora", tipo: "barrio" },
  { nombre: "El Recinto", tipo: "barrio" },
  { nombre: "San Félix", tipo: "barrio" },
  { nombre: "Polígono del Valle", tipo: "barrio" },
  { nombre: "Residencial Azahar", tipo: "barrio" },
  { nombre: "Nuevo Mundo", tipo: "barrio" },
];

const POLIGONOS_JAEN: ZonaCiudad[] = [
  { nombre: "Parque Empresarial Nuevo Jaén", tipo: "poligono" },
  { nombre: "Polígono Industrial Cerro de la Cantera", tipo: "poligono" },
  { nombre: "Polígono Industrial Jaén", tipo: "poligono" },
  { nombre: "Polígono Industrial La Dehesa", tipo: "poligono" },
  { nombre: "Polígono Industrial Llanos del Valle", tipo: "poligono" },
  { nombre: "Polígono Industrial Los Olivares", tipo: "poligono" },
  { nombre: "Polígono Industrial Los Rosales", tipo: "poligono" },
  { nombre: "Polígono Industrial Pilar de la Dehesa", tipo: "poligono" },
  { nombre: "Polígono Industrial Quiebracántaros", tipo: "poligono" },
  { nombre: "Polígono Industrial del Valle", tipo: "poligono" },
];

const BARRIOS_GRANADA: ZonaCiudad[] = [
  { nombre: "Albaicín", tipo: "barrio" },
  { nombre: "Angustias – Chana – Encina", tipo: "barrio" },
  { nombre: "Bobadilla", tipo: "barrio" },
  { nombre: "Bola de Oro", tipo: "barrio" },
  { nombre: "Camino de los Neveros", tipo: "barrio" },
  { nombre: "Campo Verde", tipo: "barrio" },
  { nombre: "Carretera de la Sierra", tipo: "barrio" },
  { nombre: "Cartuja", tipo: "barrio" },
  { nombre: "Casería de Montijo", tipo: "barrio" },
  { nombre: "Cerrillo de Maracena", tipo: "barrio" },
  { nombre: "Centro – Sagrario", tipo: "barrio" },
  { nombre: "Cervantes", tipo: "barrio" },
  { nombre: "El Fargue", tipo: "barrio" },
  { nombre: "Fígares", tipo: "barrio" },
  { nombre: "Haza Grande", tipo: "barrio" },
  { nombre: "Joaquina Eguaras", tipo: "barrio" },
  { nombre: "La Cruz", tipo: "barrio" },
  { nombre: "La Paz", tipo: "barrio" },
  { nombre: "Lancha del Genil", tipo: "barrio" },
  { nombre: "Los Pajaritos", tipo: "barrio" },
  { nombre: "Parque Nueva Granada", tipo: "barrio" },
  { nombre: "Plaza de Toros – Doctores – San Lázaro", tipo: "barrio" },
  { nombre: "Realejo – San Matías", tipo: "barrio" },
  { nombre: "Rey Badis", tipo: "barrio" },
  { nombre: "Rosaleda", tipo: "barrio" },
  { nombre: "Ronda", tipo: "barrio" },
  { nombre: "Sacromonte", tipo: "barrio" },
  { nombre: "San Francisco Javier", tipo: "barrio" },
  { nombre: "San Ildefonso", tipo: "barrio" },
  { nombre: "Zaidín – Vergeles", tipo: "barrio" },
];

const POLIGONOS_GRANADA: ZonaCiudad[] = [
  { nombre: "Almanjáyar", tipo: "poligono" },
  { nombre: "Polígono Cartuja", tipo: "poligono" },
  { nombre: "El Florío", tipo: "poligono" },
  { nombre: "Fatinafar", tipo: "poligono" },
  { nombre: "La Purísima", tipo: "poligono" },
  { nombre: "Las Algaidas", tipo: "poligono" },
  { nombre: "Mercagranada", tipo: "poligono" },
  { nombre: "Paraíso Industrial", tipo: "poligono" },
  { nombre: "Sierra Elvira", tipo: "poligono" },
];

const BARRIOS_LINARES: ZonaCiudad[] = [
  { nombre: "Arrayanes", tipo: "barrio" },
  { nombre: "Barriada Andaluza", tipo: "barrio" },
  { nombre: "Barriada de los Mares", tipo: "barrio" },
  { nombre: "Barriada de los Países Europeos", tipo: "barrio" },
  { nombre: "Barriada de San José", tipo: "barrio" },
  { nombre: "Barriada de Santa Ana", tipo: "barrio" },
  { nombre: "Barriada de Senda de la Moza", tipo: "barrio" },
  { nombre: "Belén", tipo: "barrio" },
  { nombre: "Camino de Úbeda", tipo: "barrio" },
  { nombre: "Colonia del Sol", tipo: "barrio" },
  { nombre: "El Cerro", tipo: "barrio" },
  { nombre: "El Girón", tipo: "barrio" },
  { nombre: "La Esperanza", tipo: "barrio" },
  { nombre: "La Florida", tipo: "barrio" },
  { nombre: "La Paz", tipo: "barrio" },
  { nombre: "La Zarzuela", tipo: "barrio" },
  { nombre: "Linarejos", tipo: "barrio" },
  { nombre: "Los Naranjos", tipo: "barrio" },
  { nombre: "Los Ríos", tipo: "barrio" },
  { nombre: "Paseo de Linarejos", tipo: "barrio" },
  { nombre: "Pozico Don Ramón", tipo: "barrio" },
  { nombre: "Quesitos", tipo: "barrio" },
  { nombre: "Ronda Sur", tipo: "barrio" },
  { nombre: "San Antonio", tipo: "barrio" },
  { nombre: "Santa Bárbara", tipo: "barrio" },
  { nombre: "Toreros", tipo: "barrio" },
  { nombre: "Villalonga", tipo: "barrio" },
  { nombre: "Zona Centro", tipo: "barrio" },
  { nombre: "Urbanización Puerta de Castro", tipo: "barrio" },
];

const POLIGONOS_LINARES: ZonaCiudad[] = [
  { nombre: "Parque Científico Tecnológico del Transporte Santana", tipo: "poligono" },
  { nombre: "Parque Empresarial Linarejos", tipo: "poligono" },
  { nombre: "Polígono Agroindustrial Fuente Piedra", tipo: "poligono" },
  { nombre: "Polígono Industrial Cástulo", tipo: "poligono" },
  { nombre: "Polígono Industrial La Zarzuela", tipo: "poligono" },
  { nombre: "Polígono Industrial Los Jarales", tipo: "poligono" },
  { nombre: "Polígono Industrial Los Rubiales", tipo: "poligono" },
  { nombre: "Polígono Industrial Los Rubiales II", tipo: "poligono" },
  { nombre: "Polígono Industrial Santa Rosa", tipo: "poligono" },
  { nombre: "Polígono Industrial Camino de San Luis", tipo: "poligono" },
  { nombre: "Polígono Industrial Carretera de Jabalquinto", tipo: "poligono" },
];

const BARRIOS_ANDUJAR: ZonaCiudad[] = [
  { nombre: "Barrio de la Paz", tipo: "barrio" },
  { nombre: "Barrio de San Bartolomé", tipo: "barrio" },
  { nombre: "Barrio Montañés", tipo: "barrio" },
  { nombre: "Camino del Calvario", tipo: "barrio" },
  { nombre: "Centro Histórico", tipo: "barrio" },
  { nombre: "Corredera-Capuchinos", tipo: "barrio" },
  { nombre: "Cuadro de la Virgen", tipo: "barrio" },
  { nombre: "El Mercado", tipo: "barrio" },
  { nombre: "Emperadores", tipo: "barrio" },
  { nombre: "La Lagunilla", tipo: "barrio" },
  { nombre: "La Pastora", tipo: "barrio" },
  { nombre: "Las Vistillas", tipo: "barrio" },
  { nombre: "Los Belenes", tipo: "barrio" },
  { nombre: "Plaza de Toros", tipo: "barrio" },
  { nombre: "San Eufrasio", tipo: "barrio" },
  { nombre: "Sector Almería", tipo: "barrio" },
  { nombre: "Sector Andalucía", tipo: "barrio" },
  { nombre: "Sector Huelva", tipo: "barrio" },
  { nombre: "Sector Málaga", tipo: "barrio" },
  { nombre: "Sector San Eufrasio", tipo: "barrio" },
  { nombre: "Sector San José", tipo: "barrio" },
  { nombre: "Sector San Sebastián", tipo: "barrio" },
  { nombre: "Sector Sevilla", tipo: "barrio" },
  { nombre: "Sector Sierra de Andújar", tipo: "barrio" },
  { nombre: "Sector Sierra Morena", tipo: "barrio" },
  { nombre: "Sector Virgen de la Cabeza", tipo: "barrio" },
  { nombre: "Urbanización Mirasierra", tipo: "barrio" },
  { nombre: "Zona de Colón", tipo: "barrio" },
  { nombre: "Zona de la Ronda Mestanza", tipo: "barrio" },
  { nombre: "Zona de la Piscina Cubierta", tipo: "barrio" },
];

const POLIGONOS_ANDUJAR: ZonaCiudad[] = [
  { nombre: "Parque Empresarial Europa", tipo: "poligono" },
  { nombre: "Parque Comercial y Empresarial Vegas de Triana", tipo: "poligono" },
  { nombre: "Polígono Industrial Ave María", tipo: "poligono" },
  { nombre: "Polígono Industrial Guadalquivir", tipo: "poligono" },
  { nombre: "Polígono Industrial La Ceca", tipo: "poligono" },
  { nombre: "Polígono Industrial La Estación", tipo: "poligono" },
  { nombre: "Polígono Industrial La Fundición", tipo: "poligono" },
  { nombre: "Polígono Industrial La Victoria", tipo: "poligono" },
  { nombre: "Polígono Industrial Miranda", tipo: "poligono" },
  { nombre: "Polígono Industrial Puerta de Córdoba", tipo: "poligono" },
  { nombre: "Polígono Industrial Puerta de Madrid", tipo: "poligono" },
  { nombre: "Polígono Industrial Santa Úrsula", tipo: "poligono" },
];

const BARRIOS_UBEDA: ZonaCiudad[] = [
  { nombre: "Ávila Rojas-El Comendador", tipo: "barrio" },
  { nombre: "Barrio del Alcázar", tipo: "barrio" },
  { nombre: "Barrio del Carmen", tipo: "barrio" },
  { nombre: "Barrio de la Algarabía", tipo: "barrio" },
  { nombre: "Barrio de la Cuesta del Gallo", tipo: "barrio" },
  { nombre: "Barrio de San Isidoro", tipo: "barrio" },
  { nombre: "Barrio de San Lorenzo", tipo: "barrio" },
  { nombre: "Barrio de San Millán", tipo: "barrio" },
  { nombre: "Barrio de San Nicolás", tipo: "barrio" },
  { nombre: "Barrio de San Pablo", tipo: "barrio" },
  { nombre: "Barrio de San Pedro", tipo: "barrio" },
  { nombre: "Barrio de San Pedro Nuevo", tipo: "barrio" },
  { nombre: "Barrio de San Marcos", tipo: "barrio" },
  { nombre: "Barrio de Santo Domingo", tipo: "barrio" },
  { nombre: "Barrio de Santo Tomás", tipo: "barrio" },
  { nombre: "Barrio de la Trinidad", tipo: "barrio" },
  { nombre: "El Alamillo", tipo: "barrio" },
  { nombre: "El Egido de San Marcos", tipo: "barrio" },
  { nombre: "El León", tipo: "barrio" },
  { nombre: "La Alameda", tipo: "barrio" },
  { nombre: "La Atalaya", tipo: "barrio" },
  { nombre: "La Explanada", tipo: "barrio" },
  { nombre: "La Guita", tipo: "barrio" },
  { nombre: "Las Canteras", tipo: "barrio" },
  { nombre: "Las Vaguadas", tipo: "barrio" },
  { nombre: "Parque Norte", tipo: "barrio" },
  { nombre: "Puerta del Sol", tipo: "barrio" },
  { nombre: "Torrenueva", tipo: "barrio" },
  { nombre: "Urbanización Bétula", tipo: "barrio" },
  { nombre: "Urbanización El Campillo", tipo: "barrio" },
  { nombre: "Urbanización Huertañalda", tipo: "barrio" },
  { nombre: "Urbanización San Bartolomé", tipo: "barrio" },
  { nombre: "Donadío", tipo: "barrio" },
  { nombre: "San Miguel", tipo: "barrio" },
  { nombre: "Santa Eulalia (Santolaya)", tipo: "barrio" },
  { nombre: "Solana de Torralba", tipo: "barrio" },
  { nombre: "Veracruz", tipo: "barrio" },
];

const POLIGONOS_UBEDA: ZonaCiudad[] = [
  { nombre: "Polígono Agrícola Huertañalda", tipo: "poligono" },
  { nombre: "Polígono Agrícola La Unión", tipo: "poligono" },
  { nombre: "Polígono Industrial La Alberquilla", tipo: "poligono" },
  { nombre: "Polígono Industrial Los Cerros", tipo: "poligono" },
  { nombre: "Polígono Industrial Las Naves (Solana de Torralba)", tipo: "poligono" },
];

const BARRIOS_CORDOBA: ZonaCiudad[] = [
  { nombre: "Alcolea", tipo: "barrio" },
  { nombre: "Arcángel", tipo: "barrio" },
  { nombre: "Arroyo del Moro", tipo: "barrio" },
  { nombre: "Arruzafilla", tipo: "barrio" },
  { nombre: "Asomadilla", tipo: "barrio" },
  { nombre: "Campo de la Merced-Molinos Alta", tipo: "barrio" },
  { nombre: "Campo de la Verdad-Miraflores", tipo: "barrio" },
  { nombre: "Cañero", tipo: "barrio" },
  { nombre: "Cerro Muriano", tipo: "barrio" },
  { nombre: "Cerro de la Golondrina-Salesianos", tipo: "barrio" },
  { nombre: "Cercadilla-Medina Azahara", tipo: "barrio" },
  { nombre: "Ciudad Jardín", tipo: "barrio" },
  { nombre: "El Arenal", tipo: "barrio" },
  { nombre: "El Brillante", tipo: "barrio" },
  { nombre: "El Carmen", tipo: "barrio" },
  { nombre: "El Higuerón", tipo: "barrio" },
  { nombre: "El Naranjo", tipo: "barrio" },
  { nombre: "El Patriarca", tipo: "barrio" },
  { nombre: "El Salvador y la Compañía", tipo: "barrio" },
  { nombre: "El Tablero", tipo: "barrio" },
  { nombre: "Electromecánicas", tipo: "barrio" },
  { nombre: "Fátima", tipo: "barrio" },
  { nombre: "Fray Albino", tipo: "barrio" },
  { nombre: "Fuensantilla-Edisol", tipo: "barrio" },
  { nombre: "Guadalquivir", tipo: "barrio" },
  { nombre: "Huerta de la Marquesa", tipo: "barrio" },
  { nombre: "Huerta de la Reina", tipo: "barrio" },
  { nombre: "Huerta de Santa Isabel", tipo: "barrio" },
  { nombre: "Huerta del Rey-Vallellano", tipo: "barrio" },
  { nombre: "Huerta de San Rafael", tipo: "barrio" },
  { nombre: "La Catedral", tipo: "barrio" },
  { nombre: "La Magdalena", tipo: "barrio" },
  { nombre: "La Trinidad", tipo: "barrio" },
  { nombre: "Las Margaritas", tipo: "barrio" },
  { nombre: "Levante", tipo: "barrio" },
  { nombre: "Los Morales", tipo: "barrio" },
  { nombre: "Miralbaida", tipo: "barrio" },
  { nombre: "Moreras", tipo: "barrio" },
  { nombre: "Ollerías", tipo: "barrio" },
  { nombre: "Olivos Borrachos", tipo: "barrio" },
  { nombre: "Palmeras", tipo: "barrio" },
  { nombre: "Parque Azahara", tipo: "barrio" },
  { nombre: "Parque Cruz Conde", tipo: "barrio" },
  { nombre: "Parque Figueroa", tipo: "barrio" },
  { nombre: "Parque Fidiana", tipo: "barrio" },
  { nombre: "Polígono de Poniente", tipo: "barrio" },
  { nombre: "Polígono de la Fuensanta", tipo: "barrio" },
  { nombre: "San Andrés-San Pablo", tipo: "barrio" },
  { nombre: "San Basilio", tipo: "barrio" },
  { nombre: "San Francisco-Ribera", tipo: "barrio" },
  { nombre: "San Lorenzo", tipo: "barrio" },
  { nombre: "San Miguel-Capuchinos", tipo: "barrio" },
  { nombre: "San Pedro", tipo: "barrio" },
  { nombre: "San Rafael de la Albaida", tipo: "barrio" },
  { nombre: "Santa Cruz", tipo: "barrio" },
  { nombre: "Santa Marina", tipo: "barrio" },
  { nombre: "Santa Rosa", tipo: "barrio" },
  { nombre: "Santuario", tipo: "barrio" },
  { nombre: "Santiago", tipo: "barrio" },
  { nombre: "Sector Sur", tipo: "barrio" },
  { nombre: "Trassierra", tipo: "barrio" },
  { nombre: "Valdeolleros", tipo: "barrio" },
  { nombre: "Villarrubia", tipo: "barrio" },
  { nombre: "Vista Alegre", tipo: "barrio" },
  { nombre: "Viñuela-Rescatado", tipo: "barrio" },
];

const POLIGONOS_CORDOBA: ZonaCiudad[] = [
  { nombre: "Área Logística de Córdoba", tipo: "poligono" },
  { nombre: "Chinales", tipo: "poligono" },
  { nombre: "El Granadal", tipo: "poligono" },
  { nombre: "La Torrecilla", tipo: "poligono" },
  { nombre: "Las Quemadas", tipo: "poligono" },
  { nombre: "Parque Científico-Tecnológico de Córdoba (Rabanales 21)", tipo: "poligono" },
  { nombre: "Parque Empresarial Tecnocórdoba", tipo: "poligono" },
  { nombre: "Parque Joyero de Córdoba", tipo: "poligono" },
  { nombre: "Parque Logístico de Córdoba", tipo: "poligono" },
  { nombre: "Polígono Industrial Amargacena", tipo: "poligono" },
  { nombre: "Polígono Industrial de Poniente", tipo: "poligono" },
];

const BARRIOS_ALICANTE: ZonaCiudad[] = [
  { nombre: "Albufereta", tipo: "barrio" },
  { nombre: "Alipark", tipo: "barrio" },
  { nombre: "Altozano-Conde Lumiares", tipo: "barrio" },
  { nombre: "Bacarot", tipo: "barrio" },
  { nombre: "Babel", tipo: "barrio" },
  { nombre: "Benalúa", tipo: "barrio" },
  { nombre: "Benisaudet", tipo: "barrio" },
  { nombre: "Cabo de las Huertas", tipo: "barrio" },
  { nombre: "Campoamor", tipo: "barrio" },
  { nombre: "Cañada del Fenollar", tipo: "barrio" },
  { nombre: "Carolinas Altas", tipo: "barrio" },
  { nombre: "Carolinas Bajas", tipo: "barrio" },
  { nombre: "Casco Antiguo-Santa Cruz", tipo: "barrio" },
  { nombre: "Centro", tipo: "barrio" },
  { nombre: "Ciudad de Asís", tipo: "barrio" },
  { nombre: "Ciudad Jardín", tipo: "barrio" },
  { nombre: "Colonia Requena", tipo: "barrio" },
  { nombre: "Cuatrocientas Viviendas", tipo: "barrio" },
  { nombre: "Divina Pastora", tipo: "barrio" },
  { nombre: "El Boter-Valle del Sol", tipo: "barrio" },
  { nombre: "El Palmeral", tipo: "barrio" },
  { nombre: "El Portell", tipo: "barrio" },
  { nombre: "Ensanche Diputación", tipo: "barrio" },
  { nombre: "Florida Alta", tipo: "barrio" },
  { nombre: "Florida Baja", tipo: "barrio" },
  { nombre: "Fontcalent", tipo: "barrio" },
  { nombre: "Garbinet", tipo: "barrio" },
  { nombre: "Juan XXIII", tipo: "barrio" },
  { nombre: "La Alcoraya", tipo: "barrio" },
  { nombre: "La Goteta", tipo: "barrio" },
  { nombre: "Lo Morant-San Nicolás de Bari", tipo: "barrio" },
  { nombre: "Los Ángeles", tipo: "barrio" },
  { nombre: "Mercado", tipo: "barrio" },
  { nombre: "Monnegre-Cabeçó d'Or", tipo: "barrio" },
  { nombre: "Moralet", tipo: "barrio" },
  { nombre: "Nueva Tabarca", tipo: "barrio" },
  { nombre: "Nou Alacant-Sidi Ifni", tipo: "barrio" },
  { nombre: "Orgegia", tipo: "barrio" },
  { nombre: "Pla de la Vallonga", tipo: "barrio" },
  { nombre: "Pla del Bon Repós", tipo: "barrio" },
  { nombre: "Playa de San Juan", tipo: "barrio" },
  { nombre: "Polígono Babel", tipo: "barrio" },
  { nombre: "Polígono San Blas", tipo: "barrio" },
  { nombre: "Rabasa", tipo: "barrio" },
  { nombre: "Raval Roig-Virgen del Socorro", tipo: "barrio" },
  { nombre: "Rebolledo", tipo: "barrio" },
  { nombre: "San Agustín", tipo: "barrio" },
  { nombre: "San Antón", tipo: "barrio" },
  { nombre: "San Blas-Santo Domingo", tipo: "barrio" },
  { nombre: "San Gabriel", tipo: "barrio" },
  { nombre: "San Nicolás de Bari", tipo: "barrio" },
  { nombre: "Santa Faz", tipo: "barrio" },
  { nombre: "Tángel", tipo: "barrio" },
  { nombre: "Tómbola", tipo: "barrio" },
  { nombre: "Urbanización Llofriu", tipo: "barrio" },
  { nombre: "Urbanización Lo Xeperut", tipo: "barrio" },
  { nombre: "Urbanova", tipo: "barrio" },
  { nombre: "Verdegás", tipo: "barrio" },
  { nombre: "Villafranqueza", tipo: "barrio" },
  { nombre: "Virgen del Carmen", tipo: "barrio" },
  { nombre: "Virgen del Remedio", tipo: "barrio" },
  { nombre: "Vistahermosa", tipo: "barrio" },
];

const POLIGONOS_ALICANTE: ZonaCiudad[] = [
  { nombre: "Área Industrial Aguamarga", tipo: "poligono" },
  { nombre: "Área Industrial Florida", tipo: "poligono" },
  { nombre: "Mercalicante", tipo: "poligono" },
  { nombre: "Parque Empresarial Atalayas", tipo: "poligono" },
  { nombre: "Polígono Industrial Las Atalayas", tipo: "poligono" },
  { nombre: "Polígono Industrial Pla de la Vallonga", tipo: "poligono" },
  { nombre: "Polígono Industrial Rabasa", tipo: "poligono" },
  { nombre: "Polígono Industrial de Babel", tipo: "poligono" },
  { nombre: "Polígono Industrial de Garrachico", tipo: "poligono" },
  { nombre: "Polígono Industrial de San Blas", tipo: "poligono" },
  { nombre: "Zona Industrial de Agua Amarga", tipo: "poligono" },
];

const BARRIOS_ELCHE: ZonaCiudad[] = [
  { nombre: "Altabix", tipo: "barrio" },
  { nombre: "Altabix Nuevo-Ciudad Deportiva", tipo: "barrio" },
  { nombre: "Avenida de la Libertad", tipo: "barrio" },
  { nombre: "Carrús Este", tipo: "barrio" },
  { nombre: "Carrús Oeste", tipo: "barrio" },
  { nombre: "Casablanca-Porfirio Pascual", tipo: "barrio" },
  { nombre: "Cementerio-Corts Valencianes", tipo: "barrio" },
  { nombre: "Centro-La Vila", tipo: "barrio" },
  { nombre: "El Canal", tipo: "barrio" },
  { nombre: "El Pla", tipo: "barrio" },
  { nombre: "El Raval", tipo: "barrio" },
  { nombre: "El Salvador-La Glorieta", tipo: "barrio" },
  { nombre: "El Toscar", tipo: "barrio" },
  { nombre: "Els Palmerars", tipo: "barrio" },
  { nombre: "Ensanche", tipo: "barrio" },
  { nombre: "Jesuitinas-Ripoll", tipo: "barrio" },
  { nombre: "La Barrera", tipo: "barrio" },
  { nombre: "La Galia", tipo: "barrio" },
  { nombre: "La Llotja", tipo: "barrio" },
  { nombre: "La Torre", tipo: "barrio" },
  { nombre: "L'Algeps-Sagrada Familia", tipo: "barrio" },
  { nombre: "L'Asil", tipo: "barrio" },
  { nombre: "Obispo Siuri", tipo: "barrio" },
  { nombre: "Plaza de Barcelona", tipo: "barrio" },
  { nombre: "Plaza de Castilla", tipo: "barrio" },
  { nombre: "Plaza de Crevillent", tipo: "barrio" },
  { nombre: "Plaza Primero de Mayo", tipo: "barrio" },
  { nombre: "Portes Encarnades", tipo: "barrio" },
  { nombre: "Porfirio Pascual", tipo: "barrio" },
  { nombre: "San Antón", tipo: "barrio" },
  { nombre: "San Crispín", tipo: "barrio" },
  { nombre: "San José", tipo: "barrio" },
  { nombre: "Sant Antoni", tipo: "barrio" },
  { nombre: "Travalón", tipo: "barrio" },
  { nombre: "Universidad", tipo: "barrio" },
  { nombre: "Sector V", tipo: "barrio" },
  { nombre: "Algoda", tipo: "barrio" },
  { nombre: "Algorós", tipo: "barrio" },
  { nombre: "Alzabares Alto", tipo: "barrio" },
  { nombre: "Alzabares Bajo", tipo: "barrio" },
  { nombre: "Asprillas", tipo: "barrio" },
  { nombre: "Arenales del Sol", tipo: "barrio" },
  { nombre: "Balsares", tipo: "barrio" },
  { nombre: "Carrús", tipo: "barrio" },
  { nombre: "Daimés", tipo: "barrio" },
  { nombre: "Derramador", tipo: "barrio" },
  { nombre: "El Altet", tipo: "barrio" },
  { nombre: "Ferriol", tipo: "barrio" },
  { nombre: "Jubalcoy", tipo: "barrio" },
  { nombre: "La Baia Alta", tipo: "barrio" },
  { nombre: "La Baia Baja", tipo: "barrio" },
  { nombre: "La Foia", tipo: "barrio" },
  { nombre: "La Marina", tipo: "barrio" },
  { nombre: "Llano de San José", tipo: "barrio" },
  { nombre: "Maitino", tipo: "barrio" },
  { nombre: "Matola", tipo: "barrio" },
  { nombre: "Peña de las Águilas", tipo: "barrio" },
  { nombre: "Perleta", tipo: "barrio" },
  { nombre: "Pusol", tipo: "barrio" },
  { nombre: "Saladas", tipo: "barrio" },
  { nombre: "Santa Ana", tipo: "barrio" },
  { nombre: "Torrellano Alto", tipo: "barrio" },
  { nombre: "Torrellano Bajo", tipo: "barrio" },
  { nombre: "Valverde Alto", tipo: "barrio" },
  { nombre: "Valverde Bajo", tipo: "barrio" },
  { nombre: "Vallongas", tipo: "barrio" },
];

const POLIGONOS_ELCHE: ZonaCiudad[] = [
  { nombre: "Área Industrial de Carrús", tipo: "poligono" },
  { nombre: "Área Industrial de Altabix", tipo: "poligono" },
  { nombre: "Área Industrial de l'Aljub", tipo: "poligono" },
  { nombre: "Elche Parque Empresarial", tipo: "poligono" },
  { nombre: "Parque Agroalimentario de La Hoya", tipo: "poligono" },
  { nombre: "Parque Científico y Empresarial de la UMH", tipo: "poligono" },
  { nombre: "Parque Industrial de Torrellano", tipo: "poligono" },
  { nombre: "Polígono Industrial de Altabix", tipo: "poligono" },
  { nombre: "Polígono Industrial de Carrús", tipo: "poligono" },
  { nombre: "Polígono Industrial de Faima", tipo: "poligono" },
  { nombre: "Polígono Industrial de Las Saladas", tipo: "poligono" },
  { nombre: "Polígono Industrial de Llano de San José", tipo: "poligono" },
  { nombre: "Polígono Industrial de Matola", tipo: "poligono" },
  { nombre: "Polígono Industrial de Peña de las Águilas", tipo: "poligono" },
];

const BARRIOS_TORREVIEJA: ZonaCiudad[] = [
  { nombre: "Aguas Nuevas", tipo: "barrio" },
  { nombre: "Avenida de las Cortes Valencianas", tipo: "barrio" },
  { nombre: "Cabo Cervera", tipo: "barrio" },
  { nombre: "Cala Dorada", tipo: "barrio" },
  { nombre: "Calas Blancas", tipo: "barrio" },
  { nombre: "Cala del Moro", tipo: "barrio" },
  { nombre: "Centro Urbano", tipo: "barrio" },
  { nombre: "Doña Inés", tipo: "barrio" },
  { nombre: "Edén del Mar", tipo: "barrio" },
  { nombre: "El Acequión", tipo: "barrio" },
  { nombre: "El Chaparral", tipo: "barrio" },
  { nombre: "El Dorado", tipo: "barrio" },
  { nombre: "El Hondo", tipo: "barrio" },
  { nombre: "El Limonar", tipo: "barrio" },
  { nombre: "El Salado", tipo: "barrio" },
  { nombre: "El Torrejón", tipo: "barrio" },
  { nombre: "Jardín del Mar", tipo: "barrio" },
  { nombre: "La Hoya", tipo: "barrio" },
  { nombre: "La Mata", tipo: "barrio" },
  { nombre: "La Manguilla", tipo: "barrio" },
  { nombre: "La Rosaleda", tipo: "barrio" },
  { nombre: "La Siesta", tipo: "barrio" },
  { nombre: "La Torreta I", tipo: "barrio" },
  { nombre: "La Torreta II", tipo: "barrio" },
  { nombre: "La Torreta III", tipo: "barrio" },
  { nombre: "La Torreta Florida", tipo: "barrio" },
  { nombre: "La Veleta", tipo: "barrio" },
  { nombre: "Lago Jardín", tipo: "barrio" },
  { nombre: "Lago Sol", tipo: "barrio" },
  { nombre: "Las Barcas", tipo: "barrio" },
  { nombre: "Las Maravillas", tipo: "barrio" },
  { nombre: "Las Maravillas II", tipo: "barrio" },
  { nombre: "Lomas del Mar", tipo: "barrio" },
  { nombre: "Los Ángeles", tipo: "barrio" },
  { nombre: "Los Balcones", tipo: "barrio" },
  { nombre: "Los Frutales", tipo: "barrio" },
  { nombre: "Los Náufragos", tipo: "barrio" },
  { nombre: "Los Olivos", tipo: "barrio" },
  { nombre: "Mar Azul", tipo: "barrio" },
  { nombre: "Mediterráneo", tipo: "barrio" },
  { nombre: "Miramar", tipo: "barrio" },
  { nombre: "Molino Blanco", tipo: "barrio" },
  { nombre: "Montecarlo", tipo: "barrio" },
  { nombre: "Nueva Torrevieja", tipo: "barrio" },
  { nombre: "Panorama", tipo: "barrio" },
  { nombre: "Parque de las Naciones", tipo: "barrio" },
  { nombre: "Playa del Acequión", tipo: "barrio" },
  { nombre: "Playa de los Locos", tipo: "barrio" },
  { nombre: "Playa del Cura", tipo: "barrio" },
  { nombre: "Playa de los Náufragos", tipo: "barrio" },
  { nombre: "Pozo Dulce", tipo: "barrio" },
  { nombre: "Punta Prima", tipo: "barrio" },
  { nombre: "Rocío del Mar", tipo: "barrio" },
  { nombre: "San Luis", tipo: "barrio" },
  { nombre: "San Roque", tipo: "barrio" },
  { nombre: "Sector 25", tipo: "barrio" },
  { nombre: "Torreblanca", tipo: "barrio" },
  { nombre: "Torre del Moro", tipo: "barrio" },
  { nombre: "Villa Amalia", tipo: "barrio" },
  { nombre: "Villa Vicenta", tipo: "barrio" },
  { nombre: "Villasol", tipo: "barrio" },
];

const POLIGONOS_TORREVIEJA: ZonaCiudad[] = [
  { nombre: "Polígono Industrial Casa Grande", tipo: "poligono" },
  { nombre: "Polígono Industrial Casa Grande II", tipo: "poligono" },
  { nombre: "Polígono Industrial La Hoya", tipo: "poligono" },
  { nombre: "Polígono Industrial Salinas de Torrevieja", tipo: "poligono" },
  { nombre: "Zona Industrial Salinas de Torrevieja", tipo: "poligono" },
  { nombre: "Zona Comercial Habaneras", tipo: "poligono" },
];

const BARRIOS_ORIHUELA: ZonaCiudad[] = [
  { nombre: "Barrio de Capuchinos", tipo: "barrio" },
  { nombre: "Barrio de la Alegría", tipo: "barrio" },
  { nombre: "Barrio de la Ascensión", tipo: "barrio" },
  { nombre: "Barrio de las Angustias", tipo: "barrio" },
  { nombre: "Barrio de las Espeñetas-San Francisco", tipo: "barrio" },
  { nombre: "Barrio de los Calderones", tipo: "barrio" },
  { nombre: "Barrio de los Cristianos", tipo: "barrio" },
  { nombre: "Barrio de los Marines", tipo: "barrio" },
  { nombre: "Barrio de los Morenos", tipo: "barrio" },
  { nombre: "Barrio de los Selmas", tipo: "barrio" },
  { nombre: "Barrio del Palmeral", tipo: "barrio" },
  { nombre: "Barrio de San Antón", tipo: "barrio" },
  { nombre: "Barrio de San Isidro", tipo: "barrio" },
  { nombre: "Barrio de San Juan-La Corredera", tipo: "barrio" },
  { nombre: "Barrio de San Pedro", tipo: "barrio" },
  { nombre: "Barrio de Santo Domingo", tipo: "barrio" },
  { nombre: "Barrio de Triana", tipo: "barrio" },
  { nombre: "Barrionuevo-Calle de Arriba", tipo: "barrio" },
  { nombre: "Casco Histórico", tipo: "barrio" },
  { nombre: "Centro", tipo: "barrio" },
  { nombre: "Ciudad Jardín", tipo: "barrio" },
  { nombre: "Rabaloche", tipo: "barrio" },
  { nombre: "Rincón de Seca", tipo: "barrio" },
  { nombre: "Ocarasa", tipo: "barrio" },
  { nombre: "Arneva", tipo: "barrio" },
  { nombre: "Barbarroja", tipo: "barrio" },
  { nombre: "Camino de Beniel", tipo: "barrio" },
  { nombre: "Camino Viejo de Callosa", tipo: "barrio" },
  { nombre: "Correntías Altas", tipo: "barrio" },
  { nombre: "Correntías Bajas", tipo: "barrio" },
  { nombre: "Correntías Medias", tipo: "barrio" },
  { nombre: "El Escorratel", tipo: "barrio" },
  { nombre: "El Mudamiento", tipo: "barrio" },
  { nombre: "Hurchillo", tipo: "barrio" },
  { nombre: "La Aparecida", tipo: "barrio" },
  { nombre: "La Campaneta", tipo: "barrio" },
  { nombre: "La Matanza", tipo: "barrio" },
  { nombre: "La Murada", tipo: "barrio" },
  { nombre: "Las Norias", tipo: "barrio" },
  { nombre: "Los Desamparados", tipo: "barrio" },
  { nombre: "Los Huertos", tipo: "barrio" },
  { nombre: "Media Legua", tipo: "barrio" },
  { nombre: "Molins", tipo: "barrio" },
  { nombre: "Molino de la Ciudad", tipo: "barrio" },
  { nombre: "Raiguero de Bonanza", tipo: "barrio" },
  { nombre: "Raiguero de Levante", tipo: "barrio" },
  { nombre: "Raiguero de Poniente", tipo: "barrio" },
  { nombre: "San Bartolomé", tipo: "barrio" },
  { nombre: "Torremendo", tipo: "barrio" },
  { nombre: "Orihuela Costa", tipo: "barrio" },
  { nombre: "Aguamarina", tipo: "barrio" },
  { nombre: "Alameda del Mar", tipo: "barrio" },
  { nombre: "Cabo Roig", tipo: "barrio" },
  { nombre: "Campoamor", tipo: "barrio" },
  { nombre: "Castillo de Don Juan", tipo: "barrio" },
  { nombre: "Dehesa de Campoamor", tipo: "barrio" },
  { nombre: "El Barranco", tipo: "barrio" },
  { nombre: "El Presidente", tipo: "barrio" },
  { nombre: "Entrenaranjos", tipo: "barrio" },
  { nombre: "La Florida", tipo: "barrio" },
  { nombre: "La Regia", tipo: "barrio" },
  { nombre: "La Zenia", tipo: "barrio" },
  { nombre: "La Zenia II", tipo: "barrio" },
  { nombre: "Las Filipinas", tipo: "barrio" },
  { nombre: "Las Ramblas", tipo: "barrio" },
  { nombre: "Los Almendros", tipo: "barrio" },
  { nombre: "Los Balcones", tipo: "barrio" },
  { nombre: "Los Dolses", tipo: "barrio" },
  { nombre: "Los Altos", tipo: "barrio" },
  { nombre: "Lomas de Campoamor", tipo: "barrio" },
  { nombre: "Mil Palmeras", tipo: "barrio" },
  { nombre: "Montezenia-Torrezenia", tipo: "barrio" },
  { nombre: "Playa Flamenca I", tipo: "barrio" },
  { nombre: "Playa Flamenca II", tipo: "barrio" },
  { nombre: "Punta Prima", tipo: "barrio" },
  { nombre: "Pueblo Príncipe", tipo: "barrio" },
  { nombre: "Villacosta", tipo: "barrio" },
  { nombre: "Villamartín", tipo: "barrio" },
  { nombre: "Villa Rosa-La Ciñuelica", tipo: "barrio" },
  { nombre: "Vistabella Golf", tipo: "barrio" },
];

const POLIGONOS_ORIHUELA: ZonaCiudad[] = [
  { nombre: "Polígono Industrial Puente Alto", tipo: "poligono" },
  { nombre: "Zona industrial de El Escorratel (área de actividad vinculada a Puente Alto)", tipo: "poligono" },
  { nombre: "Polígono Industrial de La Murada", tipo: "poligono" },
  { nombre: "Zona Industrial junto al sistema ferroviario de Orihuela", tipo: "poligono" },
];

const BARRIOS_BENIDORM: ZonaCiudad[] = [
  { nombre: "Armanello", tipo: "barrio" },
  { nombre: "Avenida Beniardá", tipo: "barrio" },
  { nombre: "Avenida Europa", tipo: "barrio" },
  { nombre: "Avenida Mediterráneo", tipo: "barrio" },
  { nombre: "Barrina Norte", tipo: "barrio" },
  { nombre: "Benidorm Centro", tipo: "barrio" },
  { nombre: "Cala de Benidorm", tipo: "barrio" },
  { nombre: "Casco Antiguo", tipo: "barrio" },
  { nombre: "Colonia Madrid", tipo: "barrio" },
  { nombre: "El Rincón de Loix", tipo: "barrio" },
  { nombre: "Els Tolls", tipo: "barrio" },
  { nombre: "Ensanche Levante", tipo: "barrio" },
  { nombre: "Foietes", tipo: "barrio" },
  { nombre: "La Cala", tipo: "barrio" },
  { nombre: "La Huerta", tipo: "barrio" },
  { nombre: "Levante", tipo: "barrio" },
  { nombre: "L'Horta", tipo: "barrio" },
  { nombre: "Mercasa", tipo: "barrio" },
  { nombre: "Mont Benidorm", tipo: "barrio" },
  { nombre: "Nuevos Juzgados", tipo: "barrio" },
  { nombre: "Poniente", tipo: "barrio" },
  { nombre: "Racó de l'Oix", tipo: "barrio" },
  { nombre: "Rincón Alto", tipo: "barrio" },
  { nombre: "Rincón Bajo", tipo: "barrio" },
  { nombre: "Sierra Helada", tipo: "barrio" },
  { nombre: "Urbanización Coblanca", tipo: "barrio" },
  { nombre: "Urbanización Ciudad Antena", tipo: "barrio" },
  { nombre: "Urbanización Las Lomas", tipo: "barrio" },
  { nombre: "Urbanización Mirador del Mediterráneo", tipo: "barrio" },
  { nombre: "Urbanización Mont Benidorm", tipo: "barrio" },
  { nombre: "Urbanización Playa de Poniente", tipo: "barrio" },
  { nombre: "Zona Centro", tipo: "barrio" },
  { nombre: "Zona Puerto", tipo: "barrio" },
  { nombre: "Zona Playa de Levante", tipo: "barrio" },
];

const POLIGONOS_BENIDORM: ZonaCiudad[] = [
  { nombre: "Área industrial y comercial PP 3/1", tipo: "poligono" },
  { nombre: "Polígono Industrial PP 3/1 «Industrial»", tipo: "poligono" },
];

const BARRIOS_ALCOY: ZonaCiudad[] = [
  { nombre: "Batoi", tipo: "barrio" },
  { nombre: "Baradello Gelat", tipo: "barrio" },
  { nombre: "Baradello de Moya", tipo: "barrio" },
  { nombre: "Centro", tipo: "barrio" },
  { nombre: "El Estepar", tipo: "barrio" },
  { nombre: "Ensanche", tipo: "barrio" },
  { nombre: "Font Roja", tipo: "barrio" },
  { nombre: "La Zona Alta", tipo: "barrio" },
  { nombre: "Montesol", tipo: "barrio" },
  { nombre: "Zona Norte", tipo: "barrio" },
  { nombre: "Santa Rosa", tipo: "barrio" },
  { nombre: "Sol i Camp", tipo: "barrio" },
  { nombre: "Cases del Salt", tipo: "barrio" },
  { nombre: "Sargento", tipo: "barrio" },
];

const POLIGONOS_ALCOY: ZonaCiudad[] = [
  { nombre: "Cotes Altes", tipo: "poligono" },
  { nombre: "Cotes Baixes", tipo: "poligono" },
  { nombre: "El Castellar", tipo: "poligono" },
  { nombre: "El Clérigo", tipo: "poligono" },
  { nombre: "La Beniata", tipo: "poligono" },
  { nombre: "Santiago Payá-Sant Benet", tipo: "poligono" },
];

const BARRIOS_SAN_VICENTE: ZonaCiudad[] = [
  { nombre: "Alcalde Felipe Mallol", tipo: "barrio" },
  { nombre: "Barrio de Santa Isabel", tipo: "barrio" },
  { nombre: "Boqueres", tipo: "barrio" },
  { nombre: "Centro", tipo: "barrio" },
  { nombre: "Colonia de Santa Isabel", tipo: "barrio" },
  { nombre: "El Gantxo", tipo: "barrio" },
  { nombre: "El Tubo", tipo: "barrio" },
  { nombre: "Haygón", tipo: "barrio" },
  { nombre: "Laborinquen", tipo: "barrio" },
  { nombre: "Les Escoles-Lo Ramos", tipo: "barrio" },
  { nombre: "Los Girasoles", tipo: "barrio" },
  { nombre: "Los Manchegos", tipo: "barrio" },
  { nombre: "L'Advocat", tipo: "barrio" },
  { nombre: "Pla Contxeta", tipo: "barrio" },
  { nombre: "Pla Olivera", tipo: "barrio" },
  { nombre: "Puerta Verde", tipo: "barrio" },
  { nombre: "Ras-Pas", tipo: "barrio" },
  { nombre: "Sol y Luz", tipo: "barrio" },
  { nombre: "Villamontes", tipo: "barrio" },
  { nombre: "Zona Universidad", tipo: "barrio" },
];

const POLIGONOS_SAN_VICENTE: ZonaCiudad[] = [
  { nombre: "Polígono Industrial Canastell", tipo: "poligono" },
  { nombre: "Polígono Industrial Inmediaciones", tipo: "poligono" },
  { nombre: "Polígono Industrial Las Tejas", tipo: "poligono" },
  { nombre: "Polígono Industrial Rodalet", tipo: "poligono" },
  { nombre: "Polígono Industrial Torregroses", tipo: "poligono" },
];

const BARRIOS_ELDA: ZonaCiudad[] = [
  { nombre: "Agualejas", tipo: "barrio" },
  { nombre: "Almafrá", tipo: "barrio" },
  { nombre: "Avenida del Mediterráneo", tipo: "barrio" },
  { nombre: "Caliú", tipo: "barrio" },
  { nombre: "Casco Antiguo", tipo: "barrio" },
  { nombre: "Ciudad Vergel", tipo: "barrio" },
  { nombre: "El Huerto", tipo: "barrio" },
  { nombre: "El Progreso", tipo: "barrio" },
  { nombre: "Estación", tipo: "barrio" },
  { nombre: "Huerta Nueva", tipo: "barrio" },
  { nombre: "La Ficia", tipo: "barrio" },
  { nombre: "La Fraternidad", tipo: "barrio" },
  { nombre: "La Melva", tipo: "barrio" },
  { nombre: "La Prosperidad", tipo: "barrio" },
  { nombre: "La Tafalera", tipo: "barrio" },
  { nombre: "La Torreta", tipo: "barrio" },
  { nombre: "Las Aguarejas", tipo: "barrio" },
  { nombre: "Las 300", tipo: "barrio" },
  { nombre: "Molinos de Félix", tipo: "barrio" },
  { nombre: "Nueva Fraternidad", tipo: "barrio" },
  { nombre: "Numancia-Tenerías", tipo: "barrio" },
  { nombre: "Plaza de Toros", tipo: "barrio" },
  { nombre: "Ronda-Sector 9", tipo: "barrio" },
  { nombre: "San Francisco de Sales", tipo: "barrio" },
  { nombre: "Trinquete", tipo: "barrio" },
  { nombre: "Virgen de la Cabeza", tipo: "barrio" },
  { nombre: "Virgen de la Salud", tipo: "barrio" },
  { nombre: "Zona Centro", tipo: "barrio" },
];

const POLIGONOS_ELDA: ZonaCiudad[] = [
  { nombre: "Polígono Industrial Campo Alto", tipo: "poligono" },
  { nombre: "Polígono Industrial Finca Lacy", tipo: "poligono" },
  { nombre: "Polígono Industrial Finca Lacy, segunda fase", tipo: "poligono" },
  { nombre: "Polígono Industrial La Torreta-Río", tipo: "poligono" },
];

const BARRIOS_DENIA: ZonaCiudad[] = [
  { nombre: "Baix la Mar", tipo: "barrio" },
  { nombre: "Baix la Mar-Darrere del Castell", tipo: "barrio" },
  { nombre: "Campaments", tipo: "barrio" },
  { nombre: "Camp Roig", tipo: "barrio" },
  { nombre: "Centro-Port", tipo: "barrio" },
  { nombre: "Darrere del Castell", tipo: "barrio" },
  { nombre: "Diana-Faroleta", tipo: "barrio" },
  { nombre: "Jesús Pobre", tipo: "barrio" },
  { nombre: "La Jara (La Xara)", tipo: "barrio" },
  { nombre: "La Pedrera", tipo: "barrio" },
  { nombre: "Les Bassetes", tipo: "barrio" },
  { nombre: "Les Brises", tipo: "barrio" },
  { nombre: "Les Deveses", tipo: "barrio" },
  { nombre: "Les Marines", tipo: "barrio" },
  { nombre: "Les Rotes", tipo: "barrio" },
  { nombre: "Les Roques", tipo: "barrio" },
  { nombre: "Les Fonts", tipo: "barrio" },
  { nombre: "Montgó", tipo: "barrio" },
  { nombre: "Oeste-Campaments", tipo: "barrio" },
  { nombre: "París-Pedrera", tipo: "barrio" },
  { nombre: "Port-Centre", tipo: "barrio" },
  { nombre: "Saladar", tipo: "barrio" },
  { nombre: "Torrecremada", tipo: "barrio" },
  { nombre: "La Plana", tipo: "barrio" },
  { nombre: "La Sella", tipo: "barrio" },
  { nombre: "La Florida", tipo: "barrio" },
  { nombre: "El Palmar", tipo: "barrio" },
  { nombre: "Las Marinas", tipo: "barrio" },
  { nombre: "Les Bovetes", tipo: "barrio" },
  { nombre: "Les Marines Nord", tipo: "barrio" },
  { nombre: "Les Marines Sud", tipo: "barrio" },
  { nombre: "L'Almadrava", tipo: "barrio" },
  { nombre: "L'Estanyó", tipo: "barrio" },
  { nombre: "Punta dels Molins", tipo: "barrio" },
  { nombre: "Deveses-Bassot", tipo: "barrio" },
  { nombre: "La Marineta Cassiana", tipo: "barrio" },
  { nombre: "Santa Llúcia", tipo: "barrio" },
  { nombre: "Tossal Gross", tipo: "barrio" },
  { nombre: "La Xara", tipo: "barrio" },
];

const POLIGONOS_DENIA: ZonaCiudad[] = [
  { nombre: "Polígono Industrial Les Madrigueres-Juyarco", tipo: "poligono" },
  { nombre: "Polígono Industrial de Dénia (CV-725)", tipo: "poligono" },
  { nombre: "Área Industrial Madrigueres Sud", tipo: "poligono" },
  { nombre: "Área Industrial Madrigueres Nord", tipo: "poligono" },
];

const BARRIOS_SANTA_POLA: ZonaCiudad[] = [
  { nombre: "Casco Antiguo", tipo: "barrio" },
  { nombre: "Centro", tipo: "barrio" },
  { nombre: "Gran Alacant", tipo: "barrio" },
  { nombre: "Gran Playa", tipo: "barrio" },
  { nombre: "Hacienda del Barrio", tipo: "barrio" },
  { nombre: "La Calera", tipo: "barrio" },
  { nombre: "La Cadena", tipo: "barrio" },
  { nombre: "La Marina", tipo: "barrio" },
  { nombre: "Playa Lisa", tipo: "barrio" },
  { nombre: "Playa Tamarit", tipo: "barrio" },
  { nombre: "Pueblo Levantino", tipo: "barrio" },
  { nombre: "Punta La Sierra", tipo: "barrio" },
  { nombre: "Santa Pola del Este", tipo: "barrio" },
  { nombre: "Tamarit", tipo: "barrio" },
  { nombre: "Varadero", tipo: "barrio" },
  { nombre: "Zona de Levante", tipo: "barrio" },
  { nombre: "Zona de Poniente", tipo: "barrio" },
  { nombre: "Ensanche de Levante", tipo: "barrio" },
  { nombre: "Ensanche de Poniente", tipo: "barrio" },
  { nombre: "Ensanche del Mar", tipo: "barrio" },
  { nombre: "Ensanche Varadero", tipo: "barrio" },
  { nombre: "Paseo Santiago Bernabéu", tipo: "barrio" },
  { nombre: "Calvario", tipo: "barrio" },
  { nombre: "Anillo Sorolla", tipo: "barrio" },
  { nombre: "Portus Ilicitanus", tipo: "barrio" },
  { nombre: "Salinas", tipo: "barrio" },
  { nombre: "Meleja", tipo: "barrio" },
  { nombre: "Els Siprerets", tipo: "barrio" },
];

const POLIGONOS_SANTA_POLA: ZonaCiudad[] = [
  { nombre: "Polígono Industrial IN-2", tipo: "poligono" },
  { nombre: "Polígono Industrial de Santa Pola", tipo: "poligono" },
  { nombre: "Zona Industrial Urbana", tipo: "poligono" },
  { nombre: "Zona Industrial de la carretera de Elche", tipo: "poligono" },
];

const BARRIOS_VILLAJOYOSA: ZonaCiudad[] = [
  { nombre: "Almadrava", tipo: "barrio" },
  { nombre: "Barberes", tipo: "barrio" },
  { nombre: "Barri dels Pescadors", tipo: "barrio" },
  { nombre: "Cala de Finestrat", tipo: "barrio" },
  { nombre: "Cala Saladar", tipo: "barrio" },
  { nombre: "Cala Torres", tipo: "barrio" },
  { nombre: "Casco Antiguo", tipo: "barrio" },
  { nombre: "Centro Histórico", tipo: "barrio" },
  { nombre: "El Paradís", tipo: "barrio" },
  { nombre: "El Torres", tipo: "barrio" },
  { nombre: "Europark", tipo: "barrio" },
  { nombre: "Galandú", tipo: "barrio" },
  { nombre: "Garden Curt-La Paloma", tipo: "barrio" },
  { nombre: "La Cala", tipo: "barrio" },
  { nombre: "La Ermita de San Antonio", tipo: "barrio" },
  { nombre: "La Malladeta", tipo: "barrio" },
  { nombre: "La Tellerola", tipo: "barrio" },
  { nombre: "Montíboli", tipo: "barrio" },
  { nombre: "Montesol", tipo: "barrio" },
  { nombre: "Poble Nou", tipo: "barrio" },
  { nombre: "Plans-Gasparot", tipo: "barrio" },
  { nombre: "Puntas del Moro", tipo: "barrio" },
  { nombre: "Racó de Conill", tipo: "barrio" },
  { nombre: "Secanet", tipo: "barrio" },
  { nombre: "Serrano", tipo: "barrio" },
  { nombre: "Torres I", tipo: "barrio" },
  { nombre: "Torres II", tipo: "barrio" },
  { nombre: "Xarco", tipo: "barrio" },
  { nombre: "Urbanización Charco", tipo: "barrio" },
  { nombre: "Urbanización Sainvi", tipo: "barrio" },
  { nombre: "Urbanización Terramar", tipo: "barrio" },
  { nombre: "Urbanización Villajoyosa Paradís", tipo: "barrio" },
  { nombre: "Urbanización Villagrande", tipo: "barrio" },
  { nombre: "Urbanización Blanca", tipo: "barrio" },
  { nombre: "Urbanización Azaleas", tipo: "barrio" },
  { nombre: "Urbanización Mirador de la Malladeta", tipo: "barrio" },
];

const POLIGONOS_VILLAJOYOSA: ZonaCiudad[] = [
  { nombre: "Área Industrial de la Avenida de Finestrat", tipo: "poligono" },
  { nombre: "Área Industrial El Torres", tipo: "poligono" },
  { nombre: "Área Industrial Poble Nou-Camino Viejo de Valencia", tipo: "poligono" },
  { nombre: "Parc Empresarial El Torres", tipo: "poligono" },
  { nombre: "Polígono Industrial PP-33 Bulevar", tipo: "poligono" },
  { nombre: "Zona Industrial de la N-332", tipo: "poligono" },
];

const BARRIOS_VILLENA: ZonaCiudad[] = [
  { nombre: "Barrio de la Música", tipo: "barrio" },
  { nombre: "Barrio de San Antón", tipo: "barrio" },
  { nombre: "Barrio de San Francisco", tipo: "barrio" },
  { nombre: "Barrio de las Cruces", tipo: "barrio" },
  { nombre: "Barrio de las Morerías", tipo: "barrio" },
  { nombre: "Barrio de la Paz", tipo: "barrio" },
  { nombre: "Barrio del Carril", tipo: "barrio" },
  { nombre: "Barrio del Grec", tipo: "barrio" },
  { nombre: "Barrio del Mercado", tipo: "barrio" },
  { nombre: "Barrio del Rabal", tipo: "barrio" },
  { nombre: "Bulevar Maestro Carrascosa", tipo: "barrio" },
  { nombre: "El Calvario", tipo: "barrio" },
  { nombre: "El Poblao", tipo: "barrio" },
  { nombre: "La Encina", tipo: "barrio" },
  { nombre: "La Morenica", tipo: "barrio" },
  { nombre: "Las Virtudes", tipo: "barrio" },
  { nombre: "San Benito", tipo: "barrio" },
  { nombre: "San Juan", tipo: "barrio" },
  { nombre: "Santa María", tipo: "barrio" },
  { nombre: "Zona Centro", tipo: "barrio" },
  { nombre: "Zona del Mercado", tipo: "barrio" },
  { nombre: "Zona de la Estación", tipo: "barrio" },
  { nombre: "La Zafra", tipo: "barrio" },
  { nombre: "Las Tiesas", tipo: "barrio" },
  { nombre: "La Gloria", tipo: "barrio" },
  { nombre: "Casas de Cabanes y Las Fuentes", tipo: "barrio" },
  { nombre: "Casas de Jordán", tipo: "barrio" },
  { nombre: "Cascante", tipo: "barrio" },
  { nombre: "Las Chozas", tipo: "barrio" },
  { nombre: "El Morrón", tipo: "barrio" },
  { nombre: "La Puentecilla", tipo: "barrio" },
  { nombre: "San Bernabé", tipo: "barrio" },
  { nombre: "Santa Eulalia", tipo: "barrio" },
];

const POLIGONOS_VILLENA: ZonaCiudad[] = [
  { nombre: "Parque Empresarial Bulilla", tipo: "poligono" },
  { nombre: "Polígono Industrial El Rubial I", tipo: "poligono" },
  { nombre: "Polígono Industrial El Rubial II-Casa del Padre", tipo: "poligono" },
  { nombre: "Polígono Industrial La Condomina", tipo: "poligono" },
  { nombre: "Zona de Servicios de la Autovía A-31", tipo: "poligono" },
];

const BARRIOS_PETRER: ZonaCiudad[] = [
  { nombre: "Almafrà", tipo: "barrio" },
  { nombre: "Almafrà Centro", tipo: "barrio" },
  { nombre: "Barrio de La Frontera", tipo: "barrio" },
  { nombre: "Barrio de La Isla", tipo: "barrio" },
  { nombre: "Barrio de Los Olivos", tipo: "barrio" },
  { nombre: "Barrio de San Rafael", tipo: "barrio" },
  { nombre: "Bassa Perico", tipo: "barrio" },
  { nombre: "Campico", tipo: "barrio" },
  { nombre: "Cervantes", tipo: "barrio" },
  { nombre: "Chimeneas", tipo: "barrio" },
  { nombre: "El Campet", tipo: "barrio" },
  { nombre: "El Paso", tipo: "barrio" },
  { nombre: "Els Platans", tipo: "barrio" },
  { nombre: "Ensanche", tipo: "barrio" },
  { nombre: "Felipe V", tipo: "barrio" },
  { nombre: "Guirney", tipo: "barrio" },
  { nombre: "La Canal", tipo: "barrio" },
  { nombre: "La Horteta", tipo: "barrio" },
  { nombre: "La Molineta", tipo: "barrio" },
  { nombre: "La Loma Badá", tipo: "barrio" },
  { nombre: "La Senyora", tipo: "barrio" },
  { nombre: "Los Cipreses", tipo: "barrio" },
  { nombre: "Los Pinos", tipo: "barrio" },
  { nombre: "Lloma Bada", tipo: "barrio" },
  { nombre: "Médico Luis Sempere", tipo: "barrio" },
  { nombre: "Palomaret", tipo: "barrio" },
  { nombre: "Parque San Rafael", tipo: "barrio" },
  { nombre: "Salinetas", tipo: "barrio" },
  { nombre: "San Jerónimo", tipo: "barrio" },
  { nombre: "Centro Histórico", tipo: "barrio" },
  { nombre: "La Frontera", tipo: "barrio" },
  { nombre: "Caprala", tipo: "barrio" },
  { nombre: "Coves del Riu", tipo: "barrio" },
];

const POLIGONOS_PETRER: ZonaCiudad[] = [
  { nombre: "Polígono Industrial Acceso a Salinetas", tipo: "poligono" },
  { nombre: "Polígono Industrial Avenida del Mediterráneo", tipo: "poligono" },
  { nombre: "Polígono Industrial Guirney-San Rafael", tipo: "poligono" },
  { nombre: "Polígono Industrial La Cantera", tipo: "poligono" },
  { nombre: "Polígono Industrial Les Pedreres", tipo: "poligono" },
  { nombre: "Polígono Industrial Salinetas", tipo: "poligono" },
  { nombre: "Polígono Industrial de Balsa del Moro", tipo: "poligono" },
  { nombre: "Polígono Industrial de Barchell", tipo: "poligono" },
];

const BARRIOS_EL_CAMPELLO: ZonaCiudad[] = [
  { nombre: "Alkabir", tipo: "barrio" },
  { nombre: "Almadraba", tipo: "barrio" },
  { nombre: "Amerador (L'Amerador)", tipo: "barrio" },
  { nombre: "Ballestera", tipo: "barrio" },
  { nombre: "Banyets (Els Banyets)", tipo: "barrio" },
  { nombre: "Barri Bonny", tipo: "barrio" },
  { nombre: "Barri Vell", tipo: "barrio" },
  { nombre: "Bonalba", tipo: "barrio" },
  { nombre: "Bonalba Alta", tipo: "barrio" },
  { nombre: "Bonalba Baja", tipo: "barrio" },
  { nombre: "Bonanza", tipo: "barrio" },
  { nombre: "Cala d'Or", tipo: "barrio" },
  { nombre: "Colonia Trinidad", tipo: "barrio" },
  { nombre: "Coveta Fumà", tipo: "barrio" },
  { nombre: "Cotoveta", tipo: "barrio" },
  { nombre: "El Carritxal", tipo: "barrio" },
  { nombre: "El Campello Centro", tipo: "barrio" },
  { nombre: "El Mesell", tipo: "barrio" },
  { nombre: "El Poblet", tipo: "barrio" },
  { nombre: "La Merced", tipo: "barrio" },
  { nombre: "La Pinella", tipo: "barrio" },
  { nombre: "La Porcha", tipo: "barrio" },
  { nombre: "La Pismella", tipo: "barrio" },
  { nombre: "La Coveta Fumada", tipo: "barrio" },
  { nombre: "La Illeta", tipo: "barrio" },
  { nombre: "La Almadraba", tipo: "barrio" },
  { nombre: "Las Mezquitas", tipo: "barrio" },
  { nombre: "Les Penyetes", tipo: "barrio" },
  { nombre: "Llano de los Pastores", tipo: "barrio" },
  { nombre: "Lloixa", tipo: "barrio" },
  { nombre: "Muchavista", tipo: "barrio" },
  { nombre: "Pueblo Acantilado", tipo: "barrio" },
  { nombre: "Pueblo Español", tipo: "barrio" },
  { nombre: "San Ramón", tipo: "barrio" },
  { nombre: "Valle Dorado", tipo: "barrio" },
  { nombre: "Valle Fondo", tipo: "barrio" },
  { nombre: "Venta Lanuza", tipo: "barrio" },
  { nombre: "Urbanización Cabo Azul", tipo: "barrio" },
  { nombre: "Urbanización Cabo Mar", tipo: "barrio" },
  { nombre: "Urbanización Cabo Verde", tipo: "barrio" },
  { nombre: "Urbanización Los Patos", tipo: "barrio" },
  { nombre: "Urbanización Mutxavista", tipo: "barrio" },
];

const POLIGONOS_EL_CAMPELLO: ZonaCiudad[] = [
  { nombre: "Polígono Industrial El Pla del Mesell", tipo: "poligono" },
  { nombre: "Polígono Industrial San Ramón", tipo: "poligono" },
  { nombre: "Polígono Industrial Sector L-3", tipo: "poligono" },
  { nombre: "Puerto Pesquero de El Campello", tipo: "poligono" },
];

const BARRIOS_CREVILLENT: ZonaCiudad[] = [
  { nombre: "Barranquet", tipo: "barrio" },
  { nombre: "Barrio de la Estación", tipo: "barrio" },
  { nombre: "Barrio del Pont", tipo: "barrio" },
  { nombre: "Coves Oest", tipo: "barrio" },
  { nombre: "El Realengo", tipo: "barrio" },
  { nombre: "La Morería", tipo: "barrio" },
  { nombre: "La Salut", tipo: "barrio" },
  { nombre: "Las Casicas", tipo: "barrio" },
  { nombre: "Núcleo Centro", tipo: "barrio" },
  { nombre: "Rincón de los Pablos", tipo: "barrio" },
  { nombre: "San Felipe Neri", tipo: "barrio" },
  { nombre: "San Rafael", tipo: "barrio" },
  { nombre: "Vila Vella", tipo: "barrio" },
];

const POLIGONOS_CREVILLENT: ZonaCiudad[] = [
  { nombre: "Cachapets", tipo: "poligono" },
  { nombre: "Crevillent Industrial", tipo: "poligono" },
  { nombre: "El Boch (I-6 / I-7)", tipo: "poligono" },
  { nombre: "Faima", tipo: "poligono" },
  { nombre: "Industrial Este", tipo: "poligono" },
  { nombre: "Industrial Oeste", tipo: "poligono" },
  { nombre: "I-1, I-2 e I-3", tipo: "poligono" },
  { nombre: "I-4 (La Estación)", tipo: "poligono" },
  { nombre: "I-8", tipo: "poligono" },
  { nombre: "Imperial", tipo: "poligono" },
  { nombre: "La Cerámica (Cerámica de la Asunción)", tipo: "poligono" },
];

const BARRIOS_JAVEA: ZonaCiudad[] = [
  { nombre: "Adsubia", tipo: "barrio" },
  { nombre: "Arenal", tipo: "barrio" },
  { nombre: "Avenida Augusta", tipo: "barrio" },
  { nombre: "Balcón al Mar", tipo: "barrio" },
  { nombre: "Benimadrocs", tipo: "barrio" },
  { nombre: "Cala Blanca", tipo: "barrio" },
  { nombre: "Cala del Portitxol", tipo: "barrio" },
  { nombre: "Cala Granadella", tipo: "barrio" },
  { nombre: "Camí Cabanes", tipo: "barrio" },
  { nombre: "Camí de la Fontana", tipo: "barrio" },
  { nombre: "Cap Martí", tipo: "barrio" },
  { nombre: "Cap Negre", tipo: "barrio" },
  { nombre: "Capsades", tipo: "barrio" },
  { nombre: "Castellans", tipo: "barrio" },
  { nombre: "Cansalades", tipo: "barrio" },
  { nombre: "Costa Nova", tipo: "barrio" },
  { nombre: "Costa Nova Panorama", tipo: "barrio" },
  { nombre: "Cuesta de San Antonio", tipo: "barrio" },
  { nombre: "Duanes de la Mar", tipo: "barrio" },
  { nombre: "El Rafalet", tipo: "barrio" },
  { nombre: "El Piver", tipo: "barrio" },
  { nombre: "El Pla", tipo: "barrio" },
  { nombre: "El Portichol", tipo: "barrio" },
  { nombre: "El Tosalet", tipo: "barrio" },
  { nombre: "Ermita", tipo: "barrio" },
  { nombre: "Granadella", tipo: "barrio" },
  { nombre: "La Corona", tipo: "barrio" },
  { nombre: "La Lluca", tipo: "barrio" },
  { nombre: "La Mandarina", tipo: "barrio" },
  { nombre: "La Plana", tipo: "barrio" },
  { nombre: "Las Laderas", tipo: "barrio" },
  { nombre: "Les Sorts", tipo: "barrio" },
  { nombre: "Los Molinos", tipo: "barrio" },
  { nombre: "Montgó", tipo: "barrio" },
  { nombre: "Monte Olimpo", tipo: "barrio" },
  { nombre: "Monte Jávéa", tipo: "barrio" },
  { nombre: "Pinosol", tipo: "barrio" },
  { nombre: "Pinomar", tipo: "barrio" },
  { nombre: "Portitxol", tipo: "barrio" },
  { nombre: "Puchol", tipo: "barrio" },
  { nombre: "Puerto", tipo: "barrio" },
  { nombre: "Rebaldi", tipo: "barrio" },
  { nombre: "Senioles", tipo: "barrio" },
  { nombre: "Sol del Este", tipo: "barrio" },
  { nombre: "Tarraula", tipo: "barrio" },
  { nombre: "Tesoro Park", tipo: "barrio" },
  { nombre: "Toscamar", tipo: "barrio" },
  { nombre: "Toscal", tipo: "barrio" },
  { nombre: "Valle del Sol", tipo: "barrio" },
  { nombre: "Villes del Vent", tipo: "barrio" },
  { nombre: "Xàbia Histórica", tipo: "barrio" },
];

const POLIGONOS_JAVEA: ZonaCiudad[] = [
  { nombre: "Polígono Industrial Catarrojes", tipo: "poligono" },
  { nombre: "Polígono Industrial de la Carretera de Gata", tipo: "poligono" },
  { nombre: "Zona Empresarial de Les Cansalades", tipo: "poligono" },
  { nombre: "Zona Comercial y Empresarial del Arenal", tipo: "poligono" },
  { nombre: "Zona Comercial y Empresarial del Puerto", tipo: "poligono" },
];

const BARRIOS_HUESCA: ZonaCiudad[] = [
  { nombre: "Barrio de la Catedral", tipo: "barrio" },
  { nombre: "Barrio de San Francisco de Asís", tipo: "barrio" },
  { nombre: "Barrio de San José", tipo: "barrio" },
  { nombre: "Barrio de San Lorenzo", tipo: "barrio" },
  { nombre: "Barrio de San Pedro", tipo: "barrio" },
  { nombre: "Barrio de Santiago", tipo: "barrio" },
  { nombre: "Barrio de Santo Domingo y San Martín", tipo: "barrio" },
  { nombre: "Barrio de la Encarnación", tipo: "barrio" },
  { nombre: "Barrio del Perpetuo Socorro", tipo: "barrio" },
  { nombre: "Barrio de María Auxiliadora", tipo: "barrio" },
  { nombre: "Casco Antiguo", tipo: "barrio" },
  { nombre: "Ciudad Jardín", tipo: "barrio" },
  { nombre: "Estrecho Quinto", tipo: "barrio" },
  { nombre: "Polígono 25", tipo: "barrio" },
  { nombre: "Polígono 29", tipo: "barrio" },
  { nombre: "Zona Avenida de la Paz", tipo: "barrio" },
  { nombre: "Zona Avenida Pirineos", tipo: "barrio" },
  { nombre: "Zona del Parque", tipo: "barrio" },
  { nombre: "Zona del Cerro de San Jorge", tipo: "barrio" },
  { nombre: "Zona de los Olivos", tipo: "barrio" },
  { nombre: "Zona de la Universidad", tipo: "barrio" },
  { nombre: "Zona de los Porches de Galicia", tipo: "barrio" },
];

const POLIGONOS_HUESCA: ZonaCiudad[] = [
  { nombre: "Parque Tecnológico Walqa", tipo: "poligono" },
  { nombre: "Plataforma Logística Huesca Sur (PLHUS)", tipo: "poligono" },
  { nombre: "Polígono Industrial Huesca Industrial (SEPES)", tipo: "poligono" },
  { nombre: "Polígono Industrial La Magantina", tipo: "poligono" },
  { nombre: "Polígono Industrial Martínez de Velasco (polígonos 26 y 27)", tipo: "poligono" },
  { nombre: "Polígono Industrial Monzú", tipo: "poligono" },
];

const BARRIOS_TERUEL: ZonaCiudad[] = [
  { nombre: "Aldehuela", tipo: "barrio" },
  { nombre: "Arrabal-Carrel", tipo: "barrio" },
  { nombre: "Castralvo", tipo: "barrio" },
  { nombre: "Caudé", tipo: "barrio" },
  { nombre: "Centro Histórico", tipo: "barrio" },
  { nombre: "El Campillo", tipo: "barrio" },
  { nombre: "Ensanche", tipo: "barrio" },
  { nombre: "Fuenfresca", tipo: "barrio" },
  { nombre: "Las Viñas", tipo: "barrio" },
  { nombre: "San Blas", tipo: "barrio" },
  { nombre: "San Julián", tipo: "barrio" },
  { nombre: "San León", tipo: "barrio" },
  { nombre: "Concud", tipo: "barrio" },
  { nombre: "Tortajada", tipo: "barrio" },
  { nombre: "Valdecebro", tipo: "barrio" },
  { nombre: "Villalba Baja", tipo: "barrio" },
  { nombre: "Villaspesa", tipo: "barrio" },
];

const POLIGONOS_TERUEL: ZonaCiudad[] = [
  { nombre: "Parque Empresarial La Paz", tipo: "poligono" },
  { nombre: "Plataforma Aeroportuaria de Teruel (PLATA)", tipo: "poligono" },
  { nombre: "Plataforma Logístico-Industrial de Teruel (PLATEA)", tipo: "poligono" },
];

const BARRIOS_TOLEDO: ZonaCiudad[] = [
  { nombre: "Antequeruela-Covachuelas", tipo: "barrio" },
  { nombre: "Azucaica", tipo: "barrio" },
  { nombre: "Barrio de los Conventos", tipo: "barrio" },
  { nombre: "Buenavista", tipo: "barrio" },
  { nombre: "Casco Histórico", tipo: "barrio" },
  { nombre: "Cigarrales", tipo: "barrio" },
  { nombre: "Cerro de los Palos", tipo: "barrio" },
  { nombre: "El Beato", tipo: "barrio" },
  { nombre: "La Abadía", tipo: "barrio" },
  { nombre: "La Bastida", tipo: "barrio" },
  { nombre: "La Legua", tipo: "barrio" },
  { nombre: "Montesión", tipo: "barrio" },
  { nombre: "Olivar de los Pozos", tipo: "barrio" },
  { nombre: "Palomarejos", tipo: "barrio" },
  { nombre: "San Antón-Avenida de Europa", tipo: "barrio" },
  { nombre: "San Bernardo", tipo: "barrio" },
  { nombre: "San Martín", tipo: "barrio" },
  { nombre: "San Pedro el Verde", tipo: "barrio" },
  { nombre: "Santa Bárbara", tipo: "barrio" },
  { nombre: "Santa María de Benquerencia (zona residencial)", tipo: "barrio" },
  { nombre: "Santa Teresa-Reconquista", tipo: "barrio" },
  { nombre: "Tres Culturas-Finca Buenavista", tipo: "barrio" },
  { nombre: "Valparaíso", tipo: "barrio" },
  { nombre: "Vega Baja", tipo: "barrio" },
  { nombre: "Vistahermosa", tipo: "barrio" },
  { nombre: "Circo Romano", tipo: "barrio" },
  { nombre: "Urbanización Casa de Campo", tipo: "barrio" },
  { nombre: "Urbanización Parque Universidad", tipo: "barrio" },
  { nombre: "La Sisla", tipo: "barrio" },
];

const POLIGONOS_TOLEDO: ZonaCiudad[] = [
  { nombre: "Polígono Industrial de Santa María de Benquerencia", tipo: "poligono" },
  { nombre: "Polígono Industrial de Toledo", tipo: "poligono" },
  { nombre: "Polígono Industrial Ventalomar", tipo: "poligono" },
  { nombre: "Polígono Industrial de la carretera de Madrid", tipo: "poligono" },
  { nombre: "Parque Empresarial de la Abadía", tipo: "poligono" },
];

const BARRIOS_TALAVERA: ZonaCiudad[] = [
  { nombre: "El Carmen", tipo: "barrio" },
  { nombre: "El Esparragal", tipo: "barrio" },
  { nombre: "El Faro", tipo: "barrio" },
  { nombre: "El Parque", tipo: "barrio" },
  { nombre: "Fray Hernando", tipo: "barrio" },
  { nombre: "Gamonal", tipo: "barrio" },
  { nombre: "Jardines del Prado-Ferial", tipo: "barrio" },
  { nombre: "La Alameda", tipo: "barrio" },
  { nombre: "La Esperanza-Paredón", tipo: "barrio" },
  { nombre: "La Milagrosa", tipo: "barrio" },
  { nombre: "La Solana", tipo: "barrio" },
  { nombre: "Las Moreras", tipo: "barrio" },
  { nombre: "Patrocinio", tipo: "barrio" },
  { nombre: "Patrocinio San José", tipo: "barrio" },
  { nombre: "Puente Romano-San Antonio", tipo: "barrio" },
  { nombre: "Puerta de Cuartos-Ruiz de Luna", tipo: "barrio" },
  { nombre: "Puerta de Zamora", tipo: "barrio" },
  { nombre: "San Jerónimo", tipo: "barrio" },
  { nombre: "Santa María", tipo: "barrio" },
  { nombre: "Urbanización Almoheda", tipo: "barrio" },
  { nombre: "Urbanización Chaparral Bajo", tipo: "barrio" },
  { nombre: "Urbanización El Madroño", tipo: "barrio" },
  { nombre: "Urbanización Montecarlo", tipo: "barrio" },
  { nombre: "Urbanización Palomarejos-La Cabra", tipo: "barrio" },
  { nombre: "Urbanización Ntra. Sra. del Prado", tipo: "barrio" },
  { nombre: "El Casar de Talavera", tipo: "barrio" },
  { nombre: "Talavera la Nueva", tipo: "barrio" },
];

const POLIGONOS_TALAVERA: ZonaCiudad[] = [
  { nombre: "Polígono Industrial El Barrago", tipo: "poligono" },
  { nombre: "Polígono Industrial El Injertillo", tipo: "poligono" },
  { nombre: "Polígono Industrial La Floresta", tipo: "poligono" },
  { nombre: "Polígono Industrial Patrocinio San José", tipo: "poligono" },
  { nombre: "Polígono Industrial Tafasa", tipo: "poligono" },
  { nombre: "Polígono Industrial Talavera la Nueva II", tipo: "poligono" },
  { nombre: "Polígono Industrial Torrehierro", tipo: "poligono" },
  { nombre: "Polígono Industrial de Talavera", tipo: "poligono" },
];

const BARRIOS_ILLESCAS: ZonaCiudad[] = [
  { nombre: "Balaguera", tipo: "barrio" },
  { nombre: "Casco Urbano", tipo: "barrio" },
  { nombre: "El Señorío de Illescas", tipo: "barrio" },
  { nombre: "La Alameda del Señorío", tipo: "barrio" },
  { nombre: "La Estación", tipo: "barrio" },
  { nombre: "Los Almorales", tipo: "barrio" },
  { nombre: "Los Negretes", tipo: "barrio" },
  { nombre: "Los Olivos", tipo: "barrio" },
  { nombre: "Los Pradillos", tipo: "barrio" },
  { nombre: "Los Yeseros", tipo: "barrio" },
  { nombre: "Moratalaz", tipo: "barrio" },
  { nombre: "San Pedro", tipo: "barrio" },
  { nombre: "Urbanización El Maulón", tipo: "barrio" },
  { nombre: "Urbanización Villarreal", tipo: "barrio" },
  { nombre: "Veredilla", tipo: "barrio" },
  { nombre: "Viñas Perdidas", tipo: "barrio" },
];

const POLIGONOS_ILLESCAS: ZonaCiudad[] = [
  { nombre: "Parque Industrial y Tecnológico de Illescas (ITAC)", tipo: "poligono" },
  { nombre: "Plataforma Central Iberum", tipo: "poligono" },
  { nombre: "Polígono Industrial Ardoz", tipo: "poligono" },
  { nombre: "Polígono Industrial Boadilla", tipo: "poligono" },
  { nombre: "Polígono Industrial Cárcavas I", tipo: "poligono" },
  { nombre: "Polígono Industrial Cárcavas II", tipo: "poligono" },
  { nombre: "Polígono Industrial El Paño", tipo: "poligono" },
  { nombre: "Polígono Industrial Las Arboledas", tipo: "poligono" },
  { nombre: "Polígono Industrial Los Pradillos", tipo: "poligono" },
  { nombre: "Polígono Industrial San Gil", tipo: "poligono" },
  { nombre: "Polígono Industrial Señorío de Illescas", tipo: "poligono" },
  { nombre: "Polígono Industrial Valdelasilla", tipo: "poligono" },
  { nombre: "Polígono Industrial La Veredilla", tipo: "poligono" },
  { nombre: "Polígono Industrial Veredilla II", tipo: "poligono" },
  { nombre: "Polígono Industrial Veredilla III", tipo: "poligono" },
  { nombre: "Polígono Industrial La Veredilla III", tipo: "poligono" },
  { nombre: "Polígono Industrial La Frontera", tipo: "poligono" },
];

const BARRIOS_SESENA: ZonaCiudad[] = [
  { nombre: "El Quiñón (Residencial Francisco Hernando)", tipo: "barrio" },
  { nombre: "La Estación", tipo: "barrio" },
  { nombre: "Seseña Nuevo", tipo: "barrio" },
  { nombre: "Seseña Viejo", tipo: "barrio" },
  { nombre: "Vallegrande", tipo: "barrio" },
];

const POLIGONOS_SESENA: ZonaCiudad[] = [
  { nombre: "Polígono Industrial Cuesta de la Reina", tipo: "poligono" },
  { nombre: "Polígono Industrial La Estación", tipo: "poligono" },
  { nombre: "Polígono Industrial Las Monjas", tipo: "poligono" },
  { nombre: "Polígono Industrial Los Pontones", tipo: "poligono" },
  { nombre: "Polígono Industrial Nuestra Señora del Rosario", tipo: "poligono" },
  { nombre: "Polígono Industrial San Isidro", tipo: "poligono" },
];

const BARRIOS_VALENCIA: ZonaCiudad[] = [
  { nombre: "Albors", tipo: "barrio" },
  { nombre: "Arrancapins", tipo: "barrio" },
  { nombre: "Aiora", tipo: "barrio" },
  { nombre: "Benicalap", tipo: "barrio" },
  { nombre: "Benifaraig", tipo: "barrio" },
  { nombre: "Benimaclet", tipo: "barrio" },
  { nombre: "Benimàmet", tipo: "barrio" },
  { nombre: "Beteró", tipo: "barrio" },
  { nombre: "Borbotó", tipo: "barrio" },
  { nombre: "Cabanyal-Canyamelar", tipo: "barrio" },
  { nombre: "Camí Fondo", tipo: "barrio" },
  { nombre: "Camí de Vera", tipo: "barrio" },
  { nombre: "Campanar", tipo: "barrio" },
  { nombre: "Carpesa", tipo: "barrio" },
  { nombre: "Cases de Bàrcena", tipo: "barrio" },
  { nombre: "Castellar-L'Oliveral", tipo: "barrio" },
  { nombre: "Ciutat de les Arts i les Ciències", tipo: "barrio" },
  { nombre: "Ciutat Jardí", tipo: "barrio" },
  { nombre: "Ciutat Universitària", tipo: "barrio" },
  { nombre: "El Botànic", tipo: "barrio" },
  { nombre: "El Calvari", tipo: "barrio" },
  { nombre: "El Carme", tipo: "barrio" },
  { nombre: "El Forn d'Alcedo", tipo: "barrio" },
  { nombre: "El Grau", tipo: "barrio" },
  { nombre: "El Mercat", tipo: "barrio" },
  { nombre: "El Palmar", tipo: "barrio" },
  { nombre: "El Pilar", tipo: "barrio" },
  { nombre: "El Pla del Remei", tipo: "barrio" },
  { nombre: "El Perellonet", tipo: "barrio" },
  { nombre: "En Corts", tipo: "barrio" },
  { nombre: "Exposició", tipo: "barrio" },
  { nombre: "Faitanar", tipo: "barrio" },
  { nombre: "Font d'En Corts", tipo: "barrio" },
  { nombre: "Fonteta de Sant Lluís", tipo: "barrio" },
  { nombre: "Gran Via", tipo: "barrio" },
  { nombre: "Jaume Roig", tipo: "barrio" },
  { nombre: "L'Amistat", tipo: "barrio" },
  { nombre: "L'Illa Perduda", tipo: "barrio" },
  { nombre: "L'Hort de Senabre", tipo: "barrio" },
  { nombre: "La Carrasca", tipo: "barrio" },
  { nombre: "La Creu del Grau", tipo: "barrio" },
  { nombre: "La Creu Coberta", tipo: "barrio" },
  { nombre: "La Llum", tipo: "barrio" },
  { nombre: "La Malva-rosa", tipo: "barrio" },
  { nombre: "La Punta", tipo: "barrio" },
  { nombre: "La Raiosa", tipo: "barrio" },
  { nombre: "La Roqueta", tipo: "barrio" },
  { nombre: "La Saïdia", tipo: "barrio" },
  { nombre: "La Seu", tipo: "barrio" },
  { nombre: "La Torre", tipo: "barrio" },
  { nombre: "La Xerea", tipo: "barrio" },
  { nombre: "Les Tendetes", tipo: "barrio" },
  { nombre: "L'Olivereta", tipo: "barrio" },
  { nombre: "Malilla", tipo: "barrio" },
  { nombre: "Mauella", tipo: "barrio" },
  { nombre: "Marxalenes", tipo: "barrio" },
  { nombre: "Massarrojos", tipo: "barrio" },
  { nombre: "Mestalla", tipo: "barrio" },
  { nombre: "Mont-Olivet", tipo: "barrio" },
  { nombre: "Morvedre", tipo: "barrio" },
  { nombre: "Na Rovella", tipo: "barrio" },
  { nombre: "Natzaret", tipo: "barrio" },
  { nombre: "Nou Moles", tipo: "barrio" },
  { nombre: "Orriols", tipo: "barrio" },
  { nombre: "Pinedo", tipo: "barrio" },
  { nombre: "Poble Nou", tipo: "barrio" },
  { nombre: "Russafa", tipo: "barrio" },
  { nombre: "Sant Antoni", tipo: "barrio" },
  { nombre: "Sant Francesc", tipo: "barrio" },
  { nombre: "Sant Isidre", tipo: "barrio" },
  { nombre: "Sant Llorenç", tipo: "barrio" },
  { nombre: "Sant Marcel·lí", tipo: "barrio" },
  { nombre: "Sant Pau", tipo: "barrio" },
  { nombre: "Soternes", tipo: "barrio" },
  { nombre: "Tormos", tipo: "barrio" },
  { nombre: "Torrefiel", tipo: "barrio" },
  { nombre: "Trinitat", tipo: "barrio" },
  { nombre: "Tres Forques", tipo: "barrio" },
  { nombre: "Vara de Quart", tipo: "barrio" },
  { nombre: "La Bega Baixa", tipo: "barrio" },
  { nombre: "La Petxina", tipo: "barrio" },
  { nombre: "Safranar", tipo: "barrio" },
  { nombre: "San Antonio", tipo: "barrio" },
  { nombre: "San Isidro", tipo: "barrio" },
  { nombre: "San Marcelino", tipo: "barrio" },
  { nombre: "El Saler", tipo: "barrio" },
];

const POLIGONOS_VALENCIA: ZonaCiudad[] = [
  { nombre: "Área Empresarial Vara de Quart", tipo: "poligono" },
  { nombre: "Parque Empresarial Fuente del Jarro", tipo: "poligono" },
  { nombre: "Parque Empresarial Táctica", tipo: "poligono" },
  { nombre: "Parque Tecnológico de València", tipo: "poligono" },
  { nombre: "Polígono Industrial Benimàmet", tipo: "poligono" },
  { nombre: "Polígono Industrial Vara de Quart", tipo: "poligono" },
  { nombre: "Polígono Industrial de la Carretera de Barcelona", tipo: "poligono" },
  { nombre: "Polígono Industrial de la Fuente de San Luis", tipo: "poligono" },
  { nombre: "Polígono Industrial de la Punta", tipo: "poligono" },
  { nombre: "Polígono Industrial de Nazaret", tipo: "poligono" },
  { nombre: "Polígono Industrial de San Isidro", tipo: "poligono" },
  { nombre: "Zona Industrial de la Avenida del Cid", tipo: "poligono" },
];

const BARRIOS_TORRENT: ZonaCiudad[] = [
  { nombre: "1.º Ensanche", tipo: "barrio" },
  { nombre: "2.º Ensanche", tipo: "barrio" },
  { nombre: "3.º Ensanche", tipo: "barrio" },
  { nombre: "Barranc del Gallego", tipo: "barrio" },
  { nombre: "Benisaet", tipo: "barrio" },
  { nombre: "Bon Estar", tipo: "barrio" },
  { nombre: "Buena Vista", tipo: "barrio" },
  { nombre: "Calicanto", tipo: "barrio" },
  { nombre: "Camí de Barbeta", tipo: "barrio" },
  { nombre: "Casco Antiguo", tipo: "barrio" },
  { nombre: "Cumbres de Calicanto", tipo: "barrio" },
  { nombre: "El Alter", tipo: "barrio" },
  { nombre: "El Molí", tipo: "barrio" },
  { nombre: "El Pantà", tipo: "barrio" },
  { nombre: "El Vedat", tipo: "barrio" },
  { nombre: "Font de Manyes", tipo: "barrio" },
  { nombre: "La Carrasquera", tipo: "barrio" },
  { nombre: "La Canyada d'Alonso i Birlet", tipo: "barrio" },
  { nombre: "La Font del Sapo", tipo: "barrio" },
  { nombre: "La Pirámide", tipo: "barrio" },
  { nombre: "Las Américas", tipo: "barrio" },
  { nombre: "Marxadella", tipo: "barrio" },
  { nombre: "Mas de Pavia", tipo: "barrio" },
  { nombre: "Mas del Jutge", tipo: "barrio" },
  { nombre: "Monte Hermoso", tipo: "barrio" },
  { nombre: "Monte Real", tipo: "barrio" },
  { nombre: "Monte Vedat", tipo: "barrio" },
  { nombre: "Poble Nou-Las Palomas", tipo: "barrio" },
  { nombre: "Raval-Estación", tipo: "barrio" },
  { nombre: "Santa Apolonia", tipo: "barrio" },
  { nombre: "Santo Ángel", tipo: "barrio" },
  { nombre: "Xenillet", tipo: "barrio" },
];

const POLIGONOS_TORRENT: ZonaCiudad[] = [
  { nombre: "Mas del Jutge (Masía del Juez)", tipo: "poligono" },
  { nombre: "Toll i l'Alberca", tipo: "poligono" },
];

const BARRIOS_GANDIA: ZonaCiudad[] = [
  { nombre: "Alqueria de Martorell", tipo: "barrio" },
  { nombre: "Beniopa", tipo: "barrio" },
  { nombre: "Benipeixcar", tipo: "barrio" },
  { nombre: "Bennàcer", tipo: "barrio" },
  { nombre: "Corea", tipo: "barrio" },
  { nombre: "El Grau", tipo: "barrio" },
  { nombre: "El Raval", tipo: "barrio" },
  { nombre: "Jardinet", tipo: "barrio" },
  { nombre: "L'Estrella", tipo: "barrio" },
  { nombre: "L'Ermita de Marxuquera", tipo: "barrio" },
  { nombre: "Les Foies", tipo: "barrio" },
  { nombre: "Marxuquera Alta", tipo: "barrio" },
  { nombre: "Marxuquera Baixa", tipo: "barrio" },
  { nombre: "Molí de Santa Maria", tipo: "barrio" },
  { nombre: "Parc de l'Alqueria Nova (Parc Sant Pere)", tipo: "barrio" },
  { nombre: "Playa de Gandia", tipo: "barrio" },
  { nombre: "Plaça El·líptica", tipo: "barrio" },
  { nombre: "Rafalcaïd", tipo: "barrio" },
  { nombre: "Roís de Corella", tipo: "barrio" },
  { nombre: "Santa Anna", tipo: "barrio" },
  { nombre: "Simancas", tipo: "barrio" },
  { nombre: "Venècia", tipo: "barrio" },
  { nombre: "Vila-Nova", tipo: "barrio" },
  { nombre: "Joaquín Ballester", tipo: "barrio" },
  { nombre: "Grupo Porta (Las 500)", tipo: "barrio" },
  { nombre: "Barranc Blanc", tipo: "barrio" },
  { nombre: "Corral del Moliner", tipo: "barrio" },
  { nombre: "Meravelles-Cova Negra", tipo: "barrio" },
  { nombre: "Molló de la Creu", tipo: "barrio" },
  { nombre: "Monte Pino", tipo: "barrio" },
  { nombre: "Monte Sol", tipo: "barrio" },
  { nombre: "Racó dels Frares", tipo: "barrio" },
  { nombre: "Santa Marta", tipo: "barrio" },
  { nombre: "Xauxa", tipo: "barrio" },
];

const POLIGONOS_GANDIA: ZonaCiudad[] = [
  { nombre: "Polígono Industrial Alcodar", tipo: "poligono" },
  { nombre: "Polígono Industrial Benieto", tipo: "poligono" },
  { nombre: "Polígono Industrial El Rajolar", tipo: "poligono" },
  { nombre: "Polígono Industrial Sanxo Llop", tipo: "poligono" },
  { nombre: "Polígono Industrial Carretera de la Vital", tipo: "poligono" },
];

const BARRIOS_PATERNA: ZonaCiudad[] = [
  { nombre: "Alborgí", tipo: "barrio" },
  { nombre: "Bovalar", tipo: "barrio" },
  { nombre: "Campamento", tipo: "barrio" },
  { nombre: "Casas Verdes", tipo: "barrio" },
  { nombre: "Centro", tipo: "barrio" },
  { nombre: "Cruz de Gracia", tipo: "barrio" },
  { nombre: "El Plantío", tipo: "barrio" },
  { nombre: "La Cañada", tipo: "barrio" },
  { nombre: "La Coma", tipo: "barrio" },
  { nombre: "Loma Llarga-Valterna", tipo: "barrio" },
  { nombre: "Nueva Paterna", tipo: "barrio" },
  { nombre: "Santa Gema", tipo: "barrio" },
  { nombre: "Santa Rita", tipo: "barrio" },
  { nombre: "Terramelar", tipo: "barrio" },
  { nombre: "Cumbres de San Antonio", tipo: "barrio" },
  { nombre: "La Vallesa", tipo: "barrio" },
  { nombre: "Entrecruces", tipo: "barrio" },
  { nombre: "Lloma Llarga", tipo: "barrio" },
  { nombre: "Mas del Rosari", tipo: "barrio" },
  { nombre: "Parc Central", tipo: "barrio" },
  { nombre: "Sotolivar", tipo: "barrio" },
];

const POLIGONOS_PATERNA: ZonaCiudad[] = [
  { nombre: "Parque Científico de la Universitat de València", tipo: "poligono" },
  { nombre: "Parque Empresarial Táctica", tipo: "poligono" },
  { nombre: "Parque Tecnológico de Paterna", tipo: "poligono" },
  { nombre: "Polígono Industrial Fuente del Jarro", tipo: "poligono" },
  { nombre: "Polígono Industrial L'Andana", tipo: "poligono" },
  { nombre: "Polígono Industrial Molí del Testar", tipo: "poligono" },
  { nombre: "Polígono Industrial de Ademuz", tipo: "poligono" },
  { nombre: "Polígono Industrial Municipal", tipo: "poligono" },
  { nombre: "Polígono Industrial Boluda", tipo: "poligono" },
];

const BARRIOS_SAGUNTO: ZonaCiudad[] = [
  { nombre: "Almardà", tipo: "barrio" },
  { nombre: "Antigua Morería", tipo: "barrio" },
  { nombre: "Baladre", tipo: "barrio" },
  { nombre: "Barrio de San José", tipo: "barrio" },
  { nombre: "Cantera-Partidores", tipo: "barrio" },
  { nombre: "Centro Histórico", tipo: "barrio" },
  { nombre: "Corinto", tipo: "barrio" },
  { nombre: "El Raval", tipo: "barrio" },
  { nombre: "Grao Viejo", tipo: "barrio" },
  { nombre: "La Vila", tipo: "barrio" },
  { nombre: "Los Monasterios", tipo: "barrio" },
  { nombre: "Norte Palancia", tipo: "barrio" },
  { nombre: "Puerto de Sagunto", tipo: "barrio" },
  { nombre: "Zona de la Estación", tipo: "barrio" },
  { nombre: "Urbanización Alfinac", tipo: "barrio" },
  { nombre: "Urbanización Bonilles", tipo: "barrio" },
  { nombre: "Urbanización Gato Montés", tipo: "barrio" },
  { nombre: "Urbanización Malvasur", tipo: "barrio" },
  { nombre: "Urbanización Palmeras i Mar", tipo: "barrio" },
  { nombre: "Urbanización Proamar", tipo: "barrio" },
  { nombre: "Urbanización Los Monasterios", tipo: "barrio" },
  { nombre: "Urbanización El Picayo", tipo: "barrio" },
  { nombre: "Urbanización Vilamar", tipo: "barrio" },
];

const POLIGONOS_SAGUNTO: ZonaCiudad[] = [
  { nombre: "Polígono Industrial Bajo Vías", tipo: "poligono" },
  { nombre: "Polígono Industrial Camí a la Mar", tipo: "poligono" },
  { nombre: "Polígono Industrial Camí de Llíria", tipo: "poligono" },
  { nombre: "Polígono Industrial El Regló", tipo: "poligono" },
  { nombre: "Polígono Industrial Estación de les Valls", tipo: "poligono" },
  { nombre: "Polígono Industrial Ingruinsa", tipo: "poligono" },
  { nombre: "Polígono Industrial Montíber", tipo: "poligono" },
  { nombre: "Polígono Industrial Racó de l'Horta", tipo: "poligono" },
  { nombre: "Polígono Industrial SEPES", tipo: "poligono" },
  { nombre: "Polígono Industrial Siderúrgico", tipo: "poligono" },
  { nombre: "Polígono Industrial Químico", tipo: "poligono" },
  { nombre: "Parque Empresarial Parc Sagunt I", tipo: "poligono" },
  { nombre: "Parque Empresarial Parc Sagunt II", tipo: "poligono" },
  { nombre: "Puerto Marítimo de Sagunto", tipo: "poligono" },
];

const BARRIOS_ALZIRA: ZonaCiudad[] = [
  { nombre: "Alborxí", tipo: "barrio" },
  { nombre: "Albuixarres", tipo: "barrio" },
  { nombre: "Alquerieta", tipo: "barrio" },
  { nombre: "Barraca d'Aigües Vives", tipo: "barrio" },
  { nombre: "Caputxins", tipo: "barrio" },
  { nombre: "El Pla de Corbera", tipo: "barrio" },
  { nombre: "El Racó", tipo: "barrio" },
  { nombre: "El Respirall", tipo: "barrio" },
  { nombre: "La Avenida", tipo: "barrio" },
  { nombre: "La Garrofera", tipo: "barrio" },
  { nombre: "La Vila", tipo: "barrio" },
  { nombre: "Les Basses", tipo: "barrio" },
  { nombre: "Les Barraques", tipo: "barrio" },
  { nombre: "Sant Agustí", tipo: "barrio" },
  { nombre: "Sant Bernat", tipo: "barrio" },
  { nombre: "Sant Joan", tipo: "barrio" },
  { nombre: "Sant Judes", tipo: "barrio" },
  { nombre: "Sants Patrons", tipo: "barrio" },
  { nombre: "Santa Maria de Bonaire", tipo: "barrio" },
  { nombre: "Torrexo", tipo: "barrio" },
  { nombre: "Tulell", tipo: "barrio" },
  { nombre: "Vall d'Aigües Vives", tipo: "barrio" },
  { nombre: "Venècia", tipo: "barrio" },
  { nombre: "Vilella", tipo: "barrio" },
  { nombre: "Muntanyeta", tipo: "barrio" },
  { nombre: "Carretera de Carcaixent", tipo: "barrio" },
  { nombre: "Carretera de Albalat", tipo: "barrio" },
  { nombre: "Valletes de Brú", tipo: "barrio" },
  { nombre: "Valletes del Gall", tipo: "barrio" },
  { nombre: "Urbanización Portella de Severino", tipo: "barrio" },
  { nombre: "Urbanización San Bernat", tipo: "barrio" },
];

const POLIGONOS_ALZIRA: ZonaCiudad[] = [
  { nombre: "Parque Empresarial El Pla", tipo: "poligono" },
  { nombre: "Polígono Ciudad del Transporte", tipo: "poligono" },
  { nombre: "Polígono Industrial Abidesa", tipo: "poligono" },
  { nombre: "Polígono Industrial Alzira Sur", tipo: "poligono" },
  { nombre: "Polígono Industrial El Pla", tipo: "poligono" },
  { nombre: "Polígono Industrial Fraca", tipo: "poligono" },
  { nombre: "Polígono Industrial Ice Cream Factory", tipo: "poligono" },
  { nombre: "Polígono Industrial La Granja", tipo: "poligono" },
  { nombre: "Polígono Industrial número 1", tipo: "poligono" },
  { nombre: "Polígono Industrial número 2 (Carretera de Albalat)", tipo: "poligono" },
  { nombre: "Polígono Industrial Partida Materna (Alzicoop)", tipo: "poligono" },
  { nombre: "Polígono Industrial Tisneres", tipo: "poligono" },
  { nombre: "Polígono Industrial Estación RENFE", tipo: "poligono" },
  { nombre: "Sector PPI-08 Ciudad del Transporte", tipo: "poligono" },
  { nombre: "Sector PPI-11 El Pla", tipo: "poligono" },
];

const BARRIOS_MISLATA: ZonaCiudad[] = [
  { nombre: "El Cerdanet", tipo: "barrio" },
  { nombre: "El Quint", tipo: "barrio" },
  { nombre: "La Morería", tipo: "barrio" },
  { nombre: "San Antonio", tipo: "barrio" },
  { nombre: "Zona Centro", tipo: "barrio" },
  { nombre: "Zona de Almassil", tipo: "barrio" },
  { nombre: "Zona de Gregorio Gea", tipo: "barrio" },
  { nombre: "Zona de La Canaleta", tipo: "barrio" },
  { nombre: "Zona de la Avenida del Cid", tipo: "barrio" },
  { nombre: "Zona de Blasco Ibáñez", tipo: "barrio" },
];

const POLIGONOS_MISLATA: ZonaCiudad[] = [
  { nombre: "Polígono Industrial Nou d'Octubre (Polígono Industrial de Mislata)", tipo: "poligono" },
];

const BARRIOS_BURJASSOT: ZonaCiudad[] = [
  { nombre: "613 Viviendas-Rajolar", tipo: "barrio" },
  { nombre: "Empalme", tipo: "barrio" },
  { nombre: "Escalante-Lucense", tipo: "barrio" },
  { nombre: "Isaac Peral-Santa Gema", tipo: "barrio" },
  { nombre: "Lauri Volpi-Eixereta", tipo: "barrio" },
  { nombre: "Maestro Lope y adyacentes", tipo: "barrio" },
  { nombre: "Nucli Antic-L'Almara", tipo: "barrio" },
  { nombre: "San Juan-La Granja", tipo: "barrio" },
  { nombre: "El Calvari", tipo: "barrio" },
  { nombre: "Sant Roc", tipo: "barrio" },
  { nombre: "La Sarrassina", tipo: "barrio" },
  { nombre: "Zona Universitaria", tipo: "barrio" },
  { nombre: "Zona de Parque Albán", tipo: "barrio" },
];

const POLIGONOS_BURJASSOT: ZonaCiudad[] = [
  { nombre: "Polígono Industrial de Burjassot", tipo: "poligono" },
  { nombre: "Zona Empresarial Parque Albán", tipo: "poligono" },
  { nombre: "Parque Comercial Ademuz", tipo: "poligono" },
];

const BARRIOS_ONTINYENT: ZonaCiudad[] = [
  { nombre: "La Vila", tipo: "barrio" },
  { nombre: "El Raval-Poble Nou", tipo: "barrio" },
  { nombre: "Cantereria", tipo: "barrio" },
  { nombre: "Sant Josep", tipo: "barrio" },
  { nombre: "Sant Rafael", tipo: "barrio" },
  { nombre: "El Llombo", tipo: "barrio" },
  { nombre: "Les Casetes", tipo: "barrio" },
];

const POLIGONOS_ONTINYENT: ZonaCiudad[] = [
  { nombre: "Polígono Industrial El Pla", tipo: "poligono" },
  { nombre: "Polígono Industrial El Pla Área 27 y 30 bis", tipo: "poligono" },
  { nombre: "Polígono Industrial Área 45 Pla de Sant Vicent", tipo: "poligono" },
  { nombre: "Polígono Industrial L'Altet", tipo: "poligono" },
  { nombre: "Polígono Terciario AH-37", tipo: "poligono" },
];

const BARRIOS_ALDAIA: ZonaCiudad[] = [
  { nombre: "Sant Antoni-Sant Miquel-Santa Rita", tipo: "barrio" },
  { nombre: "Tama", tipo: "barrio" },
  { nombre: "Brillantina", tipo: "barrio" },
  { nombre: "Casc Antic", tipo: "barrio" },
  { nombre: "Colonia-Mercat", tipo: "barrio" },
  { nombre: "Barri del Cristo", tipo: "barrio" },
  { nombre: "Barri del Cayo", tipo: "barrio" },
  { nombre: "Barranquet Alto", tipo: "barrio" },
  { nombre: "Calle Sur", tipo: "barrio" },
];

const POLIGONOS_ALDAIA: ZonaCiudad[] = [
  { nombre: "Polígono Industrial La Lloma", tipo: "poligono" },
  { nombre: "Polígono Industrial El Pou", tipo: "poligono" },
  { nombre: "Polígono Industrial Coscollar/Encreullades", tipo: "poligono" },
  { nombre: "Polígono Industrial Del Cristo", tipo: "poligono" },
  { nombre: "Polígono Industrial La Fillola", tipo: "poligono" },
  { nombre: "Polígono Industrial Cementeri Vell", tipo: "poligono" },
  { nombre: "Centro Comercial Bonaire", tipo: "poligono" },
];

const BARRIOS_MANISES: ZonaCiudad[] = [
  { nombre: "El Carme", tipo: "barrio" },
  { nombre: "Socusa", tipo: "barrio" },
  { nombre: "Obradors", tipo: "barrio" },
  { nombre: "Sant Jeroni", tipo: "barrio" },
  { nombre: "Santa Félix", tipo: "barrio" },
  { nombre: "Alameda Parc", tipo: "barrio" },
  { nombre: "Sant Francesc", tipo: "barrio" },
  { nombre: "Casco Antiguo", tipo: "barrio" },
  { nombre: "La Presa", tipo: "barrio" },
  { nombre: "La Cova", tipo: "barrio" },
];

const POLIGONOS_MANISES: ZonaCiudad[] = [
  { nombre: "Parc Empresarial Aeroport", tipo: "poligono" },
  { nombre: "Polígono Industrial El Barranquet", tipo: "poligono" },
  { nombre: "Polígono Industrial La Cova", tipo: "poligono" },
];

const BARRIOS_XIRIVELLA: ZonaCiudad[] = [
  { nombre: "Barri Sant Ramon", tipo: "barrio" },
  { nombre: "Mont de Pietat", tipo: "barrio" },
  { nombre: "Barri de la Llum", tipo: "barrio" },
  { nombre: "Vicentica La Serrana", tipo: "barrio" },
  { nombre: "El Cano", tipo: "barrio" },
];

const POLIGONOS_XIRIVELLA: ZonaCiudad[] = [
  { nombre: "Polígono Industrial Verge de la Salut", tipo: "poligono" },
  { nombre: "Polígono Industrial Els Oficis", tipo: "poligono" },
  { nombre: "Polígono Industrial Zamarra", tipo: "poligono" },
  { nombre: "Centro Comercial Gran Turia", tipo: "poligono" },
];

const BARRIOS_XATIVA: ZonaCiudad[] = [
  { nombre: "Núcleo histórico", tipo: "barrio" },
  { nombre: "Las Santas", tipo: "barrio" },
  { nombre: "San Pedro", tipo: "barrio" },
  { nombre: "San José", tipo: "barrio" },
  { nombre: "Alto del Raval", tipo: "barrio" },
  { nombre: "Raval de San Juan", tipo: "barrio" },
  { nombre: "Las Barreras", tipo: "barrio" },
  { nombre: "Ensanche", tipo: "barrio" },
  { nombre: "Camino dels Dos Molins", tipo: "barrio" },
  { nombre: "Carmen", tipo: "barrio" },
  { nombre: "La Murta", tipo: "barrio" },
  { nombre: "Huertos del Raval", tipo: "barrio" },
  { nombre: "Torre de Lloris", tipo: "barrio" },
  { nombre: "Anahuir", tipo: "barrio" },
  { nombre: "Sorió", tipo: "barrio" },
  { nombre: "El Realengo", tipo: "barrio" },
];

const POLIGONOS_XATIVA: ZonaCiudad[] = [
  { nombre: "Camí de l'Estret", tipo: "poligono" },
  { nombre: "Polígono A", tipo: "poligono" },
];

const BARRIOS_CATARROJA: ZonaCiudad[] = [
  { nombre: "Barraques", tipo: "barrio" },
  { nombre: "Raval-Pilar", tipo: "barrio" },
  { nombre: "Regió-Florida-Villa Carme", tipo: "barrio" },
  { nombre: "Horteta-Vila Romana", tipo: "barrio" },
  { nombre: "Fumeral-Institut", tipo: "barrio" },
  { nombre: "Charco Tranviaris", tipo: "barrio" },
  { nombre: "Mercat", tipo: "barrio" },
  { nombre: "El Port", tipo: "barrio" },
];

const POLIGONOS_CATARROJA: ZonaCiudad[] = [
  { nombre: "Polígono Industrial El Bony", tipo: "poligono" },
];

const BARRIOS_ALAQUAS: ZonaCiudad[] = [
  { nombre: "Centro Histórico", tipo: "barrio" },
  { nombre: "Barrio de Ave María", tipo: "barrio" },
  { nombre: "Barri de Sant Vicent", tipo: "barrio" },
  { nombre: "Barri de San Fermín", tipo: "barrio" },
  { nombre: "Barri del Carme", tipo: "barrio" },
  { nombre: "Barri Roig", tipo: "barrio" },
  { nombre: "El Olivar", tipo: "barrio" },
];

const POLIGONOS_ALAQUAS: ZonaCiudad[] = [
  { nombre: "Polígono Industrial El Bovalar", tipo: "poligono" },
  { nombre: "Polígono Industrial Els Mollons", tipo: "poligono" },
];

const BARRIOS_CASTELLON: ZonaCiudad[] = [
  { nombre: "Almalafa", tipo: "barrio" },
  { nombre: "Avenida del Mar", tipo: "barrio" },
  { nombre: "Benadresa", tipo: "barrio" },
  { nombre: "Boera", tipo: "barrio" },
  { nombre: "Censal", tipo: "barrio" },
  { nombre: "Centro", tipo: "barrio" },
  { nombre: "Crémor", tipo: "barrio" },
  { nombre: "Estepar", tipo: "barrio" },
  { nombre: "Grupo Lourdes", tipo: "barrio" },
  { nombre: "Grupo Reyes", tipo: "barrio" },
  { nombre: "Grupo San Agustín", tipo: "barrio" },
  { nombre: "Grupo San José Obrero", tipo: "barrio" },
  { nombre: "Grupo San Lorenzo", tipo: "barrio" },
  { nombre: "Grupo San Marcos", tipo: "barrio" },
  { nombre: "Grupo Santa Teresa", tipo: "barrio" },
  { nombre: "Grupo Roquetes", tipo: "barrio" },
  { nombre: "Grao (Grau)", tipo: "barrio" },
  { nombre: "La Guinea", tipo: "barrio" },
  { nombre: "La Marjalería", tipo: "barrio" },
  { nombre: "La Plana", tipo: "barrio" },
  { nombre: "Rafalafena", tipo: "barrio" },
  { nombre: "Raval Universitari", tipo: "barrio" },
  { nombre: "San Roque", tipo: "barrio" },
  { nombre: "Sensal", tipo: "barrio" },
  { nombre: "Tombatossals", tipo: "barrio" },
];

const POLIGONOS_CASTELLON: ZonaCiudad[] = [
  { nombre: "Autopista-Sur", tipo: "poligono" },
  { nombre: "Avenida de Valencia", tipo: "poligono" },
  { nombre: "Basala i la Residencia", tipo: "poligono" },
  { nombre: "Ciudad del Transporte", tipo: "poligono" },
  { nombre: "El Serrallo", tipo: "poligono" },
  { nombre: "Fadrell", tipo: "poligono" },
  { nombre: "Giner", tipo: "poligono" },
  { nombre: "Gros", tipo: "poligono" },
  { nombre: "La Magdalena", tipo: "poligono" },
  { nombre: "La Ratlla i l'Estepar", tipo: "poligono" },
  { nombre: "Los Cipreses (Els Ciprers)", tipo: "poligono" },
  { nombre: "PERI 11", tipo: "poligono" },
  { nombre: "Pi Gros", tipo: "poligono" },
  { nombre: "Plataforma Logística", tipo: "poligono" },
  { nombre: "Pullman", tipo: "poligono" },
  { nombre: "Ronda Sur", tipo: "poligono" },
  { nombre: "San Agustín", tipo: "poligono" },
  { nombre: "San Lorenzo", tipo: "poligono" },
];

const BARRIOS_VILAREAL: ZonaCiudad[] = [
  { nombre: "Ávila", tipo: "barrio" },
  { nombre: "Cariñena", tipo: "barrio" },
  { nombre: "Cedre", tipo: "barrio" },
  { nombre: "El Madrigal", tipo: "barrio" },
  { nombre: "El Pilar", tipo: "barrio" },
  { nombre: "El Zorro", tipo: "barrio" },
  { nombre: "La Huerta", tipo: "barrio" },
  { nombre: "Melilla (Casas Capote)", tipo: "barrio" },
  { nombre: "Poi d'Amorós", tipo: "barrio" },
  { nombre: "Santa Águeda", tipo: "barrio" },
  { nombre: "Santa Sofía", tipo: "barrio" },
  { nombre: "Sant Pasqual", tipo: "barrio" },
  { nombre: "Los Evangelistas", tipo: "barrio" },
  { nombre: "San Gil", tipo: "barrio" },
];

const POLIGONOS_VILAREAL: ZonaCiudad[] = [
  { nombre: "Carretera de Onda", tipo: "poligono" },
  { nombre: "El Canal (Reg Nou)", tipo: "poligono" },
  { nombre: "La Florida", tipo: "poligono" },
  { nombre: "Les Voltes", tipo: "poligono" },
  { nombre: "Miralcamp", tipo: "poligono" },
  { nombre: "Molí Nou", tipo: "poligono" },
  { nombre: "Zona Norte", tipo: "poligono" },
  { nombre: "Zona Renfe", tipo: "poligono" },
  { nombre: "Zona Sur", tipo: "poligono" },
];

const BARRIOS_VINAROS: ZonaCiudad[] = [
  { nombre: "Ameradors", tipo: "barrio" },
  { nombre: "Barbiguera", tipo: "barrio" },
  { nombre: "Boverals", tipo: "barrio" },
  { nombre: "Cala del Puntal", tipo: "barrio" },
  { nombre: "Casco Antiguo", tipo: "barrio" },
  { nombre: "Centro Histórico", tipo: "barrio" },
  { nombre: "Deveses", tipo: "barrio" },
  { nombre: "Ensanche – Avenida Juan XXIII", tipo: "barrio" },
  { nombre: "Ensanche – Zona Cementerio", tipo: "barrio" },
  { nombre: "Les Cales", tipo: "barrio" },
  { nombre: "Les Salines", tipo: "barrio" },
  { nombre: "Lo Saldonar", tipo: "barrio" },
  { nombre: "Lo Triador", tipo: "barrio" },
  { nombre: "María Auxiliadora", tipo: "barrio" },
  { nombre: "Zona Hospital–Estación", tipo: "barrio" },
  { nombre: "Zona Norte", tipo: "barrio" },
  { nombre: "Zona Sur", tipo: "barrio" },
  { nombre: "Zona del Puig", tipo: "barrio" },
  { nombre: "Vistabella", tipo: "barrio" },
];

const POLIGONOS_VINAROS: ZonaCiudad[] = [
  { nombre: "Carretera de Ulldecona", tipo: "poligono" },
  { nombre: "Les Capçades", tipo: "poligono" },
  { nombre: "Planes Altes", tipo: "poligono" },
  { nombre: "Portal del Mediterráneo", tipo: "poligono" },
  { nombre: "Saldonar Oeste", tipo: "poligono" },
];

const BARRIOS_BADAJOZ: ZonaCiudad[] = [
  { nombre: "Antonio Domínguez", tipo: "barrio" },
  { nombre: "Barriada de Llera", tipo: "barrio" },
  { nombre: "Casco Antiguo", tipo: "barrio" },
  { nombre: "Cerro de Reyes", tipo: "barrio" },
  { nombre: "Cerro de San Miguel", tipo: "barrio" },
  { nombre: "Cerro del Viento", tipo: "barrio" },
  { nombre: "Ciudad Jardín", tipo: "barrio" },
  { nombre: "Corazón de Jesús", tipo: "barrio" },
  { nombre: "El Gurugú", tipo: "barrio" },
  { nombre: "Huerta Rosales", tipo: "barrio" },
  { nombre: "Jardines del Guadiana", tipo: "barrio" },
  { nombre: "La Atalaya", tipo: "barrio" },
  { nombre: "La Banasta", tipo: "barrio" },
  { nombre: "La Pilara", tipo: "barrio" },
  { nombre: "Las Moreras", tipo: "barrio" },
  { nombre: "La U.V.A.", tipo: "barrio" },
  { nombre: "Los Montitos", tipo: "barrio" },
  { nombre: "Los Ordenandos", tipo: "barrio" },
  { nombre: "María Auxiliadora", tipo: "barrio" },
  { nombre: "Mirador de Cerro Gordo", tipo: "barrio" },
  { nombre: "Pardaleras", tipo: "barrio" },
  { nombre: "La Paz", tipo: "barrio" },
  { nombre: "El Progreso", tipo: "barrio" },
  { nombre: "San Fernando", tipo: "barrio" },
  { nombre: "San Roque", tipo: "barrio" },
  { nombre: "San Salvador", tipo: "barrio" },
  { nombre: "Santa Marina", tipo: "barrio" },
  { nombre: "Suerte de Saavedra", tipo: "barrio" },
  { nombre: "Las Vaguadas", tipo: "barrio" },
  { nombre: "Urbanización Guadiana", tipo: "barrio" },
  { nombre: "Valdepasillas", tipo: "barrio" },
  { nombre: "Cerro Gordo", tipo: "barrio" },
  { nombre: "Santa Engracia", tipo: "barrio" },
  { nombre: "Alcazaba", tipo: "barrio" },
  { nombre: "Alvarado", tipo: "barrio" },
  { nombre: "Balboa", tipo: "barrio" },
  { nombre: "Gévora", tipo: "barrio" },
  { nombre: "Novelda del Guadiana", tipo: "barrio" },
  { nombre: "Sagrajas", tipo: "barrio" },
  { nombre: "Valdebótoa", tipo: "barrio" },
  { nombre: "Villafranco del Guadiana", tipo: "barrio" },
  { nombre: "Bótoa", tipo: "barrio" },
];

const POLIGONOS_BADAJOZ: ZonaCiudad[] = [
  { nombre: "Polígono Industrial El Nevero", tipo: "poligono" },
  { nombre: "Plataforma Logística del Suroeste Europeo", tipo: "poligono" },
  { nombre: "Parque Científico y Tecnológico de Extremadura", tipo: "poligono" },
];

const BARRIOS_MERIDA: ZonaCiudad[] = [
  { nombre: "Casco Histórico", tipo: "barrio" },
  { nombre: "El Barrio", tipo: "barrio" },
  { nombre: "San Albín", tipo: "barrio" },
  { nombre: "República Argentina", tipo: "barrio" },
  { nombre: "San Luis", tipo: "barrio" },
  { nombre: "Santa Catalina", tipo: "barrio" },
  { nombre: "Nuestra Señora de la Antigua", tipo: "barrio" },
  { nombre: "María Auxiliadora", tipo: "barrio" },
  { nombre: "San Lázaro", tipo: "barrio" },
  { nombre: "Santa Isabel", tipo: "barrio" },
  { nombre: "San Juan", tipo: "barrio" },
  { nombre: "Los Milagros", tipo: "barrio" },
  { nombre: "Santa Eulalia", tipo: "barrio" },
  { nombre: "Las Abadías", tipo: "barrio" },
  { nombre: "San Bartolomé", tipo: "barrio" },
  { nombre: "Jardín de Mérida", tipo: "barrio" },
  { nombre: "Juan Canet", tipo: "barrio" },
  { nombre: "Proserpina", tipo: "barrio" },
  { nombre: "Montealto", tipo: "barrio" },
  { nombre: "La Corchera", tipo: "barrio" },
  { nombre: "San Agustín", tipo: "barrio" },
  { nombre: "Tierno Galván", tipo: "barrio" },
  { nombre: "Vía de la Plata", tipo: "barrio" },
  { nombre: "La Calzada", tipo: "barrio" },
  { nombre: "Zona Sur", tipo: "barrio" },
  { nombre: "Los Bodegones", tipo: "barrio" },
  { nombre: "Nuevo Bodegones", tipo: "barrio" },
  { nombre: "Plantonal de Vera", tipo: "barrio" },
  { nombre: "San Andrés", tipo: "barrio" },
  { nombre: "Reina Sofía", tipo: "barrio" },
  { nombre: "Salesianos", tipo: "barrio" },
  { nombre: "Nueva Ciudad", tipo: "barrio" },
  { nombre: "San Antonio", tipo: "barrio" },
  { nombre: "Cruzcampo", tipo: "barrio" },
  { nombre: "Miralrío", tipo: "barrio" },
  { nombre: "La Heredad", tipo: "barrio" },
  { nombre: "Prado Viejo", tipo: "barrio" },
  { nombre: "Bellavista", tipo: "barrio" },
  { nombre: "El Prado", tipo: "barrio" },
  { nombre: "Campomanes", tipo: "barrio" },
  { nombre: "Carrión", tipo: "barrio" },
  { nombre: "El Vivero", tipo: "barrio" },
  { nombre: "Estación de Aljucén", tipo: "barrio" },
  { nombre: "Estación de El Carrascalejo", tipo: "barrio" },
  { nombre: "Psiquiátrico", tipo: "barrio" },
  { nombre: "Virgen de la Luz", tipo: "barrio" },
];

const POLIGONOS_MERIDA: ZonaCiudad[] = [
  { nombre: "Polígono Industrial El Prado", tipo: "poligono" },
  { nombre: "Polígono Industrial Reina Sofía", tipo: "poligono" },
  { nombre: "Polígono Industrial Las Palmeras", tipo: "poligono" },
  { nombre: "Polígono Industrial Albarregas", tipo: "poligono" },
  { nombre: "Polígono Industrial Carrión", tipo: "poligono" },
  { nombre: "Polígono Industrial CEPANSA", tipo: "poligono" },
  { nombre: "Polígono Industrial ExpacioMérida", tipo: "poligono" },
];

const BARRIOS_DON_BENITO: ZonaCiudad[] = [
  { nombre: "San Sebastián", tipo: "barrio" },
  { nombre: "La Piedad", tipo: "barrio" },
  { nombre: "San Isidro", tipo: "barrio" },
  { nombre: "San Gregorio", tipo: "barrio" },
  { nombre: "San Juan", tipo: "barrio" },
  { nombre: "Santiago", tipo: "barrio" },
  { nombre: "Conquista del Guadiana", tipo: "barrio" },
  { nombre: "Gargáligas", tipo: "barrio" },
  { nombre: "Hernán Cortés", tipo: "barrio" },
  { nombre: "Ruecas", tipo: "barrio" },
  { nombre: "El Torviscal", tipo: "barrio" },
  { nombre: "Valdehornillos", tipo: "barrio" },
  { nombre: "Vivares", tipo: "barrio" },
];

const POLIGONOS_DON_BENITO: ZonaCiudad[] = [
  { nombre: "Polígono Industrial San Isidro", tipo: "poligono" },
  { nombre: "Polígono Industrial Isaac Peral", tipo: "poligono" },
  { nombre: "Polígono Industrial Cepansa", tipo: "poligono" },
  { nombre: "Polígono Industrial Las Cumbres", tipo: "poligono" },
];

const BARRIOS_ALMENDRALEJO: ZonaCiudad[] = [
  { nombre: "San José", tipo: "barrio" },
  { nombre: "Las Mercedes", tipo: "barrio" },
  { nombre: "El Mercado", tipo: "barrio" },
  { nombre: "San Roque", tipo: "barrio" },
  { nombre: "La Paz", tipo: "barrio" },
  { nombre: "Centro", tipo: "barrio" },
  { nombre: "La Florida", tipo: "barrio" },
  { nombre: "San Marcos", tipo: "barrio" },
  { nombre: "Cantalgallo", tipo: "barrio" },
  { nombre: "La Farola", tipo: "barrio" },
  { nombre: "San Antonio", tipo: "barrio" },
  { nombre: "Santiago", tipo: "barrio" },
];

const POLIGONOS_ALMENDRALEJO: ZonaCiudad[] = [
  { nombre: "Polígono Industrial Tierra de Barros", tipo: "poligono" },
  { nombre: "Polígono Industrial Las Picadas", tipo: "poligono" },
  { nombre: "Polígono Industrial Carretera de Badajoz", tipo: "poligono" },
];

const BARRIOS_CACERES: ZonaCiudad[] = [
  { nombre: "Aguas Vivas", tipo: "barrio" },
  { nombre: "Argentina", tipo: "barrio" },
  { nombre: "Barriada Minera", tipo: "barrio" },
  { nombre: "Cabezarubia", tipo: "barrio" },
  { nombre: "Cáceres el Viejo", tipo: "barrio" },
  { nombre: "Campus Universitario", tipo: "barrio" },
  { nombre: "Cánovas", tipo: "barrio" },
  { nombre: "Casa Plata", tipo: "barrio" },
  { nombre: "Casas Baratas", tipo: "barrio" },
  { nombre: "Cementerio", tipo: "barrio" },
  { nombre: "Ceres Golf", tipo: "barrio" },
  { nombre: "Ciudad Monumental", tipo: "barrio" },
  { nombre: "El Junquillo", tipo: "barrio" },
  { nombre: "El Perú", tipo: "barrio" },
  { nombre: "El Rodeo", tipo: "barrio" },
  { nombre: "El Vivero", tipo: "barrio" },
  { nombre: "Espíritu Santo", tipo: "barrio" },
  { nombre: "Estación", tipo: "barrio" },
  { nombre: "Estación Arroyo-Malpartida", tipo: "barrio" },
  { nombre: "Gredos", tipo: "barrio" },
  { nombre: "Hernán Cortés", tipo: "barrio" },
  { nombre: "Hernández Pacheco", tipo: "barrio" },
  { nombre: "Huertas", tipo: "barrio" },
  { nombre: "Infanta Isabel", tipo: "barrio" },
  { nombre: "La Abundancia", tipo: "barrio" },
  { nombre: "La Bondad", tipo: "barrio" },
  { nombre: "La Cañada", tipo: "barrio" },
  { nombre: "La Madrila", tipo: "barrio" },
  { nombre: "La Paloma", tipo: "barrio" },
  { nombre: "La Sierrilla", tipo: "barrio" },
  { nombre: "La Zambomba", tipo: "barrio" },
  { nombre: "Las Candelas", tipo: "barrio" },
  { nombre: "Las Trescientas", tipo: "barrio" },
  { nombre: "Llopis Ivorra", tipo: "barrio" },
  { nombre: "Los Castellanos", tipo: "barrio" },
  { nombre: "Los Fratres", tipo: "barrio" },
  { nombre: "Macondo", tipo: "barrio" },
  { nombre: "Maltravieso", tipo: "barrio" },
  { nombre: "Margallo", tipo: "barrio" },
  { nombre: "Mejostilla", tipo: "barrio" },
  { nombre: "Moctezuma", tipo: "barrio" },
  { nombre: "Montesol", tipo: "barrio" },
  { nombre: "Nueva Ciudad", tipo: "barrio" },
  { nombre: "Nuevo Cáceres", tipo: "barrio" },
  { nombre: "Parque del Príncipe", tipo: "barrio" },
  { nombre: "Paseo Alto", tipo: "barrio" },
  { nombre: "Peña Redonda", tipo: "barrio" },
  { nombre: "Plaza Mayor", tipo: "barrio" },
  { nombre: "R-66-A (El Arco)", tipo: "barrio" },
  { nombre: "R-66-B (Parque del Príncipe)", tipo: "barrio" },
  { nombre: "Recinto Ferial", tipo: "barrio" },
  { nombre: "Residencial Universidad", tipo: "barrio" },
  { nombre: "Reyes Huertas", tipo: "barrio" },
  { nombre: "Ribera del Marco", tipo: "barrio" },
  { nombre: "Rincón de Ballesteros", tipo: "barrio" },
  { nombre: "Río Tinto", tipo: "barrio" },
  { nombre: "Ronda", tipo: "barrio" },
  { nombre: "San Blas", tipo: "barrio" },
  { nombre: "San Francisco", tipo: "barrio" },
  { nombre: "San Jorge", tipo: "barrio" },
  { nombre: "San Juan", tipo: "barrio" },
  { nombre: "San Justo", tipo: "barrio" },
  { nombre: "San Marquino", tipo: "barrio" },
  { nombre: "Santa Clara", tipo: "barrio" },
  { nombre: "Santiago", tipo: "barrio" },
  { nombre: "Seminario", tipo: "barrio" },
  { nombre: "Valdesalor", tipo: "barrio" },
  { nombre: "Vegas del Mocho", tipo: "barrio" },
  { nombre: "Vera Cruz", tipo: "barrio" },
  { nombre: "Virgen de Guadalupe", tipo: "barrio" },
  { nombre: "Virgen de la Montaña", tipo: "barrio" },
  { nombre: "Vistahermosa", tipo: "barrio" },
];

const POLIGONOS_CACERES: ZonaCiudad[] = [
  { nombre: "Polígono Industrial Aldea Moret", tipo: "poligono" },
  { nombre: "Polígono Industrial La Mejostilla", tipo: "poligono" },
  { nombre: "Polígono Industrial Las Capellanías", tipo: "poligono" },
  { nombre: "Polígono Ganadero", tipo: "poligono" },
  { nombre: "Polígono Industrial Charca Musia", tipo: "poligono" },
];

const BARRIOS_PLASENCIA: ZonaCiudad[] = [
  { nombre: "Colonia Virgen de Guadalupe - La Amistad", tipo: "barrio" },
  { nombre: "Río Jerte", tipo: "barrio" },
  { nombre: "Cotillo de San Antón - Barrio del Pilar", tipo: "barrio" },
  { nombre: "Cerro San Miguel - La Unión", tipo: "barrio" },
  { nombre: "La Esperanza", tipo: "barrio" },
  { nombre: "Sierra Santa Bárbara", tipo: "barrio" },
  { nombre: "Los Mártires", tipo: "barrio" },
  { nombre: "Vera-Elena", tipo: "barrio" },
  { nombre: "Los Alamitos", tipo: "barrio" },
  { nombre: "Miralvalle", tipo: "barrio" },
  { nombre: "Los Majuelos", tipo: "barrio" },
  { nombre: "Valle-Isla", tipo: "barrio" },
  { nombre: "Los Pinos", tipo: "barrio" },
  { nombre: "La Data", tipo: "barrio" },
  { nombre: "Rosal de Ayala", tipo: "barrio" },
  { nombre: "Cuatro Calzadas", tipo: "barrio" },
  { nombre: "Ribera del Valle", tipo: "barrio" },
  { nombre: "Rubén Darío - Gabriel y Galán", tipo: "barrio" },
  { nombre: "San Juan", tipo: "barrio" },
  { nombre: "Ciudad Jardín San Antón", tipo: "barrio" },
  { nombre: "Valcorchero", tipo: "barrio" },
  { nombre: "Los Monjes", tipo: "barrio" },
  { nombre: "Intramuros de Plasencia", tipo: "barrio" },
  { nombre: "San Gil", tipo: "barrio" },
  { nombre: "Pradochano", tipo: "barrio" },
];

const POLIGONOS_PLASENCIA: ZonaCiudad[] = [
  { nombre: "Polígono Industrial de Plasencia", tipo: "poligono" },
];

const BARRIOS_MURCIA: ZonaCiudad[] = [
  { nombre: "Buenos Aires", tipo: "barrio" },
  { nombre: "El Carmen", tipo: "barrio" },
  { nombre: "La Catedral", tipo: "barrio" },
  { nombre: "Espinardo", tipo: "barrio" },
  { nombre: "La Fama", tipo: "barrio" },
  { nombre: "La Flota", tipo: "barrio" },
  { nombre: "Infante Juan Manuel", tipo: "barrio" },
  { nombre: "Nuestra Señora de la Fuensanta", tipo: "barrio" },
  { nombre: "La Paz", tipo: "barrio" },
  { nombre: "La Purísima-Barriomar", tipo: "barrio" },
  { nombre: "El Ranero", tipo: "barrio" },
  { nombre: "San Andrés", tipo: "barrio" },
  { nombre: "San Antolín", tipo: "barrio" },
  { nombre: "San Antón", tipo: "barrio" },
  { nombre: "San Bartolomé", tipo: "barrio" },
  { nombre: "San Basilio", tipo: "barrio" },
  { nombre: "San Juan", tipo: "barrio" },
  { nombre: "San Lorenzo", tipo: "barrio" },
  { nombre: "San Miguel", tipo: "barrio" },
  { nombre: "San Nicolás", tipo: "barrio" },
  { nombre: "San Pedro", tipo: "barrio" },
  { nombre: "San Pío X", tipo: "barrio" },
  { nombre: "Santa Catalina", tipo: "barrio" },
  { nombre: "Santa Eulalia", tipo: "barrio" },
  { nombre: "Santa María de Gracia", tipo: "barrio" },
  { nombre: "Santiago el Mayor", tipo: "barrio" },
  { nombre: "Vista Alegre", tipo: "barrio" },
  { nombre: "Vistabella", tipo: "barrio" },
  { nombre: "Algezares", tipo: "barrio" },
  { nombre: "Aljucer", tipo: "barrio" },
  { nombre: "Alquerías", tipo: "barrio" },
  { nombre: "Barqueros", tipo: "barrio" },
  { nombre: "Baños y Mendigo", tipo: "barrio" },
  { nombre: "Beniaján", tipo: "barrio" },
  { nombre: "Cabezo de Torres", tipo: "barrio" },
  { nombre: "Carrascoy-La Murta", tipo: "barrio" },
  { nombre: "Casillas", tipo: "barrio" },
  { nombre: "Cañada Hermosa", tipo: "barrio" },
  { nombre: "Cañadas de San Pedro", tipo: "barrio" },
  { nombre: "Churra", tipo: "barrio" },
  { nombre: "Cobatillas", tipo: "barrio" },
  { nombre: "Corvera", tipo: "barrio" },
  { nombre: "El Esparragal", tipo: "barrio" },
  { nombre: "El Palmar", tipo: "barrio" },
  { nombre: "El Puntal", tipo: "barrio" },
  { nombre: "El Raal", tipo: "barrio" },
  { nombre: "Era Alta", tipo: "barrio" },
  { nombre: "Garres y Lages", tipo: "barrio" },
  { nombre: "Gea y Truyols", tipo: "barrio" },
  { nombre: "Guadalupe", tipo: "barrio" },
  { nombre: "Javalí Nuevo", tipo: "barrio" },
  { nombre: "Javalí Viejo", tipo: "barrio" },
  { nombre: "Jerónimo y Avileses", tipo: "barrio" },
  { nombre: "La Albatalía", tipo: "barrio" },
  { nombre: "La Alberca", tipo: "barrio" },
  { nombre: "La Arboleja", tipo: "barrio" },
  { nombre: "La Raya", tipo: "barrio" },
  { nombre: "La Ñora", tipo: "barrio" },
  { nombre: "Llano de Brujas", tipo: "barrio" },
  { nombre: "Lobosillo", tipo: "barrio" },
  { nombre: "Los Dolores", tipo: "barrio" },
  { nombre: "Los Martínez del Puerto", tipo: "barrio" },
  { nombre: "Los Ramos", tipo: "barrio" },
  { nombre: "Monteagudo", tipo: "barrio" },
  { nombre: "Nonduermas", tipo: "barrio" },
  { nombre: "Puebla de Soto", tipo: "barrio" },
  { nombre: "Puente Tocinos", tipo: "barrio" },
  { nombre: "Rincón de Beniscornia", tipo: "barrio" },
  { nombre: "Rincón de Seca", tipo: "barrio" },
  { nombre: "San Benito-Patiño", tipo: "barrio" },
  { nombre: "San Benito-Barrio del Progreso", tipo: "barrio" },
  { nombre: "San Ginés", tipo: "barrio" },
  { nombre: "San José de la Vega", tipo: "barrio" },
  { nombre: "Sangonera la Seca", tipo: "barrio" },
  { nombre: "Sangonera la Verde", tipo: "barrio" },
  { nombre: "Santa Cruz", tipo: "barrio" },
  { nombre: "Santiago y Zaraiche", tipo: "barrio" },
  { nombre: "Santo Ángel", tipo: "barrio" },
  { nombre: "Sucina", tipo: "barrio" },
  { nombre: "Torreagüera", tipo: "barrio" },
  { nombre: "Valladolises y Lo Jurado", tipo: "barrio" },
  { nombre: "Zarandona", tipo: "barrio" },
  { nombre: "Zeneta", tipo: "barrio" },
];

const POLIGONOS_MURCIA: ZonaCiudad[] = [
  { nombre: "Polígono Industrial Oeste", tipo: "poligono" },
  { nombre: "Polígono Industrial Cabezo Cortado", tipo: "poligono" },
];

const BARRIOS_CARTAGENA: ZonaCiudad[] = [
  { nombre: "Campo Nubla", tipo: "barrio" },
  { nombre: "Canteras", tipo: "barrio" },
  { nombre: "La Magdalena", tipo: "barrio" },
  { nombre: "Los Puertos", tipo: "barrio" },
  { nombre: "Perín", tipo: "barrio" },
  { nombre: "El Albujón", tipo: "barrio" },
  { nombre: "La Aljorra", tipo: "barrio" },
  { nombre: "Los Médicos", tipo: "barrio" },
  { nombre: "Miranda", tipo: "barrio" },
  { nombre: "Pozo Estrecho", tipo: "barrio" },
  { nombre: "Santa Ana", tipo: "barrio" },
  { nombre: "El Plan", tipo: "barrio" },
  { nombre: "San Félix", tipo: "barrio" },
  { nombre: "San Antonio Abad", tipo: "barrio" },
  { nombre: "Alumbres", tipo: "barrio" },
  { nombre: "El Hondón", tipo: "barrio" },
  { nombre: "Escombreras", tipo: "barrio" },
  { nombre: "Santa Lucía", tipo: "barrio" },
  { nombre: "El Lentiscar", tipo: "barrio" },
  { nombre: "La Palma", tipo: "barrio" },
  { nombre: "El Algar", tipo: "barrio" },
  { nombre: "El Beal", tipo: "barrio" },
  { nombre: "Rincón de San Ginés", tipo: "barrio" },
  { nombre: "Casco Antiguo", tipo: "barrio" },
  { nombre: "Ensanche-Almarjal", tipo: "barrio" },
  { nombre: "Barriada Virgen de la Caridad", tipo: "barrio" },
  { nombre: "San Ginés", tipo: "barrio" },
  { nombre: "Barrio de la Concepción", tipo: "barrio" },
  { nombre: "Barrio de Peral", tipo: "barrio" },
  { nombre: "Los Dolores", tipo: "barrio" },
  { nombre: "Los Barreros", tipo: "barrio" },
  { nombre: "La Baña", tipo: "barrio" },
  { nombre: "Los Gabatos", tipo: "barrio" },
  { nombre: "Barriada Cuatro Santos", tipo: "barrio" },
  { nombre: "Polígono de Santa Ana", tipo: "barrio" },
  { nombre: "Los Mateos", tipo: "barrio" },
  { nombre: "Lo Campano", tipo: "barrio" },
  { nombre: "La Manga del Mar Menor", tipo: "barrio" },
  { nombre: "Cabo de Palos", tipo: "barrio" },
  { nombre: "Los Belones", tipo: "barrio" },
  { nombre: "Mar de Cristal", tipo: "barrio" },
  { nombre: "Los Nietos", tipo: "barrio" },
  { nombre: "Los Urrutias", tipo: "barrio" },
  { nombre: "Isla Plana", tipo: "barrio" },
  { nombre: "La Azohía", tipo: "barrio" },
  { nombre: "El Portús", tipo: "barrio" },
  { nombre: "Llano del Beal", tipo: "barrio" },
  { nombre: "Molinos Marfagones", tipo: "barrio" },
  { nombre: "Torreciega", tipo: "barrio" },
  { nombre: "Vista Alegre", tipo: "barrio" },
  { nombre: "La Aparecida", tipo: "barrio" },
  { nombre: "Playa Honda", tipo: "barrio" },
  { nombre: "Los Nietos Viejos", tipo: "barrio" },
  { nombre: "Atamaría", tipo: "barrio" },
  { nombre: "Cala Reona", tipo: "barrio" },
  { nombre: "Islas Menores", tipo: "barrio" },
  { nombre: "El Estrecho de San Ginés", tipo: "barrio" },
  { nombre: "La Puebla", tipo: "barrio" },
];

const POLIGONOS_CARTAGENA: ZonaCiudad[] = [
  { nombre: "Polígono Industrial Cabezo Beaza", tipo: "poligono" },
  { nombre: "Polígono Industrial Los Camachos", tipo: "poligono" },
  { nombre: "Polígono Industrial La Palma", tipo: "poligono" },
];

const BARRIOS_LORCA: ZonaCiudad[] = [
  { nombre: "Los Ángeles-Apolonia", tipo: "barrio" },
  { nombre: "Corazón de María", tipo: "barrio" },
  { nombre: "Parroquias Altas", tipo: "barrio" },
  { nombre: "San Antonio", tipo: "barrio" },
  { nombre: "San Cristóbal", tipo: "barrio" },
  { nombre: "San José", tipo: "barrio" },
  { nombre: "San Mateo", tipo: "barrio" },
  { nombre: "Santa Quiteria", tipo: "barrio" },
  { nombre: "Santiago", tipo: "barrio" },
  { nombre: "Sutullena", tipo: "barrio" },
  { nombre: "La Viña", tipo: "barrio" },
  { nombre: "Virgen de las Huertas", tipo: "barrio" },
  { nombre: "Aguaderas", tipo: "barrio" },
  { nombre: "Almendricos", tipo: "barrio" },
  { nombre: "Avilés", tipo: "barrio" },
  { nombre: "Barranco Hondo", tipo: "barrio" },
  { nombre: "Béjar", tipo: "barrio" },
  { nombre: "Campillo", tipo: "barrio" },
  { nombre: "Carrasquilla", tipo: "barrio" },
  { nombre: "Cazalla", tipo: "barrio" },
  { nombre: "Coy", tipo: "barrio" },
  { nombre: "Culebrina", tipo: "barrio" },
  { nombre: "Doña Inés", tipo: "barrio" },
  { nombre: "La Escucha", tipo: "barrio" },
  { nombre: "Fontanares", tipo: "barrio" },
  { nombre: "Garrobillo", tipo: "barrio" },
  { nombre: "Hinojar", tipo: "barrio" },
  { nombre: "La Hoya", tipo: "barrio" },
  { nombre: "Humbrías", tipo: "barrio" },
  { nombre: "Jarales", tipo: "barrio" },
  { nombre: "Marchena", tipo: "barrio" },
  { nombre: "Morata", tipo: "barrio" },
  { nombre: "Nogalte", tipo: "barrio" },
  { nombre: "Ortillo", tipo: "barrio" },
  { nombre: "La Paca", tipo: "barrio" },
  { nombre: "Parrilla", tipo: "barrio" },
  { nombre: "Pozo Higuera", tipo: "barrio" },
  { nombre: "Pulgara", tipo: "barrio" },
  { nombre: "Puntarrón", tipo: "barrio" },
  { nombre: "Purias", tipo: "barrio" },
  { nombre: "Ramonete", tipo: "barrio" },
  { nombre: "El Río", tipo: "barrio" },
  { nombre: "Tercia", tipo: "barrio" },
  { nombre: "Tiata-La Granja", tipo: "barrio" },
  { nombre: "Torrealvilla", tipo: "barrio" },
  { nombre: "La Torrecilla", tipo: "barrio" },
  { nombre: "La Tova", tipo: "barrio" },
  { nombre: "Zarcilla de Ramos", tipo: "barrio" },
  { nombre: "Zarzadilla de Totana", tipo: "barrio" },
  { nombre: "Zarzalico", tipo: "barrio" },
];

const POLIGONOS_LORCA: ZonaCiudad[] = [
  { nombre: "Polígono Industrial Saprelorca", tipo: "poligono" },
  { nombre: "Polígono La Serrata", tipo: "poligono" },
  { nombre: "Polígono Industrial La Hoya", tipo: "poligono" },
];

const BARRIOS_MOLINA_DE_SEGURA: ZonaCiudad[] = [
  { nombre: "Fátima-Sifón", tipo: "barrio" },
  { nombre: "Punta del Lugar", tipo: "barrio" },
  { nombre: "Santa Bárbara", tipo: "barrio" },
  { nombre: "Centro", tipo: "barrio" },
  { nombre: "El Castillo", tipo: "barrio" },
  { nombre: "San Roque", tipo: "barrio" },
  { nombre: "Santa Rita", tipo: "barrio" },
  { nombre: "La Ermita", tipo: "barrio" },
  { nombre: "El Panderón", tipo: "barrio" },
  { nombre: "San José-Los Ángeles", tipo: "barrio" },
  { nombre: "San Antonio", tipo: "barrio" },
  { nombre: "San Miguel", tipo: "barrio" },
  { nombre: "Sagrado Corazón", tipo: "barrio" },
  { nombre: "El Carmen", tipo: "barrio" },
  { nombre: "Casa Ros", tipo: "barrio" },
  { nombre: "La Molineta", tipo: "barrio" },
  { nombre: "Los Vientos", tipo: "barrio" },
  { nombre: "El Chorrico", tipo: "barrio" },
  { nombre: "Altorreal", tipo: "barrio" },
  { nombre: "La Alcayna", tipo: "barrio" },
  { nombre: "Montepríncipe", tipo: "barrio" },
  { nombre: "Los Conejos", tipo: "barrio" },
  { nombre: "La Quinta", tipo: "barrio" },
  { nombre: "Los Olivos", tipo: "barrio" },
  { nombre: "El Pino", tipo: "barrio" },
  { nombre: "Casa de Maximino", tipo: "barrio" },
  { nombre: "Mirador de Agridulce II", tipo: "barrio" },
  { nombre: "El Llano", tipo: "barrio" },
  { nombre: "La Torrealta", tipo: "barrio" },
  { nombre: "La Ribera", tipo: "barrio" },
  { nombre: "El Fenazar", tipo: "barrio" },
  { nombre: "Los Valientes", tipo: "barrio" },
  { nombre: "El Romeral", tipo: "barrio" },
  { nombre: "La Hornera", tipo: "barrio" },
  { nombre: "Comala", tipo: "barrio" },
  { nombre: "El Rellano", tipo: "barrio" },
  { nombre: "Campotéjar Alta", tipo: "barrio" },
  { nombre: "Campotéjar Baja", tipo: "barrio" },
  { nombre: "La Hurona", tipo: "barrio" },
  { nombre: "La Espada", tipo: "barrio" },
  { nombre: "La Albarda", tipo: "barrio" },
];

const POLIGONOS_MOLINA_DE_SEGURA: ZonaCiudad[] = [
  { nombre: "Polígono Industrial El Tapiado", tipo: "poligono" },
  { nombre: "Polígono Industrial La Serreta", tipo: "poligono" },
  { nombre: "Polígono Industrial La Polvorista", tipo: "poligono" },
  { nombre: "Polígono Industrial La Estrella", tipo: "poligono" },
  { nombre: "Polígono Industrial Hercas", tipo: "poligono" },
];

const BARRIOS_ALCANTARILLA: ZonaCiudad[] = [
  { nombre: "San Pedro", tipo: "barrio" },
  { nombre: "San Roque", tipo: "barrio" },
  { nombre: "Campoamor", tipo: "barrio" },
  { nombre: "San José Obrero", tipo: "barrio" },
  { nombre: "Las Tejeras", tipo: "barrio" },
  { nombre: "Florentino Gómez", tipo: "barrio" },
  { nombre: "La Torrica", tipo: "barrio" },
  { nombre: "Cayitas", tipo: "barrio" },
  { nombre: "Vistabella", tipo: "barrio" },
  { nombre: "Cabezo Negro", tipo: "barrio" },
  { nombre: "Cabezo Verde", tipo: "barrio" },
  { nombre: "Santa Rosa de Lima", tipo: "barrio" },
  { nombre: "El Potrox", tipo: "barrio" },
  { nombre: "El Llano", tipo: "barrio" },
  { nombre: "Casablanca", tipo: "barrio" },
  { nombre: "Entrevías", tipo: "barrio" },
  { nombre: "Huerto de los Frailes y San Francisco", tipo: "barrio" },
  { nombre: "Santa María", tipo: "barrio" },
  { nombre: "Cabezo Gordo", tipo: "barrio" },
  { nombre: "Puebla de Soto", tipo: "barrio" },
];

const POLIGONOS_ALCANTARILLA: ZonaCiudad[] = [
  { nombre: "Polígono Industrial Cabezo Verde", tipo: "poligono" },
  { nombre: "Polígono Industrial La Coroneja", tipo: "poligono" },
  { nombre: "Parque Empresarial San Andrés", tipo: "poligono" },
];

const BARRIOS_TORRE_PACHECO: ZonaCiudad[] = [
  { nombre: "Casco", tipo: "barrio" },
  { nombre: "San José", tipo: "barrio" },
  { nombre: "San Antonio", tipo: "barrio" },
  { nombre: "Santiago", tipo: "barrio" },
  { nombre: "Urbanización Club de Tenis", tipo: "barrio" },
  { nombre: "El Pasico", tipo: "barrio" },
  { nombre: "Las Morrastellas", tipo: "barrio" },
  { nombre: "El Albardinal", tipo: "barrio" },
  { nombre: "Santa Rosalía", tipo: "barrio" },
  { nombre: "San Cayetano", tipo: "barrio" },
  { nombre: "Roldán", tipo: "barrio" },
  { nombre: "Los Meroños", tipo: "barrio" },
  { nombre: "El Jimenado", tipo: "barrio" },
  { nombre: "Los Olmos-Hoyamorena", tipo: "barrio" },
  { nombre: "La Hortichuela", tipo: "barrio" },
  { nombre: "Dolores de Pacheco", tipo: "barrio" },
  { nombre: "Camachos", tipo: "barrio" },
  { nombre: "Balsicas", tipo: "barrio" },
];

const POLIGONOS_TORRE_PACHECO: ZonaCiudad[] = [
  { nombre: "Polígono Industrial La Estrella", tipo: "poligono" },
  { nombre: "Polígono Industrial La Hita", tipo: "poligono" },
  { nombre: "Polígono Industrial Municipal de Balsicas", tipo: "poligono" },
  { nombre: "Polígono Industrial AUI Nº6 de Roldán", tipo: "poligono" },
  { nombre: "Polígono Industrial Municipal de Dolores de Pacheco", tipo: "poligono" },
  { nombre: "Parque Industrial Polaris", tipo: "poligono" },
];

const BARRIOS_AGUILAS: ZonaCiudad[] = [
  { nombre: "Barranco", tipo: "barrio" },
  { nombre: "Los Melenchones", tipo: "barrio" },
  { nombre: "Peñaranda", tipo: "barrio" },
  { nombre: "Todosol", tipo: "barrio" },
  { nombre: "Las Zurraderas", tipo: "barrio" },
  { nombre: "Los Geráneos", tipo: "barrio" },
  { nombre: "Los Arejos", tipo: "barrio" },
  { nombre: "Calarreona", tipo: "barrio" },
  { nombre: "El Cocón", tipo: "barrio" },
  { nombre: "Los Gallegos", tipo: "barrio" },
  { nombre: "Los Mayorales", tipo: "barrio" },
  { nombre: "Calabardina", tipo: "barrio" },
  { nombre: "Cope", tipo: "barrio" },
  { nombre: "Tébar", tipo: "barrio" },
  { nombre: "El Hornillo", tipo: "barrio" },
  { nombre: "Las Majadas", tipo: "barrio" },
  { nombre: "Las Molinetas", tipo: "barrio" },
];

const POLIGONOS_AGUILAS: ZonaCiudad[] = [
  { nombre: "Polígono Industrial El Labradorcico", tipo: "poligono" },
];

const BARRIOS_YECLA: ZonaCiudad[] = [
  { nombre: "García Lorca", tipo: "barrio" },
  { nombre: "Las Herratillas", tipo: "barrio" },
  { nombre: "La Alameda", tipo: "barrio" },
  { nombre: "San Cristóbal", tipo: "barrio" },
  { nombre: "Justina", tipo: "barrio" },
  { nombre: "Cayetano de Mergelina", tipo: "barrio" },
  { nombre: "San Isidro", tipo: "barrio" },
  { nombre: "La Paz", tipo: "barrio" },
  { nombre: "Santa Bárbara", tipo: "barrio" },
  { nombre: "El Sol", tipo: "barrio" },
  { nombre: "La Pedrera", tipo: "barrio" },
  { nombre: "Raspay", tipo: "barrio" },
  { nombre: "Campo Abajo", tipo: "barrio" },
  { nombre: "Campo Arriba", tipo: "barrio" },
];

const POLIGONOS_YECLA: ZonaCiudad[] = [
  { nombre: "Polígono Industrial Urbayecla", tipo: "poligono" },
  { nombre: "Polígono Industrial Las Teresas", tipo: "poligono" },
  { nombre: "Polígono Industrial La Herrada", tipo: "poligono" },
];

const BARRIOS_SAN_JAVIER: ZonaCiudad[] = [
  { nombre: "Santiago de la Ribera", tipo: "barrio" },
  { nombre: "La Manga del Mar Menor", tipo: "barrio" },
  { nombre: "El Mirador", tipo: "barrio" },
  { nombre: "La Grajuela", tipo: "barrio" },
  { nombre: "San Cayetano", tipo: "barrio" },
  { nombre: "Roda", tipo: "barrio" },
  { nombre: "Pozo Aledo", tipo: "barrio" },
  { nombre: "Castejón", tipo: "barrio" },
  { nombre: "Los Migalos", tipo: "barrio" },
  { nombre: "Los Cabos", tipo: "barrio" },
  { nombre: "Los Ríos", tipo: "barrio" },
  { nombre: "San Blas", tipo: "barrio" },
  { nombre: "Mil Flores", tipo: "barrio" },
  { nombre: "Los Pescadores", tipo: "barrio" },
  { nombre: "Ciudad del Aire", tipo: "barrio" },
  { nombre: "Los Arcos", tipo: "barrio" },
  { nombre: "Los Pozuelos", tipo: "barrio" },
  { nombre: "Los Garcías de Abajo", tipo: "barrio" },
];

const POLIGONOS_SAN_JAVIER: ZonaCiudad[] = [
  { nombre: "Polígono Industrial Venta del Pino", tipo: "poligono" },
  { nombre: "Polígono Industrial Los Urreas", tipo: "poligono" },
];

const BARRIOS_SAN_PEDRO_PINATAR: ZonaCiudad[] = [
  { nombre: "El Mojón", tipo: "barrio" },
  { nombre: "Las Esperanzas", tipo: "barrio" },
  { nombre: "Los Antolinos", tipo: "barrio" },
  { nombre: "Los Cuarteros", tipo: "barrio" },
  { nombre: "Lo Pagán", tipo: "barrio" },
  { nombre: "Los Sáez", tipo: "barrio" },
  { nombre: "San Pedro del Pinatar (casco urbano)", tipo: "barrio" },
  { nombre: "Villananitos", tipo: "barrio" },
];

const POLIGONOS_SAN_PEDRO_PINATAR: ZonaCiudad[] = [
  { nombre: "Las Beatas", tipo: "poligono" },
];

const BARRIOS_CIEZA: ZonaCiudad[] = [
  { nombre: "San Joaquín", tipo: "barrio" },
  { nombre: "La Era-La Asunción", tipo: "barrio" },
  { nombre: "La Horta", tipo: "barrio" },
  { nombre: "San Juan Bosco", tipo: "barrio" },
  { nombre: "San José Obrero", tipo: "barrio" },
  { nombre: "Residencial Ascoy", tipo: "barrio" },
  { nombre: "Ascoy", tipo: "barrio" },
  { nombre: "Barratera", tipo: "barrio" },
  { nombre: "Bolvax", tipo: "barrio" },
  { nombre: "Canadillo", tipo: "barrio" },
  { nombre: "Fuensantilla", tipo: "barrio" },
  { nombre: "Ginete", tipo: "barrio" },
  { nombre: "Horno", tipo: "barrio" },
  { nombre: "Maripinar", tipo: "barrio" },
  { nombre: "La Parra", tipo: "barrio" },
  { nombre: "Perdiguera", tipo: "barrio" },
  { nombre: "Las Ramblas", tipo: "barrio" },
];

const POLIGONOS_CIEZA: ZonaCiudad[] = [
  { nombre: "Polígono Industrial Los Prados", tipo: "poligono" },
  { nombre: "Polígono Industrial Sierra Ascoy", tipo: "poligono" },
  { nombre: "Polígono del Búho", tipo: "poligono" },
];

const BARRIOS_MAZARRON: ZonaCiudad[] = [
  { nombre: "Mazarrón", tipo: "barrio" },
  { nombre: "Puerto de Mazarrón", tipo: "barrio" },
  { nombre: "Bolnuevo", tipo: "barrio" },
  { nombre: "Atalaya", tipo: "barrio" },
  { nombre: "Balsicas", tipo: "barrio" },
  { nombre: "Cañadas del Romero", tipo: "barrio" },
  { nombre: "Gañuelas", tipo: "barrio" },
  { nombre: "Garrobo", tipo: "barrio" },
  { nombre: "Ifre-Cañada de Gallego", tipo: "barrio" },
  { nombre: "Ifre-Pastrana", tipo: "barrio" },
  { nombre: "Leiva", tipo: "barrio" },
  { nombre: "Majada", tipo: "barrio" },
  { nombre: "Mingrano", tipo: "barrio" },
  { nombre: "Moreras", tipo: "barrio" },
  { nombre: "Rincones", tipo: "barrio" },
  { nombre: "Saladillo", tipo: "barrio" },
];

const BARRIOS_TOTANA: ZonaCiudad[] = [
  { nombre: "Triana", tipo: "barrio" },
  { nombre: "Sevilla", tipo: "barrio" },
  { nombre: "La Era Alta", tipo: "barrio" },
  { nombre: "San José", tipo: "barrio" },
  { nombre: "San Francisco", tipo: "barrio" },
  { nombre: "San Roque", tipo: "barrio" },
  { nombre: "El Parral", tipo: "barrio" },
  { nombre: "Tirol-Camilleri", tipo: "barrio" },
  { nombre: "La Ramblica", tipo: "barrio" },
  { nombre: "Las Peras", tipo: "barrio" },
  { nombre: "Olímpico", tipo: "barrio" },
  { nombre: "Estación", tipo: "barrio" },
  { nombre: "Triptolemos", tipo: "barrio" },
  { nombre: "La Báscula", tipo: "barrio" },
  { nombre: "La Huerta", tipo: "barrio" },
  { nombre: "Lébor", tipo: "barrio" },
  { nombre: "Mortí", tipo: "barrio" },
  { nombre: "Ñorica", tipo: "barrio" },
  { nombre: "El Paretón-Cantareros", tipo: "barrio" },
  { nombre: "Raiguero", tipo: "barrio" },
  { nombre: "La Sierra", tipo: "barrio" },
  { nombre: "Las Viñas", tipo: "barrio" },
];

const POLIGONOS_TOTANA: ZonaCiudad[] = [
  { nombre: "Polígono Industrial El Saladar", tipo: "poligono" },
];

const BARRIOS_ALBACETE: ZonaCiudad[] = [
  { nombre: "Centro", tipo: "barrio" },
  { nombre: "Industria", tipo: "barrio" },
  { nombre: "La Pajarita", tipo: "barrio" },
  { nombre: "Nuestra Señora de Cubas", tipo: "barrio" },
  { nombre: "Santa Cruz", tipo: "barrio" },
  { nombre: "Los Llanos del Águila", tipo: "barrio" },
  { nombre: "Campollano", tipo: "barrio" },
  { nombre: "Polígono San Antón", tipo: "barrio" },
  { nombre: "San Antonio Abad", tipo: "barrio" },
  { nombre: "Villacerrada", tipo: "barrio" },
  { nombre: "Fátima", tipo: "barrio" },
  { nombre: "Franciscanos", tipo: "barrio" },
  { nombre: "Parque Sur", tipo: "barrio" },
  { nombre: "Pedro Lamata", tipo: "barrio" },
  { nombre: "San Pedro-Mortero", tipo: "barrio" },
  { nombre: "Santa Teresa", tipo: "barrio" },
  { nombre: "Casas Baratas", tipo: "barrio" },
  { nombre: "Sepulcro-Bolera", tipo: "barrio" },
  { nombre: "Vereda", tipo: "barrio" },
  { nombre: "Universidad", tipo: "barrio" },
  { nombre: "Hermanos Falcó", tipo: "barrio" },
  { nombre: "Hoya de San Ginés", tipo: "barrio" },
  { nombre: "Huerta de Monroy", tipo: "barrio" },
  { nombre: "Medicina", tipo: "barrio" },
  { nombre: "Hospital", tipo: "barrio" },
  { nombre: "Carretas-Huerta de Marzo", tipo: "barrio" },
  { nombre: "La Estrella", tipo: "barrio" },
  { nombre: "La Milagrosa", tipo: "barrio" },
  { nombre: "Miguel Ángel Blanco", tipo: "barrio" },
  { nombre: "Canal de María Cristina", tipo: "barrio" },
  { nombre: "Congo", tipo: "barrio" },
  { nombre: "El Pilar", tipo: "barrio" },
  { nombre: "Feria", tipo: "barrio" },
  { nombre: "Las Cañicas", tipo: "barrio" },
  { nombre: "Imaginalia", tipo: "barrio" },
  { nombre: "San Pablo", tipo: "barrio" },
  { nombre: "El Salobral", tipo: "barrio" },
  { nombre: "Santa Ana", tipo: "barrio" },
  { nombre: "Bacariza", tipo: "barrio" },
  { nombre: "Argamasón", tipo: "barrio" },
  { nombre: "Tinajeros", tipo: "barrio" },
  { nombre: "Campillo de las Doblas", tipo: "barrio" },
  { nombre: "Los Anguijes", tipo: "barrio" },
  { nombre: "Abuzaderas", tipo: "barrio" },
  { nombre: "Cerrolobo", tipo: "barrio" },
  { nombre: "Casa de las Monjas", tipo: "barrio" },
  { nombre: "Casa Capitán", tipo: "barrio" },
  { nombre: "Casa Grande", tipo: "barrio" },
  { nombre: "Los Llanos", tipo: "barrio" },
  { nombre: "La Pulgosa", tipo: "barrio" },
  { nombre: "La Torrecica", tipo: "barrio" },
  { nombre: "Villar de Pozo Rubio", tipo: "barrio" },
  { nombre: "Aguas Nuevas", tipo: "barrio" },
  { nombre: "El Peñascal", tipo: "barrio" },
  { nombre: "Los Rosales", tipo: "barrio" },
  { nombre: "Santa Clara", tipo: "barrio" },
  { nombre: "El Pinatar", tipo: "barrio" },
  { nombre: "La Hoya de Casa Juárez", tipo: "barrio" },
  { nombre: "Las Palomas", tipo: "barrio" },
  { nombre: "Las Rosas", tipo: "barrio" },
  { nombre: "Osuna", tipo: "barrio" },
  { nombre: "San Juan", tipo: "barrio" },
  { nombre: "Vista Alegre", tipo: "barrio" },
  { nombre: "Altos de Escucha", tipo: "barrio" },
  { nombre: "Casas Viejas", tipo: "barrio" },
  { nombre: "El Plantío", tipo: "barrio" },
  { nombre: "La Florida", tipo: "barrio" },
  { nombre: "Las Viñas", tipo: "barrio" },
  { nombre: "Los Chopos", tipo: "barrio" },
  { nombre: "Los Prados", tipo: "barrio" },
  { nombre: "Molino Ojo de San Jorge", tipo: "barrio" },
  { nombre: "San Antonio", tipo: "barrio" },
  { nombre: "Aguacampada-Las Culebras", tipo: "barrio" },
  { nombre: "Urbanización Centro", tipo: "barrio" },
  { nombre: "El Palo", tipo: "barrio" },
  { nombre: "El Trigal", tipo: "barrio" },
  { nombre: "Base Aérea de Los Llanos", tipo: "barrio" },
  { nombre: "Aguasol", tipo: "barrio" },
  { nombre: "La Pérgola", tipo: "barrio" },
  { nombre: "La Humosa", tipo: "barrio" },
  { nombre: "Riachuelos 1", tipo: "barrio" },
  { nombre: "Riachuelos 2", tipo: "barrio" },
  { nombre: "Miralcampo", tipo: "barrio" },
  { nombre: "Campoalegre", tipo: "barrio" },
  { nombre: "Pinares del Júcar", tipo: "barrio" },
];

const POLIGONOS_ALBACETE: ZonaCiudad[] = [
  { nombre: "Parque Empresarial Campollano", tipo: "poligono" },
  { nombre: "Polígono Industrial Romica", tipo: "poligono" },
  { nombre: "Polígono Industrial de la Automoción", tipo: "poligono" },
  { nombre: "Parque Aeronáutico y Logístico de Albacete", tipo: "poligono" },
  { nombre: "Parque Científico y Tecnológico de Castilla-La Mancha", tipo: "poligono" },
];

const BARRIOS_HELLIN: ZonaCiudad[] = [
  { nombre: "San Rafael", tipo: "barrio" },
  { nombre: "El Calvario", tipo: "barrio" },
  { nombre: "Santa Bárbara", tipo: "barrio" },
  { nombre: "Agramón", tipo: "barrio" },
  { nombre: "Cancarix", tipo: "barrio" },
  { nombre: "Agra", tipo: "barrio" },
  { nombre: "Cañada de Agra", tipo: "barrio" },
  { nombre: "Isso", tipo: "barrio" },
  { nombre: "Las Minas", tipo: "barrio" },
  { nombre: "Minateda", tipo: "barrio" },
  { nombre: "La Horca", tipo: "barrio" },
  { nombre: "Mingogil", tipo: "barrio" },
  { nombre: "Nava de Campaña", tipo: "barrio" },
  { nombre: "Torre Uchea", tipo: "barrio" },
  { nombre: "Rincón del Moro", tipo: "barrio" },
];

const POLIGONOS_HELLIN: ZonaCiudad[] = [
  { nombre: "Polígono Industrial La Losilla", tipo: "poligono" },
  { nombre: "Polígono Industrial de la Fuente", tipo: "poligono" },
  { nombre: "Polígono Industrial San Rafael", tipo: "poligono" },
];

const BARRIOS_CIUDAD_REAL: ZonaCiudad[] = [
  { nombre: "Plaza Mayor", tipo: "barrio" },
  { nombre: "La Morería", tipo: "barrio" },
  { nombre: "Plaza de Toros", tipo: "barrio" },
  { nombre: "El Perchel", tipo: "barrio" },
  { nombre: "El Torreón", tipo: "barrio" },
  { nombre: "El Pilar", tipo: "barrio" },
  { nombre: "Nuevo Parque", tipo: "barrio" },
  { nombre: "Los Ángeles", tipo: "barrio" },
  { nombre: "Larache", tipo: "barrio" },
  { nombre: "Ciudad Jardín", tipo: "barrio" },
  { nombre: "La Granja", tipo: "barrio" },
  { nombre: "Camino de Alarcos", tipo: "barrio" },
  { nombre: "Puerta de Santa María", tipo: "barrio" },
  { nombre: "Puerta de Toledo-Atalaya", tipo: "barrio" },
  { nombre: "Los Rosales", tipo: "barrio" },
  { nombre: "La Guija", tipo: "barrio" },
  { nombre: "Nuevo Hospital", tipo: "barrio" },
  { nombre: "Las Casas", tipo: "barrio" },
  { nombre: "Valverde", tipo: "barrio" },
  { nombre: "La Poblachuela", tipo: "barrio" },
];

const POLIGONOS_CIUDAD_REAL: ZonaCiudad[] = [
  { nombre: "Polígono Industrial Avanzado", tipo: "poligono" },
  { nombre: "Polígono Industrial Larache", tipo: "poligono" },
  { nombre: "Polígono Industrial Puerta de Toledo", tipo: "poligono" },
];

const BARRIOS_PUERTOLLANO: ZonaCiudad[] = [
  { nombre: "Santa Ana", tipo: "barrio" },
  { nombre: "Libertad", tipo: "barrio" },
  { nombre: "Las Mercedes", tipo: "barrio" },
  { nombre: "Fraternidad", tipo: "barrio" },
  { nombre: "El Villar", tipo: "barrio" },
  { nombre: "El Poblado", tipo: "barrio" },
  { nombre: "El Carmen", tipo: "barrio" },
  { nombre: "Constitución", tipo: "barrio" },
  { nombre: "Ciudad Jardín", tipo: "barrio" },
  { nombre: "Centro Sur", tipo: "barrio" },
  { nombre: "Cañamares", tipo: "barrio" },
];

const POLIGONOS_PUERTOLLANO: ZonaCiudad[] = [
  { nombre: "Polígono Industrial La Nava", tipo: "poligono" },
  { nombre: "Polígono Industrial Sepes", tipo: "poligono" },
  { nombre: "Polígono Aragonesas", tipo: "poligono" },
];

const BARRIOS_TOMELLOSO: ZonaCiudad[] = [
  { nombre: "San José Obrero", tipo: "barrio" },
  { nombre: "San Antonio", tipo: "barrio" },
  { nombre: "Nuevo Tomelloso", tipo: "barrio" },
  { nombre: "José María del Moral", tipo: "barrio" },
  { nombre: "El Carmen", tipo: "barrio" },
  { nombre: "El Pilar", tipo: "barrio" },
  { nombre: "Maternidad", tipo: "barrio" },
  { nombre: "San Juan", tipo: "barrio" },
  { nombre: "Europa", tipo: "barrio" },
];

const POLIGONOS_TOMELLOSO: ZonaCiudad[] = [
  { nombre: "Polígono Industrial El Bombo", tipo: "poligono" },
  { nombre: "Polígono Industrial Los Portales", tipo: "poligono" },
  { nombre: "Polígono Industrial 22", tipo: "poligono" },
  { nombre: "Polígono Industrial 25", tipo: "poligono" },
  { nombre: "Polígono Industrial 28", tipo: "poligono" },
  { nombre: "Polígono Industrial 30", tipo: "poligono" },
  { nombre: "Polígono Industrial 31", tipo: "poligono" },
  { nombre: "Polígono Industrial 23", tipo: "poligono" },
  { nombre: "Polígono Industrial 32", tipo: "poligono" },
];

const BARRIOS_ALCAZAR_DE_SAN_JUAN: ZonaCiudad[] = [
  { nombre: "Goya", tipo: "barrio" },
  { nombre: "La Pradera", tipo: "barrio" },
  { nombre: "La Paz", tipo: "barrio" },
  { nombre: "Los Devis", tipo: "barrio" },
  { nombre: "Los Multicines", tipo: "barrio" },
  { nombre: "San Francisco", tipo: "barrio" },
  { nombre: "Santa María", tipo: "barrio" },
  { nombre: "El Arenal", tipo: "barrio" },
  { nombre: "Casco Antiguo", tipo: "barrio" },
  { nombre: "El Porvenir", tipo: "barrio" },
  { nombre: "Parque Viejo", tipo: "barrio" },
  { nombre: "Castelar", tipo: "barrio" },
  { nombre: "Cruz Roja", tipo: "barrio" },
  { nombre: "Zona Centro", tipo: "barrio" },
  { nombre: "Ciudad Jardín", tipo: "barrio" },
  { nombre: "El Santo", tipo: "barrio" },
  { nombre: "Urbanización Avenida Pablo Iglesias", tipo: "barrio" },
  { nombre: "La Platera", tipo: "barrio" },
  { nombre: "Los Parrales", tipo: "barrio" },
  { nombre: "Suerte Peña", tipo: "barrio" },
  { nombre: "El Comino", tipo: "barrio" },
  { nombre: "Cañada del Ratón", tipo: "barrio" },
  { nombre: "Alameda de Cervera", tipo: "barrio" },
  { nombre: "Casas de Párraga", tipo: "barrio" },
  { nombre: "Los Molinos", tipo: "barrio" },
  { nombre: "Cinco Casas", tipo: "barrio" },
];

const POLIGONOS_ALCAZAR_DE_SAN_JUAN: ZonaCiudad[] = [
  { nombre: "Polígono Industrial Alces", tipo: "poligono" },
  { nombre: "Polígono Industrial Emilio Castro", tipo: "poligono" },
];

const BARRIOS_VALDEPENAS: ZonaCiudad[] = [
  { nombre: "Fátima", tipo: "barrio" },
  { nombre: "Juan Alcaide", tipo: "barrio" },
  { nombre: "La Manzana", tipo: "barrio" },
  { nombre: "Los Llanos", tipo: "barrio" },
  { nombre: "El Cristo", tipo: "barrio" },
  { nombre: "El Lucero", tipo: "barrio" },
  { nombre: "Virgen de la Cabeza", tipo: "barrio" },
  { nombre: "Zona Centro", tipo: "barrio" },
  { nombre: "Baños del Peral", tipo: "barrio" },
  { nombre: "Cachiporro", tipo: "barrio" },
  { nombre: "Consolación", tipo: "barrio" },
  { nombre: "El Ángel", tipo: "barrio" },
  { nombre: "El Molino", tipo: "barrio" },
  { nombre: "El Peral", tipo: "barrio" },
  { nombre: "Nuevo Valdepeñas", tipo: "barrio" },
  { nombre: "Parque de las Infantas-Magdalena", tipo: "barrio" },
  { nombre: "Parque del Vino", tipo: "barrio" },
  { nombre: "Zona Norte", tipo: "barrio" },
  { nombre: "Zona Paseo de la Estación-Calle Cristo", tipo: "barrio" },
];

const POLIGONOS_VALDEPENAS: ZonaCiudad[] = [
  { nombre: "Polígono Industrial Avenida del Vino", tipo: "poligono" },
  { nombre: "Polígono Industrial El Cachiporro", tipo: "poligono" },
  { nombre: "Polígono Industrial Entrecaminos", tipo: "poligono" },
  { nombre: "Polígono Industrial 1575", tipo: "poligono" },
  { nombre: "Polígono Industrial Virgen de la Paz", tipo: "poligono" },
  { nombre: "Polígono Industrial Travesía Colombia", tipo: "poligono" },
  { nombre: "Polígono Terciario de la carretera de San Carlos", tipo: "poligono" },
  { nombre: "Polígono Logístico de Consolación", tipo: "poligono" },
];

const BARRIOS_CUENCA: ZonaCiudad[] = [
  { nombre: "Buenavista", tipo: "barrio" },
  { nombre: "Casco Antiguo", tipo: "barrio" },
  { nombre: "Cerro de la Estrella", tipo: "barrio" },
  { nombre: "Ciudad Jardín", tipo: "barrio" },
  { nombre: "La Paz", tipo: "barrio" },
  { nombre: "Los Tiradores Altos", tipo: "barrio" },
  { nombre: "Los Tiradores Bajos", tipo: "barrio" },
  { nombre: "Los Moralejos", tipo: "barrio" },
  { nombre: "San Antón", tipo: "barrio" },
  { nombre: "San Fernando", tipo: "barrio" },
  { nombre: "Santa Ana", tipo: "barrio" },
  { nombre: "Santa Teresa", tipo: "barrio" },
  { nombre: "Villa Román", tipo: "barrio" },
  { nombre: "Siglo XXI", tipo: "barrio" },
  { nombre: "Cañadillas", tipo: "barrio" },
  { nombre: "Fuente del Oro", tipo: "barrio" },
  { nombre: "Las Quinientas", tipo: "barrio" },
  { nombre: "Residencial Universidad", tipo: "barrio" },
  { nombre: "Nohales", tipo: "barrio" },
  { nombre: "La Melgosa", tipo: "barrio" },
  { nombre: "Mohorte", tipo: "barrio" },
  { nombre: "Tondos", tipo: "barrio" },
  { nombre: "Villanueva de los Escuderos", tipo: "barrio" },
  { nombre: "Valdecabras", tipo: "barrio" },
  { nombre: "Cólliga", tipo: "barrio" },
  { nombre: "Colliguilla", tipo: "barrio" },
];

const POLIGONOS_CUENCA: ZonaCiudad[] = [
  { nombre: "Polígono Industrial Campsa", tipo: "poligono" },
  { nombre: "Polígono Industrial Carretera de Alcázar", tipo: "poligono" },
  { nombre: "Polígono Industrial Carretera de Motilla", tipo: "poligono" },
  { nombre: "Polígono Industrial Cuberg", tipo: "poligono" },
  { nombre: "Polígono Industrial El Cantorral", tipo: "poligono" },
  { nombre: "Polígono Industrial La Cerrajera", tipo: "poligono" },
  { nombre: "Polígono Industrial Los Palancares", tipo: "poligono" },
  { nombre: "Polígono Industrial SEPES", tipo: "poligono" },
  { nombre: "Zona Industrial Carretera de Madrid", tipo: "poligono" },
  { nombre: "Zona Industrial Avenida de los Alfares", tipo: "poligono" },
];

const BARRIOS_GUADALAJARA: ZonaCiudad[] = [
  { nombre: "Aguas Vivas", tipo: "barrio" },
  { nombre: "Alamín", tipo: "barrio" },
  { nombre: "Balconcillo", tipo: "barrio" },
  { nombre: "Los Escritores", tipo: "barrio" },
  { nombre: "Bejanque", tipo: "barrio" },
  { nombre: "Casco Histórico", tipo: "barrio" },
  { nombre: "El Clavín", tipo: "barrio" },
  { nombre: "Estación-Manantiales", tipo: "barrio" },
  { nombre: "Iriépal", tipo: "barrio" },
  { nombre: "La Chopera", tipo: "barrio" },
  { nombre: "La Esperanza", tipo: "barrio" },
  { nombre: "La Muñeca-Salinera", tipo: "barrio" },
  { nombre: "La Rambla", tipo: "barrio" },
  { nombre: "Las Adoratrices", tipo: "barrio" },
  { nombre: "Las Cañas", tipo: "barrio" },
  { nombre: "Llanilla", tipo: "barrio" },
  { nombre: "Los Valles-Sanz Vázquez", tipo: "barrio" },
  { nombre: "Panteón-El Ferial", tipo: "barrio" },
  { nombre: "Plan Sur", tipo: "barrio" },
  { nombre: "Río Henares", tipo: "barrio" },
  { nombre: "Taracena", tipo: "barrio" },
  { nombre: "Usanos", tipo: "barrio" },
  { nombre: "Valdenoches", tipo: "barrio" },
];

const POLIGONOS_GUADALAJARA: ZonaCiudad[] = [
  { nombre: "Parque Empresarial El Ruiseñor", tipo: "poligono" },
  { nombre: "Parque Logístico Puerta Centro-Ciudad del Transporte", tipo: "poligono" },
  { nombre: "Polígono Industrial El Balconcillo", tipo: "poligono" },
  { nombre: "Polígono Industrial El Henares", tipo: "poligono" },
  { nombre: "Polígono Industrial El Henares-Ampliación", tipo: "poligono" },
  { nombre: "Zona Industrial de Taracena", tipo: "poligono" },
];

const BARRIOS_AZUQUECA: ZonaCiudad[] = [
  { nombre: "Asfain", tipo: "barrio" },
  { nombre: "La Estación", tipo: "barrio" },
  { nombre: "El Vallejo", tipo: "barrio" },
  { nombre: "El Foro", tipo: "barrio" },
  { nombre: "Centro", tipo: "barrio" },
  { nombre: "La Quebradilla", tipo: "barrio" },
  { nombre: "La Paloma", tipo: "barrio" },
  { nombre: "Los Olivos", tipo: "barrio" },
  { nombre: "Vallehermoso", tipo: "barrio" },
  { nombre: "El Mirador", tipo: "barrio" },
  { nombre: "Parque del Vallejo", tipo: "barrio" },
  { nombre: "Residencial Siglo XXI", tipo: "barrio" },
  { nombre: "Residencial Parque Arcipreste", tipo: "barrio" },
  { nombre: "Residencial Alhucema", tipo: "barrio" },
  { nombre: "Residencial Los Jardines", tipo: "barrio" },
  { nombre: "Azuqueca Norte", tipo: "barrio" },
];

const POLIGONOS_AZUQUECA: ZonaCiudad[] = [
  { nombre: "Polígono Industrial Aida I", tipo: "poligono" },
  { nombre: "Polígono Industrial Aida II", tipo: "poligono" },
  { nombre: "Polígono Industrial Comendador", tipo: "poligono" },
  { nombre: "Polígono Industrial Garona", tipo: "poligono" },
  { nombre: "Polígono Industrial Miralcampo", tipo: "poligono" },
  { nombre: "Polígono Industrial Ródano", tipo: "poligono" },
  { nombre: "Polígono Industrial Sena", tipo: "poligono" },
];

const BARRIOS_OVIEDO: ZonaCiudad[] = [
  { nombre: "Antiguo-Casco Histórico", tipo: "barrio" },
  { nombre: "Argañosa", tipo: "barrio" },
  { nombre: "Buenavista", tipo: "barrio" },
  { nombre: "Ciudad Naranco", tipo: "barrio" },
  { nombre: "Colloto", tipo: "barrio" },
  { nombre: "El Cristo", tipo: "barrio" },
  { nombre: "El Milán", tipo: "barrio" },
  { nombre: "El Pontón de Vaqueros", tipo: "barrio" },
  { nombre: "Fitoria", tipo: "barrio" },
  { nombre: "Fozaneldi", tipo: "barrio" },
  { nombre: "Guillén-La Fuerza", tipo: "barrio" },
  { nombre: "La Corredoria", tipo: "barrio" },
  { nombre: "La Ería", tipo: "barrio" },
  { nombre: "La Florida", tipo: "barrio" },
  { nombre: "La Monxina", tipo: "barrio" },
  { nombre: "Las Campas", tipo: "barrio" },
  { nombre: "Montecerrao", tipo: "barrio" },
  { nombre: "Olivares", tipo: "barrio" },
  { nombre: "Otero", tipo: "barrio" },
  { nombre: "Pando", tipo: "barrio" },
  { nombre: "Parque de Invierno", tipo: "barrio" },
  { nombre: "Pumarín", tipo: "barrio" },
  { nombre: "San Claudio", tipo: "barrio" },
  { nombre: "San Lázaro", tipo: "barrio" },
  { nombre: "Teatinos", tipo: "barrio" },
  { nombre: "Tenderina", tipo: "barrio" },
  { nombre: "Vallobín", tipo: "barrio" },
  { nombre: "Ventanielles", tipo: "barrio" },
  { nombre: "Villafría", tipo: "barrio" },
  { nombre: "La Manjoya", tipo: "barrio" },
  { nombre: "Trubia", tipo: "barrio" },
  { nombre: "Olloniego", tipo: "barrio" },
  { nombre: "Tudela Veguín", tipo: "barrio" },
  { nombre: "Caces", tipo: "barrio" },
  { nombre: "Las Caldas", tipo: "barrio" },
  { nombre: "Latores", tipo: "barrio" },
  { nombre: "Limanes", tipo: "barrio" },
  { nombre: "Manzaneda", tipo: "barrio" },
  { nombre: "Naranco Rural", tipo: "barrio" },
  { nombre: "Sograndio", tipo: "barrio" },
  { nombre: "Udrión", tipo: "barrio" },
  { nombre: "Villapérez", tipo: "barrio" },
  { nombre: "Villamiana", tipo: "barrio" },
];

const POLIGONOS_OVIEDO: ZonaCiudad[] = [
  { nombre: "Área Industrial de Olloniego-Tudela", tipo: "poligono" },
  { nombre: "Área Industrial de Tudela Agüeria", tipo: "poligono" },
  { nombre: "Área Industrial de Trubia", tipo: "poligono" },
  { nombre: "Polígono Industrial Cerdeño", tipo: "poligono" },
  { nombre: "Polígono Industrial Espíritu Santo", tipo: "poligono" },
  { nombre: "Polígono Industrial Ferreros", tipo: "poligono" },
  { nombre: "Polígono Industrial Olloniego", tipo: "poligono" },
  { nombre: "Polígono Industrial de Olloniego-Tudela", tipo: "poligono" },
  { nombre: "Polígono Industrial de Tudela Veguín", tipo: "poligono" },
];

const BARRIOS_AMES: ZonaCiudad[] = [
  { nombre: "Agrón", tipo: "barrio" },
  { nombre: "Ameixenda", tipo: "barrio" },
  { nombre: "Bertamiráns", tipo: "barrio" },
  { nombre: "Bugallido", tipo: "barrio" },
  { nombre: "Covas", tipo: "barrio" },
  { nombre: "Lens", tipo: "barrio" },
  { nombre: "O Milladoiro", tipo: "barrio" },
  { nombre: "Ortoño", tipo: "barrio" },
  { nombre: "Piñeiro", tipo: "barrio" },
  { nombre: "Tapia", tipo: "barrio" },
  { nombre: "Trasmonte", tipo: "barrio" },
  { nombre: "Ames (San Tomé)", tipo: "barrio" },
  { nombre: "Biduído", tipo: "barrio" },
  { nombre: "Aldea de Abaixo", tipo: "barrio" },
  { nombre: "Augapesada", tipo: "barrio" },
  { nombre: "Balcaide", tipo: "barrio" },
  { nombre: "Bertamiráns – O Bosque", tipo: "barrio" },
  { nombre: "Bugallido – Firmistáns", tipo: "barrio" },
  { nombre: "Cruxeiras", tipo: "barrio" },
  { nombre: "Eirapedriña", tipo: "barrio" },
  { nombre: "Lapido", tipo: "barrio" },
  { nombre: "Ortoño – Sisalde", tipo: "barrio" },
  { nombre: "Piñeiro – Frenza", tipo: "barrio" },
  { nombre: "Ponte Maceira", tipo: "barrio" },
  { nombre: "Seidón", tipo: "barrio" },
  { nombre: "Ventín", tipo: "barrio" },
];

const POLIGONOS_AMES: ZonaCiudad[] = [
  { nombre: "Parque Empresarial Novo Milladoiro", tipo: "poligono" },
];

const BARRIOS_ARTEIXO: ZonaCiudad[] = [
  { nombre: "A Baiuca", tipo: "barrio" },
  { nombre: "Arteixo", tipo: "barrio" },
  { nombre: "Barrañán", tipo: "barrio" },
  { nombre: "Chamín", tipo: "barrio" },
  { nombre: "Froxel", tipo: "barrio" },
  { nombre: "Larín", tipo: "barrio" },
  { nombre: "Loureda", tipo: "barrio" },
  { nombre: "Meicende", tipo: "barrio" },
  { nombre: "Morás", tipo: "barrio" },
  { nombre: "Oseiro", tipo: "barrio" },
  { nombre: "Pastoriza", tipo: "barrio" },
  { nombre: "Suevos", tipo: "barrio" },
  { nombre: "Vilarrodís", tipo: "barrio" },
  { nombre: "Sol y Mar", tipo: "barrio" },
  { nombre: "Añas", tipo: "barrio" },
  { nombre: "Armentón", tipo: "barrio" },
  { nombre: "A Xesteira", tipo: "barrio" },
  { nombre: "Barrañán de Arriba", tipo: "barrio" },
  { nombre: "Candame", tipo: "barrio" },
  { nombre: "Chamín de Arriba", tipo: "barrio" },
  { nombre: "Lañas", tipo: "barrio" },
  { nombre: "Monteagudo", tipo: "barrio" },
  { nombre: "Oseiro de Abaixo", tipo: "barrio" },
  { nombre: "Rañobre", tipo: "barrio" },
  { nombre: "Sorrizo", tipo: "barrio" },
  { nombre: "Suevos de Abaixo", tipo: "barrio" },
  { nombre: "Suevos de Arriba", tipo: "barrio" },
  { nombre: "Urbanización Sol y Mar", tipo: "barrio" },
  { nombre: "Vioño", tipo: "barrio" },
];

const POLIGONOS_ARTEIXO: ZonaCiudad[] = [
  { nombre: "Parque Empresarial de Morás", tipo: "poligono" },
  { nombre: "Parque Empresarial de Suevos", tipo: "poligono" },
  { nombre: "Polígono Industrial de Sabón", tipo: "poligono" },
  { nombre: "Polígono Industrial O Petón", tipo: "poligono" },
  { nombre: "Puerto Exterior de Punta Langosteira", tipo: "poligono" },
];

const BARRIOS_CARBALLO: ZonaCiudad[] = [
  { nombre: "A Granxa", tipo: "barrio" },
  { nombre: "A Milagrosa", tipo: "barrio" },
  { nombre: "A Ponte Rosende", tipo: "barrio" },
  { nombre: "A Vila", tipo: "barrio" },
  { nombre: "Aldemunde", tipo: "barrio" },
  { nombre: "Ardaña", tipo: "barrio" },
  { nombre: "Artes", tipo: "barrio" },
  { nombre: "Berdillo", tipo: "barrio" },
  { nombre: "Bértoa", tipo: "barrio" },
  { nombre: "Cances", tipo: "barrio" },
  { nombre: "Carballo", tipo: "barrio" },
  { nombre: "Entrecruces", tipo: "barrio" },
  { nombre: "Goiáns", tipo: "barrio" },
  { nombre: "Hospital", tipo: "barrio" },
  { nombre: "Lema", tipo: "barrio" },
  { nombre: "Noicela", tipo: "barrio" },
  { nombre: "Oza", tipo: "barrio" },
  { nombre: "Razo", tipo: "barrio" },
  { nombre: "Rebordelos", tipo: "barrio" },
  { nombre: "Rus", tipo: "barrio" },
  { nombre: "Sísamo", tipo: "barrio" },
  { nombre: "Sofán", tipo: "barrio" },
  { nombre: "Vilela", tipo: "barrio" },
];

const POLIGONOS_CARBALLO: ZonaCiudad[] = [
  { nombre: "Parque Empresarial de Bértoa", tipo: "poligono" },
  { nombre: "Zona Industrial de Queo de Arriba", tipo: "poligono" },
  { nombre: "Zona Industrial de Industrias Calvo", tipo: "poligono" },
];

const BARRIOS_CULLEREDO: ZonaCiudad[] = [
  { nombre: "Almeiras", tipo: "barrio" },
  { nombre: "A Marisqueira", tipo: "barrio" },
  { nombre: "A Xira", tipo: "barrio" },
  { nombre: "Boedo", tipo: "barrio" },
  { nombre: "Celas", tipo: "barrio" },
  { nombre: "Cordeda", tipo: "barrio" },
  { nombre: "Culleredo", tipo: "barrio" },
  { nombre: "Ledoño", tipo: "barrio" },
  { nombre: "O Burgo", tipo: "barrio" },
  { nombre: "Orro", tipo: "barrio" },
  { nombre: "Rutis", tipo: "barrio" },
  { nombre: "San Martiño de Sésamo", tipo: "barrio" },
  { nombre: "Sueiro", tipo: "barrio" },
  { nombre: "Tarrío", tipo: "barrio" },
  { nombre: "Veiga", tipo: "barrio" },
  { nombre: "Vilaboa", tipo: "barrio" },
  { nombre: "Alvedro", tipo: "barrio" },
  { nombre: "Fonteculler", tipo: "barrio" },
  { nombre: "O Portádego", tipo: "barrio" },
  { nombre: "A Corveira", tipo: "barrio" },
  { nombre: "A Zapateira", tipo: "barrio" },
  { nombre: "Acea de Ama", tipo: "barrio" },
  { nombre: "Castro Laxe", tipo: "barrio" },
  { nombre: "Monte Xalo", tipo: "barrio" },
];

const POLIGONOS_CULLEREDO: ZonaCiudad[] = [
  { nombre: "Centro Logístico de Transporte de Ledoño", tipo: "poligono" },
  { nombre: "Parque Empresarial de Alvedro", tipo: "poligono" },
  { nombre: "Polígono Industrial A Granxa", tipo: "poligono" },
  { nombre: "Polígono Industrial A Marisqueira", tipo: "poligono" },
  { nombre: "Zona Industrial de Ledoño", tipo: "poligono" },
];

const BARRIOS_RIBEIRA: ZonaCiudad[] = [
  { nombre: "Aguiño", tipo: "barrio" },
  { nombre: "Artes", tipo: "barrio" },
  { nombre: "As Avesadas", tipo: "barrio" },
  { nombre: "Carreira", tipo: "barrio" },
  { nombre: "Castiñeiras", tipo: "barrio" },
  { nombre: "Corrubedo", tipo: "barrio" },
  { nombre: "Deán Grande", tipo: "barrio" },
  { nombre: "Deán Pequeno", tipo: "barrio" },
  { nombre: "Frións", tipo: "barrio" },
  { nombre: "Olveira", tipo: "barrio" },
  { nombre: "Palmeira", tipo: "barrio" },
  { nombre: "Ribeira (Santa Uxía)", tipo: "barrio" },
  { nombre: "Sirves", tipo: "barrio" },
  { nombre: "Oleiros", tipo: "barrio" },
  { nombre: "Vixán", tipo: "barrio" },
  { nombre: "O Touro", tipo: "barrio" },
  { nombre: "Areeiros", tipo: "barrio" },
  { nombre: "A Graña", tipo: "barrio" },
  { nombre: "A Capela", tipo: "barrio" },
  { nombre: "A Laxe", tipo: "barrio" },
  { nombre: "A Pedra Pateira", tipo: "barrio" },
  { nombre: "O Vilar", tipo: "barrio" },
  { nombre: "A Ameixida", tipo: "barrio" },
  { nombre: "O Porto", tipo: "barrio" },
  { nombre: "A Cobasa", tipo: "barrio" },
  { nombre: "Areeiros de Carreira", tipo: "barrio" },
];

const POLIGONOS_RIBEIRA: ZonaCiudad[] = [
  { nombre: "Polígono Industrial de Xarás", tipo: "poligono" },
  { nombre: "Nuevo Polígono Industrial de Ribeira (Oleiros-Palmeira)", tipo: "poligono" },
];

const BARRIOS_LA_NUCIA: ZonaCiudad[] = [
  { nombre: "Arcos Este", tipo: "barrio" },
  { nombre: "Arcos Norte", tipo: "barrio" },
  { nombre: "Barranc Fondo", tipo: "barrio" },
  { nombre: "Bello Horizonte", tipo: "barrio" },
  { nombre: "Caravana", tipo: "barrio" },
  { nombre: "Cautivador", tipo: "barrio" },
  { nombre: "Colina, La", tipo: "barrio" },
  { nombre: "Coloma", tipo: "barrio" },
  { nombre: "Convent de les Monges", tipo: "barrio" },
  { nombre: "Copet", tipo: "barrio" },
  { nombre: "El Dorado", tipo: "barrio" },
  { nombre: "El Tossal", tipo: "barrio" },
  { nombre: "Entrepinos", tipo: "barrio" },
  { nombre: "Floriana", tipo: "barrio" },
  { nombre: "Hapimag", tipo: "barrio" },
  { nombre: "Holiday Club", tipo: "barrio" },
  { nombre: "Kristal", tipo: "barrio" },
  { nombre: "La Nucía Pueblo", tipo: "barrio" },
  { nombre: "La Perla", tipo: "barrio" },
  { nombre: "La Torre", tipo: "barrio" },
  { nombre: "Las Orquídeas", tipo: "barrio" },
  { nombre: "Las Vegas", tipo: "barrio" },
  { nombre: "Los Arcos", tipo: "barrio" },
  { nombre: "Los Olivos", tipo: "barrio" },
  { nombre: "Maylan", tipo: "barrio" },
  { nombre: "Montahud", tipo: "barrio" },
  { nombre: "Montecasino", tipo: "barrio" },
  { nombre: "Montebello", tipo: "barrio" },
  { nombre: "Nou Espai I", tipo: "barrio" },
  { nombre: "Nou Espai II", tipo: "barrio" },
  { nombre: "Nucía Hills", tipo: "barrio" },
  { nombre: "Nucía Park", tipo: "barrio" },
  { nombre: "Panorama", tipo: "barrio" },
  { nombre: "Patrax", tipo: "barrio" },
  { nombre: "Patricia", tipo: "barrio" },
  { nombre: "Pinar de Garaita", tipo: "barrio" },
  { nombre: "Pla de Garaita", tipo: "barrio" },
  { nombre: "Puerto Azul", tipo: "barrio" },
  { nombre: "Puerta de Hierro", tipo: "barrio" },
  { nombre: "Rosales", tipo: "barrio" },
  { nombre: "San Rafael", tipo: "barrio" },
  { nombre: "Sol Saliente", tipo: "barrio" },
  { nombre: "Varadero", tipo: "barrio" },
];

const POLIGONOS_LA_NUCIA: ZonaCiudad[] = [
  { nombre: "Polígono Industrial L'Alberca", tipo: "poligono" },
];

const BARRIOS_AVILES: ZonaCiudad[] = [
  { nombre: "Buenavista", tipo: "barrio" },
  { nombre: "Bustiello", tipo: "barrio" },
  { nombre: "El Alfaraz", tipo: "barrio" },
  { nombre: "El Carbayedo", tipo: "barrio" },
  { nombre: "El Nodo", tipo: "barrio" },
  { nombre: "El Pozón", tipo: "barrio" },
  { nombre: "Heros", tipo: "barrio" },
  { nombre: "Jardín de Cantos", tipo: "barrio" },
  { nombre: "La Carriona", tipo: "barrio" },
  { nombre: "La Grandiella", tipo: "barrio" },
  { nombre: "La Luz", tipo: "barrio" },
  { nombre: "La Maruca", tipo: "barrio" },
  { nombre: "La Texera", tipo: "barrio" },
  { nombre: "La Villa", tipo: "barrio" },
  { nombre: "Las Meanas", tipo: "barrio" },
  { nombre: "Llaranes", tipo: "barrio" },
  { nombre: "Miranda", tipo: "barrio" },
  { nombre: "Polígono de La Magdalena", tipo: "barrio" },
  { nombre: "Sabugo", tipo: "barrio" },
  { nombre: "San Cristóbal", tipo: "barrio" },
  { nombre: "Valliniello", tipo: "barrio" },
  { nombre: "Valgranda", tipo: "barrio" },
  { nombre: "Versalles", tipo: "barrio" },
  { nombre: "Villalegre", tipo: "barrio" },
  { nombre: "Puerta de la Villa", tipo: "barrio" },
  { nombre: "El Arbolón", tipo: "barrio" },
  { nombre: "San Juan de Nieva", tipo: "barrio" },
];

const POLIGONOS_AVILES: ZonaCiudad[] = [
  { nombre: "Parque Empresarial Principado de Asturias (PEPA)", tipo: "poligono" },
  { nombre: "Polígono Industrial de Las Arobias", tipo: "poligono" },
  { nombre: "Polígono Industrial de Maqua", tipo: "poligono" },
  { nombre: "Polígono Industrial de La Magdalena", tipo: "poligono" },
  { nombre: "Polígono Industrial de Valliniello", tipo: "poligono" },
  { nombre: "Zona Industrial de San Juan de Nieva", tipo: "poligono" },
];

const BARRIOS_LANGREO: ZonaCiudad[] = [
  { nombre: "Barros", tipo: "barrio" },
  { nombre: "Ciaño", tipo: "barrio" },
  { nombre: "El Puente", tipo: "barrio" },
  { nombre: "La Felguera", tipo: "barrio" },
  { nombre: "Lada", tipo: "barrio" },
  { nombre: "La Nueva", tipo: "barrio" },
  { nombre: "Les Pieces", tipo: "barrio" },
  { nombre: "Pando", tipo: "barrio" },
  { nombre: "Pampiedra", tipo: "barrio" },
  { nombre: "Riaño", tipo: "barrio" },
  { nombre: "Sama", tipo: "barrio" },
  { nombre: "Tuilla", tipo: "barrio" },
  { nombre: "La Mudrera", tipo: "barrio" },
  { nombre: "La Nava", tipo: "barrio" },
  { nombre: "El Entrego", tipo: "barrio" },
  { nombre: "La Joécara", tipo: "barrio" },
  { nombre: "La Pomar", tipo: "barrio" },
  { nombre: "La Reguera", tipo: "barrio" },
  { nombre: "La Oscura", tipo: "barrio" },
  { nombre: "La Braña", tipo: "barrio" },
  { nombre: "La Inverniza", tipo: "barrio" },
  { nombre: "San Roque", tipo: "barrio" },
  { nombre: "La Hueria de Carrocera", tipo: "barrio" },
  { nombre: "La Hueria de San Xuan", tipo: "barrio" },
  { nombre: "El Viso", tipo: "barrio" },
  { nombre: "La Felguera - Barrio Urquijo", tipo: "barrio" },
  { nombre: "La Felguera - Grupo San Pedro", tipo: "barrio" },
  { nombre: "La Felguera - Grupo La Concordia", tipo: "barrio" },
];

const POLIGONOS_LANGREO: ZonaCiudad[] = [
  { nombre: "Ciudad Industrial Valnalón", tipo: "poligono" },
  { nombre: "Planta Industrial Alas Iberia", tipo: "poligono" },
  { nombre: "Planta Industrial Industrial Química del Nalón", tipo: "poligono" },
  { nombre: "Polígono Industrial El Cadavíu", tipo: "poligono" },
  { nombre: "Polígono Industrial La Moral", tipo: "poligono" },
  { nombre: "Polígono Industrial Lada-Meriñán", tipo: "poligono" },
  { nombre: "Polígono Industrial Modesta", tipo: "poligono" },
  { nombre: "Polígono Industrial Riaño I", tipo: "poligono" },
  { nombre: "Polígono Industrial Riaño II", tipo: "poligono" },
  { nombre: "Polígono Industrial Riaño III", tipo: "poligono" },
  { nombre: "Zona Industrial de Barros", tipo: "poligono" },
];

const BARRIOS_MIERES: ZonaCiudad[] = [
  { nombre: "Ablaña", tipo: "barrio" },
  { nombre: "Baiña", tipo: "barrio" },
  { nombre: "Bustiello", tipo: "barrio" },
  { nombre: "Figaredo", tipo: "barrio" },
  { nombre: "La Peña", tipo: "barrio" },
  { nombre: "La Rebollá", tipo: "barrio" },
  { nombre: "Loredo", tipo: "barrio" },
  { nombre: "Mieres del Camín", tipo: "barrio" },
  { nombre: "Santa Cruz", tipo: "barrio" },
  { nombre: "Santuyano", tipo: "barrio" },
  { nombre: "Siana", tipo: "barrio" },
  { nombre: "Turón", tipo: "barrio" },
  { nombre: "Ujo", tipo: "barrio" },
  { nombre: "Urbiés", tipo: "barrio" },
  { nombre: "Valdecuna", tipo: "barrio" },
  { nombre: "Valdefarrucos", tipo: "barrio" },
  { nombre: "Vega de Arriba", tipo: "barrio" },
];

const POLIGONOS_MIERES: ZonaCiudad[] = [
  { nombre: "Polígono Industrial Ablaña", tipo: "poligono" },
  { nombre: "Polígono Industrial Baiña (Vega de Baiña)", tipo: "poligono" },
  { nombre: "Polígono Industrial Fábrica de Mieres", tipo: "poligono" },
  { nombre: "Polígono Industrial Gonzalín", tipo: "poligono" },
  { nombre: "Polígono Industrial La Cuadriella", tipo: "poligono" },
  { nombre: "Polígono Industrial La Gerencia", tipo: "poligono" },
  { nombre: "Polígono Industrial Las Lleras (Ujo)", tipo: "poligono" },
  { nombre: "Polígono Industrial Loredo", tipo: "poligono" },
  { nombre: "Polígono Industrial Reicastro", tipo: "poligono" },
  { nombre: "Polígono Industrial Sovilla", tipo: "poligono" },
  { nombre: "Polígono Industrial Vega de Arriba", tipo: "poligono" },
];

const BARRIOS_SIERO: ZonaCiudad[] = [
  { nombre: "Anes", tipo: "barrio" },
  { nombre: "Argüelles", tipo: "barrio" },
  { nombre: "Aramil", tipo: "barrio" },
  { nombre: "Bobes", tipo: "barrio" },
  { nombre: "Carbayín Alto", tipo: "barrio" },
  { nombre: "Carbayín Bajo", tipo: "barrio" },
  { nombre: "Celles", tipo: "barrio" },
  { nombre: "Collado", tipo: "barrio" },
  { nombre: "El Berrón", tipo: "barrio" },
  { nombre: "El Cuto", tipo: "barrio" },
  { nombre: "Feleches", tipo: "barrio" },
  { nombre: "Granda", tipo: "barrio" },
  { nombre: "Hevia", tipo: "barrio" },
  { nombre: "La Carrera", tipo: "barrio" },
  { nombre: "La Fresneda", tipo: "barrio" },
  { nombre: "La Pola Siero", tipo: "barrio" },
  { nombre: "La Secada", tipo: "barrio" },
  { nombre: "La Collá", tipo: "barrio" },
  { nombre: "Lieres", tipo: "barrio" },
  { nombre: "Llimanes", tipo: "barrio" },
  { nombre: "Lugones", tipo: "barrio" },
  { nombre: "Marcenao", tipo: "barrio" },
  { nombre: "Muñó", tipo: "barrio" },
  { nombre: "Santa Marta de Carbayín", tipo: "barrio" },
  { nombre: "Santa Marina", tipo: "barrio" },
  { nombre: "Santolaya de Vixil", tipo: "barrio" },
  { nombre: "Santolaya de Turiellos", tipo: "barrio" },
  { nombre: "Samartindianes", tipo: "barrio" },
  { nombre: "Samartino", tipo: "barrio" },
  { nombre: "Santiago de Arenas", tipo: "barrio" },
  { nombre: "Trespando", tipo: "barrio" },
  { nombre: "Tiñana", tipo: "barrio" },
  { nombre: "Valdesoto", tipo: "barrio" },
  { nombre: "Viella", tipo: "barrio" },
];

const POLIGONOS_SIERO: ZonaCiudad[] = [
  { nombre: "Águila del Nora", tipo: "poligono" },
  { nombre: "Bravo", tipo: "poligono" },
  { nombre: "Buenavista", tipo: "poligono" },
  { nombre: "Berrón Este", tipo: "poligono" },
  { nombre: "Berrón Oeste", tipo: "poligono" },
  { nombre: "Berrón Sur", tipo: "poligono" },
  { nombre: "Bobes-San Miguel", tipo: "poligono" },
  { nombre: "Colloto", tipo: "poligono" },
  { nombre: "El Castro", tipo: "poligono" },
  { nombre: "Polígono · Granda", tipo: "poligono" },
  { nombre: "La Meana", tipo: "poligono" },
  { nombre: "La Tejera", tipo: "poligono" },
  { nombre: "Las Peñes", tipo: "poligono" },
  { nombre: "Las Vías", tipo: "poligono" },
  { nombre: "Lieres-Solvay", tipo: "poligono" },
  { nombre: "Lugones Norte", tipo: "poligono" },
  { nombre: "Lugones Sur", tipo: "poligono" },
  { nombre: "Meres-Proni", tipo: "poligono" },
  { nombre: "Naón", tipo: "poligono" },
  { nombre: "Perográn", tipo: "poligono" },
  { nombre: "Puente Nora", tipo: "poligono" },
  { nombre: "Sía Copper", tipo: "poligono" },
  { nombre: "Polígono · Viella", tipo: "poligono" },
];

const BARRIOS_MARTORELL: ZonaCiudad[] = [
  { nombre: "Buenos Aires", tipo: "barrio" },
  { nombre: "Camí Fondo", tipo: "barrio" },
  { nombre: "Can Carreres", tipo: "barrio" },
  { nombre: "Can Cases", tipo: "barrio" },
  { nombre: "Can Bros", tipo: "barrio" },
  { nombre: "El Pla", tipo: "barrio" },
  { nombre: "La Sínia", tipo: "barrio" },
  { nombre: "Les Bòbiles", tipo: "barrio" },
  { nombre: "Martorell Vell (La Vila)", tipo: "barrio" },
  { nombre: "Pou del Merlí", tipo: "barrio" },
  { nombre: "Rosanes", tipo: "barrio" },
  { nombre: "Torrent de Llops", tipo: "barrio" },
  { nombre: "Verge del Carme", tipo: "barrio" },
];

const POLIGONOS_MARTORELL: ZonaCiudad[] = [
  { nombre: "Polígono · Can Bros", tipo: "poligono" },
  { nombre: "Can Cases–Can Sunyol", tipo: "poligono" },
  { nombre: "El Congost", tipo: "poligono" },
  { nombre: "L'Empalme", tipo: "poligono" },
  { nombre: "La Torre", tipo: "poligono" },
  { nombre: "Polígono SEAT", tipo: "poligono" },
  { nombre: "Polígono Solvay", tipo: "poligono" },
  { nombre: "Polígono · Rosanes", tipo: "poligono" },
];

const BARRIOS_SANTA_PERPETUA: ZonaCiudad[] = [
  { nombre: "Can Folguera", tipo: "barrio" },
  { nombre: "Can Taió", tipo: "barrio" },
  { nombre: "Centre Vila", tipo: "barrio" },
  { nombre: "La Florida", tipo: "barrio" },
  { nombre: "Mas Costa", tipo: "barrio" },
  { nombre: "Mogoda", tipo: "barrio" },
  { nombre: "Santiga", tipo: "barrio" },
  { nombre: "Terrablanca", tipo: "barrio" },
];

const POLIGONOS_SANTA_PERPETUA: ZonaCiudad[] = [
  { nombre: "Ca n’Oller", tipo: "poligono" },
  { nombre: "Camp de les Pereres", tipo: "poligono" },
  { nombre: "Can Banús", tipo: "poligono" },
  { nombre: "Can Bernades-Subirà", tipo: "poligono" },
  { nombre: "Can Vinyalets", tipo: "poligono" },
  { nombre: "Can Vinyals", tipo: "poligono" },
  { nombre: "CIM Vallès – Les Minetes", tipo: "poligono" },
  { nombre: "La Creueta", tipo: "poligono" },
  { nombre: "Polígono · La Florida", tipo: "poligono" },
  { nombre: "Les Vinyes de Mogoda", tipo: "poligono" },
  { nombre: "Polígono · Santiga", tipo: "poligono" },
  { nombre: "Torre del Rector", tipo: "poligono" },
];

const BARRIOS_SANT_BOI: ZonaCiudad[] = [
  { nombre: "Ciutat Cooperativa i Molí Nou", tipo: "barrio" },
  { nombre: "Marianao", tipo: "barrio" },
  { nombre: "Centre", tipo: "barrio" },
  { nombre: "Vinyets i Molí Vell", tipo: "barrio" },
  { nombre: "Camps Blancs", tipo: "barrio" },
  { nombre: "Casablanca", tipo: "barrio" },
];

const POLIGONOS_SANT_BOI: ZonaCiudad[] = [
  { nombre: "Salas", tipo: "poligono" },
  { nombre: "Abat Oliva", tipo: "poligono" },
  { nombre: "Fonollar Nord", tipo: "poligono" },
  { nombre: "Can Calderon", tipo: "poligono" },
  { nombre: "Fonollar Sud - Bullidor", tipo: "poligono" },
  { nombre: "Salines", tipo: "poligono" },
  { nombre: "Prologis Park", tipo: "poligono" },
  { nombre: "Sector Comercial Alcampo", tipo: "poligono" },
];

const BARRIOS_CALVIA: ZonaCiudad[] = [
  { nombre: "Bendinat", tipo: "barrio" },
  { nombre: "Cala Fornells", tipo: "barrio" },
  { nombre: "Cala Vinyes", tipo: "barrio" },
  { nombre: "Calvià Vila", tipo: "barrio" },
  { nombre: "Cas Català", tipo: "barrio" },
  { nombre: "Costa d'en Blanes", tipo: "barrio" },
  { nombre: "Costa de la Calma", tipo: "barrio" },
  { nombre: "El Toro", tipo: "barrio" },
  { nombre: "Es Capdellà", tipo: "barrio" },
  { nombre: "Galatzó", tipo: "barrio" },
  { nombre: "Illetes", tipo: "barrio" },
  { nombre: "Magaluf", tipo: "barrio" },
  { nombre: "Nova Santa Ponça", tipo: "barrio" },
  { nombre: "Palmanova", tipo: "barrio" },
  { nombre: "Peguera", tipo: "barrio" },
  { nombre: "Portals Nous", tipo: "barrio" },
  { nombre: "Portals Vells", tipo: "barrio" },
  { nombre: "Santa Ponça", tipo: "barrio" },
  { nombre: "Son Caliu", tipo: "barrio" },
  { nombre: "Son Ferrer", tipo: "barrio" },
  { nombre: "Sol de Mallorca", tipo: "barrio" },
  { nombre: "Torrenova", tipo: "barrio" },
];

const POLIGONOS_CALVIA: ZonaCiudad[] = [
  { nombre: "Son Bugadelles", tipo: "poligono" },
];

const BARRIOS_CIUTADELLA: ZonaCiudad[] = [
  { nombre: "Cala Blanca", tipo: "barrio" },
  { nombre: "Cala en Blanes", tipo: "barrio" },
  { nombre: "Cala en Bosch", tipo: "barrio" },
  { nombre: "Cala en Forcat", tipo: "barrio" },
  { nombre: "Cala Morell", tipo: "barrio" },
  { nombre: "Cap d'Artrutx", tipo: "barrio" },
  { nombre: "Ciutadella (casco urbano)", tipo: "barrio" },
  { nombre: "Sa Caleta", tipo: "barrio" },
  { nombre: "Santandria", tipo: "barrio" },
  { nombre: "Son Oleo", tipo: "barrio" },
  { nombre: "Son Xoriguer", tipo: "barrio" },
  { nombre: "Torre del Ram", tipo: "barrio" },
];

const POLIGONOS_CIUTADELLA: ZonaCiudad[] = [
  { nombre: "Polígono Industrial de Ciutadella (POICI)", tipo: "poligono" },
];

const BARRIOS_LLUCMAJOR: ZonaCiudad[] = [
  { nombre: "Badia Blava", tipo: "barrio" },
  { nombre: "Badia Gran", tipo: "barrio" },
  { nombre: "Bellavista", tipo: "barrio" },
  { nombre: "Cala Blava", tipo: "barrio" },
  { nombre: "Cala Pi", tipo: "barrio" },
  { nombre: "Es Pas de Vallgornera", tipo: "barrio" },
  { nombre: "Es Puigderrós", tipo: "barrio" },
  { nombre: "Les Palmeres", tipo: "barrio" },
  { nombre: "Llucmajor (casco urbano)", tipo: "barrio" },
  { nombre: "Maioris Dècima", tipo: "barrio" },
  { nombre: "S'Arenal", tipo: "barrio" },
  { nombre: "Sa Torre", tipo: "barrio" },
  { nombre: "S'Estanyol de Migjorn", tipo: "barrio" },
  { nombre: "Son Bieló", tipo: "barrio" },
  { nombre: "Son Verí Nou", tipo: "barrio" },
  { nombre: "Son Verí Vell", tipo: "barrio" },
  { nombre: "Tolleric", tipo: "barrio" },
];

const POLIGONOS_LLUCMAJOR: ZonaCiudad[] = [
  { nombre: "Son Noguera", tipo: "poligono" },
  { nombre: "Son Fosquet", tipo: "poligono" },
];

const BARRIOS_MANACOR: ZonaCiudad[] = [
  { nombre: "Cala Anguila", tipo: "barrio" },
  { nombre: "Cala Domingos", tipo: "barrio" },
  { nombre: "Cala Mandia", tipo: "barrio" },
  { nombre: "Cala Murada", tipo: "barrio" },
  { nombre: "Cala Romàntica", tipo: "barrio" },
  { nombre: "Manacor (casco urbano)", tipo: "barrio" },
  { nombre: "Porto Cristo", tipo: "barrio" },
  { nombre: "s’Illot", tipo: "barrio" },
  { nombre: "Son Macià", tipo: "barrio" },
];

const POLIGONOS_MANACOR: ZonaCiudad[] = [
  { nombre: "Polígono Industrial de Manacor", tipo: "poligono" },
  { nombre: "Polígono Agroalimentario de Manacor", tipo: "poligono" },
  { nombre: "Son Talent (zona de servicios y actividad económica)", tipo: "poligono" },
];

const BARRIOS_MAO: ZonaCiudad[] = [
  { nombre: "Binixíquer", tipo: "barrio" },
  { nombre: "Cala Llonga", tipo: "barrio" },
  { nombre: "Cala Mesquida", tipo: "barrio" },
  { nombre: "Cala Rata", tipo: "barrio" },
  { nombre: "Camí d’en Barrotes", tipo: "barrio" },
  { nombre: "Dalt Sant Joan", tipo: "barrio" },
  { nombre: "Es Canutells", tipo: "barrio" },
  { nombre: "Es Grau", tipo: "barrio" },
  { nombre: "Es Murtar", tipo: "barrio" },
  { nombre: "Fort de l’Eau", tipo: "barrio" },
  { nombre: "Llucmaçanes", tipo: "barrio" },
  { nombre: "Malbúger", tipo: "barrio" },
  { nombre: "Maó (casco urbano)", tipo: "barrio" },
  { nombre: "Sa Mesquida", tipo: "barrio" },
  { nombre: "Sant Climent", tipo: "barrio" },
  { nombre: "Sínia Costabella", tipo: "barrio" },
  { nombre: "Sínia Morera", tipo: "barrio" },
  { nombre: "Ses Vinyes", tipo: "barrio" },
  { nombre: "S’altra Banda", tipo: "barrio" },
  { nombre: "Binidalí", tipo: "barrio" },
];

const POLIGONOS_MAO: ZonaCiudad[] = [
  { nombre: "POIMA (Polígono Industrial de Maó)", tipo: "poligono" },
];

const BARRIOS_MARRATXI: ZonaCiudad[] = [
  { nombre: "Cas Capità", tipo: "barrio" },
  { nombre: "Cas Miot", tipo: "barrio" },
  { nombre: "Can Carbonell", tipo: "barrio" },
  { nombre: "Es Caülls", tipo: "barrio" },
  { nombre: "Es Figueral", tipo: "barrio" },
  { nombre: "Es Garrovers", tipo: "barrio" },
  { nombre: "Es Pla de na Tesa", tipo: "barrio" },
  { nombre: "Es Pont d’Inca", tipo: "barrio" },
  { nombre: "Es Pont d’Inca Nou", tipo: "barrio" },
  { nombre: "Marratxinet", tipo: "barrio" },
  { nombre: "Planera", tipo: "barrio" },
  { nombre: "Pòrtol", tipo: "barrio" },
  { nombre: "Sa Cabaneta", tipo: "barrio" },
  { nombre: "Sa Cabana", tipo: "barrio" },
  { nombre: "Sant Marçal", tipo: "barrio" },
  { nombre: "Sant Llatzet", tipo: "barrio" },
  { nombre: "Ses Cases Noves", tipo: "barrio" },
  { nombre: "Son Ametller", tipo: "barrio" },
  { nombre: "Son Daviu", tipo: "barrio" },
  { nombre: "Son Macià", tipo: "barrio" },
  { nombre: "Son Ramonell", tipo: "barrio" },
  { nombre: "Son Verí", tipo: "barrio" },
];

const POLIGONOS_MARRATXI: ZonaCiudad[] = [
  { nombre: "Can Rubiol", tipo: "poligono" },
  { nombre: "Polígono Industrial de Marratxí", tipo: "poligono" },
];

const BARRIOS_PALMA: ZonaCiudad[] = [
  { nombre: "Aeroport", tipo: "barrio" },
  { nombre: "Arxiduc", tipo: "barrio" },
  { nombre: "Bons Aires", tipo: "barrio" },
  { nombre: "Cala Major", tipo: "barrio" },
  { nombre: "Cal Capiscol", tipo: "barrio" },
  { nombre: "Can Capes", tipo: "barrio" },
  { nombre: "Can Pastilla", tipo: "barrio" },
  { nombre: "Can Pere Antoni", tipo: "barrio" },
  { nombre: "Casco Antiguo", tipo: "barrio" },
  { nombre: "Coll d’en Rabassa", tipo: "barrio" },
  { nombre: "Cort", tipo: "barrio" },
  { nombre: "El Amanecer", tipo: "barrio" },
  { nombre: "El Camp d’en Serralta", tipo: "barrio" },
  { nombre: "El Camp Redó", tipo: "barrio" },
  { nombre: "El Jonquet", tipo: "barrio" },
  { nombre: "El Molinar", tipo: "barrio" },
  { nombre: "El Rafal Nou", tipo: "barrio" },
  { nombre: "El Rafal Vell", tipo: "barrio" },
  { nombre: "El Terreno", tipo: "barrio" },
  { nombre: "Els Hostalets", tipo: "barrio" },
  { nombre: "Establiments", tipo: "barrio" },
  { nombre: "Foners", tipo: "barrio" },
  { nombre: "Gènova", tipo: "barrio" },
  { nombre: "La Bonanova", tipo: "barrio" },
  { nombre: "La Calatrava", tipo: "barrio" },
  { nombre: "La Indioteria", tipo: "barrio" },
  { nombre: "La Llotja-El Born", tipo: "barrio" },
  { nombre: "La Missió", tipo: "barrio" },
  { nombre: "La Soledat Nord", tipo: "barrio" },
  { nombre: "La Soledat Sud", tipo: "barrio" },
  { nombre: "La Teulera", tipo: "barrio" },
  { nombre: "Les Meravelles", tipo: "barrio" },
  { nombre: "L’Arenal", tipo: "barrio" },
  { nombre: "L’Aranjassa", tipo: "barrio" },
  { nombre: "Monti-sion", tipo: "barrio" },
  { nombre: "Nou Llevant", tipo: "barrio" },
  { nombre: "Plaça de Toros", tipo: "barrio" },
  { nombre: "Plaça dels Patins", tipo: "barrio" },
  { nombre: "Portopí", tipo: "barrio" },
  { nombre: "Pere Garau", tipo: "barrio" },
  { nombre: "Sant Agustí", tipo: "barrio" },
  { nombre: "Sant Jaume", tipo: "barrio" },
  { nombre: "Sant Nicolau", tipo: "barrio" },
  { nombre: "Santa Catalina", tipo: "barrio" },
  { nombre: "Sant Jordi", tipo: "barrio" },
  { nombre: "Son Armadans", tipo: "barrio" },
  { nombre: "Son Cotoner", tipo: "barrio" },
  { nombre: "Son Cladera", tipo: "barrio" },
  { nombre: "Son Dureta", tipo: "barrio" },
  { nombre: "Son Espanyolet", tipo: "barrio" },
  { nombre: "Son Ferriol", tipo: "barrio" },
  { nombre: "Son Fortesa Nord", tipo: "barrio" },
  { nombre: "Son Fortesa Sud", tipo: "barrio" },
  { nombre: "Son Gotleu", tipo: "barrio" },
  { nombre: "Son Oliva", tipo: "barrio" },
  { nombre: "Son Rapinya", tipo: "barrio" },
  { nombre: "Son Roca", tipo: "barrio" },
  { nombre: "Son Rutlan", tipo: "barrio" },
  { nombre: "Son Sardina", tipo: "barrio" },
  { nombre: "Son Serra-La Vileta", tipo: "barrio" },
  { nombre: "Son Ximelis", tipo: "barrio" },
  { nombre: "Zona Portuària", tipo: "barrio" },
];

const POLIGONOS_PALMA: ZonaCiudad[] = [
  { nombre: "Can Valero", tipo: "poligono" },
  { nombre: "Ciudad Jardín", tipo: "poligono" },
  { nombre: "Llevant", tipo: "poligono" },
  { nombre: "Parc Bit", tipo: "poligono" },
  { nombre: "Son Castelló", tipo: "poligono" },
  { nombre: "Polígono · Son Ferriol", tipo: "poligono" },
  { nombre: "Son Fuster", tipo: "poligono" },
  { nombre: "Son Morro", tipo: "poligono" },
  { nombre: "Son Oms", tipo: "poligono" },
  { nombre: "Son Rossinyol", tipo: "poligono" },
  { nombre: "Son Valentí", tipo: "poligono" },
];

const BARRIOS_SANTA_EULARIA: ZonaCiudad[] = [
  { nombre: "Cala Llonga", tipo: "barrio" },
  { nombre: "Cala Martina", tipo: "barrio" },
  { nombre: "Cala Pada", tipo: "barrio" },
  { nombre: "Cala Llenya", tipo: "barrio" },
  { nombre: "Can Fornet", tipo: "barrio" },
  { nombre: "Can Negre", tipo: "barrio" },
  { nombre: "Can Ramón", tipo: "barrio" },
  { nombre: "Es Canar", tipo: "barrio" },
  { nombre: "Es Figueral", tipo: "barrio" },
  { nombre: "Jesús", tipo: "barrio" },
  { nombre: "Puig d’en Valls", tipo: "barrio" },
  { nombre: "Roca Llisa", tipo: "barrio" },
  { nombre: "Sant Carles de Peralta", tipo: "barrio" },
  { nombre: "Santa Eulària des Riu (casco urbano)", tipo: "barrio" },
  { nombre: "Santa Gertrudis de Fruitera", tipo: "barrio" },
  { nombre: "Siesta", tipo: "barrio" },
  { nombre: "Valverde", tipo: "barrio" },
];

const POLIGONOS_SANTA_EULARIA: ZonaCiudad[] = [
  { nombre: "Ca na Negreta", tipo: "poligono" },
  { nombre: "Ca na Palava", tipo: "poligono" },
  { nombre: "Can Bufí", tipo: "poligono" },
  { nombre: "Polígono · Can Negre", tipo: "poligono" },
  { nombre: "Cas Corb", tipo: "poligono" },
  { nombre: "Can Xiquet Pou", tipo: "poligono" },
];

const BARRIOS_CADIZ: ZonaCiudad[] = [
  { nombre: "Alameda-San Carlos", tipo: "barrio" },
  { nombre: "Asdrúbal", tipo: "barrio" },
  { nombre: "Astilleros", tipo: "barrio" },
  { nombre: "Bahía Blanca", tipo: "barrio" },
  { nombre: "Barriada de La Paz", tipo: "barrio" },
  { nombre: "Brasil", tipo: "barrio" },
  { nombre: "Brunete", tipo: "barrio" },
  { nombre: "Candelaria", tipo: "barrio" },
  { nombre: "Callejones", tipo: "barrio" },
  { nombre: "Cerro del Moro", tipo: "barrio" },
  { nombre: "Cuarteles", tipo: "barrio" },
  { nombre: "El Balón", tipo: "barrio" },
  { nombre: "El Mentidero", tipo: "barrio" },
  { nombre: "El Pópulo", tipo: "barrio" },
  { nombre: "Falla", tipo: "barrio" },
  { nombre: "Hospital de Mujeres", tipo: "barrio" },
  { nombre: "La Laguna", tipo: "barrio" },
  { nombre: "Loreto", tipo: "barrio" },
  { nombre: "Puntales", tipo: "barrio" },
  { nombre: "Residencia", tipo: "barrio" },
  { nombre: "San Antonio", tipo: "barrio" },
  { nombre: "San Felipe", tipo: "barrio" },
  { nombre: "San Francisco-Mina", tipo: "barrio" },
  { nombre: "San José", tipo: "barrio" },
  { nombre: "San Juan", tipo: "barrio" },
  { nombre: "San Severiano", tipo: "barrio" },
  { nombre: "Santa María", tipo: "barrio" },
  { nombre: "Santa María del Mar", tipo: "barrio" },
  { nombre: "Segunda Aguada", tipo: "barrio" },
  { nombre: "Trille", tipo: "barrio" },
  { nombre: "La Viña", tipo: "barrio" },
  { nombre: "Paseo Marítimo", tipo: "barrio" },
];

const POLIGONOS_CADIZ: ZonaCiudad[] = [
  { nombre: "Recinto Exterior de la Zona Franca", tipo: "poligono" },
  { nombre: "Recinto Interior de la Zona Franca", tipo: "poligono" },
  { nombre: "Zona Industrial de Cádiz", tipo: "poligono" },
  { nombre: "Zona portuaria e industrial", tipo: "poligono" },
];

const BARRIOS_ALGECIRAS: ZonaCiudad[] = [
  { nombre: "Adalides", tipo: "barrio" },
  { nombre: "Acebuchal", tipo: "barrio" },
  { nombre: "El Cobre", tipo: "barrio" },
  { nombre: "El Faro", tipo: "barrio" },
  { nombre: "El Pelayo", tipo: "barrio" },
  { nombre: "El Rinconcillo", tipo: "barrio" },
  { nombre: "El Saladillo", tipo: "barrio" },
  { nombre: "Getares", tipo: "barrio" },
  { nombre: "La Bajadilla", tipo: "barrio" },
  { nombre: "La Granja", tipo: "barrio" },
  { nombre: "La Piñera", tipo: "barrio" },
  { nombre: "La Reconquista", tipo: "barrio" },
  { nombre: "Las Herrizas", tipo: "barrio" },
  { nombre: "Los Guijos", tipo: "barrio" },
  { nombre: "Los Pastores", tipo: "barrio" },
  { nombre: "Los Pinos", tipo: "barrio" },
  { nombre: "María Cristina", tipo: "barrio" },
  { nombre: "Pescadores", tipo: "barrio" },
  { nombre: "San Bernabé", tipo: "barrio" },
  { nombre: "San García", tipo: "barrio" },
  { nombre: "San Isidro", tipo: "barrio" },
  { nombre: "San José Artesano", tipo: "barrio" },
  { nombre: "San Severiano", tipo: "barrio" },
  { nombre: "Villa Nueva", tipo: "barrio" },
  { nombre: "Villa Vieja", tipo: "barrio" },
];

const POLIGONOS_ALGECIRAS: ZonaCiudad[] = [
  { nombre: "Cortijo Real", tipo: "poligono" },
  { nombre: "La Menacha", tipo: "poligono" },
  { nombre: "Las Pilas", tipo: "poligono" },
  { nombre: "Parque Empresarial Bahía de Algeciras", tipo: "poligono" },
];

const BARRIOS_ARCOS: ZonaCiudad[] = [
  { nombre: "Barrio Alto", tipo: "barrio" },
  { nombre: "Barrio Bajo", tipo: "barrio" },
  { nombre: "Casco Histórico", tipo: "barrio" },
  { nombre: "El Portichuelo", tipo: "barrio" },
  { nombre: "El Santiscal", tipo: "barrio" },
  { nombre: "El Retiro", tipo: "barrio" },
  { nombre: "La Angorrilla", tipo: "barrio" },
  { nombre: "La Verbena", tipo: "barrio" },
  { nombre: "Las Canteras", tipo: "barrio" },
  { nombre: "Las Nieves", tipo: "barrio" },
  { nombre: "San Jorge", tipo: "barrio" },
  { nombre: "Vega de los Molinos", tipo: "barrio" },
  { nombre: "Jédula", tipo: "barrio" },
  { nombre: "Junta de los Ríos", tipo: "barrio" },
  { nombre: "La Perdiz", tipo: "barrio" },
];

const POLIGONOS_ARCOS: ZonaCiudad[] = [
  { nombre: "El Peral (Parque Empresarial)", tipo: "poligono" },
  { nombre: "Polígono · El Retiro", tipo: "poligono" },
  { nombre: "Jadramil", tipo: "poligono" },
  { nombre: "Polígono · Jédula", tipo: "poligono" },
];

const BARRIOS_CHICLANA: ZonaCiudad[] = [
  { nombre: "Carabina", tipo: "barrio" },
  { nombre: "Carboneros", tipo: "barrio" },
  { nombre: "Cerro del Moro", tipo: "barrio" },
  { nombre: "Ciudad Jardín", tipo: "barrio" },
  { nombre: "Costa Sancti Petri", tipo: "barrio" },
  { nombre: "El Arenal", tipo: "barrio" },
  { nombre: "El Castillo", tipo: "barrio" },
  { nombre: "El Carmen", tipo: "barrio" },
  { nombre: "El Marquesado", tipo: "barrio" },
  { nombre: "El Pilar", tipo: "barrio" },
  { nombre: "El Retortillo", tipo: "barrio" },
  { nombre: "Fuente Amarga", tipo: "barrio" },
  { nombre: "Huerta del Rosario", tipo: "barrio" },
  { nombre: "La Barrosa", tipo: "barrio" },
  { nombre: "La Coquina", tipo: "barrio" },
  { nombre: "La Pedrera", tipo: "barrio" },
  { nombre: "La Soledad", tipo: "barrio" },
  { nombre: "Las Albinas", tipo: "barrio" },
  { nombre: "Las Bolas", tipo: "barrio" },
  { nombre: "Las Conejeras", tipo: "barrio" },
  { nombre: "Las Mogarizas", tipo: "barrio" },
  { nombre: "Los Gallos", tipo: "barrio" },
  { nombre: "Los Esteros", tipo: "barrio" },
  { nombre: "Novo Sancti Petri", tipo: "barrio" },
  { nombre: "Pago del Humo", tipo: "barrio" },
  { nombre: "Pago Melilla", tipo: "barrio" },
  { nombre: "Pinar de los Franceses", tipo: "barrio" },
  { nombre: "Pinar del Hierro-Espartosa", tipo: "barrio" },
  { nombre: "Rana Verde", tipo: "barrio" },
  { nombre: "Santa Ana", tipo: "barrio" },
  { nombre: "Santo Cristo", tipo: "barrio" },
  { nombre: "Solagitas", tipo: "barrio" },
  { nombre: "Solano", tipo: "barrio" },
  { nombre: "Urbisur", tipo: "barrio" },
];

const POLIGONOS_CHICLANA: ZonaCiudad[] = [
  { nombre: "El Torno", tipo: "poligono" },
  { nombre: "La Hoya", tipo: "poligono" },
  { nombre: "Pelagatos I", tipo: "poligono" },
  { nombre: "Pelagatos II (Miralrío)", tipo: "poligono" },
  { nombre: "Parque Comercial e Industrial Urbisur", tipo: "poligono" },
  { nombre: "Carretera Nacional 340 – Avenida del Mueble", tipo: "poligono" },
];

const BARRIOS_EL_PUERTO: ZonaCiudad[] = [
  { nombre: "Barriada de La Vid", tipo: "barrio" },
  { nombre: "Barriada de Malacara", tipo: "barrio" },
  { nombre: "Barriada Nuestra Señora del Mar", tipo: "barrio" },
  { nombre: "Barriada Fermesa", tipo: "barrio" },
  { nombre: "Barriada Francisco García", tipo: "barrio" },
  { nombre: "Casco Antiguo", tipo: "barrio" },
  { nombre: "Costa Oeste", tipo: "barrio" },
  { nombre: "Doña Blanca", tipo: "barrio" },
  { nombre: "El Carmen", tipo: "barrio" },
  { nombre: "El Juncal", tipo: "barrio" },
  { nombre: "El Tomillar", tipo: "barrio" },
  { nombre: "La Andreíta", tipo: "barrio" },
  { nombre: "La Florida", tipo: "barrio" },
  { nombre: "La Hijuela", tipo: "barrio" },
  { nombre: "Las Redes", tipo: "barrio" },
  { nombre: "Los Frailes", tipo: "barrio" },
  { nombre: "Poblado de Doña Blanca", tipo: "barrio" },
  { nombre: "Poblado Naval", tipo: "barrio" },
  { nombre: "Puerto Sherry", tipo: "barrio" },
  { nombre: "Puerto Bajo", tipo: "barrio" },
  { nombre: "Sudamérica", tipo: "barrio" },
  { nombre: "Valdelagrana", tipo: "barrio" },
  { nombre: "Vallealto", tipo: "barrio" },
  { nombre: "Vistahermosa", tipo: "barrio" },
];

const POLIGONOS_EL_PUERTO: ZonaCiudad[] = [
  { nombre: "Bahía de Cádiz", tipo: "poligono" },
  { nombre: "El Martillo", tipo: "poligono" },
  { nombre: "El Palmar", tipo: "poligono" },
  { nombre: "Guadalete", tipo: "poligono" },
  { nombre: "Las Salinas de Levante", tipo: "poligono" },
  { nombre: "Las Salinas de Poniente", tipo: "poligono" },
  { nombre: "Las Salinas de San José Alto", tipo: "poligono" },
  { nombre: "Las Salinas de San José Bajo", tipo: "poligono" },
  { nombre: "San Ignacio-Sierra", tipo: "poligono" },
  { nombre: "TecnoBahía (Parque Tecnológico)", tipo: "poligono" },
  { nombre: "Parque Comercial La Isleta", tipo: "poligono" },
];

const BARRIOS_JEREZ: ZonaCiudad[] = [
  { nombre: "Agrimensor", tipo: "barrio" },
  { nombre: "Albarizas de Montealto", tipo: "barrio" },
  { nombre: "Alameda Vieja", tipo: "barrio" },
  { nombre: "Alegría", tipo: "barrio" },
  { nombre: "Almendral", tipo: "barrio" },
  { nombre: "Asunción", tipo: "barrio" },
  { nombre: "Bami", tipo: "barrio" },
  { nombre: "Barbadillo", tipo: "barrio" },
  { nombre: "Blas Infante", tipo: "barrio" },
  { nombre: "El Bosque", tipo: "barrio" },
  { nombre: "El Calvario", tipo: "barrio" },
  { nombre: "El Carmen", tipo: "barrio" },
  { nombre: "El Pelirón", tipo: "barrio" },
  { nombre: "El Pimiento", tipo: "barrio" },
  { nombre: "El Rocío", tipo: "barrio" },
  { nombre: "El Retiro", tipo: "barrio" },
  { nombre: "Estancia Barrera", tipo: "barrio" },
  { nombre: "Eduardo Delage", tipo: "barrio" },
  { nombre: "Federico Mayo", tipo: "barrio" },
  { nombre: "Guernica", tipo: "barrio" },
  { nombre: "Hacienda El Polo", tipo: "barrio" },
  { nombre: "Icovesa", tipo: "barrio" },
  { nombre: "Jacaranda", tipo: "barrio" },
  { nombre: "Jerez Norte", tipo: "barrio" },
  { nombre: "Juan XXIII", tipo: "barrio" },
  { nombre: "La Canaleja", tipo: "barrio" },
  { nombre: "La Cañada", tipo: "barrio" },
  { nombre: "La Constancia", tipo: "barrio" },
  { nombre: "La Coronación", tipo: "barrio" },
  { nombre: "La Granja", tipo: "barrio" },
  { nombre: "La Marquesa", tipo: "barrio" },
  { nombre: "La Pita", tipo: "barrio" },
  { nombre: "La Plata", tipo: "barrio" },
  { nombre: "La Serrana", tipo: "barrio" },
  { nombre: "La Teja", tipo: "barrio" },
  { nombre: "La Unión", tipo: "barrio" },
  { nombre: "La Vid", tipo: "barrio" },
  { nombre: "Las Adelfas", tipo: "barrio" },
  { nombre: "Las Flores", tipo: "barrio" },
  { nombre: "Las Palmeras", tipo: "barrio" },
  { nombre: "Las Torres", tipo: "barrio" },
  { nombre: "Las Viñas", tipo: "barrio" },
  { nombre: "Los Álamos de Montealto", tipo: "barrio" },
  { nombre: "Los Cedros", tipo: "barrio" },
  { nombre: "Los Infantes", tipo: "barrio" },
  { nombre: "Los Naranjos", tipo: "barrio" },
  { nombre: "Los Pinos", tipo: "barrio" },
  { nombre: "Madre de Dios", tipo: "barrio" },
  { nombre: "Montealegre", tipo: "barrio" },
  { nombre: "Montealto", tipo: "barrio" },
  { nombre: "Nazaret", tipo: "barrio" },
  { nombre: "Nueva Andalucía", tipo: "barrio" },
  { nombre: "Nuevo Chapín", tipo: "barrio" },
  { nombre: "Nuevo Montealto", tipo: "barrio" },
  { nombre: "Olivar de Rivero", tipo: "barrio" },
  { nombre: "Parque Atlántico", tipo: "barrio" },
  { nombre: "Picadueña Alta", tipo: "barrio" },
  { nombre: "Picadueña Baja", tipo: "barrio" },
  { nombre: "Pozoalbero", tipo: "barrio" },
  { nombre: "Puerta del Sur", tipo: "barrio" },
  { nombre: "Residencial Cartuja", tipo: "barrio" },
  { nombre: "Residencial Chapín", tipo: "barrio" },
  { nombre: "Residencial El Estribo", tipo: "barrio" },
  { nombre: "Residencial La Sierra", tipo: "barrio" },
  { nombre: "Residencial Las Bodegas", tipo: "barrio" },
  { nombre: "San Benito", tipo: "barrio" },
  { nombre: "San Enrique", tipo: "barrio" },
  { nombre: "San Ginés de la Jara", tipo: "barrio" },
  { nombre: "San Joaquín", tipo: "barrio" },
  { nombre: "San José Obrero", tipo: "barrio" },
  { nombre: "San Juan de Dios", tipo: "barrio" },
  { nombre: "San Miguel", tipo: "barrio" },
  { nombre: "San Pedro", tipo: "barrio" },
  { nombre: "San Telmo", tipo: "barrio" },
  { nombre: "San Telmo Nuevo", tipo: "barrio" },
  { nombre: "San Valentín", tipo: "barrio" },
  { nombre: "Santiago", tipo: "barrio" },
  { nombre: "Santo Ángel de la Guarda", tipo: "barrio" },
  { nombre: "Santo Tomás de Aquino", tipo: "barrio" },
  { nombre: "Torresblancas", tipo: "barrio" },
  { nombre: "Torresoto", tipo: "barrio" },
  { nombre: "Torres del Sur", tipo: "barrio" },
  { nombre: "Vallesequillo", tipo: "barrio" },
  { nombre: "Vallesequillo II", tipo: "barrio" },
  { nombre: "Villa del Este", tipo: "barrio" },
  { nombre: "Vista Alegre", tipo: "barrio" },
  { nombre: "Zafer", tipo: "barrio" },
  { nombre: "Añina", tipo: "barrio" },
  { nombre: "Cuartillos", tipo: "barrio" },
  { nombre: "El Portal", tipo: "barrio" },
  { nombre: "Estella del Marqués", tipo: "barrio" },
  { nombre: "Gibalbín", tipo: "barrio" },
  { nombre: "Guadalcacín", tipo: "barrio" },
  { nombre: "La Barca de la Florida", tipo: "barrio" },
  { nombre: "Las Tablas", tipo: "barrio" },
  { nombre: "Lomopardo", tipo: "barrio" },
  { nombre: "Mesas de Asta", tipo: "barrio" },
  { nombre: "Nueva Jarilla", tipo: "barrio" },
  { nombre: "Rajamancera", tipo: "barrio" },
  { nombre: "San Isidro del Guadalete", tipo: "barrio" },
  { nombre: "Torrecera", tipo: "barrio" },
  { nombre: "El Torno", tipo: "barrio" },
];

const POLIGONOS_JEREZ: ZonaCiudad[] = [
  { nombre: "Avenida de Europa", tipo: "poligono" },
  { nombre: "Bertola", tipo: "poligono" },
  { nombre: "Cassimar", tipo: "poligono" },
  { nombre: "Ciudad del Transporte – Cañada Ancha", tipo: "poligono" },
  { nombre: "Polígono · El Portal", tipo: "poligono" },
  { nombre: "El Porvenir", tipo: "poligono" },
  { nombre: "Polígono · Estella del Marqués", tipo: "poligono" },
  { nombre: "Garrapilos", tipo: "poligono" },
  { nombre: "Guadalquivir", tipo: "poligono" },
  { nombre: "Las Bodegas", tipo: "poligono" },
  { nombre: "Navestrella II", tipo: "poligono" },
  { nombre: "Parque Comercial Luz Shopping", tipo: "poligono" },
  { nombre: "Parque Empresarial de Jerez", tipo: "poligono" },
  { nombre: "Parque Empresarial Oeste", tipo: "poligono" },
  { nombre: "Parque Industrial Autopista", tipo: "poligono" },
  { nombre: "Parque Tecnológico Agroindustrial", tipo: "poligono" },
  { nombre: "Polígono · Pozoalbero", tipo: "poligono" },
  { nombre: "Santa Cruz", tipo: "poligono" },
  { nombre: "Bodegas Las Copas", tipo: "poligono" },
];

const BARRIOS_PUERTO_REAL: ZonaCiudad[] = [
  { nombre: "Barrio Jarana", tipo: "barrio" },
  { nombre: "Casco Histórico", tipo: "barrio" },
  { nombre: "El Almendral", tipo: "barrio" },
  { nombre: "El Marquesado", tipo: "barrio" },
  { nombre: "La Chacona", tipo: "barrio" },
  { nombre: "Meadero de la Reina", tipo: "barrio" },
  { nombre: "Río San Pedro", tipo: "barrio" },
  { nombre: "Torre Alta", tipo: "barrio" },
  { nombre: "Villanueva–Aldea Real", tipo: "barrio" },
];

const POLIGONOS_PUERTO_REAL: ZonaCiudad[] = [
  { nombre: "Astilleros (Matagorda)", tipo: "poligono" },
  { nombre: "La Cabezuela", tipo: "poligono" },
  { nombre: "Río San Pedro – Zona Industrial", tipo: "poligono" },
  { nombre: "Trocadero", tipo: "poligono" },
  { nombre: "Tres Caminos", tipo: "poligono" },
];

const BARRIOS_SAN_ROQUE: ZonaCiudad[] = [
  { nombre: "Alcaidesa", tipo: "barrio" },
  { nombre: "Campamento", tipo: "barrio" },
  { nombre: "Estación de San Roque", tipo: "barrio" },
  { nombre: "Fuente María España", tipo: "barrio" },
  { nombre: "Guadarranque", tipo: "barrio" },
  { nombre: "Guadiaro", tipo: "barrio" },
  { nombre: "La Ermita", tipo: "barrio" },
  { nombre: "La Paz", tipo: "barrio" },
  { nombre: "Miraflores", tipo: "barrio" },
  { nombre: "Pueblo Nuevo de Guadiaro", tipo: "barrio" },
  { nombre: "Puente Mayorga", tipo: "barrio" },
  { nombre: "San Enrique de Guadiaro", tipo: "barrio" },
  { nombre: "San Roque (casco urbano)", tipo: "barrio" },
  { nombre: "Santa Ana", tipo: "barrio" },
  { nombre: "Simón Susarte", tipo: "barrio" },
  { nombre: "Sotogrande", tipo: "barrio" },
  { nombre: "Taraguilla", tipo: "barrio" },
  { nombre: "Torreguadiaro", tipo: "barrio" },
];

const POLIGONOS_SAN_ROQUE: ZonaCiudad[] = [
  { nombre: "Campamento (Incosur)", tipo: "poligono" },
  { nombre: "Polígono · Guadarranque", tipo: "poligono" },
  { nombre: "SEPES (Taraguilla)", tipo: "poligono" },
  {
    nombre:
      "Zona de Actividades Logísticas (ZAL) del Campo de Gibraltar – Sector San Roque",
    tipo: "poligono",
  },
];

const BARRIOS_SANLUCAR: ZonaCiudad[] = [
  { nombre: "Algaida", tipo: "barrio" },
  { nombre: "Almendral", tipo: "barrio" },
  { nombre: "Alto de las Cuevas", tipo: "barrio" },
  { nombre: "Atalaya", tipo: "barrio" },
  { nombre: "Bajo de Guía", tipo: "barrio" },
  { nombre: "Banda Playa", tipo: "barrio" },
  { nombre: "Barrio Alto", tipo: "barrio" },
  { nombre: "Barrio Bajo", tipo: "barrio" },
  { nombre: "Barriada Andalucía", tipo: "barrio" },
  { nombre: "Barriada Arboledilla", tipo: "barrio" },
  { nombre: "Barriada de los Ángeles", tipo: "barrio" },
  { nombre: "Barriada de los Marineros (Virgen del Mar)", tipo: "barrio" },
  { nombre: "Barriada Rubiños", tipo: "barrio" },
  { nombre: "Bonanza", tipo: "barrio" },
  { nombre: "Capuchinos", tipo: "barrio" },
  { nombre: "Dehesilla", tipo: "barrio" },
  { nombre: "El Palomar", tipo: "barrio" },
  { nombre: "El Palmar", tipo: "barrio" },
  { nombre: "El Pino", tipo: "barrio" },
  { nombre: "El Vergel", tipo: "barrio" },
  { nombre: "Espíritu Santo", tipo: "barrio" },
  { nombre: "La Jara", tipo: "barrio" },
  { nombre: "La Colonia", tipo: "barrio" },
  { nombre: "La Gallarda", tipo: "barrio" },
  { nombre: "Las Piletas", tipo: "barrio" },
  { nombre: "Las Palmeras", tipo: "barrio" },
  { nombre: "Los Colonos", tipo: "barrio" },
  { nombre: "Los Naranjos", tipo: "barrio" },
  { nombre: "Marbella", tipo: "barrio" },
  { nombre: "Miraflores", tipo: "barrio" },
  { nombre: "Monteolivete", tipo: "barrio" },
  { nombre: "Pastrana", tipo: "barrio" },
  { nombre: "Picacho", tipo: "barrio" },
  { nombre: "Sanlúcar Club de Campo", tipo: "barrio" },
  { nombre: "Verdigones", tipo: "barrio" },
  { nombre: "Villa Horacia", tipo: "barrio" },
];

const POLIGONOS_SANLUCAR: ZonaCiudad[] = [
  { nombre: "Polígono · La Gallarda", tipo: "poligono" },
  { nombre: "Polígono · Las Palmeras", tipo: "poligono" },
  {
    nombre: "Parque Empresarial Las Dunas (antiguo Rematacaudales)",
    tipo: "poligono",
  },
];

const BARRIOS_AGUIMES: ZonaCiudad[] = [
  { nombre: "Agüimes (casco)", tipo: "barrio" },
  { nombre: "Corralillos (Los)", tipo: "barrio" },
  { nombre: "Cruce de Arinaga", tipo: "barrio" },
  { nombre: "Edén (El)", tipo: "barrio" },
  { nombre: "Espinales (Los)", tipo: "barrio" },
  { nombre: "Goleta (La)", tipo: "barrio" },
  { nombre: "Banda (La)", tipo: "barrio" },
  { nombre: "Las Rosas", tipo: "barrio" },
  { nombre: "Llano Blanco", tipo: "barrio" },
  { nombre: "Montaña de Los Vélez", tipo: "barrio" },
  { nombre: "Montaña San Francisco", tipo: "barrio" },
  { nombre: "Oasis (El)", tipo: "barrio" },
  { nombre: "Playa de Arinaga", tipo: "barrio" },
  { nombre: "Polígono Residencial de Arinaga", tipo: "barrio" },
  { nombre: "Temisas", tipo: "barrio" },
  { nombre: "Vargas", tipo: "barrio" },
];

const POLIGONOS_AGUIMES: ZonaCiudad[] = [
  { nombre: "Polígono Industrial de Arinaga", tipo: "poligono" },
  { nombre: "Espinales Industrial", tipo: "poligono" },
];

const BARRIOS_ARUCAS: ZonaCiudad[] = [
  { nombre: "Arucas (casco)", tipo: "barrio" },
  { nombre: "Bañaderos", tipo: "barrio" },
  { nombre: "Barreto", tipo: "barrio" },
  { nombre: "Cardones", tipo: "barrio" },
  { nombre: "Cardonal", tipo: "barrio" },
  { nombre: "Cruz de Pineda", tipo: "barrio" },
  { nombre: "El Arco", tipo: "barrio" },
  { nombre: "El Cerrillo", tipo: "barrio" },
  { nombre: "El Puertillo", tipo: "barrio" },
  { nombre: "Fuente del Laurel", tipo: "barrio" },
  { nombre: "Hoya de San Juan", tipo: "barrio" },
  { nombre: "Hoya de Aríñez", tipo: "barrio" },
  { nombre: "Juan XXIII", tipo: "barrio" },
  { nombre: "La Goleta", tipo: "barrio" },
  { nombre: "La Montañeta", tipo: "barrio" },
  { nombre: "La Palmita", tipo: "barrio" },
  { nombre: "La Solana", tipo: "barrio" },
  { nombre: "Las Chorreras", tipo: "barrio" },
  { nombre: "Los Castillos", tipo: "barrio" },
  { nombre: "Los Portales", tipo: "barrio" },
  { nombre: "Los Peñones", tipo: "barrio" },
  { nombre: "Llano Blanco", tipo: "barrio" },
  { nombre: "Lomo de Arucas", tipo: "barrio" },
  { nombre: "Lomo de Quintanilla", tipo: "barrio" },
  { nombre: "Lomo Espino", tipo: "barrio" },
  { nombre: "Mirador de Los Portales", tipo: "barrio" },
  { nombre: "Montaña Blanca", tipo: "barrio" },
  { nombre: "San Andrés", tipo: "barrio" },
  { nombre: "San Francisco Javier", tipo: "barrio" },
  { nombre: "San Gregorio", tipo: "barrio" },
  { nombre: "Santidad Alta", tipo: "barrio" },
  { nombre: "Santidad Baja", tipo: "barrio" },
  { nombre: "Santa Flora", tipo: "barrio" },
  { nombre: "Tinocas", tipo: "barrio" },
  { nombre: "Trapiche", tipo: "barrio" },
  { nombre: "Trasmontaña", tipo: "barrio" },
  { nombre: "Visvique", tipo: "barrio" },
  { nombre: "Virgen del Pino", tipo: "barrio" },
  { nombre: "El Portichuelo", tipo: "barrio" },
  { nombre: "Hoya López", tipo: "barrio" },
  { nombre: "Rosa Silva", tipo: "barrio" },
];

const POLIGONOS_ARUCAS: ZonaCiudad[] = [];

const BARRIOS_INGENIO: ZonaCiudad[] = [
  { nombre: "Aguatona", tipo: "barrio" },
  { nombre: "Barrio Nuevo", tipo: "barrio" },
  { nombre: "Barranco de Guayadeque", tipo: "barrio" },
  { nombre: "Cuesta Caballero", tipo: "barrio" },
  { nombre: "El Burrero", tipo: "barrio" },
  { nombre: "El Carrión", tipo: "barrio" },
  { nombre: "El Carrizal", tipo: "barrio" },
  { nombre: "El Cristo", tipo: "barrio" },
  { nombre: "El Cuarto", tipo: "barrio" },
  { nombre: "El Lirón", tipo: "barrio" },
  { nombre: "El Sequero", tipo: "barrio" },
  { nombre: "Ingenio (casco urbano)", tipo: "barrio" },
  { nombre: "La Capellanía", tipo: "barrio" },
  { nombre: "La Hoyeta", tipo: "barrio" },
  { nombre: "La Jurada", tipo: "barrio" },
  { nombre: "La Longuera", tipo: "barrio" },
  { nombre: "La Montañeta", tipo: "barrio" },
  { nombre: "La Pasadilla", tipo: "barrio" },
  { nombre: "La Tarifa", tipo: "barrio" },
  { nombre: "Las Majoreras", tipo: "barrio" },
  { nombre: "Las Mejías", tipo: "barrio" },
  { nombre: "Las Puntillas", tipo: "barrio" },
  { nombre: "Lomo Algodones", tipo: "barrio" },
  { nombre: "Lomo Cardón", tipo: "barrio" },
  { nombre: "Lomo del Hospital", tipo: "barrio" },
  { nombre: "Lomo Juan", tipo: "barrio" },
  { nombre: "Los Molinillos", tipo: "barrio" },
  { nombre: "Marfú", tipo: "barrio" },
  { nombre: "Mondragón", tipo: "barrio" },
  { nombre: "Pasadilla", tipo: "barrio" },
];

const POLIGONOS_INGENIO: ZonaCiudad[] = [
  { nombre: "Capellanía del Lozano", tipo: "poligono" },
  { nombre: "Las Majoreras – Lomo el Cardón", tipo: "poligono" },
  { nombre: "Lomo Cementerio", tipo: "poligono" },
];

const BARRIOS_LA_OLIVA: ZonaCiudad[] = [
  { nombre: "Corralejo", tipo: "barrio" },
  { nombre: "El Cotillo (Tostón)", tipo: "barrio" },
  { nombre: "El Roque", tipo: "barrio" },
  { nombre: "La Caldereta", tipo: "barrio" },
  { nombre: "La Capellanía", tipo: "barrio" },
  { nombre: "La Oliva (casco)", tipo: "barrio" },
  { nombre: "Lajares", tipo: "barrio" },
  { nombre: "Majanicho", tipo: "barrio" },
  { nombre: "Parque Holandés", tipo: "barrio" },
  { nombre: "Tindaya", tipo: "barrio" },
  { nombre: "Vallebrón", tipo: "barrio" },
  { nombre: "Villaverde", tipo: "barrio" },
];

const POLIGONOS_LA_OLIVA: ZonaCiudad[] = [
  { nombre: "Casilla Costa", tipo: "poligono" },
  { nombre: "SAU PSI-2 La Oliva", tipo: "poligono" },
];

const BARRIOS_LAS_PALMAS: ZonaCiudad[] = [
  { nombre: "Alcaravaneras", tipo: "barrio" },
  { nombre: "Almatriche", tipo: "barrio" },
  { nombre: "Altavista", tipo: "barrio" },
  { nombre: "Bandama", tipo: "barrio" },
  { nombre: "Barranco Seco", tipo: "barrio" },
  { nombre: "Barranquillo Don Zoilo", tipo: "barrio" },
  { nombre: "Barracones de Pedro Hidalgo", tipo: "barrio" },
  { nombre: "Buenavista", tipo: "barrio" },
  { nombre: "Canalejas", tipo: "barrio" },
  { nombre: "Carretera de Chile", tipo: "barrio" },
  { nombre: "Carretera de Mata", tipo: "barrio" },
  { nombre: "Casablanca I", tipo: "barrio" },
  { nombre: "Casablanca III", tipo: "barrio" },
  { nombre: "Casa Ayala", tipo: "barrio" },
  { nombre: "Cueva Torres", tipo: "barrio" },
  { nombre: "Cruz de Piedra", tipo: "barrio" },
  { nombre: "Cuesta Blanca", tipo: "barrio" },
  { nombre: "Cuesta Ramón", tipo: "barrio" },
  { nombre: "Dragonal Alto", tipo: "barrio" },
  { nombre: "Dragonal Bajo", tipo: "barrio" },
  { nombre: "El Batán", tipo: "barrio" },
  { nombre: "El Cardón", tipo: "barrio" },
  { nombre: "El Confital", tipo: "barrio" },
  { nombre: "El Fondillo", tipo: "barrio" },
  { nombre: "El Lasso", tipo: "barrio" },
  { nombre: "El Polvorín", tipo: "barrio" },
  { nombre: "El Roque", tipo: "barrio" },
  { nombre: "El Román", tipo: "barrio" },
  { nombre: "El Secadero", tipo: "barrio" },
  { nombre: "El Toscón", tipo: "barrio" },
  { nombre: "El Zardo", tipo: "barrio" },
  { nombre: "Escaleritas", tipo: "barrio" },
  { nombre: "Fase III del Polígono de Jinámar", tipo: "barrio" },
  { nombre: "Fincas Unidas", tipo: "barrio" },
  { nombre: "Guanarteme", tipo: "barrio" },
  { nombre: "Hoya Andrea", tipo: "barrio" },
  { nombre: "Hoya de la Plata", tipo: "barrio" },
  { nombre: "Hoya de Parrado", tipo: "barrio" },
  { nombre: "La Calzada", tipo: "barrio" },
  { nombre: "La Galera", tipo: "barrio" },
  { nombre: "La Isleta", tipo: "barrio" },
  { nombre: "La Matula", tipo: "barrio" },
  { nombre: "La Milagrosa", tipo: "barrio" },
  { nombre: "La Montañeta", tipo: "barrio" },
  { nombre: "La Paterna", tipo: "barrio" },
  { nombre: "La Suerte", tipo: "barrio" },
  { nombre: "Ladera Alta", tipo: "barrio" },
  { nombre: "Las Canteras", tipo: "barrio" },
  { nombre: "Las Coloradas", tipo: "barrio" },
  { nombre: "Las Filipinas", tipo: "barrio" },
  { nombre: "Las Majadillas", tipo: "barrio" },
  { nombre: "Las Mesas", tipo: "barrio" },
  { nombre: "Las Perreras", tipo: "barrio" },
  { nombre: "Las Ramblas", tipo: "barrio" },
  { nombre: "Las Rehoyas", tipo: "barrio" },
  { nombre: "Las Torres", tipo: "barrio" },
  { nombre: "Lomo Apolinario", tipo: "barrio" },
  { nombre: "Lomo Blanco", tipo: "barrio" },
  { nombre: "Lomo del Capón", tipo: "barrio" },
  { nombre: "Lomo del Sabinal", tipo: "barrio" },
  { nombre: "Lomo los Frailes", tipo: "barrio" },
  { nombre: "Los Giles", tipo: "barrio" },
  { nombre: "Los Hoyos", tipo: "barrio" },
  { nombre: "Los Lirios", tipo: "barrio" },
  { nombre: "Lugo", tipo: "barrio" },
  { nombre: "Marzagán", tipo: "barrio" },
  { nombre: "Mirador del Atlántico", tipo: "barrio" },
  { nombre: "Mirador del Valle", tipo: "barrio" },
  { nombre: "Miller Bajo", tipo: "barrio" },
  { nombre: "Monte Quemado", tipo: "barrio" },
  { nombre: "Nueva Isleta", tipo: "barrio" },
  { nombre: "Nueva Paterna", tipo: "barrio" },
  { nombre: "Parque Atlántico", tipo: "barrio" },
  { nombre: "Parque Central", tipo: "barrio" },
  { nombre: "Pedro Hidalgo", tipo: "barrio" },
  { nombre: "Pico Viento", tipo: "barrio" },
  { nombre: "Piletas", tipo: "barrio" },
  { nombre: "Polígono Residencial Cruz de Piedra", tipo: "barrio" },
  { nombre: "Salto del Negro", tipo: "barrio" },
  { nombre: "San Antonio", tipo: "barrio" },
  { nombre: "San Cristóbal", tipo: "barrio" },
  { nombre: "San Francisco", tipo: "barrio" },
  { nombre: "San Francisco de Paula", tipo: "barrio" },
  { nombre: "San José", tipo: "barrio" },
  { nombre: "San Juan", tipo: "barrio" },
  { nombre: "San Lorenzo", tipo: "barrio" },
  { nombre: "San Nicolás", tipo: "barrio" },
  { nombre: "San Roque", tipo: "barrio" },
  { nombre: "Santa Catalina", tipo: "barrio" },
  { nombre: "Schamann", tipo: "barrio" },
  { nombre: "Siete Puertas", tipo: "barrio" },
  { nombre: "Siete Palmas", tipo: "barrio" },
  { nombre: "Tafira Alta", tipo: "barrio" },
  { nombre: "Tafira Baja", tipo: "barrio" },
  { nombre: "Tamaraceite", tipo: "barrio" },
  { nombre: "Tarahales", tipo: "barrio" },
  { nombre: "Tenoya", tipo: "barrio" },
  { nombre: "Tres Palmas", tipo: "barrio" },
  { nombre: "Triana", tipo: "barrio" },
  { nombre: "Urbanización Cinco Continentes", tipo: "barrio" },
  { nombre: "Urbanización de 60 viviendas", tipo: "barrio" },
  { nombre: "Urbanización Sansofé", tipo: "barrio" },
  { nombre: "Vega de San José", tipo: "barrio" },
  { nombre: "Vegueta", tipo: "barrio" },
  { nombre: "Zárate", tipo: "barrio" },
  { nombre: "Zurbarán", tipo: "barrio" },
];

const POLIGONOS_LAS_PALMAS: ZonaCiudad[] = [
  { nombre: "Polígono · Barranco Seco", tipo: "poligono" },
  { nombre: "Díaz Casanova (Vista Hermosa)", tipo: "poligono" },
  { nombre: "El Sebadal", tipo: "poligono" },
  { nombre: "Polígono · Escaleritas", tipo: "poligono" },
  { nombre: "La Cazuela", tipo: "poligono" },
  { nombre: "Las Torres – Lomo Blanco", tipo: "poligono" },
  { nombre: "Los Tarahales", tipo: "poligono" },
  { nombre: "Polígono · Miller Bajo", tipo: "poligono" },
];

const BARRIOS_PUERTO_ROSARIO: ZonaCiudad[] = [
  { nombre: "Buenavista", tipo: "barrio" },
  { nombre: "Barrio Nuevo", tipo: "barrio" },
  { nombre: "Casillas del Ángel", tipo: "barrio" },
  { nombre: "Centro", tipo: "barrio" },
  { nombre: "El Charco", tipo: "barrio" },
  { nombre: "El Matorral", tipo: "barrio" },
  { nombre: "Fabelo", tipo: "barrio" },
  { nombre: "Guisguey", tipo: "barrio" },
  { nombre: "La Asomada", tipo: "barrio" },
  { nombre: "La Ampuyenta", tipo: "barrio" },
  { nombre: "La Matilla", tipo: "barrio" },
  { nombre: "Las Granadas", tipo: "barrio" },
  { nombre: "Los Estancos", tipo: "barrio" },
  { nombre: "Los Llanos de la Concepción", tipo: "barrio" },
  { nombre: "Los Llanos Pelados", tipo: "barrio" },
  { nombre: "Los Pozos", tipo: "barrio" },
  { nombre: "Majada Marcial", tipo: "barrio" },
  { nombre: "Puerto Lajas", tipo: "barrio" },
  { nombre: "Puerto del Rosario (casco urbano)", tipo: "barrio" },
  { nombre: "Rosa Vila", tipo: "barrio" },
  { nombre: "Tefía", tipo: "barrio" },
  { nombre: "Tesjuates", tipo: "barrio" },
  { nombre: "Tetir", tipo: "barrio" },
  { nombre: "Valle de Santa Inés", tipo: "barrio" },
  { nombre: "El Time", tipo: "barrio" },
  { nombre: "El Puertito de los Molinos", tipo: "barrio" },
  { nombre: "Colonia Rural García Escámez", tipo: "barrio" },
];

const POLIGONOS_PUERTO_ROSARIO: ZonaCiudad[] = [
  { nombre: "Polígono · El Matorral", tipo: "poligono" },
  { nombre: "La Hondura", tipo: "poligono" },
  { nombre: "Las Cristinas", tipo: "poligono" },
  { nombre: "Las Salinas", tipo: "poligono" },
  { nombre: "Parque Tecnológico de Fuerteventura", tipo: "poligono" },
  { nombre: "Risco Prieto", tipo: "poligono" },
];

const BARRIOS_TIRAJANA: ZonaCiudad[] = [
  { nombre: "Aldea Blanca", tipo: "barrio" },
  { nombre: "Ayagaures", tipo: "barrio" },
  { nombre: "Bahía Feliz", tipo: "barrio" },
  { nombre: "Calderín", tipo: "barrio" },
  { nombre: "Campo Internacional", tipo: "barrio" },
  { nombre: "Casas Blancas", tipo: "barrio" },
  { nombre: "Castillo del Romeral", tipo: "barrio" },
  { nombre: "Cercados de Araña", tipo: "barrio" },
  { nombre: "Cercados de Espino", tipo: "barrio" },
  { nombre: "Ciudad de Lima", tipo: "barrio" },
  { nombre: "El Matorral", tipo: "barrio" },
  { nombre: "El Pajar", tipo: "barrio" },
  { nombre: "El Salobre", tipo: "barrio" },
  { nombre: "El Sequero", tipo: "barrio" },
  { nombre: "El Tablero", tipo: "barrio" },
  { nombre: "Fataga", tipo: "barrio" },
  { nombre: "Hoya de Tunte", tipo: "barrio" },
  { nombre: "Hoya Grande", tipo: "barrio" },
  { nombre: "Juan Grande", tipo: "barrio" },
  { nombre: "La Culata", tipo: "barrio" },
  { nombre: "La Montaña", tipo: "barrio" },
  { nombre: "La Plata", tipo: "barrio" },
  { nombre: "Las Casas", tipo: "barrio" },
  { nombre: "Las Salinas", tipo: "barrio" },
  { nombre: "Meloneras", tipo: "barrio" },
  { nombre: "Montaña La Data", tipo: "barrio" },
  { nombre: "Monteleón", tipo: "barrio" },
  { nombre: "Pasito Blanco", tipo: "barrio" },
  { nombre: "Playa del Águila", tipo: "barrio" },
  { nombre: "Playa del Inglés", tipo: "barrio" },
  { nombre: "San Agustín", tipo: "barrio" },
  { nombre: "San Bartolomé (Tunte)", tipo: "barrio" },
  { nombre: "San Fernando de Maspalomas", tipo: "barrio" },
  { nombre: "Sonneland", tipo: "barrio" },
  { nombre: "Tunte", tipo: "barrio" },
];

const POLIGONOS_TIRAJANA: ZonaCiudad[] = [
  { nombre: "Juan Grande Industrial", tipo: "poligono" },
  { nombre: "Polígono Industrial El Tablero", tipo: "poligono" },
];

const BARRIOS_SANTA_LUCIA: ZonaCiudad[] = [
  { nombre: "Balos", tipo: "barrio" },
  { nombre: "Casa Pastores", tipo: "barrio" },
  { nombre: "El Canario", tipo: "barrio" },
  { nombre: "El Doctoral", tipo: "barrio" },
  { nombre: "El Ingenio", tipo: "barrio" },
  { nombre: "El Morisco", tipo: "barrio" },
  { nombre: "El Mundillo", tipo: "barrio" },
  { nombre: "El Parralillo", tipo: "barrio" },
  { nombre: "El Rincón", tipo: "barrio" },
  { nombre: "El Valle", tipo: "barrio" },
  { nombre: "Ingenio de Arriba", tipo: "barrio" },
  { nombre: "La Blanca", tipo: "barrio" },
  { nombre: "La Carraca", tipo: "barrio" },
  { nombre: "La Orilla Baja", tipo: "barrio" },
  { nombre: "La Sorrueda", tipo: "barrio" },
  { nombre: "Las Huertecillas", tipo: "barrio" },
  { nombre: "Las Lagunas", tipo: "barrio" },
  { nombre: "Los Llanos", tipo: "barrio" },
  { nombre: "Los Marteles", tipo: "barrio" },
  { nombre: "Maronda", tipo: "barrio" },
  { nombre: "Parral Grande", tipo: "barrio" },
  { nombre: "Pozo Izquierdo", tipo: "barrio" },
  { nombre: "Rosiana", tipo: "barrio" },
  { nombre: "Rosiana Alta", tipo: "barrio" },
  { nombre: "Rosiana Baja", tipo: "barrio" },
  { nombre: "Sardina del Sur", tipo: "barrio" },
  { nombre: "Santa Lucía (casco)", tipo: "barrio" },
  { nombre: "Vecindario", tipo: "barrio" },
];

const POLIGONOS_SANTA_LUCIA: ZonaCiudad[] = [
  { nombre: "El Doctoral Industrial", tipo: "poligono" },
  { nombre: "La Blanca – Zona Industrial Agrícola", tipo: "poligono" },
  { nombre: "Santa Lucía 1 Industrial", tipo: "poligono" },
];

const BARRIOS_TELDE: ZonaCiudad[] = [
  { nombre: "Cañada de los Perros", tipo: "barrio" },
  { nombre: "Callejón del Castillo", tipo: "barrio" },
  { nombre: "Casas Nuevas", tipo: "barrio" },
  { nombre: "Caserones Alto", tipo: "barrio" },
  { nombre: "Caserones Bajo", tipo: "barrio" },
  { nombre: "Cazadores", tipo: "barrio" },
  { nombre: "Cendro", tipo: "barrio" },
  { nombre: "Clavellinas", tipo: "barrio" },
  { nombre: "Cuatro Puertas", tipo: "barrio" },
  { nombre: "El Calero Alto", tipo: "barrio" },
  { nombre: "El Calero Bajo", tipo: "barrio" },
  { nombre: "El Caracol", tipo: "barrio" },
  { nombre: "El Contrapeso", tipo: "barrio" },
  { nombre: "El Ejido", tipo: "barrio" },
  { nombre: "El Goro", tipo: "barrio" },
  { nombre: "Gando", tipo: "barrio" },
  { nombre: "Hoya Aguedita", tipo: "barrio" },
  { nombre: "Hoya Pozuelo", tipo: "barrio" },
  { nombre: "Hornos del Rey", tipo: "barrio" },
  { nombre: "Jinámar", tipo: "barrio" },
  { nombre: "La Breña", tipo: "barrio" },
  { nombre: "La Colomba", tipo: "barrio" },
  { nombre: "La Estrella", tipo: "barrio" },
  { nombre: "La Garita", tipo: "barrio" },
  { nombre: "La Gavia", tipo: "barrio" },
  { nombre: "La Higuera Canaria", tipo: "barrio" },
  { nombre: "La Majadilla", tipo: "barrio" },
  { nombre: "La Matanza", tipo: "barrio" },
  { nombre: "La Pardilla", tipo: "barrio" },
  { nombre: "La Primavera", tipo: "barrio" },
  { nombre: "La Solana", tipo: "barrio" },
  { nombre: "La Viña", tipo: "barrio" },
  { nombre: "Las Bachilleras", tipo: "barrio" },
  { nombre: "Las Goteras", tipo: "barrio" },
  { nombre: "Las Haciendas", tipo: "barrio" },
  { nombre: "Las Huesas", tipo: "barrio" },
  { nombre: "Las Medianías", tipo: "barrio" },
  { nombre: "Las Remudas", tipo: "barrio" },
  { nombre: "Lomo Blanco", tipo: "barrio" },
  { nombre: "Lomo Bristol", tipo: "barrio" },
  { nombre: "Lomo Catela", tipo: "barrio" },
  { nombre: "Lomo Cementerio", tipo: "barrio" },
  { nombre: "Lomo de la Herradura", tipo: "barrio" },
  { nombre: "Lomo los Frailes", tipo: "barrio" },
  { nombre: "Lomo Magullo", tipo: "barrio" },
  { nombre: "Lomo Salas", tipo: "barrio" },
  { nombre: "Los Arenales", tipo: "barrio" },
  { nombre: "Los Melones", tipo: "barrio" },
  { nombre: "Marpequeña", tipo: "barrio" },
  { nombre: "Melenara", tipo: "barrio" },
  { nombre: "Montaña las Huesas", tipo: "barrio" },
  { nombre: "Montaña las Palmas", tipo: "barrio" },
  { nombre: "Montañeta del Calero", tipo: "barrio" },
  { nombre: "Ojos de Garza", tipo: "barrio" },
  { nombre: "Piletillas", tipo: "barrio" },
  { nombre: "Playa de Ojos de Garza", tipo: "barrio" },
  { nombre: "Playa del Hombre", tipo: "barrio" },
  { nombre: "San Antonio", tipo: "barrio" },
  { nombre: "San Borondón", tipo: "barrio" },
  { nombre: "San Francisco", tipo: "barrio" },
  { nombre: "San Gregorio", tipo: "barrio" },
  { nombre: "San Isidro", tipo: "barrio" },
  { nombre: "San José de las Longueras", tipo: "barrio" },
  { nombre: "San Juan", tipo: "barrio" },
  { nombre: "Salinetas", tipo: "barrio" },
  { nombre: "Taliarte", tipo: "barrio" },
  { nombre: "Tara", tipo: "barrio" },
  { nombre: "Tecén", tipo: "barrio" },
  { nombre: "Tufia", tipo: "barrio" },
  { nombre: "Urb. de Jerez", tipo: "barrio" },
  { nombre: "Valle Casares", tipo: "barrio" },
  { nombre: "Valle de Jinámar", tipo: "barrio" },
  { nombre: "Valle de los Nueve", tipo: "barrio" },
  { nombre: "Valle de los Nueve Alto", tipo: "barrio" },
];

const POLIGONOS_TELDE: ZonaCiudad[] = [
  { nombre: "Aguadulce", tipo: "poligono" },
  { nombre: "Bocabarranco", tipo: "poligono" },
  { nombre: "Cruz de la Gallina", tipo: "poligono" },
  { nombre: "Polígono · El Goro", tipo: "poligono" },
  { nombre: "El Goro II", tipo: "poligono" },
  { nombre: "El Goro III", tipo: "poligono" },
  { nombre: "Polígono · Jinámar", tipo: "poligono" },
  { nombre: "La Francia", tipo: "poligono" },
  { nombre: "La Jardinera", tipo: "poligono" },
  { nombre: "Maipez", tipo: "poligono" },
  { nombre: "Parque Empresarial Melenara", tipo: "poligono" },
  { nombre: "Plaza de Toros", tipo: "poligono" },
  { nombre: "Las Salinetas", tipo: "poligono" },
  { nombre: "Silva", tipo: "poligono" },
];

const BARRIOS_SANTA_CRUZ_TENERIFE: ZonaCiudad[] = [
  { nombre: "Acorán", tipo: "barrio" },
  { nombre: "Afur", tipo: "barrio" },
  { nombre: "Alisios", tipo: "barrio" },
  { nombre: "Almáciga", tipo: "barrio" },
  { nombre: "Añaza", tipo: "barrio" },
  { nombre: "Barrio Nuevo", tipo: "barrio" },
  { nombre: "Barranco Grande", tipo: "barrio" },
  { nombre: "Benijo", tipo: "barrio" },
  { nombre: "Buenavista", tipo: "barrio" },
  { nombre: "Buenos Aires", tipo: "barrio" },
  { nombre: "Camino del Hierro", tipo: "barrio" },
  { nombre: "Casas de la Cumbre", tipo: "barrio" },
  { nombre: "Catalanes", tipo: "barrio" },
  { nombre: "César Casariego", tipo: "barrio" },
  { nombre: "Chamberí", tipo: "barrio" },
  { nombre: "Chamorga", tipo: "barrio" },
  { nombre: "Chapatal", tipo: "barrio" },
  { nombre: "Chimisay", tipo: "barrio" },
  { nombre: "Cruz del Señor", tipo: "barrio" },
  { nombre: "Cuatro Torres", tipo: "barrio" },
  { nombre: "Cuesta de Piedra", tipo: "barrio" },
  { nombre: "Cueva Bermeja", tipo: "barrio" },
  { nombre: "El Bailadero", tipo: "barrio" },
  { nombre: "El Cabo", tipo: "barrio" },
  { nombre: "El Chorrillo", tipo: "barrio" },
  { nombre: "El Draguillo", tipo: "barrio" },
  { nombre: "El Perú", tipo: "barrio" },
  { nombre: "El Rosarito", tipo: "barrio" },
  { nombre: "El Suculum", tipo: "barrio" },
  { nombre: "El Sobradillo", tipo: "barrio" },
  { nombre: "El Tablero", tipo: "barrio" },
  { nombre: "Finca La Multa", tipo: "barrio" },
  { nombre: "García Escámez", tipo: "barrio" },
  { nombre: "Ifara", tipo: "barrio" },
  { nombre: "Igueste de San Andrés", tipo: "barrio" },
  { nombre: "Juan XXIII", tipo: "barrio" },
  { nombre: "La Alegría", tipo: "barrio" },
  { nombre: "La Gallega", tipo: "barrio" },
  { nombre: "La Salle", tipo: "barrio" },
  { nombre: "La Salud", tipo: "barrio" },
  { nombre: "La Victoria", tipo: "barrio" },
  { nombre: "Las Acacias", tipo: "barrio" },
  { nombre: "Las Cabritas", tipo: "barrio" },
  { nombre: "Las Delicias", tipo: "barrio" },
  { nombre: "Las Mimosas", tipo: "barrio" },
  { nombre: "Las Retamas", tipo: "barrio" },
  { nombre: "Llano del Moro", tipo: "barrio" },
  { nombre: "Lomo de las Bodegas-La Cumbrilla", tipo: "barrio" },
  { nombre: "Los Campitos", tipo: "barrio" },
  { nombre: "Los Gladiolos", tipo: "barrio" },
  { nombre: "Los Hoteles", tipo: "barrio" },
  { nombre: "Los Lavaderos", tipo: "barrio" },
  { nombre: "Los Llanos", tipo: "barrio" },
  { nombre: "María Jiménez", tipo: "barrio" },
  { nombre: "Mayorazgo", tipo: "barrio" },
  { nombre: "Miramar", tipo: "barrio" },
  { nombre: "Moraditas", tipo: "barrio" },
  { nombre: "Nuevo Obrero", tipo: "barrio" },
  { nombre: "Roque Negro", tipo: "barrio" },
  { nombre: "Salamanca", tipo: "barrio" },
  { nombre: "San Andrés", tipo: "barrio" },
  { nombre: "San Antonio", tipo: "barrio" },
  { nombre: "San Pío X", tipo: "barrio" },
  { nombre: "San Sebastián", tipo: "barrio" },
  { nombre: "Santa Clara", tipo: "barrio" },
  { nombre: "Santa María del Mar", tipo: "barrio" },
  { nombre: "Somosierra", tipo: "barrio" },
  { nombre: "Taborno", tipo: "barrio" },
  { nombre: "Taganana", tipo: "barrio" },
  { nombre: "Tíncer", tipo: "barrio" },
  { nombre: "Tío Pino", tipo: "barrio" },
  { nombre: "Toscal", tipo: "barrio" },
  { nombre: "Tristán", tipo: "barrio" },
  { nombre: "Urbanización Anaga", tipo: "barrio" },
  { nombre: "Uruguay", tipo: "barrio" },
  { nombre: "Valle Tahodio", tipo: "barrio" },
  { nombre: "Valleseco", tipo: "barrio" },
  { nombre: "Villa Ascensión", tipo: "barrio" },
  { nombre: "Villa Benítez", tipo: "barrio" },
  { nombre: "Vistabella", tipo: "barrio" },
  { nombre: "Zona Centro", tipo: "barrio" },
  { nombre: "Zona Rambla", tipo: "barrio" },
];

const POLIGONOS_SANTA_CRUZ_TENERIFE: ZonaCiudad[] = [
  { nombre: "Chamberí (zona industrial)", tipo: "poligono" },
  { nombre: "Costa Sur (polígono industrial)", tipo: "poligono" },
  { nombre: "Cueva Bermeja (zona industrial)", tipo: "poligono" },
  { nombre: "Dársena Norte-Puerto (zona industrial portuaria)", tipo: "poligono" },
  { nombre: "El Mayorazgo (polígono industrial)", tipo: "poligono" },
  { nombre: "El Molino (zona industrial)", tipo: "poligono" },
  { nombre: "El Pilar (zona industrial)", tipo: "poligono" },
  { nombre: "Jagua (zona industrial)", tipo: "poligono" },
  { nombre: "La Cervera (zona industrial)", tipo: "poligono" },
  { nombre: "Las Moraditas (zona industrial)", tipo: "poligono" },
  { nombre: "Mercatenerife (zona industrial)", tipo: "poligono" },
  { nombre: "Montaña de Taco (zona industrial)", tipo: "poligono" },
];

const BARRIOS_ADEJE: ZonaCiudad[] = [
  { nombre: "Adeje Casco", tipo: "barrio" },
  { nombre: "Armeñime", tipo: "barrio" },
  { nombre: "Callao Salvaje", tipo: "barrio" },
  { nombre: "Costa Adeje", tipo: "barrio" },
  { nombre: "El Beril", tipo: "barrio" },
  { nombre: "El Galeón", tipo: "barrio" },
  { nombre: "El Puertito", tipo: "barrio" },
  { nombre: "Fañabé", tipo: "barrio" },
  { nombre: "La Caldera", tipo: "barrio" },
  { nombre: "La Caleta", tipo: "barrio" },
  { nombre: "La Concepción", tipo: "barrio" },
  { nombre: "La Postura", tipo: "barrio" },
  { nombre: "La Quinta", tipo: "barrio" },
  { nombre: "Las Cancelas", tipo: "barrio" },
  { nombre: "Las Moraditas", tipo: "barrio" },
  { nombre: "Las Nieves", tipo: "barrio" },
  { nombre: "Las Rosas", tipo: "barrio" },
  { nombre: "Las Torres", tipo: "barrio" },
  { nombre: "Los Menores", tipo: "barrio" },
  { nombre: "Los Olivos", tipo: "barrio" },
  { nombre: "Marazul", tipo: "barrio" },
  { nombre: "Miraverde", tipo: "barrio" },
  { nombre: "Playa Paraíso", tipo: "barrio" },
  { nombre: "San Eugenio", tipo: "barrio" },
  { nombre: "Taucho", tipo: "barrio" },
  { nombre: "Tijoco Alto", tipo: "barrio" },
  { nombre: "Tijoco Bajo", tipo: "barrio" },
  { nombre: "Torviscas", tipo: "barrio" },
  { nombre: "Sueño Azul", tipo: "barrio" },
];

const POLIGONOS_ADEJE: ZonaCiudad[] = [
  { nombre: "La Atalaya – Barranco de las Torres", tipo: "poligono" },
  { nombre: "Polígono · Los Olivos", tipo: "poligono" },
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
    id: "camargo",
    nombre: "Camargo",
    etiqueta: "Camargo (Cantabria)",
    zonas: [...BARRIOS_CAMARGO, ...POLIGONOS_CAMARGO],
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
    id: "aestrada",
    nombre: "A Estrada",
    etiqueta: "A Estrada (Pontevedra)",
    zonas: [...BARRIOS_A_ESTRADA, ...POLIGONOS_A_ESTRADA],
  },
  {
    id: "cangas",
    nombre: "Cangas",
    etiqueta: "Cangas (Pontevedra)",
    zonas: [...BARRIOS_CANGAS, ...POLIGONOS_CANGAS],
  },
  {
    id: "lalin",
    nombre: "Lalín",
    etiqueta: "Lalín (Pontevedra)",
    zonas: [...BARRIOS_LALIN, ...POLIGONOS_LALIN],
  },
  {
    id: "marin",
    nombre: "Marín",
    etiqueta: "Marín (Pontevedra)",
    zonas: [...BARRIOS_MARIN, ...POLIGONOS_MARIN],
  },
  {
    id: "redondela",
    nombre: "Redondela",
    etiqueta: "Redondela (Pontevedra)",
    zonas: [...BARRIOS_REDONDELA, ...POLIGONOS_REDONDELA],
  },
  {
    id: "vigo",
    nombre: "Vigo",
    etiqueta: "Vigo (Pontevedra)",
    zonas: [...BARRIOS_VIGO, ...POLIGONOS_VIGO],
  },
  {
    id: "vilagarcia",
    nombre: "Vilagarcía de Arousa",
    etiqueta: "Vilagarcía de Arousa (Pontevedra)",
    zonas: [...BARRIOS_VILAGARCIA, ...POLIGONOS_VILAGARCIA],
  },
  {
    id: "coruna",
    nombre: "A Coruña",
    etiqueta: "A Coruña (A Coruña)",
    zonas: [...BARRIOS_CORUNA, ...POLIGONOS_CORUNA],
  },
  {
    id: "santiago",
    nombre: "Santiago de Compostela",
    etiqueta: "Santiago de Compostela (A Coruña)",
    zonas: [...BARRIOS_SANTIAGO, ...POLIGONOS_SANTIAGO],
  },
  {
    id: "ferrol",
    nombre: "Ferrol",
    etiqueta: "Ferrol (A Coruña)",
    zonas: [...BARRIOS_FERROL, ...POLIGONOS_FERROL],
  },
  {
    id: "naron",
    nombre: "Narón",
    etiqueta: "Narón (A Coruña)",
    zonas: [...BARRIOS_NARON, ...POLIGONOS_NARON],
  },
  {
    id: "oleiros",
    nombre: "Oleiros",
    etiqueta: "Oleiros (A Coruña)",
    zonas: [...BARRIOS_OLEIROS, ...POLIGONOS_OLEIROS],
  },
  {
    id: "bilbao",
    nombre: "Bilbao",
    etiqueta: "Bilbao (Bizkaia)",
    zonas: [...BARRIOS_BILBAO, ...POLIGONOS_BILBAO],
  },
  {
    id: "barakaldo",
    nombre: "Barakaldo",
    etiqueta: "Barakaldo (Bizkaia)",
    zonas: [...BARRIOS_BARAKALDO, ...POLIGONOS_BARAKALDO],
  },
  {
    id: "getxo",
    nombre: "Getxo",
    etiqueta: "Getxo (Bizkaia)",
    zonas: [...BARRIOS_GETXO, ...POLIGONOS_GETXO],
  },
  {
    id: "portugalete",
    nombre: "Portugalete",
    etiqueta: "Portugalete (Bizkaia)",
    zonas: [...BARRIOS_PORTUGALETE, ...POLIGONOS_PORTUGALETE],
  },
  {
    id: "santurtzi",
    nombre: "Santurtzi",
    etiqueta: "Santurtzi (Bizkaia)",
    zonas: [...BARRIOS_SANTURTZI, ...POLIGONOS_SANTURTZI],
  },
  {
    id: "basauri",
    nombre: "Basauri",
    etiqueta: "Basauri (Bizkaia)",
    zonas: [...BARRIOS_BASAURI, ...POLIGONOS_BASAURI],
  },
  {
    id: "durango",
    nombre: "Durango",
    etiqueta: "Durango (Bizkaia)",
    zonas: [...BARRIOS_DURANGO, ...POLIGONOS_DURANGO],
  },
  {
    id: "erandio",
    nombre: "Erandio",
    etiqueta: "Erandio (Bizkaia)",
    zonas: [...BARRIOS_ERANDIO, ...POLIGONOS_ERANDIO],
  },
  {
    id: "galdakao",
    nombre: "Galdakao",
    etiqueta: "Galdakao (Bizkaia)",
    zonas: [...BARRIOS_GALDAKAO, ...POLIGONOS_GALDAKAO],
  },
  {
    id: "leioa",
    nombre: "Leioa",
    etiqueta: "Leioa (Bizkaia)",
    zonas: [...BARRIOS_LEIOA, ...POLIGONOS_LEIOA],
  },
  {
    id: "sansebastian",
    nombre: "San Sebastián",
    etiqueta: "San Sebastián (Gipuzkoa)",
    zonas: [...BARRIOS_SAN_SEBASTIAN, ...POLIGONOS_SAN_SEBASTIAN],
  },
  {
    id: "irun",
    nombre: "Irun",
    etiqueta: "Irun (Gipuzkoa)",
    zonas: [...BARRIOS_IRUN, ...POLIGONOS_IRUN],
  },
  {
    id: "errenteria",
    nombre: "Errenteria (Rentería)",
    etiqueta: "Errenteria (Gipuzkoa)",
    zonas: [...BARRIOS_ERRENTERIA, ...POLIGONOS_ERRENTERIA],
  },
  {
    id: "barcelona",
    nombre: "Barcelona",
    etiqueta: "Barcelona (Barcelona)",
    zonas: [...BARRIOS_BARCELONA, ...POLIGONOS_BARCELONA],
  },
  {
    id: "hospitalet",
    nombre: "L'Hospitalet de Llobregat",
    etiqueta: "Hospitalet de Llobregat (Barcelona)",
    zonas: [...BARRIOS_HOSPITALET, ...POLIGONOS_HOSPITALET],
  },
  {
    id: "badalona",
    nombre: "Badalona",
    etiqueta: "Badalona (Barcelona)",
    zonas: [...BARRIOS_BADALONA, ...POLIGONOS_BADALONA],
  },
  {
    id: "santacoloma",
    nombre: "Santa Coloma de Gramenet",
    etiqueta: "Santa Coloma de Gramenet (Barcelona)",
    zonas: [...BARRIOS_SANTA_COLOMA, ...POLIGONOS_SANTA_COLOMA],
  },
  {
    id: "cornella",
    nombre: "Cornellà de Llobregat",
    etiqueta: "Cornellà de Llobregat (Barcelona)",
    zonas: [...BARRIOS_CORNELLA, ...POLIGONOS_CORNELLA],
  },
  {
    id: "santboi",
    nombre: "Sant Boi de Llobregat",
    etiqueta: "Sant Boi de Llobregat (Barcelona)",
    zonas: [...BARRIOS_SANT_BOI, ...POLIGONOS_SANT_BOI],
  },
  {
    id: "viladecans",
    nombre: "Viladecans",
    etiqueta: "Viladecans (Barcelona)",
    zonas: [...BARRIOS_VILADECANS, ...POLIGONOS_VILADECANS],
  },
  {
    id: "elprat",
    nombre: "El Prat de Llobregat",
    etiqueta: "Prat de Llobregat, El (Barcelona)",
    zonas: [...BARRIOS_EL_PRAT, ...POLIGONOS_EL_PRAT],
  },
  {
    id: "esplugues",
    nombre: "Esplugues de Llobregat",
    etiqueta: "Esplugues de Llobregat (Barcelona)",
    zonas: [...BARRIOS_ESPLUGUES, ...POLIGONOS_ESPLUGUES],
  },
  {
    id: "gava",
    nombre: "Gavà",
    etiqueta: "Gavà (Barcelona)",
    zonas: [...BARRIOS_GAVA, ...POLIGONOS_GAVA],
  },
  {
    id: "montcada",
    nombre: "Montcada i Reixac",
    etiqueta: "Montcada i Reixac (Barcelona)",
    zonas: [...BARRIOS_MONTCADA, ...POLIGONOS_MONTCADA],
  },
  {
    id: "terrassa",
    nombre: "Terrassa",
    etiqueta: "Terrassa (Barcelona)",
    zonas: [...BARRIOS_TERRASSA, ...POLIGONOS_TERRASSA],
  },
  {
    id: "sabadell",
    nombre: "Sabadell",
    etiqueta: "Sabadell (Barcelona)",
    zonas: [...BARRIOS_SABADELL, ...POLIGONOS_SABADELL],
  },
  {
    id: "mataro",
    nombre: "Mataró",
    etiqueta: "Mataró (Barcelona)",
    zonas: [...BARRIOS_MATARO, ...POLIGONOS_MATARO],
  },
  {
    id: "santcugat",
    nombre: "Sant Cugat del Vallès",
    etiqueta: "Sant Cugat del Vallès (Barcelona)",
    zonas: [...BARRIOS_SANT_CUGAT, ...POLIGONOS_SANT_CUGAT],
  },
  {
    id: "rubi",
    nombre: "Rubí",
    etiqueta: "Rubí (Barcelona)",
    zonas: [...BARRIOS_RUBI, ...POLIGONOS_RUBI],
  },
  {
    id: "vilanova",
    nombre: "Vilanova i la Geltrú",
    etiqueta: "Vilanova i la Geltrú (Barcelona)",
    zonas: [...BARRIOS_VILANOVA, ...POLIGONOS_VILANOVA],
  },
  {
    id: "castelldefels",
    nombre: "Castelldefels",
    etiqueta: "Castelldefels (Barcelona)",
    zonas: [...BARRIOS_CASTELLDEFELS, ...POLIGONOS_CASTELLDEFELS],
  },
  {
    id: "granollers",
    nombre: "Granollers",
    etiqueta: "Granollers (Barcelona)",
    zonas: [...BARRIOS_GRANOLLERS, ...POLIGONOS_GRANOLLERS],
  },
  {
    id: "cerdanyola",
    nombre: "Cerdanyola del Vallès",
    etiqueta: "Cerdanyola del Vallès (Barcelona)",
    zonas: [...BARRIOS_CERDANYOLA, ...POLIGONOS_CERDANYOLA],
  },
  {
    id: "mollet",
    nombre: "Mollet del Vallès",
    etiqueta: "Mollet del Vallès (Barcelona)",
    zonas: [...BARRIOS_MOLLET, ...POLIGONOS_MOLLET],
  },
  {
    id: "barbera",
    nombre: "Barberà del Vallès",
    etiqueta: "Barberà del Vallès (Barcelona)",
    zonas: [...BARRIOS_BARBERA, ...POLIGONOS_BARBERA],
  },
  {
    id: "manresa",
    nombre: "Manresa",
    etiqueta: "Manresa (Barcelona)",
    zonas: [...BARRIOS_MANRESA, ...POLIGONOS_MANRESA],
  },
  {
    id: "sitges",
    nombre: "Sitges",
    etiqueta: "Sitges (Barcelona)",
    zonas: [...BARRIOS_SITGES, ...POLIGONOS_SITGES],
  },
  {
    id: "santpere",
    nombre: "Sant Pere de Ribes",
    etiqueta: "Sant Pere de Ribes (Barcelona)",
    zonas: [...BARRIOS_SANT_PERE, ...POLIGONOS_SANT_PERE],
  },
  {
    id: "vic",
    nombre: "Vic",
    etiqueta: "Vic (Barcelona)",
    zonas: [...BARRIOS_VIC, ...POLIGONOS_VIC],
  },
  {
    id: "igualada",
    nombre: "Igualada",
    etiqueta: "Igualada (Barcelona)",
    zonas: [...BARRIOS_IGUALADA, ...POLIGONOS_IGUALADA],
  },
  {
    id: "vilafranca",
    nombre: "Vilafranca del Penedès",
    etiqueta: "Vilafranca del Penedès (Barcelona)",
    zonas: [...BARRIOS_VILAFRANCA, ...POLIGONOS_VILAFRANCA],
  },
  {
    id: "tarragona",
    nombre: "Tarragona",
    etiqueta: "Tarragona (Tarragona)",
    zonas: [...BARRIOS_TARRAGONA, ...POLIGONOS_TARRAGONA],
  },
  {
    id: "reus",
    nombre: "Reus",
    etiqueta: "Reus (Tarragona)",
    zonas: [...BARRIOS_REUS, ...POLIGONOS_REUS],
  },
  {
    id: "elvendrell",
    nombre: "El Vendrell",
    etiqueta: "Vendrell, El (Tarragona)",
    zonas: [...BARRIOS_EL_VENDRELL, ...POLIGONOS_EL_VENDRELL],
  },
  {
    id: "cambrils",
    nombre: "Cambrils",
    etiqueta: "Cambrils (Tarragona)",
    zonas: [...BARRIOS_CAMBRILS, ...POLIGONOS_CAMBRILS],
  },
  {
    id: "tortosa",
    nombre: "Tortosa",
    etiqueta: "Tortosa (Tarragona)",
    zonas: [...BARRIOS_TORTOSA, ...POLIGONOS_TORTOSA],
  },
  {
    id: "calafell",
    nombre: "Calafell",
    etiqueta: "Calafell (Tarragona)",
    zonas: [...BARRIOS_CALAFELL, ...POLIGONOS_CALAFELL],
  },
  {
    id: "salou",
    nombre: "Salou",
    etiqueta: "Salou (Tarragona)",
    zonas: [...BARRIOS_SALOU, ...POLIGONOS_SALOU],
  },
  {
    id: "vilaseca",
    nombre: "Vila-seca",
    etiqueta: "Vila-seca (Tarragona)",
    zonas: [...BARRIOS_VILA_SECA, ...POLIGONOS_VILA_SECA],
  },
  {
    id: "lleida",
    nombre: "Lleida",
    etiqueta: "Lleida (Lleida)",
    zonas: [...BARRIOS_LLEIDA, ...POLIGONOS_LLEIDA],
  },
  {
    id: "girona",
    nombre: "Girona",
    etiqueta: "Girona (Girona)",
    zonas: [...BARRIOS_GIRONA, ...POLIGONOS_GIRONA],
  },
  {
    id: "lloret",
    nombre: "Lloret de Mar",
    etiqueta: "Lloret de Mar (Girona)",
    zonas: [...BARRIOS_LLORET, ...POLIGONOS_LLORET],
  },
  {
    id: "avila",
    nombre: "Ávila",
    etiqueta: "Ávila (Ávila)",
    zonas: [...BARRIOS_AVILA, ...POLIGONOS_AVILA],
  },
  {
    id: "salamanca",
    nombre: "Salamanca",
    etiqueta: "Salamanca (Salamanca)",
    zonas: [...BARRIOS_SALAMANCA, ...POLIGONOS_SALAMANCA],
  },
  {
    id: "madrid",
    nombre: "Madrid",
    etiqueta: "Madrid (Madrid)",
    zonas: [...BARRIOS_MADRID, ...POLIGONOS_MADRID],
  },
  {
    id: "mostoles",
    nombre: "Móstoles",
    etiqueta: "Móstoles (Madrid)",
    zonas: [...BARRIOS_MOSTOLES, ...POLIGONOS_MOSTOLES],
  },
  {
    id: "alcala",
    nombre: "Alcalá de Henares",
    etiqueta: "Alcalá de Henares (Madrid)",
    zonas: [...BARRIOS_ALCALA, ...POLIGONOS_ALCALA],
  },
  {
    id: "leganes",
    nombre: "Leganés",
    etiqueta: "Leganés (Madrid)",
    zonas: [...BARRIOS_LEGANES, ...POLIGONOS_LEGANES],
  },
  {
    id: "getafe",
    nombre: "Getafe",
    etiqueta: "Getafe (Madrid)",
    zonas: [...BARRIOS_GETAFE, ...POLIGONOS_GETAFE],
  },
  {
    id: "fuenlabrada",
    nombre: "Fuenlabrada",
    etiqueta: "Fuenlabrada (Madrid)",
    zonas: [...BARRIOS_FUENLABRADA, ...POLIGONOS_FUENLABRADA],
  },
  {
    id: "alcorcon",
    nombre: "Alcorcón",
    etiqueta: "Alcorcón (Madrid)",
    zonas: [...BARRIOS_ALCORCON, ...POLIGONOS_ALCORCON],
  },
  {
    id: "torrejon",
    nombre: "Torrejón de Ardoz",
    etiqueta: "Torrejón de Ardoz (Madrid)",
    zonas: [...BARRIOS_TORREJON, ...POLIGONOS_TORREJON],
  },
  {
    id: "torrelodones",
    nombre: "Torrelodones",
    etiqueta: "Torrelodones (Madrid)",
    zonas: [...BARRIOS_TORRELODONES, ...POLIGONOS_TORRELODONES],
  },
  {
    id: "parla",
    nombre: "Parla",
    etiqueta: "Parla (Madrid)",
    zonas: [...BARRIOS_PARLA, ...POLIGONOS_PARLA],
  },
  {
    id: "paracuellos",
    nombre: "Paracuellos de Jarama",
    etiqueta: "Paracuellos de Jarama (Madrid)",
    zonas: [...BARRIOS_PARACUELLOS, ...POLIGONOS_PARACUELLOS],
  },
  {
    id: "alcobendas",
    nombre: "Alcobendas",
    etiqueta: "Alcobendas (Madrid)",
    zonas: [...BARRIOS_ALCOBENDAS, ...POLIGONOS_ALCOBENDAS],
  },
  {
    id: "rivas",
    nombre: "Rivas-Vaciamadrid",
    etiqueta: "Rivas-Vaciamadrid (Madrid)",
    zonas: [...BARRIOS_RIVAS, ...POLIGONOS_RIVAS],
  },
  {
    id: "lasrozas",
    nombre: "Las Rozas de Madrid",
    etiqueta: "Rozas de Madrid, Las (Madrid)",
    zonas: [...BARRIOS_LAS_ROZAS, ...POLIGONOS_LAS_ROZAS],
  },
  {
    id: "ssreyes",
    nombre: "San Sebastián de los Reyes",
    etiqueta: "San Sebastián de los Reyes (Madrid)",
    zonas: [...BARRIOS_SS_REYES, ...POLIGONOS_SS_REYES],
  },
  {
    id: "pozuelo",
    nombre: "Pozuelo de Alarcón",
    etiqueta: "Pozuelo de Alarcón (Madrid)",
    zonas: [...BARRIOS_POZUELO, ...POLIGONOS_POZUELO],
  },
  {
    id: "valdemoro",
    nombre: "Valdemoro",
    etiqueta: "Valdemoro (Madrid)",
    zonas: [...BARRIOS_VALDEMORO, ...POLIGONOS_VALDEMORO],
  },
  {
    id: "villanuevacanada",
    nombre: "Villanueva de la Cañada",
    etiqueta: "Villanueva de la Cañada (Madrid)",
    zonas: [...BARRIOS_VILLANUEVA_CANADA, ...POLIGONOS_VILLANUEVA_CANADA],
  },
  {
    id: "villaviciosa",
    nombre: "Villaviciosa de Odón",
    etiqueta: "Villaviciosa de Odón (Madrid)",
    zonas: [...BARRIOS_VILLAVICIOSA, ...POLIGONOS_VILLAVICIOSA],
  },
  {
    id: "coslada",
    nombre: "Coslada",
    etiqueta: "Coslada (Madrid)",
    zonas: [...BARRIOS_COSLADA, ...POLIGONOS_COSLADA],
  },
  {
    id: "majadahonda",
    nombre: "Majadahonda",
    etiqueta: "Majadahonda (Madrid)",
    zonas: [...BARRIOS_MAJADAHONDA, ...POLIGONOS_MAJADAHONDA],
  },
  {
    id: "mejorada",
    nombre: "Mejorada del Campo",
    etiqueta: "Mejorada del Campo (Madrid)",
    zonas: [...BARRIOS_MEJORADA, ...POLIGONOS_MEJORADA],
  },
  {
    id: "colladovillalba",
    nombre: "Collado Villalba",
    etiqueta: "Collado Villalba (Madrid)",
    zonas: [...BARRIOS_COLLADO_VILLALBA, ...POLIGONOS_COLLADO_VILLALBA],
  },
  {
    id: "boadilla",
    nombre: "Boadilla del Monte",
    etiqueta: "Boadilla del Monte (Madrid)",
    zonas: [...BARRIOS_BOADILLA, ...POLIGONOS_BOADILLA],
  },
  {
    id: "aranjuez",
    nombre: "Aranjuez",
    etiqueta: "Aranjuez (Madrid)",
    zonas: [...BARRIOS_ARANJUEZ, ...POLIGONOS_ARANJUEZ],
  },
  {
    id: "arganda",
    nombre: "Arganda del Rey",
    etiqueta: "Arganda del Rey (Madrid)",
    zonas: [...BARRIOS_ARGANDA, ...POLIGONOS_ARGANDA],
  },
  {
    id: "colmenar",
    nombre: "Colmenar Viejo",
    etiqueta: "Colmenar Viejo (Madrid)",
    zonas: [...BARRIOS_COLMENAR, ...POLIGONOS_COLMENAR],
  },
  {
    id: "pinto",
    nombre: "Pinto",
    etiqueta: "Pinto (Madrid)",
    zonas: [...BARRIOS_PINTO, ...POLIGONOS_PINTO],
  },
  {
    id: "trescantos",
    nombre: "Tres Cantos",
    etiqueta: "Tres Cantos (Madrid)",
    zonas: [...BARRIOS_TRES_CANTOS, ...POLIGONOS_TRES_CANTOS],
  },
  {
    id: "sanfernando",
    nombre: "San Fernando de Henares",
    etiqueta: "San Fernando de Henares (Madrid)",
    zonas: [...BARRIOS_SAN_FERNANDO, ...POLIGONOS_SAN_FERNANDO],
  },
  {
    id: "sanmartinvega",
    nombre: "San Martín de la Vega",
    etiqueta: "San Martín de la Vega (Madrid)",
    zonas: [...BARRIOS_SAN_MARTIN_VEGA, ...POLIGONOS_SAN_MARTIN_VEGA],
  },
  {
    id: "arroyomolinos",
    nombre: "Arroyomolinos",
    etiqueta: "Arroyomolinos (Madrid)",
    zonas: [...BARRIOS_ARROYOMOLINOS, ...POLIGONOS_ARROYOMOLINOS],
  },
  {
    id: "galapagar",
    nombre: "Galapagar",
    etiqueta: "Galapagar (Madrid)",
    zonas: [...BARRIOS_GALAPAGAR, ...POLIGONOS_GALAPAGAR],
  },
  {
    id: "navalcarnero",
    nombre: "Navalcarnero",
    etiqueta: "Navalcarnero (Madrid)",
    zonas: [...BARRIOS_NAVALCARNERO, ...POLIGONOS_NAVALCARNERO],
  },
  {
    id: "sevilla",
    nombre: "Sevilla",
    etiqueta: "Sevilla (Sevilla)",
    zonas: [...BARRIOS_SEVILLA, ...POLIGONOS_SEVILLA],
  },
  {
    id: "doshermanas",
    nombre: "Dos Hermanas",
    etiqueta: "Dos Hermanas (Sevilla)",
    zonas: [...BARRIOS_DOS_HERMANAS, ...POLIGONOS_DOS_HERMANAS],
  },
  {
    id: "alcalaguadaira",
    nombre: "Alcalá de Guadaíra",
    etiqueta: "Alcalá de Guadaíra (Sevilla)",
    zonas: [...BARRIOS_ALCALA_GUADAIRA, ...POLIGONOS_ALCALA_GUADAIRA],
  },
  {
    id: "utrera",
    nombre: "Utrera",
    etiqueta: "Utrera (Sevilla)",
    zonas: [...BARRIOS_UTRERA, ...POLIGONOS_UTRERA],
  },
  {
    id: "mairenaaljarafe",
    nombre: "Mairena del Aljarafe",
    etiqueta: "Mairena del Aljarafe (Sevilla)",
    zonas: [...BARRIOS_MAIRENA_ALJARAFE, ...POLIGONOS_MAIRENA_ALJARAFE],
  },
  {
    id: "larinconada",
    nombre: "La Rinconada",
    etiqueta: "La Rinconada (Sevilla)",
    zonas: [...BARRIOS_LA_RINCONADA, ...POLIGONOS_LA_RINCONADA],
  },
  {
    id: "ecija",
    nombre: "Écija",
    etiqueta: "Écija (Sevilla)",
    zonas: [...BARRIOS_ECIJA, ...POLIGONOS_ECIJA],
  },
  {
    id: "lospalacios",
    nombre: "Los Palacios y Villafranca",
    etiqueta: "Los Palacios y Villafranca (Sevilla)",
    zonas: [...BARRIOS_LOS_PALACIOS, ...POLIGONOS_LOS_PALACIOS],
  },
  {
    id: "coria",
    nombre: "Coria del Río",
    etiqueta: "Coria del Río (Sevilla)",
    zonas: [...BARRIOS_CORIA, ...POLIGONOS_CORIA],
  },
  {
    id: "carmona",
    nombre: "Carmona",
    etiqueta: "Carmona (Sevilla)",
    zonas: [...BARRIOS_CARMONA, ...POLIGONOS_CARMONA],
  },
  {
    id: "malaga",
    nombre: "Málaga",
    etiqueta: "Málaga (Málaga)",
    zonas: [...BARRIOS_MALAGA, ...POLIGONOS_MALAGA],
  },
  {
    id: "marbella",
    nombre: "Marbella",
    etiqueta: "Marbella (Málaga)",
    zonas: [...BARRIOS_MARBELLA, ...POLIGONOS_MARBELLA],
  },
  {
    id: "mijas",
    nombre: "Mijas",
    etiqueta: "Mijas (Málaga)",
    zonas: [...BARRIOS_MIJAS, ...POLIGONOS_MIJAS],
  },
  {
    id: "velezmalaga",
    nombre: "Vélez-Málaga",
    etiqueta: "Vélez-Málaga (Málaga)",
    zonas: [...BARRIOS_VELEZ_MALAGA, ...POLIGONOS_VELEZ_MALAGA],
  },
  {
    id: "fuengirola",
    nombre: "Fuengirola",
    etiqueta: "Fuengirola (Málaga)",
    zonas: [...BARRIOS_FUENGIROLA, ...POLIGONOS_FUENGIROLA],
  },
  {
    id: "estepona",
    nombre: "Estepona",
    etiqueta: "Estepona (Málaga)",
    zonas: [...BARRIOS_ESTEPONA, ...POLIGONOS_ESTEPONA],
  },
  {
    id: "benalmadena",
    nombre: "Benalmádena",
    etiqueta: "Benalmádena (Málaga)",
    zonas: [...BARRIOS_BENALMADENA, ...POLIGONOS_BENALMADENA],
  },
  {
    id: "cartama",
    nombre: "Cártama",
    etiqueta: "Cártama (Málaga)",
    zonas: [...BARRIOS_CARTAMA, ...POLIGONOS_CARTAMA],
  },
  {
    id: "coin",
    nombre: "Coín",
    etiqueta: "Coín (Málaga)",
    zonas: [...BARRIOS_COIN, ...POLIGONOS_COIN],
  },
  {
    id: "torremolinos",
    nombre: "Torremolinos",
    etiqueta: "Torremolinos (Málaga)",
    zonas: [...BARRIOS_TORREMOLINOS, ...POLIGONOS_TORREMOLINOS],
  },
  {
    id: "rincondelavictoria",
    nombre: "Rincón de la Victoria",
    etiqueta: "Rincón de la Victoria (Málaga)",
    zonas: [...BARRIOS_RINCON_VICTORIA, ...POLIGONOS_RINCON_VICTORIA],
  },
  {
    id: "alhaurindelatorre",
    nombre: "Alhaurín de la Torre",
    etiqueta: "Alhaurín de la Torre (Málaga)",
    zonas: [...BARRIOS_ALHAURIN_TORRE, ...POLIGONOS_ALHAURIN_TORRE],
  },
  {
    id: "alhaurinelgrande",
    nombre: "Alhaurín el Grande",
    etiqueta: "Alhaurín el Grande (Málaga)",
    zonas: [...BARRIOS_ALHAURIN_GRANDE, ...POLIGONOS_ALHAURIN_GRANDE],
  },
  {
    id: "antequera",
    nombre: "Antequera",
    etiqueta: "Antequera (Málaga)",
    zonas: [...BARRIOS_ANTEQUERA, ...POLIGONOS_ANTEQUERA],
  },
  {
    id: "ronda",
    nombre: "Ronda",
    etiqueta: "Ronda (Málaga)",
    zonas: [...BARRIOS_RONDA, ...POLIGONOS_RONDA],
  },
  {
    id: "huelva",
    nombre: "Huelva",
    etiqueta: "Huelva (Huelva)",
    zonas: [...BARRIOS_HUELVA, ...POLIGONOS_HUELVA],
  },
  {
    id: "almonte",
    nombre: "Almonte",
    etiqueta: "Almonte (Huelva)",
    zonas: [...BARRIOS_ALMONTE, ...POLIGONOS_ALMONTE],
  },
  {
    id: "almeria",
    nombre: "Almería",
    etiqueta: "Almería (Almería)",
    zonas: [...BARRIOS_ALMERIA, ...POLIGONOS_ALMERIA],
  },
  {
    id: "roquetas",
    nombre: "Roquetas de Mar",
    etiqueta: "Roquetas de Mar (Almería)",
    zonas: [...BARRIOS_ROQUETAS, ...POLIGONOS_ROQUETAS],
  },
  {
    id: "elejido",
    nombre: "El Ejido",
    etiqueta: "El Ejido (Almería)",
    zonas: [...BARRIOS_EL_EJIDO, ...POLIGONOS_EL_EJIDO],
  },
  {
    id: "nijar",
    nombre: "Níjar",
    etiqueta: "Níjar (Almería)",
    zonas: [...BARRIOS_NIJAR, ...POLIGONOS_NIJAR],
  },
  {
    id: "lucena",
    nombre: "Lucena",
    etiqueta: "Lucena (Córdoba)",
    zonas: [...BARRIOS_LUCENA, ...POLIGONOS_LUCENA],
  },
  {
    id: "motril",
    nombre: "Motril",
    etiqueta: "Motril (Granada)",
    zonas: [...BARRIOS_MOTRIL, ...POLIGONOS_MOTRIL],
  },
  {
    id: "almunecar",
    nombre: "Almuñécar",
    etiqueta: "Almuñécar (Granada)",
    zonas: [...BARRIOS_ALMUNECAR, ...POLIGONOS_ALMUNECAR],
  },
  {
    id: "jaen",
    nombre: "Jaén",
    etiqueta: "Jaén (Jaén)",
    zonas: [...BARRIOS_JAEN, ...POLIGONOS_JAEN],
  },
  {
    id: "granada",
    nombre: "Granada",
    etiqueta: "Granada (Granada)",
    zonas: [...BARRIOS_GRANADA, ...POLIGONOS_GRANADA],
  },
  {
    id: "linares",
    nombre: "Linares",
    etiqueta: "Linares (Jaén)",
    zonas: [...BARRIOS_LINARES, ...POLIGONOS_LINARES],
  },
  {
    id: "andujar",
    nombre: "Andújar",
    etiqueta: "Andújar (Jaén)",
    zonas: [...BARRIOS_ANDUJAR, ...POLIGONOS_ANDUJAR],
  },
  {
    id: "ubeda",
    nombre: "Úbeda",
    etiqueta: "Úbeda (Jaén)",
    zonas: [...BARRIOS_UBEDA, ...POLIGONOS_UBEDA],
  },
  {
    id: "cordoba",
    nombre: "Córdoba",
    etiqueta: "Córdoba (Córdoba)",
    zonas: [...BARRIOS_CORDOBA, ...POLIGONOS_CORDOBA],
  },
  {
    id: "alicante",
    nombre: "Alicante",
    etiqueta: "Alicante (Alicante)",
    zonas: [...BARRIOS_ALICANTE, ...POLIGONOS_ALICANTE],
  },
  {
    id: "elche",
    nombre: "Elche",
    etiqueta: "Elche (Alicante)",
    zonas: [...BARRIOS_ELCHE, ...POLIGONOS_ELCHE],
  },
  {
    id: "torrevieja",
    nombre: "Torrevieja",
    etiqueta: "Torrevieja (Alicante)",
    zonas: [...BARRIOS_TORREVIEJA, ...POLIGONOS_TORREVIEJA],
  },
  {
    id: "orihuela",
    nombre: "Orihuela",
    etiqueta: "Orihuela (Alicante)",
    zonas: [...BARRIOS_ORIHUELA, ...POLIGONOS_ORIHUELA],
  },
  {
    id: "benidorm",
    nombre: "Benidorm",
    etiqueta: "Benidorm (Alicante)",
    zonas: [...BARRIOS_BENIDORM, ...POLIGONOS_BENIDORM],
  },
  {
    id: "alcoy",
    nombre: "Alcoy",
    etiqueta: "Alcoy (Alicante)",
    zonas: [...BARRIOS_ALCOY, ...POLIGONOS_ALCOY],
  },
  {
    id: "sanvicentedelraspeig",
    nombre: "San Vicente del Raspeig",
    etiqueta: "San Vicente del Raspeig (Alicante)",
    zonas: [...BARRIOS_SAN_VICENTE, ...POLIGONOS_SAN_VICENTE],
  },
  {
    id: "elda",
    nombre: "Elda",
    etiqueta: "Elda (Alicante)",
    zonas: [...BARRIOS_ELDA, ...POLIGONOS_ELDA],
  },
  {
    id: "denia",
    nombre: "Dénia",
    etiqueta: "Dénia (Alicante)",
    zonas: [...BARRIOS_DENIA, ...POLIGONOS_DENIA],
  },
  {
    id: "santapola",
    nombre: "Santa Pola",
    etiqueta: "Santa Pola (Alicante)",
    zonas: [...BARRIOS_SANTA_POLA, ...POLIGONOS_SANTA_POLA],
  },
  {
    id: "villajoyosa",
    nombre: "Villajoyosa",
    etiqueta: "Villajoyosa (Alicante)",
    zonas: [...BARRIOS_VILLAJOYOSA, ...POLIGONOS_VILLAJOYOSA],
  },
  {
    id: "villena",
    nombre: "Villena",
    etiqueta: "Villena (Alicante)",
    zonas: [...BARRIOS_VILLENA, ...POLIGONOS_VILLENA],
  },
  {
    id: "petrer",
    nombre: "Petrer",
    etiqueta: "Petrer (Alicante)",
    zonas: [...BARRIOS_PETRER, ...POLIGONOS_PETRER],
  },
  {
    id: "elcampello",
    nombre: "El Campello",
    etiqueta: "El Campello (Alicante)",
    zonas: [...BARRIOS_EL_CAMPELLO, ...POLIGONOS_EL_CAMPELLO],
  },
  {
    id: "crevillent",
    nombre: "Crevillent",
    etiqueta: "Crevillent (Alicante)",
    zonas: [...BARRIOS_CREVILLENT, ...POLIGONOS_CREVILLENT],
  },
  {
    id: "javea",
    nombre: "Jávea (Xàbia)",
    etiqueta: "Jávea (Xàbia) (Alicante)",
    zonas: [...BARRIOS_JAVEA, ...POLIGONOS_JAVEA],
  },
  {
    id: "huesca",
    nombre: "Huesca",
    etiqueta: "Huesca (Huesca)",
    zonas: [...BARRIOS_HUESCA, ...POLIGONOS_HUESCA],
  },
  {
    id: "teruel",
    nombre: "Teruel",
    etiqueta: "Teruel (Teruel)",
    zonas: [...BARRIOS_TERUEL, ...POLIGONOS_TERUEL],
  },
  {
    id: "toledo",
    nombre: "Toledo",
    etiqueta: "Toledo (Toledo)",
    zonas: [...BARRIOS_TOLEDO, ...POLIGONOS_TOLEDO],
  },
  {
    id: "talaveradelareina",
    nombre: "Talavera de la Reina",
    etiqueta: "Talavera de la Reina (Toledo)",
    zonas: [...BARRIOS_TALAVERA, ...POLIGONOS_TALAVERA],
  },
  {
    id: "illescas",
    nombre: "Illescas",
    etiqueta: "Illescas (Toledo)",
    zonas: [...BARRIOS_ILLESCAS, ...POLIGONOS_ILLESCAS],
  },
  {
    id: "sesena",
    nombre: "Seseña",
    etiqueta: "Seseña (Toledo)",
    zonas: [...BARRIOS_SESENA, ...POLIGONOS_SESENA],
  },
  {
    id: "valencia",
    nombre: "Valencia",
    etiqueta: "Valencia (Valencia)",
    zonas: [...BARRIOS_VALENCIA, ...POLIGONOS_VALENCIA],
  },
  {
    id: "torrent",
    nombre: "Torrent",
    etiqueta: "Torrent (Valencia)",
    zonas: [...BARRIOS_TORRENT, ...POLIGONOS_TORRENT],
  },
  {
    id: "gandia",
    nombre: "Gandia",
    etiqueta: "Gandia (Valencia)",
    zonas: [...BARRIOS_GANDIA, ...POLIGONOS_GANDIA],
  },
  {
    id: "paterna",
    nombre: "Paterna",
    etiqueta: "Paterna (Valencia)",
    zonas: [...BARRIOS_PATERNA, ...POLIGONOS_PATERNA],
  },
  {
    id: "sagunto",
    nombre: "Sagunto",
    etiqueta: "Sagunto (Valencia)",
    zonas: [...BARRIOS_SAGUNTO, ...POLIGONOS_SAGUNTO],
  },
  {
    id: "alzira",
    nombre: "Alzira",
    etiqueta: "Alzira (Valencia)",
    zonas: [...BARRIOS_ALZIRA, ...POLIGONOS_ALZIRA],
  },
  {
    id: "mislata",
    nombre: "Mislata",
    etiqueta: "Mislata (Valencia)",
    zonas: [...BARRIOS_MISLATA, ...POLIGONOS_MISLATA],
  },
  {
    id: "burjassot",
    nombre: "Burjassot",
    etiqueta: "Burjassot (Valencia)",
    zonas: [...BARRIOS_BURJASSOT, ...POLIGONOS_BURJASSOT],
  },
  {
    id: "ontinyent",
    nombre: "Ontinyent",
    etiqueta: "Ontinyent (Valencia)",
    zonas: [...BARRIOS_ONTINYENT, ...POLIGONOS_ONTINYENT],
  },
  {
    id: "aldaia",
    nombre: "Aldaia",
    etiqueta: "Aldaia (Valencia)",
    zonas: [...BARRIOS_ALDAIA, ...POLIGONOS_ALDAIA],
  },
  {
    id: "manises",
    nombre: "Manises",
    etiqueta: "Manises (Valencia)",
    zonas: [...BARRIOS_MANISES, ...POLIGONOS_MANISES],
  },
  {
    id: "xirivella",
    nombre: "Xirivella",
    etiqueta: "Xirivella (Valencia)",
    zonas: [...BARRIOS_XIRIVELLA, ...POLIGONOS_XIRIVELLA],
  },
  {
    id: "xativa",
    nombre: "Xàtiva",
    etiqueta: "Xàtiva (Valencia)",
    zonas: [...BARRIOS_XATIVA, ...POLIGONOS_XATIVA],
  },
  {
    id: "catarroja",
    nombre: "Catarroja",
    etiqueta: "Catarroja (Valencia)",
    zonas: [...BARRIOS_CATARROJA, ...POLIGONOS_CATARROJA],
  },
  {
    id: "alaquas",
    nombre: "Alaquàs",
    etiqueta: "Alaquàs (Valencia)",
    zonas: [...BARRIOS_ALAQUAS, ...POLIGONOS_ALAQUAS],
  },
  {
    id: "castellon",
    nombre: "Castellón de la Plana",
    etiqueta: "Castellón de la Plana (Castellón)",
    zonas: [...BARRIOS_CASTELLON, ...POLIGONOS_CASTELLON],
  },
  {
    id: "vilareal",
    nombre: "Vila-real",
    etiqueta: "Vila-real (Castellón)",
    zonas: [...BARRIOS_VILAREAL, ...POLIGONOS_VILAREAL],
  },
  {
    id: "vinaros",
    nombre: "Vinaròs",
    etiqueta: "Vinaròs (Castellón)",
    zonas: [...BARRIOS_VINAROS, ...POLIGONOS_VINAROS],
  },
  {
    id: "badajoz",
    nombre: "Badajoz",
    etiqueta: "Badajoz (Badajoz)",
    zonas: [...BARRIOS_BADAJOZ, ...POLIGONOS_BADAJOZ],
  },
  {
    id: "merida",
    nombre: "Mérida",
    etiqueta: "Mérida (Badajoz)",
    zonas: [...BARRIOS_MERIDA, ...POLIGONOS_MERIDA],
  },
  {
    id: "donbenito",
    nombre: "Don Benito",
    etiqueta: "Don Benito (Badajoz)",
    zonas: [...BARRIOS_DON_BENITO, ...POLIGONOS_DON_BENITO],
  },
  {
    id: "almendralejo",
    nombre: "Almendralejo",
    etiqueta: "Almendralejo (Badajoz)",
    zonas: [...BARRIOS_ALMENDRALEJO, ...POLIGONOS_ALMENDRALEJO],
  },
  {
    id: "caceres",
    nombre: "Cáceres",
    etiqueta: "Cáceres (Cáceres)",
    zonas: [...BARRIOS_CACERES, ...POLIGONOS_CACERES],
  },
  {
    id: "plasencia",
    nombre: "Plasencia",
    etiqueta: "Plasencia (Cáceres)",
    zonas: [...BARRIOS_PLASENCIA, ...POLIGONOS_PLASENCIA],
  },
  {
    id: "murcia",
    nombre: "Murcia",
    etiqueta: "Murcia (Murcia)",
    zonas: [...BARRIOS_MURCIA, ...POLIGONOS_MURCIA],
  },
  {
    id: "cartagena",
    nombre: "Cartagena",
    etiqueta: "Cartagena (Murcia)",
    zonas: [...BARRIOS_CARTAGENA, ...POLIGONOS_CARTAGENA],
  },
  {
    id: "lorca",
    nombre: "Lorca",
    etiqueta: "Lorca (Murcia)",
    zonas: [...BARRIOS_LORCA, ...POLIGONOS_LORCA],
  },
  {
    id: "molinadesegura",
    nombre: "Molina de Segura",
    etiqueta: "Molina de Segura (Murcia)",
    zonas: [...BARRIOS_MOLINA_DE_SEGURA, ...POLIGONOS_MOLINA_DE_SEGURA],
  },
  {
    id: "alcantarilla",
    nombre: "Alcantarilla",
    etiqueta: "Alcantarilla (Murcia)",
    zonas: [...BARRIOS_ALCANTARILLA, ...POLIGONOS_ALCANTARILLA],
  },
  {
    id: "torrepacheco",
    nombre: "Torre-Pacheco",
    etiqueta: "Torre-Pacheco (Murcia)",
    zonas: [...BARRIOS_TORRE_PACHECO, ...POLIGONOS_TORRE_PACHECO],
  },
  {
    id: "aguilas",
    nombre: "Águilas",
    etiqueta: "Águilas (Murcia)",
    zonas: [...BARRIOS_AGUILAS, ...POLIGONOS_AGUILAS],
  },
  {
    id: "yecla",
    nombre: "Yecla",
    etiqueta: "Yecla (Murcia)",
    zonas: [...BARRIOS_YECLA, ...POLIGONOS_YECLA],
  },
  {
    id: "sanjavier",
    nombre: "San Javier",
    etiqueta: "San Javier (Murcia)",
    zonas: [...BARRIOS_SAN_JAVIER, ...POLIGONOS_SAN_JAVIER],
  },
  {
    id: "sanpedrodelpinatar",
    nombre: "San Pedro del Pinatar",
    etiqueta: "San Pedro del Pinatar (Murcia)",
    zonas: [...BARRIOS_SAN_PEDRO_PINATAR, ...POLIGONOS_SAN_PEDRO_PINATAR],
  },
  {
    id: "cieza",
    nombre: "Cieza",
    etiqueta: "Cieza (Murcia)",
    zonas: [...BARRIOS_CIEZA, ...POLIGONOS_CIEZA],
  },
  {
    id: "mazarron",
    nombre: "Mazarrón",
    etiqueta: "Mazarrón (Murcia)",
    zonas: [...BARRIOS_MAZARRON],
  },
  {
    id: "totana",
    nombre: "Totana",
    etiqueta: "Totana (Murcia)",
    zonas: [...BARRIOS_TOTANA, ...POLIGONOS_TOTANA],
  },
  {
    id: "albacete",
    nombre: "Albacete",
    etiqueta: "Albacete (Albacete)",
    zonas: [...BARRIOS_ALBACETE, ...POLIGONOS_ALBACETE],
  },
  {
    id: "hellin",
    nombre: "Hellín",
    etiqueta: "Hellín (Albacete)",
    zonas: [...BARRIOS_HELLIN, ...POLIGONOS_HELLIN],
  },
  {
    id: "ciudadreal",
    nombre: "Ciudad Real",
    etiqueta: "Ciudad Real (Ciudad Real)",
    zonas: [...BARRIOS_CIUDAD_REAL, ...POLIGONOS_CIUDAD_REAL],
  },
  {
    id: "puertollano",
    nombre: "Puertollano",
    etiqueta: "Puertollano (Ciudad Real)",
    zonas: [...BARRIOS_PUERTOLLANO, ...POLIGONOS_PUERTOLLANO],
  },
  {
    id: "tomelloso",
    nombre: "Tomelloso",
    etiqueta: "Tomelloso (Ciudad Real)",
    zonas: [...BARRIOS_TOMELLOSO, ...POLIGONOS_TOMELLOSO],
  },
  {
    id: "alcazardesanjuan",
    nombre: "Alcázar de San Juan",
    etiqueta: "Alcázar de San Juan (Ciudad Real)",
    zonas: [...BARRIOS_ALCAZAR_DE_SAN_JUAN, ...POLIGONOS_ALCAZAR_DE_SAN_JUAN],
  },
  {
    id: "valdepenas",
    nombre: "Valdepeñas",
    etiqueta: "Valdepeñas (Ciudad Real)",
    zonas: [...BARRIOS_VALDEPENAS, ...POLIGONOS_VALDEPENAS],
  },
  {
    id: "cuenca",
    nombre: "Cuenca",
    etiqueta: "Cuenca (Cuenca)",
    zonas: [...BARRIOS_CUENCA, ...POLIGONOS_CUENCA],
  },
  {
    id: "guadalajara",
    nombre: "Guadalajara",
    etiqueta: "Guadalajara (Guadalajara)",
    zonas: [...BARRIOS_GUADALAJARA, ...POLIGONOS_GUADALAJARA],
  },
  {
    id: "azuqueca",
    nombre: "Azuqueca de Henares",
    etiqueta: "Azuqueca de Henares (Guadalajara)",
    zonas: [...BARRIOS_AZUQUECA, ...POLIGONOS_AZUQUECA],
  },
  {
    id: "oviedo",
    nombre: "Oviedo",
    etiqueta: "Oviedo (Asturias)",
    zonas: [...BARRIOS_OVIEDO, ...POLIGONOS_OVIEDO],
  },
  {
    id: "ames",
    nombre: "Ames",
    etiqueta: "Ames (A Coruña)",
    zonas: [...BARRIOS_AMES, ...POLIGONOS_AMES],
  },
  {
    id: "arteixo",
    nombre: "Arteixo",
    etiqueta: "Arteixo (A Coruña)",
    zonas: [...BARRIOS_ARTEIXO, ...POLIGONOS_ARTEIXO],
  },
  {
    id: "carballo",
    nombre: "Carballo",
    etiqueta: "Carballo (A Coruña)",
    zonas: [...BARRIOS_CARBALLO, ...POLIGONOS_CARBALLO],
  },
  {
    id: "culleredo",
    nombre: "Culleredo",
    etiqueta: "Culleredo (A Coruña)",
    zonas: [...BARRIOS_CULLEREDO, ...POLIGONOS_CULLEREDO],
  },
  {
    id: "ribeira",
    nombre: "Ribeira",
    etiqueta: "Ribeira (A Coruña)",
    zonas: [...BARRIOS_RIBEIRA, ...POLIGONOS_RIBEIRA],
  },
  {
    id: "lanucia",
    nombre: "La Nucía",
    etiqueta: "La Nucía (Alicante)",
    zonas: [...BARRIOS_LA_NUCIA, ...POLIGONOS_LA_NUCIA],
  },
  {
    id: "aviles",
    nombre: "Avilés",
    etiqueta: "Avilés (Asturias)",
    zonas: [...BARRIOS_AVILES, ...POLIGONOS_AVILES],
  },
  {
    id: "langreo",
    nombre: "Langreo",
    etiqueta: "Langreo (Asturias)",
    zonas: [...BARRIOS_LANGREO, ...POLIGONOS_LANGREO],
  },
  {
    id: "mieres",
    nombre: "Mieres",
    etiqueta: "Mieres (Asturias)",
    zonas: [...BARRIOS_MIERES, ...POLIGONOS_MIERES],
  },
  {
    id: "siero",
    nombre: "Siero",
    etiqueta: "Siero (Asturias)",
    zonas: [...BARRIOS_SIERO, ...POLIGONOS_SIERO],
  },
  {
    id: "martorell",
    nombre: "Martorell",
    etiqueta: "Martorell (Barcelona)",
    zonas: [...BARRIOS_MARTORELL, ...POLIGONOS_MARTORELL],
  },
  {
    id: "santaperpetua",
    nombre: "Santa Perpètua de Mogoda",
    etiqueta: "Santa Perpètua de Mogoda (Barcelona)",
    zonas: [...BARRIOS_SANTA_PERPETUA, ...POLIGONOS_SANTA_PERPETUA],
  },
  {
    id: "palma",
    nombre: "Palma",
    etiqueta: "Palma (Illes Balears)",
    zonas: [...BARRIOS_PALMA, ...POLIGONOS_PALMA],
  },
  {
    id: "calvia",
    nombre: "Calvià",
    etiqueta: "Calvià (Illes Balears)",
    zonas: [...BARRIOS_CALVIA, ...POLIGONOS_CALVIA],
  },
  {
    id: "ciutadella",
    nombre: "Ciutadella de Menorca",
    etiqueta: "Ciutadella de Menorca (Illes Balears)",
    zonas: [...BARRIOS_CIUTADELLA, ...POLIGONOS_CIUTADELLA],
  },
  {
    id: "llucmajor",
    nombre: "Llucmajor",
    etiqueta: "Llucmajor (Illes Balears)",
    zonas: [...BARRIOS_LLUCMAJOR, ...POLIGONOS_LLUCMAJOR],
  },
  {
    id: "manacor",
    nombre: "Manacor",
    etiqueta: "Manacor (Illes Balears)",
    zonas: [...BARRIOS_MANACOR, ...POLIGONOS_MANACOR],
  },
  {
    id: "mao",
    nombre: "Maó",
    etiqueta: "Maó (Illes Balears)",
    zonas: [...BARRIOS_MAO, ...POLIGONOS_MAO],
  },
  {
    id: "marratxi",
    nombre: "Marratxí",
    etiqueta: "Marratxí (Illes Balears)",
    zonas: [...BARRIOS_MARRATXI, ...POLIGONOS_MARRATXI],
  },
  {
    id: "santaeularia",
    nombre: "Santa Eulària des Riu",
    etiqueta: "Santa Eulària des Riu (Illes Balears)",
    zonas: [...BARRIOS_SANTA_EULARIA, ...POLIGONOS_SANTA_EULARIA],
  },
  {
    id: "cadiz",
    nombre: "Cádiz",
    etiqueta: "Cádiz (Cádiz)",
    zonas: [...BARRIOS_CADIZ, ...POLIGONOS_CADIZ],
  },
  {
    id: "algeciras",
    nombre: "Algeciras",
    etiqueta: "Algeciras (Cádiz)",
    zonas: [...BARRIOS_ALGECIRAS, ...POLIGONOS_ALGECIRAS],
  },
  {
    id: "arcos",
    nombre: "Arcos de la Frontera",
    etiqueta: "Arcos de la Frontera (Cádiz)",
    zonas: [...BARRIOS_ARCOS, ...POLIGONOS_ARCOS],
  },
  {
    id: "chiclana",
    nombre: "Chiclana de la Frontera",
    etiqueta: "Chiclana de la Frontera (Cádiz)",
    zonas: [...BARRIOS_CHICLANA, ...POLIGONOS_CHICLANA],
  },
  {
    id: "elpuerto",
    nombre: "El Puerto de Santa María",
    etiqueta: "El Puerto de Santa María (Cádiz)",
    zonas: [...BARRIOS_EL_PUERTO, ...POLIGONOS_EL_PUERTO],
  },
  {
    id: "jerez",
    nombre: "Jerez de la Frontera",
    etiqueta: "Jerez de la Frontera (Cádiz)",
    zonas: [...BARRIOS_JEREZ, ...POLIGONOS_JEREZ],
  },
  {
    id: "puertoreal",
    nombre: "Puerto Real",
    etiqueta: "Puerto Real (Cádiz)",
    zonas: [...BARRIOS_PUERTO_REAL, ...POLIGONOS_PUERTO_REAL],
  },
  {
    id: "sanroque",
    nombre: "San Roque",
    etiqueta: "San Roque (Cádiz)",
    zonas: [...BARRIOS_SAN_ROQUE, ...POLIGONOS_SAN_ROQUE],
  },
  {
    id: "sanlucar",
    nombre: "Sanlúcar de Barrameda",
    etiqueta: "Sanlúcar de Barrameda (Cádiz)",
    zonas: [...BARRIOS_SANLUCAR, ...POLIGONOS_SANLUCAR],
  },
  {
    id: "aguimes",
    nombre: "Agüimes",
    etiqueta: "Agüimes (Las Palmas)",
    zonas: [...BARRIOS_AGUIMES, ...POLIGONOS_AGUIMES],
  },
  {
    id: "arucas",
    nombre: "Arucas",
    etiqueta: "Arucas (Las Palmas)",
    zonas: [...BARRIOS_ARUCAS, ...POLIGONOS_ARUCAS],
  },
  {
    id: "ingenio",
    nombre: "Ingenio",
    etiqueta: "Ingenio (Las Palmas)",
    zonas: [...BARRIOS_INGENIO, ...POLIGONOS_INGENIO],
  },
  {
    id: "laoliva",
    nombre: "La Oliva",
    etiqueta: "La Oliva (Las Palmas)",
    zonas: [...BARRIOS_LA_OLIVA, ...POLIGONOS_LA_OLIVA],
  },
  {
    id: "laspalmas",
    nombre: "Las Palmas de Gran Canaria",
    etiqueta: "Las Palmas de Gran Canaria (Las Palmas)",
    zonas: [...BARRIOS_LAS_PALMAS, ...POLIGONOS_LAS_PALMAS],
  },
  {
    id: "puertorosario",
    nombre: "Puerto del Rosario",
    etiqueta: "Puerto del Rosario (Las Palmas)",
    zonas: [...BARRIOS_PUERTO_ROSARIO, ...POLIGONOS_PUERTO_ROSARIO],
  },
  {
    id: "tirajana",
    nombre: "San Bartolomé de Tirajana",
    etiqueta: "San Bartolomé de Tirajana (Las Palmas)",
    zonas: [...BARRIOS_TIRAJANA, ...POLIGONOS_TIRAJANA],
  },
  {
    id: "santalucia",
    nombre: "Santa Lucía de Tirajana",
    etiqueta: "Santa Lucía de Tirajana (Las Palmas)",
    zonas: [...BARRIOS_SANTA_LUCIA, ...POLIGONOS_SANTA_LUCIA],
  },
  {
    id: "telde",
    nombre: "Telde",
    etiqueta: "Telde (Las Palmas)",
    zonas: [...BARRIOS_TELDE, ...POLIGONOS_TELDE],
  },
  {
    id: "santacruztenerife",
    nombre: "Santa Cruz de Tenerife",
    etiqueta: "Santa Cruz de Tenerife (Santa Cruz de Tenerife)",
    zonas: [
      ...BARRIOS_SANTA_CRUZ_TENERIFE,
      ...POLIGONOS_SANTA_CRUZ_TENERIFE,
    ],
  },
  {
    id: "adeje",
    nombre: "Adeje",
    etiqueta: "Adeje (Santa Cruz de Tenerife)",
    zonas: [...BARRIOS_ADEJE, ...POLIGONOS_ADEJE],
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

export function compararTextoEs(a: string, b: string): number {
  return a.localeCompare(b, "es", { sensitivity: "base", numeric: true });
}

const CAPITAL_DE_PROVINCIA: Record<string, string> = {
  Álava: "Vitoria-Gasteiz",
  Asturias: "Oviedo",
  Bizkaia: "Bilbao",
  Cantabria: "Santander",
  Castellón: "Castellón de la Plana",
  Gipuzkoa: "San Sebastián",
  "Illes Balears": "Palma",
  "La Rioja": "Logroño",
  "Las Palmas": "Las Palmas de Gran Canaria",
  Navarra: "Pamplona",
};

function provinciaDeEtiqueta(etiqueta: string): string {
  const abre = etiqueta.lastIndexOf("(");
  const cierra = etiqueta.lastIndexOf(")");
  if (abre >= 0 && cierra > abre) return etiqueta.slice(abre + 1, cierra);
  return etiqueta;
}

function esCapitalProvincial(ciudad: CiudadUrbana): boolean {
  const provincia = provinciaDeEtiqueta(ciudad.etiqueta);
  const capital = CAPITAL_DE_PROVINCIA[provincia] ?? provincia;
  return ciudad.nombre === capital;
}

export function ciudadesParaDesplegable(): {
  value: string;
  label: string;
  negrita?: boolean;
  bajoCapital?: boolean;
}[] {
  const porProvincia = new Map<string, CiudadUrbana[]>();
  for (const ciudad of CIUDADES_URBANAS) {
    const provincia = provinciaDeEtiqueta(ciudad.etiqueta);
    const lista = porProvincia.get(provincia) ?? [];
    lista.push(ciudad);
    porProvincia.set(provincia, lista);
  }
  const bloques = [...porProvincia.values()].map((ciudades) => {
    const capital = ciudades.find(esCapitalProvincial) ?? null;
    const resto = ciudades
      .filter((ciudad) => ciudad !== capital)
      .sort((a, b) => compararTextoEs(a.nombre, b.nombre));
    return { capital, resto, orden: capital?.nombre ?? resto[0]?.nombre ?? "" };
  });
  bloques.sort((a, b) => compararTextoEs(a.orden, b.orden));
  const opciones: {
    value: string;
    label: string;
    negrita?: boolean;
    bajoCapital?: boolean;
  }[] = [];
  for (const bloque of bloques) {
    if (bloque.capital) {
      opciones.push({
        value: bloque.capital.id,
        label: bloque.capital.nombre,
        negrita: true,
      });
    }
    for (const ciudad of bloque.resto) {
      opciones.push({
        value: ciudad.id,
        label: ciudad.nombre,
        bajoCapital: Boolean(bloque.capital),
      });
    }
  }
  return opciones;
}

export function zonasParaDesplegable(
  ciudad: CiudadUrbana
): { value: string; label: string; group: string }[] {
  const barrios = ciudad.zonas
    .filter((zona) => zona.tipo === "barrio")
    .sort((a, b) => compararTextoEs(a.nombre, b.nombre))
    .map((zona) => ({
      value: zona.nombre,
      label: etiquetaZona(zona),
      group: "Barrios",
    }));
  const poligonos = ciudad.zonas
    .filter((zona) => zona.tipo === "poligono")
    .sort((a, b) => compararTextoEs(a.nombre, b.nombre))
    .map((zona) => ({
      value: zona.nombre,
      label: etiquetaZona(zona),
      group: "Polígonos",
    }));
  return [...barrios, ...poligonos];
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
