// Configuração fixa de 20 vídeos por página
const VIDEOS_POR_PAGINA = 20;

// Obtém parâmetros da URL (Ex: categoria.html?cat=amador&pagina=1)
const urlParams = new URLSearchParams(window.location.search);
const categoriaAtual = urlParams.get('cat') || 'amador';
let paginaAtual = parseInt(urlParams.get('pagina')) || 1;

// Mapeamento das listas de links por categoria
const bancoDeDados = {
  amador: typeof window.linksAmador !== 'undefined' ? window.linksAmador : [],
  lives: typeof window.linksLives !== 'undefined' ? window.linksLives : [],
  hentai: typeof window.linksHentai !== 'undefined' ? window.linksHentai : []
};

// Seleção dos vídeos da categoria ativa
const listaVideos = bancoDeDados[categoriaAtual] || [];

function renderizarFeed() {
  const feedContainer = document.getElementById('feed-container');
  feedContainer.innerHTML = '';

  if (listaVideos.length === 0) {
    feedContainer.innerHTML = '<p style="text-align:center; padding: 20px;">Nenhum vídeo encontrado para esta categoria.</p>';
    return;
  }

  // Cálculo de paginação
  const inicio = (paginaAtual - 1) * VIDEOS_POR_PAGINA;
  const fim = inicio + VIDEOS_POR_PAGINA;
  const videosDaPagina = listaVideos.slice(inicio, fim);

  // Renderização dos 20 cards
  videosDaPagina.forEach((link, idx) => {
    const card = document.createElement('div');
    card.className = 'telegram-card';
    card.innerHTML = `
      <div class="video-wrapper">
        <iframe src="${link}" loading="lazy" allowfullscreen></iframe>
      </div>
      <div class="card-footer">
        <div class="reactions">
          <span class="reaction-btn">🔥 ${100 + (idx * 7)}</span>
          <span class="reaction-btn">❤️ ${40 + (idx * 3)}</span>
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

  const totalPaginas = Math.ceil(listaVideos.length / VIDEOS_POR_PAGINA);

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
  
  // Atualiza a URL sem recarregar a página
  const novaUrl = `${window.location.pathname}?cat=${categoriaAtual}&pagina=${novaPagina}`;
  window.history.pushState({ path: novaUrl }, '', novaUrl);
  
  renderizarFeed();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Inicializa a exibição na carga do documento
document.addEventListener('DOMContentLoaded', renderizarFeed);
