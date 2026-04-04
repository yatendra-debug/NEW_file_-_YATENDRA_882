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
