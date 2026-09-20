window.linksAmador = window.linksAmador || [];

async function carregarVideosAmadorAuto() {
  const LIBRARY_ID = '756775';
  const API_KEY = '9a701c8d-c881-4027-bdc7ca3d98d3-bf22-4d84';
  const PASTA = 'ama'; // Nome da pasta/coleção ou tag

  try {
    const response = await fetch(`https://video.bunnycdn.com/library/${LIBRARY_ID}/videos?itemsPerPage=100`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'AccessKey': API_KEY
      }
    });

    if (response.ok) {
      const data = await response.json();
      const items = data.items || [];

      // Filtra os vídeos pela pasta/coleção 'ama' ou pega todos se a pasta não estiver configurada no painel
      const videosFiltrados = items.filter(v => {
        if (!PASTA) return true;
        return (v.collectionId === PASTA || v.title.toLowerCase().includes(PASTA.toLowerCase()));
      });

      // Se a filtragem for muito restrita e não achar nada, utiliza a lista completa de vídeos
      const listaFinal = videosFiltrados.length > 0 ? videosFiltrados : items;

      // Gera as URLs dos IFrames de reprodução da Bunny Stream
      window.linksAmador = listaFinal.map(
        v => `https://iframe.mediadelivery.net/embed/${LIBRARY_ID}/${v.guid}`
      );

      console.log(`[Bunny Stream] ${window.linksAmador.length} vídeos amadores carregados!`);

      // Conecta diretamente com o app.js
      if (typeof listaVideos !== 'undefined') {
        listaVideos = window.linksAmador;
      }

      if (typeof abaAtiva !== 'undefined' && abaAtiva === 'videos' && typeof renderizarFeed === 'function') {
        renderizarFeed();
      }
    }
  } catch (e) {
    console.error('[Bunny Stream] Erro ao carregar vídeos amador:', e);
  }
}

carregarVideosAmadorAuto();
