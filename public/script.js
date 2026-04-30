async function sendMail() {
  const btn = document.querySelector(".send-btn");

  btn.innerText = "Sending...";
  btn.disabled = true;

  try {
    const res = await fetch("/send", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        name: name.value,
        email: email.value,
        pass: pass.value,
        subject: subject.value,
        message: message.value,
        recipients: recipients.value
      })
    });

    const r = await res.json();

    if (r.status === "auth_error") {
      alert("APP Password Wrong");
    } else if (r.status === "limit") {
      alert("Limit Full");
    } else if (r.status === "fail") {
      alert("0");
    } else {
      alert("Send - " + r.sent);
    }

  } catch (err) {
    alert("Server Error");
  }

  btn.innerText = "Send All";
  btn.disabled = false;
}
