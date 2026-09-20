const ITENS_POR_PAGINA = 20;

let listaVideos = [];
let listaFotos = [];
let abaAtiva = 'videos'; // 'videos' ou 'fotos'
let paginaAtual = 1;

function iniciarCategoria(nomeCat, videos, fotos) {
  listaVideos = Array.isArray(videos) ? videos : [];
  listaFotos = Array.isArray(fotos) ? fotos : [];

  const urlParams = new URLSearchParams(window.location.search);
  abaAtiva = urlParams.get('aba') === 'fotos' ? 'fotos' : 'videos';
  paginaAtual = parseInt(urlParams.get('pagina')) || 1;

  atualizarBotoesAbas();
  renderizarFeed();
}

function alternarAba(novaAba) {
  if (abaAtiva === novaAba) return;
  abaAtiva = novaAba;
  paginaAtual = 1;

  atualizarBotoesAbas();

  // Atualiza URL sem dar F5
  const url = new URL(window.location);
  url.searchParams.set('aba', abaAtiva);
  url.searchParams.set('pagina', 1);
  window.history.pushState({}, '', url);

  renderizarFeed();
}

function atualizarBotoesAbas() {
  const btnVideos = document.getElementById('tab-videos');
  const btnFotos = document.getElementById('tab-fotos');

  if (btnVideos && btnFotos) {
    btnVideos.classList.toggle('active', abaAtiva === 'videos');
    btnFotos.classList.toggle('active', abaAtiva === 'fotos');
  }
}

function renderizarFeed() {
  const feedContainer = document.getElementById('feed-container');
  feedContainer.innerHTML = '';

  const listaAtual = abaAtiva === 'videos' ? listaVideos : listaFotos;

  if (listaAtual.length === 0) {
    const tipoTexto = abaAtiva === 'videos' ? 'vídeo' : 'foto';
    feedContainer.innerHTML = `<p style="text-align:center; padding: 30px; color:#7f91a4;">Nenhuma ${tipoTexto} encontrada nesta categoria.</p>`;
    document.getElementById('pagination-controls').innerHTML = '';
    return;
  }

  const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA;
  const fim = inicio + ITENS_POR_PAGINA;
  const itensDaPagina = listaAtual.slice(inicio, fim);

  itensDaPagina.forEach((link, idx) => {
    const card = document.createElement('div');
    card.className = 'telegram-card';

    if (abaAtiva === 'videos') {
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
    } else {
      card.innerHTML = `
        <div class="photo-wrapper">
          <img src="${link}" loading="lazy" alt="Foto do Canal" />
        </div>
        <div class="card-footer">
          <div class="reactions">
            <span class="reaction-btn">🔥 ${90 + (idx * 4)}</span>
            <span class="reaction-btn">❤️ ${30 + (idx * 2)}</span>
          </div>
          <span class="time">Postado recente</span>
        </div>
      `;
    }

    feedContainer.appendChild(card);
  });

  renderizarPaginacao(listaAtual.length);
}

function renderizarPaginacao(totalItens) {
  const paginacaoContainer = document.getElementById('pagination-controls');
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
