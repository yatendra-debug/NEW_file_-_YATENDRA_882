// 🔐 LOGIN SYSTEM
const USER = "2026";
const PASS = "2026";

if (!localStorage.getItem("auth")) {
  const u = prompt("Enter ID:");
  const p = prompt("Enter Password:");

  if (u === USER && p === PASS) {
    localStorage.setItem("auth", "true");
  } else {
    document.body.innerHTML = "<h2 style='text-align:center'>❌ Access Denied</h2>";
    throw new Error("Blocked");
  }
}

// 📩 SEND
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
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();
  alert(result.message);
}

// 🔴 DOUBLE CLICK LOGOUT (REAL FIX)
let clickCount = 0;
let timer;

function logout() {
  clickCount++;

  if (clickCount === 1) {
    timer = setTimeout(() => {
      clickCount = 0;
    }, 400);
  } else if (clickCount === 2) {
    clearTimeout(timer);
    localStorage.removeItem("auth");
    location.reload();
  }
}
