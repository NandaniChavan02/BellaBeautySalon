/* ============ Bella Beauty Salon — plain JavaScript ============ */

(function () {
  "use strict";

  /* ---- footer year ---- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- mobile menu ---- */
  var menuBtn = document.getElementById("menuBtn");
  var nav = document.getElementById("nav");

  if (menuBtn && nav) {
    menuBtn.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
      menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });

    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        nav.classList.remove("open");
        menuBtn.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---- header shadow on scroll ---- */
  var header = document.getElementById("siteHeader");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---- fade cards in as they appear ---- */
  var revealables = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var revealer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealables.forEach(function (el) { revealer.observe(el); });
  } else {
    revealables.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---- booking form ---- */
  var form = document.getElementById("bookForm");
  var thanks = document.getElementById("thanks");
  var againBtn = document.getElementById("againBtn");
  var dateInput = document.getElementById("date");

  if (dateInput) {
    var pad = function (n) { return String(n).padStart(2, "0"); };
    var today = new Date();
    var max = new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000);
    var iso = function (d) {
      return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
    };
    dateInput.min = iso(today);
    dateInput.max = iso(max);
  }

  /* ---- preselect a service when arriving from the Services page ---- */
  var serviceSelect = document.getElementById("service");
  if (serviceSelect && window.URLSearchParams) {
    var wanted = new URLSearchParams(window.location.search).get("service");
    if (wanted) {
      Array.prototype.forEach.call(serviceSelect.options, function (opt) {
        if (opt.text === wanted) serviceSelect.value = opt.text;
      });
    }
  }

  function setError(field, message) {
    var input = document.getElementById(field);
    var note = document.querySelector('.err[data-for="' + field + '"]');
    if (note) note.textContent = message || "";
    if (input) input.classList.toggle("invalid", Boolean(message));
    return !message;
  }

  function validate() {
    var name = document.getElementById("name").value.trim();
    var phone = document.getElementById("phone").value.trim();
    var service = document.getElementById("service").value;
    var date = document.getElementById("date").value;

    var ok = true;
    ok = setError("name", name.length >= 2 ? "" : "Please tell us your name.") && ok;
    ok = setError("phone", /^[6-9]\d{9}$/.test(phone.replace(/[\s-]/g, "")) ? "" : "Enter a valid 10-digit mobile number.") && ok;
    ok = setError("service", service ? "" : "Please choose a service.") && ok;
    ok = setError("date", date ? "" : "Please pick a date.") && ok;
    return ok;
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validate()) return;

      document.getElementById("thanksName").textContent = document.getElementById("name").value.trim();
      document.getElementById("thanksService").textContent = document.getElementById("service").value;
      var d = new Date(document.getElementById("date").value + "T00:00:00");
      document.getElementById("thanksDate").textContent = d.toLocaleDateString(undefined, {
        weekday: "long", day: "numeric", month: "long"
      });

      form.hidden = true;
      thanks.hidden = false;
      thanks.scrollIntoView({ behavior: "smooth", block: "center" });
    });

    form.addEventListener("input", function (e) {
      if (e.target.id) setError(e.target.id, "");
    });
  }

  if (againBtn && form) {
    againBtn.addEventListener("click", function () {
      form.reset();
      thanks.hidden = true;
      form.hidden = false;
      form.scrollIntoView({ behavior: "smooth", block: "center" });
      document.getElementById("name").focus();
    });
  }
})();
