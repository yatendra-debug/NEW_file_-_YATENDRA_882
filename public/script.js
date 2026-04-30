if (!localStorage.getItem("auth")) {
  window.location = "/login.html";
}

function logout() {
  localStorage.removeItem("auth");
  window.location = "/login.html";
}

async function sendMail() {
  const data = {
    name: name.value,
    email: email.value,
    pass: pass.value,
    subject: subject.value,
    message: message.value,
    recipients: recipients.value
  };

  const res = await fetch("/send", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(data)
  });

  const r = await res.json();

  if (r.status === "auth_error") return alert("APP Password Wrong");
  if (r.status === "limit") return alert("Limit Full");
  if (r.status === "fail") return alert("0");

  alert("Send -" + r.sent);
}
