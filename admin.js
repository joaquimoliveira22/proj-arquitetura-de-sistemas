// Controle das abas - Adicione isso no início do arquivo admin.js
function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove classe active de todos
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Adiciona ao botão clicado
            button.classList.add('active');
            
            // Mostra o conteúdo correspondente
            const tabId = button.getAttribute('data-tab') + '-tab';
            document.getElementById(tabId).classList.add('active');
        });
    });
}

// Chame esta função no final do DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    setupTabs(); // Adicione esta linha
    // ... resto do seu código existente
});
document.addEventListener('DOMContentLoaded', function() {
    // Dados iniciais
    let filmes = JSON.parse(localStorage.getItem('filmes')) || [];
    let sessoes = JSON.parse(localStorage.getItem('sessoes')) || [];
    let ingressos = JSON.parse(localStorage.getItem('ingressos')) || [];

    // Função para gerar IDs únicos
    function gerarId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Função principal de atualização
    function atualizarFilmesEmCartaz() {
        const filmesAtualizados = filmes.map(filme => {
            return {
                ...filme,
                sessoes: sessoes.filter(s => s.filmeId === filme.id),
                ingressos: ingressos.filter(i => {
                    const sessao = sessoes.find(s => s.id === i.sessaoId);
                    return sessao && sessao.filmeId === filme.id;
                })
            };
        });
        
        localStorage.setItem('filmesEmCartaz', JSON.stringify(filmesAtualizados));
        return filmesAtualizados;
    }

    // Formulário de Filmes
    const filmeForm = document.getElementById('filmeForm');
    filmeForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const novoFilme = {
            id: gerarId(),
            nome: document.getElementById('filmeNome').value,
            imagem: document.getElementById('filmeImagem').value
        };
        
        filmes.push(novoFilme);
        localStorage.setItem('filmes', JSON.stringify(filmes));
        
        filmeForm.reset();
        atualizarFilmesEmCartaz();
        alert('Filme cadastrado com sucesso!');
    });

    // Formulário de Sessões
    const sessaoForm = document.getElementById('sessaoForm');
    sessaoForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const novaSessao = {
            id: gerarId(),
            filmeId: document.getElementById('sessaoFilme').value,
            sala: document.getElementById('sessaoSala').value.toUpperCase(),
            horario: document.getElementById('sessaoHorario').value
        };
        
        sessoes.push(novaSessao);
        localStorage.setItem('sessoes', JSON.stringify(sessoes));
        
        sessaoForm.reset();
        atualizarFilmesEmCartaz();
        alert('Sessão cadastrada com sucesso!');
    });

    // Formulário de Ingressos
    const ingressoForm = document.getElementById('ingressoForm');
    ingressoForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const novoIngresso = {
            id: gerarId(),
            sessaoId: document.getElementById('ingressoSessao').value,
            tipo: document.getElementById('ingressoTipo').value,
            valor: parseFloat(document.getElementById('ingressoValor').value)
        };
        
        ingressos.push(novoIngresso);
        localStorage.setItem('ingressos', JSON.stringify(ingressos));
        
        ingressoForm.reset();
        atualizarFilmesEmCartaz();
        alert('Ingresso cadastrado com sucesso!');
    });

    // Atualiza selects
    function carregarSelects() {
        const selectFilmes = document.getElementById('sessaoFilme');
        const selectSessoes = document.getElementById('ingressoSessao');
        
        selectFilmes.innerHTML = filmes.map(f => 
            `<option value="${f.id}">${f.nome}</option>`
        ).join('');
        
        selectSessoes.innerHTML = sessoes.map(s => {
            const filme = filmes.find(f => f.id === s.filmeId);
            return `<option value="${s.id}">${filme?.nome || 'Filme não encontrado'} - ${s.sala} (${s.horario})</option>`;
        }).join('');
    }

    // Inicialização
    carregarSelects();
    atualizarFilmesEmCartaz();
});
// Adicione esta função no seu admin.js
function renderizarListaFilmes() {
    const listaFilmes = document.getElementById('listaFilmes');
    listaFilmes.innerHTML = '';

    filmes.forEach(filme => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${filme.nome}</span>
            <button class="btn-remover" data-id="${filme.id}">Remover</button>
        `;
        listaFilmes.appendChild(li);
    });

    // Adiciona eventos aos botões de remoção
    document.querySelectorAll('.btn-remover').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            removerFilme(id);
        });
    });
}

// Função para remover filme e seus relacionamentos
function removerFilme(id) {
    if (confirm('Tem certeza que deseja remover este filme? Todas as sessões e ingressos relacionados também serão removidos.')) {
        // Remove o filme
        filmes = filmes.filter(filme => filme.id !== id);
        
        // Remove sessões relacionadas
        const sessoesParaRemover = sessoes.filter(s => s.filmeId === id);
        sessoes = sessoes.filter(s => s.filmeId !== id);
        
        // Remove ingressos das sessões removidas
        const idsSessoes = sessoesParaRemover.map(s => s.id);
        ingressos = ingressos.filter(i => !idsSessoes.includes(i.sessaoId));
        
        // Atualiza localStorage
        localStorage.setItem('filmes', JSON.stringify(filmes));
        localStorage.setItem('sessoes', JSON.stringify(sessoes));
        localStorage.setItem('ingressos', JSON.stringify(ingressos));
        
        // Atualiza a interface
        renderizarListaFilmes();
        atualizarSelects();
        atualizarFilmesEmCartaz();
        
        alert('Filme removido com sucesso!');
    }
}

// Modifique o evento DOMContentLoaded para incluir:
document.addEventListener('DOMContentLoaded', function() {
    // ... (código existente)
    renderizarListaFilmes();  // Adicione esta linha
    // ... (código existente)
});