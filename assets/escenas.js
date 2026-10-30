/* Escenas 2.5D de Divine Light Journey (home y /mision/).
   Solo transform y opacity. Todo el movimiento vive dentro de gsap.matchMedia
   con (prefers-reduced-motion: no-preference): con reduce no se crea ni un tween
   ni un ScrollTrigger y la composición queda completa y quieta (lo resuelve el CSS).
   Contrato de marcado:
     [data-escena]          escena (trigger de scroll y zona de cursor)
     [data-d] / [data-x]    capa de fondo: recorrido vertical / horizontal en px (con signo)
     [data-s]               escala final de la capa (la inicial es 1)
     .capa-in[data-m]       capa de cursor (amplitud en px), contenedor anidado
   Móvil (<=900 px): recorridos al 40 %, sin cursor, sin sticky. */
document.addEventListener("DOMContentLoaded", function () {
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  var mm = gsap.matchMedia();
  var NR = "(prefers-reduced-motion: no-preference)";

  function all(sel, root) { return [].slice.call((root || document).querySelectorAll(sel)); }
  function num(el, a, d) { var v = parseFloat(el.getAttribute(a)); return isNaN(v) ? d : v; }

  mm.add({ desk: "(min-width: 901px) and " + NR, mob: "(max-width: 900px) and " + NR }, function (ctx) {
    var desk = ctx.conditions.desk;
    var k = desk ? 1 : 0.4;
    var limpiar = [];

    all("[data-escena]").forEach(function (esc) {
      var nombre = esc.getAttribute("data-escena");

      // 1) profundidad: cada capa recorre ±data-d mientras la escena cruza la pantalla.
      //    La escena 02 (sticky) reparte el recorrido por todo el tramo fijo.
      var rango = { trigger: esc, start: "top bottom", end: "bottom top", scrub: 0.6 };
      all("[data-d],[data-x],[data-s]", esc).forEach(function (el) {
        var d = num(el, "data-d", 0) * k, x = num(el, "data-x", 0) * k, s = num(el, "data-s", 1);
        var de = { y: d, x: x, scale: 1 }, a = { y: -d, x: -x, scale: s, ease: "none", scrollTrigger: rango };
        if (s !== 1 && nombre === "crecimiento") { de.scale = s; a.scale = 1; }
        gsap.fromTo(el, de, a);
      });

      // 2) cursor: solo capas de fondo, nunca texto ni botones. Por tipo de puntero.
      if (desk) {
        var cam = all(".capa-in[data-m]", esc).map(function (el) {
          var o = { duration: 0.8, ease: "power3.out" };
          return { m: num(el, "data-m", 0), x: gsap.quickTo(el, "x", o), y: gsap.quickTo(el, "y", o) };
        });
        if (cam.length) {
          var mover = function (nx, ny) { cam.forEach(function (c) { c.x(nx * c.m); c.y(ny * c.m * 0.55); }); };
          var onMove = function (e) {
            if (e.pointerType === "touch") return;
            var b = esc.getBoundingClientRect();
            mover(((e.clientX - b.left) / b.width - 0.5) * 2, ((e.clientY - b.top) / b.height - 0.5) * 2);
          };
          var onLeave = function () { mover(0, 0); };
          esc.addEventListener("pointermove", onMove, { passive: true });
          esc.addEventListener("pointerleave", onLeave, { passive: true });
          limpiar.push(function () {
            esc.removeEventListener("pointermove", onMove);
            esc.removeEventListener("pointerleave", onLeave);
          });
        }
      }
    });

    // 01 · despertar: el texto entra párrafo a párrafo (los titulares ya los revela [data-reveal])
    all("[data-escena='despertar'] .wrap > p").forEach(function (p, i) {
      gsap.from(p, { opacity: 0, y: 22 * k + 6, duration: 1, ease: "power2.out", delay: (i % 3) * 0.06,
        scrollTrigger: { trigger: p, start: "top 90%", once: true } });
    });

    // 03 · cómo acompañamos: cada bloque entra con un gesto distinto (solo desplazamiento: el fundido ya lo da [data-reveal])
    var gestos = [{ x: -34, y: 0 }, { x: 34, y: 0 }, { x: 0, y: 30 }, { x: -22, y: 22 }];
    all("[data-escena='acompanamos'] .steps li").forEach(function (li, i) {
      var g = gestos[i % gestos.length];
      var partes = all(".n, h3", li), cuerpo = all("p", li);
      gsap.from(partes, { x: g.x * k, y: g.y * k, duration: 1.1, ease: "power3.out", stagger: 0.08,
        scrollTrigger: { trigger: li, start: "top 90%", once: true } });
      gsap.from(cuerpo, { x: g.x * 0.5 * k, y: g.y * 0.5 * k, duration: 1.3, ease: "power3.out", delay: 0.18,
        scrollTrigger: { trigger: li, start: "top 90%", once: true } });
    });

    // 04 · experiencias: parallax independiente por imagen (recorrido y escala propios)
    var vel = [{ y: 7, s: 1.08 }, { y: 4, s: 1.06 }, { y: 9, s: 1.07 }];
    all("[data-escena='experiencias'] .par").forEach(function (par, i) {
      var v = vel[i % vel.length], marco = par.parentNode;
      gsap.fromTo(par, { yPercent: -v.y * k, scale: 1.04 }, { yPercent: v.y * k, scale: v.s, ease: "none",
        scrollTrigger: { trigger: marco, start: "top bottom", end: "bottom top", scrub: 0.5 } });
    });

    // 06 · cierre: el CTA emerge de la luz (el titular ya lo revela [data-reveal])
    var cierre = document.querySelector("[data-escena='reencuentro']");
    if (cierre) {
      var tl = gsap.timeline({ scrollTrigger: { trigger: cierre, start: "top 62%", once: true } });
      tl.from(cierre.querySelectorAll(".wrap > p"), { opacity: 0, y: 20 * k + 4, duration: 0.9, ease: "power2.out" }, 0.15)
        .from(cierre.querySelectorAll(".wrap > .btn"), { opacity: 0, y: 18 * k + 4, duration: 0.9, ease: "power2.out" }, 0.35)
        .from(cierre.querySelectorAll(".luz-cta"), { opacity: 0, scale: 0.6, duration: 1.6, ease: "power2.out" }, 0.2);
    }

    // 05 · misión: el texto entra por bloques
    all("[data-escena='horizonte'] ~ section .wrap > p, [data-escena='horizonte'] ~ section .wrap > ul").forEach(function (p) {
      gsap.from(p, { opacity: 0, y: 22 * k + 6, duration: 1, ease: "power2.out",
        scrollTrigger: { trigger: p, start: "top 90%", once: true } });
    });

    return function () { limpiar.forEach(function (f) { f(); }); };
  });
});
