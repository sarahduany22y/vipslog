// player.js
function carregarVideos(listaLinks, tituloPersonalizado = "") {
  const container = document.getElementById('galeria-container');
  if (!container || !listaLinks) return;

  container.innerHTML = ''; 

  listaLinks.forEach((url, index) => {
    const card = document.createElement('div');
    card.className = 'video-card';

    const elementoTitulo = tituloPersonalizado 
      ? `<h3>${tituloPersonalizado} #${index + 1}</h3>` 
      : '';

    card.innerHTML = `
      ${elementoTitulo}
      <div class="video-wrapper">
        <iframe 
          src="${url}" 
          frameborder="0" 
          loading="lazy"
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;" 
          allowfullscreen>
        </iframe>
      </div>
    `;

    container.appendChild(card);
  });
}
