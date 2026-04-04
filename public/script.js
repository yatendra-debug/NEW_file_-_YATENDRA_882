// 🔐 simple login
const USER = "2026";
const PASS = "2026";

const inputUser = prompt("Enter ID:");
const inputPass = prompt("Enter Password:");

if (inputUser !== USER || inputPass !== PASS) {
  alert("❌ Wrong Login");
  document.body.innerHTML = "<h2 style='text-align:center'>Access Denied</h2>";
}

// send function
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

function logout() {
  location.reload();
}
