function carregarVideos(listaLinks) {
  const container = document.getElementById('galeria-container');
  if (!container || !listaLinks) return;

  container.innerHTML = ''; // Limpa o container

  listaLinks.forEach((url, index) => {
    const card = document.createElement('div');
    card.className = 'video-card';

    // Se for arquivo direto de vídeo (.mp4)
    if (url.endsWith('.mp4')) {
      card.innerHTML = `
        <h3>Vídeo #${index + 1}</h3>
        <video controls width="100%">
          <source src="${url}" type="video/mp4">
          Seu navegador não suporta a tag de vídeo.
        </video>
      `;
    } else {
      // Para links de Iframe / Embed
      card.innerHTML = `
        <h3>Vídeo #${index + 1}</h3>
        <iframe src="${url}" frameborder="0" allowfullscreen width="100%" height="315"></iframe>
      `;
    }

    container.appendChild(card);
  });
}
