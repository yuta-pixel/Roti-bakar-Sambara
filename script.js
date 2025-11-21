/*SLIDE (2 slides)*/
(() => {
  const slides = Array.from(document.querySelectorAll('.slide'));
  const dots = Array.from(document.querySelectorAll('.dot'));
  const prev = document.querySelector('.prev');
  const next = document.querySelector('.next');
  const slider = document.querySelector('.slider-container');
  if(!slides.length) return;

  let idx = 0;
  let timer = null;
  const AUTOPLAY_MS = 3000;

  function go(i){
    idx = (i + slides.length) % slides.length;
    slides.forEach((s, si) => {
      s.classList.toggle('active', si === idx);
    });
    dots.forEach((d, di) => d.classList.toggle('active', di === idx));
  }

  function nextSlide(){
    go(idx + 1);
  }
  function prevSlide(){
    go(idx - 1);
  }

  // arrows
  if(next) next.addEventListener('click', () => { nextSlide(); resetTimer(); });
  if(prev) prev.addEventListener('click', () => { prevSlide(); resetTimer(); });

  // dots
  dots.forEach((d,i) => d.addEventListener('click', () => { go(i); resetTimer(); }));

  // autoplay
  function startTimer(){ stopTimer(); timer = setInterval(nextSlide, AUTOPLAY_MS); }
  function stopTimer(){ if(timer) clearInterval(timer); timer = null; }
  function resetTimer(){ stopTimer(); startTimer(); }

  // pause on hover/touch
  slider.addEventListener('mouseenter', stopTimer);
  slider.addEventListener('mouseleave', startTimer);
  slider.addEventListener('touchstart', stopTimer, {passive:true});
  slider.addEventListener('touchend', startTimer, {passive:true});

  // swipe
  let startX = 0;
  slider.addEventListener('touchstart', e => startX = e.touches[0].clientX, {passive:true});
  slider.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - startX;
    if(Math.abs(dx) > 40){
      if(dx < 0) nextSlide(); else prevSlide();
      resetTimer();
    }
  }, {passive:true});

  // init
  go(0);
  startTimer();
})();

/* SMOOTH SCROLL */
(() => {
  const navBtns = Array.from(document.querySelectorAll('.nav-btn'));
  navBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      // active class
      navBtns.forEach(n => n.classList.remove('active'));
      btn.classList.add('active');

      // scroll
      const targetId = btn.getAttribute('href') || btn.dataset.href || ('#' + btn.textContent.trim().toLowerCase());
      const target = document.querySelector(targetId);
      if(target){
        const top = target.getBoundingClientRect().top + window.pageYOffset - document.querySelector('.navbar').offsetHeight - 8;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // nav on scroll (simple)
  const sections = ['home','menu','contact'].map(id => document.getElementById(id)).filter(Boolean);
  function onScroll(){
    const y = window.pageYOffset;
    sections.forEach(sec => {
      const rect = sec.getBoundingClientRect();
      const top = rect.top + window.pageYOffset;
      const height = rect.height;
      const btn = document.querySelector(`.nav-btn[href="#${sec.id}"]`);
      if(y >= top - 120 && y < top + height - 120){
        if(btn){ document.querySelectorAll('.nav-btn').forEach(n=>n.classList.remove('active')); btn.classList.add('active'); }
      }
    });
  }
  window.addEventListener('scroll', onScroll);
})();

/* ------------------- INFO BOX FADE-IN ------------------- */
(() => {
  const info = document.querySelector('.info-box');
  if(!info) return;
  function check(){
    const r = info.getBoundingClientRect();
    if(r.top < window.innerHeight - 80) info.classList.add('show');
  }
  window.addEventListener('scroll', check);
  window.addEventListener('load', check);
  check();
})();

/* MENU ANIMATION */
(() => {
  const cards = Array.from(document.querySelectorAll('.menu-card, .series-card'));
  const listItems = Array.from(document.querySelectorAll('.series-list li'));
  // show series cards staggered when in view
  function reveal(){
    cards.forEach((card, i) => {
      const r = card.getBoundingClientRect();
      if(r.top < window.innerHeight - 60) {
        setTimeout(()=> card.classList.add('show'), i * 140);
      }
    });
    // show list items with small stagger
    listItems.forEach((li, idx) => {
      const r = li.getBoundingClientRect();
      if(r.top < window.innerHeight - 60) {
        setTimeout(()=> li.classList.add('visible'), idx * 30);
      }
    });
  }
  window.addEventListener('scroll', reveal);
  window.addEventListener('load', reveal);
  reveal();
})();

/* ------------------- MENU ITEM CLICK -> WA ORDER TEMPLATE ------------------- */
(() => {
  const phone = '6282224086045';
  document.querySelectorAll('.series-list li').forEach(li => {
    li.setAttribute('tabindex', '0');
    li.addEventListener('click', () => {
      const name = li.dataset.name || li.textContent.trim();
      const text = encodeURIComponent(`Halo Roti Bakar Sambara, saya ingin pesan: ${name}. Jumlah: `);
      window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
    });
    // keyboard enter
    li.addEventListener('keydown', e => { if(e.key === 'Enter' || e.key === ' ') li.click(); });
  });
})();

/* ------------------- Accessibility small tweaks ------------------- */
(() => {
  // make dots keyboard focusable
  document.querySelectorAll('.dot').forEach(d => d.setAttribute('tabindex','0'));
})();
