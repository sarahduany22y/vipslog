<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Galeria Amador VIP 🔞</title>
  <link rel="stylesheet" href="estilo-telegram.css">

  <style>
    .tabs-container {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      justify-content: center;
      margin: 15px 0;
    }

    .tab-btn {
      padding: 10px 16px;
      border-radius: 8px;
      background: #17212b;
      color: #7f91a4;
      border: 1px solid #242f3d;
      font-weight: 600;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .tab-btn:hover {
      background: #202b36;
      color: #fff;
    }

    .tab-btn.active {
      background: #24a1de;
      color: #fff;
      border-color: #24a1de;
    }

    /* GRELHA RESPONSIVA: 2 COLUNAS NO PC, 1 COLUNA NO CELULAR */
    .video-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
      padding: 10px;
      max-width: 1000px;
      margin: 0 auto;
      box-sizing: border-box;
    }

    @media (min-width: 900px) {
      .video-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 600px) {
      .video-grid {
        grid-template-columns: 1fr;
        padding: 5px;
      }
    }

    /* CARTÃO DE VÍDEO */
    .media-card {
      background: #17212b;
      border: 1px solid #242f3d;
      border-radius: 10px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
    }

    .video-wrapper {
      position: relative;
      width: 100%;
      aspect-ratio: 16 / 9;
      background: #0e1621;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .play-card-btn {
      background: #24a1de;
      color: #fff;
      border: none;
      padding: 12px 24px;
      font-size: 15px;
      font-weight: bold;
      border-radius: 6px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: background 0.2s, transform 0.2s;
    }

    .play-card-btn:hover {
      background: #1d82b4;
      transform: scale(1.03);
    }

    .video-wrapper iframe {
      width: 100%;
      height: 100%;
      border: none;
    }

    .media-card img.foto-galeria {
      width: 100%;
      height: 240px;
      object-fit: cover;
      display: block;
    }
  </style>

  <!-- TRAVA DE SEGURANÇA SUPABASE -->
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
  <script>
    const SUPABASE_URL = 'https://xjvkyofktqojuyequuxe.supabase.co';
    const SUPABASE_ANON_KEY = 'sb_publishable__w-crANhzjiYKJuh2AX39w_Kz1-Rf74';
    const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    (async function protegerAcesso() {
      document.documentElement.style.display = 'none';

      const { data: { session } } = await _supabase.auth.getSession();

      if (!session) {
        alert("Você precisa estar logado para acessar esta galeria.");
        window.location.href = 'index.html';
        return;
      }

      const { data: compras, error } = await _supabase
        .from('compras_usuario')
        .select('data_expiracao')
        .eq('user_id', session.user.id)
        .eq('categoria_id', 'amador');

      if (error || !compras || compras.length === 0) {
        alert("Você não possui acesso a esta galeria.");
        window.location.href = 'index.html';
        return;
      }

      const agora = new Date();
      const temAcessoValido = compras.some(item => new Date(item.data_expiracao) > agora);

      if (!temAcessoValido) {
        alert("Seu plano para esta galeria expirou.");
        window.location.href = 'index.html';
        return;
      }

      document.documentElement.style.display = 'block';
    })();
  </script>
</head>
<body>

  <main class="telegram-feed">
    <div class="header-page">
      <h2>🔞Galeria Amador🔞</h2>
      <a href="index.html" class="btn-voltar">← Início</a>
    </div>

    <!-- SELETOR DE MÚLTIPLAS ABAS -->
    <div class="tabs-container">
      <button id="tab-amador" class="tab-btn active" onclick="alternarAba('amador')">📹 Amador - vazados - incesto</button>
      <button id="tab-omegle" class="tab-btn" onclick="alternarAba('omegle')">🎥 OmegleDark</button>
      <button id="tab-funk" class="tab-btn" onclick="alternarAba('funk')">🔥 Funk Proibidão</button>
      <button id="tab-tiktok" class="tab-btn" onclick="alternarAba('tiktok')">🎵 TikTok +18</button>
      <button id="tab-fotos" class="tab-btn" onclick="alternarAba('fotos')">🖼️ Fotos + vazadas</button>
    </div>

    <!-- Container do Feed em Grelha -->
    <div id="feed-container" class="video-grid"></div>

    <!-- Controles de Paginação -->
    <div id="pagination-controls" class="pagination-container"></div>
  </main>

  <!-- SCRIPTS DOS LINKS -->
  <script src="links-amador.js"></script>
  <script src="links-omegle.js"></script>
  <script src="links-funk.js"></script>
  <script src="links-tiktok.js"></script>
  <script src="links-flagras.js"></script>
  <script src="links-fotos-amador.js"></script>

  <!-- SCRIPT PRINCIPAL DA APLICAÇÃO -->
  <script src="app.js"></script>

  <!-- SCRIPT DE NAVEGAÇÃO E CARREGAMENTO DE VÍDEOS -->
  <script>
    document.addEventListener('DOMContentLoaded', () => {
      const subcategoriasAmador = {
        amador: window.linksAmador || [],
        omegle: window.linksOmegle || [],
        funk: window.linksFunk || [],
        tiktok: window.linksTiktok || [],
        flagras: window.linksFlagras || [],
        fotos: window.linksFotosAmador || []
      };

      let abaAtual = 'amador';
      let paginaAtual = 1;
      const ITENS_POR_PAGINA = 10;

      window.alternarAba = function(subcat) {
        abaAtual = subcat;
        paginaAtual = 1;
        
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        const btnAtivo = document.getElementById(`tab-${subcat}`);
        if (btnAtivo) btnAtivo.classList.add('active');

        renderizarFeed();
      };

      // REGRA: Carrega o Iframe apenas ao clicar e remove qualquer outro Iframe ativo para evitar múltiplos áudios
      window.carregarIframe = function(wrapper, url) {
        document.querySelectorAll('.video-wrapper iframe').forEach(iframe => {
          const containerPai = iframe.parentElement;
          const urlOriginal = iframe.getAttribute('data-url');
          if (containerPai && urlOriginal) {
            containerPai.innerHTML = `
              <button class="play-card-btn" onclick="carregarIframe(this.parentElement, '${urlOriginal}')">
                ▶ Assustar / Reproduzir Vídeo
              </button>[cite: 5]`;
          }
        });

        const urlComAutoplay = url.includes('?') ? `${url}&autoplay=true` : `${url}?autoplay=true`;
        wrapper.innerHTML = `<iframe src="${urlComAutoplay}" data-url="${url}" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
      };

      function renderizarFeed() {
        const container = document.getElementById('feed-container');
        const paginationControls = document.getElementById('pagination-controls');
        const lista = subcategoriasAmador[abaAtual] || [];

        if (!container) return;

        if (lista.length === 0) {
          container.innerHTML = '<p style="text-align:center; color:#fff; padding: 20px; grid-column: 1/-1;">Nenhum conteúdo nesta aba.</p>';
          if (paginationControls) paginationControls.innerHTML = '';
          return;
        }

        const totalPaginas = Math.ceil(lista.length / ITENS_POR_PAGINA);
        const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA;
        const fim = inicio + ITENS_POR_PAGINA;
        const itensPagina = lista.slice(inicio, fim);

        container.innerHTML = itensPagina.map((url, index) => {
          if (abaAtual === 'fotos' || (typeof url === 'string' && url.match(/\.(jpeg|jpg|gif|png|webp)($|\?)/i))) {
            return `
              <div class="media-card">
                <img src="${url}" class="foto-galeria" loading="lazy" alt="Foto Galeria" />
              </div>
            `;
          } else {
            return `
              <div class="media-card">
                <div class="video-wrapper">
                  <button class="play-card-btn" onclick="carregarIframe(this.parentElement, '${url}')">
                    ▶ Reproduzir Vídeo #${inicio + index + 1}
                  </button>
                </div>
              </div>
            `;
          }
        }).join('');

        if (paginationControls && totalPaginas > 1) {
          let btnHTML = `<div style="display:flex; justify-content:center; align-items:center; gap:10px; margin: 20px 0;">`;
          
          if (paginaAtual > 1) {
            btnHTML += `<button class="tab-btn" onclick="mudarPagina(${paginaAtual - 1})">← Anterior</button>`;
          }
          
          btnHTML += `<span style="color:#fff; font-weight:bold;">Página ${paginaAtual} de ${totalPaginas}</span>`;

          if (paginaAtual < totalPaginas) {
            btnHTML += `<button class="tab-btn" onclick="mudarPagina(${paginaAtual + 1})">Próxima →</button>`;
          }
          
          btnHTML += `</div>`;
          paginationControls.innerHTML = btnHTML;
        } else if (paginationControls) {
          paginationControls.innerHTML = '';
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
      }

      window.mudarPagina = function(novaPagina) {
        paginaAtual = novaPagina;
        renderizarFeed();
      };

      renderizarFeed();
    });
  </script>
</body>
</html>
