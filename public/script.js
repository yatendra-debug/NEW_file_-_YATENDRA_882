const USER="2026", PASS="2026";

function login(){
  if(user.value===USER && pass.value===PASS){
    localStorage.setItem("auth","1");
    show();
  } else alert("Wrong Login");
}

function show(){
  loginBox.style.display="none";
  appBox.style.display="block";
}

if(localStorage.getItem("auth")) show();

function logout(){
  localStorage.removeItem("auth");
  location.reload();
}

async function sendAll(){

  const btn=document.getElementById("sendBtn");

  const list=recipients.value.split(/[\n,]+/).filter(Boolean);

  if(list.length===0) return alert("Add emails");
  if(list.length>27) return alert("Limit 27/hour");

  btn.disabled=true;
  btn.innerText="Sending...";

  const res=await fetch("/send",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      sender:sender.value,
      email:email.value,
      password:password.value,
      subject:subject.value,
      message:message.value,
      recipients:recipients.value
    })
  });

  const r=await res.json();

  alert(r.success ? "Sent - "+r.count : r.message);

  btn.disabled=false;
  btn.innerText="Send All";
}
