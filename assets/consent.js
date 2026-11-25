/* Aviso de cookies y consentimiento — una sola copia para todo el sitio.
   La elección se guarda en la cookie técnica `dl-consent-v1` (js-cookie, 180 días);
   si el navegador no admite cookies se guarda en localStorage con la misma clave,
   de modo que quien ya eligió antes de este cambio no vuelve a ver el aviso.
   Para abrir el panel desde cualquier enlace del sitio: data-ck-open.
   Requiere assets/vendor/js.cookie.min.js cargado antes (defer). */
(function () {
  "use strict";

  var KEY = "dl-consent-v1";
  var propio = document.querySelector('script[src$="consent.js"]');
  var prefijo = propio ? (propio.getAttribute("src") || "").replace(/assets\/consent\.js.*$/, "") : "";
  var ingles = (document.documentElement.lang || "es").toLowerCase().indexOf("en") === 0;

  var T = ingles ? {
    etiqueta: "Cookie notice",
    titulo: "Cookies and privacy",
    texto: "This site does not install third-party or tracking cookies. We only store your choice on this device. You can accept, reject or configure the optional categories; all of them are off unless you turn them on. For more information, see our ",
    enlace: "cookie policy",
    rechazar: "Reject all",
    configurar: "Configure",
    aceptar: "Accept all",
    panelTitulo: "Cookie settings",
    panelIntro: "Choose the categories you allow. Strictly necessary cookies cannot be switched off because they make the site work (for example, remembering this same choice).",
    necesariasTitulo: "Strictly necessary",
    necesariasTexto: "Essential for the site to work and stay secure. They store your cookie choice on this device.",
    necesariasAria: "Necessary, always on",
    categorias: [
      ["Preferences", "They remember settings such as the language or the last section visited. None is in use today.", "preferences"],
      ["Analytics", "They would let us measure visits and the most-read pages in aggregate. No analytics tool is installed today.", "analytics"],
      ["Marketing", "They would be used to measure campaigns or show relevant advertising. None is in use today.", "marketing"]
    ],
    cerrar: "Close",
    guardar: "Save preferences",
    urlCookies: prefijo + "en/legal/cookies/"
  } : {
    etiqueta: "Aviso de cookies",
    titulo: "Cookies y privacidad",
    texto: "Este sitio no instala cookies de terceros ni de seguimiento. Solo guardamos tu elección en este dispositivo. Puedes aceptar, rechazar o configurar las categorías opcionales; todas están desactivadas salvo que las actives. Más información en la ",
    enlace: "política de cookies",
    rechazar: "Rechazar",
    configurar: "Configurar",
    aceptar: "Aceptar todo",
    panelTitulo: "Configuración de cookies",
    panelIntro: "Elige qué categorías permites. Las estrictamente necesarias no se pueden desactivar porque hacen funcionar el sitio (por ejemplo, recordar esta misma elección).",
    necesariasTitulo: "Estrictamente necesarias",
    necesariasTexto: "Imprescindibles para el funcionamiento y la seguridad del sitio. Guardan tu elección de cookies en este dispositivo.",
    necesariasAria: "Necesarias, siempre activas",
    categorias: [
      ["Preferencias", "Recuerdan ajustes como el idioma o la última sección visitada. Hoy no se usa ninguna.", "preferences"],
      ["Analítica", "Nos permitirían medir visitas y páginas más leídas de forma agregada. Hoy no hay ninguna herramienta de analítica instalada.", "analytics"],
      ["Marketing", "Servirían para medir campañas o mostrar publicidad relevante. Hoy no se usa ninguna.", "marketing"]
    ],
    cerrar: "Cerrar",
    guardar: "Guardar preferencias",
    urlCookies: prefijo + "legal/cookies/"
  };

  var cats = T.categorias.map(function (c) {
    return '<div class="ckp-cat"><div><h3>' + c[0] + '</h3><p>' + c[1] + '</p></div>' +
      '<label class="ckp-sw"><input type="checkbox" data-ck-cat="' + c[2] + '"><span></span></label></div>';
  }).join("");

  var html =
    '<div class="ck" id="ck" role="region" aria-label="' + T.etiqueta + '" hidden>' +
      '<div class="ck-in">' +
        '<div class="ck-txt">' +
          '<h2>' + T.titulo + '</h2>' +
          '<p>' + T.texto + '<a href="' + T.urlCookies + '">' + T.enlace + '</a>.</p>' +
        '</div>' +
        '<div class="ck-btns">' +
          '<button class="ck-btn no" type="button" data-ck-reject>' + T.rechazar + '</button>' +
          '<button class="ck-btn cfg" type="button" data-ck-config>' + T.configurar + '</button>' +
          '<button class="ck-btn si" type="button" data-ck-accept>' + T.aceptar + '</button>' +
        '</div>' +
      '</div>' +
    '</div>' +
    '<div class="ckp" id="ckp" role="dialog" aria-modal="true" aria-labelledby="ckp-t" hidden>' +
      '<div class="ckp-box">' +
        '<h2 id="ckp-t">' + T.panelTitulo + '</h2>' +
        '<p>' + T.panelIntro + '</p>' +
        '<div class="ckp-cat"><div><h3>' + T.necesariasTitulo + '</h3><p>' + T.necesariasTexto + '</p></div>' +
          '<label class="ckp-sw"><input type="checkbox" checked disabled aria-label="' + T.necesariasAria + '"><span></span></label></div>' +
        cats +
        '<div class="ckp-acc">' +
          '<button class="ck-btn no" type="button" data-ck-reject>' + T.cerrar + '</button>' +
          '<button class="ck-btn si" type="button" data-ck-save>' + T.guardar + '</button>' +
        '</div>' +
      '</div>' +
    '</div>';

  var host = document.createElement("div");
  host.innerHTML = html;
  var nodos = [];
  while (host.firstChild) { nodos.push(document.body.appendChild(host.firstChild)); }

  var banner = document.getElementById("ck");
  var panel = document.getElementById("ckp");
  var lastFocus = null;

  /* ── Almacenamiento: cookie propia primero (js-cookie), localStorage de respaldo ── */
  function leerLS() {
    try { return JSON.parse(localStorage.getItem(KEY) || "null"); } catch (e) { return null; }
  }
  function leerCK() {
    try {
      if (window.Cookies) {
        var v = window.Cookies.get(KEY);
        return v ? JSON.parse(v) : null;
      }
    } catch (e) {}
    return null;
  }
  function leer() { return leerCK() || leerLS(); }

  function guardar(state) {
    state.necessary = true;
    state.v = 1;
    state.ts = new Date().toISOString();
    var raw = JSON.stringify(state);
    try {
      if (window.Cookies) window.Cookies.set(KEY, raw, { expires: 180, path: "/", sameSite: "Lax" });
    } catch (e) {}
    try { localStorage.setItem(KEY, raw); } catch (e) {}
    aplicar(state);
    banner.hidden = true;
    panel.hidden = true;
    document.documentElement.setAttribute("data-consent", raw);
    document.dispatchEvent(new CustomEvent("dl:consent", { detail: state }));
  }

  function aplicar(state) {
    // Etiquetas bloqueadas: <script type="text/plain" data-consent="analytics" data-src="...">
    var nodos = document.querySelectorAll('script[type="text/plain"][data-consent]');
    for (var i = 0; i < nodos.length; i++) {
      var n = nodos[i], cat = n.getAttribute("data-consent");
      if (!state[cat] || n.getAttribute("data-loaded")) continue;
      var s = document.createElement("script");
      for (var j = 0; j < n.attributes.length; j++) {
        var a = n.attributes[j];
        if (["type", "data-src", "data-consent", "data-loaded"].indexOf(a.name) === -1) s.setAttribute(a.name, a.value);
      }
      if (n.getAttribute("data-src")) s.src = n.getAttribute("data-src"); else s.text = n.textContent;
      n.setAttribute("data-loaded", "1");
      n.parentNode.appendChild(s);
    }
    // iframes diferidos (mapas, vídeos): data-consent en el propio iframe con data-src
    var frames = document.querySelectorAll('iframe[data-consent][data-src]');
    for (var k = 0; k < frames.length; k++) {
      var f = frames[k];
      if (state[f.getAttribute("data-consent")] && !f.getAttribute("src")) f.setAttribute("src", f.getAttribute("data-src"));
    }
  }

  function abrir() {
    lastFocus = document.activeElement;
    var st = leer() || { preferences: false, analytics: false, marketing: false };
    var casos = panel.querySelectorAll("[data-ck-cat]");
    for (var i = 0; i < casos.length; i++) casos[i].checked = !!st[casos[i].getAttribute("data-ck-cat")];
    panel.hidden = false;
    var foco = panel.querySelector("input:not([disabled])") || panel.querySelector("button");
    if (foco) foco.focus();
  }
  function cerrar() {
    panel.hidden = true;
    if (lastFocus) lastFocus.focus();
  }

  document.addEventListener("click", function (ev) {
    if (ev.target.closest("[data-ck-config]") || ev.target.closest("[data-ck-open]")) { ev.preventDefault(); abrir(); return; }
    if (ev.target.closest("[data-ck-accept]")) { guardar({ preferences: true, analytics: true, marketing: true }); return; }
    if (ev.target.closest("[data-ck-reject]")) { guardar({ preferences: false, analytics: false, marketing: false }); return; }
    if (ev.target.closest("[data-ck-save]")) {
      var st = { preferences: false, analytics: false, marketing: false };
      var cs = panel.querySelectorAll("[data-ck-cat]");
      for (var i = 0; i < cs.length; i++) st[cs[i].getAttribute("data-ck-cat")] = !!cs[i].checked;
      guardar(st);
      return;
    }
    if (ev.target === panel) cerrar();
  });
  document.addEventListener("keydown", function (ev) {
    if (ev.key === "Escape" && !panel.hidden) cerrar();
  });

  var inicial = leer();
  if (inicial) { aplicar(inicial); } else { banner.hidden = false; }
  window.dlConsent = { open: abrir, state: leer };
})();
