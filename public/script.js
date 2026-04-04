// 🔐 LOGIN DETAILS
const USER = "2026";
const PASS = "2026";

// auto login check
window.onload = () => {
  if (localStorage.getItem("auth")) {
    showApp();
  }
};

// login function
function login() {
  const u = document.getElementById("loginUser").value.trim();
  const p = document.getElementById("loginPass").value.trim();

  if (!u || !p) {
    alert("⚠️ Enter ID & Password");
    return;
  }

  if (u === USER && p === PASS) {
    localStorage.setItem("auth", "true");
    showApp();
  } else {
    alert("❌ Wrong Login");
  }
}

// show app
function showApp() {
  document.getElementById("loginBox").style.display = "none";
  document.getElementById("app").style.display = "block";
}

// logout (DOUBLE CLICK SAFE)
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

// send
async function sendAll() {
  const data = {
    sender: sender.value,
    email: email.value,
    password: password.value,
    subject: subject.value,
    message: message.value,
    recipients: recipients.value,
  };

  const res = await fetch("/send", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(data),
  });

  const result = await res.json();
  alert(result.message);
}
