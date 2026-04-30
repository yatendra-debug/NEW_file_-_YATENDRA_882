// auth check
if (!localStorage.getItem("auth")) {
  window.location = "/login.html";
}

// double click logout
const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("dblclick", () => {
  localStorage.removeItem("auth");
  window.location = "/login.html";
});

// prevent single click
logoutBtn.addEventListener("click", e => e.preventDefault());

async function sendMail() {
  const btn = document.querySelector(".send-btn");

  btn.innerText = "Sending...";
  btn.disabled = true;

  const res = await fetch("/send", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      pass: document.getElementById("pass").value,
      subject: document.getElementById("subject").value,
      message: document.getElementById("message").value,
      recipients: document.getElementById("recipients").value
    })
  });

  const r = await res.json();

  if (r.status === "auth_error") alert("APP Password Wrong");
  else if (r.status === "limit") alert("Limit Full");
  else if (r.status === "fail") alert("0");
  else alert("Send - " + r.sent);

  btn.innerText = "Send All";
  btn.disabled = false;
}
