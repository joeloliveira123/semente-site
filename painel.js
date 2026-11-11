// ==========================================================================
// PAINEL DE GESTÃO PASTORAL · IGREJA EVANGÉLICA SEMENTE DA MULTIPLICAÇÃO
// ==========================================================================

(function initPainel() {
  'use strict';

  // Chaves de Armazenamento e Constantes
  const AUTH_KEY = 'semente_pastoral_auth';
  const LIVE_KEY = 'semente_manual_live';
  const EVENTS_KEY = 'semente_pastoral_events';
  const PRAYERS_KEY = 'semente_pastoral_prayers_cache';
  const DEFAULT_PIN = '1997'; // Ano de fundação da Igreja

  // Elementos da Interface
  const lockScreen = document.getElementById('painel-lock');
  const dashboard = document.getElementById('painel-dashboard');
  const btnLogout = document.getElementById('btn-logout');
  const pinForm = document.getElementById('pin-form');
  const pinInput = document.getElementById('pin-input');
  const pinError = document.getElementById('pin-error');
  const keypad = document.getElementById('pin-keypad');

  // Abas
  const navTabs = document.querySelectorAll('.nav-tab');
  const tabSections = document.querySelectorAll('.dashboard-tab');

  // Aba 1: Pedidos de Oração
  const prayersList = document.getElementById('prayers-list');
  const filterCongregation = document.getElementById('filter-congregation');
  const filterStatus = document.getElementById('filter-status');
  const searchPrayer = document.getElementById('search-prayer');
  const btnRefreshPrayers = document.getElementById('btn-refresh-prayers');
  const badgeOracaoCount = document.getElementById('badge-oracao-count');

  // Aba 2: Live e Banners
  const toggleManualLive = document.getElementById('toggle-manual-live');
  const liveIndicatorDot = document.getElementById('live-indicator-dot');
  const liveIndicatorTitle = document.getElementById('live-indicator-title');
  const liveIndicatorDesc = document.getElementById('live-indicator-desc');
  const liveYoutubeUrl = document.getElementById('live-youtube-url');
  const btnSaveLive = document.getElementById('btn-save-live');
  const liveSaveStatus = document.getElementById('live-save-status');

  // Aba 3: Eventos
  const btnOpenEventForm = document.getElementById('btn-open-event-form');
  const eventFormCard = document.getElementById('event-form-card');
  const eventForm = document.getElementById('event-form');
  const btnCancelEvent = document.getElementById('btn-cancel-event');
  const eventsList = document.getElementById('events-list');

  // Estados em memória
  let prayerRequestsData = [];
  let eventsData = [];

  // ========================================================================
  // 1. AUTENTICAÇÃO E BLOQUEIO POR PIN
  // ========================================================================
  function checkAuth() {
    const isAuth = sessionStorage.getItem(AUTH_KEY) === 'true';
    if (isAuth) {
      lockScreen.style.display = 'none';
      dashboard.style.display = 'block';
      btnLogout.style.display = 'inline-block';
      loadAllDashboardData();
    } else {
      lockScreen.style.display = 'flex';
      dashboard.style.display = 'none';
      btnLogout.style.display = 'none';
      if (pinInput) {
        pinInput.value = '';
        setTimeout(() => pinInput.focus(), 100);
      }
    }
  }

  function handleLogin(pin) {
    if (pin === DEFAULT_PIN) {
      sessionStorage.setItem(AUTH_KEY, 'true');
      pinError.style.display = 'none';
      checkAuth();
    } else {
      pinError.style.display = 'block';
      pinInput.value = '';
      pinInput.focus();
    }
  }

  if (pinForm) {
    pinForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleLogin(pinInput.value.trim());
    });
  }

  if (keypad) {
    keypad.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;

      if (btn.classList.contains('key-clear')) {
        pinInput.value = '';
        pinError.style.display = 'none';
      } else if (btn.classList.contains('key-enter')) {
        handleLogin(pinInput.value.trim());
      } else if (btn.dataset.key) {
        if (pinInput.value.length < 6) {
          pinInput.value += btn.dataset.key;
        }
      }
    });
  }

  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      if (confirm('Deseja bloquear e sair do Painel Pastoral?')) {
        sessionStorage.removeItem(AUTH_KEY);
        checkAuth();
      }
    });
  }

  // ========================================================================
  // 2. NAVEGAÇÃO ENTRE ABAS
  // ========================================================================
  navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.dataset.tab;
      navTabs.forEach(t => t.classList.remove('active'));
      tabSections.forEach(s => s.style.display = 'none');

      tab.classList.add('active');
      const targetSection = document.getElementById(targetId);
      if (targetSection) targetSection.style.display = 'block';
    });
  });

  // ========================================================================
  // 3. ABA 1: PEDIDOS DE ORAÇÃO
  // ========================================================================
  const MOCK_PRAYERS = [
    {
      id: 'demo-1',
      name: 'Maria Eduarda Santos',
      email: 'maria.santos@exemplo.com',
      congregation: 'Jardim Sapopemba',
      reason: 'Peço oração pela restauração da saúde da minha mãe e pela conversão de meu esposo para Cristo.',
      created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
      status: 'novo'
    },
    {
      id: 'demo-2',
      name: 'Carlos Alberto de Oliveira',
      email: '',
      congregation: 'Vila Antonieta',
      reason: 'Orar por uma porta de emprego aberta nesta semana e pela paz no meu lar.',
      created_at: new Date(Date.now() - 3600000 * 26).toISOString(),
      status: 'em_oracao'
    },
    {
      id: 'demo-3',
      name: 'Fernanda Lima',
      email: 'fernanda.lima@exemplo.com',
      congregation: 'Ainda não frequento',
      reason: 'Assisti à Live de Oração da manhã pela primeira vez. Preciso de força contra a ansiedade.',
      created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
      status: 'atendido'
    }
  ];

  function loadPrayerRequests() {
    prayersList.innerHTML = '<p class="loading-state">Buscando pedidos de oração...</p>';

    if (window.db) {
      try {
        window.db.collection('prayer_requests')
          .orderBy('created_at', 'desc')
          .onSnapshot(snapshot => {
            if (snapshot.empty) {
              // Se a coleção estiver vazia, carrega dados em cache ou dados modelo
              const cached = localStorage.getItem(PRAYERS_KEY);
              prayerRequestsData = cached ? JSON.parse(cached) : MOCK_PRAYERS;
            } else {
              prayerRequestsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                status: doc.data().status || 'novo'
              }));
              try {
                localStorage.setItem(PRAYERS_KEY, JSON.stringify(prayerRequestsData));
              } catch(e) {}
            }
            renderPrayerRequests();
          }, err => {
            console.warn('Erro ao ler Firestore (usando cache local):', err);
            const cached = localStorage.getItem(PRAYERS_KEY);
            prayerRequestsData = cached ? JSON.parse(cached) : MOCK_PRAYERS;
            renderPrayerRequests();
          });
        return;
      } catch (err) {
        console.warn('Falha na consulta Firestore:', err);
      }
    }

    // Fallback sem Firestore
    const cached = localStorage.getItem(PRAYERS_KEY);
    prayerRequestsData = cached ? JSON.parse(cached) : MOCK_PRAYERS;
    renderPrayerRequests();
  }

  function formatDateTime(isoString) {
    if (!isoString) return 'Data recente';
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return isoString;
    }
  }

  function renderPrayerRequests() {
    const congFilter = filterCongregation ? filterCongregation.value : 'all';
    const statFilter = filterStatus ? filterStatus.value : 'all';
    const term = searchPrayer ? searchPrayer.value.trim().toLowerCase() : '';

    const filtered = prayerRequestsData.filter(item => {
      const matchCong = (congFilter === 'all') || (item.congregation === congFilter);
      const matchStat = (statFilter === 'all') || (item.status === statFilter);
      const matchSearch = !term || (item.name && item.name.toLowerCase().includes(term)) || (item.reason && item.reason.toLowerCase().includes(term));
      return matchCong && matchStat && matchSearch;
    });

    if (badgeOracaoCount) {
      const pendingCount = prayerRequestsData.filter(p => p.status === 'novo').length;
      badgeOracaoCount.textContent = pendingCount || prayerRequestsData.length;
    }

    if (filtered.length === 0) {
      prayersList.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1; padding: 40px; text-align: center; background: var(--white); border-radius: 16px; border: 1px dashed var(--line);">
          <p style="font-size: 32px; margin: 0 0 10px;">🕊️</p>
          <strong style="font-size: 18px; color: var(--ink);">Nenhum pedido de oração encontrado</strong>
          <p style="color: var(--muted); font-size: 14px; margin: 6px 0 0;">Tente alterar os filtros ou a busca acima.</p>
        </div>
      `;
      return;
    }

    prayersList.innerHTML = filtered.map(item => {
      const statusLabel = item.status === 'atendido' ? 'Atendido / Orado ✅' : (item.status === 'em_oracao' ? 'Em Oração 🙏' : 'Novo / Pendente ⏳');
      const statusClass = `status-${item.status || 'novo'}`;
      const congregationTag = item.congregation || 'Não informada';
      const whatsMessage = encodeURIComponent(`A paz do Senhor, ${item.name}! Somos da liderança da Igreja Semente da Multiplicação. Lemos o seu pedido de oração e estamos intercedendo por você diante de Deus! Que Ele abençoe a sua vida e seu lar.`);
      const whatsUrl = `https://wa.me/?text=${whatsMessage}`;

      return `
        <article class="prayer-card" data-id="${item.id}">
          <div class="prayer-card-top">
            <div>
              <h3 class="prayer-name">${item.name || 'Anônimo'}</h3>
              <span class="prayer-meta">📍 ${congregationTag} · ${formatDateTime(item.created_at)}</span>
              ${item.email ? `<span class="prayer-meta" style="color: var(--petrol); font-weight: 600;">✉️ ${item.email}</span>` : ''}
            </div>
            <span class="prayer-status-pill ${statusClass}">${statusLabel}</span>
          </div>
          <p class="prayer-reason">“${item.reason || ''}”</p>
          <div class="prayer-card-actions">
            <button class="btn-small btn-status-toggle" type="button" data-action="toggle-status" data-id="${item.id}" data-current-status="${item.status || 'novo'}">
              🔄 Mudar Status
            </button>
            <a class="btn-small btn-whatsapp" href="${whatsUrl}" target="_blank" rel="noreferrer" title="Mandar mensagem de fé no WhatsApp">
              💬 Orar / Responder
            </a>
            <button class="btn-small btn-delete" type="button" data-action="delete-prayer" data-id="${item.id}" title="Excluir este pedido">
              🗑️ Excluir
            </button>
          </div>
        </article>
      `;
    }).join('');
  }

  // Ações nos Pedidos de Oração
  if (prayersList) {
    prayersList.addEventListener('click', async (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;
      const id = btn.dataset.id;
      const action = btn.dataset.action;

      if (action === 'toggle-status') {
        const current = btn.dataset.currentStatus;
        const nextStatus = current === 'novo' ? 'em_oracao' : (current === 'em_oracao' ? 'atendido' : 'novo');

        // Atualizar memória local
        const item = prayerRequestsData.find(p => p.id === id);
        if (item) item.status = nextStatus;
        try {
          localStorage.setItem(PRAYERS_KEY, JSON.stringify(prayerRequestsData));
        } catch(e) {}
        renderPrayerRequests();

        // Atualizar Firestore se disponível
        if (window.db && !id.startsWith('demo-')) {
          try {
            await window.db.collection('prayer_requests').doc(id).update({ status: nextStatus });
          } catch (err) {
            console.warn('Erro ao salvar status no Firestore:', err);
          }
        }
      } else if (action === 'delete-prayer') {
        if (!confirm('Deseja realmente remover este pedido de oração?')) return;

        prayerRequestsData = prayerRequestsData.filter(p => p.id !== id);
        try {
          localStorage.setItem(PRAYERS_KEY, JSON.stringify(prayerRequestsData));
        } catch(e) {}
        renderPrayerRequests();

        if (window.db && !id.startsWith('demo-')) {
          try {
            await window.db.collection('prayer_requests').doc(id).delete();
          } catch (err) {
            console.warn('Erro ao deletar pedido no Firestore:', err);
          }
        }
      }
    });
  }

  if (filterCongregation) filterCongregation.addEventListener('change', renderPrayerRequests);
  if (filterStatus) filterStatus.addEventListener('change', renderPrayerRequests);
  if (searchPrayer) searchPrayer.addEventListener('input', renderPrayerRequests);
  if (btnRefreshPrayers) btnRefreshPrayers.addEventListener('click', loadPrayerRequests);

  // ========================================================================
  // 4. ABA 2: CONTROLE DE LIVE & BANNERS
  // ========================================================================
  function updateLiveUI(isLive) {
    if (isLive) {
      liveIndicatorDot.classList.add('live-active');
      liveIndicatorTitle.textContent = 'Transmissão MANUAL Forçada (AO VIVO)';
      liveIndicatorDesc.textContent = 'O banner selecionado abaixo está EXIBIDO AGORA no topo do site para todos os visitantes.';
    } else {
      liveIndicatorDot.classList.remove('live-active');
      liveIndicatorTitle.textContent = 'Modo Automático Ativo';
      liveIndicatorDesc.textContent = 'O banner sobe sozinho de Seg a Sex às 6h30 e nos domingos de manhã e noite.';
    }
  }

  function loadLiveConfig() {
    let config = {
      isLive: false,
      banner: 'oracao',
      youtubeUrl: 'https://www.youtube.com/@missaosemente2012/live'
    };

    try {
      const stored = localStorage.getItem(LIVE_KEY);
      if (stored) {
        config = { ...config, ...JSON.parse(stored) };
      }
    } catch(e) {}

    // Firestore overrides se disponível
    if (window.db) {
      window.db.collection('config').doc('live').get().then(doc => {
        if (doc.exists) {
          applyLiveConfigToUI(doc.data());
        } else {
          applyLiveConfigToUI(config);
        }
      }).catch(() => applyLiveConfigToUI(config));
    } else {
      applyLiveConfigToUI(config);
    }
  }

  function applyLiveConfigToUI(config) {
    if (!config) return;
    if (toggleManualLive) toggleManualLive.checked = !!config.isLive;
    updateLiveUI(!!config.isLive);

    const bannerChoice = config.banner || 'oracao';
    const radio = document.querySelector(`input[name="banner-choice"][value="${bannerChoice}"]`);
    if (radio) radio.checked = true;

    if (liveYoutubeUrl && config.youtubeUrl) {
      liveYoutubeUrl.value = config.youtubeUrl;
    }
  }

  if (toggleManualLive) {
    toggleManualLive.addEventListener('change', () => {
      updateLiveUI(toggleManualLive.checked);
    });
  }

  if (btnSaveLive) {
    btnSaveLive.addEventListener('click', async () => {
      const selectedRadio = document.querySelector('input[name="banner-choice"]:checked');
      const liveData = {
        isLive: toggleManualLive.checked,
        banner: selectedRadio ? selectedRadio.value : 'oracao',
        youtubeUrl: (liveYoutubeUrl && liveYoutubeUrl.value.trim()) || 'https://www.youtube.com/@missaosemente2012/live',
        updatedAt: new Date().toISOString()
      };

      try {
        localStorage.setItem(LIVE_KEY, JSON.stringify(liveData));
      } catch(e) {}

      liveSaveStatus.textContent = 'Salvando...';

      if (window.db) {
        try {
          await window.db.collection('config').doc('live').set(liveData, { merge: true });
        } catch (err) {
          console.warn('Erro ao salvar no Firestore config/live:', err);
        }
      }

      liveSaveStatus.textContent = 'Salvo com sucesso! ✨';
      setTimeout(() => {
        liveSaveStatus.textContent = '';
      }, 4000);
    });
  }

  // ========================================================================
  // 5. ABA 3: EVENTOS & AVISOS
  // ========================================================================
  const MOCK_EVENTS = [
    {
      id: 'mock-evt-1',
      title: 'Culto de Santa Ceia do Senhor',
      congregation: 'Ambas as congregações',
      date: '1º Domingo de cada mês (9h30 Sapopemba · 18h30 Antonieta)',
      location: 'Jardim Sapopemba e Vila Antonieta',
      description: 'Momento de comunhão, renovação de aliança e celebração com o pão e o cálice.',
      published: true
    },
    {
      id: 'mock-evt-2',
      title: 'Vigília da Madrugada · Clamor pelo Brasil',
      congregation: 'Vila Antonieta',
      date: 'Última Sexta-feira do Mês às 23h30',
      location: 'Rua Júlio Parigot, 228 · Vila Antonieta',
      description: 'Uma noite de busca profunda, louvor e intercessão pela igreja e pelas famílias.',
      published: true
    }
  ];

  function loadEvents() {
    eventsList.innerHTML = '<p class="loading-state">Buscando eventos...</p>';

    if (window.db) {
      try {
        window.db.collection('events').get().then(snapshot => {
          if (snapshot.empty) {
            const cached = localStorage.getItem(EVENTS_KEY);
            eventsData = cached ? JSON.parse(cached) : MOCK_EVENTS;
          } else {
            eventsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            try {
              localStorage.setItem(EVENTS_KEY, JSON.stringify(eventsData));
            } catch(e) {}
          }
          renderEvents();
        }).catch(err => {
          console.warn('Erro ao carregar eventos:', err);
          const cached = localStorage.getItem(EVENTS_KEY);
          eventsData = cached ? JSON.parse(cached) : MOCK_EVENTS;
          renderEvents();
        });
        return;
      } catch(e) {}
    }

    const cached = localStorage.getItem(EVENTS_KEY);
    eventsData = cached ? JSON.parse(cached) : MOCK_EVENTS;
    renderEvents();
  }

  function renderEvents() {
    if (!eventsList) return;

    if (eventsData.length === 0) {
      eventsList.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1; padding: 40px; text-align: center; background: var(--white); border-radius: 16px; border: 1px dashed var(--line);">
          <p style="font-size: 32px; margin: 0 0 10px;">📅</p>
          <strong style="font-size: 18px; color: var(--ink);">Nenhum evento cadastrado no momento</strong>
          <p style="color: var(--muted); font-size: 14px; margin: 6px 0 0;">Clique em "+ Cadastrar Novo Evento" para adicionar um aviso ou programação especial.</p>
        </div>
      `;
      return;
    }

    eventsList.innerHTML = eventsData.map(evt => {
      const isPub = evt.published !== false;
      const pubBadge = isPub ? '<span class="prayer-status-pill status-atendido">Publicado na Agenda</span>' : '<span class="prayer-status-pill status-novo">Rascunho / Oculto</span>';

      return `
        <article class="prayer-card" data-id="${evt.id}">
          <div class="prayer-card-top">
            <div>
              <h3 class="prayer-name">${evt.title}</h3>
              <span class="prayer-meta">📍 ${evt.congregation} · 🕒 ${evt.date}</span>
              ${evt.location ? `<span class="prayer-meta">Endereço: ${evt.location}</span>` : ''}
            </div>
            ${pubBadge}
          </div>
          ${evt.description ? `<p class="prayer-reason">${evt.description}</p>` : ''}
          <div class="prayer-card-actions">
            <button class="btn-small btn-status-toggle" type="button" data-action="toggle-event-published" data-id="${evt.id}">
              ${isPub ? '👁️ Ocultar evento' : '✅ Publicar evento'}
            </button>
            <button class="btn-small btn-delete" type="button" data-action="delete-event" data-id="${evt.id}">
              🗑️ Excluir
            </button>
          </div>
        </article>
      `;
    }).join('');
  }

  if (btnOpenEventForm) {
    btnOpenEventForm.addEventListener('click', () => {
      eventFormCard.style.display = 'block';
      eventForm.reset();
      document.getElementById('event-title').focus();
    });
  }

  if (btnCancelEvent) {
    btnCancelEvent.addEventListener('click', () => {
      eventFormCard.style.display = 'none';
    });
  }

  if (eventForm) {
    eventForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const newEvent = {
        title: document.getElementById('event-title').value.trim(),
        congregation: document.getElementById('event-congregation').value,
        date: document.getElementById('event-date').value.trim(),
        location: document.getElementById('event-location').value.trim(),
        description: document.getElementById('event-description').value.trim(),
        published: document.getElementById('event-published').checked,
        created_at: new Date().toISOString()
      };

      if (!newEvent.title || !newEvent.date) {
        alert('Por favor, preencha o título e a data do evento.');
        return;
      }

      if (window.db) {
        try {
          const docRef = await window.db.collection('events').add(newEvent);
          newEvent.id = docRef.id;
        } catch (err) {
          console.warn('Erro ao adicionar evento no Firestore:', err);
          newEvent.id = 'evt-' + Date.now();
        }
      } else {
        newEvent.id = 'evt-' + Date.now();
      }

      eventsData.unshift(newEvent);
      try {
        localStorage.setItem(EVENTS_KEY, JSON.stringify(eventsData));
      } catch(e) {}

      eventFormCard.style.display = 'none';
      eventForm.reset();
      renderEvents();
    });
  }

  if (eventsList) {
    eventsList.addEventListener('click', async (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;
      const id = btn.dataset.id;
      const action = btn.dataset.action;

      if (action === 'toggle-event-published') {
        const item = eventsData.find(evt => evt.id === id);
        if (item) {
          item.published = !item.published;
          try {
            localStorage.setItem(EVENTS_KEY, JSON.stringify(eventsData));
          } catch(e) {}
          renderEvents();

          if (window.db && !id.startsWith('mock-') && !id.startsWith('evt-')) {
            try {
              await window.db.collection('events').doc(id).update({ published: item.published });
            } catch(e) {}
          }
        }
      } else if (action === 'delete-event') {
        if (!confirm('Deseja excluir este evento?')) return;
        eventsData = eventsData.filter(evt => evt.id !== id);
        try {
          localStorage.setItem(EVENTS_KEY, JSON.stringify(eventsData));
        } catch(e) {}
        renderEvents();

        if (window.db && !id.startsWith('mock-') && !id.startsWith('evt-')) {
          try {
            await window.db.collection('events').doc(id).delete();
          } catch(e) {}
        }
      }
    });
  }

  // ========================================================================
  // CARREGAMENTO INICIAL DO DASHBOARD
  // ========================================================================
  function loadAllDashboardData() {
    loadPrayerRequests();
    loadLiveConfig();
    loadEvents();
  }

  // Inicializa verificação de autenticação ao carregar
  checkAuth();
})();
