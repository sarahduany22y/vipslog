async function carregarCategoria(arquivoJson, idContainer) {
  const container = document.getElementById(idContainer);

  try {
    const resposta = await fetch(arquivoJson);
    if (!resposta.ok) throw new Error(`Erro ao carregar ${arquivoJson}`);
    
    const videos = await resposta.json();
    container.innerHTML = '';

    if (videos.length === 0) {
      container.innerHTML = '<p class="text-gray-500 col-span-full">Nenhum vídeo encontrado nesta categoria.</p>';
      return;
    }

    videos.forEach(video => {
      const card = document.createElement('div');
      card.className = 'bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-gray-700 hover:border-gray-600 transition';

      card.innerHTML = `
        <div class="aspect-video w-full">
          <iframe 
            class="w-full h-full" 
            src="${video.url}" 
            title="${video.titulo}" 
            frameborder="0" 
            allowfullscreen>
          </iframe>
        </div>
        <div class="p-4">
          <h3 class="font-bold text-lg mb-1">${video.titulo}</h3>
          <p class="text-gray-400 text-sm">${video.descricao || ''}</p>
        </div>
      `;

      container.appendChild(card);
    });

  } catch (erro) {
    console.error(erro);
    container.innerHTML = '<p class="text-red-400 col-span-full">Falha ao carregar o conteúdo.</p>';
  }
}

// Inicializa o carregamento de cada categoria
document.addEventListener('DOMContentLoaded', () => {
  carregarCategoria('amador.json', 'grid-amador');
  carregarCategoria('lives.json', 'grid-lives');
});
