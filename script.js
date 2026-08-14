// ===== MENU MOBILE =====
const menuBtn = document.getElementById('menu-btn');
const menu = document.getElementById('menu');
menuBtn.addEventListener('click', () => menu.classList.toggle('aberto'));
menu.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => menu.classList.remove('aberto'))
);

// ===== ANIMAÇÃO AO ROLAR =====
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visivel');
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ===== HORTINHA VIRTUAL =====
const estagios = [
  { emoji: '🟫', msg: 'Terra fofinha e pronta! O que fazemos agora?', certo: 'plantar' },
  { emoji: '🌰', msg: 'Semente na terra! Do que ela precisa agora?', certo: 'regar' },
  { emoji: '🌱', msg: 'Brotou! Agora a plantinha quer...', certo: 'sol' },
  { emoji: '🌿', msg: 'Crescendo forte! Mais um cuidado...', certo: 'regar' },
  { emoji: '🌻', msg: 'Floresceu! Está na hora de...', certo: 'colher' }
];
const nomesAcao = { plantar: 'plantar 🌰', regar: 'regar 💧', sol: 'dar sol ☀️', colher: 'colher 🧺' };
const hortaEmoji = document.getElementById('horta-emoji');
const hortaMsg = document.getElementById('horta-msg');
const hortaPlacar = document.getElementById('horta-placar');
let estagio = 0, colheitas = 0;

function animarHorta(classe) {
  hortaEmoji.classList.remove('pop', 'shake');
  void hortaEmoji.offsetWidth; // reinicia a animação
  hortaEmoji.classList.add(classe);
}

function acaoHorta(acao) {
  const atual = estagios[estagio];
  if (acao === atual.certo) {
    if (acao === 'colher') {
      colheitas++;
      hortaPlacar.textContent = `🧺 Colheitas: ${colheitas}`;
      estagio = 0;
      hortaMsg.textContent = '🎉 Colheita feita! Vamos plantar de novo?';
    } else {
      estagio++;
      hortaMsg.textContent = estagios[estagio].msg;
    }
    hortaEmoji.textContent = estagios[estagio].emoji;
    animarHorta('pop');
  } else {
    animarHorta('shake');
    hortaMsg.textContent = `Ops! Agora não é hora de ${nomesAcao[acao]}. Dica: ${atual.msg}`;
  }
}
document.querySelectorAll('.horta-acoes button').forEach(b =>
  b.addEventListener('click', () => acaoHorta(b.dataset.acao))
);
hortaMsg.textContent = estagios[0].msg;

// ===== JOGO DA MEMÓRIA =====
const emojisJogo = ['🚜', '🌽', '', '💧', '🛰️', '🌻'];
const grid = document.getElementById('memoria-grid');
const elMov = document.getElementById('mem-mov');
const elPares = document.getElementById('mem-pares');
const elMsg = document.getElementById('mem-msg');
let viradas = [], travado = false, movimentos = 0, pares = 0;

function embaralhar(arr) { return arr.sort(() => Math.random() - 0.5); }

function atualizarPlacar() {
  elMov.textContent = `Movimentos: ${movimentos}`;
  elPares.textContent = `Pares: ${pares}/${emojisJogo.length}`;
}

function iniciarMemoria() {
  viradas = []; travado = false; movimentos = 0; pares = 0;
  elMsg.textContent = '';
  atualizarPlacar();
  grid.innerHTML = '';
  embaralhar([...emojisJogo, ...emojisJogo]).forEach(em => {
    const b = document.createElement('button');
    b.className = 'carta';
    b.dataset.emoji = em;
    b.textContent = '🌿';
    b.addEventListener('click', () => virarCarta(b));
    grid.appendChild(b);
  });
}

function virarCarta(b) {
  if (travado || b.classList.contains('virada') || b.classList.contains('certa')) return;
  b.classList.add('virada');
  b.textContent = b.dataset.emoji;
  viradas.push(b);
  if (viradas.length === 2) {
    movimentos++;
    const [a, c] = viradas;
    if (a.dataset.emoji === c.dataset.emoji) {
      a.classList.add('certa');
      c.classList.add('certa');
      pares++;
      viradas = [];
      if (pares === emojisJogo.length) {
        elMsg.textContent = `🎉 Você venceu em ${movimentos} movimentos!`;
      }
    } else {
      travado = true;
      setTimeout(() => {
        [a, c].forEach(x => { x.classList.remove('virada'); x.textContent = '🌿'; });
        viradas = []; travado = false;
      }, 800);
    }
    atualizarPlacar();
  }
}
document.getElementById('mem-reiniciar').addEventListener('click', iniciarMemoria);
iniciarMemoria();

// ===== QUIZ =====
const perguntas = [
  { p: 'O que o drone faz no campo?', o: ['Tira fotos e monitora as plantações 📸', 'Entrega pizza pro fazendeiro 🍕', 'Toca música pras plantas 🎵'], c: 0 },
  { p: 'Para que servem os sensores no solo?', o: ['Espantar passarinhos 🐦', 'Medir a umidade e os nutrientes da terra 🌡️', 'Contar as sementes uma a uma 🔢'], c: 1 },
  { p: 'O trator com GPS consegue...', o: ['Mudar a cor da plantação 🎨', 'Andar sozinho seguindo a linha certinho 🚜', 'Fazer sorvete de milho 🍦'], c: 1 },
  { p: 'O que é agricultura de precisão?', o: ['Usar tecnologia pra cuidar de cada cantinho do campo 🎯', 'Plantar só em dias de chuva 🌧️', 'Usar apenas ferramentas antigas ⚒️'], c: 0 },
  { p: 'Quem se beneficia com a tecnologia no campo?', o: ['Só os robôs 🤖', 'Ninguém, é tudo brincadeira 🙈', 'O produtor, a natureza e quem come 🌍💚'], c: 2 }
];
const progressoEl = document.getElementById('quiz-progresso');
const perguntaEl = document.getElementById('quiz-pergunta');
const opcoesEl = document.getElementById('quiz-opcoes');
const feedbackEl = document.getElementById('quiz-feedback');
const proximaBtn = document.getElementById('quiz-proxima');
let iPergunta = 0, pontos = 0, respondida = false, finalizado = false;

function mostrarPergunta() {
  respondida = false;
  const q = perguntas[iPergunta];
  progressoEl.textContent = `Pergunta ${iPergunta + 1} de ${perguntas.length}`;
  perguntaEl.textContent = q.p;
  feedbackEl.textContent = '';
  proximaBtn.classList.add('escondido');
  opcoesEl.innerHTML = '';
  q.o.forEach((op, i) => {
    const b = document.createElement('button');
    b.textContent = op;
    b.addEventListener('click', () => responder(b, i));
    opcoesEl.appendChild(b);
  });
}

function responder(b, i) {
  if (respondida) return;
  respondida = true;
  const q = perguntas[iPergunta];
  const botoes = opcoesEl.querySelectorAll('button');
  botoes.forEach(x => x.disabled = true);
  if (i === q.c) {
    b.classList.add('certa');
    pontos++;
    feedbackEl.textContent = '✅ Mandou bem!';
  } else {
    b.classList.add('errada');
    botoes[q.c].classList.add('certa');
    feedbackEl.textContent = `❌ Opa! A certa era: ${q.o[q.c]}`;
  }
  proximaBtn.classList.remove('escondido');
}

proximaBtn.addEventListener('click', () => {
  if (finalizado) {
    iPergunta = 0; pontos = 0; finalizado = false;
    mostrarPergunta();
    return;
  }
  if (iPergunta < perguntas.length - 1) {
    iPergunta++;
    mostrarPergunta();
  } else {
    finalizado = true;
    mostrarResultado();
  }
});

function mostrarResultado() {
  progressoEl.textContent = '🏁 Resultado final';
  let frase;
  if (pontos === perguntas.length) frase = '🏆 Incrível! Você é um gênio do campo!';
  else if (pontos >= 3) frase = '🌟 Muito bem! Continue aprendendo!';
  else frase = '🌱 Que tal jogar de novo e aprender mais?';
  perguntaEl.textContent = `Você fez ${pontos} de ${perguntas.length} pontos! ${frase}`;
  opcoesEl.innerHTML = '';
  feedbackEl.textContent = '';
  proximaBtn.textContent = 'Refazer 🔄';
});
mostrarPergunta();
