// Catálogo inicial da Eliz (já com o Tapete de 2m de circunferência por R$ 400,00)
const tapetesIniciais = [
    {
        id: 1,
        nome: "Tapete Redondo Imperial em Crochê",
        categoria: "Redondo",
        descricao: "Tapete redondo de crochê feito à mão pela Eliz. Pontos firmes, acabamento impecável e barbante 100% algodão super macio. Ideal para salas e quartos.",
        fotos: [
            "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=900&q=80",
            "https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=900&q=80"
        ],
        tamanhos: [
            { medida: "2,00m de circunferência (Destaque)", preco: 400.00 },
            { medida: "1,50m de circunferência", preco: 290.00 },
            { medida: "1,20m de circunferência", preco: 210.00 },
            { medida: "2,50m de circunferência", preco: 520.00 }
        ]
    },
    {
        id: 2,
        nome: "Passadeira Oval Bico Russo",
        categoria: "Oval",
        descricao: "Passadeira charmosa com bico trabalhado em relevo. Perfeita para corredores, beira de cama ou entradas.",
        fotos: [
            "https://images.unsplash.com/photo-1600166898405-da9535204843?auto=format&fit=crop&w=900&q=80"
        ],
        tamanhos: [
            { medida: "1,50m x 0,70m", preco: 220.00 },
            { medida: "2,00m x 0,80m", preco: 310.00 }
        ]
    },
    {
        id: 3,
        nome: "Jogo de Tapetes Florata (3 Peças)",
        categoria: "Kit",
        descricao: "Kit completo com 1 passadeira e 2 tapetes menores combinando. Lavável e super resistente.",
        fotos: [
            "https://images.unsplash.com/photo-1575414003591-ece8d0416c7a?auto=format&fit=crop&w=900&q=80"
        ],
        tamanhos: [
            { medida: "Kit Padrão (1 de 1,40m + 2 de 0,70m)", preco: 280.00 },
            { medida: "Kit Grande (1 de 1,80m + 2 de 0,85m)", preco: 360.00 }
        ]
    }
];

// Carrega do navegador ou usa os iniciais
let tapetes = JSON.parse(localStorage.getItem("tapetes_eliz_v1")) || tapetesIniciais;
let whatsappEliz = localStorage.getItem("whatsapp_eliz") || "5511999999999";
let fotosTempCadastro = [];
let filtroAtual = "todos";

function salvarDados() {
    localStorage.setItem("tapetes_eliz_v1", JSON.stringify(tapetes));
}

function formatarMoeda(valor) {
    return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// Renderiza os cards de tapetes na tela
function renderizarCatalogo() {
    const grid = document.getElementById("produtos-grid");
    grid.innerHTML = "";

    // Atualiza a foto do destaque de 2m no topo caso a Eliz tenha anexado foto nova
    const tapetePrincipal = tapetes.find(t => t.id === 1);
    if (tapetePrincipal && tapetePrincipal.fotos.length > 0) {
        document.getElementById("hero-img").src = tapetePrincipal.fotos[0];
    }

    const listaFiltrada = filtroAtual === "todos"
        ? tapetes
        : tapetes.filter(t => t.categoria === filtroAtual);

    listaFiltrada.forEach(tapete => {
        const precoPrincipal = tapete.tamanhos[0]?.preco || 0;
        const chipsHTML = tapete.tamanhos.map(t => `<span class="chip">${t.medida}</span>`).join("");

        const card = document.createElement("div");
        card.className = "produto-card";
        card.innerHTML = `
            <div class="card-img-wrap" onclick="abrirDetalhes(${tapete.id})">
                <img src="${tapete.fotos[0]}" alt="${tapete.nome}">
                <span class="fotos-count">📷 ${tapete.fotos.length} foto(s)</span>
            </div>
            <div class="card-body">
                <span class="badge" style="align-self:flex-start">${tapete.categoria}</span>
                <h3>${tapete.nome}</h3>
                <p class="card-desc">${tapete.descricao}</p>
                <div class="card-tamanhos-chips">${chipsHTML}</div>
                <div class="card-footer">
                    <div class="card-preco">
                        <span>Valor (${tapete.tamanhos[0]?.medida})</span>
                        <strong>${formatarMoeda(precoPrincipal)}</strong>
                    </div>
                    <button class="btn-primary" onclick="abrirDetalhes(${tapete.id})">Ver / Fotos</button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Filtrar por categoria
function filtrarTapetes(categoria, btn) {
    filtroAtual = categoria;
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    renderizarCatalogo();
}

// Abre modal de detalhes com várias fotos e seleção de tamanhos
function abrirDetalhes(id) {
    const tapete = tapetes.find(t => t.id === id);
    if (!tapete) return;

    document.getElementById("detalhe-categoria").textContent = tapete.categoria;
    document.getElementById("detalhe-nome").textContent = tapete.nome;
    document.getElementById("detalhe-descricao").textContent = tapete.descricao;

    // Galeria de Fotos
    const imgPrincipal = document.getElementById("detalhe-foto-principal");
    const miniaturasDiv = document.getElementById("detalhe-miniaturas");
    imgPrincipal.src = tapete.fotos[0];
    miniaturasDiv.innerHTML = "";

    tapete.fotos.forEach((fotoUrl, index) => {
        const thumb = document.createElement("img");
        thumb.src = fotoUrl;
        thumb.className = `miniatura-item ${index === 0 ? "active" : ""}`;
        thumb.onclick = () => {
            imgPrincipal.src = fotoUrl;
            document.querySelectorAll("#detalhe-miniaturas .miniatura-item").forEach(m => m.classList.remove("active"));
            thumb.classList.add("active");
        };
        miniaturasDiv.appendChild(thumb);
    });

    // Opções de Tamanhos e Preços
    const tamanhosDiv = document.getElementById("detalhe-tamanhos");
    const precoTexto = document.getElementById("detalhe-preco");
    tamanhosDiv.innerHTML = "";

    let tamanhoSelecionado = tapete.tamanhos[0];
    precoTexto.textContent = formatarMoeda(tamanhoSelecionado.preco);

    tapete.tamanhos.forEach((tam, idx) => {
        const btnTam = document.createElement("button");
        btnTam.className = `tamanho-btn ${idx === 0 ? "active" : ""}`;
        btnTam.innerHTML = `<strong>${tam.medida}</strong><br><small>${formatarMoeda(tam.preco)}</small>`;
        btnTam.onclick = () => {
            tamanhoSelecionado = tam;
            precoTexto.textContent = formatarMoeda(tam.preco);
            document.querySelectorAll(".tamanho-btn").forEach(b => b.classList.remove("active"));
            btnTam.classList.add("active");
        };
        tamanhosDiv.appendChild(btnTam);
    });

    // Input para anexar mais fotos direto neste tapete
    const inputMaisFotos = document.getElementById("input-mais-fotos");
    inputMaisFotos.onchange = (e) => adicionarFotoRapida(e, tapete.id, true);

    // Botão Comprar pelo WhatsApp
    document.getElementById("btn-comprar-zap").onclick = () => {
        const cor = document.getElementById("cor-escolhida").value.trim();
        const textoCor = cor ? `\n🎨 *Cor desejada:* ${cor}` : "";
        const msg = `Olá Eliz! Tudo bem? 🧶\nGostaria de encomendar o seguinte tapete do seu site:\n\n✨ *Modelo:* ${tapete.nome}\n📏 *Tamanho:* ${tamanhoSelecionado.medida}\n💰 *Valor:* ${formatarMoeda(tamanhoSelecionado.preco)}${textoCor}`;
        const url = `https://wa.me/${whatsappEliz}?text=${encodeURIComponent(msg)}`;
        window.open(url, "_blank");
    };

    document.getElementById("modal-detalhes").classList.add("open");
}

// Converte fotos anexadas do celular/PC e salva no tapete
function adicionarFotoRapida(event, tapeteId, reabrirModal = false) {
    const arquivos = Array.from(event.target.files);
    if (!arquivos.length) return;

    const tapete = tapetes.find(t => t.id === tapeteId);
    if (!tapete) return;

    let lidos = 0;
    arquivos.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
            // Coloca a foto nova da Eliz como primeira foto de capa
            tapete.fotos.unshift(e.target.result);
            lidos++;
            if (lidos === arquivos.length) {
                salvarDados();
                renderizarCatalogo();
                if (reabrirModal) abrirDetalhes(tapeteId);
                alert("Foto(s) anexada(s) com sucesso ao tapete!");
            }
        };
        reader.readAsDataURL(file);
    });
}

// Cadastro de Novo Tapete
function abrirModalCadastro() {
    fotosTempCadastro = [];
    document.getElementById("preview-cadastro").innerHTML = "";
    document.getElementById("form-novo-tapete").reset();
    document.getElementById("modal-cadastro").classList.add("open");
}

function adicionarCampoTamanho() {
    const container = document.getElementById("lista-tamanhos-form");
    const div = document.createElement("div");
    div.className = "tamanho-row";
    div.innerHTML = `
        <input type="text" class="input-medida" placeholder="Ex: 1,50m de circunferência" required>
        <input type="number" class="input-preco" placeholder="Preço (R$)" step="0.01" required>
    `;
    container.appendChild(div);
}

function previsualizarFotosCadastro(event) {
    const arquivos = Array.from(event.target.files);
    const previewDiv = document.getElementById("preview-cadastro");

    arquivos.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
            fotosTempCadastro.push(e.target.result);
            const img = document.createElement("img");
            img.src = e.target.result;
            img.className = "miniatura-item active";
            previewDiv.appendChild(img);
        };
        reader.readAsDataURL(file);
    });
}

function salvarNovoTapete(event) {
    event.preventDefault();

    const nome = document.getElementById("novo-nome").value;
    const categoria = document.getElementById("novo-categoria").value;
    const descricao = document.getElementById("novo-desc").value || "Feito à mão com barbante de alta qualidade.";

    const medidasInputs = document.querySelectorAll(".input-medida");
    const precosInputs = document.querySelectorAll(".input-preco");
    const tamanhos = [];

    medidasInputs.forEach((input, i) => {
        const medida = input.value.trim();
        const preco = parseFloat(precosInputs[i].value);
        if (medida && !isNaN(preco)) {
            tamanhos.push({ medida, preco });
        }
    });

    const fotosFinais = fotosTempCadastro.length > 0
        ? fotosTempCadastro
        : ["https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=900&q=80"];

    const novoTapete = {
        id: Date.now(),
        nome,
        categoria,
        descricao,
        fotos: fotosFinais,
        tamanhos
    };

    tapetes.unshift(novoTapete);
    salvarDados();
    renderizarCatalogo();
    fecharModal("modal-cadastro");
}

// Configurar WhatsApp da Eliz
function abrirModalWhatsApp() {
    document.getElementById("input-zap-eliz").value = whatsappEliz;
    document.getElementById("modal-whatsapp").classList.add("open");
}

function salvarWhatsApp() {
    const num = document.getElementById("input-zap-eliz").value.replace(/\D/g, "");
    if (num.length >= 10) {
        whatsappEliz = num.startsWith("55") ? num : "55" + num;
        localStorage.setItem("whatsapp_eliz", whatsappEliz);
        fecharModal("modal-whatsapp");
        alert("WhatsApp da Eliz salvo com sucesso!");
    } else {
        alert("Digite um número válido com DDD.");
    }
}

function fecharModal(id) {
    document.getElementById(id).classList.remove("open");
}

// Inicializa o site ao abrir
document.addEventListener("DOMContentLoaded", renderizarCatalogo);