/* ==========================================================================
   --- CONTROLE DE SCROLL INICIAL (ANTI-RESET DO NAVEGADOR) ---
   ========================================================================== */

// Força o navegador a iniciar no topo absoluto e desativa a memória de scroll do F5
if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

window.addEventListener('DOMContentLoaded', () => {
    // Garante o topo novamente assim que a estrutura HTML estiver pronta
    window.scrollTo(0, 0);
    
    // 1. Cronômetro da tela de introdução (6 segundos)
    setTimeout(() => {
        const introElement = document.querySelector('.intro-screen');
        if (introElement) {
            introElement.classList.add('fade-out');
            
            // Força o topo mais uma vez no exato momento em que a intro some
            window.scrollTo({
                top: 0,
                behavior: 'instant' // 'instant' impede que a tela dê aquele "pulo" visual
            });
        }
    }, 6000);

    // 2. Animação de Surgimento Tecnológico (Intersection Observer)
    const deusesDoScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.reveal').forEach(el => deusesDoScroll.observe(el));

    // 3. Menu de Navegação Ativo Inteligente & Efeito de Rolo do Topo
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link:not(.contact-btn)');
    const header = document.querySelector('.header');

    window.addEventListener('scroll', () => {
        // Efeito colapsável e iluminação do menu ao rolar
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Mapeador de seção ativa no menu de navegação
        let currentSection = 'inicio';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 160;
            if (window.scrollY >= sectionTop) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    });

    // 4. Automação do Formulário de Agendamento via WhatsApp
    inicializarFormularioWhatsapp();
});

/* ==========================================================================
   --- FUNÇÃO AUXILIAR: ENVIO DO FORMULÁRIO PARA O WHATSAPP ---
   ========================================================================== */
function inicializarFormularioWhatsapp() {
    const formAgendamento = document.getElementById('form-agendamento');
    
    // Se o formulário não existir nesta página específica, cancela silenciosamente sem travar a Intro
    if (!formAgendamento) return; 

    formAgendamento.addEventListener('submit', (e) => {
        e.preventDefault(); // Evita o recarregamento da página que causava o loop na intro

        // Captura os dados do formulário usando os IDs padrões do HTML
        const nome = document.getElementById('nome').value.trim();
        const email = document.getElementById('email').value.trim();
        const whatsapp = document.getElementById('whatsapp').value.trim();
        const servico = document.getElementById('servico').value;
        const data = document.getElementById('data').value;
        const hora = document.getElementById('hora').value;
        const mensagemAdicional = document.getElementById('mensagem').value.trim();

        // Formata a data para o padrão brasileiro (DD/MM/AAAA)
        let dataFormatada = data;
        if (data) {
            const partesData = data.split('-');
            dataFormatada = `${partesData[2]}/${partesData[1]}/${partesData[0]}`;
        }

        // Monta o corpo do texto com formatação do WhatsApp (*Negrito*)
        let textoMensagem = `Olá! Gostaria de solicitar um agendamento:\n\n`;
        textoMensagem += `*Nome:* ${nome}\n`;
        textoMensagem += `*E-mail:* ${email}\n`;
        textoMensagem += `*WhatsApp:* ${whatsapp}\n`;
        textoMensagem += `*Especialidade/Serviço:* ${servico}\n`;
        textoMensagem += `*Data pretendida:* ${dataFormatada}\n`;
        textoMensagem += `*Horário:* ${hora}\n`;

        if (mensagemAdicional) {
            textoMensagem += `*Observações:* ${mensagemAdicional}\n`;
        }

        // CONFIGURAÇÃO DO NÚMERO: Substitua pelo número real do consultório
        // Formato: Código do País (55) + DDD + Número (Apenas números)
        const numeroWhatsApp = "5500999999999"; 

        // Codifica os caracteres especiais e espaços para o formato de URL válido
        const textoCodificado = encodeURIComponent(textoMensagem);
        const urlWhatsApp = `https://api.whatsapp.com/send?phone=${numeroWhatsApp}&text=${textoCodificado}`;

        // Abre a conversa do WhatsApp em uma nova aba de forma limpa
        window.open(urlWhatsApp, '_blank');
    });
}

/* ==========================================================================
   --- CONTROLE DO SLIDER ANTES E DEPOIS INTERATIVO ---
   ========================================================================== */
const sliderInput = document.querySelector('.slider-input');
if (sliderInput) {
    sliderInput.addEventListener('input', (e) => {
        const sliderValue = e.target.value;
        const beforeImage = document.querySelector('.before-image');
        const sliderHandle = document.querySelector('.slider-handle');
        
        if (beforeImage && sliderHandle) {
            beforeImage.style.width = `${sliderValue}%`;
            sliderHandle.style.left = `${sliderValue}%`;
        }
    });
}

/* ==========================================================================
   --- CONTROLE DA JANELA FLUTUANTE DE VÍDEO (MODAL) ---
   ========================================================================== */

// Função para abrir a janela flutuante e dar play no vídeo da pasta
function abrirVideo(event, caminhoVideo) {
    event.preventDefault(); // Impede a página de rolar para o topo ao clicar no '#'
    
    const modal = document.getElementById('videoModal');
    const video = document.getElementById('modalVideo');
    
    if (modal && video) {
        video.src = caminhoVideo; // Define o arquivo da sua pasta
        modal.style.display = 'flex'; // Exibe a janela flutuante
        video.load();
        video.play(); // Inicia o vídeo automaticamente
    }
}

// Função para fechar a janela e parar o vídeo completamente
function fecharVideo() {
    const modal = document.getElementById('videoModal');
    const video = document.getElementById('modalVideo');
    
    if (modal && video) {
        video.pause(); // Pausa o vídeo
        video.src = ""; // Limpa o carregamento para poupar memória
        modal.style.display = 'none'; // Esconde a janela flutuante
    }
}

// Fechar também se o usuário clicar na área escura fora do player de vídeo
window.onclick = function(event) {
    const modal = document.getElementById('videoModal');
    if (event.target == modal) {
        fecharVideo();
    }
}
