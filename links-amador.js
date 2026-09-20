window.linksVideosAmador = window.linksVideosAmador || [];

async function carregarVideosAmadorAuto() {
  const STORAGE_ZONE_NAME = 'fotos-vip'; // Altere para a Storage Zone onde estão os vídeos
  const ACCESS_KEY = '933bafdd-56a8-40a5-92ddaa282360-fad2-4831';
  const PULL_ZONE_URL = 'https://midia-vip.b-cdn.net';
  const PASTA = 'ama'; // Nome da pasta na Bunny onde ficam os vídeos de amador

  const path = PASTA ? `${STORAGE_ZONE_NAME}/${encodeURIComponent(PASTA)}/` : `${STORAGE_ZONE_NAME}/`;

  const endpoints = [
    `https://storage.bunnycdn.com/${path}`,
    `https://br.storage.bunnycdn.com/${path}`,
    `https://la.storage.bunnycdn.com/${path}`
  ];

  for (const url of endpoints) {
    try {
      const res = await fetch(url, {
        headers: {
          'AccessKey': ACCESS_KEY,
          'accept': 'application/json'
        }
      });

      if (res.ok) {
        const data = await res.json();
        const arquivos = data.filter(item => !item.IsDirectory);
        const pastaFormatada = PASTA ? `${encodeURIComponent(PASTA.trim())}/` : '';
        
        window.linksVideosAmador = arquivos.map(
          f => `${PULL_ZONE_URL}/${pastaFormatada}${encodeURIComponent(f.ObjectName)}`
        );

        console.log(`[Bunny API] ${window.linksVideosAmador.length} vídeos amador carregados!`);

        // Atualiza a lista do app.js se a categoria amador estiver ativa
        if (typeof listaVideos !== 'undefined') {
          listaVideos = window.linksVideosAmador;
        }

        if (typeof abaAtiva !== 'undefined' && abaAtiva === 'videos' && typeof renderizarFeed === 'function') {
          renderizarFeed();
        }

        return;
      }
    } catch (e) {}
  }
}

carregarVideosAmadorAuto();
