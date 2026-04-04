const USER = "2026";
const PASS = "2026";

function login() {
  if (u.value === USER && p.value === PASS) {
    localStorage.setItem("auth", "1");
    show();
  } else {
    alert("Wrong");
  }
}

function show() {
  login.style.display = "none";
  app.style.display = "block";
}

if (localStorage.getItem("auth")) show();

function logout() {
  localStorage.clear();
  location.reload();
}

async function sendAll() {
  const res = await fetch("/send", {
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body:JSON.stringify({
      sender:sender.value,
      email:email.value,
      password:password.value,
      subject:subject.value,
      message:message.value,
      recipients:recipients.value
    })
  });

  alert((await res.json()).message);
}
