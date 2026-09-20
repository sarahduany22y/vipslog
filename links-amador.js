window.linksAmador = window.linksAmador || [];

async function carregarVideosAmadorAuto() {
  const LIBRARY_ID = '756775';
  const API_KEY = '9a701c8d-c881-4027-bdc7ca3d98d3-bf22-4d84';
  const PASTA = 'ama';

  let todosOsVideos = [];
  let pagina = 1;
  let temMaisPaginas = true;

  try {
    // Loop para buscar todas as páginas de vídeos da Bunny
    while (temMaisPaginas) {
      const response = await fetch(`https://video.bunnycdn.com/library/${LIBRARY_ID}/videos?page=${pagina}&itemsPerPage=100`, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'AccessKey': API_KEY
        }
      });

      if (!response.ok) break;

      const data = await response.json();
      const items = data.items || [];

      if (items.length > 0) {
        todosOsVideos = todosOsVideos.concat(items);
        
        // Se retornou menos de 100 itens, significa que é a última página da Bunny
        if (items.length < 100) {
          temMaisPaginas = false;
        } else {
          pagina++;
        }
      } else {
        temMaisPaginas = false;
      }
    }

    // Filtra os vídeos caso use pasta/coleção 'ama'
    const videosFiltrados = todosOsVideos.filter(v => {
      if (!PASTA) return true;
      return (v.collectionId === PASTA || v.title.toLowerCase().includes(PASTA.toLowerCase()));
    });

    // Se o filtro não achar nada, utiliza a lista completa baixada
    const listaFinal = videosFiltrados.length > 0 ? videosFiltrados : todosOsVideos;

    // Converte para as URLs de iframe
    window.linksAmador = listaFinal.map(
      v => `https://iframe.mediadelivery.net/embed/${LIBRARY_ID}/${v.guid}`
    );

    console.log(`[Bunny Stream] Total de ${window.linksAmador.length} vídeos amadores carregados!`);

    // Atualiza o app.js
    if (typeof listaVideos !== 'undefined') {
      listaVideos = window.linksAmador;
    }

    if (typeof abaAtiva !== 'undefined' && abaAtiva === 'videos' && typeof renderizarFeed === 'function') {
      renderizarFeed();
    }

  } catch (e) {
    console.error('[Bunny Stream] Erro ao carregar todos os vídeos amador:', e);
  }
}

carregarVideosAmadorAuto();
