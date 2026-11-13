# CAMBIO · REConecta, ajustes de la revisión de Zuzel (13-nov-2026)

Rama `reconecta-revision-2026-11-13`. Sin commit ni push: el árbol queda con los cambios.
Ficheros tocados: `reconecta/index.html`, `en/reconecta/index.html`, `assets/reconecta.css`. Nada más.

## Qué cambié, fichero por fichero

### `reconecta/index.html`
1. **Hero.** `h1` en una sola oración, sin `<em>` ni `<br>`: `<span class="rc-marca">…</span>, cuatro días para escucharte, sentirte y reconectar contigo y con la vida`. El `lead` queda «Hay algo esencial en ti que no necesitas encontrar sino recordar.»
2. **Origen.** Orden eyebrow → párrafo → `.rc-cita`.
3. **Llamada.** El párrafo «Una necesidad interior…» pasa a `<p class="rc-cita-intro">`. Cuatro `<strong class="rc-enf">`: «sagrado femenino», «Fuente de la Vida», «nuestro verdadero ser», «Presencia Divina». El `punch` no cambia en el HTML.
4. **Botones.** Fuera `data-checkout` del hero y de «Reservar mi plaza» (programa). Dos CTA nuevos `<p class="rc-cta-medio"><a class="btn btn-primary" href="#inscripcion">Reservar mi plaza</a></p>`: uno al final de `.rc-llamada` (en un `.wrap` propio tras la rejilla) y otro tras la galería de «Momentos». Conservan `data-checkout` solo el de la tarjeta de precio y el del cierre.

### `en/reconecta/index.html`
Lo mismo, con el copy inglés existente. Frases marcadas: «sacred feminine», «Source of Life», «our true self», «Divine Presence» (las cuatro aparecen tal cual). Los CTA nuevos dicen «Reserve my place» (mismo texto que el del programa).

### `assets/reconecta.css`
- Hero escritorio: `h1` baja de `clamp(2rem,3.4vw,3.15rem)` a `clamp(1.7rem,2.6vw,2.5rem)` para que la frase más larga quepa en ≤3 líneas en la columna de 547 px a 1440. `.rc-marca` en `--primary`, tres primeras letras en `--gold-ink`.
- Hero ≤900 px: apilado. `display:block`, sin velo, la `figure` pasa a bloque `position:relative` con `aspect-ratio:4/5` y `object-position:68% 25%` (la cara está hacia x≈68 %, y≈25 % de la foto original); el texto va debajo sobre el mismo fondo. `h1` móvil a `clamp(1.75rem,7vw,2.3rem)`.
- `.rc-cita-intro`, `.rc-enf` y `.punch` con el CSS del brief (ver decisión 2).
- Origen: `p:last-child` ya no sirve (la cita es ahora la última), así que el estilo de cuerpo pasa a `p:not(.rc-cita)` y la cita lleva margen arriba (18 px) en vez de abajo.
- Botones: el bloque de color grande colgaba de `[data-checkout]`; sin el atributo los CTA del hero y los intermedios se habrían quedado como botón normal. Ampliados los selectores (escritorio, ≤640, ≤360) a `.rc-hero a.btn` y `.rc-cta-medio a.btn`. Los dos nuevos van centrados.

## Decisiones de estilo
1. **`.rc-marca` con un span interior.** Un solo span no puede colorear solo «REC». Añadí `<span class="rc-rec">REC</span>onecta` dentro de `.rc-marca`. Es un desvío mínimo del marcado literal del brief (mismas palabras). No pude ver el resultado en navegador: si «canta», basta borrar la regla `.rc-hero h1 .rc-rec` y queda todo en `--primary`.
2. **Prefijo `.rc-page`** en `.rc-cita-intro` y `.punch`. `.rc-page .rest-texto p{font-size:var(--rc-fs)}` (0,2,1) gana al CSS literal del brief (0,2,0) y anulaba el tamaño de ambos. Con el prefijo (0,3,0) aplican. Nota: esto implica que el tamaño del `punch` de site.css ya estaba siendo anulado a 21 px antes de este cambio; ahora sube a `clamp(1.55rem,2.4vw,2.05rem)`.
3. `.rc-enf` dentro de la cita destacada hereda `font-weight:500` sobre una serif cursiva; el brief lo pide así.

## Gates (salida real)

```
$ git diff --stat
 assets/reconecta.css    | 53 ++++++++++++++++++++++++++++++++++++++-----------
 en/reconecta/index.html | 26 ++++++++++++++----------
 reconecta/index.html    | 24 ++++++++++++----------
 (más CAMBIO.md, sin seguimiento)

$ grep -c 'data-checkout' reconecta/index.html en/reconecta/index.html
reconecta/index.html:3
en/reconecta/index.html:3

$ grep -c 'rc-cita-intro' reconecta/index.html
1

$ grep -c 'rc-enf' reconecta/index.html en/reconecta/index.html
reconecta/index.html:4
en/reconecta/index.html:4

$ grep -n 'Cuatro días para<br>' reconecta/index.html
(vacío)

$ grep -n 'rc-marca' reconecta/index.html en/reconecta/index.html
reconecta/index.html:66 …   en/reconecta/index.html:66 …   (una línea por fichero)
```

- **`data-checkout` da 3, no 2.** Hay exactamente 2 anclas con el atributo (línea 326, tarjeta de precio, y 437, cierre). La tercera coincidencia es el script (`querySelectorAll("[data-checkout]")`, línea 472/473), que no se puede quitar. Los CTA realmente comprables son 2 y 2.
- **`rc-marca` da 1 línea por fichero**, no 2: el brief preveía dos coincidencias, pero el `h1` es una única línea con el span. Hay un solo uso por página.
- **Recuento de palabras** (no pude ejecutar `python3` en esta sesión, así que es recuento manual): `.rc-prosa` queda igual (solo se añadieron etiquetas). `.hero-col` sube de 23 a 24 palabras en ES: +1 porque «REConecta» entra ahora en el `h1`; «Contigo y con la Vida» pasa del `lead` al `h1` («contigo y con la vida») sin perder palabras. Si se cuenta quitando etiquetas sustituyéndolas por espacio, «REC»+«onecta» da una palabra más por el span interior.

## Lo que NO pude verificar
**No hay navegador en esta sesión** (ni chromium ni playwright accesibles). No comprobé, por tanto:
- que el `h1` ocupe ≤3 líneas a 1440 px y no desborde a 390 px (el tamaño está calculado a ojo, ~2,5–3 líneas);
- que a 390 px el `h1` quede bajo el borde inferior de la foto (por construcción lo está: la foto es bloque y el texto va después, pero conviene mirarlo);
- el color de «REC» en `--gold-ink` junto a `--primary`;
- el CTA nuevo tras «llamada» y el reflujo de la tarjeta del origen.

## Dudas abiertas
- Texto del botón de los dos CTA nuevos: usé «Reservar mi plaza» / «Reserve my place» (el brief no lo fijaba).
- Los CTA del hero y los intermedios ahora son anclas a `#inscripcion`, no van a Stripe, como pedía el brief.
- Revisar en navegador antes de commitear (ver arriba).
