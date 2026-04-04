// 🔐 LOGIN DETAILS
const USER = "2026";
const PASS = "2026";

// elements get karo (IMPORTANT FIX)
const loginBox = document.getElementById("login");
const appBox = document.getElementById("app");

const userInput = document.getElementById("u");
const passInput = document.getElementById("p");

// auto login check
window.onload = () => {
  if (localStorage.getItem("auth") === "1") {
    showApp();
  }
};

// login function (FIXED)
function login() {
  const u = userInput.value.trim();
  const p = passInput.value.trim();

  if (!u || !p) {
    alert("Enter ID & Password");
    return;
  }

  if (u === USER && p === PASS) {
    localStorage.setItem("auth", "1");
    showApp();
  } else {
    alert("❌ Wrong Login");
  }
}

// show app
function showApp() {
  loginBox.style.display = "none";
  appBox.style.display = "block";
}

// logout (double click logic)
let clicks = 0;

function logout() {
  clicks++;

  if (clicks === 1) {
    setTimeout(() => (clicks = 0), 400);
  } else {
    localStorage.removeItem("auth");
    location.reload();
  }
}

// send mail
async function sendAll() {
  const data = {
    sender: document.getElementById("sender").value,
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
    subject: document.getElementById("subject").value,
    message: document.getElementById("message").value,
    recipients: document.getElementById("recipients").value,
  };

  const res = await fetch("/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await res.json();
  alert(result.message);
}
