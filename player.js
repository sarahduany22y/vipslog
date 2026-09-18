// player.js
function carregarVideos(listaLinks, tituloPersonalizado = "") {
  const container = document.getElementById('galeria-container');
  if (!container || !listaLinks) return;

  container.innerHTML = ''; 

  listaLinks.forEach((url, index) => {
    const card = document.createElement('div');
    card.className = 'video-card';

    // Define se exibe o título ou deixa sem texto
    const elementoTitulo = tituloPersonalizado 
      ? `<h3>${tituloPersonalizado} #${index + 1}</h3>` 
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
}
