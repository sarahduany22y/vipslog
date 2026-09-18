let paginaAtual = 1;
const videosPorPagina = 20;
let listaCompletaVideos = [];

function carregarVideos(arrayLinks, pagina = 1) {
  listaCompletaVideos = arrayLinks;
  paginaAtual = pagina;

  const container = document.getElementById('grid-videos'); // Certifique-se de que o ID do seu container é 'grid-videos'
  const paginacaoContainer = document.getElementById('paginacao'); // ID da div dos botões de paginação
  
  if (!container) return;
  
  container.innerHTML = ''; // Limpa os vídeos anteriores

  // Cálculo de índices para pegar apenas 20 vídeos
  const inicio = (paginaAtual - 1) * videosPorPagina;
  const fim = inicio + videosPorPagina;
  const videosDaPagina = listaCompletaVideos.slice(inicio, fim);
  const totalPaginas = Math.ceil(listaCompletaVideos.length / videosPorPagina);

  // Renderiza os 20 iframes com autoplay desativado
  videosDaPagina.forEach(link => {
    // Garante que o autoplay está desativado na URL
    const urlSemAutoplay = link.includes('?') 
      ? `${link}&autoplay=false` 
      : `${link}?autoplay=false`;

    const iframe = document.createElement('iframe');
    iframe.src = urlSemAutoplay;
    iframe.loading = "lazy"; // Carregamento sob demanda para não sobrecarregar
    iframe.allow = "accelerometer; gyroscope; encrypted-media; picture-in-picture";
    iframe.allowFullscreen = true;
    
    container.appendChild(iframe);
  });

  // Renderiza os botões de paginação
  if (paginacaoContainer) {
    paginacaoContainer.innerHTML = `
      <button onclick="mudarPagina(${paginaAtual - 1})" ${paginaAtual === 1 ? 'disabled' : ''}>Anterior</button>
      <span>Página ${paginaAtual} de ${totalPaginas}</span>
      <button onclick="mudarPagina(${paginaAtual + 1})" ${paginaAtual === totalPaginas ? 'disabled' : ''}>Próxima</button>
    `;
  }
}

function mudarPagina(novaPagina) {
  carregarVideos(listaCompletaVideos, novaPagina);
  window.scrollTo({ top: 0, behavior: 'smooth' }); // Rola para o topo ao mudar de página
}
