const formulario = document.getElementById("formulario");
const entrada = document.getElementById("entrada");
const lista = document.getElementById("lista");
const contador = document.getElementById("contador");
const botaoLimpar = document.getElementById("limpar");
const botoesFiltro = document.querySelectorAll(".filtro");

const CHAVE = "tarefas";
let tarefas = carregar();
let filtroAtual = "todas";

function carregar() {
  try {
    return JSON.parse(localStorage.getItem(CHAVE)) || [];
  } catch {
    return [];
  }
}

function salvar() {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(tarefas));
  } catch {
    // se o navegador bloquear o armazenamento, a lista continua funcionando
  }
}

function adicionar(texto) {
  tarefas.push({ id: Date.now(), texto, concluida: false });
  salvar();
  renderizar();
}

function alternar(id) {
  const tarefa = tarefas.find((t) => t.id === id);
  if (tarefa) tarefa.concluida = !tarefa.concluida;
  salvar();
  renderizar();
}

function apagar(id) {
  tarefas = tarefas.filter((t) => t.id !== id);
  salvar();
  renderizar();
}

function limparConcluidas() {
  tarefas = tarefas.filter((t) => !t.concluida);
  salvar();
  renderizar();
}

function visiveis() {
  if (filtroAtual === "pendentes") return tarefas.filter((t) => !t.concluida);
  if (filtroAtual === "concluidas") return tarefas.filter((t) => t.concluida);
  return tarefas;
}

function atualizarContador() {
  const pendentes = tarefas.filter((t) => !t.concluida).length;
  if (tarefas.length === 0) {
    contador.textContent = "Nenhuma tarefa ainda";
  } else if (pendentes === 0) {
    contador.textContent = "Tudo concluído!";
  } else {
    contador.textContent = pendentes === 1 ? "1 tarefa pendente" : `${pendentes} tarefas pendentes`;
  }
}

function renderizar() {
  lista.innerHTML = "";
  const itens = visiveis();

  if (itens.length === 0) {
    const vazio = document.createElement("li");
    vazio.className = "vazio";
    vazio.textContent = "Nada por aqui.";
    lista.appendChild(vazio);
  }

  itens.forEach((tarefa) => {
    const li = document.createElement("li");
    if (tarefa.concluida) li.classList.add("concluida");

    const caixa = document.createElement("input");
    caixa.type = "checkbox";
    caixa.checked = tarefa.concluida;
    caixa.addEventListener("change", () => alternar(tarefa.id));

    const texto = document.createElement("span");
    texto.textContent = tarefa.texto;

    const botao = document.createElement("button");
    botao.className = "apagar";
    botao.textContent = "×";
    botao.setAttribute("aria-label", "Apagar tarefa");
    botao.addEventListener("click", () => apagar(tarefa.id));

    li.append(caixa, texto, botao);
    lista.appendChild(li);
  });

  atualizarContador();
}

formulario.addEventListener("submit", (evento) => {
  evento.preventDefault();
  const texto = entrada.value.trim();
  if (!texto) return;
  adicionar(texto);
  entrada.value = "";
  entrada.focus();
});

botaoLimpar.addEventListener("click", limparConcluidas);

botoesFiltro.forEach((botao) => {
  botao.addEventListener("click", () => {
    filtroAtual = botao.dataset.filtro;
    botoesFiltro.forEach((b) => b.classList.toggle("ativo", b === botao));
    renderizar();
  });
});

renderizar();
