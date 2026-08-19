/* ============================================================
   LA NOCHE ESTRELLADA QUE TE SUSURRA — animaciones
   ============================================================ */
(function () {
  "use strict";

  var isMobile = window.innerWidth <= 820;
  var dpr = Math.min(window.devicePixelRatio || 1, 2);

  /* --------------------------------------------------------
     ﻿1. Cielo estrellado de fondo (canvas fijo)
     -------------------------------------------------------- */
  var sky = document.getElementById("stars-canvas");
  var sctx = sky.getContext("2d");
  var stars = [], meteors = [], W = 0, H = 0;
  var mouse = { x: -9999, y: -9999 };

  function sizeSky() {
    W = window.innerWidth; H = window.innerHeight;
    sky.width = W * dpr; sky.height = H * dpr;
    sctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var count = Math.min(240, Math.round((W * H) / 9000));
    stars = [];
    for (var i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H * 0.85,
        r: 0.4 + Math.random() * 1.5,
        ph: Math.random() * Math.PI * 2,
        sp: 0.4 + Math.random() * 1.4
      });
    }
  }

  function spawnMeteor() {
    meteors.push({
      x: Math.random() * W * 0.8 + W * 0.15,
      y: Math.random() * H * 0.3,
      vx: -(3 + Math.random() * 5),
      vy: 1.5 + Math.random() * 2,
      life: 1
    });
  }

  var lastMeteor = 0;
  function drawSky(t) {
    sctx.clearRect(0, 0, W, H);
    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];
      var tw = 0.35 + 0.65 * Math.abs(Math.sin(t * 0.001 * s.sp + s.ph));
      var dx = s.x - mouse.x, dy = s.y - mouse.y;
      var boost = (dx * dx + dy * dy < 120 * 120) ? 0.55 : 0;
      sctx.beginPath();
      sctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      sctx.fillStyle = "rgba(210,228,255," + Math.min(1, tw + boost).toFixed(3) + ")";
      sctx.fill();
      if (s.r > 1.2) {
        sctx.beginPath();
        sctx.arc(s.x, s.y, s.r * 2.6, 0, Math.PI * 2);
        sctx.fillStyle = "rgba(150,200,255," + (0.10 * tw).toFixed(3) + ")";
        sctx.fill();
      }
    }
    if (t - lastMeteor > 2800 + Math.random() * 2600) {
      spawnMeteor();
      lastMeteor = t;
    }
    for (var m = meteors.length - 1; m >= 0; m--) {
      var met = meteors[m];
      met.x += met.vx; met.y += met.vy; met.life -= 0.012;
      if (met.life <= 0 || met.x < -60 || met.y > H) { meteors.splice(m, 1); continue; }
      var grad = sctx.createLinearGradient(met.x, met.y, met.x - met.vx * 7, met.y - met.vy * 7);
      grad.addColorStop(0, "rgba(255,255,255," + (0.9 * met.life).toFixed(3) + ")");
      grad.addColorStop(1, "rgba(255,255,255,0)");
      sctx.strokeStyle = grad;
      sctx.lineWidth = 1.6;
      sctx.beginPath();
      sctx.moveTo(met.x, met.y);
      sctx.lineTo(met.x - met.vx * 7, met.y - met.vy * 7);
      sctx.stroke();
    }
    requestAnimationFrame(drawSky);
  }

  sizeSky();
  window.addEventListener("resize", function () {
    sizeSky();
    isMobile = window.innerWidth <= 820;
  });
  window.addEventListener("mousemove", function (e) {
    mouse.x = e.clientX; mouse.y = e.clientY;
  });
  requestAnimationFrame(drawSky);

  /* --------------------------------------------------------
     Araña del héroe
     -------------------------------------------------------- */
  window.addEventListener("load", function () {
    setTimeout(function () {
      var sp = document.getElementById("spideyHero");
      if (sp) sp.classList.add("animate");
    }, 500);
  });

  /* --------------------------------------------------------
     2. Animaciones con GSAP (si cargó)
     -------------------------------------------------------- */
  if (typeof gsap === "undefined") return;

  gsap.registerPlugin(ScrollTrigger);

  /* Hero: entrada */
  var tl = gsap.timeline({ delay: 0.4 });
  tl.to("#hero .eyebrow", { opacity: 1, duration: 1 })
    .to("#hero .hero-title .line1", { opacity: 1, y: 0, duration: 1.1, ease: "power3.out" }, "-=0.6")
    .to("#hero .hero-title .line2", { opacity: 1, y: 0, duration: 1.1, ease: "power3.out" }, "-=0.8")
    .to("#hero .hero-sub", { opacity: 1, y: 0, duration: 0.9, ease: "power2.out" }, "-=0.6")
    .to("#hero .cta", { opacity: 1, y: 0, duration: 0.9, ease: "power2.out" }, "-=0.6");

  /* Títulos de sección: aparecen al entrar */
  document.querySelectorAll(".section-head .eyebrow").forEach(function (el) {
    ScrollTrigger.create({
      trigger: el.closest(".section-head"),
      start: "top 85%",
      once: true,
      onEnter: function () { gsap.to(el, { opacity: 1, duration: 0.9 }); }
    });
  });

  /* Parasolaje del horizonte */
  gsap.to(".skyline", {
    yPercent: 9,
    ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
  });

  /* Telaraña: se dibuja al hacer scroll */
  gsap.to(".web-lines path", {
    strokeDashoffset: 0,
    stagger: 0.02,
    ease: "none",
    scrollTrigger: {
      trigger: "#web",
      start: "top 78%",
      end: "center 42%",
      scrub: 1
    }
  });
  gsap.to(".web-arcs path", {
    strokeDashoffset: 0,
    stagger: 0.015,
    ease: "none",
    scrollTrigger: {
      trigger: "#web",
      start: "top 78%",
      end: "center 42%",
      scrub: 1
    }
  });

  /* Tarjetas de recuerdos */
  var cards = document.querySelectorAll(".memory");
  cards.forEach(function (card, i) {
    if (!isMobile) {
      gsap.set(card, { xPercent: -50, yPercent: -50, y: 30, scale: 0.94, opacity: 0 });
    } else {
      gsap.set(card, { y: 26, opacity: 0 });
    }
    ScrollTrigger.create({
      trigger: card,
      start: "top 88%",
      once: true,
      onEnter: function () {
        gsap.to(card, {
          opacity: 1, y: 0, scale: 1,
          duration: 0.9, delay: i * 0.1,
          ease: "power3.out"
        });
        setTimeout(function () { card.classList.add("lit"); }, 400 + i * 150);
      }
    });
  });

  /* Carta: entra y las líneas "se entintan" */
  var paper = document.getElementById("paper");
  if (paper) {
    ScrollTrigger.create({
      trigger: paper,
      start: "top 70%",
      once: true,
      onEnter: function () {
        var pTl = gsap.timeline();
        pTl.to(paper, { opacity: 1, y: 0, scale: 1, rotation: -1.2, duration: 1.1, ease: "power3.out" })
          .to(".js .paper-hello", { opacity: 1, y: 0, duration: 0.7 }, "-=0.5")
          .to(".js .paper-sign", { opacity: 1, y: 0, duration: 0.7 }, "-=0.5")
          .to(".js .paper-line", {
            opacity: 1, y: 0, filter: "blur(0px)",
            duration: 0.8, stagger: 0.55, ease: "power2.out"
          }, "-=0.5");
      }
    });
  }

  /* Araña puente: cruza la pantalla al llegar a la carta */
  ScrollTrigger.create({
    trigger: "#carta",
    start: "top 55%",
    once: true,
    onEnter: function () {
      var b = document.getElementById("spideyBridge");
      if (b) b.classList.add("swing");
    }
  });

  /* --------------------------------------------------------
     3. Acto final: "Me gustas" hecho de estrellas
     -------------------------------------------------------- */
  var wc = document.getElementById("word-canvas");
  if (wc) {
    var ctx = wc.getContext("2d");
    var parts = [], formed = false, hearts = [], wcw = 0, wch = 0;
    var COLORS = ["#f6d069", "#8fc3f5", "#eaf4ff", "#c3defb"];

    function sizeWord() {
      wcw = wc.parentElement.offsetWidth;
      wch = wc.parentElement.offsetHeight;
      wc.width = wcw * dpr; wc.height = wch * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function fitFont(octx, text) {
      var size = 120;
      do {
        octx.font = "700 " + size + "px 'Poppins', sans-serif";
        if (octx.measureText(text).width <= wcw * 0.82) break;
        size -= 6;
      } while (size > 30);
      return size;
    }

    function buildParticles() {
      var off = document.createElement("canvas");
      off.width = wcw; off.height = wch;
      var octx = off.getContext("2d");
      octx.textAlign = "center";
      octx.textBaseline = "middle";
      octx.font = "700 " + fitFont(octx, "Me gustas") + "px 'Poppins', sans-serif";
      octx.fillStyle = "#fff";
      octx.fillText("Me gustas", wcw / 2, wch / 2 - 24);
      var img = octx.getImageData(0, 0, wcw, wch).data;
      var step = 4;
      parts = [];
      for (var y = 0; y < wch; y += step) {
        for (var x = 0; x < wcw; x += step) {
          if (img[(y * wcw + x) * 4 + 3] > 128) {
            parts.push({
              x: Math.random() * wcw,
              y: Math.random() * wch,
              tx: x, ty: y,
              r: 0.8 + Math.random() * 1.6,
              ph: Math.random() * Math.PI * 2,
              color: COLORS[Math.floor(Math.random() * COLORS.length)]
            });
          }
        }
      }
    }

    function spawnHeart() {
      hearts.push({
        x: Math.random() * wcw,
        y: wch + 20,
        vy: -(0.6 + Math.random() * 1.1),
        vx: (Math.random() - 0.5) * 0.5,
        s: 8 + Math.random() * 10,
        life: 1
      });
    }

    function drawHeart(hx, hy, s, alpha) {
      ctx.save();
      ctx.translate(hx, hy);
      ctx.beginPath();
      ctx.moveTo(0, s * 0.35);
      ctx.bezierCurveTo(-s * 0.9, -s * 0.35, -s * 0.45, -s * 0.95, 0, -s * 0.3);
      ctx.bezierCurveTo(s * 0.45, -s * 0.95, s * 0.9, -s * 0.35, 0, s * 0.35);
      ctx.fillStyle = "rgba(246,208,105," + alpha.toFixed(3) + ")";
      ctx.fill();
      ctx.restore();
    }

    function drawWord(t) {
      ctx.clearRect(0, 0, wcw, wch);
      var settling = true;
      for (var i = 0; i < parts.length; i++) {
        var p = parts[i];
        if (!formed) {
          p.x += (p.tx - p.x) * 0.05;
          p.y += (p.ty - p.y) * 0.05;
          if (Math.abs(p.x - p.tx) > 1.4 || Math.abs(p.y - p.ty) > 1.4) settling = false;
        }
        var wob = formed ? Math.sin(t * 0.001 + p.ph) * 1.6 : 0;
        var a = formed ? 0.75 + 0.25 * Math.sin(t * 0.002 + p.ph) : 0.95;
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.min(1, a);
        ctx.beginPath();
        ctx.arc(p.x + wob, p.y + wob, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (!formed && settling) {
        formed = true;
        clearInterval(spawnTimer);
        spawnTimer = setInterval(spawnHeart, 650);
        setTimeout(function () { clearInterval(spawnTimer); }, 7000);
        gsap.to(".js .finale-note", { opacity: 1, y: 0, duration: 1.2, delay: 0.3 });
        gsap.to(".js .finale-end", { opacity: 1, y: 0, duration: 1.2, delay: 1.1 });
      }
      for (var h = hearts.length - 1; h >= 0; h--) {
        var ht = hearts[h];
        ht.x += ht.vx; ht.y += ht.vy; ht.life -= 0.008;
        if (ht.life <= 0 || ht.y < -30) { hearts.splice(h, 1); continue; }
        drawHeart(ht.x, ht.y, ht.s, Math.max(0, ht.life) * 0.85);
      }
      requestAnimationFrame(drawWord);
    }

    var spawnTimer = null;
    sizeWord();
    buildParticles();
    window.addEventListener("resize", function () {
      if (wc.offsetParent !== null) {
        sizeWord(); buildParticles(); formed = false;
      }
    });
    ScrollTrigger.create({
      trigger: "#finale",
      start: "top 55%",
      once: true,
      onEnter: function () { requestAnimationFrame(drawWord); }
    });
  }
})();