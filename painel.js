// ==========================================================================
// PAINEL DE GESTÃO PASTORAL · IGREJA EVANGÉLICA SEMENTE DA MULTIPLICAÇÃO
// Integração Real com Firebase Firestore & Sincronização em Tempo Real
// ==========================================================================

(function initPainel() {
  'use strict';

  // Chaves de Armazenamento Local
  const AUTH_KEY = 'semente_pastoral_auth';
  const LIVE_KEY = 'semente_manual_live';
  const EVENTS_KEY = 'semente_pastoral_events';
  const PRAYERS_KEY = 'semente_pastoral_prayers_cache';
  const DEFAULT_PIN = '1997'; // Ano de fundação da Igreja

  // Elementos da Interface Geral
  const lockScreen = document.getElementById('painel-lock');
  const dashboard = document.getElementById('painel-dashboard');
  const btnLogout = document.getElementById('btn-logout');
  const pinForm = document.getElementById('pin-form');
  const pinInput = document.getElementById('pin-input');
  const pinError = document.getElementById('pin-error');
  const keypad = document.getElementById('pin-keypad');

  // Badge e Alerta do Firebase
  const firebaseBadge = document.getElementById('firebase-status-badge');
  const firebaseBadgeText = document.getElementById('firebase-badge-text');
  const firebaseRulesAlert = document.getElementById('firebase-rules-alert');
  const btnShowRules = document.getElementById('btn-show-rules');
  const rulesModal = document.getElementById('rules-modal');
  const btnCloseRules = document.getElementById('btn-close-rules');
  const btnCopyRules = document.getElementById('btn-copy-rules');
  const rulesCode = document.getElementById('rules-code');

  // Modal de Pedido Manual
  const prayerModal = document.getElementById('prayer-modal');
  const btnOpenPrayerModal = document.getElementById('btn-open-prayer-modal');
  const btnClosePrayerModal = document.getElementById('btn-close-prayer-modal');
  const btnCancelPrayerModal = document.getElementById('btn-cancel-prayer-modal');
  const manualPrayerForm = document.getElementById('manual-prayer-form');

  // Abas do Painel
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

  // Estados em memória (SEM DADOS FICTÍCIOS / MOCKS)
  let prayerRequestsData = [];
  let eventsData = [];
  let firebaseStatus = 'checking'; // 'connected' | 'rules_denied' | 'offline'

  // Eventos reais oficiais da Igreja Semente da Multiplicação
  const REAL_INITIAL_EVENTS = [
    {
      id: 'culto-de-missoes-2026',
      title: 'Culto de Missões',
      congregation: 'Vila Antonieta',
      date: '29 de Novembro · 18h30',
      location: 'Rua Júlio Parigot, 228 — Vila Antonieta',
      description: 'Brasil e Angola unidos pelo Evangelho. Duas nações, uma só família. «Ide, portanto, e fazei discípulos de todas as nações.»',
      published: true
    },
    {
      id: 'cantata-de-natal-2026',
      title: 'Cantata de Natal',
      congregation: 'Vila Antonieta',
      date: '20 de Dezembro · 18h30',
      location: 'Rua Júlio Parigot, 228 — Vila Antonieta',
      description: 'Uma noite de louvor, música e esperança. Venha celebrar o Natal conosco! Traga sua família e amigos.',
      published: true
    },
    {
      id: 'santa-ceia-mensal',
      title: 'Culto de Santa Ceia do Senhor',
      congregation: 'Ambas as congregações',
      date: '1º Domingo de cada mês · 9h30 (Sapopemba) e 18h30 (Antonieta)',
      location: 'Jardim Sapopemba (manhã) e Vila Antonieta (noite)',
      description: 'Celebração da comunhão e renovação de aliança com Deus e com a igreja através do pão e do cálice.',
      published: true
    }
  ];

  // ========================================================================
  // 1. GERENCIADOR DO STATUS DO FIREBASE
  // ========================================================================
  function setFirebaseStatus(status) {
    firebaseStatus = status;
    if (!firebaseBadge) return;

    firebaseBadge.className = 'firebase-badge';
    if (status === 'connected') {
      firebaseBadge.classList.add('status-connected');
      if (firebaseBadgeText) firebaseBadgeText.textContent = 'Firebase Online 🟢';
      if (firebaseRulesAlert) firebaseRulesAlert.style.display = 'none';
    } else if (status === 'rules_denied') {
      firebaseBadge.classList.add('status-rules-pending');
      if (firebaseBadgeText) firebaseBadgeText.textContent = 'Regras 403 🟡';
      if (firebaseRulesAlert) firebaseRulesAlert.style.display = 'flex';
    } else {
      firebaseBadge.classList.add('status-offline');
      if (firebaseBadgeText) firebaseBadgeText.textContent = 'Modo Local 🔵';
      if (firebaseRulesAlert) firebaseRulesAlert.style.display = 'none';
    }
  }

  // Modais de Regras e Pedido Manual
  if (btnShowRules && rulesModal) {
    btnShowRules.addEventListener('click', () => {
      rulesModal.style.display = 'flex';
    });
  }
  if (btnCloseRules && rulesModal) {
    btnCloseRules.addEventListener('click', () => {
      rulesModal.style.display = 'none';
    });
  }
  if (rulesModal) {
    rulesModal.addEventListener('click', (e) => {
      if (e.target === rulesModal) rulesModal.style.display = 'none';
    });
  }
  if (btnCopyRules && rulesCode) {
    btnCopyRules.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(rulesCode.innerText.trim());
        btnCopyRules.textContent = 'Regras Copiadas! ✓';
        btnCopyRules.style.background = '#2e7d32';
        setTimeout(() => {
          btnCopyRules.textContent = 'Copiar Regras 📋';
          btnCopyRules.style.background = '';
        }, 3000);
      } catch (err) {
        alert('Copie o código manualmente na caixa de texto.');
      }
    });
  }

  // ========================================================================
  // 2. AUTENTICAÇÃO E BLOQUEIO POR PIN
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
  // 3. NAVEGAÇÃO ENTRE ABAS
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
  // 4. ABA 1: PEDIDOS DE ORAÇÃO (DADOS REAIS)
  // ========================================================================
  function loadLocalPrayersCache() {
    try {
      const cached = localStorage.getItem(PRAYERS_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) {
          // Filtra itens fictícios que possam ter ficado em cache antigo
          return parsed.filter(item => !String(item.id).startsWith('demo-'));
        }
      }
    } catch(e) {}
    return [];
  }

  function saveLocalPrayersCache(list) {
    try {
      localStorage.setItem(PRAYERS_KEY, JSON.stringify(list));
    } catch(e) {}
  }

  function loadPrayerRequests() {
    prayersList.innerHTML = '<p class="loading-state">Buscando pedidos de oração...</p>';

    // Se Firebase estiver disponível
    if (window.db) {
      try {
        window.db.collection('prayer_requests')
          .orderBy('created_at', 'desc')
          .onSnapshot(snapshot => {
            setFirebaseStatus('connected');
            if (snapshot.empty) {
              // Coleção está vazia no Firebase: carregar cache local real
              prayerRequestsData = loadLocalPrayersCache();
            } else {
              prayerRequestsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                status: doc.data().status || 'novo'
              }));
              saveLocalPrayersCache(prayerRequestsData);
            }
            renderPrayerRequests();
          }, err => {
            console.warn('Erro ao ler Firestore:', err);
            if (err && (err.code === 'permission-denied' || String(err).includes('permission'))) {
              setFirebaseStatus('rules_denied');
            } else {
              setFirebaseStatus('offline');
            }
            prayerRequestsData = loadLocalPrayersCache();
            renderPrayerRequests();
          });
        return;
      } catch (err) {
        console.warn('Falha ao inicializar listener do Firestore:', err);
      }
    }

    setFirebaseStatus('offline');
    prayerRequestsData = loadLocalPrayersCache();
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
        <div class="empty-state" style="grid-column: 1 / -1; padding: 48px 24px; text-align: center; background: var(--white); border-radius: 18px; border: 1px dashed var(--line);">
          <p style="font-size: 40px; margin: 0 0 12px;">🕊️</p>
          <strong style="font-size: 19px; color: var(--ink); display: block;">Nenhum pedido de oração cadastrado ainda</strong>
          <p style="color: var(--muted); font-size: 14px; margin: 8px auto 20px; max-width: 460px; line-height: 1.5;">
            Os pedidos enviados pelos visitantes e fiéis na página <strong>/contato</strong> do site aparecerão aqui em tempo real. Você também pode registrar pedidos recebidos presencialmente ou por mensagem.
          </p>
          <button id="btn-empty-add-prayer" class="button button-primary" type="button">+ Registrar Pedido de Oração</button>
        </div>
      `;
      const emptyBtn = document.getElementById('btn-empty-add-prayer');
      if (emptyBtn && prayerModal) {
        emptyBtn.addEventListener('click', () => {
          prayerModal.style.display = 'flex';
        });
      }
      return;
    }

    prayersList.innerHTML = filtered.map(item => {
      const statusLabel = item.status === 'atendido' ? 'Atendido / Orado ✅' : (item.status === 'em_oracao' ? 'Em Oração 🙏' : 'Novo / Pendente ⏳');
      const statusClass = `status-${item.status || 'novo'}`;
      const congregationTag = item.congregation || 'Não informada';
      const whatsMessage = encodeURIComponent(`A paz do Senhor, ${item.name}! Somos da liderança da Igreja Evangélica Semente da Multiplicação. Lemos o seu pedido de oração e estamos intercedendo por você diante de Deus! Que Ele abençoe a sua vida e seu lar.`);
      const whatsUrl = `https://wa.me/?text=${whatsMessage}`;

      return `
        <article class="prayer-card" data-id="${item.id}">
          <div class="prayer-card-top">
            <div>
              <h3 class="prayer-name">${item.name || 'Irmão(ã) anônimo(a)'}</h3>
              <span class="prayer-meta">📍 ${congregationTag} · ${formatDateTime(item.created_at)}</span>
              ${item.email ? `<span class="prayer-meta" style="color: var(--petrol); font-weight: 600;">✉️ ${item.email}</span>` : ''}
              ${item.contact ? `<span class="prayer-meta" style="color: var(--petrol); font-weight: 600;">📞 ${item.contact}</span>` : ''}
            </div>
            <span class="prayer-status-pill ${statusClass}">${statusLabel}</span>
          </div>
          <p class="prayer-reason">“${item.reason || ''}”</p>
          <div class="prayer-card-actions">
            <button class="btn-small btn-status-toggle" type="button" data-action="toggle-status" data-id="${item.id}" data-current-status="${item.status || 'novo'}">
              🔄 Mudar Status
            </button>
            <a class="btn-small btn-whatsapp" href="${whatsUrl}" target="_blank" rel="noreferrer" title="Mandar mensagem de fé">
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

  // Ações nos Pedidos de Oração (Alterar status ou Excluir)
  if (prayersList) {
    prayersList.addEventListener('click', async (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;
      const id = btn.dataset.id;
      const action = btn.dataset.action;

      if (action === 'toggle-status') {
        const current = btn.dataset.currentStatus;
        const nextStatus = current === 'novo' ? 'em_oracao' : (current === 'em_oracao' ? 'atendido' : 'novo');

        const item = prayerRequestsData.find(p => p.id === id);
        if (item) item.status = nextStatus;
        saveLocalPrayersCache(prayerRequestsData);
        renderPrayerRequests();

        if (window.db && !id.startsWith('local-')) {
          try {
            await window.db.collection('prayer_requests').doc(id).update({ status: nextStatus });
          } catch (err) {
            console.warn('Erro ao atualizar status no Firestore:', err);
          }
        }
      } else if (action === 'delete-prayer') {
        if (!confirm('Deseja realmente remover este pedido de oração?')) return;

        prayerRequestsData = prayerRequestsData.filter(p => p.id !== id);
        saveLocalPrayersCache(prayerRequestsData);
        renderPrayerRequests();

        if (window.db && !id.startsWith('local-')) {
          try {
            await window.db.collection('prayer_requests').doc(id).delete();
          } catch (err) {
            console.warn('Erro ao deletar pedido no Firestore:', err);
          }
        }
      }
    });
  }

  // Cadastro de Pedido Manual via Modal
  if (btnOpenPrayerModal && prayerModal) {
    btnOpenPrayerModal.addEventListener('click', () => {
      prayerModal.style.display = 'flex';
      if (manualPrayerForm) manualPrayerForm.reset();
      const nameInput = document.getElementById('manual-prayer-name');
      if (nameInput) setTimeout(() => nameInput.focus(), 100);
    });
  }
  if (btnClosePrayerModal && prayerModal) {
    btnClosePrayerModal.addEventListener('click', () => {
      prayerModal.style.display = 'none';
    });
  }
  if (btnCancelPrayerModal && prayerModal) {
    btnCancelPrayerModal.addEventListener('click', () => {
      prayerModal.style.display = 'none';
    });
  }
  if (prayerModal) {
    prayerModal.addEventListener('click', (e) => {
      if (e.target === prayerModal) prayerModal.style.display = 'none';
    });
  }

  if (manualPrayerForm) {
    manualPrayerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const nameVal = document.getElementById('manual-prayer-name').value.trim();
      const congVal = document.getElementById('manual-prayer-congregation').value;
      const contactVal = document.getElementById('manual-prayer-contact').value.trim();
      const reasonVal = document.getElementById('manual-prayer-reason').value.trim();

      if (!nameVal || !reasonVal) {
        alert('Por favor, preencha o nome e o motivo da oração.');
        return;
      }

      const newPrayer = {
        name: nameVal,
        congregation: congVal,
        contact: contactVal || null,
        reason: reasonVal,
        status: 'novo',
        created_at: new Date().toISOString()
      };

      if (window.db) {
        try {
          const docRef = await window.db.collection('prayer_requests').add(newPrayer);
          newPrayer.id = docRef.id;
          setFirebaseStatus('connected');
        } catch (err) {
          console.warn('Erro ao gravar pedido no Firestore:', err);
          if (err && (err.code === 'permission-denied' || String(err).includes('permission'))) {
            setFirebaseStatus('rules_denied');
          }
          newPrayer.id = 'local-' + Date.now();
        }
      } else {
        newPrayer.id = 'local-' + Date.now();
      }

      prayerRequestsData.unshift(newPrayer);
      saveLocalPrayersCache(prayerRequestsData);
      renderPrayerRequests();

      manualPrayerForm.reset();
      prayerModal.style.display = 'none';
    });
  }

  if (filterCongregation) filterCongregation.addEventListener('change', renderPrayerRequests);
  if (filterStatus) filterStatus.addEventListener('change', renderPrayerRequests);
  if (searchPrayer) searchPrayer.addEventListener('input', renderPrayerRequests);
  if (btnRefreshPrayers) btnRefreshPrayers.addEventListener('click', loadPrayerRequests);

  // ========================================================================
  // 5. ABA 2: CONTROLE DE LIVE & BANNERS (TEMPO REAL)
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

    if (window.db) {
      window.db.collection('config').doc('live').get().then(doc => {
        if (doc.exists) {
          setFirebaseStatus('connected');
          applyLiveConfigToUI(doc.data());
        } else {
          applyLiveConfigToUI(config);
        }
      }).catch(err => {
        if (err && (err.code === 'permission-denied' || String(err).includes('permission'))) {
          setFirebaseStatus('rules_denied');
        }
        applyLiveConfigToUI(config);
      });
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
        window.dispatchEvent(new CustomEvent('semente:live_update', { detail: liveData }));
      } catch(e) {}

      liveSaveStatus.textContent = 'Salvando no Firebase...';

      if (window.db) {
        try {
          await window.db.collection('config').doc('live').set(liveData, { merge: true });
          setFirebaseStatus('connected');
          liveSaveStatus.textContent = 'Salvo no Firebase com sucesso! ✨';
        } catch (err) {
          console.warn('Erro ao salvar no Firestore config/live:', err);
          if (err && (err.code === 'permission-denied' || String(err).includes('permission'))) {
            setFirebaseStatus('rules_denied');
            liveSaveStatus.textContent = 'Salvo localmente (Publique as regras no Firebase)';
          } else {
            liveSaveStatus.textContent = 'Salvo localmente no navegador.';
          }
        }
      } else {
        liveSaveStatus.textContent = 'Salvo localmente com sucesso! ✨';
      }

      setTimeout(() => {
        liveSaveStatus.textContent = '';
      }, 4000);
    });
  }

  // ========================================================================
  // 6. ABA 3: EVENTOS & AVISOS (DADOS REAIS DA IGREJA)
  // ========================================================================
  function loadLocalEventsCache() {
    try {
      const cached = localStorage.getItem(EVENTS_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.filter(e => !String(e.id).startsWith('mock-'));
        }
      }
    } catch(e) {}
    return REAL_INITIAL_EVENTS;
  }

  function saveLocalEventsCache(list) {
    try {
      localStorage.setItem(EVENTS_KEY, JSON.stringify(list));
      window.dispatchEvent(new CustomEvent('semente:events_update', { detail: list }));
    } catch(e) {}
  }

  function loadEvents() {
    eventsList.innerHTML = '<p class="loading-state">Buscando eventos...</p>';

    if (window.db) {
      try {
        window.db.collection('events').get().then(snapshot => {
          setFirebaseStatus('connected');
          if (snapshot.empty) {
            eventsData = loadLocalEventsCache();
          } else {
            eventsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            saveLocalEventsCache(eventsData);
          }
          renderEvents();
        }).catch(err => {
          console.warn('Erro ao carregar eventos:', err);
          if (err && (err.code === 'permission-denied' || String(err).includes('permission'))) {
            setFirebaseStatus('rules_denied');
          }
          eventsData = loadLocalEventsCache();
          renderEvents();
        });
        return;
      } catch(e) {}
    }

    eventsData = loadLocalEventsCache();
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
          setFirebaseStatus('connected');
        } catch (err) {
          console.warn('Erro ao adicionar evento no Firestore:', err);
          if (err && (err.code === 'permission-denied' || String(err).includes('permission'))) {
            setFirebaseStatus('rules_denied');
          }
          newEvent.id = 'evt-' + Date.now();
        }
      } else {
        newEvent.id = 'evt-' + Date.now();
      }

      eventsData.unshift(newEvent);
      saveLocalEventsCache(eventsData);

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
          saveLocalEventsCache(eventsData);
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
        saveLocalEventsCache(eventsData);
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
  // 7. CARREGAMENTO INICIAL DO DASHBOARD & ESCUTA ENTRE ABAS
  // ========================================================================
  function loadAllDashboardData() {
    loadPrayerRequests();
    loadLiveConfig();
    loadEvents();
  }

  // Ouve novos pedidos enviados a partir do próprio site em outra aba
  window.addEventListener('storage', (e) => {
    if (e.key === PRAYERS_KEY) {
      prayerRequestsData = loadLocalPrayersCache();
      renderPrayerRequests();
    } else if (e.key === EVENTS_KEY) {
      eventsData = loadLocalEventsCache();
      renderEvents();
    } else if (e.key === LIVE_KEY) {
      loadLiveConfig();
    }
  });

  window.addEventListener('semente:prayer_submitted', () => {
    loadPrayerRequests();
  });

  // Inicializa verificação de autenticação ao carregar
  checkAuth();
})();
