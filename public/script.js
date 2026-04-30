async function send() {
  const data = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    pass: document.getElementById("pass").value,
    subject: document.getElementById("subject").value,
    message: document.getElementById("message").value,
    recipients: document.getElementById("recipients").value
  };

  const res = await fetch("/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  const result = await res.json();
  alert("Queued: " + result.total);
}
