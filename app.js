const ITENS_POR_PAGINA = 20;

let subcategorias = {};
let abaAtiva = 'amador';
let paginaAtual = 1;

// Inicializa a galeria com as subcategorias
function iniciarCategoriaMultiabas(catInicial, dadosSubcategorias) {
  subcategorias = dadosSubcategorias || {};

  const urlParams = new URLSearchParams(window.location.search);
  abaAtiva = urlParams.get('aba') || catInicial || 'amador';
  paginaAtual = parseInt(urlParams.get('pagina')) || 1;

  atualizarBotoesAbas();
  renderizarFeed();
}

// Troca de subcategoria ao clicar nos botões
function alternarAba(novaAba) {
  if (abaAtiva === novaAba) return;
  abaAtiva = novaAba;
  paginaAtual = 1;

  atualizarBotoesAbas();

  // Atualiza a URL sem dar refresh na página
  const url = new URL(window.location);
  url.searchParams.set('aba', abaAtiva);
  url.searchParams.set('pagina', 1);
  window.history.pushState({}, '', url);

  renderizarFeed();
}

// Atualiza o estado visual dos botões no HTML
function atualizarBotoesAbas() {
  const botoes = document.querySelectorAll('.tab-btn');
  botoes.forEach(btn => {
    btn.classList.remove('active');
  });

  const btnAtivo = document.getElementById(`tab-${abaAtiva}`);
  if (btnAtivo) {
    btnAtivo.classList.add('active');
  }
}

// Renderiza os vídeos ou fotos da subcategoria atual
function renderizarFeed() {
  const feedContainer = document.getElementById('feed-container');
  if (!feedContainer) return;

  feedContainer.innerHTML = '';
  const listaAtual = Array.isArray(subcategorias[abaAtiva]) ? subcategorias[abaAtiva] : [];

  if (listaAtual.length === 0) {
    feedContainer.innerHTML = `<p style="text-align:center; padding: 30px; color:#7f91a4;">Nenhum conteúdo encontrado nesta categoria.</p>`;
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

    // Trata links com parâmetro autoplay
    let urlPausada = link;
    if (urlPausada.includes('autoplay=1')) {
      urlPausada = urlPausada.replace('autoplay=1', 'autoplay=0');
    } else if (!urlPausada.includes('autoplay=0')) {
      urlPausada += urlPausada.includes('?') ? '&autoplay=0' : '?autoplay=0';
    }

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

// Gera a paginação do feed
function renderizarPaginacao(totalItens) {
  const paginacaoContainer = document.getElementById('pagination-controls');
  if (!paginacaoContainer) return;

  paginacaoContainer.innerHTML = '';
  const totalPaginas = Math.ceil(totalItens / ITENS_POR_PAGINA);

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

  const url = new URL(window.location);
  url.searchParams.set('aba', abaAtiva);
  url.searchParams.set('pagina', novaPagina);
  window.history.pushState({}, '', url);

  renderizarFeed();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
