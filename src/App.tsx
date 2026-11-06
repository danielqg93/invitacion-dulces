import { useEffect, useRef, useState } from "react";
import invitados from "../db/invitados.json";
import itinerario from "../db/itinerario.json";
import { config } from "./config";
import {
   Algodon,
   Caramelo,
   Dona,
   Glaseado,
   HeladoArmado,
   Macaron,
   Piruleta,
   SABORES,
   SALSAS,
   type Sabor,
   type Salsa,
   TOPPINGS,
   type Topping,
} from "./decor";

declare global {
   interface Window {
      YT?: {
         Player: new (
            element: HTMLElement | string,
            options: {
               height?: string;
               width?: string;
               videoId?: string;
               playerVars?: Record<string, number | string>;
               events?: {
                  onReady?: (event: {
                     target: { playVideo: () => void; pauseVideo: () => void };
                  }) => void;
                  onStateChange?: (event: { data: number }) => void;
               };
            },
         ) => YTPlayer;
         PlayerState?: { PLAYING: number; PAUSED: number };
      };
      onYouTubeIframeAPIReady?: () => void;
   }
}

type YTPlayer = {
   playVideo: () => void;
   pauseVideo: () => void;
   destroy: () => void;
};

/* ------------------------------------------------------------------ */
/* Datos derivados de la configuración                                 */
/* ------------------------------------------------------------------ */

const ASSET_IMG = `${import.meta.env.BASE_URL}img`;
const img = (file: string) => `${ASSET_IMG}/${file}`;
const dulce = (file: string) => img(`dulces/${file}`);

const pad = (n: number) => String(n).padStart(2, "0");
const capitalize = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);

const fecha = config.fechaEvento;
const fechaCorta = `${pad(fecha.getDate())}.${pad(fecha.getMonth() + 1)}.${fecha.getFullYear()}`;
const horaTexto = fecha
   .toLocaleTimeString("es-PE", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
   })
   .replace(/\s*a\.?\s*m\.?/i, " am")
   .replace(/\s*p\.?\s*m\.?/i, " pm");
const diaTexto = capitalize(
   fecha.toLocaleDateString("es-PE", {
      weekday: "long",
      day: "numeric",
      month: "long",
   }),
);

const toCalendarDate = (date: Date) =>
   date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
   `${config.nombre} - ${config.edadTexto}`,
)}&dates=${toCalendarDate(fecha)}/${toCalendarDate(
   new Date(fecha.getTime() + config.duracionHoras * 3600000),
)}&location=${encodeURIComponent(`${config.lugar}, ${config.direccion}`)}`;

const galleryImages = config.galeria.fotos.map((f) => img(`galeria/${f}`));
const hasMusic = config.youtubeVideoId.trim() !== "";
const HELADO_KEY = "mi-helado";

type ModalName = "welcome" | "rsvp" | "dress" | "tips" | "gifts" | null;
type IconName = "calendar" | "pin" | "check" | "camera" | "heart";

type Invitado = {
   nombre: string;
   apellidos: string;
   codigoInvitacion: string;
};

type ItinerarioItem = { hour: string; event: string; sonrisas?: number };

type Helado = { sabor: Sabor; salsa: Salsa; topping: Topping };

const invitadosRegistrados = invitados as Invitado[];
const eventos = itinerario as ItinerarioItem[];

function obtenerInvitado(): Invitado | null {
   const hash = window.location.hash.replace(/^#\/?/, "").trim();
   const codigo = hash.split("/").filter(Boolean)[0] || "";
   if (!codigo) return null;
   return (
      invitadosRegistrados.find(
         (i) => i.codigoInvitacion.toUpperCase() === codigo.toUpperCase(),
      ) ?? null
   );
}

const HELADO_INICIAL: Helado = {
   sabor: "fresa",
   salsa: "chocolate",
   topping: "chispas",
};

function leerHelado(): { helado: Helado; listo: boolean } {
   try {
      const raw = window.localStorage.getItem(HELADO_KEY);
      if (!raw) return { helado: HELADO_INICIAL, listo: false };
      const h = JSON.parse(raw) as Partial<Helado>;
      if (
         h.sabor &&
         h.sabor in SABORES &&
         h.salsa &&
         h.salsa in SALSAS &&
         h.topping &&
         h.topping in TOPPINGS
      ) {
         return { helado: h as Helado, listo: true };
      }
   } catch {
      /* sin almacenamiento: se usa el helado inicial */
   }
   return { helado: HELADO_INICIAL, listo: false };
}

function describirHelado(h: Helado) {
   const salsa =
      h.salsa === "ninguna" ? "" : ` con salsa de ${SALSAS[h.salsa].label.toLowerCase()}`;
   return `${SABORES[h.sabor].label}${salsa} y ${TOPPINGS[h.topping].label.toLowerCase()}`;
}

/* ------------------------------------------------------------------ */
/* Hooks                                                               */
/* ------------------------------------------------------------------ */

function useReveal() {
   useEffect(() => {
      const elements = document.querySelectorAll("[data-reveal]");
      if (!("IntersectionObserver" in window)) {
         for (const el of elements) el.classList.add("is-visible");
         return;
      }
      const observer = new IntersectionObserver(
         (entries) => {
            for (const entry of entries) {
               if (entry.isIntersecting) {
                  entry.target.classList.add("is-visible");
                  observer.unobserve(entry.target);
               }
            }
         },
         { threshold: 0.2 },
      );
      for (const el of elements) observer.observe(el);
      return () => observer.disconnect();
   }, []);
}

/* ------------------------------------------------------------------ */
/* Componentes pequeños                                                */
/* ------------------------------------------------------------------ */

function Icon({ name }: { name: IconName }) {
   const paths: Record<IconName, React.ReactNode> = {
      calendar: (
         <>
            <rect x="3" y="5" width="18" height="16" rx="3" />
            <path d="M7 3v4M17 3v4M3 10h18" />
         </>
      ),
      pin: (
         <>
            <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
            <circle cx="12" cy="10" r="2.5" />
         </>
      ),
      check: (
         <>
            <circle cx="12" cy="12" r="9" />
            <path d="m8 12 2.6 2.6L16.5 9" />
         </>
      ),
      camera: (
         <>
            <path d="M4 7h3l2-3h6l2 3h3a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1Z" />
            <circle cx="12" cy="13" r="4" />
         </>
      ),
      heart: (
         <path d="M12 21S3 16 3 9.5A4.5 4.5 0 0 1 12 8a4.5 4.5 0 0 1 9 1.5C21 16 12 21 12 21Z" />
      ),
   };
   return (
      <svg
         className="icon"
         viewBox="0 0 24 24"
         aria-hidden="true"
         fill="none"
         stroke="currentColor"
         strokeWidth={2}
         strokeLinecap="round"
         strokeLinejoin="round"
      >
         {paths[name]}
      </svg>
   );
}

function Button({
   children,
   onClick,
   href,
   variant = "pink",
   type = "button",
}: {
   children: React.ReactNode;
   onClick?: () => void;
   href?: string;
   variant?: "pink" | "mint" | "choco";
   type?: "button" | "submit";
}) {
   const className = `btn btn-${variant}`;
   return href ? (
      <a
         className={className}
         href={href}
         target={href.startsWith("http") ? "_blank" : undefined}
         rel="noreferrer"
      >
         {children}
      </a>
   ) : (
      <button className={className} type={type} onClick={onClick}>
         {children}
      </button>
   );
}

function SectionTitle({
   kicker,
   title,
   children,
}: {
   kicker?: string;
   title: string;
   children?: React.ReactNode;
}) {
   return (
      <header className="section-title" data-reveal>
         {kicker && <span className="kicker">{kicker}</span>}
         <h2>{title}</h2>
         {children && <p>{children}</p>}
         <div className="sprinkle-divider" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
            <i />
         </div>
      </header>
   );
}

/** Chispas de colores que caen (decoración). */
function Sprinkles({ count = 22 }: { count?: number }) {
   return (
      <div className="sprinkles" aria-hidden="true">
         {Array.from({ length: count }, (_, i) => (
            <i
               // biome-ignore lint/suspicious/noArrayIndexKey: lista decorativa estática
               key={i}
               style={
                  {
                     "--x": `${(i * 37 + 7) % 100}%`,
                     "--d": `${-((i * 0.83) % 7).toFixed(2)}s`,
                     "--t": `${5 + (i % 4) * 1.3}s`,
                     "--r": `${(i * 47) % 180}deg`,
                  } as React.CSSProperties
               }
            />
         ))}
      </div>
   );
}

function FotoCumple() {
   const [failed, setFailed] = useState(false);
   return (
      <div className="foto-cumple">
         <img
            src={failed ? dulce("helado-chocolate.svg") : img(config.imagenes.fotoCumple)}
            className={failed ? "is-fallback" : ""}
            alt=""
            onError={() => setFailed(true)}
         />
      </div>
   );
}

function Stamp({
   children,
   className = "",
}: {
   children: React.ReactNode;
   className?: string;
}) {
   return (
      <div className={`stamp ${className}`} aria-hidden="true">
         <span>{children}</span>
      </div>
   );
}

async function enviarConfirmacion(body: {
   nombre: string;
   asistira: boolean;
   mensaje: string;
}) {
   const endpoint = config.rsvpEndpoint;
   const isAppsScript = endpoint.includes("script.google.com");
   const response = await fetch(endpoint, {
      method: "POST",
      // Google Apps Script no permite CORS: se envía "a ciegas".
      mode: isAppsScript ? "no-cors" : "cors",
      headers: {
         "Content-Type": isAppsScript
            ? "text/plain;charset=utf-8"
            : "application/json",
      },
      body: JSON.stringify(body),
   });
   if (!isAppsScript && !response.ok) throw new Error("No se pudo guardar");
}

/* ------------------------------------------------------------------ */
/* Modales                                                             */
/* ------------------------------------------------------------------ */

function Modal({
   active,
   close,
   invitado,
   helado,
}: {
   active: "rsvp" | "dress" | "tips" | "gifts";
   close: () => void;
   invitado: Invitado | null;
   helado: Helado | null;
}) {
   const [status, setStatus] = useState<
      "idle" | "saving" | "success" | "error"
   >("idle");
   const titles = {
      rsvp: "¿Vienes a la fiesta?",
      dress: "Vestimenta",
      tips: "Tips dulces",
      gifts: "Regalos",
   };
   const copy = {
      dress: config.modales.vestimenta,
      tips: {
         titulo: config.modales.tips.titulo,
         texto: `La fiesta comienza a las ${horaTexto}. ${config.modales.tips.texto}`,
      },
      gifts: config.modales.regalos,
   };
   const icon = {
      rsvp: <Caramelo className="modal-dulce" color="#ff8fc7" />,
      dress: <Piruleta className="modal-dulce tall" />,
      tips: <Dona className="modal-dulce" />,
      gifts: <Caramelo className="modal-dulce" color="#c8a8ff" />,
   }[active];

   return (
      <div className="modal-backdrop" role="presentation" onMouseDown={close}>
         <div
            className="modal-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            onMouseDown={(e) => e.stopPropagation()}
         >
            <button className="modal-close" onClick={close} aria-label="Cerrar">
               ×
            </button>
            {icon}
            <h2 id="modal-title">{titles[active]}</h2>

            {active === "rsvp" && status !== "success" && (
               <form
                  onSubmit={async (e) => {
                     e.preventDefault();
                     setStatus("saving");
                     const formElement = e.currentTarget;
                     const form = new FormData(formElement);
                     const mensaje = String(form.get("mensaje") || "").trim();
                     const extra = helado
                        ? ` [Helado favorito: ${describirHelado(helado)}]`
                        : "";
                     try {
                        await enviarConfirmacion({
                           nombre: invitado
                              ? `${invitado.nombre} ${invitado.apellidos}`.trim()
                              : "Invitado sin código",
                           asistira: form.get("asistira") === "si",
                           mensaje: `${mensaje}${extra}`.trim(),
                        });
                        setStatus("success");
                        formElement.reset();
                        window.setTimeout(close, 3500);
                     } catch {
                        setStatus("error");
                     }
                  }}
               >
                  <fieldset>
                     <legend>¿Asistirás? *</legend>
                     <label className="choice">
                        <input type="radio" name="asistira" value="si" required />
                        <span>¡Sí, ahí estaré!</span>
                     </label>
                     <label className="choice">
                        <input type="radio" name="asistira" value="no" />
                        <span>No podré ir</span>
                     </label>
                  </fieldset>
                  <label>
                     Mensaje para {config.cumpleanero} (opcional)
                     <textarea
                        name="mensaje"
                        placeholder="Escríbele un mensaje bien dulce"
                     />
                  </label>
                  {helado && (
                     <p className="rsvp-helado">
                        🍦 Enviaremos también tu helado favorito:{" "}
                        <b>{describirHelado(helado)}</b>
                     </p>
                  )}
                  <Button type="submit">
                     {status === "saving" ? "ENVIANDO..." : "CONFIRMAR"}
                  </Button>
                  {status === "error" && (
                     <p className="form-status error" role="alert">
                        No se pudo guardar. Inténtalo nuevamente.
                     </p>
                  )}
               </form>
            )}
            {active === "rsvp" && status === "success" && (
               <div className="rsvp-success" role="status">
                  <Stamp className="stamp-confirmed">
                     ¡Dulce
                     <br />
                     confirmado!
                  </Stamp>
                  <p>¡Gracias! Tu respuesta fue guardada.</p>
               </div>
            )}

            {active !== "rsvp" && (
               <div className="modal-copy">
                  <p>{copy[active].titulo}</p>
                  <span>{copy[active].texto}</span>
               </div>
            )}
         </div>
      </div>
   );
}

/* ------------------------------------------------------------------ */
/* Arma tu helado                                                      */
/* ------------------------------------------------------------------ */

function ArmaTuHelado({
   helado,
   setHelado,
   listo,
   setListo,
}: {
   helado: Helado;
   setHelado: React.Dispatch<React.SetStateAction<Helado>>;
   listo: boolean;
   setListo: (v: boolean) => void;
}) {
   const elegir = (cambio: Partial<Helado>) => {
      setHelado((actual) => ({ ...actual, ...cambio }));
      setListo(false);
   };
   const guardar = () => {
      try {
         window.localStorage.setItem(HELADO_KEY, JSON.stringify(helado));
      } catch {
         /* sin almacenamiento: queda guardado en memoria */
      }
      setListo(true);
   };

   return (
      <div className="builder" data-reveal>
         <div className="builder-preview">
            <div className="builder-glow" aria-hidden="true" />
            <HeladoArmado {...helado} />
            {listo && (
               <Stamp className="stamp-helado">¡Listo!</Stamp>
            )}
         </div>
         <div className="builder-options">
            <fieldset>
               <legend>1. Elige el sabor</legend>
               <div className="chips">
                  {(Object.keys(SABORES) as Sabor[]).map((k) => (
                     <button
                        type="button"
                        key={k}
                        className={`chip ${helado.sabor === k ? "on" : ""}`}
                        aria-pressed={helado.sabor === k}
                        onClick={() => elegir({ sabor: k })}
                     >
                        <i style={{ background: SABORES[k].color }} />
                        {SABORES[k].label}
                     </button>
                  ))}
               </div>
            </fieldset>
            <fieldset>
               <legend>2. Elige la salsa</legend>
               <div className="chips">
                  {(Object.keys(SALSAS) as Salsa[]).map((k) => (
                     <button
                        type="button"
                        key={k}
                        className={`chip ${helado.salsa === k ? "on" : ""}`}
                        aria-pressed={helado.salsa === k}
                        onClick={() => elegir({ salsa: k })}
                     >
                        {SALSAS[k].color && (
                           <i style={{ background: SALSAS[k].color }} />
                        )}
                        {SALSAS[k].label}
                     </button>
                  ))}
               </div>
            </fieldset>
            <fieldset>
               <legend>3. Elige el topping</legend>
               <div className="chips">
                  {(Object.keys(TOPPINGS) as Topping[]).map((k) => (
                     <button
                        type="button"
                        key={k}
                        className={`chip ${helado.topping === k ? "on" : ""}`}
                        aria-pressed={helado.topping === k}
                        onClick={() => elegir({ topping: k })}
                     >
                        {TOPPINGS[k].label}
                     </button>
                  ))}
               </div>
            </fieldset>
            {listo ? (
               <p className="builder-done" role="status">
                  ¡Tu helado de <b>{describirHelado(helado)}</b> está listo para
                  la fiesta! Lo enviaremos con tu confirmación.
               </p>
            ) : (
               <Button variant="mint" onClick={guardar}>
                  ¡ESTE ES MI HELADO!
               </Button>
            )}
         </div>
      </div>
   );
}

/* ------------------------------------------------------------------ */
/* App                                                                 */
/* ------------------------------------------------------------------ */

function App() {
   const invitado = obtenerInvitado();
   const [modal, setModal] = useState<ModalName>("welcome");
   const [welcomeClosed, setWelcomeClosed] = useState(false);
   const [slide, setSlide] = useState<number | null>(null);
   const touchStartX = useRef<number | null>(null);
   const [musicOn, setMusicOn] = useState(false);
   const [isMusicPlaying, setIsMusicPlaying] = useState(false);
   const playerRef = useRef<YTPlayer | null>(null);
   const [time, setTime] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
   const [inicial] = useState(leerHelado);
   const [helado, setHelado] = useState<Helado>(inicial.helado);
   const [heladoListo, setHeladoListo] = useState(inicial.listo);
   const [gumball, setGumball] = useState(false);
   const gallery = galleryImages;

   useReveal();

   useEffect(() => {
      const tick = () => {
         const d = Math.max(0, fecha.getTime() - Date.now());
         setTime({
            days: Math.floor(d / 86400000),
            hours: Math.floor(d / 3600000) % 24,
            mins: Math.floor(d / 60000) % 60,
            secs: Math.floor(d / 1000) % 60,
         });
      };
      tick();
      const id = window.setInterval(tick, 1000);
      return () => window.clearInterval(id);
   }, []);

   const changeSlide = (direction: 1 | -1) => {
      setSlide((current) =>
         current === null
            ? null
            : (current + gallery.length + direction) % gallery.length,
      );
   };

   useEffect(() => {
      const key = (e: KeyboardEvent) => {
         if (e.key === "Escape") {
            if (modal === "welcome") setWelcomeClosed(true);
            setModal(null);
            setSlide(null);
         }
         if (slide === null) return;
         if (e.key === "ArrowLeft") changeSlide(-1);
         if (e.key === "ArrowRight") changeSlide(1);
      };
      window.addEventListener("keydown", key);
      return () => window.removeEventListener("keydown", key);
   });

   useEffect(() => {
      if (!welcomeClosed) return;
      const id = window.setTimeout(() => {
         setModal((current) => (current === null ? "tips" : current));
      }, 25000);
      return () => window.clearTimeout(id);
   }, [welcomeClosed]);

   const open = (name: ModalName) => setModal(name);

   const tirarPalanca = () => {
      if (gumball) return;
      setGumball(true);
      window.setTimeout(() => {
         setGumball(false);
         open("rsvp");
      }, 1200);
   };

   const enter = (withMusic: boolean) => {
      setMusicOn(hasMusic);
      setIsMusicPlaying(withMusic && hasMusic);
      setWelcomeClosed(true);
      setModal(null);
   };

   const toggleMusic = () => {
      const next = !isMusicPlaying;
      setIsMusicPlaying(next);
      if (!playerRef.current) return;
      if (next) playerRef.current.playVideo();
      else playerRef.current.pauseVideo();
   };

   // biome-ignore lint/correctness/useExhaustiveDependencies: el reproductor se crea una sola vez al ingresar
   useEffect(() => {
      if (!musicOn || !hasMusic) return;
      const setupPlayer = () => {
         const container = document.getElementById("music-player-container");
         if (!container || !window.YT?.Player) return;
         playerRef.current = new window.YT.Player(container, {
            height: "1",
            width: "1",
            videoId: config.youtubeVideoId,
            playerVars: {
               autoplay: isMusicPlaying ? 1 : 0,
               loop: 1,
               playlist: config.youtubeVideoId,
               controls: 0,
               rel: 0,
               playsinline: 1,
            },
            events: {
               onReady: (event) => {
                  if (isMusicPlaying) event.target.playVideo();
               },
               onStateChange: (event) => {
                  setIsMusicPlaying(
                     event.data === window.YT?.PlayerState?.PLAYING,
                  );
               },
            },
         });
      };
      if (window.YT?.Player) {
         setupPlayer();
      } else {
         if (
            !document.querySelector(
               'script[src="https://www.youtube.com/iframe_api"]',
            )
         ) {
            const tag = document.createElement("script");
            tag.src = "https://www.youtube.com/iframe_api";
            document.body.appendChild(tag);
         }
         window.onYouTubeIframeAPIReady = setupPlayer;
      }
      return () => {
         playerRef.current?.destroy();
         playerRef.current = null;
         window.onYouTubeIframeAPIReady = undefined;
      };
   }, [musicOn]);

   const handleTouchStart = (event: React.TouchEvent) => {
      touchStartX.current = event.touches[0]?.clientX ?? null;
   };
   const handleTouchEnd = (event: React.TouchEvent) => {
      if (touchStartX.current === null) return;
      const distance = event.changedTouches[0].clientX - touchStartX.current;
      touchStartX.current = null;
      if (Math.abs(distance) < 45) return;
      changeSlide(distance < 0 ? 1 : -1);
   };

   const mainStyle = {
      "--fotocumple": `url("${img(config.imagenes.fotoCumple)}")`,
   } as React.CSSProperties;

   const macarons = [
      [time.days, "días", "#ff8fc7"],
      [time.hours, "horas", "#9be8d4"],
      [time.mins, "min", "#c8a8ff"],
      [time.secs, "seg", "#ffe89a"],
   ] as const;

   return (
      <main style={mainStyle}>
         {musicOn && hasMusic && (
            <>
               <div className="hidden-music-player" aria-hidden="true">
                  <div id="music-player-container" />
               </div>
               <button
                  type="button"
                  className="music-toggle"
                  onClick={toggleMusic}
                  aria-label={
                     isMusicPlaying ? "Pausar música" : "Reproducir música"
                  }
               >
                  {isMusicPlaying ? "❚❚" : "▶"}
               </button>
            </>
         )}

         {/* ---------------- PORTADA ---------------- */}
         <section className="hero" id="inicio">
            <Sprinkles />
            <Algodon className="algodon-1" />
            <Algodon className="algodon-2" color="#e6d6ff" />
            <Algodon className="algodon-3" color="#d4f5ec" />
            <Piruleta className="hero-piruleta" />
            <Piruleta className="hero-piruleta-2" colors={["#9be8d4", "#fff"]} />
            <div className="hero-content">
               <span className="hero-tag">Bienvenidos al {config.mundo}</span>
               <h1>{config.nombre}</h1>
               <p className="hero-age">{config.edadTexto} más dulces</p>
               <p className="hero-date">{fechaCorta}</p>
            </div>
            <img
               className="hero-casita"
               src={dulce("casita-dulces.svg")}
               alt=""
            />
         </section>

         <div className="content">
            {/* ---------------- INTRO ---------------- */}
            <section className="intro">
               <Glaseado color="#ffe9f4" className="glaseado-top" />
               <Caramelo className="intro-caramelo-1" color="#ffe89a" />
               <Caramelo className="intro-caramelo-2" color="#c8a8ff" />
               <div className="intro-grid">
                  <div className="intro-photo" data-reveal>
                     <FotoCumple />
                  </div>
                  <div className="intro-copy" data-reveal>
                     <span className="kicker">
                        ¡{config.nombre} cumple {config.edad}{" "}
                        {config.edad === 1 ? "añito" : "añitos"}!
                     </span>
                     <p className="quote">{config.frase}</p>
                     <ul className="facts">
                        <li>
                           <strong>{config.edad}</strong>
                           {config.edad === 1 ? "año" : "años"} de dulzura
                        </li>
                        <li>
                           <strong>
                              {(config.edad * 365).toLocaleString("es-PE")}
                           </strong>
                           días de sonrisas
                        </li>
                        <li>
                           <strong>∞</strong>
                           caramelos de amor
                        </li>
                     </ul>
                  </div>
               </div>

               <div className="countdown" data-reveal>
                  <span className="kicker">Faltan</span>
                  <div className="macarons">
                     {macarons.map(([n, label, color]) => (
                        <div className="macaron-box" key={label}>
                           <Macaron color={color} />
                           <strong>{pad(n)}</strong>
                           <small>{label}</small>
                        </div>
                     ))}
                  </div>
                  <div className="shelf" aria-hidden="true" />
               </div>
            </section>

            {/* ---------------- BOLETO DORADO ---------------- */}
            <section className="ticket-section">
               <Glaseado color="#fff6fb" className="glaseado-top" />
               <SectionTitle kicker="Pase especial" title="Tu boleto dorado">
                  Tu presencia es lo más importante. ¡No faltes!
               </SectionTitle>
               <div className="ticket" data-reveal>
                  <div className="ticket-shine" aria-hidden="true" />
                  <img
                     className="ticket-galleta"
                     src={dulce("galleta-jengibre.svg")}
                     alt=""
                  />
                  <div className="ticket-body">
                     <span className="ticket-label">
                        Boleto dorado · {config.mundo}
                     </span>
                     <p className="ticket-name">
                        {invitado
                           ? `${invitado.nombre} ${invitado.apellidos}`.trim()
                           : "Invitado especial"}
                     </p>
                     <dl>
                        <div>
                           <dt>Lugar</dt>
                           <dd>{config.lugar}</dd>
                        </div>
                        <div>
                           <dt>Fecha</dt>
                           <dd>
                              {fechaCorta} · {horaTexto}
                           </dd>
                        </div>
                        <div>
                           <dt>Código</dt>
                           <dd>{invitado?.codigoInvitacion ?? "DULCE"}</dd>
                        </div>
                     </dl>
                  </div>
                  <Stamp className="stamp-ticket">Admitido</Stamp>
               </div>
            </section>

            {/* ---------------- ARMA TU HELADO ---------------- */}
            <section className="ice-section">
               <Glaseado color="#ffe3f1" className="glaseado-top" />
               <SectionTitle kicker="Juego dulce" title="Arma tu helado">
                  Elige tu combinación favorita y te la tendremos lista en la
                  fiesta.
               </SectionTitle>
               <ArmaTuHelado
                  helado={helado}
                  setHelado={setHelado}
                  listo={heladoListo}
                  setListo={setHeladoListo}
               />
            </section>

            {/* ---------------- CELEBRACIÓN (FRASCOS) ---------------- */}
            <section className="celebration" id="celebracion">
               <SectionTitle kicker="Detalles" title="Celebración">
                  Será un día inolvidable y queremos vivirlo contigo.
               </SectionTitle>
               <div className="jars">
                  <article className="jar jar-pink" data-reveal>
                     <div className="jar-lid" aria-hidden="true" />
                     <div className="jar-glass">
                        <div className="jar-label">
                           <Icon name="calendar" />
                           <h3>Día</h3>
                           <p>
                              {diaTexto}
                              <br />
                              {horaTexto}
                           </p>
                           <Button href={calendarUrl}>AGENDAR</Button>
                        </div>
                     </div>
                  </article>
                  <article className="jar jar-mint" data-reveal>
                     <div className="jar-lid" aria-hidden="true" />
                     <div className="jar-glass">
                        <div className="jar-label">
                           <Icon name="check" />
                           <h3>Lugar</h3>
                           <p>{config.lugar}</p>
                           <Button variant="mint" onClick={() => open("rsvp")}>
                              CONFIRMAR
                           </Button>
                        </div>
                     </div>
                  </article>
                  <article className="jar jar-lilac" data-reveal>
                     <div className="jar-lid" aria-hidden="true" />
                     <div className="jar-glass">
                        <div className="jar-label">
                           <Icon name="pin" />
                           <h3>Dirección</h3>
                           <p>
                              {config.direccion}
                              {config.referencia && (
                                 <small className="jar-ref">
                                    {config.referencia}
                                 </small>
                              )}
                           </p>
                           <Button variant="choco" href={config.mapsUrl}>
                              ¿CÓMO LLEGAR?
                           </Button>
                        </div>
                     </div>
                  </article>
               </div>
            </section>

            {/* ---------------- ITINERARIO (MENÚ) ---------------- */}
            <section className="itinerary" id="itinerario">
               <SectionTitle kicker="Carta de la fiesta" title="Menú del día">
                  Cada momento, un postre delicioso.
               </SectionTitle>
               <div className="menu" data-reveal>
                  <img
                     className="menu-cupcake"
                     src={dulce("cupcake-cumple.svg")}
                     alt=""
                  />
                  <h3 className="menu-title">{config.mundo}</h3>
                  <ol>
                     {eventos.map((item) => (
                        <li key={`${item.hour}-${item.event}`}>
                           <time>{item.hour}</time>
                           <span className="menu-event">{item.event}</span>
                           <span className="menu-dots" aria-hidden="true" />
                           <span className="menu-price">
                              {item.sonrisas ?? 100} sonrisas
                           </span>
                        </li>
                     ))}
                  </ol>
                  <p className="menu-foot">* Todos los precios se pagan con abrazos.</p>
               </div>
            </section>

            {/* ---------------- MÁQUINA DE CHICLES (RSVP) ---------------- */}
            <section className={`rsvp-banner ${gumball ? "dropping" : ""}`}>
               <Glaseado color="#f6efff" className="glaseado-top" />
               <div className="rsvp-grid">
                  <div className="gumball" aria-hidden="true">
                     <div className="gumball-globe">
                        {[
                           "#ff8fc7",
                           "#9be8d4",
                           "#c8a8ff",
                           "#ffe89a",
                           "#ff8fc7",
                           "#9be8d4",
                           "#ffe89a",
                           "#c8a8ff",
                           "#ff8fc7",
                           "#9be8d4",
                           "#c8a8ff",
                           "#ffe89a",
                        ].map((c, i) => (
                           <i
                              // biome-ignore lint/suspicious/noArrayIndexKey: bolas decorativas estáticas
                              key={i}
                              style={{ background: c }}
                           />
                        ))}
                     </div>
                     <div className="gumball-base">
                        <span className="gumball-lever" />
                        <span className="gumball-slot" />
                     </div>
                     <i className="gumball-drop" />
                  </div>
                  <div className="rsvp-copy" data-reveal>
                     <h2>¡Confirma tu asistencia!</h2>
                     <p>
                        Gira la palanca de la máquina de chicles y cuéntanos si
                        vienes a endulzar la fiesta.
                     </p>
                     <Button onClick={tirarPalanca}>
                        {gumball ? "¡AHÍ VA…!" : "GIRAR LA PALANCA"}
                     </Button>
                  </div>
               </div>
            </section>

            {/* ---------------- GALERÍA (CARAMELOS) ---------------- */}
            {gallery.length > 0 && (
               <section className="gallery" id="galeria">
                  <SectionTitle kicker="Recuerdos" title={config.galeria.titulo}>
                     {config.galeria.subtitulo}
                  </SectionTitle>
                  <div className="wrapped">
                     {gallery.map((src, i) => (
                        <button
                           type="button"
                           className="wrapped-photo"
                           key={src}
                           onClick={() => setSlide(i)}
                           aria-label={`Ver foto ${i + 1} en grande`}
                        >
                           <img src={src} alt="" loading="lazy" />
                        </button>
                     ))}
                  </div>
               </section>
            )}

            {slide !== null && gallery.length > 0 && (
               <div
                  className="lightbox"
                  role="dialog"
                  aria-modal="true"
                  aria-label={`Foto ${slide + 1} de ${gallery.length}`}
                  onMouseDown={(e) => {
                     if (e.target === e.currentTarget) setSlide(null);
                  }}
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
               >
                  <button
                     type="button"
                     className="lightbox-close"
                     onClick={() => setSlide(null)}
                     aria-label="Cerrar foto ampliada"
                  >
                     ×
                  </button>
                  <button
                     type="button"
                     className="lightbox-nav prev"
                     onClick={() => changeSlide(-1)}
                     aria-label="Foto anterior"
                  >
                     ‹
                  </button>
                  <img src={gallery[slide]} alt={`Foto ${slide + 1}`} />
                  <button
                     type="button"
                     className="lightbox-nav next"
                     onClick={() => changeSlide(1)}
                     aria-label="Foto siguiente"
                  >
                     ›
                  </button>
                  <span className="lightbox-counter">
                     {slide + 1} / {gallery.length}
                  </span>
               </div>
            )}

            {/* ---------------- ANTES DE LA FIESTA ---------------- */}
            <section className="party" id="fiesta">
               <SectionTitle kicker="Ingredientes" title="Antes de la fiesta">
                  Todo lo que necesitas para un día delicioso.
               </SectionTitle>
               <div className="party-grid">
                  <article className="party-card" data-reveal>
                     <Piruleta className="party-dulce tall" colors={["#c8a8ff", "#fff"]} />
                     <h3>Vestimenta</h3>
                     <p>¿Qué me pongo?</p>
                     <Button onClick={() => open("dress")}>+ INFO</Button>
                  </article>
                  <article className="party-card" data-reveal>
                     <Dona className="party-dulce" />
                     <h3>Tips</h3>
                     <p>Información útil</p>
                     <Button variant="mint" onClick={() => open("tips")}>
                        + INFO
                     </Button>
                  </article>
                  <article className="party-card" data-reveal>
                     <img
                        className="party-dulce trufa"
                        src={dulce("trufa.svg")}
                        alt=""
                     />
                     <h3>Regalos</h3>
                     <p>Si deseas obsequiarme</p>
                     <Button variant="choco" onClick={() => open("gifts")}>
                        + INFO
                     </Button>
                  </article>
               </div>
            </section>

            {/* ---------------- COMPARTE FOTOS ---------------- */}
            <section className="photos-section">
               <Glaseado color="#fff8e1" className="glaseado-top" />
               <div className="photos-inner" data-reveal>
                  <Icon name="camera" />
                  <h2>Captura cada momento dulce</h2>
                  <p>Comparte tus fotos y videos de este día tan especial</p>
                  {config.fotos.albumUrl ? (
                     <a
                        className="hashtag"
                        href={config.fotos.albumUrl}
                        target="_blank"
                        rel="noreferrer"
                     >
                        <strong>{config.fotos.hashtag}</strong>
                        <span>COMPARTE TUS FOTOS AQUÍ</span>
                     </a>
                  ) : (
                     <strong className="hashtag">{config.fotos.hashtag}</strong>
                  )}
               </div>
            </section>

            {/* ---------------- PIE ---------------- */}
            <footer>
               <Glaseado color="#ff8fc7" className="glaseado-top" />
               <div className="footer-sweets" aria-hidden="true">
                  <img src={dulce("helado-vainilla.svg")} alt="" />
                  <img src={dulce("cupcake-cumple.svg")} alt="" />
                  <img src={dulce("helado-chocolate.svg")} alt="" />
               </div>
               <p className="footer-cierre">{config.cierre}</p>
               <h2>{config.nombre}</h2>
               <p className="footer-age">{config.edadTexto}</p>
               <nav>
                  <button type="button" onClick={() => open("rsvp")}>
                     Confirmar asistencia
                  </button>
                  <a href="#celebracion">Agendar celebración</a>
               </nav>
               <div className="candy-fence" aria-hidden="true" />
               <small>
                  Desarrollado con <Icon name="heart" /> por{" "}
                  <b>{config.creditos}</b>
               </small>
            </footer>
         </div>

         {/* ---------------- BIENVENIDA ---------------- */}
         {modal === "welcome" && (
            <div className="modal-backdrop welcome" role="presentation">
               <div
                  className="modal-card welcome-card"
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="welcome-title"
               >
                  <img
                     className="welcome-cupcake"
                     src={dulce("cupcake-cumple.svg")}
                     alt=""
                  />
                  <p>¡Hola! Bienvenido al {config.mundo} de</p>
                  <h2 id="welcome-title">{config.nombre}</h2>
                  {hasMusic ? (
                     <>
                        <span>La música es el ingrediente secreto</span>
                        <Button onClick={() => enter(true)}>
                           ENTRAR CON MÚSICA
                        </Button>
                        <button
                           type="button"
                           className="text-button"
                           onClick={() => enter(false)}
                        >
                           Entrar sin música
                        </button>
                     </>
                  ) : (
                     <Button onClick={() => enter(false)}>
                        ¡ENTRAR AL MUNDO DULCE!
                     </Button>
                  )}
               </div>
            </div>
         )}
         {modal && modal !== "welcome" && (
            <Modal
               active={modal}
               close={() => setModal(null)}
               invitado={invitado}
               helado={heladoListo ? helado : null}
            />
         )}
      </main>
   );
}

export default App;
