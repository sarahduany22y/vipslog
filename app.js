// Configuração de 20 vídeos por página
const VIDEOS_POR_PAGINA = 20;

let listaVideosAtual = [];
let paginaAtual = 1;
let nomeCategoriaAtual = '';

// Função chamada na abertura das páginas
function iniciarCategoria(nomeCat, listaLinks) {
  nomeCategoriaAtual = nomeCat;
  listaVideosAtual = Array.isArray(listaLinks) ? listaLinks : [];

  // Pega a página atual pela URL (se existir) ou inicia na 1
  const urlParams = new URLSearchParams(window.location.search);
  paginaAtual = parseInt(urlParams.get('pagina')) || 1;

  renderizarFeed();
}

function renderizarFeed() {
  const feedContainer = document.getElementById('feed-container');
  feedContainer.innerHTML = '';

  if (listaVideosAtual.length === 0) {
    feedContainer.innerHTML = '<p style="text-align:center; padding: 20px; color:#888;">Nenhum vídeo encontrado nesta categoria.</p>';
    return;
  }

  // Recorta os 20 vídeos da página ativa
  const inicio = (paginaAtual - 1) * VIDEOS_POR_PAGINA;
  const fim = inicio + VIDEOS_POR_PAGINA;
  const videosDaPagina = listaVideosAtual.slice(inicio, fim);

  // Renderiza cada vídeo no estilo card do Telegram
  videosDaPagina.forEach((link, idx) => {
    const card = document.createElement('div');
    card.className = 'telegram-card';
    card.innerHTML = `
      <div class="video-wrapper">
        <iframe src="${link}" loading="lazy" allowfullscreen></iframe>
      </div>
      <div class="card-footer">
        <div class="reactions">
          <span class="reaction-btn">🔥 ${120 + (idx * 5)}</span>
          <span class="reaction-btn">❤️ ${45 + (idx * 2)}</span>
        </div>
        <span class="time">Postado recente</span>
      </div>
    `;
    feedContainer.appendChild(card);
  });

  renderizarPaginacao();
}

function renderizarPaginacao() {
  const paginacaoContainer = document.getElementById('pagination-controls');
  paginacaoContainer.innerHTML = '';

  const totalPaginas = Math.ceil(listaVideosAtual.length / VIDEOS_POR_PAGINA);

  if (totalPaginas <= 1) return;

  // Botão Anterior
  const btnAnterior = document.createElement('button');
  btnAnterior.className = 'page-btn';
  btnAnterior.innerText = '« Anterior';
  btnAnterior.disabled = paginaAtual === 1;
  btnAnterior.onclick = () => mudarPagina(paginaAtual - 1);
  paginacaoContainer.appendChild(btnAnterior);

  // Botões Numéricos
  for (let i = 1; i <= totalPaginas; i++) {
    const btnPage = document.createElement('button');
    btnPage.className = `page-btn ${i === paginaAtual ? 'active' : ''}`;
    btnPage.innerText = i;
    btnPage.onclick = () => mudarPagina(i);
    paginacaoContainer.appendChild(btnPage);
  }

  // Botão Próximo
  const btnProximo = document.createElement('button');
  btnProximo.className = 'page-btn';
  btnProximo.innerText = 'Próxima »';
  btnProximo.disabled = paginaAtual === totalPaginas;
  btnProximo.onclick = () => mudarPagina(paginaAtual + 1);
  paginacaoContainer.appendChild(btnProximo);
}

function mudarPagina(novaPagina) {
  paginaAtual = novaPagina;

  // Atualiza parâmetro da URL de forma limpa
  const url = new URL(window.location);
  url.searchParams.set('pagina', novaPagina);
  window.history.pushState({}, '', url);

  renderizarFeed();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
