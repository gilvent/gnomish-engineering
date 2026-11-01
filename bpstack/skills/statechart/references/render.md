# Render a chart

Render each `.mmd` file that you show with the npm package `pele@1.9.0`, and give the user the SVG. Write each SVG next to its `.mmd` file, with the same name. The API is at https://pele.run/api. When Pele throws a `PeleError`, show the user the Mermaid text and the error.

The chart uses the highlighter design: each state is a swipe of marker behind handwriting, in the font Shantell Sans, with hand-drawn arrows. Each SVG has all of this in it, so it needs no other file, and it follows the light or dark setting of the viewer.

## Render

Install these packages once, outside the repo:

```sh
npm install pele@1.9.0 @fontsource/shantell-sans@5.3.0 opentype.js@1.3.4
```

Save the CSS from **Design** as `highlighter.css`, the filters from **Design** as `highlighter-defs.svg`, and this script as `render.mjs` in the same folder. Run `node render.mjs CHART.mmd highlighter.css highlighter-defs.svg CHART.svg`.

```js
import fs from "node:fs";
import { createRequire } from "node:module";
import opentype from "opentype.js";
import { render } from "pele";

const fontFile = createRequire(import.meta.url).resolve(
  "@fontsource/shantell-sans/files/shantell-sans-latin-400-normal.woff",
);
const bytes = fs.readFileSync(fontFile);
const font = opentype.parse(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.length));

const { svg } = render(fs.readFileSync(process.argv[2], "utf8"), {
  limit: 1_000_000,
  outputLimit: 8_000_000,
  maxEdges: 10_000,
  measurer: { width: (text, size) => font.getAdvanceWidth(text, size) },
  fontFamily: "Shantell Sans",
  fontSize: 17,
});

const fontFace = `@font-face { font-family: "Shantell Sans"; src: url(data:font/woff;base64,${bytes.toString("base64")}) format("woff"); }`;
const style = `<style>${fontFace}\n${fs.readFileSync(process.argv[3], "utf8")}</style>`;
const defs = fs.readFileSync(process.argv[4], "utf8");
const rootEnd = svg.indexOf(">") + 1;
fs.writeFileSync(process.argv[5], svg.slice(0, rootEnd) + style + defs + svg.slice(rootEnd));
```

The script does these things:

- It passes the render limits, because Pele's defaults are smaller than a chart of 500 states can be.
- It measures text with the real font, because Pele cannot measure a font in Node. Without the `measurer`, labels do not fit their boxes.
- It puts the font in the SVG, so that the chart looks the same on a computer that does not have the font. The file is about 100 KB larger. The font has Latin letters only.
- It puts the `<style>` and the filters first in the SVG.

## Design

Pele ignores Mermaid `theme` and `themeVariables`. Set its `--pele-*` CSS variables on `.pele`. https://pele.run/theming lists them. The command gives each state the color class of its group, such as `class sN teal`. It marks each bad state with `class sN breaks` or `class sN mayBreak`, each state on the shortest path to a bug with `class sN bugPath`, and each state that a PROPERTY counterexample repeats forever with `class sN repeats`. Pele puts these classes on the state's node. Color the classes with CSS.

The `.mmd` file has a `classDef` line for `breaks` and for `mayBreak`, so that any Mermaid viewer shows the bug marks. It has no `classDef` for the group colors, `bugPath`, or `repeats`. Pele writes each `classDef` color as a `style` attribute on the node, and a `style` attribute wins over a normal CSS rule. So the rules for the marks below use `!important`. Without it, a dark theme keeps the light mark colors. A bug mark sets the swipe color and the text, and `bugPath` and `repeats` set a pen line around the swipe. Put the mark rules after the group colors, so that a mark shows over the group color. A state with no group gets the yellow swipe of `--pele-surface`.

The CSS hides the boxes that Pele draws around the regions and the Legend, and keeps their titles.

```css
.pele {
  --pele-bg: #ffffff; --pele-fg: #1d1f24; --pele-muted: #4c5059; --pele-line: #1d1f24;
  --pele-surface: #fff27a; --pele-surface-alt: transparent; --pele-border: transparent;
  --pele-font: "Shantell Sans", "Trebuchet MS", sans-serif;
  background: var(--pele-bg);
}
.pele .pele-edges { filter: url(#hl-line); stroke-width: 1.8px; }
.pele .pele-edges .pele-marker { stroke: none; }
.pele .pele-edge-label rect { fill-opacity: 0.88; }
.pele .pele-edge-label text { fill: var(--pele-muted); }
.pele .pele-cluster rect, .pele .pele-cluster > path { fill: none !important; stroke: none !important; }
.pele .pele-node rect { stroke: none; filter: url(#hl-swipe); mix-blend-mode: multiply; }
.pele .blue rect { fill: #8fdcff; }
.pele .orange rect { fill: #ffc98a; }
.pele .purple rect { fill: #d8c2ff; }
.pele .yellow rect { fill: #fff27a; }
.pele .teal rect { fill: #9fecd8; }
.pele .tan rect { fill: #e8d6b8; }
.pele .pink rect { fill: #ffbfe0; }
.pele .breaks rect { fill: #ff9db0 !important; stroke: none !important; }
.pele .breaks text { fill: #1d1f24 !important; }
.pele .mayBreak rect { fill: #ffb38a !important; stroke: none !important; }
.pele .mayBreak text { fill: #1d1f24 !important; }
.pele .bugPath rect { stroke: #1a66d6 !important; stroke-width: 2.5px !important; }
.pele .repeats rect { stroke: #8a2fd0 !important; stroke-width: 2.5px !important; stroke-dasharray: 6 3; }
@media (prefers-color-scheme: dark) {
  .pele {
    --pele-bg: #17191d; --pele-fg: #f4f5f7; --pele-muted: #c0c4cc; --pele-line: #e6e8ec;
    --pele-surface: #5f5612;
  }
  .pele .pele-node rect { mix-blend-mode: normal; }
  .pele .blue rect { fill: #135a7c; }
  .pele .orange rect { fill: #6e3f12; }
  .pele .purple rect { fill: #4a3480; }
  .pele .yellow rect { fill: #5f5612; }
  .pele .teal rect { fill: #125a50; }
  .pele .tan rect { fill: #55452c; }
  .pele .pink rect { fill: #7a2a58; }
  .pele .breaks rect { fill: #8c2a41 !important; }
  .pele .breaks text { fill: #ffffff !important; }
  .pele .mayBreak rect { fill: #7c431a !important; }
  .pele .mayBreak text { fill: #ffffff !important; }
  .pele .bugPath rect { stroke: #5fa8ff !important; }
  .pele .repeats rect { stroke: #c58cff !important; }
}
```

The filters give the arrows and the swipes their rough edges. The CSS refers to them by their ids.

```svg
<defs>
  <filter id="hl-line" x="-5%" y="-5%" width="110%" height="110%">
    <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="2" seed="4"/>
    <feDisplacementMap in="SourceGraphic" scale="5"/>
  </filter>
  <filter id="hl-swipe" x="-5%" y="-10%" width="110%" height="120%">
    <feTurbulence type="fractalNoise" baseFrequency="0.03 0.012" numOctaves="2" seed="9"/>
    <feDisplacementMap in="SourceGraphic" scale="11"/>
  </filter>
</defs>
```
