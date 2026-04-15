// ========================================================
// PRELOADER & ANIMAÇÃO DE ENTRADA (NAV/HERO)
// ========================================================
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  
  if (preloader) {
    setTimeout(() => {
      preloader.classList.add('loader-hidden'); 
      
      // Assim que o preloader começa a sumir, disparamos a entrada da Navbar e Textos
      document.body.classList.add('loaded'); 
      
      setTimeout(() => { 
        preloader.style.display = 'none'; 
      }, 500);
      
    }, 900); // <-- Tempo de tela do preloader (0.9 segundos)
  } else {
    // Fallback: se a página não tiver preloader, anima direto
    document.body.classList.add('loaded');
  }
});

// Menu Mobile
const navMenu = document.getElementById('navMenu');
const menuIcon = document.querySelector('.menu-toggle i');

function toggleMenu() { 
  navMenu.classList.toggle('active'); 
  if(navMenu.classList.contains('active')) {
    menuIcon.classList.remove('fa-bars');
    menuIcon.classList.add('fa-times');
  } else {
    menuIcon.classList.remove('fa-times');
    menuIcon.classList.add('fa-bars');
  }
}

function closeMenu() { 
  navMenu.classList.remove('active'); 
  menuIcon.classList.remove('fa-times');
  menuIcon.classList.add('fa-bars');
}

// Efeito de rolagem na Navbar
window.addEventListener('scroll', () => {
  const nav = document.querySelector('.navbar');
  if (window.scrollY > 50) {
    nav.classList.add('nav-active');
  } else {
    nav.classList.remove('nav-active');
  }
});

// ========================================================
// LÓGICA DO MODAL DE MÚSICA (HOME)
// ========================================================
const modal = document.getElementById('video-modal');
const mainPlayer = document.getElementById('main-player');
const modalTitle = document.getElementById('modal-video-title');
const modalArtist = document.getElementById('modal-video-artist');

let currentModalIndex = 0;
let releaseCards = [];
let carouselDots = [];

document.addEventListener('DOMContentLoaded', () => {
  releaseCards = document.querySelectorAll('.release-card');
  carouselDots = document.querySelectorAll('.carousel-dots-indicator span');
  const grid = document.querySelector('.releases-cards-grid');

  if (grid && releaseCards.length > 0 && carouselDots.length > 0) {
    carouselDots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        const card = releaseCards[index];
        if(card) {
          const scrollPos = card.offsetLeft - 20; 
          grid.scrollTo({ left: scrollPos, behavior: 'smooth' });
        }
      });
    });

    const cardObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const index = Array.from(releaseCards).indexOf(entry.target);
          carouselDots.forEach(d => d.classList.remove('active'));
          if (carouselDots[index]) carouselDots[index].classList.add('active');
        }
      });
    }, { root: grid, threshold: 0.6 });

    releaseCards.forEach(card => cardObserver.observe(card));
  }
});

function openPlayer(ytId, title, artist) {
  if(modal && mainPlayer) {
    mainPlayer.src = `https://www.youtube.com/embed/${ytId}?autoplay=1`;
    modalTitle.textContent = title;
    modalArtist.textContent = artist;
    modal.style.display = 'flex';
    document.body.classList.add('no-scroll'); // TRAVA O FUNDO AQUI
  }
}

function closePlayer() {
  if(modal && mainPlayer) {
    modal.style.display = 'none';
    mainPlayer.src = '';
    document.body.classList.remove('no-scroll'); // DESTRAVA O FUNDO AQUI
  }
}

function openModalTrack(index) {
  if(!releaseCards.length) return;
  currentModalIndex = index;
  releaseCards.forEach(card => card.classList.remove('active'));
  const activeCard = releaseCards[index];
  activeCard.classList.add('active');
  const ytId = activeCard.getAttribute('data-yt');
  const title = activeCard.getAttribute('data-title');
  const artist = activeCard.getAttribute('data-artist');
  openPlayer(ytId, title, artist);
}

function nextModalTrack() {
  if(!releaseCards.length) return;
  let nextIndex = (currentModalIndex + 1) % releaseCards.length;
  openModalTrack(nextIndex);
}

function prevModalTrack() {
  if(!releaseCards.length) return;
  let prevIndex = (currentModalIndex - 1 + releaseCards.length) % releaseCards.length;
  openModalTrack(prevIndex);
}

// ========================================================
// NOVA LÓGICA: MODAL DE INFORMAÇÕES DO ARTISTA (POP-UP)
// ========================================================
const artistInfoModal = document.getElementById('artist-info-modal');
const infoModalImg = document.getElementById('info-modal-img');
const infoModalName = document.getElementById('info-modal-name');
const infoModalCat = document.getElementById('info-modal-cat');
const infoModalBio = document.getElementById('info-modal-bio');
const infoModalHitTitle = document.getElementById('info-modal-hit-title');
const infoModalHitLink = document.getElementById('info-modal-hit-link');
const infoModalInsta = document.getElementById('info-modal-insta');
const infoModalYt = document.getElementById('info-modal-yt');
const infoModalSpotify = document.getElementById('info-modal-spotify');

function openArtistModal(name, category, imgSrc, bio, hitTitle, hitLink, statInsta, statYt, statSpotify) {
  if (artistInfoModal) {
    infoModalName.textContent = name;
    infoModalCat.textContent = category;
    infoModalImg.src = imgSrc;
    
    if (infoModalBio) infoModalBio.textContent = bio; 
    
    if (infoModalHitTitle && infoModalHitLink) {
      infoModalHitTitle.textContent = hitTitle;
      infoModalHitLink.href = hitLink;
    }

    if (infoModalInsta) infoModalInsta.textContent = statInsta;
    if (infoModalYt) infoModalYt.textContent = statYt;
    if (infoModalSpotify) infoModalSpotify.textContent = statSpotify;
    
    artistInfoModal.style.display = 'flex';
    document.body.classList.add('no-scroll'); // TRAVA O FUNDO AQUI
  }
}

function closeArtistModal() {
  if (artistInfoModal) {
    artistInfoModal.style.display = 'none';
    document.body.classList.remove('no-scroll'); // DESTRAVA O FUNDO AQUI
  }
}

// Fechar modais ao clicar fora da caixa principal
window.addEventListener('click', (e) => {
  if (e.target === modal) closePlayer();
  if (e.target === artistInfoModal) closeArtistModal();
});

// ========================================================
// INTERATIVIDADE SEGURA E CORREÇÕES MOBILE
// ========================================================

document.addEventListener('DOMContentLoaded', () => {

  // 1. INJETAR BOTÃO DE FECHAR NO MENU MOBILE AUTOMATICAMENTE
  const navMenuUl = document.getElementById('navMenu');
  if (navMenuUl && !document.querySelector('.mobile-close-item')) {
    const closeLi = document.createElement('li');
    closeLi.className = 'mobile-close-item mobile-only';
    closeLi.innerHTML = '<button type="button" onclick="closeMenu()"> FECHAR <i class="fas fa-times"></i></button>';
    navMenuUl.insertBefore(closeLi, navMenuUl.firstChild);
  }

  // 2. INJETAR DICA DE ARRASTAR NOS SHORTS AUTOMATICAMENTE
  const ytCard = document.querySelector('.yt-card');
  const shortsContainer = document.querySelector('.yt-shorts-container');
  if (ytCard && shortsContainer && !document.querySelector('.swipe-hint')) {
    const hint = document.createElement('div');
    hint.className = 'swipe-hint mobile-only';
    hint.innerHTML = 'Arraste para o lado <i class="fas fa-arrow-right"></i>';
    ytCard.insertBefore(hint, shortsContainer);
  }

  // 3. SCROLL REVEAL (Aplica apenas em contêineres seguros)
  const elementsToAnimate = document.querySelectorAll(`
    .corporate-header-wrapper, 
    .release-card, 
    .unique-link-item, 
    .social-card, 
    .artist-flip-card, 
    .identity-text-column, 
    .documents-grid
  `);
  
  elementsToAnimate.forEach((el, index) => {
    el.classList.add('fade-up');
    el.style.transitionDelay = `${(index % 4) * 0.1}s`;
  });

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); 
      }
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });

  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

  // 4. APLICA O EFEITO DE HOVER SEGURO NOS CARDS
  const hoverCards = document.querySelectorAll('.release-card, .unique-link-item, .conquista-card');
  hoverCards.forEach(card => card.classList.add('hover-float'));

  // 5. PARALLAX NO VÍDEO DO HERO (Super leve)
  const heroVideoContainer = document.querySelector('.video-background');
  if (heroVideoContainer) {
    window.addEventListener('scroll', () => {
      if (window.scrollY < window.innerHeight) {
        heroVideoContainer.style.transform = `translateY(${window.scrollY * 0.3}px)`;
      }
    });
  }

  // 6. LÓGICA DE TOQUE PARA VIRAR CARTA DE ARTISTA NO MOBILE
  const flipCards = document.querySelectorAll('.artist-flip-card');
  flipCards.forEach(card => {
    card.addEventListener('click', function(e) {
      if(e.target.closest('a') || e.target.closest('button') || e.target.closest('.btn-ver-perfil')) return;
      
      const isFlipped = this.classList.contains('mobile-flip');
      flipCards.forEach(c => c.classList.remove('mobile-flip')); 
      
      if (!isFlipped) {
        this.classList.add('mobile-flip'); 
      }
    });
  });
});

// ========================================================
// PLAYLIST DE VÍDEOS: CORTE SECO E PRÉ-CARREGAMENTO OTIMIZADO
// ========================================================
document.addEventListener('DOMContentLoaded', () => { 
  const heroVideos = [
    "assets/paiva.mp4",
    "assets/paulinho.mp4",
    "assets/gm.mp4",
    "assets/mirela.mp4",
    "assets/lipi.mp4",
    "assets/cbzinho.mp4",
    "assets/nath.mp4",
    "assets/lemos.mp4",
    "assets/j9.mp4",
    "assets/GPDAZL.mp4",
    "assets/blk.mp4",
    "assets/MARCHI.mp4"
  ];

  const video1 = document.getElementById('bg-video-1');
  const video2 = document.getElementById('bg-video-2');

  if (video1 && video2 && heroVideos.length > 0) {
    let currentVideoIndex = 0;
    let nextVideoIndex = 1;
    
    // Configurações padrão de segurança (Mudo e Sem Autoplay traidor)
    video1.muted = true;
    video2.muted = true;
    video1.removeAttribute('autoplay');
    video2.removeAttribute('autoplay');
    video1.setAttribute('playsinline', '');
    video2.setAttribute('playsinline', '');
    
    // Inicia o primeiro vídeo manualmente via código
    video1.src = heroVideos[currentVideoIndex];
    video1.load();
    video1.play().catch(e => console.warn("Play inicial bloqueado:", e));
    video1.classList.add('active');
    
    // Pré-carrega o segundo de forma silenciosa e PAUSADA
    video2.src = heroVideos[nextVideoIndex];
    video2.load();

    const handleVideoEnd = (activeVid, hiddenVid) => {
      // 1. Toca o vídeo que estava pré-carregado
      hiddenVid.play().then(() => {
        // 2. Faz o corte seco visualmente
        activeVid.classList.remove('active');
        hiddenVid.classList.add('active');
        
        // 3. Pausa e zera o vídeo antigo imediatamente
        activeVid.pause();
        activeVid.currentTime = 0;
        
        // Atualiza os índices
        currentVideoIndex = nextVideoIndex;
        nextVideoIndex = (nextVideoIndex + 1) % heroVideos.length;
        
        // 4. Puxa o próximo arquivo silenciosamente para ficar engatilhado
        setTimeout(() => {
          activeVid.src = heroVideos[nextVideoIndex];
          activeVid.load();
        }, 300); 

      }).catch(err => console.error("Erro no corte de vídeo:", err));
    };

    video1.addEventListener('ended', () => handleVideoEnd(video1, video2));
    video2.addEventListener('ended', () => handleVideoEnd(video2, video1));
  }
});