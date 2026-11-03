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
const projectBadges = {
  '06': { tag: 'Missões & Povos', icon: '🌍' },
  '10': { tag: 'Capacitação & Envio', icon: '🕊️' },
  '11': { tag: 'Palavra & Ensino', icon: '📖' },
  '12': { tag: 'Vocação & Trabalho', icon: '🌱' },
  '14': { tag: 'Cuidado & Presença', icon: '🤝' }
};

const projectsContainer = document.querySelector('[data-projects]');
if (projectsContainer) projectsContainer.innerHTML = projects.map(project => {
  const video = project.links.find(([, url]) => getYouTubeVideoId(url));
  const videoId = video ? getYouTubeVideoId(video[1]) : null;
  const badge = projectBadges[project.number] || { tag: 'Ação Comunitária', icon: '✝️' };
  const cover = videoId
    ? `<a class="video-cover-link project-video-cover" href="${video[1]}" target="_blank" rel="noreferrer" aria-label="Assistir: ${project.title}"><img class="video-cover" src="https://img.youtube.com/vi/${videoId}/hqdefault.jpg" alt="Capa do vídeo: ${project.title}" loading="lazy"><span class="video-play" aria-hidden="true">▶</span></a>`
    : `<div class="video-cover-placeholder mission-thematic-cover thematic-${project.number}"><span class="thematic-icon" aria-hidden="true">${badge.icon}</span><span class="thematic-tag">${badge.tag}</span></div>`;
  return `<article class="project-card mission-card reveal">${cover}<div class="mission-card-body"><span class="card-number">Projeto ${project.number}</span><h3>${project.title}</h3><p>${project.text}</p><details class="mission-details"><summary>Conheça esta missão <span aria-hidden="true">+</span></summary><p>${project.details}</p></details>${project.links.length ? `<div class="mission-links">${project.links.map(([label, url]) => `<a class="content-link" href="${url}" target="_blank" rel="noreferrer">${label} →</a>`).join('')}</div>` : ''}<span class="quote">“${project.verse}”</span></div></article>`;
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

/* ===== Movimento Sereno e Estabilidade Visual ===== */
window.launchDoveMotion = () => {};

