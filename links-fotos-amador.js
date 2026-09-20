// Função para buscar e carregar as fotos automaticamente
async function carregarFotosAutomatico() {
  const STORAGE_ZONE_NAME = 'fotos-vip';
  const ACCESS_KEY = '933bafdd-56a8-40a5-92ddaa282360-fad2-4831'; // Chave de acesso do menu Acesso
  const PULL_ZONE_URL = 'https://midia-vip.b-cdn.net';
  const PASTA = 'fotos ama';

  const path = PASTA ? `${STORAGE_ZONE_NAME}/${encodeURIComponent(PASTA)}/` : `${STORAGE_ZONE_NAME}/`;

  // Servidores regionais da Bunny para fallback
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
        
        // Filtra apenas arquivos (ignora pastas)
        const arquivos = data.filter(item => !item.IsDirectory);
        
        const pastaFormatada = PASTA ? `${encodeURIComponent(PASTA.trim())}/` : '';
        
        // Gera o array global com os links atualizados
        window.linksFotosAmador = arquivos.map(
          f => `${PULL_ZONE_URL}/${pastaFormatada}${encodeURIComponent(f.ObjectName)}`
        );

        console.log(`[Bunny API] ${window.linksFotosAmador.length} fotos carregadas com sucesso!`);
        
        // DISPARAR O RENDER DAS FOTOS AQUI:
        // Se seu site tem uma função que desenha as fotos na tela, chame ela aqui.
        if (typeof renderizarFotos === 'function') {
          renderizarFotos();
        }
        
        return;
      }
    } catch (e) {
      // Tenta o próximo endpoint se falhar
    }
  }

  console.error('[Bunny API] Não foi possível carregar as fotos da Bunny Storage.');
}

// Executa a busca ao carregar a página
document.addEventListener('DOMContentLoaded', carregarFotosAutomatico);
