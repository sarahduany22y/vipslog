// Configuração global
const ITENS_POR_PAGINA = 12; // Altere para a quantidade de mídias que deseja exibir por página

// Função principal que roda ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
    inicializarPagina();
});

function inicializarPagina() {
    // 1. Obtém os parâmetros da URL (ex: ?aba=videos&pagina=5)
    const urlParams = new URLSearchParams(window.location.search);
    const abaAtual = urlParams.get('aba') || 'videos'; // Categoria padrão é 'videos'
    const paginaAtual = parseInt(urlParams.get('pagina')) || 1;

    // 2. Seleciona a lista de dados correspondente à aba/categoria selecionada
    let listaMidias = [];
    if (abaAtual === 'videos' && window.linksHentai) {
        listaMidias = window.linksHentai;
    } else if (abaAtual === 'fotos' && window.fotosHentai) {
        listaMidias = window.fotosHentai;
    }
    // Adicione outras categorias/abas aqui conforme necessário

    // 3. Renderiza os itens e a paginação se houver dados
    if (listaMidias && listaMidias.length > 0) {
        renderizarConteudo(listaMidias, paginaAtual);
        renderizarPaginacao(listaMidias.length, paginaAtual, abaAtual);
    } else {
        const containerConteudo = document.getElementById('conteudo-midias');
        if (containerConteudo) {
            containerConteudo.innerHTML = '<p>Nenhuma mídia encontrada nesta categoria.</p>';
        }
    }
}

// Função para exibir as mídias da página atual
function renderizarConteudo(listaMidias, paginaAtual) {
    const containerConteudo = document.getElementById('conteudo-midias');
    if (!containerConteudo) return;

    // Calcula os índices de início e fim baseados na página atual
    const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA;
    const fim = inicio + ITENS_POR_PAGINA;

    // Extrai apenas os itens pertencentes à página atual
    const itensPaginaAtual = listaMidias.slice(inicio, fim);

    // Gera o HTML dos itens
    let html = '';
    itensPaginaAtual.forEach(item => {
        // Exemplo genérico de card/mídia (ajuste conforme seu HTML/layout original)
        html += `
            <div class="card-midia">
                <a href="${item.link || item.url || '#'}" target="_blank">
                    <img src="${item.thumb || item.imagem || ''}" alt="${item.titulo || 'Mídia'}" />
                    <h3>${item.titulo || 'Sem título'}</h3>
                </a>
            </div>
        `;
    });

    containerConteudo.innerHTML = html;
}

// Função para gerar a barra de paginação sem limite fixo de páginas
function renderizarPaginacao(totalItens, paginaAtual, abaAtual) {
    const containerPaginacao = document.getElementById('paginacao');
    if (!containerPaginacao) return;

    // Calcula o total de páginas com base na quantidade total de mídias
    const totalPaginas = Math.ceil(totalItens / ITENS_POR_PAGINA);

    if (totalPaginas <= 1) {
        containerPaginacao.innerHTML = '';
        return;
    }

    let htmlPaginacao = '<ul class="lista-paginacao">';

    // Botão "Anterior"
    if (paginaAtual > 1) {
        htmlPaginacao += `<li><a href="?aba=${abaAtual}&pagina=${paginaAtual - 1}">« Anterior</a></li>`;
    }

    // Geração de todos os botões numerados dinamicamente
    for (let i = 1; i <= totalPaginas; i++) {
        const classeAtiva = i === paginaAtual ? 'active' : '';
        htmlPaginacao += `<li><a href="?aba=${abaAtual}&pagina=${i}" class="${classeAtiva}">${i}</a></li>`;
    }

    // Botão "Próximo"
    if (paginaAtual < totalPaginas) {
        htmlPaginacao += `<li><a href="?aba=${abaAtual}&pagina=${paginaAtual + 1}">Próximo »</a></li>`;
    }

    htmlPaginacao += '</ul>';
    containerPaginacao.innerHTML = htmlPaginacao;
}
