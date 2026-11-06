/**
 * ============================================================
 *  CONFIGURACIÓN DE LA INVITACIÓN — MUNDO DE CARAMELO
 *  Todo lo que dice "TODO" debe reemplazarse con los datos reales.
 * ============================================================
 */

/** Años que cumple. */
const EDAD: number = 2; // TODO

export const config = {
   /** Nombre del cumpleañero/a tal como aparece en grande. */
   nombre: "Nombre", // TODO

   edad: EDAD,

   /** Cómo referirse a él/ella en textos ("el cumpleañero" / "la cumpleañera"). */
   cumpleanero: "la cumpleañera", // TODO

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
   youtubeVideoId: "", // TODO

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
      fotos: [] as string[], // TODO ej: ["1.jpg", "2.jpg"]
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

   creditos: "Daniel Quezada",

   imagenes: {
      /** Foto del cumpleañero/a (marco de la intro y fondo de la sección de fotos). Opcional. */
      fotoCumple: "foto-cumple.jpg",
   },
};
