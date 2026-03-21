function cadastrar() {
  let email = document.getElementById("email").value;
  let senha = document.getElementById("senha").value;

  auth.createUserWithEmailAndPassword(email, senha)
    .then(() => alert("Conta criada!"))
    .catch(err => alert(err.message));
}

function login() {
  let email = document.getElementById("email").value;
  let senha = document.getElementById("senha").value;

  auth.signInWithEmailAndPassword(email, senha)
    .then(() => window.location.href = "index.html")
    .catch(err => alert(err.message));
}