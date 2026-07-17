const input = document.getElementById("itens");
const botao = document.getElementById("btnAdicionar");
const lista = document.getElementById("lista");
const contador = document.getElementById("contador");
const categoria = document.getElementById("categoria");
const preco = document.getElementById("preco");
const prioridade = document.getElementById("prioridade");
const total = document.getElementById("total");
const pesquisa = document.getElementById("pesquisa");
const btnTema = document.getElementById("btnTema");
const totalItens = document.getElementById("totalItens");
const comprados = document.getElementById("comprados");
const faltam = document.getElementById("faltam");
const valorTotal = document.getElementById("valorTotal");
const barraProgresso = document.getElementById("barraProgresso");
const textoProgresso = document.getElementById("textoProgresso");
const modalEditar = document.getElementById("modalEditar");
const editarNome = document.getElementById("editarNome");
const editarPreco = document.getElementById("editarPreco");
const editarCategoria = document.getElementById("editarCategoria");
const editarPrioridade = document.getElementById("editarPrioridade");
const salvarEdicao = document.getElementById("salvarEdicao");
const cancelarEdicao = document.getElementById("cancelarEdicao");
const btnLimpar = document.getElementById("btnLimpar");
const btnComprados = document.getElementById("btnComprados");
const btnFaltam = document.getElementById("btnFaltam");
const btnTodos = document.getElementById("btnTodos");

btnTodos.addEventListener("click", function(){

    renderizarLista();

});

btnFaltam.addEventListener("click", function(){

    const faltam = itens.filter(function(item){

        return !item.concluida;

    });

    renderizarLista(faltam);

});

btnComprados.addEventListener("click", function(){

    const comprados = itens.filter(function(item){

        return item.concluida;

    });

    renderizarLista(comprados);

});

let itens = [];

let itemEditando = null;

function atualizarTotal() {

    let soma = 0;

    itens.forEach(function(item){
        soma += item.preco;
    });

    total.textContent = `Total: R$ ${soma.toFixed(2)}`;
}

function atualizarDashboard() {

    totalItens.textContent = itens.length;

    const quantidadeComprados = itens.filter(function(item) {
        return item.concluida;
    }).length;

    comprados.textContent = quantidadeComprados;

    faltam.textContent = itens.length - quantidadeComprados;

    let soma = 0;

    itens.forEach(function(item) {
        soma += item.preco;
    });

    valorTotal.textContent = `R$ ${soma.toFixed(2)}`;

}

function atualizarProgresso() {

    const quantidadeItens = itens.length;

    const concluidos = itens.filter(function(item){
        return item.concluida;
    }).length;

    let porcentagem = 0;

    if(quantidadeItens > 0){
        porcentagem = (concluidos / quantidadeItens) * 100;
    }

    barraProgresso.style.width = porcentagem + "%";

    textoProgresso.textContent =
        `${concluidos} de ${quantidadeItens} itens comprados (${porcentagem.toFixed(0)}%)`;

}

function renderizarLista(listaExibida = itens) {

    lista.innerHTML = "";

    listaExibida = [...listaExibida];

    listaExibida.sort(function(a, b){

    const prioridades = {
        "Alta": 3,
        "Média": 2,
        "Baixa": 1
    };

    return prioridades[b.prioridade] - prioridades[a.prioridade];

});

    if(listaExibida.length === 0){

    lista.innerHTML = `
        <li style="justify-content:center;">
            Nenhum item encontrado.
        </li>
    `;

    return;

}

    listaExibida.forEach(function (item) {

        let li = document.createElement("li");

        if (item.concluida) {
            li.classList.add("concluida");
        }

        li.innerHTML = `
            <div>

                <strong>${item.texto}</strong><br>

                📂 ${item.categoria}<br>

                💰 R$ ${item.preco.toFixed(2)}<br>

                ⭐ ${item.prioridade}<br>

                📅 ${item.data}

            </div>
        `;

        let botaoEditar = document.createElement("button");
        
        botaoEditar.textContent = "✏️";
        botaoEditar.classList.add("btnEditar");

        botaoEditar.addEventListener("click", function (event) {

            event.stopPropagation();

            itemEditando = item;

            editarNome.value = item.texto;
            editarPreco.value = item.preco;
            editarCategoria.value = item.categoria;
            editarPrioridade.value = item.prioridade;

            modalEditar.classList.add("ativo");

        });



        let botaoExcluir = document.createElement("button");
        botaoExcluir.textContent = "🗑️";
        botaoExcluir.classList.add("btnExcluir");

        botaoExcluir.addEventListener("click", function (event) {

            event.stopPropagation();

            if(!confirm("Deseja realmente excluir este item?")){
                return;
            }

            const indiceOriginal = itens.findIndex(function(i){

                return i.id === item.id;

            });

            if(indiceOriginal !== -1){
                itens.splice(indiceOriginal,1);
            }

            salvarItens();

            renderizarLista();
            atualizarTotal();
            atualizarDashboard();
            atualizarProgresso();

            contador.textContent = itens.length + " itens";

        });

        li.addEventListener("click", function () {

            item.concluida = !item.concluida;

            salvarItens();
            renderizarLista();
            atualizarTotal();
            atualizarDashboard();
            atualizarProgresso();

            contador.textContent = itens.length + " itens";

        });

        li.appendChild(botaoEditar);
        li.appendChild(botaoExcluir);

        lista.appendChild(li);

    });

    }

cancelarEdicao.addEventListener("click", function () {

    itemEditando = null;

    modalEditar.classList.remove("ativo");

    input.focus();

});

salvarEdicao.addEventListener("click", function () {

    if (itemEditando == null) {
        return;
    }

    if (editarNome.value.trim() === "") {
        alert("Digite um nome.");
        return;
    }

    if (Number(editarPreco.value) <= 0) {
        alert("Digite um preço válido.");
        return;
    }

    itemEditando.texto = editarNome.value.trim();
    itemEditando.preco = Number(editarPreco.value);
    itemEditando.categoria = editarCategoria.value;
    itemEditando.prioridade = editarPrioridade.value;

    salvarItens();

    renderizarLista();
    atualizarTotal();
    atualizarDashboard();
    atualizarProgresso();

    contador.textContent = itens.length + " itens";

    itemEditando = null;

    modalEditar.classList.remove("ativo");

    input.focus();

});

botao.addEventListener("click", adicionarItem);

input.addEventListener("keydown", function(e){

    if(e.key === "Enter"){
        adicionarItem();
    }

});

function adicionarItem() {

    const texto = input.value
    .trim()
    .replace(/\s+/g," ");

    if (texto === "") {
        alert("O que precisa?");
        return;
    }

    const existe = itens.some(function(item){

        return item.texto.toLowerCase() === texto.toLowerCase();

    });

    if(existe){
        alert("Este item já está na lista.");
        return;
    }

        if(preco.value === "" || Number(preco.value) <= 0){

        alert("Digite um preço válido.");
        return;
        }
    

    itens.push({
        id: Date.now(),
        texto: texto,
        categoria: categoria.value,
        preco: Number(preco.value),
        prioridade: prioridade.value,
        concluida: false,
        data: new Date().toLocaleDateString("pt-BR")
    });

    input.value = "";
    preco.value = "";
    categoria.selectedIndex = 0;
    prioridade.selectedIndex = 0;

    input.focus();

    renderizarLista();
    atualizarTotal();
    atualizarDashboard();
    atualizarProgresso();
    salvarItens();

    contador.textContent = itens.length + " itens";
}

function salvarItens() {
    localStorage.setItem("listaCasa", JSON.stringify(itens));
}

function carregarItens() {

    const dados = localStorage.getItem("listaCasa");

    if (dados) {
        itens = JSON.parse(dados);

        itens.forEach(function(item){    

            if(!item.data){

                item.data = new Date().toLocaleDateString("pt-BR");

            }

        });

        salvarItens();

    }

    renderizarLista();
    atualizarTotal();
    atualizarDashboard();
    atualizarProgresso();

    contador.textContent = itens.length + " itens";    
}

carregarItens();

pesquisa.addEventListener("input", function () {

    const textoPesquisa = pesquisa.value
    .trim()
    .toLowerCase();

    const itensFiltrados = itens.filter(function (item) {

        return (

            item.texto.toLowerCase().includes(textoPesquisa) ||

            item.categoria.toLowerCase().includes(textoPesquisa) ||

            item.prioridade.toLowerCase().includes(textoPesquisa) ||

            item.data.includes(textoPesquisa)

        );

    });

    renderizarLista(itensFiltrados);

});

btnTema.addEventListener("click", function () {

    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {

        localStorage.setItem("tema", "dark");
        btnTema.textContent = "☀️ Modo Claro";

    } else {

        localStorage.setItem("tema", "light");
        btnTema.textContent = "🌙 Modo Escuro";

    }

});

const temaSalvo = localStorage.getItem("tema");

if (temaSalvo === "dark") {

    document.body.classList.add("dark");
    btnTema.textContent = "☀️ Modo Claro";

} else {

    btnTema.textContent = "🌙  Modo Escuro";

}

btnLimpar.addEventListener("click", function(){

    if(confirm("Deseja apagar todos os itens?")){

        itens = [];

        salvarItens();

        renderizarLista();
        atualizarTotal();
        atualizarDashboard();
        atualizarProgresso();

        contador.textContent = "0 itens";

    }

});