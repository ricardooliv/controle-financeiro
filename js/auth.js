/* =========================
   CADASTRO
========================= */
function cadastrar() {
  let email = document.getElementById("email").value.trim();
  let senha = document.getElementById("senha").value.trim();

  if (!email || !senha) {
    alert("Preencha todos os campos!");
    return;
  }

  if (senha.length < 6) {
    alert("A senha deve ter pelo menos 6 caracteres.");
    return;
  }

  auth.createUserWithEmailAndPassword(email, senha)
    .then(() => {
      alert("Conta criada com sucesso!");
      window.location.href = "index.html";
    })
    .catch(err => {
      tratarErro(err);
    });
}

/* =========================
   LOGIN
========================= */
function login() {
  let email = document.getElementById("email").value.trim();
  let senha = document.getElementById("senha").value.trim();

  if (!email || !senha) {
    alert("Preencha todos os campos!");
    return;
  }

  auth.signInWithEmailAndPassword(email, senha)
    .then(() => {
      window.location.href = "index.html";
    })
    .catch(err => {
      tratarErro(err);
    });
}

/* =========================
   TRATAR ERROS (PROFISSIONAL)
========================= */
function tratarErro(err) {
  let mensagem = "Erro ao tentar acessar.";

  switch (err.code) {
    case "auth/email-already-in-use":
      mensagem = "Esse email já está cadastrado.";
      break;

    case "auth/invalid-email":
      mensagem = "Email inválido.";
      break;

    case "auth/user-not-found":
      mensagem = "Usuário não encontrado.";
      break;

    case "auth/wrong-password":
      mensagem = "Senha incorreta.";
      break;

    case "auth/weak-password":
      mensagem = "Senha muito fraca.";
      break;
  }

  alert(mensagem);
}