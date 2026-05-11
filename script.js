const PASSWORD = "miniben2026";

const loginPage = document.getElementById("loginPage");
const app = document.getElementById("app");
const passwordInput = document.getElementById("passwordInput");
const errorMessage = document.getElementById("errorMessage");

function login() {
  const typedPassword = passwordInput.value;

  if (typedPassword === PASSWORD) {
    localStorage.setItem("isLoggedIn", "true");
    showApp();
  } else {
    errorMessage.textContent = "Hibás jelszó. Próbáld újra.";
    passwordInput.value = "";
  }
}

function logout() {
  localStorage.removeItem("isLoggedIn");
  loginPage.classList.remove("hidden");
  app.classList.add("hidden");
}

function showApp() {
  loginPage.classList.add("hidden");
  app.classList.remove("hidden");
}

passwordInput.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    login();
  }
});

if (localStorage.getItem("isLoggedIn") === "true") {
  showApp();
}