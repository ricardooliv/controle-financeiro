let dados = [];
let tipoSelecionado = "receita";
auth.onAuthStateChanged(user => {
  if (!user) {
    window.location.href = "login.html";
  } else {
    carregarDados();
  }
});
function selecionarTipo(tipo) {
  tipoSelecionado = tipo;

  document.getElementById("btnReceita").classList.remove("ativo");
  document.getElementById("btnDespesa").classList.remove("ativo");

  if (tipo === "receita") {
    document.getElementById("btnReceita").classList.add("ativo");
  } else {
    document.getElementById("btnDespesa").classList.add("ativo");
  }
}
function formatarMoeda(valor) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

function carregarDados() {
  const user = auth.currentUser;

  db.collection("usuarios")
    .doc(user.uid)
    .get()
    .then(doc => {
      if (doc.exists) {
        dados = doc.data().dados || [];
      }
      atualizarTela();
    });
}

function salvarNaNuvem() {
  const user = auth.currentUser;

  db.collection("usuarios")
    .doc(user.uid)
    .set({ dados });
}

function adicionar() {
  let descricao = document.getElementById("descricao").value;
  let valor = Number(document.getElementById("valor").value);
  let tipo = tipoSelecionado;

  if (!descricao || !valor) return alert("Preencha tudo!");

  dados.push({ descricao, valor, tipo });

  salvarNaNuvem();
  atualizarTela();

  document.getElementById("descricao").value = "";
  document.getElementById("valor").value = "";
}

function remover(index) {
  dados.splice(index, 1);
  salvarNaNuvem();
  atualizarTela();
}

function atualizarTela() {
  let lista = document.getElementById("lista");

  let receitas = 0;
  let despesas = 0;

  lista.innerHTML = "";

  dados.forEach((item, index) => {
    let li = document.createElement("li");

    li.className = item.tipo === "receita" ? "receita-item" : "despesa-item";

    li.innerHTML = `
     <span>${item.descricao} - ${formatarMoeda(item.valor)}</span>
     <button onclick="remover(${index})">✕</button>
    `;

    item.tipo === "receita"
      ? receitas += item.valor
      : despesas += item.valor;

    lista.appendChild(li);
  });

 document.getElementById("totalReceitas").textContent = formatarMoeda(receitas);

document.getElementById("totalDespesas").textContent = formatarMoeda(despesas);

document.getElementById("saldo").textContent = formatarMoeda(receitas - despesas);
}
function logout() {
  auth.signOut().then(() => {
    window.location.href = "login.html";
  });
}
selecionarTipo("receita");