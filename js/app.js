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

  document
    .getElementById(tipo === "receita" ? "btnReceita" : "btnDespesa")
    .classList.add("ativo");
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
  let descricao = document.getElementById("descricao").value.trim();
  let valor = Number(document.getElementById("valor").value);
  let categoria = document.getElementById("categoria").value;

  if (!descricao || valor <= 0 || !categoria) {
    alert("Preencha tudo!");
    return;
  }

  dados.push({
    descricao,
    valor,
    tipo: tipoSelecionado,
    categoria,
    data: new Date().toISOString() // 🔥 automático
  });

  salvarNaNuvem();
  atualizarTela();

  document.getElementById("descricao").value = "";
  document.getElementById("valor").value = "";
  document.getElementById("categoria").value = "";

  document.getElementById("descricao").focus();
}

function formatarData(data) {
  let d = new Date(data);
  return d.toLocaleDateString("pt-BR");
}

function remover(index) {
  if (!confirm("Remover essa transação?")) return;

  dados.splice(index, 1);
  salvarNaNuvem();
  atualizarTela();
}

function atualizarTela() {
  let lista = document.getElementById("lista");

  let receitas = 0;
  let despesas = 0;

  lista.innerHTML = "";

  // AGRUPAR POR DATA
  let grupos = {};

  dados.forEach(item => {
    let dataFormatada = formatarData(item.data);

    if (!grupos[dataFormatada]) {
      grupos[dataFormatada] = [];
    }

    grupos[dataFormatada].push(item);
  });

  // ORDENAR DATAS (mais recente primeiro)
  let datas = Object.keys(grupos).sort((a, b) => {
    return new Date(b.split("/").reverse()) - new Date(a.split("/").reverse());
  });

  datas.forEach(data => {
    // TITULO DA DATA
    let titulo = document.createElement("h3");
    titulo.textContent = "📅 " + data;
    titulo.style.margin = "15px 0 5px";
    titulo.style.fontSize = "14px";
    titulo.style.opacity = "0.7";

    lista.appendChild(titulo);

    grupos[data].forEach((item, index) => {
      let li = document.createElement("li");

      li.className =
        item.tipo === "receita" ? "receita-item" : "despesa-item";

      li.innerHTML = `
        <div>
          <span>${item.descricao}</span>

          <div class="categoria ${item.categoria}">
            ${getCategoriaNome(item.categoria)}
          </div>

          <div class="valor">${formatarMoeda(item.valor)}</div>
        </div>

        <button onclick="remover(${dados.indexOf(item)})">🗑️</button>
      `;

      item.tipo === "receita"
        ? receitas += item.valor
        : despesas += item.valor;

      lista.appendChild(li);
    });
  });

  document.getElementById("totalReceitas").textContent =
    formatarMoeda(receitas);

  document.getElementById("totalDespesas").textContent =
    formatarMoeda(despesas);

  let saldo = receitas - despesas;
  let saldoEl = document.getElementById("saldo");

  saldoEl.textContent = formatarMoeda(saldo);
  saldoEl.style.color = saldo < 0 ? "#ff5252" : "#fff";
}

function getCategoriaNome(cat) {
  const nomes = {
    comida: "🍔 Comida",
    transporte: "🚗 Transporte",
    contas: "📄 Contas",
    lazer: "🎮 Lazer",
    outros: "📦 Outros"
  };

  return nomes[cat] || cat;
}

function logout() {
  auth.signOut().then(() => {
    window.location.href = "login.html";
  });
}

selecionarTipo("receita");