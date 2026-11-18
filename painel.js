// ==========================================================================
// PAINEL DE GESTÃO PASTORAL · IGREJA EVANGÉLICA SEMENTE DA MULTIPLICAÇÃO
// Integração Real com Firebase Firestore & Gestão Completa (Missões & Cantata)
// ==========================================================================

(function initPainel() {
  'use strict';

  // Chaves de Armazenamento Local
  const AUTH_KEY = 'semente_pastoral_auth';
  const LIVE_KEY = 'semente_manual_live';
  const EVENTS_KEY = 'semente_pastoral_events';
  const PRAYERS_KEY = 'semente_pastoral_prayers_cache';
  const PLAYLISTS_KEY = 'semente_pastoral_playlists';
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

  // Aba: Pedidos de Oração
  const prayersList = document.getElementById('prayers-list');
  const filterCongregation = document.getElementById('filter-congregation');
  const filterStatus = document.getElementById('filter-status');
  const searchPrayer = document.getElementById('search-prayer');
  const btnRefreshPrayers = document.getElementById('btn-refresh-prayers');
  const badgeOracaoCount = document.getElementById('badge-oracao-count');

  // Aba: Live, Banners e Playlists
  const toggleManualLive = document.getElementById('toggle-manual-live');
  const liveIndicatorDot = document.getElementById('live-indicator-dot');
  const liveIndicatorTitle = document.getElementById('live-indicator-title');
  const liveIndicatorDesc = document.getElementById('live-indicator-desc');
  const liveYoutubeUrl = document.getElementById('live-youtube-url');
  const btnSaveLive = document.getElementById('btn-save-live');
  const liveSaveStatus = document.getElementById('live-save-status');

  const playlistMonth = document.getElementById('playlist-month');
  const playlistAntonieta = document.getElementById('playlist-antonieta');
  const playlistSapopemba = document.getElementById('playlist-sapopemba');
  const btnSavePlaylists = document.getElementById('btn-save-playlists');
  const playlistSaveStatus = document.getElementById('playlist-save-status');

  // Aba: Eventos (Cantata de Natal, Culto de Missões e novos eventos)
  const btnOpenEventForm = document.getElementById('btn-open-event-form');
  const btnRestoreDefaultEvents = document.getElementById('btn-restore-default-events');
  const eventFormCard = document.getElementById('event-form-card');
  const eventFormTitle = document.getElementById('event-form-title');
  const eventForm = document.getElementById('event-form');
  const btnCancelEvent = document.getElementById('btn-cancel-event');
  const eventsList = document.getElementById('events-list');

  let prayerRequestsData = [];
  let eventsData = [];
  let firebaseStatus = 'checking';

  // Eventos oficiais completos com animações vinculadas
  const REAL_INITIAL_EVENTS = [
    {
      id: 'culto-de-missoes-2026',
      title: 'Culto de Missões',
      congregation: 'Vila Antonieta',
      date_day: 'Domingo, 29 de novembro',
      date_time: '18h30',
      date: 'Domingo, 29 de novembro · 18h30',
      starts_at: '2026-11-29T18:30:00-03:00',
      location: 'Rua Júlio Parigot, 228 — Vila Antonieta',
      description: 'Brasil e Angola unidos pelo Evangelho. Duas nações, uma só família. «Ide, portanto, e fazei discípulos de todas as nações.» Venha semear conosco!',
      animation: 'culto-missoes',
      link_url: 'https://www.google.com/maps/search/?api=1&query=Rua+J%C3%BAlio+Parigot%2C+228%2C+Vila+Antonieta%2C+S%C3%A3o+Paulo+-+SP',
      published: true,
      is_published: true
    },
    {
      id: 'cantata-de-natal-2026',
      title: 'Cantata de Natal',
      congregation: 'Vila Antonieta',
      date_day: '20 de Dezembro',
      date_time: '18h30',
      date: '20 de Dezembro · 18h30',
      starts_at: '2026-12-20T18:30:00-03:00',
      location: 'Rua Júlio Parigot, 228 — Vila Antonieta',
      description: 'Uma noite de louvor, música e esperança. Venha celebrar o Natal conosco! Traga sua família e amigos!',
      animation: 'cantata-natal',
      link_url: 'https://www.google.com/maps/search/?api=1&query=Rua+J%C3%BAlio+Parigot%2C+228%2C+Vila+Antonieta%2C+S%C3%A3o+Paulo+-+SP',
      published: true,
      is_published: true
    }
  ];

  function normalizeEvent(evt) {
    const base = REAL_INITIAL_EVENTS.find(item => item.id === evt.id || (evt.title && item.title.toLowerCase() === evt.title.toLowerCase()));
    const merged = base ? { ...base, ...evt } : { ...evt };

    if (!merged.animation) {
      if (merged.id === 'culto-de-missoes-2026' || /miss[oõ]es/i.test(merged.title || '')) {
        merged.animation = 'culto-missoes';
      } else if (merged.id === 'cantata-de-natal-2026' || /cantata/i.test(merged.title || '')) {
        merged.animation = 'cantata-natal';
      } else {
        merged.animation = 'none';
      }
    }

    if (!merged.date_day || !merged.date_time) {
      const parts = String(merged.date || '').split('·').map(s => s.trim());
      if (!merged.date_day) merged.date_day = parts[0] || (base ? base.date_day : 'Em breve');
      if (!merged.date_time) merged.date_time = parts[1] || (base ? base.date_time : '18h30');
    }
    merged.date = `${merged.date_day} · ${merged.date_time}`;

    if (!merged.starts_at) {
      merged.starts_at = base ? base.starts_at : new Date().toISOString();
    }

    const isPub = merged.published !== false && merged.is_published !== false;
    merged.published = isPub;
    merged.is_published = isPub;

    if (!merged.link_url) {
      const isSapopemba = (merged.congregation || '').includes('Sapopemba') || (merged.location || '').includes('Henrique');
      merged.link_url = isSapopemba
        ? 'https://www.google.com/maps/search/?api=1&query=Rua+Henrique+Mazzauti%2C+566%2C+Jardim+Sapopemba%2C+S%C3%A3o+Paulo+-+SP'
        : 'https://www.google.com/maps/search/?api=1&query=Rua+J%C3%BAlio+Parigot%2C+228%2C+Vila+Antonieta%2C+S%C3%A3o+Paulo+-+SP';
    }

    return merged;
  }

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
      if (firebaseBadgeText) firebaseBadgeText.textContent = 'Sincronizado Local + Regras 🟡';
      if (firebaseRulesAlert) firebaseRulesAlert.style.display = 'flex';
    } else {
      firebaseBadge.classList.add('status-offline');
      if (firebaseBadgeText) firebaseBadgeText.textContent = 'Modo Local 🔵';
      if (firebaseRulesAlert) firebaseRulesAlert.style.display = 'none';
    }
  }

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
  // 4. ABA: EVENTOS ESPECIAIS (CULTO DE MISSÕES & CANTATA DE NATAL)
  // ========================================================================
  function loadLocalEventsCache() {
    try {
      const cached = localStorage.getItem(EVENTS_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Remove mocks antigos ou o item "santa-ceia-mensal" que já está na agenda semanal fixa
          const cleaned = parsed
            .filter(e => !String(e.id).startsWith('mock-') && e.id !== 'santa-ceia-mensal')
            .map(normalizeEvent);

          // Garante que Culto de Missões e Cantata de Natal estejam sempre presentes
          for (const official of REAL_INITIAL_EVENTS) {
            if (!cleaned.some(e => e.id === official.id)) {
              cleaned.push({ ...official });
            }
          }
          return cleaned.sort((a, b) => new Date(a.starts_at || 0) - new Date(b.starts_at || 0));
        }
      }
    } catch (e) {}
    return REAL_INITIAL_EVENTS.map(e => ({ ...e }));
  }

  function saveLocalEventsCache(list) {
    try {
      const normalized = list.map(normalizeEvent);
      localStorage.setItem(EVENTS_KEY, JSON.stringify(normalized));
      window.dispatchEvent(new CustomEvent('semente:events_update', { detail: normalized }));
    } catch (e) {}
  }

  async function syncEventsToFirestore(list) {
    if (!window.db) return false;
    try {
      for (const evt of list) {
        const normalized = normalizeEvent(evt);
        await window.db.collection('events').doc(normalized.id).set(normalized, { merge: true });
      }
      setFirebaseStatus('connected');
      return true;
    } catch (err) {
      if (err && (err.code === 'permission-denied' || String(err).includes('permission'))) {
        setFirebaseStatus('rules_denied');
      }
      return false;
    }
  }

  function loadEvents() {
    if (!eventsList) return;
    eventsList.innerHTML = '<p class="loading-state">Carregando Culto de Missões, Cantata de Natal e demais eventos...</p>';

    const localList = loadLocalEventsCache();
    eventsData = localList;
    saveLocalEventsCache(eventsData);
    renderEvents();

    if (window.db) {
      // Consulta com is_published == true primeiro (compatível com todas as regras do Firestore)
      window.db.collection('events').where('is_published', '==', true).get()
        .then(async snapshot => {
          if (!snapshot.empty) {
            const remoteDocs = snapshot.docs.map(doc => normalizeEvent({ id: doc.id, ...doc.data() }));
            const byId = new Map(eventsData.map(e => [e.id, e]));
            for (const r of remoteDocs) {
              byId.set(r.id, r);
            }
            eventsData = Array.from(byId.values()).sort((a, b) => new Date(a.starts_at || 0) - new Date(b.starts_at || 0));
            saveLocalEventsCache(eventsData);
            renderEvents();
          } else {
            // Se o banco está vazio, tenta semear automaticamente o Culto de Missões e a Cantata de Natal
            await syncEventsToFirestore(eventsData);
          }
        })
        .catch(() => {});
    }
  }

  function renderEvents() {
    if (!eventsList) return;

    if (eventsData.length === 0) {
      eventsList.innerHTML = `
        <div class="empty-state">
          <p style="font-size: 32px; margin: 0 0 10px;">📅</p>
          <strong style="font-size: 18px; color: var(--ink);">Nenhum evento cadastrado no momento</strong>
          <p style="color: var(--muted); font-size: 14px; margin: 6px 0 0;">Clique em "🔄 Restaurar Oficiais" ou "+ Novo Evento" para adicionar.</p>
        </div>
      `;
      return;
    }

    eventsList.innerHTML = eventsData.map(evt => {
      const isPub = evt.published !== false && evt.is_published !== false;
      const pubBadge = isPub
        ? '<span class="prayer-status-pill status-atendido">Publicado na Agenda ✅</span>'
        : '<span class="prayer-status-pill status-novo">Oculto na Agenda 👁️‍🗨️</span>';

      let animBadge = '<span class="event-anim-pill">🕊️ Card Padrão</span>';
      let telaoLink = '';
      if (evt.animation === 'culto-missoes' || evt.id === 'culto-de-missoes-2026') {
        animBadge = '<span class="event-anim-pill">🌍 Animação Ativa: Culto de Missões (Brasil + Angola)</span>';
        telaoLink = `<a class="btn-small btn-whatsapp" style="background:#0b8a3e;" href="/missoes" target="_blank" rel="noreferrer">🖥️ Telão Missões 16:9 ↗</a>`;
      } else if (evt.animation === 'cantata-natal' || evt.id === 'cantata-de-natal-2026') {
        animBadge = '<span class="event-anim-pill">🎄 Animação Ativa: Cantata de Natal</span>';
        telaoLink = `<a class="btn-small btn-whatsapp" style="background:#a30f26;" href="/cantata" target="_blank" rel="noreferrer">🖥️ Telão Cantata 16:9 ↗</a>`;
      } else if (evt.image_path) {
        animBadge = `<span class="event-anim-pill">🖼️ Arte: ${evt.image_path}</span>`;
      }

      return `
        <article class="prayer-card" data-id="${evt.id}">
          <div class="prayer-card-top">
            <div>
              <h3 class="prayer-name">${evt.title}</h3>
              <span class="prayer-meta">📍 ${evt.congregation || 'Vila Antonieta'} · 🕒 ${evt.date}</span>
              ${evt.location ? `<span class="prayer-meta">Endereço: ${evt.location}</span>` : ''}
              ${animBadge}
            </div>
            ${pubBadge}
          </div>
          ${evt.description ? `<p class="prayer-reason">${evt.description}</p>` : ''}
          <div class="prayer-card-actions">
            <button class="btn-small btn-edit-event" type="button" data-action="edit-event" data-id="${evt.id}">
              ✏️ Editar Evento
            </button>
            <button class="btn-small btn-status-toggle" type="button" data-action="toggle-event-published" data-id="${evt.id}">
              ${isPub ? '👁️ Ocultar da Agenda' : '✅ Publicar na Agenda'}
            </button>
            ${telaoLink}
            <button class="btn-small btn-delete" type="button" data-action="delete-event" data-id="${evt.id}">
              🗑️ Excluir
            </button>
          </div>
        </article>
      `;
    }).join('');
  }

  function openEventEditor(evt = null) {
    if (!eventFormCard || !eventForm) return;
    eventFormCard.style.display = 'block';
    eventForm.reset();

    const idField = document.getElementById('event-edit-id');
    const titleField = document.getElementById('event-title');
    const congField = document.getElementById('event-congregation');
    const dayField = document.getElementById('event-date-day');
    const timeField = document.getElementById('event-date-time');
    const locField = document.getElementById('event-location');
    const animField = document.getElementById('event-animation');
    const startsAtField = document.getElementById('event-starts-at');
    const imgField = document.getElementById('event-image-path');
    const descField = document.getElementById('event-description');
    const pubField = document.getElementById('event-published');

    if (evt) {
      const norm = normalizeEvent(evt);
      if (eventFormTitle) eventFormTitle.textContent = `Editar Evento: ${norm.title}`;
      if (idField) idField.value = norm.id;
      if (titleField) titleField.value = norm.title || '';
      if (congField) congField.value = norm.congregation || 'Vila Antonieta';
      if (dayField) dayField.value = norm.date_day || '';
      if (timeField) timeField.value = norm.date_time || '18h30';
      if (locField) locField.value = norm.location || 'Rua Júlio Parigot, 228 — Vila Antonieta';
      if (animField) animField.value = norm.animation || 'none';
      if (startsAtField && norm.starts_at) {
        startsAtField.value = String(norm.starts_at).slice(0, 16);
      }
      if (imgField) imgField.value = norm.image_path || '';
      if (descField) descField.value = norm.description || '';
      if (pubField) pubField.checked = norm.published !== false && norm.is_published !== false;
    } else {
      if (eventFormTitle) eventFormTitle.textContent = 'Cadastrar Novo Evento Especial';
      if (idField) idField.value = '';
      if (congField) congField.value = 'Vila Antonieta';
      if (timeField) timeField.value = '18h30';
      if (locField) locField.value = 'Rua Júlio Parigot, 228 — Vila Antonieta';
      if (animField) animField.value = 'none';
      if (startsAtField) startsAtField.value = '2026-12-01T18:30';
      if (pubField) pubField.checked = true;
    }

    eventFormCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    if (titleField) setTimeout(() => titleField.focus(), 150);
  }

  // Botões de Atalho Rápido (Culto de Missões e Cantata de Natal)
  document.querySelectorAll('[data-quick-edit]').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-quick-edit');
      let targetEvt = eventsData.find(e => e.id === targetId);
      if (!targetEvt) {
        targetEvt = REAL_INITIAL_EVENTS.find(e => e.id === targetId);
        if (targetEvt) {
          eventsData.push({ ...targetEvt });
          saveLocalEventsCache(eventsData);
          renderEvents();
        }
      }
      openEventEditor(targetEvt);
    });
  });

  if (btnOpenEventForm) {
    btnOpenEventForm.addEventListener('click', () => openEventEditor(null));
  }

  if (btnRestoreDefaultEvents) {
    btnRestoreDefaultEvents.addEventListener('click', async () => {
      if (!confirm('Deseja restaurar o Culto de Missões (29/11 às 18h30) e a Cantata de Natal (20/12 às 18h30) para os dados e animações oficiais?')) return;
      const customEvents = eventsData.filter(e => e.id !== 'culto-de-missoes-2026' && e.id !== 'cantata-de-natal-2026');
      eventsData = [...REAL_INITIAL_EVENTS.map(e => ({ ...e })), ...customEvents];
      saveLocalEventsCache(eventsData);
      renderEvents();
      await syncEventsToFirestore(eventsData);
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
      const editId = document.getElementById('event-edit-id').value.trim();
      const titleVal = document.getElementById('event-title').value.trim();
      const congVal = document.getElementById('event-congregation').value;
      const dayVal = document.getElementById('event-date-day').value.trim();
      const timeVal = document.getElementById('event-date-time').value.trim() || '18h30';
      const locVal = document.getElementById('event-location').value.trim();
      const animVal = document.getElementById('event-animation').value;
      const startsAtRaw = document.getElementById('event-starts-at').value;
      const imgVal = document.getElementById('event-image-path').value.trim();
      const descVal = document.getElementById('event-description').value.trim();
      const pubVal = document.getElementById('event-published').checked;

      if (!titleVal || !dayVal) {
        alert('Por favor, preencha o título e o dia do evento.');
        return;
      }

      const startsAtIso = startsAtRaw ? `${startsAtRaw}:00-03:00` : new Date().toISOString();
      const id = editId || ('evt-' + Date.now());

      const updatedEvent = normalizeEvent({
        id,
        title: titleVal,
        congregation: congVal,
        date_day: dayVal,
        date_time: timeVal,
        date: `${dayVal} · ${timeVal}`,
        starts_at: startsAtIso,
        location: locVal,
        animation: animVal,
        image_path: imgVal || undefined,
        description: descVal,
        published: pubVal,
        is_published: pubVal,
        updated_at: new Date().toISOString()
      });

      const existingIdx = eventsData.findIndex(item => item.id === id);
      if (existingIdx >= 0) {
        eventsData[existingIdx] = updatedEvent;
      } else {
        eventsData.push(updatedEvent);
      }

      eventsData.sort((a, b) => new Date(a.starts_at || 0) - new Date(b.starts_at || 0));
      saveLocalEventsCache(eventsData);
      renderEvents();
      eventFormCard.style.display = 'none';

      if (window.db) {
        try {
          await window.db.collection('events').doc(id).set(updatedEvent, { merge: true });
          setFirebaseStatus('connected');
        } catch (err) {
          console.warn('Evento salvo localmente (aguardando publicação de regras no Firestore):', err);
          if (err && (err.code === 'permission-denied' || String(err).includes('permission'))) {
            setFirebaseStatus('rules_denied');
          }
        }
      }
    });
  }

  if (eventsList) {
    eventsList.addEventListener('click', async (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;
      const id = btn.dataset.id;
      const action = btn.dataset.action;

      if (action === 'edit-event') {
        const item = eventsData.find(evt => evt.id === id);
        if (item) openEventEditor(item);
      } else if (action === 'toggle-event-published') {
        const item = eventsData.find(evt => evt.id === id);
        if (item) {
          const nextPub = !(item.published !== false && item.is_published !== false);
          item.published = nextPub;
          item.is_published = nextPub;
          saveLocalEventsCache(eventsData);
          renderEvents();

          if (window.db) {
            try {
              await window.db.collection('events').doc(id).set(normalizeEvent(item), { merge: true });
              setFirebaseStatus('connected');
            } catch (err) {
              if (err && (err.code === 'permission-denied' || String(err).includes('permission'))) {
                setFirebaseStatus('rules_denied');
              }
            }
          }
        }
      } else if (action === 'delete-event') {
        if (!confirm('Deseja excluir este evento?')) return;
        eventsData = eventsData.filter(evt => evt.id !== id);
        saveLocalEventsCache(eventsData);
        renderEvents();

        if (window.db) {
          try {
            await window.db.collection('events').doc(id).delete();
          } catch (e) {}
        }
      }
    });
  }

  // ========================================================================
  // 5. ABA: PEDIDOS DE ORAÇÃO (DADOS REAIS)
  // ========================================================================
  function loadLocalPrayersCache() {
    try {
      const cached = localStorage.getItem(PRAYERS_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) {
          return parsed.filter(item => !String(item.id).startsWith('demo-'));
        }
      }
    } catch (e) {}
    return [];
  }

  function saveLocalPrayersCache(list) {
    try {
      localStorage.setItem(PRAYERS_KEY, JSON.stringify(list));
    } catch (e) {}
  }

  function loadPrayerRequests() {
    if (!prayersList) return;
    prayersList.innerHTML = '<p class="loading-state">Buscando pedidos de oração...</p>';

    if (window.db) {
      try {
        window.db.collection('prayer_requests')
          .orderBy('created_at', 'desc')
          .onSnapshot(snapshot => {
            setFirebaseStatus('connected');
            if (snapshot.empty) {
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
            if (err && (err.code === 'permission-denied' || String(err).includes('permission'))) {
              setFirebaseStatus('rules_denied');
            } else {
              setFirebaseStatus('offline');
            }
            prayerRequestsData = loadLocalPrayersCache();
            renderPrayerRequests();
          });
        return;
      } catch (err) {}
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
    if (!prayersList) return;
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
            Os pedidos enviados pelos visitantes e fiéis na página <strong>/contato</strong> do site aparecerão aqui em tempo real. Você também pode registrar pedidos recebidos presencialmente.
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
          } catch (err) {}
        }
      } else if (action === 'delete-prayer') {
        if (!confirm('Deseja realmente remover este pedido de oração?')) return;

        prayerRequestsData = prayerRequestsData.filter(p => p.id !== id);
        saveLocalPrayersCache(prayerRequestsData);
        renderPrayerRequests();

        if (window.db && !id.startsWith('local-')) {
          try {
            await window.db.collection('prayer_requests').doc(id).delete();
          } catch (err) {}
        }
      }
    });
  }

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
        } catch (err) {
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
  // 6. ABA: CONTROLE DE LIVE, BANNERS & PLAYLISTS
  // ========================================================================
  function updateLiveUI(isLive) {
    if (!liveIndicatorDot) return;
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
      if (stored) config = { ...config, ...JSON.parse(stored) };
    } catch (e) {}

    applyLiveConfigToUI(config);

    if (window.db) {
      window.db.collection('config').doc('live').get().then(doc => {
        if (doc.exists) {
          setFirebaseStatus('connected');
          applyLiveConfigToUI(doc.data());
        }
      }).catch(() => {});
    }

    // Carrega Playlists
    try {
      const storedPlaylists = localStorage.getItem(PLAYLISTS_KEY);
      if (storedPlaylists) {
        const pl = JSON.parse(storedPlaylists);
        if (playlistMonth && pl.month) playlistMonth.value = pl.month;
        if (playlistAntonieta && pl.antonietaUrl) playlistAntonieta.value = pl.antonietaUrl;
        if (playlistSapopemba && pl.sapopembaUrl) playlistSapopemba.value = pl.sapopembaUrl;
      }
    } catch (e) {}

    if (window.db) {
      window.db.collection('config').doc('playlists').get().then(doc => {
        if (doc.exists) {
          const pl = doc.data();
          if (playlistMonth && pl.month) playlistMonth.value = pl.month;
          if (playlistAntonieta && pl.antonietaUrl) playlistAntonieta.value = pl.antonietaUrl;
          if (playlistSapopemba && pl.sapopembaUrl) playlistSapopemba.value = pl.sapopembaUrl;
        }
      }).catch(() => {});
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
      } catch (e) {}

      liveSaveStatus.textContent = 'Salvando...';

      if (window.db) {
        try {
          await window.db.collection('config').doc('live').set(liveData, { merge: true });
          setFirebaseStatus('connected');
          liveSaveStatus.textContent = 'Salvo no Firebase com sucesso! ✨';
        } catch (err) {
          if (err && (err.code === 'permission-denied' || String(err).includes('permission'))) {
            setFirebaseStatus('rules_denied');
          }
          liveSaveStatus.textContent = 'Configuração aplicada neste dispositivo! ✨';
        }
      } else {
        liveSaveStatus.textContent = 'Salvo com sucesso! ✨';
      }

      setTimeout(() => {
        liveSaveStatus.textContent = '';
      }, 4000);
    });
  }

  if (btnSavePlaylists) {
    btnSavePlaylists.addEventListener('click', async () => {
      const plData = {
        month: (playlistMonth && playlistMonth.value.trim()) || 'Novembro',
        antonietaUrl: (playlistAntonieta && playlistAntonieta.value.trim()) || 'https://music.youtube.com/playlist?list=PLVySTvS_ScAM&si=gRjyeu-SeU9EsXgU',
        sapopembaUrl: (playlistSapopemba && playlistSapopemba.value.trim()) || 'https://music.youtube.com/search?q=Igreja+Evang%C3%A9lica+Semente+da+Multiplica%C3%A7%C3%A3o+Louvor',
        updatedAt: new Date().toISOString()
      };

      try {
        localStorage.setItem(PLAYLISTS_KEY, JSON.stringify(plData));
        window.dispatchEvent(new CustomEvent('semente:playlists_update', { detail: plData }));
      } catch (e) {}

      if (playlistSaveStatus) playlistSaveStatus.textContent = 'Salvando playlists...';

      if (window.db) {
        try {
          await window.db.collection('config').doc('playlists').set(plData, { merge: true });
          setFirebaseStatus('connected');
          if (playlistSaveStatus) playlistSaveStatus.textContent = 'Playlists atualizadas no Firebase e no site! ✨';
        } catch (err) {
          if (playlistSaveStatus) playlistSaveStatus.textContent = 'Playlists atualizadas no site! ✨';
        }
      } else {
        if (playlistSaveStatus) playlistSaveStatus.textContent = 'Playlists salvas com sucesso! ✨';
      }

      setTimeout(() => {
        if (playlistSaveStatus) playlistSaveStatus.textContent = '';
      }, 4000);
    });
  }

  // ========================================================================
  // 7. CARREGAMENTO INICIAL DO DASHBOARD & ESCUTA ENTRE ABAS
  // ========================================================================
  function loadAllDashboardData() {
    loadEvents();
    loadPrayerRequests();
    loadLiveConfig();
  }

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

  checkAuth();
})();
