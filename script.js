// ========================================================
// PRELOADER
// ========================================================
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    setTimeout(() => {
      preloader.classList.add('loader-hidden'); 
      document.body.classList.add('loaded'); 
      setTimeout(() => { preloader.style.display = 'none'; }, 500);
    }, 900);
  } else {
    document.body.classList.add('loaded');
  }
});

// ========================================================
// MENU MOBILE
// ========================================================
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

window.addEventListener('scroll', () => {
  const nav = document.querySelector('.navbar');
  if (window.scrollY > 50) {
    nav.classList.add('nav-active');
  } else {
    nav.classList.remove('nav-active');
  }
});

// ========================================================
// MODAL DE INFORMAÇÕES DO PRODUTO/MARCA
// ========================================================
const artistInfoModal = document.getElementById('artist-info-modal');
const infoModalImg = document.getElementById('info-modal-img');
const infoModalName = document.getElementById('info-modal-name');
const infoModalCat = document.getElementById('info-modal-cat');
const infoModalBio = document.getElementById('info-modal-bio');
const infoModalInsta = document.getElementById('info-modal-insta');
const infoModalYt = document.getElementById('info-modal-yt');
const infoModalSpotify = document.getElementById('info-modal-spotify');

function openArtistModal(name, category, imgSrc, bio, hitTitle, hitLink, statInsta, statYt, statSpotify) {
  if (artistInfoModal) {
    infoModalName.textContent = name;
    infoModalCat.textContent = category;
    
    if(infoModalImg && imgSrc) infoModalImg.src = imgSrc;
    if (infoModalBio) infoModalBio.textContent = bio; 

    if (infoModalInsta) infoModalInsta.textContent = statInsta;
    if (infoModalYt) infoModalYt.textContent = statYt;
    if (infoModalSpotify) infoModalSpotify.textContent = statSpotify;
    
    artistInfoModal.style.display = 'flex';
    document.body.classList.add('no-scroll'); 
  }
}

function closeArtistModal() {
  if (artistInfoModal) {
    artistInfoModal.style.display = 'none';
    document.body.classList.remove('no-scroll');
  }
}

window.addEventListener('click', (e) => {
  if (e.target === artistInfoModal) closeArtistModal();
});

// ========================================================
// MICRO-INTERAÇÕES PREMIUM (MAGNETIC BTN E CONTADORES)
// ========================================================
document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Botão Fechar Mobile
  const navMenuUl = document.getElementById('navMenu');
  if (navMenuUl && !document.querySelector('.mobile-close-item')) {
    const closeLi = document.createElement('li');
    closeLi.className = 'mobile-close-item mobile-only';
    closeLi.innerHTML = '<button type="button" onclick="closeMenu()"> FECHAR <i class="fas fa-times"></i></button>';
    navMenuUl.insertBefore(closeLi, navMenuUl.firstChild);
  }

  // 2. Lógica de Virar Carta no Mobile
  const flipCards = document.querySelectorAll('.artist-flip-card');
  flipCards.forEach(card => {
    card.addEventListener('click', function(e) {
      if(e.target.closest('a') || e.target.closest('button') || e.target.closest('.btn-ver-perfil')) return;
      const isFlipped = this.classList.contains('mobile-flip');
      flipCards.forEach(c => c.classList.remove('mobile-flip')); 
      if (!isFlipped) this.classList.add('mobile-flip'); 
    });
  });

  // 3. Efeito Magnético nos Botões (UX Premium)
  const magneticBtns = document.querySelectorAll('.btn-corporate-solid, .btn-corporate-outline, .btn-footer-red');
  magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      // Multiplicador baixo para um efeito elegante e não exagerado
      btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`; 
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = `translate(0px, 0px)`;
    });
  });

  // 4. Animador de Números (Contadores)
  const counters = document.querySelectorAll('.counter-anim');
  const animateCounters = () => {
    counters.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      const hasPlus = counter.hasAttribute('data-plus');
      const duration = 1200; // ms
      const increment = target > 1000 ? 23 : 1; // Rápido para anos, um por um para números pequenos
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          counter.innerText = (hasPlus ? '+' : '') + target;
          clearInterval(timer);
        } else {
          counter.innerText = (hasPlus ? '+' : '') + current;
        }
      }, duration / (target / increment));
    });
  };

  const counterObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters();
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.gsds-year-badge').forEach(badge => {
    counterObserver.observe(badge);
  });

});
