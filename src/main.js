// Vanguard Synthesis - Brutalist & Monospaced Interactive System (GSAP Integrated)

document.addEventListener('DOMContentLoaded', () => {
  // Registers GSAP ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);

  initThemeToggle();
  initPageIntro();
  initCustomCursor();
  initLiquidGlassCanvas();
  init3DTiltCards();
  initMethodologyStepper();
  initBudgetChips();
  initDynamicClock();
  initYearSetter();
  initScrollAnimations();
});

/* =========================================================================
   0. LIGHT/DAY MODE THEME TOGGLING
   ========================================================================= */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return;

  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
    toggleBtn.textContent = '[ DARK ]';
  } else {
    toggleBtn.textContent = '[ DAY ]';
  }

  toggleBtn.addEventListener('click', () => {
    const isLight = document.body.classList.toggle('light-mode');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    toggleBtn.textContent = isLight ? '[ DARK ]' : '[ DAY ]';
  });
}

/* =========================================================================
   1. PAGE INTRO TIMELINE (On Load Entrance)
   ========================================================================= */
function initPageIntro() {
  const overlay = document.getElementById('page-overlay');
  if (!overlay) return;

  const tl = gsap.timeline({
    defaults: { ease: 'power3.out' }
  });

  // 1) Fade out screen transition overlay
  tl.to(overlay, {
    opacity: 0,
    duration: 0.6,
    onComplete: () => {
      overlay.style.display = 'none';
    }
  });

  // 2) Stagger entrance of navbar elements
  tl.fromTo('.navlink-anim', 
    { opacity: 0, y: -12 }, 
    { opacity: 1, y: 0, duration: 0.45, stagger: 0.05 },
    '-=0.4'
  );

  // 3) Scale in and fade in hero background photo
  tl.fromTo('#heroBackground',
    { opacity: 0, scale: 1.08 },
    { opacity: 1, scale: 1, duration: 1.8, ease: 'power2.out' },
    '-=0.6'
  );

  // 4) Stagger details inside hero container
  tl.fromTo(
    ['#hero-intro-tag', '#hero-intro-title', '#hero-intro-subtext', '#hero-intro-actions', '#hero-intro-stats'],
    { opacity: 0, y: 18 },
    { opacity: 1, y: 0, duration: 0.8, stagger: 0.08 },
    '-=1.4'
  );
}

/* =========================================================================
   2. CUSTOM CURSOR
   ========================================================================= */
function initCustomCursor() {
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  
  if (!dot || !ring) return;

  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;
  
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
  });

  const tick = () => {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    
    ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(tick);
  };
  tick();

  const updateInteractiveHover = () => {
    const interactives = document.querySelectorAll(
      'a, button, select, input, textarea, .budget-chip, .methodology-tab, .portfolio-item, .founder-card'
    );
    
    interactives.forEach(el => {
      el.removeEventListener('mouseenter', addHoverClass);
      el.removeEventListener('mouseleave', removeHoverClass);
      
      el.addEventListener('mouseenter', addHoverClass);
      el.addEventListener('mouseleave', removeHoverClass);
    });
  };

  function addHoverClass() {
    document.body.classList.add('hovering-interactive');
  }

  function removeHoverClass() {
    document.body.classList.remove('hovering-interactive');
  }

  updateInteractiveHover();
  setInterval(updateInteractiveHover, 1500);
}

/* =========================================================================
   3. LIQUID CANVAS (Forest, Sand, Amber Blobs)
   ========================================================================= */
function initLiquidGlassCanvas() {
  const canvas = document.getElementById('fluid-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  let mouse = { x: width / 2, y: height / 2, targetX: width / 2, targetY: height / 2, active: false };

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  window.addEventListener('mousemove', (e) => {
    mouse.targetX = e.clientX;
    mouse.targetY = e.clientY;
    mouse.active = true;
  });

  window.addEventListener('mouseleave', () => {
    mouse.active = false;
  });

  class Blob {
    constructor(x, y, radius, colorString, baseSpeedX, baseSpeedY) {
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.color = colorString;
      this.vx = baseSpeedX;
      this.vy = baseSpeedY;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x - this.radius < 0) {
        this.x = this.radius;
        this.vx *= -1;
      } else if (this.x + this.radius > width) {
        this.x = width - this.radius;
        this.vx *= -1;
      }

      if (this.y - this.radius < 0) {
        this.y = this.radius;
        this.vy *= -1;
      } else if (this.y + this.radius > height) {
        this.y = height - this.radius;
        this.vy *= -1;
      }

      if (mouse.active) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 400) {
          const force = (400 - dist) / 400 * 0.05;
          this.vx += (dx / dist) * force;
          this.vy += (dy / dist) * force;
          
          const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
          const maxSpeed = 2.5;
          if (speed > maxSpeed) {
            this.vx = (this.vx / speed) * maxSpeed;
            this.vy = (this.vy / speed) * maxSpeed;
          }
        }
      }
    }

    draw() {
      let renderColor = this.color;
      if (document.body.classList.contains('light-mode')) {
        renderColor = renderColor.replace('0.16', '0.12').replace('0.14', '0.1').replace('0.12', '0.08');
      }

      const gradient = ctx.createRadialGradient(
        this.x, this.y, 0,
        this.x, this.y, this.radius
      );
      
      gradient.addColorStop(0, renderColor);
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const blobs = [
    new Blob(width * 0.15, height * 0.25, 260, 'rgba(16, 185, 129, 0.16)', 0.4, 0.3),   // Forest Green
    new Blob(width * 0.85, height * 0.2, 290, 'rgba(230, 225, 216, 0.14)', -0.3, 0.4),  // Sand
    new Blob(width * 0.5, height * 0.75, 330, 'rgba(226, 192, 116, 0.14)', 0.3, -0.3),  // Gold/Amber
    new Blob(width * 0.3, height * 0.8, 240, 'rgba(16, 185, 129, 0.12)', -0.4, -0.4),   // Forest Green 2
    new Blob(width * 0.7, height * 0.6, 280, 'rgba(230, 225, 216, 0.12)', 0.2, 0.3)    // Sand 2
  ];

  const animate = () => {
    ctx.clearRect(0, 0, width, height);

    mouse.x += (mouse.targetX - mouse.x) * 0.08;
    mouse.y += (mouse.targetY - mouse.y) * 0.08;

    blobs.forEach(blob => {
      blob.update();
      blob.draw();
    });

    requestAnimationFrame(animate);
  };
  animate();
}

/* =========================================================================
   4. 3D TILT CARDS
   ========================================================================= */
function init3DTiltCards() {
  const cards = document.querySelectorAll('.tilt-card');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const width = rect.width;
      const height = rect.height;
      
      const rotateX = -((y - height / 2) / (height / 2)) * 6;
      const rotateY = ((x - width / 2) / (width / 2)) * 6;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(5px)`;
      
      card.style.setProperty('--mx', `${x}px`);
      card.style.setProperty('--my', `${y}px`);
    });
    
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'none';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
    });
  });
}

/* =========================================================================
   5. METHODOLOGY STEPPER
   ========================================================================= */
function initMethodologyStepper() {
  const tabs = document.querySelectorAll('.methodology-tab');
  const panels = document.querySelectorAll('.methodology-panel');
  
  if (tabs.length === 0 || panels.length === 0) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const stepNum = tab.getAttribute('data-step');
      
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      panels.forEach(panel => {
        panel.classList.remove('active');
        if (panel.getAttribute('data-panel') === stepNum) {
          panel.classList.add('active');
        }
      });
    });
  });
}

/* =========================================================================
   6. BUDGET CHIPS
   ========================================================================= */
function initBudgetChips() {
  const chips = document.querySelectorAll('.budget-chip');
  if (chips.length === 0) return;

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
    });
  });
}

/* =========================================================================
   7. DYNAMIC DUAL TIME CLOCKS (IST & LDN)
   ========================================================================= */
function initDynamicClock() {
  const updateClock = () => {
    const now = new Date();
    
    // IST Time Formatter (Asia/Kolkata)
    const istFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    
    // LDN Time Formatter (Europe/London)
    const ldnFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Europe/London',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    
    const istTime = istFormatter.format(now);
    const ldnTime = ldnFormatter.format(now);
    
    const showColon = now.getSeconds() % 2 === 0;
    const colonHTML = `<span class="clock-colon" style="opacity: ${showColon ? 1 : 0.25}">:</span>`;
    
    const formattedIST = istTime.replace(':', colonHTML);
    const formattedLDN = ldnTime.replace(':', colonHTML);
    
    const clockContainer = document.getElementById('nav-dual-clocks');
    if (clockContainer) {
      clockContainer.innerHTML = `IST ${formattedIST} | LDN ${formattedLDN}`;
    }
  };

  updateClock();
  setInterval(updateClock, 1000);
}

/* =========================================================================
   8. ACTIVE YEAR AUTO-SETTER
   ========================================================================= */
function initYearSetter() {
  const currentYear = new Date().getFullYear();
  document.querySelectorAll('[data-year]').forEach(el => {
    el.textContent = currentYear;
  });
}

/* =========================================================================
   9. GSAP SCROLL TRIGGERS & MOTION
   ========================================================================= */
function initScrollAnimations() {
  // 1) Hero Image Parallax
  const heroImg = document.getElementById('heroBackground');
  if (heroImg) {
    gsap.fromTo(heroImg,
      { yPercent: -10 },
      {
        yPercent: 12,
        ease: 'none',
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      }
    );
  }

  // 2) Split-Text Reveal (Headline word-fade-in stagger)
  const textFadeElements = document.querySelectorAll('[text-fade]');
  textFadeElements.forEach(el => {
    const textContent = el.innerText;
    const words = textContent.split(/\s+/);
    
    el.innerHTML = words.map(word => 
      `<span class="word-reveal" style="display: inline-block; opacity: 0.15; transform: translate3d(0,2px,0); will-change: opacity, transform;">${word}</span>`
    ).join(' ');
    
    const wordSpans = el.querySelectorAll('.word-reveal');
    gsap.to(wordSpans, {
      opacity: 1,
      y: 0,
      stagger: 0.06,
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        end: 'top 50%',
        scrub: 1.5
      }
    });
  });

  // 3) Stomp Stack Opportunities Scroll Trigger
  const stompRows = document.querySelectorAll('.stomp-stack-row');
  stompRows.forEach(row => {
    const tracks = row.querySelectorAll('.stomp-track');
    const subtext = row.querySelector('.stomp-subtext');
    
    // Animate tracks (slide vertical values)
    gsap.to(tracks, {
      y: -52, // Height of stomp track box
      scrollTrigger: {
        trigger: '#opportunity-trigger',
        start: 'top 85%',
        toggleActions: 'play none none reverse',
        once: false
      }
    });

    // Fade in subtext stagger
    if (subtext) {
      gsap.to(subtext, {
        opacity: 1,
        y: 0,
        scrollTrigger: {
          trigger: '#opportunity-trigger',
          start: 'top 85%',
          toggleActions: 'play none none reverse',
          once: false
        }
      });
    }
  });

  // 4) Dynamic Section Slide Up Reveal
  const sectionSlideUpElements = document.querySelectorAll('[data-section-slide-up]');
  sectionSlideUpElements.forEach(sec => {
    gsap.fromTo(sec, 
      { opacity: 0, y: 35 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: sec,
          start: 'top 88%',
          toggleActions: 'play none none none',
          once: true
        }
      }
    );
  });
}
