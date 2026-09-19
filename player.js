// player.js - Com Paginação Automática
let paginaAtual = 1;
const videosPorPagina = 10; // Altere este número se quiser exibir mais ou menos vídeos por página

function carregarVideos(listaLinks, tituloPersonalizado = "") {
  const container = document.getElementById('galeria-container');
  if (!container || !listaLinks) return;

  // Calcula o total de páginas
  const totalPaginas = Math.ceil(listaLinks.length / videosPorPagina);
  if (paginaAtual > totalPaginas) paginaAtual = totalPaginas;
  if (paginaAtual < 1) paginaAtual = 1;

  // Descobre quais vídeos exibir na página atual
  const inicio = (paginaAtual - 1) * videosPorPagina;
  const fim = inicio + videosPorPagina;
  const videosDaPagina = listaLinks.slice(inicio, fim);

  // Renderiza os cards de vídeo da página atual
  container.innerHTML = ''; 

  videosDaPagina.forEach((url, index) => {
    const numeroVideo = inicio + index + 1;
    const card = document.createElement('div');
    card.className = 'video-card';

    const elementoTitulo = tituloPersonalizado 
      ? `<h3>${tituloPersonalizado} #${numeroVideo}</h3>` 
      : '';

    card.innerHTML = `
      ${elementoTitulo}
      <div class="video-wrapper">
        <div class="hide-drive-btn"></div>
        <iframe 
          src="${url}" 
          frameborder="0" 
          allowfullscreen>
        </iframe>
      </div>
    `;

    container.appendChild(card);
  });

  // Renderiza os botões de navegação da paginação
  renderizarPaginacao(listaLinks, tituloPersonalizado, totalPaginas);
}

function renderizarPaginacao(listaLinks, tituloPersonalizado, totalPaginas) {
  let navContainer = document.getElementById('paginacao-container');
  
  if (!navContainer) {
    navContainer = document.createElement('div');
    navContainer.id = 'paginacao-container';
    navContainer.style.cssText = 'display: flex; justify-content: center; align-items: center; gap: 15px; margin: 30px 0; width: 100%; grid-column: 1 / -1;';
    document.getElementById('galeria-container').after(navContainer);
  }

  if (totalPaginas <= 1) {
    navContainer.innerHTML = '';
    return;
  }

  navContainer.innerHTML = `
    <button id="btn-prev" style="background: #333; color: #fff; border: none; padding: 10px 18px; border-radius: 5px; cursor: pointer; font-weight: bold;" ${paginaAtual === 1 ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : ''}>← Anterior</button>
    <span style="color: #ccc; font-weight: bold;">Página ${paginaAtual} de ${totalPaginas}</span>
    <button id="btn-next" style="background: #e50914; color: #fff; border: none; padding: 10px 18px; border-radius: 5px; cursor: pointer; font-weight: bold;" ${paginaAtual === totalPaginas ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : ''}>Próxima →</button>
  `;

  document.getElementById('btn-prev')?.addEventListener('click', () => {
    if (paginaAtual > 1) {
      paginaAtual--;
      carregarVideos(listaLinks, tituloPersonalizado);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });

  document.getElementById('btn-next')?.addEventListener('click', () => {
    if (paginaAtual < totalPaginas) {
      paginaAtual++;
      carregarVideos(listaLinks, tituloPersonalizado);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
}
