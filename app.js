/* ORNITHEA — interactions */
(function () {
  "use strict";

  /* ---------- Nav: scrolled state + mobile menu ---------- */
  var nav = document.getElementById("nav");
  var burger = document.getElementById("burger");
  var navlinks = document.getElementById("navlinks");
  var currentTab = "home";

  function onScroll() {
    // Off the Home tab there is no hero, so keep the bar solid for legibility.
    if (currentTab !== "home" || window.scrollY > 40) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  burger.addEventListener("click", function () {
    navlinks.classList.toggle("open");
    nav.classList.toggle("menu-open");
  });
  navlinks.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () {
      navlinks.classList.remove("open");
      nav.classList.remove("menu-open");
    });
  });

  /* ---------- Tabs (Home / About / NIDOS) ---------- */
  var panels = [].slice.call(document.querySelectorAll(".tab-panel"));
  var tabLinks = [].slice.call(document.querySelectorAll("[data-tab]"));
  function setTab(tab, scrollTarget) {
    if (!tab) return;
    currentTab = tab;
    panels.forEach(function (p) {
      var on = p.getAttribute("data-tab") === tab;
      p.classList.toggle("is-active", on);
      if (on) p.removeAttribute("hidden");
      else p.setAttribute("hidden", "");
    });
    document.querySelectorAll(".nav__tab").forEach(function (a) {
      a.classList.toggle("is-active", a.getAttribute("data-tab") === tab);
    });
    window.scrollTo(0, 0);
    onScroll();
    // Guarantee the freshly shown panel's content is visible.
    var active = document.querySelector(".tab-panel.is-active");
    if (active) {
      active.querySelectorAll(".reveal").forEach(function (el) {
        el.classList.add("in");
        el.style.opacity = "1";
        el.style.transform = "none";
      });
    }
    if (scrollTarget) {
      var t = document.getElementById(scrollTarget);
      if (t) {
        setTimeout(function () {
          var y = t.getBoundingClientRect().top + window.scrollY - 70;
          window.scrollTo({ top: y, behavior: "smooth" });
        }, 60);
      }
    }
  }
  tabLinks.forEach(function (a) {
    a.addEventListener("click", function (e) {
      e.preventDefault();
      setTab(a.getAttribute("data-tab"), a.getAttribute("data-scroll"));
    });
  });

  // Any other in-page anchor (hero buttons, footer links) should jump to
  // whichever tab actually contains its target, then scroll to it.
  document.addEventListener("click", function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a || a.hasAttribute("data-tab")) return;
    var id = a.getAttribute("href").slice(1);
    if (!id) return;
    var el = document.getElementById(id);
    var panel = el && el.closest(".tab-panel");
    if (!panel) return;
    e.preventDefault();
    setTab(panel.getAttribute("data-tab"), id === "top" ? null : id);
  });

  /* ---------- Reveal on scroll (robust) ---------- */
  var reveals = [].slice.call(document.querySelectorAll(".reveal"));
  function show(el) { el.classList.add("in"); }

  function checkReveals() {
    var vh = window.innerHeight || document.documentElement.clientHeight;
    for (var i = reveals.length - 1; i >= 0; i--) {
      var el = reveals[i];
      var r = el.getBoundingClientRect();
      if (r.top < vh * 0.92 && r.bottom > 0) {
        show(el);
        reveals.splice(i, 1);
      }
    }
  }

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            show(e.target);
            io.unobserve(e.target);
            var idx = reveals.indexOf(e.target);
            if (idx > -1) reveals.splice(idx, 1);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    reveals.forEach(function (el) { io.observe(el); });
  }

  window.addEventListener("scroll", checkReveals, { passive: true });
  window.addEventListener("resize", checkReveals);
  window.addEventListener("load", checkReveals);
  checkReveals();
  // safety sweep: never leave content hidden, even where transitions don't composite
  setTimeout(checkReveals, 300);
  setTimeout(function () {
    document.querySelectorAll(".reveal:not(.in)").forEach(function (el) {
      el.classList.add("in");
      el.style.opacity = "1";
      el.style.transform = "none";
    });
  }, 1600);

  /* ---------- Hero bird parallax ---------- */
  var heroBird = document.getElementById("heroBird");
  if (heroBird && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.addEventListener(
      "scroll",
      function () {
        var y = window.scrollY;
        if (y < window.innerHeight) {
          heroBird.style.transform = "translateY(" + y * 0.08 + "px)";
        }
      },
      { passive: true }
    );
  }

  /* ---------- Birdsong toggle (visual only) ---------- */
  document.querySelectorAll(".bird-card__song").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var wasPlaying = btn.classList.contains("playing");
      document
        .querySelectorAll(".bird-card__song.playing")
        .forEach(function (b) {
          b.classList.remove("playing");
        });
      if (!wasPlaying) btn.classList.add("playing");
    });
  });

  /* ---------- Materials roadmap tabs ---------- */
  var tabs = document.querySelectorAll(".phase-tab");
  var barNat = document.getElementById("barNat");
  var barPet = document.getElementById("barPet");
  var legNat = document.getElementById("legNat");
  var legPet = document.getElementById("legPet");
  var figPhase = document.getElementById("figPhase");
  var figLabel = document.getElementById("figLabel");

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      tabs.forEach(function (t) {
        t.classList.remove("active");
      });
      tab.classList.add("active");
      var nat = tab.getAttribute("data-nat");
      var pet = tab.getAttribute("data-pet");
      barNat.style.width = nat + "%";
      barPet.style.width = pet + "%";
      legNat.textContent = nat + "%";
      legPet.textContent = pet + "%";
      figPhase.textContent = nat + "/" + pet;
      figLabel.textContent = tab.getAttribute("data-label");
    });
  });

  /* ---------- Signup ---------- */
  var form = document.getElementById("signup");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var email = document.getElementById("email").value.trim();
      if (!email) return;
      var en = (document.documentElement.lang || "es").indexOf("en") === 0;
      var msg = en
        ? "Thank you. We'll let you know when the first flight takes off. ✦"
        : "Gracias. Te avisaremos cuando el primer vuelo despegue. ✦";
      form.innerHTML = '<p class="signup--done">' + msg + "</p>";
    });
  }
})();
