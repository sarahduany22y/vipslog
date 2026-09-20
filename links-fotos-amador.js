// Cria o array global caso o site busque por ele imediatamente
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
        
        // Atualiza a variável global
        window.linksFotosAmador = arquivos.map(
          f => `${PULL_ZONE_URL}/${pastaFormatada}${encodeURIComponent(f.ObjectName)}`
        );

        console.log(`[Bunny API] ${window.linksFotosAmador.length} fotos carregadas!`);

        // Dispara eventos e atualizações comuns para renderizar a galeria na tela
        window.dispatchEvent(new Event('fotosCarregadas'));
        
        if (typeof renderizarFotos === 'function') renderizarFotos();
        if (typeof carregarFotos === 'function') carregarFotos();
        if (typeof renderGallery === 'function') renderGallery();
        if (typeof init === 'function') init();

        return;
      }
    } catch (e) {
      // Tenta o próximo servidor
    }
  }

  console.error('[Bunny API] Falha ao carregar as fotos.');
}

// Inicia o carregamento
carregarFotosAutomatico();
