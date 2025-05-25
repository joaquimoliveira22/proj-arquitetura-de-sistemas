document.addEventListener('DOMContentLoaded', function() {
    const filmesContainer = document.getElementById('filmesContainer');
    
    function carregarFilmes() {
        const filmesEmCartaz = JSON.parse(localStorage.getItem('filmesEmCartaz')) || [];
        
        filmesContainer.innerHTML = '';
        
        filmesEmCartaz.forEach(filme => {
            const filmeCard = document.createElement('div');
            filmeCard.className = 'filme-card';
            
            let sessoesHTML = '';
            filme.sessoes.forEach(sessao => {
                const ingressosSessao = filme.ingressos.filter(i => {
                    const sessaoIngresso = JSON.parse(localStorage.getItem('sessoes'))
                        .find(s => s.id === i.sessaoId);
                    return sessaoIngresso && sessaoIngresso.id === sessao.id;
                });
                
                sessoesHTML += `
                    <div class="sessao">
                        <p>Sala: ${sessao.sala} | Horário: ${sessao.horario}</p>
                        <div class="ingressos">
                            ${ingressosSessao.map(ingresso => `
                                <span class="ingresso ${ingresso.tipo}">
                                    ${ingresso.tipo}: R$ ${ingresso.valor.toFixed(2)}
                                </span>
                            `).join('')}
                        </div>
                    </div>
                `;
            });
            
            filmeCard.innerHTML = `
                <img src="${filme.imagem}" alt="${filme.nome}">
                <h2>${filme.nome}</h2>
                <div class="sessoes-container">
                    ${sessoesHTML}
                </div>
            `;
            
            filmesContainer.appendChild(filmeCard);
        });
    }
    
    // Carrega os filmes quando a página é aberta
    carregarFilmes();
    
    // Atualiza os filmes quando houver mudanças no localStorage
    window.addEventListener('storage', function(e) {
        if (e.key === 'filmesEmCartaz') {
            carregarFilmes();
        }
    });
});
// Adicione estas funções no seu index.js
function setupRemocaoFilmes() {
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-remover-filme')) {
            const filmeCard = e.target.closest('.filme-card');
            const filmeNome = filmeCard.querySelector('.filme-titulo').textContent;
            mostrarModalConfirmacao(filmeNome, filmeCard.dataset.id);
        }
    });
}

function mostrarModalConfirmacao(nomeFilme, idFilme) {
    const modalHTML = `
        <div class="modal-conteudo">
            <h3>Remover Filme</h3>
            <p>Tem certeza que deseja remover "${nomeFilme}"?</p>
            <p>Todas as sessões e ingressos relacionados também serão removidos.</p>
            <div class="modal-botoes">
                <button class="modal-btn cancelar">Cancelar</button>
                <button class="modal-btn confirmar" data-id="${idFilme}">Remover</button>
            </div>
        </div>
    `;
    
    const modal = document.createElement('div');
    modal.className = 'modal-remover';
    modal.innerHTML = modalHTML;
    document.body.appendChild(modal);
    
    // Mostra o modal
    modal.style.display = 'flex';
    
    // Eventos dos botões do modal
    modal.querySelector('.cancelar').addEventListener('click', () => {
        modal.remove();
    });
    
    modal.querySelector('.confirmar').addEventListener('click', function() {
        removerFilme(this.dataset.id);
        modal.remove();
    });
    
    // Fecha modal ao clicar fora
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

function removerFilme(id) {
    let filmes = JSON.parse(localStorage.getItem('filmes')) || [];
    let sessoes = JSON.parse(localStorage.getItem('sessoes')) || [];
    let ingressos = JSON.parse(localStorage.getItem('ingressos')) || [];
    
    // Remove o filme
    filmes = filmes.filter(filme => filme.id !== id);
    
    // Remove sessões relacionadas
    const sessoesParaRemover = sessoes.filter(sessao => sessao.filmeId === id);
    sessoes = sessoes.filter(sessao => sessao.filmeId !== id);
    
    // Remove ingressos das sessões removidas
    const idsSessoes = sessoesParaRemover.map(s => s.id);
    ingressos = ingressos.filter(ingresso => !idsSessoes.includes(ingresso.sessaoId));
    
    // Atualiza localStorage
    localStorage.setItem('filmes', JSON.stringify(filmes));
    localStorage.setItem('sessoes', JSON.stringify(sessoes));
    localStorage.setItem('ingressos', JSON.stringify(ingressos));
    
    // Atualiza a exibição
    carregarFilmes();
    
    // Dispara evento para atualizar admin.html se estiver aberto
    window.dispatchEvent(new Event('storage'));
}

// Modifique a função carregarFilmes para incluir o botão de remover:
function carregarFilmes() {
    const container = document.getElementById('filmesContainer');
    const filmesData = JSON.parse(localStorage.getItem('filmesEmCartaz')) || [];
    
    container.innerHTML = '';
    
    filmesData.forEach(filme => {
        if (filme.sessoes && filme.sessoes.length > 0) {
            const card = document.createElement('div');
            card.className = 'filme-card';
            card.dataset.id = filme.id;
            
            // ... (código existente de construção do card)
            
            // Adiciona botão de remover
            card.innerHTML += `
                <button class="btn-remover-filme" title="Remover filme">×</button>
            `;
            
            container.appendChild(card);
        }
    });
    
    if (container.innerHTML === '') {
        container.innerHTML = `
            <div class="sem-filmes">
                <p>Nenhum filme em cartaz no momento.</p>
            </div>
        `;
    }
}

// Inicialize no DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    carregarFilmes();
    setupRemocaoFilmes(); // Adicione esta linha
    // ... (outros códigos de inicialização)
});