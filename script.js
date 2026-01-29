/* =========================================
   DADOS DOS PRODUTOS
   ========================================= */
const produtos = [
    {
        id: 1,
        nome: "Conjunto Plus Size em Air Flow",
        categorias: ["Conjuntos", "Blusas", "Calça"],
        preco: 89.80, // Preço do conjunto
        isConjunto: true,
        video: "./videos/modelo1plusVid.mp4",
        pecas: [
            {
                nome: "Blusa",
                referencia: "0030011",
                preco: 34.90,
                cores: ["Bege", "Preto", "Verde"],
                tamanhos: ["G"]
            },
            {
                nome: "Calça",
                referencia: "1700022",
                preco: 54.90,
                cores: ["Bege", "Preto", "Verde"],
                tamanhos: ["G"]
            }
        ],
        imagens: [
            "./images/modeloplus1.jpeg",
            "./images/modeloplus1costa.jpeg",
            "./images/modeloplus1cores.jpg"
        ],
        tamanhos: ["G"],
        cores: ["Bege", "Preto", "Verde"],
        descricao: "Elegante e confortável, ideal para o dia a dia e trabalho."
    },
    {
        id: 2,
        nome: "Conjunto Alfaiataria Pink",
        categorias: ["Conjuntos", "Blusas", "Calças"],
        referencia: "CNJ-204", // REFERÊNCIA INTERNA
        preco: 189.00,
        imagens: [
            "./images/modelo2.jpeg",
            "./images/modelo2.1.jpeg"
        ],
        tamanhos: ["38", "40", "42"],
        cores: ["Bege", "Preto", "Pink"],
        descricao: "Conjunto de blazer cropped e short saia. Tecido crepe de alfaiataria premium."
    },
    {
        id: 3,
        nome: "Macacão Longo",
        categorias: ["Conjuntos"],
        referencia: "MAC-055", // REFERÊNCIA INTERNA
        preco: 149.90,
        imagens: [
            "./images/modelo3.jpeg",
            "./images/modelo3.1.jpeg"
        ],
        tamanhos: ["U"],
        cores: ["Verde", "Azul"],
        descricao: "Macacão longo pantalona, tamanho único (veste do 36 ao 42). Possui bojo."
    }
];

// CATEGORIAS - Você pode adicionar ou remover conforme necessário
const categorias = [
    "Saias",
    "Blusas",
    "Vestidos",
    "Conjuntos",
    "Macacões"
];

// ESTADO GLOBAL
let carrinho = [];
let produtoAtual = null;
let selecoes = { tamanho: null, cor: null, qtd: 1 };
const PEDIDO_MINIMO = 6;
let categoriaFiltro = null; // Controla qual categoria está ativa no catálogo
const VIDEOS_CAPA = [
    "./videos/modelo1vid.mp4",
    "./videos/modelo2vid.mp4",
    "./videos/modelo1plusVid.mp4"
];
let indiceVideoAtual = 0;

// 0.5. FUNÇÕES DE FILTRO DE CATÁLOGO
function mostrarCategoria(categoria) {
    categoriaFiltro = categoria;
    renderizarCatalogo();
    fecharModal('modal-filtro');
}

function mostrarTodos() {
    categoriaFiltro = null;
    renderizarCatalogo();
    fecharModal('modal-filtro');
}

function renderizarCatalogo() {
    const container = document.getElementById('revista');
    // Remove todas as seções de catálogo, mantém a capa
    const secoesCatalogo = container.querySelectorAll('.pagina:not(.capa)');
    secoesCatalogo.forEach(sec => sec.remove());
    
    // Filtra produtos, agora verifica se a categoria está no array de categorias do produto
    const produtosFiltrados = categoriaFiltro 
        ? produtos.filter(p => p.categorias.includes(categoriaFiltro))
        : produtos;
    
    // Adiciona novos produtos
    produtosFiltrados.forEach(produto => {
        const secao = document.createElement('section');
        secao.className = 'pagina';
        secao.id = `pagina-produto-${produto.id}`;
        
        // Se o produto tem vídeo, criar container para mídia
        if(produto.video) {
            secao.innerHTML = `
                <div class="midia-container" id="midia-${produto.id}">
                    <img class="midia-imagem" src="${produto.imagens[0]}" alt="${produto.nome}" style="width: 100%; height: 100%; object-fit: cover;">
                    <video class="midia-video" style="display: none; width: 100%; height: 100%; object-fit: cover;" autoplay loop muted playsinline>
                        <source src="${produto.video}" type="video/mp4">
                    </video>
                </div>
                <div class="overlay-gradiente">
                    <div class="info-rapida">
                        <h2>${produto.nome}</h2>
                        <p class="preco-lista">R$ ${produto.preco.toFixed(2).replace('.', ',')}</p>
                        <button class="btn-comprar-vitrine" onclick="abrirDetalhes(${produto.id})">
                            COMPRAR
                        </button>
                    </div>
                </div>
            `;
            container.appendChild(secao);
            // Iniciar transição de imagem para vídeo após renderizar
            setTimeout(() => iniciarTransicaoVideo(produto.id), 100);
        } else {
            secao.style.backgroundImage = `url('${produto.imagens[0]}')`;
            secao.innerHTML = `
                <div class="overlay-gradiente">
                    <div class="info-rapida">
                        <h2>${produto.nome}</h2>
                        <p class="preco-lista">R$ ${produto.preco.toFixed(2).replace('.', ',')}</p>
                        <button class="btn-comprar-vitrine" onclick="abrirDetalhes(${produto.id})">
                            COMPRAR
                        </button>
                    </div>
                </div>
            `;
            container.appendChild(secao);
        }
    });
} 

// 0.6. FUNÇÃO PARA TRANSIÇÃO DE IMAGEM PARA VÍDEO (Catálogo - 2 segundos)
function iniciarTransicaoVideo(produtoId) {
    const container = document.getElementById(`midia-${produtoId}`);
    if(!container) return;
    
    const imagem = container.querySelector('.midia-imagem');
    const video = container.querySelector('.midia-video');
    
    if(!imagem || !video) return;
    
    // Mostra a imagem por 2 segundos
    setTimeout(() => {
        // Fade out da imagem
        imagem.style.transition = 'opacity 0.5s ease-in-out';
        imagem.style.opacity = '0';
        
        // Mostra o vídeo
        setTimeout(() => {
            imagem.style.display = 'none';
            video.style.display = 'block';
            video.play();
        }, 500);
    }, 2000);
}

// 0.7. FUNÇÃO PARA TRANSIÇÃO DE VÍDEO NA CAPA (Alterna entre vídeos)
function iniciarTransicaoVideoCapa() {
    const container = document.getElementById('midia-capa');
    if(!container) return;
    
    const imagem = container.querySelector('.midia-imagem');
    const video = container.querySelector('.midia-video');
    
    if(!imagem || !video) return;
    
    // Mostra a imagem por 3 segundos
    setTimeout(() => {
        // Fade out da imagem
        imagem.style.transition = 'opacity 0.5s ease-in-out';
        imagem.style.opacity = '0';
        
        // Mostra o vídeo
        setTimeout(() => {
            imagem.style.display = 'none';
            video.style.display = 'block';
            video.src = VIDEOS_CAPA[indiceVideoAtual];
            video.play();
            
            // Alterna para o próximo vídeo quando este termina
            video.onended = () => {
                indiceVideoAtual = (indiceVideoAtual + 1) % VIDEOS_CAPA.length;
                video.src = VIDEOS_CAPA[indiceVideoAtual];
                video.play();
            };
        }, 500);
    }, 3000);
}

// 1. GERAÇÃO DA REVISTA
function carregarRevista() {
    const container = document.getElementById('revista');
    
    // Inicia transição de vídeo na capa (com 3 segundos e múltiplos vídeos)
    setTimeout(() => iniciarTransicaoVideoCapa(), 100);
    
    // Capa já está no HTML, agora carrega os produtos
    carregarCatalogo();
}

// 1.5. CARREGA CATÁLOGO APÓS A CAPA
function carregarCatalogo() {
    renderizarCatalogo();
}

// 2. NAVEGAÇÃO DESKTOP
function navegar(direcao) {
    const container = document.getElementById('revista');
    const larguraPagina = window.innerWidth;
    container.scrollBy({ left: direcao * larguraPagina, behavior: 'smooth' });
    
    // Controlar visibilidade do menu
    setTimeout(verificarVisibilidadeMenu, 100);
}

// Função para controlar visibilidade do menu
function verificarVisibilidadeMenu() {
    const container = document.getElementById('revista');
    const menuCapa = document.getElementById('menu-bottom');
    const menuCatalogo = document.getElementById('menu-catalogo');
    const scrollLeft = container.scrollLeft;
    const larguraPagina = window.innerWidth;
    const paginaAtual = Math.round(scrollLeft / larguraPagina);
    
    // Se estiver na primeira página (capa), mostrar menu completo
    if(paginaAtual === 0) {
        menuCapa.classList.remove('escondido');
        menuCatalogo.classList.add('escondido');
    } else {
        menuCapa.classList.add('escondido');
        menuCatalogo.classList.remove('escondido');
    }
    
    // Atualizar badge do menu catálogo
    const totalItens = carrinho.reduce((acc, item) => acc + item.qtd, 0);
    const badgeCatalogo = document.getElementById('badge-sacola-catalogo');
    if(badgeCatalogo) {
        badgeCatalogo.innerText = totalItens;
    }
}

// Função para voltar ao catálogo (primeira página)
function voltarAoCatalogo() {
    const container = document.getElementById('revista');
    container.scrollTo({ left: 0, behavior: 'smooth' });
}

// 3. MODAL DE DETALHES
function abrirDetalhes(id) {
    produtoAtual = produtos.find(p => p.id === id);
    if(!produtoAtual) return;

    selecoes = { tamanho: null, cor: null, qtd: 1, pecasQtd: {} };
    document.getElementById('modal-qtd').value = 1;
    
    document.getElementById('modal-titulo').innerText = produtoAtual.nome;
    
    // Se é um conjunto, exibir preço do conjunto + preços individuais das peças
    if(produtoAtual.isConjunto && produtoAtual.pecas) {
        let precoHTML = `<strong>Conjunto: R$ ${produtoAtual.preco.toFixed(2).replace('.', ',')}</strong><br><small style="opacity: 0.8; margin-top: 8px; display: block;">`;
        produtoAtual.pecas.forEach(peca => {
            precoHTML += `${peca.nome}: R$ ${peca.preco.toFixed(2).replace('.', ',')} | `;
            selecoes.pecasQtd[peca.nome] = 0; // Inicializa quantidade de cada peça
        });
        precoHTML = precoHTML.slice(0, -3) + '</small>'; // Remove último pipe
        document.getElementById('modal-preco').innerHTML = precoHTML;
        
        // Mostrar seletores de quantidade para cada peça
        mostrarSeletoresPecas();
        // Ocultar o seletor de quantidade geral
        document.getElementById('secao-qtd-geral').style.display = 'none';
    } else {
        document.getElementById('modal-preco').innerText = `R$ ${produtoAtual.preco.toFixed(2).replace('.', ',')}`;
        // Mostrar seletor de quantidade geral
        document.getElementById('secao-qtd-geral').style.display = 'block';
        // Ocultar seletores de peças
        const containerPecas = document.getElementById('secao-qtd-pecas');
        if(containerPecas) containerPecas.innerHTML = '';
    }
    
    document.getElementById('modal-desc').innerText = produtoAtual.descricao;

    // GALERIA
    const galeriaDiv = document.getElementById('modal-galeria');
    galeriaDiv.innerHTML = '';
    produtoAtual.imagens.forEach(imgUrl => {
        const img = document.createElement('img');
        img.src = imgUrl;
        img.className = 'foto-thumb';
        img.style.cursor = 'pointer';
        img.onclick = () => abrirImagemAmpliada(imgUrl);
        galeriaDiv.appendChild(img);
    });

    // BOTÕES DE OPÇÃO
    gerarBotoesOpcao('opcoes-cor', produtoAtual.cores, 'cor');
    gerarBotoesOpcao('opcoes-tamanho', produtoAtual.tamanhos, 'tamanho');

    document.getElementById('modal-compra').style.display = 'flex';
}

function mostrarSeletoresPecas() {
    if(!produtoAtual.isConjunto || !produtoAtual.pecas) return;
    
    const container = document.getElementById('secao-qtd-pecas');
    container.innerHTML = '<label style="font-weight: bold; margin-bottom: 10px; display: block;">Quantidade:</label>';
    
    // Seletor para o conjunto completo
    const wrapperConjunto = document.createElement('div');
    wrapperConjunto.className = 'peca-qtd-wrapper conjunto-wrapper';
    wrapperConjunto.style.backgroundColor = '#e8f5e9';
    wrapperConjunto.innerHTML = `
        <span class="peca-nome" style="font-weight: bold; color: #2e7d32;">Conjunto Completo (R$ ${produtoAtual.preco.toFixed(2).replace('.', ',')})</span>
        <div class="qtd-wrapper">
            <button onclick="mudarQtdPeca('Conjunto', -1)">-</button>
            <input type="number" id="qtd-Conjunto" value="0" min="0" onchange="atualizarQtdPeca('Conjunto', this.value)">
            <button onclick="mudarQtdPeca('Conjunto', 1)">+</button>
        </div>
    `;
    container.appendChild(wrapperConjunto);
    
    // Separador visual
    const separador = document.createElement('div');
    separador.style.height = '1px';
    separador.style.backgroundColor = '#ddd';
    separador.style.margin = '10px 0';
    container.appendChild(separador);
    
    // Seletores para peças individuais
    produtoAtual.pecas.forEach(peca => {
        const wrapper = document.createElement('div');
        wrapper.className = 'peca-qtd-wrapper';
        wrapper.innerHTML = `
            <span class="peca-nome">${peca.nome} (R$ ${peca.preco.toFixed(2).replace('.', ',')})</span>
            <div class="qtd-wrapper">
                <button onclick="mudarQtdPeca('${peca.nome}', -1)">-</button>
                <input type="number" id="qtd-${peca.nome}" value="0" min="0" onchange="atualizarQtdPeca('${peca.nome}', this.value)">
                <button onclick="mudarQtdPeca('${peca.nome}', 1)">+</button>
            </div>
        `;
        container.appendChild(wrapper);
    });
}

function gerarBotoesOpcao(idContainer, lista, tipo) {
    const container = document.getElementById(idContainer);
    container.innerHTML = '';
    lista.forEach(item => {
        const btn = document.createElement('div');
        btn.className = 'chip-btn';
        btn.innerText = item;
        btn.onclick = () => {
            document.querySelectorAll(`#${idContainer} .chip-btn`).forEach(b => b.classList.remove('selecionado'));
            btn.classList.add('selecionado');
            selecoes[tipo] = item;
        }
        container.appendChild(btn);
    });
}

function fecharModal(id) {
    document.getElementById(id).style.display = 'none';
}

// 4. CONTROLE DE QUANTIDADE (MODAL)
function mudarQtdModal(delta) {
    let novo = selecoes.qtd + delta;
    if(novo >= 1) {
        selecoes.qtd = novo;
        document.getElementById('modal-qtd').value = novo;
    }
}
function inputQtdModal(valor) {
    let novo = parseInt(valor);
    if(novo >= 1) selecoes.qtd = novo;
}

// 4.5 CONTROLE DE QUANTIDADE POR PEÇA (PARA CONJUNTOS)
function mudarQtdPeca(nomePeca, delta) {
    const input = document.getElementById(`qtd-${nomePeca}`);
    let novo = parseInt(input.value) + delta;
    if(novo >= 0) {
        selecoes.pecasQtd[nomePeca] = novo;
        input.value = novo;
    }
}
function atualizarQtdPeca(nomePeca, valor) {
    let novo = parseInt(valor);
    if(novo >= 0) {
        selecoes.pecasQtd[nomePeca] = novo;
    }
}

// 5. ADICIONAR AO CARRINHO
function adicionarAoCarrinho() {
    if(!selecoes.cor || !selecoes.tamanho) {
        mostrarToast("Selecione cor e tamanho!");
        return;
    }
    
    // Validar se é conjunto - precisa de pelo menos 1 peça
    if(produtoAtual.isConjunto && produtoAtual.pecas) {
        const qtdConjunto = selecoes.pecasQtd['Conjunto'] || 0;
        const totalPecasIndividuais = Object.entries(selecoes.pecasQtd)
            .filter(([nome]) => nome !== 'Conjunto')
            .reduce((a, [_, qtd]) => a + qtd, 0);
        
        if(qtdConjunto === 0 && totalPecasIndividuais === 0) {
            mostrarToast("Selecione a quantidade de pelo menos uma peça!");
            return;
        }
        
        // Se escolheu conjuntos completos, adicionar todas as peças
        if(qtdConjunto > 0) {
            produtoAtual.pecas.forEach(peca => {
                const item = {
                    id: `${produtoAtual.id}-${peca.nome}`,
                    nomeProduto: `${produtoAtual.nome} - ${peca.nome}`,
                    produtoId: produtoAtual.id,
                    pecaNome: peca.nome,
                    referencia: peca.referencia,
                    preco: peca.preco,
                    cor: selecoes.cor,
                    tamanho: selecoes.tamanho,
                    qtd: qtdConjunto,
                    isParteDaConjunto: true
                };
                carrinho.push(item);
            });
        }
        
        // Adicionar peças individuais (se houver)
        produtoAtual.pecas.forEach(peca => {
            if(selecoes.pecasQtd[peca.nome] > 0) {
                const item = {
                    id: `${produtoAtual.id}-${peca.nome}`,
                    nomeProduto: `${produtoAtual.nome} - ${peca.nome}`,
                    produtoId: produtoAtual.id,
                    pecaNome: peca.nome,
                    referencia: peca.referencia,
                    preco: peca.preco,
                    cor: selecoes.cor,
                    tamanho: selecoes.tamanho,
                    qtd: selecoes.pecasQtd[peca.nome]
                };
                carrinho.push(item);
            }
        });
        
        mostrarToast("Peças adicionadas à sacola!");
        fecharModal('modal-compra');
        atualizarContadorIcone();
        setTimeout(() => abrirCarrinho(), 500);
    } else {
        const existente = carrinho.find(item => 
            item.produto.id === produtoAtual.id && 
            item.cor === selecoes.cor && 
            item.tamanho === selecoes.tamanho
        );

        if(existente) {
            existente.qtd += selecoes.qtd;
            existente.total = existente.qtd * existente.produto.preco;
        } else {
            carrinho.push({
                produto: produtoAtual,
                ...selecoes,
                total: produtoAtual.preco * selecoes.qtd
            });
        }

        mostrarToast("Produto adicionado à sacola!");
        fecharModal('modal-compra');
        atualizarContadorIcone();
        setTimeout(() => abrirCarrinho(), 500);
    }
}

// 6. GERENCIAMENTO DO CARRINHO
function atualizarContadorIcone() {
    const totalItens = carrinho.reduce((acc, item) => acc + item.qtd, 0);
    const badgeSacola = document.getElementById('badge-sacola');
    if(badgeSacola) {
        badgeSacola.innerText = totalItens;
    }
    // Sincronizar com badge do menu catálogo
    const badgeCatalogo = document.getElementById('badge-sacola-catalogo');
    if(badgeCatalogo) {
        badgeCatalogo.innerText = totalItens;
    }
}

function abrirCarrinho() {
    renderizarCarrinho(); 
    document.getElementById('modal-carrinho').style.display = 'flex';
}

function renderizarCarrinho() {
    atualizarContadorIcone();
    const lista = document.getElementById('lista-itens-carrinho');
    lista.innerHTML = '';
    let total = 0;
    const totalItens = carrinho.reduce((acc, item) => acc + item.qtd, 0);

    const aviso = document.getElementById('aviso-atacado');
    const btnWhats = document.querySelector('.btn-whatsapp-final');
    
    if(totalItens < PEDIDO_MINIMO) {
        let faltam = PEDIDO_MINIMO - totalItens;
        aviso.innerHTML = `Faltam <b>${faltam}</b> peças para o pedido mínimo.`;
        aviso.style.backgroundColor = '#fff3cd';
        aviso.style.color = '#856404';
        if(btnWhats) btnWhats.style.opacity = '0.5'; 
    } else {
        aviso.innerHTML = "Pedido mínimo atingido! ✅";
        aviso.style.backgroundColor = '#d4edda';
        aviso.style.color = '#155724';
        if(btnWhats) btnWhats.style.opacity = '1';
    }

    if(carrinho.length === 0) {
        lista.innerHTML = '<p style="text-align:center; color:#999; margin-top:20px;">Sua sacola está vazia.</p>';
    } else {
        carrinho.forEach((item, index) => {
            // Suportar tanto items de conjunto quanto items normais
            const nomeProduto = item.nomeProduto || item.produto.nome;
            const precoItem = item.preco || item.produto.preco;
            const totalItem = precoItem * item.qtd;
            total += totalItem;
            
            // Encontrar a imagem do produto original
            let imagemUrl = '';
            if(item.produto && item.produto.imagens) {
                imagemUrl = item.produto.imagens[0];
            } else {
                // Para itens de conjunto, encontrar o produto original
                const produtoOriginal = produtos.find(p => p.id === item.produtoId);
                imagemUrl = produtoOriginal ? produtoOriginal.imagens[0] : '';
            }
            
            lista.innerHTML += `
                <div class="item-lista">
                    <img src="${imagemUrl}" alt="${nomeProduto}">
                    <div style="flex:1">
                        <h4>${nomeProduto}</h4>
                        <p style="font-size:0.8rem; color:#666">${item.cor} | ${item.tamanho}</p>
                        
                        <div class="acoes-carrinho">
                            <button class="btn-mini" onclick="alterarQtdCarrinho(${index}, -1)">-</button>
                            <input type="number" class="input-mini" value="${item.qtd}" onchange="inputQtdCarrinho(${index}, this.value)">
                            <button class="btn-mini" onclick="alterarQtdCarrinho(${index}, 1)">+</button>
                            <span style="margin-left:auto; font-weight:bold">R$ ${totalItem.toFixed(2).replace('.', ',')}</span>
                        </div>
                    </div>
                    <button onclick="removerItem(${index})" style="background:none; border:none; color:red; margin-left:10px">&times;</button>
                </div>
            `;
        });
    }
    
    document.getElementById('carrinho-total').innerText = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

function alterarQtdCarrinho(index, delta) {
    if(carrinho[index].qtd + delta >= 1) {
        carrinho[index].qtd += delta;
        renderizarCarrinho(); 
    }
}

function inputQtdCarrinho(index, valor) {
    let novo = parseInt(valor);
    if(novo >= 1) {
        carrinho[index].qtd = novo;
    } else {
        carrinho[index].qtd = 1; 
    }
    renderizarCarrinho();
}

function removerItem(index) {
    if(confirm("Remover este item?")) {
        carrinho.splice(index, 1);
        renderizarCarrinho();
    }
}

// 7. FINALIZAR PEDIDO (COM REFERÊNCIA)
function irParaWhatsappDireto() {
    window.open("https://wa.me/558598097181", "_blank");
}

function finalizarNoWhatsApp() {
    const totalItens = carrinho.reduce((acc, item) => acc + item.qtd, 0);
    
    if(totalItens < PEDIDO_MINIMO) {
        mostrarToast(`Faltam ${PEDIDO_MINIMO - totalItens} peças para o mínimo!`);
        return;
    }
    
    let msg = "*PEDIDO ATACADO (SITE):*\n\n";
    let total = 0;
    carrinho.forEach(item => {
        const nomeProduto = item.nomeProduto || item.produto.nome;
        const referencia = item.referencia || item.produto.referencia || 'N/A';
        const precoItem = item.preco || item.produto.preco;
        const totalItem = precoItem * item.qtd;
        
        msg += `▪ ${nomeProduto} (Ref: ${referencia})\n`;
        msg += `   ${item.tamanho} | ${item.cor} | Qtd: ${item.qtd}\n`;
        total += totalItem;
    });
    msg += `\n*TOTAL: R$ ${total.toFixed(2).replace('.', ',')}*`;
    msg += `\n\nAguardo dados para pagamento.`;
    
    window.open(`https://wa.me/558598097181?text=${encodeURIComponent(msg)}`, "_blank");
    fecharModal('modal-carrinho');
}

function mostrarToast(msg) {
    const t = document.getElementById('toast');
    t.innerText = msg;
    t.className = "mostrar";
    setTimeout(() => t.className = "", 1500);
}

// SOBRE NÓS
function abrirSobreNos() {
    document.getElementById('modal-sobre').style.display = 'flex';
}

// =========================================
// MODAL DE FILTRO DE CATEGORIAS
// =========================================

function abrirFiltrosCategorias() {
    document.getElementById('modal-filtro').style.display = 'flex';
}

// =========================================
// VISUALIZADOR DE IMAGEM AMPLIADA
// =========================================

function abrirImagemAmpliada(imagemUrl) {
    document.getElementById('imagem-ampliada-src').src = imagemUrl;
    document.getElementById('modal-imagem-ampliada').style.display = 'flex';
}

function fecharImagemAmpliada() {
    document.getElementById('modal-imagem-ampliada').style.display = 'none';
}

// Fechar ao clicar fora da imagem
document.addEventListener('DOMContentLoaded', function() {
    const modalImagem = document.getElementById('modal-imagem-ampliada');
    if(modalImagem) {
        modalImagem.addEventListener('click', function(e) {
            if(e.target === modalImagem) {
                fecharImagemAmpliada();
            }
        });
    }
    
    // Adicionar listener para scroll na revista
    const container = document.getElementById('revista');
    container.addEventListener('scroll', verificarVisibilidadeMenu);
});

// INICIALIZAR
carregarRevista();
