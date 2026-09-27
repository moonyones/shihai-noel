const CARTAS_MAXIMO = 20;
const ARQUIVO_CSV = "cartas.csv";

const quantidade = document.getElementById("quantidade");
const controleQuantidade = document.getElementById("controle-quantidade");
const gradeCartas = document.getElementById("grade-cartas");
const painel = document.getElementById("painel");
const resultados = document.getElementById("resultados");

let dados = [];
let quantidadeAtual = 1;

function setQuantidade(valor) {
  quantidadeAtual = Math.max(1, Math.min(CARTAS_MAXIMO, Number(valor)));

  quantidade.textContent = quantidadeAtual;
  controleQuantidade.value = quantidadeAtual;
}

document.getElementById("botao-diminuir").addEventListener("click", () => {
  setQuantidade(quantidadeAtual - 1);
});

document.getElementById("botao-aumentar").addEventListener("click", () => {
  setQuantidade(quantidadeAtual + 1);
});

controleQuantidade.addEventListener("input", () => {
  setQuantidade(controleQuantidade.value);
});

function lerCSV(texto) {
  return texto
    .trim()
    .split("\n")
    .slice(1)
    .map(linha => {
      const [nome, idade, desejo] = linha.split(",");

      return {
        nome: nome.trim(),
        idade: idade.trim(),
        desejo: desejo.trim()
      };
    });
}

async function carregarCSV() {
  const resposta = await fetch(ARQUIVO_CSV, { cache: "no-store" });
  dados = lerCSV(await resposta.text());
}

function gerarCartas(quantidade) {
  const nomes = dados.map(linha => linha.nome);
  const idades = dados.map(linha => linha.idade);
  const desejos = dados.map(linha => linha.desejo);

  const cartas = [];
  const usadas = new Set();

  while (cartas.length < quantidade) {
    const carta = {
      nome: nomes[Math.floor(Math.random() * nomes.length)],
      idade: idades[Math.floor(Math.random() * idades.length)],
      desejo: desejos[Math.floor(Math.random() * desejos.length)]
    };

    const chave = `${carta.nome}|||${carta.idade}|||${carta.desejo}`;

    if (!usadas.has(chave)) {
      usadas.add(chave);
      cartas.push(carta);
    }
  }

  return cartas;
}

function mostrarCartas(cartas) {
  gradeCartas.innerHTML = cartas.map((carta, indice) => `
    <article class="card" style="animation-delay:${indice * 55}ms">
      <h3 class="card-nome">${carta.nome}</h3>
      <p class="card-idade">${carta.idade} anos</p>
      <div class="card-divisao"></div>
      <p class="card-label">Desejo de Natal</p>
      <p class="card-desejo">${carta.desejo}</p>
    </article>
  `).join("");
}

async function sortearCartas() {
  mostrarCartas(gerarCartas(quantidadeAtual));

  painel.hidden = true;
  resultados.hidden = false;

  resultados.scrollIntoView({ behavior: "smooth" });
}

document.getElementById("botao-sortear")
  .addEventListener("click", sortearCartas);

document.getElementById("botao-voltar")
  .addEventListener("click", () => {
    resultados.hidden = true;
    painel.hidden = false;

    painel.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  });

carregarCSV();