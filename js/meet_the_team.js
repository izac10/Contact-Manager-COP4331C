// This is for the footer in Contact-app.html
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".footer-toggle").forEach(btn => {
      const box = btn.closest(".footer").querySelector(".team-members");
      if (!box) return;
      // start collapsed
      btn.setAttribute("aria-expanded", "false");
      box.classList.remove("open");

      btn.addEventListener("click", () => {
        const open = btn.getAttribute("aria-expanded") !== "true";
        btn.setAttribute("aria-expanded", String(open));
        box.classList.toggle("open", open);
      });
    });
  });