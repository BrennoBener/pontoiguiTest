/* =========================================
   DADOS DOS PRODUTOS
   ========================================= */
const produtos = [
    {
        id: 1,
        nome: "Vestido Midi Floral",
        referencia: "VST-001", // REFERÊNCIA INTERNA (Oculta no site)
        preco: 129.90,
        imagens: [
            "./images/modelo1.jpeg",
            "./images/modelo1.2.jpeg",
            "./images/modelo1.1.jpeg"
        ],
        tamanhos: ["P", "M", "G"],
        cores: ["Estampado", "Vermelho"],
        descricao: "Vestido midi em viscose com fenda lateral. Tecido leve e fresco, ideal para o verão."
    },
    {
        id: 2,
        nome: "Conjunto Alfaiataria",
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

// ESTADO GLOBAL
let carrinho = [];
let produtoAtual = null;
let selecoes = { tamanho: null, cor: null, qtd: 1 };
const PEDIDO_MINIMO = 6; 

// 1. GERAÇÃO DA REVISTA
function carregarRevista() {
    const container = document.getElementById('revista');
    
    produtos.forEach(produto => {
        const secao = document.createElement('section');
        secao.className = 'pagina';
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
    });
}

// 2. NAVEGAÇÃO DESKTOP
function navegar(direcao) {
    const container = document.getElementById('revista');
    const larguraPagina = window.innerWidth;
    container.scrollBy({ left: direcao * larguraPagina, behavior: 'smooth' });
}

// 3. MODAL DE DETALHES
function abrirDetalhes(id) {
    produtoAtual = produtos.find(p => p.id === id);
    if(!produtoAtual) return;

    selecoes = { tamanho: null, cor: null, qtd: 1 };
    document.getElementById('modal-qtd').value = 1;
    
    document.getElementById('modal-titulo').innerText = produtoAtual.nome;
    document.getElementById('modal-preco').innerText = `R$ ${produtoAtual.preco.toFixed(2).replace('.', ',')}`;
    document.getElementById('modal-desc').innerText = produtoAtual.descricao;

    // GALERIA
    const galeriaDiv = document.getElementById('modal-galeria');
    galeriaDiv.innerHTML = '';
    produtoAtual.imagens.forEach(imgUrl => {
        const img = document.createElement('img');
        img.src = imgUrl;
        img.className = 'foto-thumb';
        galeriaDiv.appendChild(img);
    });

    // BOTÕES DE OPÇÃO
    gerarBotoesOpcao('opcoes-cor', produtoAtual.cores, 'cor');
    gerarBotoesOpcao('opcoes-tamanho', produtoAtual.tamanhos, 'tamanho');

    document.getElementById('modal-compra').style.display = 'flex';
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

// 5. ADICIONAR AO CARRINHO
function adicionarAoCarrinho() {
    if(!selecoes.cor || !selecoes.tamanho) {
        mostrarToast("Selecione cor e tamanho!");
        return;
    }

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

    fecharModal('modal-compra');
    atualizarContadorIcone(); 
    mostrarToast("Adicionado à sacola!");
}

// 6. GERENCIAMENTO DO CARRINHO
function atualizarContadorIcone() {
    const totalItens = carrinho.reduce((acc, item) => acc + item.qtd, 0);
    document.getElementById('cont-carrinho').innerText = totalItens;
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
        btnWhats.style.opacity = '0.5'; 
    } else {
        aviso.innerHTML = "Pedido mínimo atingido! ✅";
        aviso.style.backgroundColor = '#d4edda';
        aviso.style.color = '#155724';
        btnWhats.style.opacity = '1';
    }

    if(carrinho.length === 0) {
        lista.innerHTML = '<p style="text-align:center; color:#999; margin-top:20px;">Sua sacola está vazia.</p>';
    } else {
        carrinho.forEach((item, index) => {
            total += item.total;
            lista.innerHTML += `
                <div class="item-lista">
                    <img src="${item.produto.imagens[0]}">
                    <div style="flex:1">
                        <h4>${item.produto.nome}</h4>
                        <p style="font-size:0.8rem; color:#666">${item.cor} | ${item.tamanho}</p>
                        
                        <div class="acoes-carrinho">
                            <button class="btn-mini" onclick="alterarQtdCarrinho(${index}, -1)">-</button>
                            <input type="number" class="input-mini" value="${item.qtd}" onchange="inputQtdCarrinho(${index}, this.value)">
                            <button class="btn-mini" onclick="alterarQtdCarrinho(${index}, 1)">+</button>
                            <span style="margin-left:auto; font-weight:bold">R$ ${item.total.toFixed(2)}</span>
                        </div>
                    </div>
                    <button onclick="removerItem(${index})" style="background:none; border:none; color:red; margin-left:10px">&times;</button>
                </div>
            `;
        });
    }
    
    document.getElementById('carrinho-total').innerText = `R$ ${total.toFixed(2)}`;
}

function alterarQtdCarrinho(index, delta) {
    if(carrinho[index].qtd + delta >= 1) {
        carrinho[index].qtd += delta;
        carrinho[index].total = carrinho[index].qtd * carrinho[index].produto.preco;
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
    carrinho[index].total = carrinho[index].qtd * carrinho[index].produto.preco;
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
    window.open("https://wa.me/5511999999999", "_blank");
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
        // AQUI A MÁGICA: Adicionei a referência no texto
        msg += `▪ ${item.produto.nome} (Ref: ${item.produto.referencia})\n`;
        msg += `   ${item.tamanho} | ${item.cor} | Qtd: ${item.qtd}\n`;
        total += item.total;
    });
    msg += `\n*TOTAL: R$ ${total.toFixed(2)}*`;
    msg += `\n\nAguardo dados para pagamento.`;
    
    window.open(`https://wa.me/5511999999999?text=${encodeURIComponent(msg)}`, "_blank");
}

function mostrarToast(msg) {
    const t = document.getElementById('toast');
    t.innerText = msg;
    t.className = "mostrar";
    setTimeout(() => t.className = "", 3000);
}

// SOBRE NÓS
function abrirSobreNos() {
    document.getElementById('modal-sobre').style.display = 'flex';
}

// INICIALIZAR
carregarRevista();