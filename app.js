// Configuração do Supabase
const SUPABASE_URL = 'https://xjvkyofktqojuyequuxe.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhqdmt5b2ZrdHFvanV5ZXF1dXhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk2ODY3MjcsImV4cCI6MjEwNTI2MjcyN30.m80E1RrS-KvX7tc4nDJVaOzpCpJiukSO9BLeo7xV04E'; // Certifique-se de manter sua chave anon original aqui se necessário

// Inicializa o cliente do Supabase se a biblioteca estiver carregada
const _supabase = typeof supabase !== 'undefined' 
  ? supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) 
  : null;

/**
 * Função para verificar se o usuário atual tem acesso a uma categoria específica
 * @param {string|number} categoriaId - ID ou nome da categoria a ser verificada
 * @returns {Promise<boolean>}
 */
async function verificarAcessoCategoria(categoriaId) {
  if (!_supabase) {
    console.error('Supabase não inicializado.');
    return false;
  }

  try {
    // 1. Obtém o usuário logado
    const { data: { user }, error: userError } = await _supabase.auth.getUser();

    if (userError || !user) {
      console.log('Usuário não autenticado.');
      return false;
    }

    // 2. Consulta as compras pelo user_id OU pelo e-mail
    // Isso garante a liberação mesmo quando o webhook registra a compra pelo e-mail do cliente
    const { data: compras, error: comprasError } = await _supabase
      .from('compras_usuario')
      .select('*')
      .or(`user_id.eq.${user.id},email.eq.${user.email}`);

    if (comprasError) {
      console.error('Erro ao consultar compras no banco:', comprasError.message);
      return false;
    }

    if (!compras || compras.length === 0) {
      console.log('Nenhuma compra encontrada para este usuário.');
      return false;
    }

    // 3. Verifica se a categoria comprada bate com a categoria atual ou se é acesso total ('todas')
    const temAcesso = compras.some(item => {
      const catVal = String(item.categoria_id || item.categoria || '').toLowerCase();
      const targetVal = String(categoriaId).toLowerCase();
      
      return catVal === targetVal || catVal === 'todas' || catVal === 'all';
    });

    return temAcesso;

  } catch (err) {
    console.error('Erro inesperado na verificação de acesso:', err);
    return false;
  }
}

/**
 * Atualiza os elementos da interface de acordo com o status de acesso do usuário
 * @param {string|number} categoriaId 
 */
async function aplicarBloqueioOuLiberacao(categoriaId) {
  const liberado = await verificarAcessoCategoria(categoriaId);

  const containerBloqueado = document.getElementById('conteudo-bloqueado');
  const containerLiberado = document.getElementById('conteudo-liberado');
  const btnComprar = document.getElementById('btn-comprar');

  if (liberado) {
    if (containerBloqueado) containerBloqueado.style.display = 'none';
    if (containerLiberado) containerLiberado.style.display = 'block';
    if (btnComprar) btnComprar.style.display = 'none';
    console.log(`[Acesso Liberado] Categoria: ${categoriaId}`);
  } else {
    if (containerBloqueado) containerBloqueado.style.display = 'block';
    if (containerLiberado) containerLiberado.style.display = 'none';
    if (btnComprar) btnComprar.style.display = 'inline-block';
    console.log(`[Acesso Bloqueado] Categoria: ${categoriaId}`);
  }
}

// Executa a checagem automaticamente quando a página carrega
document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const categoriaAtual = params.get('cat') || window.categoriaId || '1';
  
  aplicarBloqueioOuLiberacao(categoriaAtual);
});
