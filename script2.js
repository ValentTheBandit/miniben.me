// 🌐 Menü toggle mobilra
const toggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

toggle.addEventListener("click", () => {
  navLinks.classList.toggle("show");
});

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('show');
  });
});