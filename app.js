const ITENS_POR_PAGINA = 20;

let subcategorias = {};
let abaAtiva = 'videos';
let paginaAtual = 1;

// ==========================================
// 1. SUPORTE A PÁGINAS COM VÁRIAS SUB-ABAS (Ex: Amador)
// ==========================================
function iniciarCategoriaMultiabas(catInicial, dadosSubcategorias) {
  subcategorias = dadosSubcategorias || {};

  const urlParams = new URLSearchParams(window.location.search);
  abaAtiva = urlParams.get('aba') || catInicial || Object.keys(subcategorias)[0] || 'videos';
  paginaAtual = parseInt(urlParams.get('pagina')) || 1;

  atualizarBotoesAbas();
  renderizarFeed();
}

// ==========================================
// 2. SUPORTE A PÁGINAS TRADICIONAIS (Ex: Hentai, Vazadas, Famosas)
// ==========================================
function iniciarCategoria(nomeCategoria, linksVideos = [], linksFotos = []) {
  subcategorias = {
    videos: Array.isArray(linksVideos) ? linksVideos : [],
    fotos: Array.isArray(linksFotos) ? linksFotos : []
  };

  const urlParams = new URLSearchParams(window.location.search);
  abaAtiva = urlParams.get('aba') || 'videos';
  paginaAtual = parseInt(urlParams.get('pagina')) || 1;

  atualizarBotoesAbas();
  renderizarFeed();
}

// ==========================================
// TROCA DE ABAS / SUB-CATEGORIAS
// ==========================================
function alternarAba(novaAba) {
  if (abaAtiva === novaAba) return;
  abaAtiva = novaAba;
  paginaAtual = 1;

  atualizarBotoesAbas();

  // Atualiza a URL sem recarregar a página
  const url = new URL(window.location);
  url.searchParams.set('aba', abaAtiva);
  url.searchParams.set('pagina', 1);
  window.history.pushState({}, '', url);

  renderizarFeed();
}

// Destinado a páginas antigas que chamavam alternarTipo('videos' ou 'fotos')
function alternarTipo(tipo) {
  alternarAba(tipo);
}

// Atualiza o botão ativo na tela
function atualizarBotoesAbas() {
  const botoes = document.querySelectorAll('.tab-btn');
  botoes.forEach(btn => btn.classList.remove('active'));

  // Tenta encontrar pelo ID padrão ou classe
  let btnAtivo = document.getElementById(`tab-${abaAtiva}`) || document.getElementById(`btn-${abaAtiva}`);
  if (!btnAtivo) {
    botoes.forEach(btn => {
      if (btn.getAttribute('onclick')?.includes(`'${abaAtiva}'`)) {
        btnAtivo = btn;
      }
    });
  }

  if (btnAtivo) {
    btnAtivo.classList.add('active');
  }
}

// ==========================================
// RENDERIZAÇÃO DO FEED DE VÍDEOS E FOTOS
// ==========================================
function renderizarFeed() {
  const feedContainer = document.getElementById('feed-container');
  if (!feedContainer) return;

  feedContainer.innerHTML = '';
  const listaAtual = Array.isArray(subcategorias[abaAtiva]) ? subcategorias[abaAtiva] : [];

  if (listaAtual.length === 0) {
    feedContainer.innerHTML = `<p style="text-align:center; padding: 40px; color:#7f91a4; grid-column: 1/-1;">Nenhum conteúdo encontrado nesta categoria.</p>`;
    const paginacao = document.getElementById('pagination-controls');
    if (paginacao) paginacao.innerHTML = '';
    return;
  }

  const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA;
  const fim = inicio + ITENS_POR_PAGINA;
  const itensDaPagina = listaAtual.slice(inicio, fim);

  itensDaPagina.forEach((link, idx) => {
    const card = document.createElement('div');
    card.className = 'telegram-card';

    if (abaAtiva === 'fotos') {
      card.innerHTML = `
        <div class="photo-wrapper">
          <img src="${link}" loading="lazy" alt="Foto da Galeria" />
        </div>
        <div class="card-footer">
          <div class="reactions">
            <span class="reaction-btn">🔥 ${90 + (idx * 4)}</span>
            <span class="reaction-btn">❤️ ${30 + (idx * 2)}</span>
          </div>
          <span class="time">Postado recente</span>
        </div>
      `;
    } else {
      let urlPausada = link;
      if (urlPausada.includes('autoplay=1')) {
        urlPausada = urlPausada.replace('autoplay=1', 'autoplay=0');
      } else if (!urlPausada.includes('autoplay=0')) {
        urlPausada += urlPausada.includes('?') ? '&autoplay=0' : '?autoplay=0';
      }

      card.innerHTML = `
        <div class="video-wrapper">
          <iframe src="${urlPausada}" loading="lazy" allowfullscreen frameborder="0"></iframe>
        </div>
        <div class="card-footer">
          <div class="reactions">
            <span class="reaction-btn">🔥 ${120 + (idx * 5)}</span>
            <span class="reaction-btn">❤️ ${45 + (idx * 2)}</span>
          </div>
          <span class="time">Postado recente</span>
        </div>
      `;
    }

    feedContainer.appendChild(card);
  });

  renderizarPaginacao(listaAtual.length);
}

// ==========================================
// PAGINAÇÃO
// ==========================================
function renderizarPaginacao(totalItens) {
  const paginacaoContainer = document.getElementById('pagination-controls');
  if (!paginacaoContainer) return;

  paginacaoContainer.innerHTML = '';
  const totalPaginas = Math.ceil(totalItens / ITENS_POR_PAGINA);

  if (totalPaginas <= 1) return;

  const btnAnterior = document.createElement('button');
  btnAnterior.className = 'page-btn';
  btnAnterior.innerText = '« Anterior';
  btnAnterior.disabled = paginaAtual === 1;
  btnAnterior.onclick = () => mudarPagina(paginaAtual - 1);
  paginacaoContainer.appendChild(btnAnterior);

  for (let i = 1; i <= totalPaginas; i++) {
    const btnPage = document.createElement('button');
    btnPage.className = `page-btn ${i === paginaAtual ? 'active' : ''}`;
    btnPage.innerText = i;
    btnPage.onclick = () => mudarPagina(i);
    paginacaoContainer.appendChild(btnPage);
  }

  const btnProximo = document.createElement('button');
  btnProximo.className = 'page-btn';
  btnProximo.innerText = 'Próxima »';
  btnProximo.disabled = paginaAtual === totalPaginas;
  btnProximo.onclick = () => mudarPagina(paginaAtual + 1);
  paginacaoContainer.appendChild(btnProximo);
}

function mudarPagina(novaPagina) {
  paginaAtual = novaPagina;

  const url = new URL(window.location);
  url.searchParams.set('aba', abaAtiva);
  url.searchParams.set('pagina', novaPagina);
  window.history.pushState({}, '', url);

  renderizarFeed();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
