async function sendMail() {
  const data = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    pass: document.getElementById("pass").value,
    subject: document.getElementById("subject").value,
    message: document.getElementById("message").value,
    recipients: document.getElementById("recipients").value
  };

  if (!data.email || !data.pass) {
    alert("Gmail aur App Password required hai");
    return;
  }

  const res = await fetch("/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  const result = await res.json();
  alert("✅ Emails queued: " + result.total);
}
