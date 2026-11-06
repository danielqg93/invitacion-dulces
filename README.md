# Invitación digital — Mundo de Caramelo

Invitación de cumpleaños de una sola página (React + Vite + TypeScript) con temática de
dulces, helados y postres: chispas que caen, glaseado que gotea, boleto dorado, un juego
para **armar tu helado** (se envía con la confirmación), cuenta regresiva en macarons,
menú de pastelería y máquina de chicles.

## 1. Editar los datos

Todo está en **`src/config.ts`** (busca `TODO`): `EDAD`, `nombre`, `cumpleanero`,
`fechaEvento` (**el mes empieza en 0**), `lugar`, `direccion`, `mapsUrl`,
`youtubeVideoId`, `rsvpEndpoint`, textos de galería, hashtag y modales.
Actualiza también `<title>` y las etiquetas `og:` en `index.html`.

## 2. Imágenes

Ver `public/img/LEEME.txt`. Licencias en `CREDITOS.md`.

## 3. Invitados e itinerario

- `db/invitados.json` → link personal: `https://danielqg93.github.io/invitacion-dulces/#/CODIGO`
- `db/itinerario.json` → cada actividad admite `"sonrisas"` (el "precio" en el menú).

## 4. Arma tu helado

El invitado elige sabor, salsa y topping. Al guardar, su combinación se agrega al mensaje
de la confirmación (por ejemplo: `[Helado favorito: Fresa con salsa de chocolate y chispas]`).

## 5. Confirmaciones

- **Local y Netlify:** `rsvpEndpoint: "/api/confirmaciones"`.
- **GitHub Pages:** usa la URL de tu propio Google Apps Script.

## Comandos

```bash
bun install
bun run dev      # http://localhost:5173/invitacion-dulces/
bun run lint
bun run build
```
