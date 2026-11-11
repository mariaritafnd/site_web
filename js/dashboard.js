/**
 * INOVA ODONTO OS — CLINICAL DASHBOARD SAAS CORE
 * Sistema de Gerenciamento Odontológico em Nuvem v2.4
 * Controles de Sidebar, Módulos, Odontograma Interativo 3D e Gráficos Chart.js
 */

document.addEventListener('DOMContentLoaded', () => {
  initSidebarToggle();
  initModuleNavigation();
  initDashboardCharts();
  initInteractiveOdontogram();
  initPatientSearch();
  initAgendaInteractions();
  initQuickPatientModal();
});

/* ==========================================================================
   1. SIDEBAR RETRÁTIL & NAVEGAÇÃO
   ========================================================================== */
function initSidebarToggle() {
  const sidebar = document.querySelector('.app-sidebar');
  const toggleBtn = document.querySelector('.sidebar-toggle-btn');
  const mobileToggle = document.querySelector('.mobile-dashboard-toggle');

  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
      const icon = toggleBtn.querySelector('i');
      if (icon) {
        icon.className = sidebar.classList.contains('collapsed') 
          ? 'fas fa-chevron-right' 
          : 'fas fa-chevron-left';
      }
    });
  }

  if (mobileToggle && sidebar) {
    mobileToggle.addEventListener('click', () => {
      sidebar.classList.toggle('mobile-open');
    });
  }
}

/* ==========================================================================
   2. NAVEGAÇÃO ENTRE MÓDULOS DO SISTEMA
   ========================================================================== */
function switchModule(targetModuleId) {
  const modules = document.querySelectorAll('.module-container');
  const sidebarNavItems = document.querySelectorAll('.sidebar-nav .sidebar-item[data-module]');

  // Atualiza active na sidebar
  sidebarNavItems.forEach((i) => {
    if (i.getAttribute('data-module') === targetModuleId) {
      i.classList.add('active');
    } else {
      i.classList.remove('active');
    }
  });

  // Alterna exibição do módulo
  modules.forEach((mod) => {
    if (mod.id === `module-${targetModuleId}`) {
      mod.classList.add('active');
    } else {
      mod.classList.remove('active');
    }
  });

  // Fecha sidebar móvel se aberta
  document.querySelector('.app-sidebar')?.classList.remove('mobile-open');

  // Redimensiona gráficos se necessário
  window.dispatchEvent(new Event('resize'));
}

function initModuleNavigation() {
  const allModuleTriggers = document.querySelectorAll('[data-module]');

  allModuleTriggers.forEach((item) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetModuleId = item.getAttribute('data-module');
      if (targetModuleId) {
        switchModule(targetModuleId);
      }
    });
  });
}

/* ==========================================================================
   3. GRÁFICOS FUTURISTAS COM CHART.JS (DARK/RED THEME)
   ========================================================================== */
function initDashboardCharts() {
  const renderCharts = () => {
    if (typeof Chart === 'undefined') return false;

    // Gráfico de Faturamento e Evolução Clínica
    const ctxRevenue = document.getElementById('chart-revenue-evolution');
    if (ctxRevenue && !ctxRevenue.chartInstance) {
      const gradient = ctxRevenue.getContext('2d').createLinearGradient(0, 0, 0, 300);
      gradient.addColorStop(0, 'rgba(255, 23, 68, 0.45)');
      gradient.addColorStop(0.7, 'rgba(229, 9, 50, 0.1)');
      gradient.addColorStop(1, 'rgba(229, 9, 50, 0.0)');

      ctxRevenue.chartInstance = new Chart(ctxRevenue, {
        type: 'line',
        data: {
          labels: ['Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov (Atual)'],
          datasets: [{
            label: 'Faturamento (R$)',
            data: [98400, 112000, 126500, 134200, 142000, 148650],
            borderColor: '#FF1744',
            borderWidth: 3,
            backgroundColor: gradient,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#FFFFFF',
            pointBorderColor: '#FF1744',
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 8
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: 'rgba(21, 21, 29, 0.95)',
              titleColor: '#FFF',
              bodyColor: '#FF1744',
              borderColor: 'rgba(229, 9, 50, 0.4)',
              borderWidth: 1,
              padding: 12,
              callbacks: {
                label: (ctx) => `R$ ${ctx.raw.toLocaleString('pt-BR')}`
              }
            }
          },
          scales: {
            x: {
              grid: { color: 'rgba(255, 255, 255, 0.04)' },
              ticks: { color: '#7E7E92', font: { family: 'Plus Jakarta Sans' } }
            },
            y: {
              grid: { color: 'rgba(255, 255, 255, 0.04)' },
              ticks: {
                color: '#7E7E92',
                font: { family: 'Plus Jakarta Sans' },
                callback: (v) => `R$ ${(v / 1000).toFixed(0)}k`
              }
            }
          }
        }
      });
    }

    // Gráfico de Distribuição de Procedimentos
    const ctxProcedures = document.getElementById('chart-procedures-donut');
    if (ctxProcedures && !ctxProcedures.chartInstance) {
      ctxProcedures.chartInstance = new Chart(ctxProcedures, {
        type: 'doughnut',
        data: {
          labels: ['Harmonização Orofacial', 'Lentes de Contato', 'Ortodontia Digital', 'Implantes Guiados', 'Clínica Geral'],
          datasets: [{
            data: [35, 28, 18, 12, 7],
            backgroundColor: ['#FF1744', '#E50932', '#8B001F', '#252530', '#7E7E92'],
            borderColor: '#15151D',
            borderWidth: 3,
            hoverOffset: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: '#B8B8C5',
                font: { family: 'Plus Jakarta Sans', size: 11 },
                padding: 14
              }
            }
          },
          cutout: '72%'
        }
      });
    }

    return true;
  };

  if (!renderCharts()) {
    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      if (renderCharts() || attempts > 20) {
        clearInterval(interval);
      }
    }, 150);
  }
}

/* ==========================================================================
   4. ODONTOGRAMA DIGITAL INTERATIVO 3D
   ========================================================================== */
function initInteractiveOdontogram() {
  const toothBoxes = document.querySelectorAll('.tooth-box');
  const conditionBtns = document.querySelectorAll('.condition-btn');
  const toothDetailNum = document.getElementById('selected-tooth-num');
  const toothDetailStatus = document.getElementById('selected-tooth-status');
  const logList = document.getElementById('odontogram-actions-log');

  let activeCondition = 'carie';

  conditionBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      conditionBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      activeCondition = btn.getAttribute('data-condition');
    });
  });

  toothBoxes.forEach((box) => {
    box.addEventListener('click', () => {
      toothBoxes.forEach((b) => b.classList.remove('selected'));
      box.classList.add('selected');

      const toothId = box.getAttribute('data-tooth');
      
      // Aplica a condição selecionada ao dente
      box.setAttribute('data-status', activeCondition);

      const condNames = {
        carie: 'Cárie / Restauração em Andamento',
        lente: 'Lente de Contato / Faceta Instalada',
        implante: 'Implante Dentário Osseointegrado',
        canal: 'Tratamento Endodôntico (Canal)',
        higido: 'Dente Hígido / Saudável'
      };

      if (toothDetailNum) toothDetailNum.textContent = `Dente #${toothId}`;
      if (toothDetailStatus) toothDetailStatus.textContent = condNames[activeCondition] || activeCondition;

      // Adiciona ao registro de logs clínicos
      if (logList) {
        const item = document.createElement('li');
        item.style.fontSize = '0.8rem';
        item.style.color = '#B8B8C5';
        item.style.marginBottom = '6px';
        item.innerHTML = `<span style="color:#FF1744; font-weight:700;">Dente #${toothId}:</span> Marcado como <em>${activeCondition.toUpperCase()}</em> por Dra. Dayana Queiroga.`;
        logList.prepend(item);
      }

      if (window.showToast) {
        window.showToast(`Dente #${toothId} atualizado para status: ${activeCondition.toUpperCase()}`, 'info');
      }
    });
  });
}

/* ==========================================================================
   5. BUSCA RÁPIDA DE PACIENTES (INTEGRAÇÃO COM BUSCA GLOBAL DA TOPBAR)
   ========================================================================== */
function initPatientSearch() {
  const searchInput = document.getElementById('search-patients-input');
  const globalSearchInput = document.getElementById('global-search-input');
  const patientRows = () => document.querySelectorAll('.patient-row');

  const filterRows = (term) => {
    patientRows().forEach((row) => {
      const name = row.querySelector('.patient-name')?.textContent.toLowerCase() || '';
      const doc = row.querySelector('.patient-doc')?.textContent.toLowerCase() || '';
      const phone = row.children[3]?.textContent.toLowerCase() || '';

      if (name.includes(term) || doc.includes(term) || phone.includes(term)) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  };

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      filterRows(e.target.value.toLowerCase().trim());
    });
  }

  if (globalSearchInput) {
    globalSearchInput.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase().trim();
      if (term.length > 0) {
        switchModule('pacientes');
        if (searchInput) searchInput.value = term;
      }
      filterRows(term);
    });
  }
}

/* ==========================================================================
   6. INTERAÇÕES DA AGENDA
   ========================================================================== */
function initAgendaInteractions() {
  const chips = document.querySelectorAll('.appointment-chip');
  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const patient = chip.getAttribute('data-patient') || 'Mariana Sousa';
      const time = chip.getAttribute('data-time') || '09:00';
      const procedure = chip.getAttribute('data-procedure') || 'Consulta';

      if (window.showToast) {
        window.showToast(`Prontuário de ${patient} aberto para consulta das ${time} (${procedure})`, 'info');
      }
    });
  });
}

/* ==========================================================================
   7. MODAL DE CADASTRO RÁPIDO DE PACIENTES (COM INSERÇÃO DINÂMICA)
   ========================================================================== */
function initQuickPatientModal() {
  const addPatientBtn = document.getElementById('btn-add-patient');
  const modal = document.getElementById('modal-add-patient');
  const closeBtn = document.getElementById('close-add-patient');
  const form = document.getElementById('form-add-patient');

  if (!modal) return;

  if (addPatientBtn) {
    addPatientBtn.addEventListener('click', () => {
      modal.classList.add('active');
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.querySelector('#new-patient-name')?.value || 'Novo Paciente';
      const cpf = form.querySelectorAll('input')[1]?.value || '000.***.***-00';
      const phone = form.querySelectorAll('input')[2]?.value || '(83) 99999-9999';
      const dentist = form.querySelector('select')?.value?.split('(')[0]?.trim() || 'Dra. Dayana';

      // Cria a linha na tabela de pacientes
      const tbody = document.querySelector('#module-pacientes tbody');
      if (tbody) {
        const tr = document.createElement('tr');
        tr.className = 'patient-row';
        const newId = `#INO-${Math.floor(1050 + Math.random() * 50)}`;
        tr.innerHTML = `
          <td style="font-family:var(--font-mono); color:var(--color-primary-intense); font-weight:700;">${newId}</td>
          <td class="patient-name"><strong>${name}</strong></td>
          <td class="patient-doc">${cpf}</td>
          <td>${phone}</td>
          <td>Hoje (Recém cadastrado)</td>
          <td>${dentist}</td>
          <td><span class="status-badge confirmed">Ativo</span></td>
          <td>
            <button class="btn btn-secondary" style="padding:4px 8px; font-size:0.75rem;" onclick="showToast('Prontuário de ${name} aberto', 'info')">
              Ver Ficha
            </button>
          </td>
        `;
        tbody.prepend(tr);
      }

      // Atualiza badge de pacientes na sidebar
      const badge = document.querySelector('.sidebar-item[data-module="pacientes"] .sidebar-badge');
      if (badge) {
        const count = parseInt(badge.textContent.replace('.', ''), 10) || 1842;
        badge.textContent = (count + 1).toLocaleString('pt-BR');
      }

      modal.classList.remove('active');
      form.reset();

      if (window.showToast) {
        window.showToast(`Paciente ${name} cadastrado com sucesso e adicionado à lista!`, 'success');
      }

      switchModule('pacientes');
    });
  }
}
