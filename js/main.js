/* ===========================================================
   Rolande Solomons — Portfolio interactions
   Vanilla JS, no dependencies.
   =========================================================== */
(function () {
  "use strict";

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Year ---------- */
  $("#year").textContent = new Date().getFullYear();

  /* ---------- Theme toggle (persisted) ---------- */
  const root = document.documentElement;
  const toggle = $("#themeToggle");
  const icon = $(".theme-toggle__icon", toggle);
  const saved = localStorage.getItem("theme");
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const startTheme = saved || (systemDark ? "dark" : "light");
  applyTheme(startTheme);

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    icon.textContent = theme === "dark" ? "☀️" : "🌙";
  }
  toggle.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
    localStorage.setItem("theme", next);
  });

  /* ---------- Mobile nav ---------- */
  const burger = $("#navBurger");
  const navLinks = $("#navLinks");
  function closeNav() {
    burger.classList.remove("is-open");
    navLinks.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
  }
  burger.addEventListener("click", () => {
    const open = burger.classList.toggle("is-open");
    navLinks.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", String(open));
  });
  $$(".nav__link").forEach((l) => l.addEventListener("click", closeNav));

  /* ---------- Navbar shadow + scroll progress + back-to-top ---------- */
  const nav = $("#nav");
  const progress = $("#scrollProgress");
  const toTop = $("#toTop");
  function onScroll() {
    const y = window.scrollY;
    nav.classList.toggle("is-scrolled", y > 10);
    toTop.classList.toggle("is-visible", y > 600);
    const h = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Typing effect for tagline ---------- */
  const typed = $("#typed");
  const phrases = [
    "Computer Science Graduate",
    "Software Developer",
    "AR & Game Development Enthusiast",
  ];
  if (prefersReduced) {
    typed.textContent = phrases.join(" · ");
  } else {
    let pi = 0, ci = 0, deleting = false;
    (function type() {
      const word = phrases[pi];
      typed.textContent = word.slice(0, ci);
      if (!deleting && ci < word.length) {
        ci++;
        setTimeout(type, 70);
      } else if (!deleting && ci === word.length) {
        deleting = true;
        setTimeout(type, 1500);
      } else if (deleting && ci > 0) {
        ci--;
        setTimeout(type, 35);
      } else {
        deleting = false;
        pi = (pi + 1) % phrases.length;
        setTimeout(type, 250);
      }
    })();
  }

  /* ---------- Reveal on scroll ---------- */
  const revealEls = $$(".reveal");
  if ("IntersectionObserver" in window && !prefersReduced) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e, i) => {
          if (e.isIntersecting) {
            setTimeout(() => e.target.classList.add("is-visible"), i * 60);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- Count-up stats ---------- */
  const stats = $$(".stat__num");
  if ("IntersectionObserver" in window && !prefersReduced) {
    const so = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target;
          const target = +el.dataset.count;
          let n = 0;
          const step = Math.max(1, Math.round(target / 28));
          const tick = () => {
            n = Math.min(target, n + step);
            el.textContent = n;
            if (n < target) requestAnimationFrame(tick);
          };
          tick();
          so.unobserve(el);
        });
      },
      { threshold: 0.6 }
    );
    stats.forEach((el) => so.observe(el));
  } else {
    stats.forEach((el) => (el.textContent = el.dataset.count));
  }

  /* ---------- Active nav link on scroll (scrollspy) ---------- */
  const sections = $$("main section[id]");
  const linkFor = (id) => $(`.nav__link[href="#${id}"]`);
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          $$(".nav__link").forEach((l) => l.classList.remove("is-active"));
          const link = linkFor(e.target.id);
          if (link) link.classList.add("is-active");
        }
      });
    },
    { threshold: 0.5 }
  );
  sections.forEach((s) => spy.observe(s));

  /* ---------- Projects data ---------- */
  const projects = [
    {
      id: "solar",
      title: "Solar System Encyclopedia",
      cats: ["ar"],
      emoji: "🪐",
      gradient: "linear-gradient(135deg, #2b1055, #7597de)",
      desc: "An interactive AR application that teaches users about the solar system using 3D models, image tracking, and educational content.",
      tools: ["Unity", "Vuforia", "3DS Max", "Adobe Photoshop"],
      role: "Designed the interface, added 3D assets, implemented AR interactions, and structured the educational content.",
      github: "https://github.com/compsciwro",
      demo: "",
    },
    {
      id: "rl-board",
      title: "RL Board Game Prototype",
      cats: ["ai", "games"],
      emoji: "♟️",
      gradient: "linear-gradient(135deg, #134e5e, #71b280)",
      desc: "A board game prototype where reinforcement learning agents learn to play through self-play and reward shaping.",
      tools: ["Python", "Gymnasium", "Stable-Baselines3", "Pygame"],
      role: "Built the game environment, defined the reward structure, and trained & evaluated the RL agents.",
      github: "https://github.com/compsciwro",
      demo: "",
    },
    {
      id: "game",
      title: "2D Game Project",
      cats: ["games"],
      emoji: "🎮",
      gradient: "linear-gradient(135deg, #f5576c, #f093fb)",
      desc: "A playable 2D game built with Pygame featuring custom sprites, collision handling, and level progression.",
      tools: ["Python", "Pygame", "Adobe Photoshop"],
      role: "Developed core gameplay loops, sprite animation, and level design.",
      github: "https://github.com/compsciwro",
      demo: "",
    },
    {
      id: "web",
      title: "This Portfolio Website",
      cats: ["web"],
      emoji: "🌐",
      gradient: "linear-gradient(135deg, #4776e6, #8e54e9)",
      desc: "A responsive, animated portfolio built from scratch with semantic HTML, modern CSS, and vanilla JavaScript — no frameworks.",
      tools: ["HTML", "CSS", "JavaScript"],
      role: "Designed and built every section, animation, and interactive component.",
      github: "https://github.com/compsciwro",
      demo: "",
    },
    {
      id: "research",
      title: "Nanobubbles Research Overview",
      cats: ["ai"],
      emoji: "🫧",
      gradient: "linear-gradient(135deg, #00c6fb, #005bea)",
      desc: "A research-based exploration of nanobubble technology and its potential applications in water treatment.",
      tools: ["Research", "Technical Writing"],
      role: "Reviewed literature, synthesised findings, and produced a structured written overview.",
      github: "",
      demo: "",
    },
  ];

  /* ---------- Render project cards ---------- */
  const grid = $("#projectGrid");
  grid.innerHTML = projects
    .map(
      (p) => `
    <article class="card reveal" data-cats="${p.cats.join(" ")}" data-id="${p.id}" tabindex="0" role="button" aria-label="View ${p.title}">
      <div class="card__thumb" style="background:${p.gradient}"><span>${p.emoji}</span></div>
      <div class="card__body">
        <h3 class="card__title">${p.title}</h3>
        <p class="card__desc">${p.desc}</p>
        <div class="card__tools">${p.tools.slice(0, 4).map((t) => `<span class="card__tool">${t}</span>`).join("")}</div>
        <span class="card__more">View details →</span>
      </div>
    </article>`
    )
    .join("");

  // re-observe newly added reveal cards
  $$("#projectGrid .reveal").forEach((el) => {
    if ("IntersectionObserver" in window && !prefersReduced) {
      const o = new IntersectionObserver((ents, ob) => {
        ents.forEach((e) => {
          if (e.isIntersecting) { e.target.classList.add("is-visible"); ob.unobserve(e.target); }
        });
      }, { threshold: 0.1 });
      o.observe(el);
    } else {
      el.classList.add("is-visible");
    }
  });

  /* ---------- Project filtering ---------- */
  const filterBtns = $$(".filter");
  filterBtns.forEach((btn) =>
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      const f = btn.dataset.filter;
      $$("#projectGrid .card").forEach((card) => {
        const show = f === "all" || card.dataset.cats.split(" ").includes(f);
        card.classList.toggle("is-hidden", !show);
      });
    })
  );

  /* ---------- Project modal ---------- */
  const modal = $("#modal");
  const byId = (id) => projects.find((p) => p.id === id);
  function openModal(p) {
    $("#modalMedia").style.background = p.gradient;
    $("#modalMedia").textContent = p.emoji;
    $("#modalTitle").textContent = p.title;
    $("#modalDesc").textContent = p.desc;
    $("#modalTools").innerHTML = p.tools.map((t) => `<span class="card__tool">${t}</span>`).join("");
    $("#modalRole").innerHTML = `<strong>My role:</strong> ${p.role}`;
    const actions = [];
    if (p.github) actions.push(`<a class="btn btn--ghost" href="${p.github}" target="_blank" rel="noopener">GitHub</a>`);
    if (p.demo) actions.push(`<a class="btn btn--primary" href="${p.demo}" target="_blank" rel="noopener">Live demo</a>`);
    $("#modalActions").innerHTML = actions.join("");
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function closeModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }
  grid.addEventListener("click", (e) => {
    const card = e.target.closest(".card");
    if (card) openModal(byId(card.dataset.id));
  });
  grid.addEventListener("keydown", (e) => {
    if ((e.key === "Enter" || e.key === " ") && e.target.classList.contains("card")) {
      e.preventDefault();
      openModal(byId(e.target.dataset.id));
    }
  });
  modal.addEventListener("click", (e) => { if (e.target.hasAttribute("data-close")) closeModal(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && modal.classList.contains("is-open")) closeModal(); });

  /* ---------- Contact form validation ---------- */
  const form = $("#contactForm");
  const status = $("#formStatus");
  const setError = (name, msg) => {
    const field = form.querySelector(`[name="${name}"]`).closest(".field");
    field.classList.toggle("has-error", !!msg);
    $(`.error[data-for="${name}"]`).textContent = msg || "";
  };
  const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    let ok = true;
    if (!data.name.trim()) { setError("name", "Please enter your name."); ok = false; } else setError("name", "");
    if (!isEmail(data.email.trim())) { setError("email", "Enter a valid email address."); ok = false; } else setError("email", "");
    if (data.message.trim().length < 10) { setError("message", "Message should be at least 10 characters."); ok = false; } else setError("message", "");

    if (!ok) { status.textContent = ""; status.className = "form-status"; return; }

    // No backend — open the user's mail client with a prefilled message.
    const subject = encodeURIComponent(`Portfolio enquiry from ${data.name}`);
    const body = encodeURIComponent(`${data.message}\n\n— ${data.name}\n${data.email}`);
    window.location.href = `mailto:rolande1412@gmail.com?subject=${subject}&body=${body}`;
    status.textContent = "Thanks! Your email client should open with the message ready to send. 📨";
    status.className = "form-status ok";
    form.reset();
  });
})();
