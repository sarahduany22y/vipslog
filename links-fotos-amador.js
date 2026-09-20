// Garante o array global
window.linksFotosAmador = window.linksFotosAmador || [];

async function carregarFotosAutomatico() {
  const STORAGE_ZONE_NAME = 'fotos-vip';
  const ACCESS_KEY = '933bafdd-56a8-40a5-92ddaa282360-fad2-4831';
  const PULL_ZONE_URL = 'https://midia-vip.b-cdn.net';
  const PASTA = 'fotos ama';

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
        
        // Monta os links das fotos
        window.linksFotosAmador = arquivos.map(
          f => `${PULL_ZONE_URL}/${pastaFormatada}${encodeURIComponent(f.ObjectName)}`
        );

        console.log(`[Bunny API] ${window.linksFotosAmador.length} fotos carregadas!`);

        // CONEXÃO COM O APP.JS:
        // Atualiza a variável interna do app.js se ela já existir
        if (typeof listaFotos !== 'undefined') {
          listaFotos = window.linksFotosAmador;
        }

        // Se a aba de fotos estiver ativa no momento, redesenha o feed imediatamente
        if (typeof abaAtiva !== 'undefined' && abaAtiva === 'fotos' && typeof renderizarFeed === 'function') {
          renderizarFeed();
        }

        return;
      }
    } catch (e) {
      // Tenta o próximo endpoint se falhar
    }
  }

  console.error('[Bunny API] Falha ao carregar as fotos.');
}

// Executa a busca assim que o script carregar
carregarFotosAutomatico();
