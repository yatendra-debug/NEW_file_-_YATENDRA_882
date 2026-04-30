if (!localStorage.getItem("auth")) {
  window.location = "/login.html";
}

function logout() {
  localStorage.removeItem("auth");
  window.location = "/login.html";
}

async function sendMail() {
  const btn = document.querySelector("button");

  const data = {
    name: name.value,
    email: email.value,
    pass: pass.value,
    subject: subject.value,
    message: message.value,
    recipients: recipients.value
  };

  if (!data.email || !data.pass) {
    alert("Fill Gmail + App Password");
    return;
  }

  // 🔥 BUTTON LOADING
  btn.innerText = "Sending...";
  btn.disabled = true;

  try {
    const res = await fetch("/send", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(data)
    });

    const r = await res.json();

    if (r.status === "auth_error") alert("APP Password Wrong");
    else if (r.status === "limit") alert("Limit Full");
    else if (r.status === "fail") alert("0");
    else alert("Send -" + r.sent);

  } catch {
    alert("Error");
  }

  // 🔥 BUTTON RESET
  btn.innerText = "Send All";
  btn.disabled = false;
}
