/**
 * Ilustraciones propias en SVG (estilo kawaii) para el Mundo de Caramelo.
 */

const INK = "#5a3328";

function Carita({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
   return (
      <g transform={`translate(${x} ${y}) scale(${s})`}>
         <circle cx={-9} cy={0} r={3.2} fill={INK} />
         <circle cx={9} cy={0} r={3.2} fill={INK} />
         <circle cx={-8} cy={-1.2} r={1.1} fill="#fff" />
         <circle cx={10} cy={-1.2} r={1.1} fill="#fff" />
         <ellipse cx={-15} cy={6} rx={4} ry={2.4} fill="#ff7fa8" opacity={0.6} />
         <ellipse cx={15} cy={6} rx={4} ry={2.4} fill="#ff7fa8" opacity={0.6} />
         <path
            d="M-4 5 q4 4 8 0"
            fill="none"
            stroke={INK}
            strokeWidth={2}
            strokeLinecap="round"
         />
      </g>
   );
}

/** Piruleta en espiral. */
export function Piruleta({
   className = "",
   colors = ["#ff8fc7", "#fff"],
}: {
   className?: string;
   colors?: [string, string];
}) {
   return (
      <svg className={`dulce ${className}`} viewBox="0 0 100 160" aria-hidden="true">
         <rect x={46} y={80} width={8} height={78} rx={4} fill="#f3e3d3" />
         <circle cx={50} cy={50} r={44} fill={colors[1]} />
         <path
            d="M50 50 m0 -6 a6 6 0 1 1 -6 6 a12 12 0 1 1 12 12 a18 18 0 1 1 -18 -18 a24 24 0 1 1 24 24 a30 30 0 1 1 -30 -30 a36 36 0 1 1 36 36"
            fill="none"
            stroke={colors[0]}
            strokeWidth={7}
            strokeLinecap="round"
         />
         <circle cx={50} cy={50} r={44} fill="none" stroke="#e86fa8" strokeWidth={3} />
         <ellipse cx={32} cy={26} rx={10} ry={5} fill="#fff" opacity={0.6} transform="rotate(-35 32 26)" />
      </svg>
   );
}

/** Caramelo envuelto. */
export function Caramelo({
   className = "",
   color = "#9be8d4",
}: {
   className?: string;
   color?: string;
}) {
   return (
      <svg className={`dulce ${className}`} viewBox="0 0 160 80" aria-hidden="true">
         <path d="M40 40 L6 14 Q2 40 6 66 Z" fill={color} stroke="#fff" strokeWidth={3} strokeLinejoin="round" />
         <path d="M120 40 L154 14 Q158 40 154 66 Z" fill={color} stroke="#fff" strokeWidth={3} strokeLinejoin="round" />
         <ellipse cx={80} cy={40} rx={44} ry={30} fill={color} />
         <path d="M56 16 q-6 24 0 48 M80 10 q-6 30 0 60 M104 16 q-6 24 0 48" stroke="#fff" strokeWidth={6} opacity={0.6} fill="none" />
         <Carita x={80} y={40} s={0.9} />
      </svg>
   );
}

/** Dona con chispas. */
export function Dona({ className = "" }: { className?: string }) {
   const chispas = [
      [30, 34, 20, "#9be8d4"],
      [62, 26, -30, "#ffe89a"],
      [76, 48, 60, "#c8a8ff"],
      [70, 72, 10, "#9be8d4"],
      [36, 70, -50, "#ffe89a"],
      [24, 54, 80, "#fff"],
      [48, 22, 0, "#fff"],
   ] as const;
   return (
      <svg className={`dulce ${className}`} viewBox="0 0 100 100" aria-hidden="true">
         <circle cx={50} cy={52} r={44} fill="#e8b27a" />
         <path
            d="M50 12 a40 40 0 0 1 40 38 q-6 8 -10 2 q-4 10 -10 4 q-6 10 -12 2 q-6 8 -12 0 q-6 8 -12 -2 q-8 6 -10 -6 q-6 2 -6 -6 A40 40 0 0 1 50 12Z"
            fill="#ff8fc7"
         />
         <circle cx={50} cy={50} r={13} fill="#fff6fb" />
         {chispas.map(([x, y, r, c]) => (
            <rect key={`${x}-${y}`} x={x} y={y} width={10} height={3.6} rx={1.8} fill={c} transform={`rotate(${r} ${x + 5} ${y + 2})`} />
         ))}
         <Carita x={50} y={78} s={0.75} />
      </svg>
   );
}

/** Macaron de color (para la cuenta regresiva). */
export function Macaron({
   className = "",
   color = "#ff8fc7",
}: {
   className?: string;
   color?: string;
}) {
   return (
      <svg className={`dulce ${className}`} viewBox="0 0 120 90" aria-hidden="true">
         <ellipse cx={60} cy={66} rx={52} ry={18} fill={color} />
         <rect x={10} y={40} width={100} height={18} rx={9} fill="#fff6e8" />
         <path d="M12 46 q6 6 12 0 q6 6 12 0 q6 6 12 0 q6 6 12 0 q6 6 12 0 q6 6 12 0 q6 6 12 0 q6 6 12 0" stroke="#fff6e8" strokeWidth={6} fill="none" />
         <ellipse cx={60} cy={30} rx={52} ry={26} fill={color} />
         <ellipse cx={40} cy={18} rx={14} ry={5} fill="#fff" opacity={0.45} />
      </svg>
   );
}

/** Nube de algodón de azúcar. */
export function Algodon({
   className = "",
   color = "#ffd1ea",
}: {
   className?: string;
   color?: string;
}) {
   return (
      <svg className={`algodon ${className}`} viewBox="0 0 200 100" aria-hidden="true">
         <g fill={color}>
            <circle cx={50} cy={62} r={30} />
            <circle cx={90} cy={44} r={38} />
            <circle cx={136} cy={56} r={32} />
            <circle cx={166} cy={70} r={22} />
            <rect x={30} y={60} width={150} height={32} rx={16} />
         </g>
         <circle cx={78} cy={30} r={10} fill="#fff" opacity={0.5} />
      </svg>
   );
}

/** Borde de glaseado que gotea (separador entre secciones). */
export function Glaseado({
   color,
   className = "",
}: {
   color: string;
   className?: string;
}) {
   return (
      <svg
         className={`glaseado ${className}`}
         viewBox="0 0 1440 90"
         preserveAspectRatio="none"
         aria-hidden="true"
      >
         <path
            fill={color}
            d="M0 0 H1440 V30 C1420 30 1416 58 1400 58 C1384 58 1384 30 1360 30 H1250 C1230 30 1228 80 1208 80 C1188 80 1188 30 1166 30 H1010 C990 30 990 64 972 64 C954 64 954 30 934 30 H780 C760 30 758 86 738 86 C718 86 718 30 696 30 H540 C520 30 520 60 502 60 C484 60 484 30 464 30 H300 C280 30 278 76 258 76 C238 76 238 30 216 30 H100 C80 30 80 54 64 54 C48 54 48 30 30 30 H0 Z"
         />
      </svg>
   );
}

/* ------------------------------------------------------------------ */
/* Helado armable                                                       */
/* ------------------------------------------------------------------ */

export const SABORES = {
   fresa: { label: "Fresa", color: "#ff9cc2", sombra: "#f07aa8" },
   chocolate: { label: "Chocolate", color: "#8a5a3c", sombra: "#6b3e2e" },
   vainilla: { label: "Vainilla", color: "#fff1c1", sombra: "#f2d98e" },
   menta: { label: "Menta", color: "#9be8d4", sombra: "#6fd0b8" },
   mora: { label: "Mora", color: "#c8a8ff", sombra: "#a684ef" },
} as const;

export const SALSAS = {
   ninguna: { label: "Sin salsa", color: "" },
   chocolate: { label: "Chocolate", color: "#5a3328" },
   caramelo: { label: "Caramelo", color: "#e7a03c" },
   fresa: { label: "Fresa", color: "#e8436f" },
} as const;

export const TOPPINGS = {
   chispas: { label: "Chispas" },
   cereza: { label: "Cereza" },
   estrellas: { label: "Estrellas" },
   galleta: { label: "Galleta" },
} as const;

export type Sabor = keyof typeof SABORES;
export type Salsa = keyof typeof SALSAS;
export type Topping = keyof typeof TOPPINGS;

export function HeladoArmado({
   sabor,
   salsa,
   topping,
   className = "",
}: {
   sabor: Sabor;
   salsa: Salsa;
   topping: Topping;
   className?: string;
}) {
   const s = SABORES[sabor];
   const salsaColor = SALSAS[salsa].color;
   return (
      <svg className={`helado-armado ${className}`} viewBox="0 0 200 270" aria-hidden="true">
         {/* Cono */}
         <path d="M52 132 L100 262 L148 132 Z" fill="#e9b26b" stroke="#c98a45" strokeWidth={3} strokeLinejoin="round" />
         <g stroke="#c98a45" strokeWidth={2.5} opacity={0.8}>
            <path d="M66 132 L118 214 M84 132 L126 196 M102 132 L134 176 M120 132 L140 158" />
            <path d="M134 132 L82 214 M116 132 L74 196 M98 132 L66 176 M80 132 L60 158" />
         </g>
         {/* Bola */}
         <path
            key={sabor}
            className="bola"
            d="M42 128 C30 128 30 108 44 104 C40 62 76 40 100 40 C124 40 160 62 156 104 C170 108 170 128 158 128 C150 140 138 128 130 136 C120 144 110 130 100 138 C90 130 80 144 70 136 C62 128 50 140 42 128 Z"
            fill={s.color}
            stroke={s.sombra}
            strokeWidth={3}
         />
         {/* Salsa */}
         {salsaColor && (
            <path
               key={salsa}
               className="salsa"
               d="M58 70 C74 50 126 50 142 70 C146 80 140 84 136 82 C134 96 126 96 126 84 C120 90 114 88 112 82 C108 100 98 100 98 84 C92 90 86 88 84 82 C80 94 70 94 70 82 C64 86 56 82 58 70 Z"
               fill={salsaColor}
            />
         )}
         <Carita x={100} y={100} s={1.2} />
         {/* Topping */}
         <g key={topping} className="topping">
            {topping === "chispas" &&
               (
                  [
                     [70, 62, 30, "#ff8fc7"],
                     [92, 50, -20, "#9be8d4"],
                     [118, 56, 50, "#ffe89a"],
                     [130, 74, -40, "#c8a8ff"],
                     [80, 78, 70, "#9be8d4"],
                     [106, 70, 10, "#ff8fc7"],
                  ] as const
               ).map(([x, y, r, c]) => (
                  <rect key={`${x}-${y}`} x={x} y={y} width={12} height={4.5} rx={2.2} fill={c} transform={`rotate(${r} ${x + 6} ${y + 2})`} />
               ))}
            {topping === "cereza" && (
               <>
                  <path d="M102 34 q8 -22 22 -26" fill="none" stroke="#4f8a3c" strokeWidth={3} strokeLinecap="round" />
                  <circle cx={100} cy={40} r={14} fill="#e8263b" />
                  <ellipse cx={95} cy={34} rx={4} ry={2.5} fill="#fff" opacity={0.7} />
               </>
            )}
            {topping === "estrellas" &&
               (
                  [
                     [76, 60, "#ffe89a"],
                     [112, 52, "#fff"],
                     [132, 76, "#ffe89a"],
                     [92, 78, "#fff"],
                  ] as const
               ).map(([x, y, c]) => (
                  <path
                     key={`${x}-${y}`}
                     d={`M${x} ${y - 8} l2.4 5.2 5.6 .6 -4.2 3.8 1.2 5.6 -5 -2.9 -5 2.9 1.2 -5.6 -4.2 -3.8 5.6 -.6Z`}
                     fill={c}
                     stroke="#e7a03c"
                     strokeWidth={1.2}
                  />
               ))}
            {topping === "galleta" && (
               <g transform="rotate(-18 120 46)">
                  <rect x={104} y={14} width={34} height={52} rx={5} fill="#c98a45" />
                  <g fill="#8a5a3c">
                     <circle cx={112} cy={26} r={2} />
                     <circle cx={128} cy={30} r={2} />
                     <circle cx={116} cy={44} r={2} />
                     <circle cx={130} cy={52} r={2} />
                  </g>
               </g>
            )}
         </g>
      </svg>
   );
}
