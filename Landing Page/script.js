
document.addEventListener("DOMContentLoaded", function () {
  var navToggle = document.getElementById("navToggle");
  var mainNav = document.getElementById("main-nav");

  if (navToggle && mainNav) {
    navToggle.addEventListener("click", function () {
      var isOpen = mainNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    mainNav.addEventListener("click", function (event) {
      if (event.target.tagName === "A") {
        mainNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // Highlight the current page in the nav
  var currentPath = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll('[data-nav-link]').forEach(function (link) {
    var href = link.getAttribute("href");
    if (href === currentPath || (currentPath === "" && href === "index.html")) {
      link.classList.add("active");
    }
  });

  // Subtle entrance animation
  document.querySelectorAll("section, .page-section, .page-hero").forEach(function (el) {
    el.style.opacity = "0";
    el.style.transform = "translateY(10px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
  });

  requestAnimationFrame(function () {
    document.querySelectorAll("section, .page-section, .page-hero").forEach(function (el, i) {
      setTimeout(function () {
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      }, Math.min(i * 40, 220));
    });
  });

  // Simple course filter on courses page
  var filterButtons = document.querySelectorAll("[data-filter]");
  var filterCards = document.querySelectorAll("[data-course-tag]");
  if (filterButtons.length && filterCards.length) {
    filterButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var filter = btn.getAttribute("data-filter");
        filterButtons.forEach(function (b) { b.classList.remove("is-active"); });
        btn.classList.add("is-active");
        filterCards.forEach(function (card) {
          var tag = card.getAttribute("data-course-tag");
          card.style.display = (filter === "all" || tag === filter) ? "" : "none";
        });
      });
    });
  }
});
