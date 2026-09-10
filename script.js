document.addEventListener('DOMContentLoaded', function () {
  const toggle = document.getElementById('mobile-toggle');
  const nav = document.getElementById('nav');

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', function (event) {
      const href = this.getAttribute('href');
      if (!href || href === '#') {
        return;
      }

      const target = document.querySelector(href);
      if (target) {
        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      if (window.innerWidth <= 900 && nav) {
        nav.style.display = 'none';
      }
    });
  });

  const queueList = document.getElementById('queue-list');
  const queueCount = document.getElementById('queue-count');
  const pendingStat = document.getElementById('stat-pending');
  const urgentStat = document.getElementById('stat-urgent');
  const timeStat = document.getElementById('stat-time');
  const demoModal = document.getElementById('demo-modal');
  const closeDemoBtn = document.getElementById('close-demo');
  const demoForm = document.getElementById('demo-form');
  const demoTrigger = document.getElementById('open-demo');

  const queueData = [
    { name: 'Maria L.', setor: 'Recepção', status: 'Em espera', priority: 'média' },
    { name: 'João P.', setor: 'Enfermagem', status: 'Em atendimento', priority: 'alta' },
    { name: 'Célia M.', setor: 'Coordenação', status: 'Em espera', priority: 'baixa' },
    { name: 'Rafael S.', setor: 'Suporte', status: 'Em espera', priority: 'média' }
  ];

  function renderQueue() {
    if (!queueList) return;

    queueList.innerHTML = queueData.map((item, index) => {
      const priorityClass = item.priority === 'alta' ? 'priority-high' : item.priority === 'média' ? 'priority-medium' : 'priority-low';
      return `
        <li class="queue-item ${priorityClass}" data-index="${index}">
          <div class="queue-main">
            <span class="queue-name">${item.name}</span>
            <span class="queue-setor">${item.setor}</span>
          </div>
          <div class="queue-side">
            <span class="queue-status">${item.status}</span>
            <button type="button" class="queue-action" data-index="${index}">Atender</button>
          </div>
        </li>
      `;
    }).join('');

    if (queueCount) queueCount.textContent = String(queueData.length);
    if (pendingStat) pendingStat.textContent = String(queueData.filter((item) => item.status !== 'Concluído').length);
    if (urgentStat) urgentStat.textContent = String(queueData.filter((item) => item.priority === 'alta').length);
    if (timeStat) timeStat.textContent = `${Math.max(5, queueData.length * 2)} min`;
  }

  function openModal() {
    if (demoModal) {
      demoModal.classList.remove('hidden');
      demoModal.setAttribute('aria-hidden', 'false');
    }
  }

  function closeModal() {
    if (demoModal) {
      demoModal.classList.add('hidden');
      demoModal.setAttribute('aria-hidden', 'true');
    }
  }

  if (demoTrigger) {
    demoTrigger.addEventListener('click', function (event) {
      event.preventDefault();
      openModal();
    });
  }

  if (closeDemoBtn) {
    closeDemoBtn.addEventListener('click', closeModal);
  }

  if (demoModal) {
    demoModal.addEventListener('click', function (event) {
      if (event.target === demoModal) closeModal();
    });
  }

  if (demoForm) {
    demoForm.addEventListener('submit', function (event) {
      event.preventDefault();

      const formData = new FormData(demoForm);
      const unidade = formData.get('unidade') || 'Unidade demonstrativa';
      const responsavel = formData.get('responsavel') || 'Recepcionista';
      const setor = formData.get('setor') || 'Recepção';
      const prioridade = String(formData.get('prioridade') || 'Média').toLowerCase();
      const data = formData.get('data') || new Date().toISOString().slice(0, 10);

      queueData.unshift({
        name: responsavel,
        setor,
        status: 'Agendado',
        priority: prioridade
      });

      renderQueue();
      closeModal();

      const toast = document.createElement('div');
      toast.className = 'toast';
      toast.textContent = `Demonstração agendada para ${unidade} em ${data}.`;
      document.body.appendChild(toast);

      setTimeout(() => {
        toast.remove();
      }, 2600);
    });
  }

  queueList?.addEventListener('click', function (event) {
    const button = event.target.closest('.queue-action');
    if (!button) return;

    const index = Number(button.dataset.index);
    if (!Number.isInteger(index) || !queueData[index]) return;

    queueData[index].status = 'Em atendimento';
    queueData[index].priority = 'alta';
    renderQueue();
  });

  document.querySelectorAll('.action-btn').forEach((button) => {
    button.addEventListener('click', function () {
      const action = this.dataset.action;
      const firstItem = queueData[0];
      if (!firstItem) return;

      if (action === 'urgencia') firstItem.priority = 'alta';
      if (action === 'transferir') firstItem.setor = 'Coordenação';
      if (action === 'chamada') firstItem.status = 'Em atendimento';

      renderQueue();
    });
  });

  renderQueue();
});
