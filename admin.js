document.addEventListener('DOMContentLoaded', function() {
    // Dados armazenados
    let filmes = JSON.parse(localStorage.getItem('filmes')) || [];
    let sessoes = JSON.parse(localStorage.getItem('sessoes')) || [];
    let ingressos = JSON.parse(localStorage.getItem('ingressos')) || [];

    // Elementos do formulário de filmes
    const filmeForm = document.getElementById('filmeForm');
    const filmeNome = document.getElementById('filmeNome');
    const filmeImagem = document.getElementById('filmeImagem');
    const listaFilmes = document.getElementById('listaFilmes');

    // Elementos do formulário de sessões
    const sessaoForm = document.getElementById('sessaoForm');
    const sessaoFilme = document.getElementById('sessaoFilme');
    const sessaoSala = document.getElementById('sessaoSala');
    const sessaoHorario = document.getElementById('sessaoHorario');
    const listaSessoes = document.getElementById('listaSessoes');

    // Elementos do formulário de ingressos
    const ingressoForm = document.getElementById('ingressoForm');
    const ingressoSessao = document.getElementById('ingressoSessao');
    const ingressoTipo = document.getElementById('ingressoTipo');
    const ingressoValor = document.getElementById('ingressoValor');
    const listaIngressos = document.getElementById('listaIngressos');

    // Atualiza selects com dados existentes
    function atualizarSelects() {
        // Atualiza select de filmes
        sessaoFilme.innerHTML = '';
        filmes.forEach(filme => {
            const option = document.createElement('option');
            option.value = filme.id;
            option.textContent = filme.nome;
            sessaoFilme.appendChild(option);
        });

        // Atualiza select de sessões
        ingressoSessao.innerHTML = '';
        sessoes.forEach(sessao => {
            const filme = filmes.find(f => f.id === sessao.filmeId);
            const option = document.createElement('option');
            option.value = sessao.id;
            option.textContent = `${filme ? filme.nome : 'Filme não encontrado'} - ${sessao.sala} (${sessao.horario})`;
            ingressoSessao.appendChild(option);
        });
    }

    // Renderiza lista de filmes
    function renderizarFilmes() {
        listaFilmes.innerHTML = '';
        filmes.forEach(filme => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${filme.nome}</span>
                <button data-id="${filme.id}" class="btn-remover">Remover</button>
            `;
            listaFilmes.appendChild(li);
        });

        // Adiciona eventos aos botões de remover
        document.querySelectorAll('.btn-remover').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                filmes = filmes.filter(filme => filme.id !== id);
                localStorage.setItem('filmes', JSON.stringify(filmes));
                renderizarFilmes();
                atualizarSelects();
            });
        });
    }

    // Renderiza lista de sessões
    function renderizarSessoes() {
        listaSessoes.innerHTML = '';
        sessoes.forEach(sessao => {
            const filme = filmes.find(f => f.id === sessao.filmeId);
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${filme ? filme.nome : 'Filme não encontrado'} - ${sessao.sala} (${sessao.horario})</span>
                <button data-id="${sessao.id}" class="btn-remover">Remover</button>
            `;
            listaSessoes.appendChild(li);
        });

        // Adiciona eventos aos botões de remover
        document.querySelectorAll('#listaSessoes .btn-remover').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                sessoes = sessoes.filter(sessao => sessao.id !== id);
                localStorage.setItem('sessoes', JSON.stringify(sessoes));
                renderizarSessoes();
                atualizarSelects();
            });
        });
    }

    // Renderiza lista de ingressos
    function renderizarIngressos() {
        listaIngressos.innerHTML = '';
        ingressos.forEach(ingresso => {
            const sessao = sessoes.find(s => s.id === ingresso.sessaoId);
            const filme = sessao ? filmes.find(f => f.id === sessao.filmeId) : null;
            
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${filme ? filme.nome : 'Sessão não encontrada'} - ${ingresso.tipo}: R$ ${ingresso.valor.toFixed(2)}</span>
                <button data-id="${ingresso.id}" class="btn-remover">Remover</button>
            `;
            listaIngressos.appendChild(li);
        });

        // Adiciona eventos aos botões de remover
        document.querySelectorAll('#listaIngressos .btn-remover').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                ingressos = ingressos.filter(ingresso => ingresso.id !== id);
                localStorage.setItem('ingressos', JSON.stringify(ingressos));
                renderizarIngressos();
            });
        });
    }

    // Formulário de filmes
    filmeForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const novoFilme = {
            id: Date.now().toString(),
            nome: filmeNome.value,
            imagem: filmeImagem.value
        };
        
        filmes.push(novoFilme);
        localStorage.setItem('filmes', JSON.stringify(filmes));
        
        filmeNome.value = '';
        filmeImagem.value = '';
        
        renderizarFilmes();
        atualizarSelects();
    });

    // Formulário de sessões
    sessaoForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const novaSessao = {
            id: Date.now().toString(),
            filmeId: sessaoFilme.value,
            sala: sessaoSala.value.toUpperCase(),
            horario: sessaoHorario.value
        };
        
        sessoes.push(novaSessao);
        localStorage.setItem('sessoes', JSON.stringify(sessoes));
        
        sessaoSala.value = '';
        sessaoHorario.value = '';
        
        renderizarSessoes();
        atualizarSelects();
    });

    // Formulário de ingressos
    ingressoForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const novoIngresso = {
            id: Date.now().toString(),
            sessaoId: ingressoSessao.value,
            tipo: ingressoTipo.value,
            valor: parseFloat(ingressoValor.value)
        };
        
        ingressos.push(novoIngresso);
        localStorage.setItem('ingressos', JSON.stringify(ingressos));
        
        ingressoValor.value = '';
        
        renderizarIngressos();
    });

    // Inicialização
    renderizarFilmes();
    renderizarSessoes();
    renderizarIngressos();
    atualizarSelects();
});