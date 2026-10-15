// CONFIGURAÇÃO DO SUPABASE
const SUPABASE_URL = 'https://xjvkyofktqojuyequuxe.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable__w-crANhzjiYKJuh2AX39w_Kz1-Rf74'; 
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let usuarioAtual = null;
let categoriaPendente = null;

// LINKS DE CHECKOUT DA SYNCPAY / PLATAFORMA
const CHECKOUTS = {
  amador: "https://link.syncpayments.com.br/MicvMz",
  cam: "https://link.syncpayments.com.br/SEl2IQ",
  hentai: "https://link.syncpayments.com.br/cG8rFc",
  famosinhas: "https://link.syncpayments.com.br/YqNmqp",
  promo_30: "https://link.syncpayments.com.br/ronwrZ"
};

// INICIALIZAÇÃO DA SESSÃO AO CARREGAR A PÁGINA
window.onload = async () => {
  try {
    const { data: { session } } = await _supabase.auth.getSession();
    if (session) {
      usuarioAtual = session.user;
      atualizarHeader();
      await checarPermissoes();
    }
  } catch (err) {
    console.error("Erro ao verificar sessão inicial:", err);
  }
};

// ABRIR MODAL DE AUTENTICAÇÃO
function abrirModal(categoria = null) {
  categoriaPendente = categoria;
  const subtitle = document.getElementById('modal-subtitle');
  if (subtitle) {
    if (categoria) {
      subtitle.innerText = "Cadastre-se ou faça login com o e-mail que usará no pagamento.";
    } else {
      subtitle.innerText = "Acesse sua conta para visualizar suas galerias liberadas.";
    }
  }
  const modal = document.getElementById('modalAuth');
  if (modal) {
    modal.style.display = 'flex';
  }
}

// FECHAR MODAL DE AUTENTICAÇÃO
function fecharModal() {
  categoriaPendente = null;
  const modal = document.getElementById('modalAuth');
  if (modal) {
    modal.style.display = 'none';
  }
}

// INICIAR PROCESSO DE COMPRA
function iniciarCompra(categoria) {
  if (!usuarioAtual) {
    abrirModal(categoria);
  } else {
    irParaCheckout(categoria, usuarioAtual.email);
  }
}

// REDIRECIONAR PARA O CHECKOUT COM O E-MAIL DO USUÁRIO
function irParaCheckout(categoria, email) {
  const urlBase = CHECKOUTS[categoria];
  if (urlBase) {
    window.open(`${urlBase}?email=${encodeURIComponent(email)}`, '_blank');
  }
}

// AUTENTICAÇÃO (LOGIN / CADASTRO)
async function fazerAuth() {
  const elEmail = document.getElementById('auth-email');
  const elPass = document.getElementById('auth-pass');

  if (!elEmail || !elPass) return;

  const email = elEmail.value.trim();
  const password = elPass.value;

  if (!email || !password) {
    alert("Preencha e-mail e senha corretamente.");
    return;
  }

  try {
    let { data, error } = await _supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      const create = await _supabase.auth.signUp({ email, password });
      
      if (create.error) {
        alert("Erro na autenticação: " + create.error.message);
        return;
      }

      if (!create.data.session) {
        const relogin = await _supabase.auth.signInWithPassword({ email, password });
        data = relogin.data;
      } else {
        data = create.data;
      }
    }

    const session = data?.session || (await _supabase.auth.getSession()).data.session;
    
    if (session) {
      usuarioAtual = session.user;
      const catAcomprar = categoriaPendente;
      
      fecharModal();
      atualizarHeader();
      await checarPermissoes();

      if (catAcomprar) {
        irParaCheckout(catAcomprar, usuarioAtual.email);
      }
    } else {
      alert("Não foi possível autenticar. Verifique seus dados.");
    }
  } catch (err) {
    console.error("Erro na rotina de autenticação:", err);
    alert("Ocorreu um erro ao processar o login. Tente novamente.");
  }
}

// ATUALIZAR ÁREA DO CABEÇALHO COM E-MAIL E BOTÃO DE SAIR
function atualizarHeader() {
  const userArea = document.getElementById('user-area');
  if (userArea && usuarioAtual) {
    userArea.innerHTML = `
      <span style="margin-right:12px; font-size:12px; color:var(--text-sub);">${usuarioAtual.email}</span>
      <button class="auth-btn" onclick="deslogar()">Sair</button>
    `;
  }
}

// DESLOGAR DA SESSÃO
function deslogar() {
  _supabase.auth.signOut();
  location.reload();
}

// VERIFICAR COMPRAS NO SUPABASE E LIBERAR O BOTÃO DA GALERIA
async function checarPermissoes() {
  if (!usuarioAtual) return;

  try {
    const { data: compras, error } = await _supabase
      .from('compras_usuario')
      .select('categoria_id')
      .eq('user_id', usuarioAtual.id)
      .gt('data_expiracao', new Date().toISOString());

    if (error) {
      console.error("Erro ao consultar permissões no Supabase:", error);
      return;
    }

    // 1. VERIFICAÇÃO PARA A PÁGINA PRINCIPAL (INDEX)
    if (compras && compras.length > 0) {
      compras.forEach(item => {
        const catCompleta = item.categoria_id.toLowerCase();
        const catBase = catCompleta.split('_')[0];

        // Libera elementos visuais correspondentes ao plano na página index
        [catCompleta, catBase].forEach(c => {
          const badge = document.getElementById(`badge-${c}`);
          const btnBuy = document.getElementById(`buy-${c}`);
          const btnPaypal = document.getElementById(`paypal-${c}`);
          const btnAccess = document.getElementById(`access-${c}`);

          if (badge) { 
            badge.innerHTML = "🔓 Liberado"; 
            badge.className = "status-badge liberado"; 
          }
          if (btnBuy) btnBuy.style.setProperty('display', 'none', 'important');
          if (btnPaypal) btnPaypal.style.setProperty('display', 'none', 'important');
          if (btnAccess) btnAccess.style.display = "block";
        });
      });
    }

    // 2. VERIFICAÇÃO PARA AS PÁGINAS INTERNAS (EX: amador.html, cam.html, famosinhas.html)
    if (window.categoriaId) {
      const temAcessoPermitido = compras && compras.some(item => {
        const idBanco = item.categoria_id.toLowerCase();
        const catPagina = window.categoriaId.toLowerCase();
        return idBanco === catPagina || idBanco.startsWith(catPagina + '_') || idBanco.includes('promo');
      });

      const elLiberado = document.getElementById('conteudo-liberado');
      const elBloqueado = document.getElementById('conteudo-bloqueado');

      if (temAcessoPermitido) {
        if (elLiberado) elLiberado.style.display = 'block';
        if (elBloqueado) elBloqueado.style.display = 'none';
      } else {
        if (elLiberado) elLiberado.style.display = 'none';
        if (elBloqueado) elBloqueado.style.display = 'block';
      }
    }

  } catch (err) {
    console.error("Exceção na checagem de permissões:", err);
  }
}
