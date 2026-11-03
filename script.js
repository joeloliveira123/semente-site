document.documentElement.classList.add('js-enabled');

const goals = [
  ['01', 'Expandir os projetos sociais', 'Chegar a novas cidades e comunidades, ampliando a assistência a pessoas em situação de rua e famílias carentes.'],
  ['02', 'Fortalecer o discipulado', 'Criar novas turmas e materiais de apoio para adultos e crianças.'],
  ['03', 'Enviar missionários', 'Preparar e enviar missionários ao campo nacional e internacional com apoio estruturado.'],
  ['04', 'Criar centros de apoio', 'Implantar centros de apoio emocional e espiritual com acompanhamento pastoral e psicológico.'],
  ['05', 'Capacitar para a autonomia', 'Desenvolver programas de capacitação profissional e empreendedora.'],
  ['06', 'Acolher crianças em Angola', 'Consolidar o projeto de acolhimento, oferecendo abrigo e formação cristã.'],
  ['07', 'Usar as plataformas digitais', 'Usar as mídias para evangelismo, ensino e divulgação das ações missionárias.']
];

const projects = [
  {
    "number": "01",
    "title": "Crianças Felizes · Missão Possível",
    "text": "Frente missionária que nasceu do trabalho com crianças da comunidade do Jardim Santo Eduardo, iniciado em 1997.",
    "verse": "Marcos 10:14",
    "details": "A história da igreja registra que um pequeno grupo de irmãos começou a visitar a comunidade, levando carinho, cuidado e uma refeição. O trabalho cresceu e os irmãos passaram a se reunir para orar e interceder pelo projeto. Essa iniciativa é uma das sementes da história da Semente da Multiplicação.",
    "links": [
      [
        "Vídeo histórico · Crianças Felizes / Missão Possível",
        "https://www.youtube.com/watch?v=QvAYSkkvpJY&t=1s"
      ]
    ]
  },
  {
    "number": "02",
    "title": "Crianças para Cristo",
    "text": "Evangelização e formação cristã de crianças em praças, comunidades e espaços abertos.",
    "verse": "Marcos 10:14",
    "details": "O nome Crianças para Cristo aparece associado ao trabalho missionário com crianças. O acervo histórico inclui um segundo vídeo relacionado a Crianças Felizes, Missão Possível e Crianças para Cristo.",
    "links": [
      [
        "Vídeo histórico · Crianças para Cristo",
        "https://www.youtube.com/watch?v=jkYA85-sJMA&t=2s"
      ]
    ]
  },
  {
    "number": "03",
    "title": "Projeto Criança Cidadã",
    "text": "Projeto identificado no acervo audiovisual histórico da igreja.",
    "verse": "Provérbios 22:6",
    "details": "O título foi recuperado a partir do registro em vídeo enviado para integrar o arquivo de memórias. A Base Missionária Alfa e Ômega está interligada a este projeto.",
    "links": [
      [
        "Registro em vídeo · Projeto Criança Cidadã",
        "https://www.youtube.com/watch?v=Mg8M1hKAqlw"
      ]
    ]
  },
  {
    "number": "04",
    "title": "Irmãos de Rua e entrega de marmitas",
    "text": "Frente de cuidado e evangelização junto a pessoas em situação de rua. A ação regular acontece às sextas-feiras, às 20h.",
    "verse": "Mateus 25:35",
    "details": "O Projeto Irmãos de Rua e a entrega de marmitas fazem parte da mesma frente de cuidado e evangelização. A ação semanal de sexta-feira está ligada também às ações especiais de Natal registradas em 2009 e em 25 de dezembro de 2016.",
    "links": [
      [
        "Natal com Moradores de Rua · 25/12/2016",
        "https://www.youtube.com/watch?v=9JRvsgYqDE0"
      ],
      [
        "Natal com Moradores de Rua · 2009",
        "https://www.youtube.com/watch?v=ulDTcu8FpCU&t=6s"
      ]
    ]
  },
  {
    "number": "05",
    "title": "Base Missionária Alfa e Ômega",
    "text": "Frente missionária com registros históricos próprios preservados no acervo da igreja.",
    "verse": "Marcos 16:15",
    "details": "A Base Missionária Alfa e Ômega está interligada ao Projeto Criança Cidadã. Os registros incluem a comemoração de 10 anos, a apresentação Inabaláveis no Jardim Secreto em 2019 e o DVD da Base Missionária.",
    "links": [
      [
        "10 anos de Alfa e Ômega",
        "https://www.youtube.com/watch?v=rAiNlOAnVn8&t=3s"
      ],
      [
        "Apresentação Inabaláveis · Jardim Secreto 2019",
        "https://www.youtube.com/watch?v=HYKc7m12BeY"
      ],
      [
        "DVD Base Missionária Alfa e Ômega",
        "https://www.youtube.com/watch?v=-55FJr0DJKI&t=2s"
      ],
      [
        "Projeto Criança Cidadã · missão interligada",
        "https://www.youtube.com/watch?v=Mg8M1hKAqlw"
      ]
    ]
  },
  {
    "number": "06",
    "title": "Desafios Missionários",
    "text": "Frente mencionada na apresentação histórica da igreja.",
    "verse": "Mateus 28:19",
    "details": "O nome Desafios Missionários aparece entre os conteúdos do site antigo. Como a descrição integral da página original não pôde ser confirmada, mantemos a referência sem atribuir atividades específicas não verificadas.",
    "links": []
  },
  {
    "number": "10",
    "title": "Agência Missionária",
    "text": "Formação, envio e apoio a missionários no Brasil e no exterior.",
    "verse": "Marcos 16:15",
    "details": "Esta frente já fazia parte da lista de projetos do site novo. Mantemos a descrição institucional sem acrescentar locais ou números de atuação não confirmados.",
    "links": []
  },
  {
    "number": "11",
    "title": "Projeto de Discipulado",
    "text": "Ensino contínuo e crescimento espiritual para adultos e crianças.",
    "verse": "Mateus 28:19",
    "details": "Projeto apresentado no site novo. A descrição permanece limitada ao conteúdo institucional disponível.",
    "links": []
  },
  {
    "number": "12",
    "title": "Empresários e Novos Empresários",
    "text": "Fortalecimento econômico e espiritual para empreendedores cristãos.",
    "verse": "Provérbios 16:3",
    "details": "Projeto listado no site novo. Não foram acrescentadas informações operacionais que não constem do material recuperado.",
    "links": []
  },
  {
    "number": "14",
    "title": "Evangelismo de Rua",
    "text": "Evangelização em espaços públicos com acompanhamento e discipulado.",
    "verse": "Romanos 10:14–15",
    "details": "Esta frente está presente na lista de projetos do site novo e se relaciona ao eixo de evangelização e presença comunitária. Os registros de Natal com moradores de rua também estão organizados na página Memórias e Registros.",
    "links": [
      [
        "Ver Memórias e Registros",
        "/memorias"
      ]
    ]
  }
];

const goalsContainer = document.querySelector('[data-goals]');
if (goalsContainer) goalsContainer.innerHTML = goals.map(([number, title, text]) => `<article class="goal-card reveal"><span class="card-number">Meta ${number}</span><h3>${title}</h3><p>${text}</p></article>`).join('');
function getYouTubeVideoId(url) {
  const match = String(url).match(/[?&]v=([^&]+)/);
  return match ? match[1] : null;
}
const projectsContainer = document.querySelector('[data-projects]');
if (projectsContainer) projectsContainer.innerHTML = projects.map(project => {
  const video = project.links.find(([, url]) => getYouTubeVideoId(url));
  const videoId = video ? getYouTubeVideoId(video[1]) : null;
  const cover = videoId
    ? `<a class="video-cover-link project-video-cover" href="${video[1]}" target="_blank" rel="noreferrer" aria-label="Assistir: ${project.title}"><img class="video-cover" src="https://img.youtube.com/vi/${videoId}/hqdefault.jpg" alt="Capa do vídeo: ${project.title}" loading="lazy"><span class="video-play" aria-hidden="true">▶</span></a>`
    : '<div class="video-cover-placeholder"><span>PROJETO<br>MISSIONÁRIO</span></div>';
  return `<article class="project-card mission-card reveal">${cover}<div class="mission-card-body"><span class="card-number">Projeto ${project.number}</span><h3>${project.title}</h3><p>${project.text}</p><details class="mission-details"><summary>Conheça esta missão <span aria-hidden="true">+</span></summary><p>${project.details}</p></details>${project.links.length ? `<div class="mission-links">${project.links.map(([label, url]) => `<a class="content-link" href="${url}" target="_blank" rel="noreferrer">${label} →</a>`).join('')}</div>` : ''}<span class="quote">${project.verse}</span></div></article>`;
}).join('');
const yearContainer = document.querySelector('[data-year]');
if (yearContainer) yearContainer.textContent = new Date().getFullYear();

const header = document.querySelector('[data-header]');
if (header) window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 12), {passive:true});
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
if (menuButton && nav) {
  menuButton.addEventListener('click', () => { const open = nav.classList.toggle('open'); menuButton.setAttribute('aria-expanded', String(open)); });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => { nav.classList.remove('open'); menuButton.setAttribute('aria-expanded', 'false'); }));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('open')) {
      nav.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.focus();
    }
  });
}

const revealElements = document.querySelectorAll('.reveal');
const observer = 'IntersectionObserver' in window
  ? new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    }), {threshold:.12})
  : null;
if (observer) {
  revealElements.forEach(element => observer.observe(element));
} else {
  revealElements.forEach(element => element.classList.add('is-visible'));
}

const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
if (!prefersReducedMotion) {
  const parallaxSections = [...document.querySelectorAll('.hero, .story, .events-section, .weekly-agenda, .content-section')];
  parallaxSections.forEach(section => section.dataset.parallax = '');
  let parallaxTicking = false;
  const updateParallax = () => {
    parallaxSections.forEach(section => {
      const offset = Math.max(-32, Math.min(32, section.getBoundingClientRect().top * -.035));
      section.style.setProperty('--parallax-shift', `${offset}px`);
    });
    parallaxTicking = false;
  };
  const requestParallax = () => {
    if (!parallaxTicking) {
      parallaxTicking = true;
      window.requestAnimationFrame(updateParallax);
    }
  };
  updateParallax();
  window.addEventListener('scroll', requestParallax, {passive:true});

  if (window.matchMedia?.('(pointer:fine)')?.matches ?? false) {
    document.querySelectorAll('.button, .nav-cta, .card-actions a, .content-link').forEach(element => {
      element.classList.add('magnetic');
      element.addEventListener('pointermove', event => {
        const bounds = element.getBoundingClientRect();
        const x = (event.clientX - bounds.left - bounds.width / 2) * .08;
        const y = (event.clientY - bounds.top - bounds.height / 2) * .08;
        element.style.setProperty('--magnet-x', `${x}px`);
        element.style.setProperty('--magnet-y', `${y}px`);
      });
      element.addEventListener('pointerleave', () => {
        element.style.setProperty('--magnet-x', '0px');
        element.style.setProperty('--magnet-y', '0px');
      });
    });
  }
}

const copyPix = document.querySelector('[data-copy-pix]');
if (copyPix) copyPix.addEventListener('click', async event => {
  const button = event.currentTarget;
  const status = document.querySelector('.copy-status');
  try { await navigator.clipboard.writeText('03.397.109/0001-00'); status.textContent = 'Chave Pix copiada.'; button.innerHTML = 'Chave copiada <span aria-hidden="true">✓</span>'; } catch { status.textContent = 'Copie a chave Pix: 03.397.109/0001-00'; }
});

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>'"]/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[character]));
}

function eventImageUrl(imagePath) {
  if (!imagePath) return '';
  if (/^https?:\/\//i.test(imagePath)) return imagePath;
  if (imagePath.startsWith('local:')) return imagePath.slice(6);
  const config = window.FIREBASE_CONFIG;
  if (config && config.storageBucket && !imagePath.startsWith('/')) {
    return `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imagePath.split('/').map(encodeURIComponent).join('/')}?alt=media`;
  }
  return imagePath;
}

const localEvents = [];

function renderEvents(events) {
  const section = document.querySelector('#eventos');
  const container = document.querySelector('[data-events]');
  if (!section || !container) return;
  if (!events.length) {
    container.innerHTML = '';
    section.hidden = true;
    return;
  }
  container.innerHTML = events.sort((a, b) => new Date(a.starts_at) - new Date(b.starts_at)).map(event => {
    const start = new Date(event.starts_at);
    const day = new Intl.DateTimeFormat('pt-BR', {weekday:'long', day:'2-digit', month:'long', timeZone:'America/Sao_Paulo'}).format(start);
    const time = new Intl.DateTimeFormat('pt-BR', {hour:'2-digit', minute:'2-digit', timeZone:'America/Sao_Paulo'}).format(start).replace(':00', 'h');
    const date = `${day} · ${time}`;
    const image = eventImageUrl(event.image_path);
    const media = image ? `<img src="${escapeHtml(image)}" alt="Arte do evento ${escapeHtml(event.title)}" loading="lazy">` : '<div class="event-placeholder" aria-hidden="true">Semente</div>';
    const action = event.link_url ? `<a href="${escapeHtml(event.link_url)}" target="_blank" rel="noreferrer">Ver detalhes →</a>` : '';
    const womenClass = /mulheres/i.test(event.title) ? ' event-card-women' : '';
    if (womenClass) {
      const location = event.location ? `<p class="event-location">${escapeHtml(event.location)}</p>` : '';
      return `<article class="event-card">${media}<div class="event-card-body"><span class="event-date">${escapeHtml(date)}</span><h3>${escapeHtml(event.title)}</h3>${event.description ? `<p class="event-quote">${escapeHtml(event.description)}</p>` : ''}${location}${action}</div></article>`;
    }
    const location = event.location ? `<div class="event-detail"><span>Onde</span><p>${escapeHtml(event.location)}</p></div>` : '';
    const description = event.description ? `<div class="event-detail"><span>Detalhes</span><p>${escapeHtml(event.description)}</p></div>` : '';
    return `<article class="event-card">${media}<div class="event-card-body"><span class="event-date">${escapeHtml(date)}</span><h3>${escapeHtml(event.title)}</h3>${location}${description}${action}</div></article>`;
  }).join('');
  section.hidden = false;
  section.querySelectorAll('.reveal').forEach(element => observer.observe(element));
}

async function loadPublishedEvents() {
  const section = document.querySelector('#eventos');
  const container = document.querySelector('[data-events]');
  if (!section || !container) return;
  let events = [...localEvents];
  if (!window.db) {
    renderEvents(events);
    return;
  }
  try {
    const snapshot = await window.db.collection('events')
      .where('is_published', '==', true)
      .orderBy('starts_at', 'asc')
      .get();
    const remoteEvents = [];
    snapshot.forEach(doc => {
      remoteEvents.push({ id: doc.id, ...doc.data() });
    });
    const eventKey = event => `${event.title}|${new Date(event.starts_at).getTime()}`;
    const remoteKeys = new Set(remoteEvents.map(eventKey));
    events = [...remoteEvents, ...localEvents.filter(event => !remoteKeys.has(eventKey(event)))];
    renderEvents(events);
  } catch (error) {
    console.warn('Não foi possível carregar os eventos publicados do Firebase.', error);
    renderEvents(events);
  }
}

loadPublishedEvents();


/* ===== Playlists do mês e pedido de oração ===== */
// Para atualizar a cada mês, troque o mês e os links abaixo.
const PLAYLISTS = {
  month: 'Novembro',
  items: [
    {church: 'Jardim Sapopemba', url: 'https://music.youtube.com/search?q=Igreja+Evang%C3%A9lica+Semente+da+Multiplica%C3%A7%C3%A3o+Louvor'},
    {church: 'Vila Antonieta', url: 'https://music.youtube.com/playlist?list=PLVySTvS_ScAM&si=gRjyeu-SeU9EsXgU'}
  ]
};
const PRAYER_EMAIL = 'missaosemente2012@gmail.com';

(function initPlaylists(){
  const box = document.querySelector('[data-playlists]');
  if (!box) return;
  box.innerHTML = PLAYLISTS.items.map(p => `<article class="playlist-card"><span class="playlist-icon" aria-hidden="true">♪</span><small>Playlist de ${PLAYLISTS.month}</small><h3>${p.church}</h3><p>Todas as músicas que vamos cantar em ${PLAYLISTS.month.toLowerCase()} na congregação ${p.church}.</p><a class="button button-primary" href="${p.url}" target="_blank" rel="noreferrer">Ouvir no YouTube Music <span aria-hidden="true">→</span></a></article>`).join('');
})();

(function initPrayerForm(){
  const form = document.querySelector('[data-prayer-form]');
  if (!form) return;
  const status = form.querySelector('.form-status');
  const button = form.querySelector('button[type="submit"]');
  form.addEventListener('submit', async event => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    if (data._honey) return;
    if (!data.nome.trim() || !data.motivo.trim()) {
      status.textContent = 'Por favor, preencha seu nome e o motivo da oração.';
      status.dataset.state = 'error';
      return;
    }
    button.disabled = true;
    status.dataset.state = '';
    status.textContent = 'Enviando...';
    const payload = {
      name: data.nome.trim(),
      email: data.email.trim() || null,
      congregation: data.congregacao || null,
      reason: data.motivo.trim(),
      created_at: new Date().toISOString()
    };
    const jobs = [
      fetch(`https://formsubmit.co/ajax/${PRAYER_EMAIL}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          _subject: `Novo pedido de oração - ${payload.name}`,
          Nome: payload.name,
          Email: payload.email || 'não informado',
          Congregacao: payload.congregation || 'não informada',
          Motivo: payload.reason,
          _template: 'table',
          _captcha: 'false'
        })
      }).then(r => { if (!r.ok) throw new Error('email'); })
    ];
    if (window.db) {
      jobs.push(window.db.collection('prayer_requests').add(payload));
    }
    const results = await Promise.allSettled(jobs);
    button.disabled = false;
    if (results.some(r => r.status === 'fulfilled')) {
      form.reset();
      status.dataset.state = 'ok';
      status.textContent = 'Recebemos seu pedido! Vamos orar por você. Deus te abençoe.';
    } else {
      status.dataset.state = 'error';
      status.textContent = 'Não foi possível enviar agora. Tente novamente ou fale com a gente pelo WhatsApp.';
    }
  });
})();

/* ===== Atmosfera Dark, Luz de Cursor (Bento Spotlight) e Contadores Cinéticos ===== */
(function initAtmosphericAndKinetic() {
  const shell = document.querySelector('#site-shell');
  if (shell && !document.querySelector('.ambient-orbs')) {
    const orbs = document.createElement('div');
    orbs.className = 'ambient-orbs';
    orbs.setAttribute('aria-hidden', 'true');
    orbs.innerHTML = '<span class="orb orb-lime"></span><span class="orb orb-emerald"></span><span class="orb orb-petrol"></span>';
    shell.prepend(orbs);
  }

  // Cursor spotlight para cards Bento e botões
  const interactiveSelector = '.goal-card, .project-card, .location-card, .agenda-item, .playlist-card, .content-link, .button-primary, .nav-cta, .button-dark';
  document.addEventListener('pointermove', event => {
    const target = event.target.closest(interactiveSelector);
    if (!target) return;
    const rect = target.getBoundingClientRect();
    target.style.setProperty('--mouse-x', `${event.clientX - rect.left}px`);
    target.style.setProperty('--mouse-y', `${event.clientY - rect.top}px`);
  }, { passive: true });

  // Contadores numéricos cinéticos quando entram na tela
  if (!('IntersectionObserver' in window)) return;
  const counterElements = document.querySelectorAll('.card-number, .location-number, .story-step span, .hero-badge span');
  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      counterObserver.unobserve(el);
      if (el.dataset.counted) return;
      el.dataset.counted = 'true';

      const original = el.textContent;
      // Anima números (ex: "Desde 1997", "01 / 1997", "Meta 01", "01")
      const matches = [...original.matchAll(/\d+/g)];
      if (!matches.length) return;

      const duration = 1100;
      const startTime = performance.now();

      const step = now => {
        const progress = Math.min(1, (now - startTime) / duration);
        const eased = 1 - Math.pow(1 - progress, 4); // easeOutQuart
        let updated = original;
        // Substitui da direita para a esquerda para preservar índices
        for (let i = matches.length - 1; i >= 0; i--) {
          const m = matches[i];
          const targetVal = parseInt(m[0], 10);
          const padLen = m[0].length;
          const startVal = targetVal > 1900 ? 1900 : 0;
          const currentVal = Math.round(startVal + (targetVal - startVal) * eased);
          const formatted = padLen === 2 && targetVal < 100
            ? String(currentVal).padStart(2, '0')
            : String(currentVal);
          updated = updated.slice(0, m.index) + formatted + updated.slice(m.index + m[0].length);
        }
        el.textContent = updated;
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }, { threshold: 0.25 });

  counterElements.forEach(el => counterObserver.observe(el));
})();

/* ===== LOGO MOTION: REVOADA DE POMBOS BRANCOS ===== */
(function initDoveMotion() {
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches) return;

  const DOVE_SVG = `<svg class="flight-dove" viewBox="0 0 80 60" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><g class="dove-wing-back"><path d="M 38 28 C 30 15, 20 5, 24 0 C 32 3, 42 12, 48 24 Z" fill="rgba(240,248,245,0.78)"/></g><path class="dove-tail" d="M 28 36 C 18 38, 5 44, 2 40 C 6 35, 16 32, 26 31 Z" fill="#FFFFFF"/><path class="dove-tail-2" d="M 28 36 C 15 42, 6 52, 4 48 C 10 42, 20 36, 27 34 Z" fill="rgba(240,248,245,0.85)"/><path class="dove-body" d="M 26 32 C 34 30, 44 28, 52 26 C 56 22, 62 20, 66 22 C 70 23, 74 27, 72 30 C 68 33, 62 36, 56 40 C 46 45, 36 44, 28 36 Z" fill="#FFFFFF"/><polygon points="71,28 77,29 72,31" fill="#FFC247"/><circle cx="65" cy="24" r="1.3" fill="#173B45"/><path d="M 73 30 Q 77 34 80 38" stroke="#D9FF4E" stroke-width="1.2" fill="none" stroke-linecap="round"/><path d="M 76 33 Q 79 31 80 34 Q 77 35 76 33 Z" fill="#D9FF4E"/><path d="M 78 37 Q 81 35 81 38 Q 79 39 78 37 Z" fill="#38F29B"/><g class="dove-wing-front"><path d="M 44 32 C 34 16, 22 2, 28 0 C 38 4, 50 16, 56 30 C 52 32, 48 32, 44 32 Z" fill="#FFFFFF"/><path d="M 32 8 C 38 16, 46 24, 48 28" stroke="rgba(23,59,69,0.12)" stroke-width="0.8" fill="none"/></g></svg>`;

  let sky = document.querySelector('.dove-sky');
  if (!sky) {
    sky = document.createElement('div');
    sky.className = 'dove-sky';
    sky.setAttribute('aria-hidden', 'true');
    document.body.appendChild(sky);
  }

  // Função para lançar uma revoada de pombos elegantes
  function launchFlock(count = 5, options = {}) {
    if (!sky) return;
    const isMobile = window.innerWidth <= 768;
    const actualCount = isMobile ? Math.min(count, 3) : count;

    // Configurações da formação da revoada
    const flockConfigs = [
      { scale: isMobile ? 0.75 : 1.05, delay: 0, startX: '-10vw', startY: '75vh', endX: '115vw', endY: '-12vh', opacity: 1, angle: '-18deg', duration: '3.1s' },
      { scale: isMobile ? 0.55 : 0.78, delay: 0.18, startX: '-15vw', startY: '82vh', endX: '112vw', endY: '-6vh', opacity: 0.88, angle: '-16deg', duration: '3.4s' },
      { scale: isMobile ? 0.5 : 0.68, delay: 0.32, startX: '-18vw', startY: '70vh', endX: '118vw', endY: '-18vh', opacity: 0.82, angle: '-20deg', duration: '3.2s' },
      { scale: 0.52, delay: 0.48, startX: '-22vw', startY: '88vh', endX: '110vw', endY: '2vh', opacity: 0.7, angle: '-15deg', duration: '3.6s' },
      { scale: 0.44, delay: 0.62, startX: '-25vw', startY: '76vh', endX: '114vw', endY: '-14vh', opacity: 0.65, angle: '-19deg', duration: '3.5s' },
      { scale: 0.38, delay: 0.75, startX: '-28vw', startY: '64vh', endX: '120vw', endY: '-22vh', opacity: 0.55, angle: '-22deg', duration: '3.7s' }
    ];

    const chosen = flockConfigs.slice(0, actualCount);

    chosen.forEach(cfg => {
      const doveEl = document.createElement('div');
      doveEl.className = 'dove-entity';
      doveEl.innerHTML = DOVE_SVG;

      const size = 70;
      doveEl.style.width = `${size}px`;
      doveEl.style.height = `${size * 0.75}px`;
      doveEl.style.setProperty('--scale', cfg.scale);
      doveEl.style.setProperty('--delay', `${cfg.delay}s`);
      doveEl.style.setProperty('--duration', cfg.duration);
      doveEl.style.setProperty('--start-x', options.fromLogo ? '15vw' : cfg.startX);
      doveEl.style.setProperty('--start-y', options.fromLogo ? '12vh' : cfg.startY);
      doveEl.style.setProperty('--end-x', cfg.endX);
      doveEl.style.setProperty('--end-y', cfg.endY);
      doveEl.style.setProperty('--target-opacity', cfg.opacity);
      doveEl.style.setProperty('--angle', cfg.angle);

      sky.appendChild(doveEl);

      // Inicia o voo
      requestAnimationFrame(() => {
        doveEl.classList.add('flying');
      });

      // Remove do DOM após o voo
      const totalMs = (parseFloat(cfg.duration) + cfg.delay + 0.5) * 1000;
      setTimeout(() => {
        doveEl.remove();
      }, totalMs);
    });
  }

  // 1. Revoada suave na chegada à página (Page Arrival)
  setTimeout(() => {
    launchFlock(window.innerWidth <= 768 ? 3 : 5);
  }, 400);

  // 2. Voo suave entre páginas (ao clicar nos links de navegação internos)
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href]');
    if (!link) return;
    const href = link.getAttribute('href');
    // Apenas links internos do site
    if (href && !href.startsWith('http') && !href.startsWith('mailto') && !href.startsWith('tel') && !href.startsWith('#') && !href.includes('wa.me')) {
      launchFlock(3);
    }
  });

  // 3. Efeito Interativo no Logo: passar o mouse ou clicar solta uma revoada
  const logos = document.querySelectorAll('.brand, .logo-lockup');
  logos.forEach(logo => {
    logo.style.cursor = 'pointer';
    let lastLaunch = 0;
    const trigger = (e) => {
      const now = Date.now();
      if (now - lastLaunch < 2500) return; // cooldown de 2.5s
      lastLaunch = now;
      launchFlock(4, { fromLogo: true });
    };
    logo.addEventListener('click', trigger);
  });

  // 4. Voo ambiental periódico e sutil (a cada 28s)
  // Revoada periódica desativada para estabilidade visual
  const periodicFlockDisabled = true;

  // Expõe no window para testes
  window.launchDoveMotion = launchFlock;
})();
