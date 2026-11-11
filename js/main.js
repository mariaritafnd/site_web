/**
 * INOVA ODONTO — CORE FRONT-END INTERACTION SYSTEM
 * Arquitetura de microinterações 3D, parallax tilt, contadores e gestão de conversão
 */

document.addEventListener('DOMContentLoaded', () => {
  initAudioSystem();
  initStickyHeader();
  initMobileMenu();
  init3DCardTilt();
  initAnimatedCounters();
  initAppointmentModal();
  initToastSystem();
  initFaqAccordions();
  initServiceFilters();
  initWhatsAppTracking();
  initBeforeAfterSliders();
  initSmileSimulator();
});

/* ==========================================================================
   0. CYBERNETIC SOUND EFFECTS (WEB AUDIO API NATIVA)
   ========================================================================== */
class CyberSoundEffects {
  constructor() {
    this.ctx = null;
    this.enabled = localStorage.getItem('inova_sound_enabled') === 'true';
  }

  init() {
    if (!this.ctx && typeof AudioContext !== 'undefined') {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  playClick() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(280, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch (e) {
      console.warn('Audio non-blocking exception', e);
    }
  }

  playHover() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(450, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(620, this.ctx.currentTime + 0.025);

      gain.gain.setValueAtTime(0.012, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.025);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.025);
    } catch (e) {}
  }

  playSuccess() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();

      const now = this.ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.06);
        gain.gain.setValueAtTime(0.025, now + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.12);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.06);
        osc.stop(now + i * 0.06 + 0.12);
      });
    } catch (e) {}
  }

  toggle() {
    this.enabled = !this.enabled;
    localStorage.setItem('inova_sound_enabled', this.enabled);
    if (this.enabled) {
      this.init();
      this.playSuccess();
    }
    return this.enabled;
  }
}

const soundFX = new CyberSoundEffects();
window.soundFX = soundFX;

function initAudioSystem() {
  const soundBtns = document.querySelectorAll('.sound-toggle-btn');
  
  const updateBtns = (active) => {
    soundBtns.forEach((btn) => {
      btn.innerHTML = active 
        ? '<i class="fas fa-volume-up" style="color:var(--color-primary-intense);"></i>' 
        : '<i class="fas fa-volume-mute" style="color:var(--color-gray-muted);"></i>';
      btn.title = active ? 'Efeitos Sonoros: Ativados' : 'Efeitos Sonoros: Desativados';
    });
  };

  soundBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const isActive = soundFX.toggle();
      updateBtns(isActive);
      showToast(isActive ? 'Efeitos sonoros futuristas ativados 🔊' : 'Efeitos sonoros desativados 🔇', 'info');
    });
  });

  updateBtns(soundFX.enabled);

  // Microinterações de áudio em botões e links interativos
  document.addEventListener('click', (e) => {
    if (e.target.closest('button, .btn, .nav-link, .sidebar-item, .tooth-box, .sim-option-card')) {
      soundFX.playClick();
    }
  });

  document.querySelectorAll('button, .btn, .card-3d, .sidebar-item, .tooth-box').forEach(el => {
    el.addEventListener('mouseenter', () => soundFX.playHover());
  });
}

/* ==========================================================================
   1. STICKY HEADER & NAVBAR GLASS
   ========================================================================== */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* ==========================================================================
   2. MOBILE MENU DRAWER
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    toggleBtn.setAttribute('aria-expanded', isOpen);
    toggleBtn.innerHTML = isOpen ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
  });

  // Fecha o menu ao clicar fora ou em um link
  document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !toggleBtn.contains(e.target) && navMenu.classList.contains('open')) {
      navMenu.classList.remove('open');
      toggleBtn.innerHTML = '<i class="fas fa-bars"></i>';
    }
  });
}

/* ==========================================================================
   3. 3D CARD TILT & PARALLAX EFFECT (SUAVE E SEM JITTER)
   ========================================================================== */
function init3DCardTilt() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const cards = document.querySelectorAll('.card-3d, .metric-card-3d, .team-card-3d');

  cards.forEach((card) => {
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.08s ease-out, box-shadow 0.3s ease, border-color 0.3s ease';
    });

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-8px) scale3d(1.015, 1.015, 1.015)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.45s ease, border-color 0.45s ease';
      card.style.transform = '';
    });
  });
}

/* ==========================================================================
   4. ANIMATED NUMERICAL COUNTERS
   ========================================================================== */
function initAnimatedCounters() {
  const counters = document.querySelectorAll('.metric-number');
  if (!counters.length) return;

  let animated = false;

  const runCounters = () => {
    counters.forEach((counter) => {
      const target = parseFloat(counter.getAttribute('data-target') || '0');
      const prefix = counter.getAttribute('data-prefix') || '';
      const suffix = counter.getAttribute('data-suffix') || '';
      const duration = 2000;
      const stepTime = 20;
      const steps = duration / stepTime;
      const increment = target / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }

        const displayVal = target >= 1000 
          ? (Math.floor(current)).toLocaleString('pt-BR') 
          : (Number.isInteger(target) ? Math.floor(current) : current.toFixed(1));

        counter.textContent = `${prefix}${displayVal}${suffix}`;
      }, stepTime);
    });
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        runCounters();
      }
    });
  }, { threshold: 0.2 });

  const section = document.querySelector('.metrics-section');
  if (section) observer.observe(section);
}

/* ==========================================================================
   5. MODAL DE AGENDAMENTO INTELIGENTE (AUTO-INJEÇÃO UNIVERSAL)
   ========================================================================== */
function ensureAppointmentModal() {
  let modalBackdrop = document.getElementById('appointment-modal');
  if (!modalBackdrop) {
    modalBackdrop = document.createElement('div');
    modalBackdrop.className = 'modal-backdrop';
    modalBackdrop.id = 'appointment-modal';
    modalBackdrop.innerHTML = `
      <div class="modal-box">
        <button class="modal-close" data-close-modal aria-label="Fechar modal">
          <i class="fas fa-times"></i>
        </button>

        <div style="text-align: center; margin-bottom: 24px;">
          <div class="eyebrow-badge" style="margin-bottom: 8px;">
            <i class="fas fa-calendar-check"></i>
            AGENDAMENTO INTELIGENTE
          </div>
          <h3 style="font-size: 1.45rem;">Solicitar Atendimento na Inova Odonto</h3>
          <p style="font-size: 0.85rem; color: var(--color-gray-muted);">
            Preencha os dados abaixo para ser encaminhado diretamente ao WhatsApp da clínica.
          </p>
        </div>

        <form id="quick-booking-form">
          <div class="form-group">
            <label class="form-label" for="modal-name">Seu Nome Completo *</label>
            <input type="text" id="modal-name" class="form-control" placeholder="Ex: Maria Queiroga" required>
          </div>

          <div class="form-group">
            <label class="form-label" for="modal-phone">WhatsApp para Contato *</label>
            <input type="tel" id="modal-phone" class="form-control" placeholder="(83) 99999-9999" required>
          </div>

          <div class="form-group">
            <label class="form-label" for="modal-procedure">Procedimento de Interesse *</label>
            <select id="modal-procedure" class="form-control" style="background:#15151D;" required>
              <option value="Avaliação Geral">Avaliação Clínica Geral</option>
              <option value="Lentes de Contato Dental">Lentes de Contato em Porcelana</option>
              <option value="Harmonização Orofacial">Harmonização Orofacial</option>
              <option value="Alinhadores Invisíveis">Alinhadores Transparentes (Ortodontia)</option>
              <option value="Implantes Dentários">Implantes Dentários Guiados</option>
              <option value="Clareamento a Laser">Clareamento a Laser LED</option>
              <option value="Endodontia / Canal">Tratamento de Canal (Endodontia)</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label" for="modal-date">Melhor Período para Consulta</label>
            <select id="modal-date" class="form-control" style="background:#15151D;">
              <option value="Manhã (08h às 12h)">Manhã (08h às 12h)</option>
              <option value="Tarde (13h às 18h)">Tarde (13h às 18h)</option>
              <option value="Sábado">Sábado (08h às 12h)</option>
              <option value="Primeiro horário vago">Primeiro horário vago disponível</option>
            </select>
          </div>

          <button type="submit" class="btn btn-primary" style="width: 100%; padding: 14px; margin-top: 10px;">
            <i class="fab fa-whatsapp"></i>
            <span>Confirmar e Conversar no WhatsApp</span>
          </button>
        </form>
      </div>
    `;
    document.body.appendChild(modalBackdrop);
  }
  return modalBackdrop;
}

function initAppointmentModal() {
  const modalBackdrop = ensureAppointmentModal();
  const triggerBtns = document.querySelectorAll('[data-open-modal="appointment"]');
  const closeBtns = modalBackdrop.querySelectorAll('[data-close-modal]');
  const bookingForm = modalBackdrop.querySelector('#quick-booking-form');

  const openModal = (procedure = '') => {
    modalBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';

    if (procedure && bookingForm) {
      const procSelect = bookingForm.querySelector('#modal-procedure');
      if (procSelect) {
        for (let opt of procSelect.options) {
          if (opt.value.toLowerCase().includes(procedure.toLowerCase()) || procedure.toLowerCase().includes(opt.value.toLowerCase())) {
            procSelect.value = opt.value;
            break;
          }
        }
      }
    }
  };

  const closeModal = () => {
    modalBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  };

  triggerBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const procedure = btn.getAttribute('data-procedure') || '';
      openModal(procedure);
    });
  });

  closeBtns.forEach((btn) => {
    btn.addEventListener('click', closeModal);
  });

  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) closeModal();
  });

  // Envio do formulário com integração direta ao WhatsApp
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = bookingForm.querySelector('#modal-name')?.value || 'Paciente';
      const phone = bookingForm.querySelector('#modal-phone')?.value || '';
      const procedure = bookingForm.querySelector('#modal-procedure')?.value || 'Avaliação Geral';
      const prefDate = bookingForm.querySelector('#modal-date')?.value || 'Próximo horário disponível';

      const message = `Olá, Inova Odonto! Me chamo *${name}* e gostaria de agendar uma consulta para *${procedure}* (Preferência: ${prefDate}). Aguardo contato!`;
      const encodedMsg = encodeURIComponent(message);
      const waUrl = `https://wa.me/558399011969?text=${encodedMsg}`;

      closeModal();
      showToast(`Solicitação enviada com sucesso! Redirecionando para o WhatsApp da Inova Odonto...`, 'success');

      setTimeout(() => {
        window.open(waUrl, '_blank');
      }, 1100);
    });
  }
}

/* ==========================================================================
   6. TOAST NOTIFICATION SYSTEM
   ========================================================================== */
function initToastSystem() {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
}

function showToast(message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    initToastSystem();
    container = document.querySelector('.toast-container');
  }

  if (type === 'success' && window.soundFX) {
    window.soundFX.playSuccess();
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const iconMap = {
    success: 'fa-check-circle',
    info: 'fa-info-circle',
    warning: 'fa-exclamation-triangle',
    error: 'fa-times-circle'
  };

  toast.innerHTML = `
    <i class="fas ${iconMap[type] || 'fa-bell'} toast-icon"></i>
    <div class="toast-content" style="font-size:0.9rem;">${message}</div>
  `;

  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 4500);
}

window.showToast = showToast;

/* ==========================================================================
   7. ACCORDION / FAQ INTERATIVO
   ========================================================================== */
function initFaqAccordions() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    const question = item.querySelector('.faq-question');
    if (!question) return;

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach((other) => other.classList.remove('active'));
      if (!isActive) item.classList.add('active');
    });
  });
}

/* ==========================================================================
   8. FILTRO DINÂMICO DE SERVIÇOS
   ========================================================================== */
function initServiceFilters() {
  const filterBtns = document.querySelectorAll('.service-filter-btn');
  const serviceCards = document.querySelectorAll('.service-filterable-card');

  if (!filterBtns.length || !serviceCards.length) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter') || 'all';

      serviceCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   9. WHATSAPP TRACKING & CONVERSÃO
   ========================================================================== */
function initWhatsAppTracking() {
  const waLinks = document.querySelectorAll('a[href*="wa.me"]');
  waLinks.forEach((link) => {
    link.addEventListener('click', () => {
      console.log('Conversão WhatsApp acionada:', link.href);
    });
  });
}

/* ==========================================================================
   10. COMPARADOR ANTES E DEPOIS DESLIZANTE 3D
   ========================================================================== */
function initBeforeAfterSliders() {
  const sliders = document.querySelectorAll('.before-after-card');
  sliders.forEach((card) => {
    const range = card.querySelector('.ba-slider-range');
    const afterImage = card.querySelector('.ba-after');
    const handleLine = card.querySelector('.ba-handle-line');
    const handleThumb = card.querySelector('.ba-handle-thumb');

    if (!range || !afterImage) return;

    const updateSlider = (val) => {
      afterImage.style.width = `${val}%`;
      if (handleLine) handleLine.style.left = `${val}%`;
      if (handleThumb) handleThumb.style.left = `${val}%`;
    };

    range.addEventListener('input', (e) => {
      updateSlider(e.target.value);
    });

    updateSlider(range.value || 50);
  });
}

/* ==========================================================================
   11. SIMULADOR DE SORRISO 3D & CALCULADORA
   ========================================================================== */
function initSmileSimulator() {
  const optionCards = document.querySelectorAll('.sim-option-card');
  const resultDuration = document.getElementById('sim-result-duration');
  const resultProcedures = document.getElementById('sim-result-procedures');
  const quoteBtn = document.getElementById('sim-quote-btn');

  if (!optionCards.length) return;

  const updateSimulation = () => {
    const selected = document.querySelectorAll('.sim-option-card.selected');
    let totalSessions = 0;
    let procList = [];

    selected.forEach((opt) => {
      const proc = opt.getAttribute('data-proc');
      const sessions = parseInt(opt.getAttribute('data-sessions') || '1', 10);
      if (proc) procList.push(proc);
      totalSessions += sessions;
    });

    if (resultDuration) {
      resultDuration.textContent = selected.length === 0 
        ? 'Selecione os objetivos acima' 
        : `Estimativa: ${totalSessions} sessões clínicas (${Math.max(1, Math.ceil(totalSessions / 2))} semanas)`;
    }

    if (resultProcedures) {
      resultProcedures.textContent = selected.length === 0 
        ? 'Nenhum tratamento selecionado' 
        : procList.join(' + ');
    }

    if (quoteBtn) {
      const msg = `Olá, Inova Odonto! Simulei meu tratamento no site para: ${procList.join(', ')}. Gostaria de agendar uma avaliação com Dra. Dayana!`;
      quoteBtn.href = `https://wa.me/558399011969?text=${encodeURIComponent(msg)}`;
    }
  };

  optionCards.forEach((opt) => {
    opt.addEventListener('click', () => {
      opt.classList.toggle('selected');
      const icon = opt.querySelector('.sim-checkbox i');
      if (icon) {
        icon.className = opt.classList.contains('selected') ? 'fas fa-check' : '';
      }
      updateSimulation();
    });
  });
}
