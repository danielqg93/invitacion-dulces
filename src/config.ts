/**
 * ============================================================
 *  CONFIGURACIÓN DE LA INVITACIÓN — MUNDO DE CARAMELO
 *  Todo lo que dice "TODO" debe reemplazarse con los datos reales.
 * ============================================================
 */

/** Años que cumple. */
const EDAD: number = 2; // TODO

/* ------------------------------------------------------------
 *  BIENVENIDA (ventana inicial) — 4 diseños para elegir
 *  En los textos puedes usar {nombre} y {invitado}.
 *  Para verlos sin tocar el código abre la invitación con
 *  ?bienvenida=caramelo  (o cupcake, frasco, boleto)
 *  Ej: https://.../?bienvenida=boleto#DUL001
 * ------------------------------------------------------------ */
export type VarianteBienvenida = "cupcake" | "caramelo" | "frasco" | "boleto";

export type Bienvenida = {
   /** Texto pequeño arriba del nombre. */
   saludo: string;
   /** Saludo cuando el invitado entra con su código (usa {invitado}). */
   saludoInvitado: string;
   /** Texto pequeño debajo del nombre. */
   subtitulo: string;
   botonConMusica: string;
   botonSinMusica: string;
   /** Botón único cuando no hay música. */
   botonEntrar: string;
};

export const bienvenidas: Record<VarianteBienvenida, Bienvenida> = {
   cupcake: {
      saludo: "¡Hola! Bienvenido al Mundo de Caramelo de",
      saludoInvitado: "¡Hola, {invitado}! Bienvenido al Mundo de Caramelo de",
      subtitulo: "La música es el ingrediente secreto",
      botonConMusica: "ENTRAR CON MÚSICA",
      botonSinMusica: "Entrar sin música",
      botonEntrar: "¡ENTRAR AL MUNDO DULCE!",
   },
   caramelo: {
      saludo: "Tienes un caramelo sorpresa de",
      saludoInvitado: "{invitado}, tienes un caramelo sorpresa de",
      subtitulo: "Desenvuélvelo para descubrir la fiesta más dulce",
      botonConMusica: "DESENVOLVER CON MÚSICA",
      botonSinMusica: "Desenvolver sin música",
      botonEntrar: "¡DESENVOLVER!",
   },
   frasco: {
      saludo: "Este frasco de dulces es para ti. Lo envía",
      saludoInvitado: "{invitado}, este frasco de dulces es para ti. Lo envía",
      subtitulo: "Abre la tapa y deja salir la diversión",
      botonConMusica: "ABRIR EL FRASCO CON MÚSICA",
      botonSinMusica: "Abrir sin música",
      botonEntrar: "¡ABRIR EL FRASCO!",
   },
   boleto: {
      saludo: "¡Encontraste el boleto dorado! Estás invitado a la fiesta de",
      saludoInvitado:
         "¡{invitado}, encontraste el boleto dorado! Estás invitado a la fiesta de",
      subtitulo: "Este boleto te da acceso a la dulcería más divertida",
      botonConMusica: "USAR MI BOLETO CON MÚSICA",
      botonSinMusica: "Usar sin música",
      botonEntrar: "¡USAR MI BOLETO!",
   },
};

/* ------------------------------------------------------------
 *  PORTADA — 3 diseños para elegir
 *   - "casita":  casita de dulces con piruletas y algodón de azúcar
 *   - "foto":    foto del cumpleañero/a en una dona gigante
 *   - "letrero": dulcería con toldo a rayas y letrero colgante
 *  Para probar sin tocar el código: ?portada=foto (o casita, letrero)
 * ------------------------------------------------------------ */
export type ModoPortada = "casita" | "foto" | "letrero";

export const config = {
   /** Nombre del cumpleañero/a tal como aparece en grande. */
   nombre: "Valentina", // TODO (nombre de ejemplo)

   edad: EDAD,

   /** Cómo referirse a él/ella en textos ("el cumpleañero" / "la cumpleañera"). */
   cumpleanero: "la cumpleañera", // TODO

   /** Diseño de la ventana de bienvenida (ver `bienvenidas` arriba). */
   bienvenidaActiva: "caramelo" as VarianteBienvenida, // TODO elige uno

   /** Diseño de la portada (ver arriba). */
   portada: "foto" as ModoPortada, // TODO elige uno

   /** Nombre del mundo dulce. */
   mundo: "Mundo de Caramelo",

   /** Texto bajo el nombre. */
   edadTexto: EDAD === 1 ? "Mi primer añito" : `Mis ${EDAD} añitos`,

   /**
    * Fecha y hora de inicio. OJO: el mes empieza en 0 (0 = enero, 11 = diciembre).
    * Ejemplo: new Date(2027, 5, 12, 15, 0) = 12 de junio 2027, 3:00 pm.
    */
   fechaEvento: new Date(2027, 5, 12, 15, 0), // TODO

   /** Duración aproximada en horas (para el botón "Agendar"). */
   duracionHoras: 4,

   /** Frase principal de la introducción. */
   frase: "Prepárate para un día lleno de helados, chocolates, caramelos y mucha diversión.",

   lugar: "Nombre del local", // TODO
   direccion: "Dirección del local", // TODO
   referencia: "Referencia: cerca de...", // TODO (deja "" para ocultarla)
   mapsUrl: "https://maps.google.com", // TODO link de Google Maps

   /** ID del video de YouTube para la música de fondo. "" = sin música. */
   youtubeVideoId: "WP71degjZ9M", // TODO ("Mundo de Caramelo" - Danna Paola)

   /**
    * Dónde se guardan las confirmaciones de asistencia.
    * - "/api/confirmaciones": funciona en local (bun run dev) y en Netlify.
    * - Para GitHub Pages usa la URL de tu propio Google Apps Script.
    */
   rsvpEndpoint: "/api/confirmaciones",

   galeria: {
      titulo: "Mis momentos más dulces", // TODO
      subtitulo: "Cada foto, un caramelo de recuerdo",
      /** Archivos dentro de public/img/galeria/. Si la lista está vacía, la sección se oculta. */
      fotos: ["1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg"] as string[], // TODO fotos reales
   },

   fotos: {
      /** Álbum compartido donde los invitados suben fotos. "" para ocultar el enlace. */
      albumUrl: "", // TODO
      hashtag: "#MundoDeCaramelo", // TODO
   },

   modales: {
      vestimenta: {
         titulo: "¡Ven con tus colores más dulces!",
         texto: "Rosa, menta, lila o amarillo vainilla. ¡Mientras más colorido, más dulce!",
      },
      tips: {
         titulo: "¡Los dulces se sirven puntuales!",
         texto: "Llega unos minutos antes para no perderte ningún helado.",
      },
      regalos: {
         titulo: "Tu presencia es mi mejor regalo",
         texto: "Si aun así deseas obsequiarme algo, podrás consultar los datos con mi familia.",
      },
   },

   /** Frase de cierre del pie de página. */
   cierre: "¡Te espero para endulzar mi día!",

   creditos: "Invitarte",

   /**
    * Aviso flotante "Demo · Personalizada · Cotízala" (esquina inferior izquierda).
    * Ponlo en activo: false en la invitación real del cliente.
    */
   demo: {
      activo: true,
      paquete: "Personalizada",
      cotizarUrl: "https://invitarte-peru.com/#cotiza",
   },

   imagenes: {
      /** Foto del cumpleañero/a (marco de la intro y fondo de la sección de fotos). Opcional. */
      fotoCumple: "foto-cumple.jpg",
      /** Foto de fondo de la portada (horizontal). "" para quitarla. */
      fondoPortada: "fondo-portada.jpg", // TODO foto real
      /** Foto de fondo del pie de página. "" para quitarla. */
      fondoPie: "fondo-pie.jpg", // TODO foto real
      /** Opacidad de las fotos de fondo (0 = invisible, 1 = completa). */
      opacidadPortada: 0.28,
      opacidadPie: 0.3,
   },
};
