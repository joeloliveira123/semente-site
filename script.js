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
    "number": "07",
    "title": "Missionários",
    "text": "Referência histórica à atuação missionária ligada à igreja.",
    "verse": "Romanos 10:15",
    "details": "O site antigo apresentava uma área chamada Missionários. Não acrescentamos nomes, biografias ou destinos de envio sem confirmação documental.",
    "links": []
  },
  {
    "number": "08",
    "title": "Missão Semente",
    "text": "Nome presente no acervo histórico, associado a ações missionárias e conteúdos audiovisuais e musicais.",
    "verse": "Salmos 126:5",
    "details": "Entre os títulos históricos associados à Missão Semente estão Semente da Vida e Terra Prometida. O acervo também identificava conteúdo musical sob o nome Missão Semente.",
    "links": [
      [
        "Buscar Semente da Vida no YouTube",
        "https://www.youtube.com/results?search_query=Semente+da+Vida+Miss%C3%A3o+Semente"
      ],
      [
        "Buscar Terra Prometida no YouTube",
        "https://www.youtube.com/results?search_query=Terra+Prometida+Miss%C3%A3o+Semente"
      ],
      [
        "Procurar Missão Semente no Spotify",
        "https://open.spotify.com/search/Miss%C3%A3o%20Semente"
      ]
    ]
  },
  {
    "number": "09",
    "title": "Semente da Vida",
    "text": "Nome original da igreja, constituída em 31 de janeiro de 1998.",
    "verse": "1 Coríntios 3:6",
    "details": "Segundo a história institucional recuperada, em 1998 a igreja foi constituída como Igreja Evangélica Apostólica Semente da Vida. Em 2002, passou a se chamar Igreja Evangélica Semente da Multiplicação.",
    "links": [
      [
        "Buscar registro histórico de Semente da Vida",
        "https://www.youtube.com/results?search_query=Semente+da+Vida+Miss%C3%A3o+Semente"
      ]
    ]
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
    "number": "13",
    "title": "Grupo de Apoio Emocional",
    "text": "Cuidado integral, com atenção às dimensões emocional e espiritual.",
    "verse": "Gálatas 6:2",
    "details": "Projeto listado no site novo. A descrição não promete atendimento clínico nem acrescenta detalhes não confirmados.",
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
        "memorias.html"
      ]
    ]
  }
];

const goalsContainer = document.querySelector('[data-goals]');
if (goalsContainer) goalsContainer.innerHTML = goals.map(([number, title, text]) => `<article class="goal-card reveal"><span class="card-number">Meta ${number}</span><h3>${title}</h3><p>${text}</p></article>`).join('');
const projectsContainer = document.querySelector('[data-projects]');
if (projectsContainer) projectsContainer.innerHTML = projects.map(project => `<article class="project-card reveal"><span class="card-number">Projeto \${project.number}</span><h3>\${project.title}</h3><p>\${project.text}</p><details class="mission-details"><summary>Conheça esta missão <span aria-hidden="true">+</span></summary><p>\${project.details}</p></details>\${project.links.length ? `<div class="mission-links">\${project.links.map(([label, url]) => `<a class="content-link" href="\${url}" target="_blank" rel="noreferrer">\${label} →</a>`).join('')}</div>` : ''}<span class="quote">\${project.verse}</span></article>`).join('');
const yearContainer = document.querySelector('[data-year]');
if (yearContainer) yearContainer.textContent = new Date().getFullYear();

const header = document.querySelector('[data-header]');
if (header) window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 12), {passive:true});
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
if (menuButton && nav) {
  menuButton.addEventListener('click', () => { const open = nav.classList.toggle('open'); menuButton.setAttribute('aria-expanded', String(open)); });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => { nav.classList.remove('open'); menuButton.setAttribute('aria-expanded', 'false'); }));
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
  const config = window.SUPABASE_CONFIG;
  return `${config.url}/storage/v1/object/public/${config.imageBucket}/${imagePath.split('/').map(encodeURIComponent).join('/')}`;
}

const localEvents = [{
  id: 'encontro-mulheres-2026',
  title: 'Encontro Especial de Mulheres',
  description: '“Lançando sobre ele toda a vossa ansiedade, porque ele tem cuidado de vós.” — 1 Pedro 5:7',
  starts_at: '2026-10-24T16:00:00-03:00',
  location: 'Rua Júlio Parigot, 228 — Vila Antonieta',
  image_path: 'local:assets/encontro-mulheres.jpeg',
  link_url: 'https://www.google.com/maps/search/?api=1&query=Rua+J%C3%BAlio+Parigot%2C+228%2C+Vila+Antonieta%2C+S%C3%A3o+Paulo+-+SP'
}];

function renderEvents(events) {
  const section = document.querySelector('#eventos');
  const container = document.querySelector('[data-events]');
  if (!events.length || !section || !container) return;
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
  const config = window.SUPABASE_CONFIG;
  const section = document.querySelector('#eventos');
  const container = document.querySelector('[data-events]');
  if (!section || !container) return;
  let events = [...localEvents];
  if (!config?.url || !config?.publishableKey) {
    renderEvents(events);
    return;
  }
  const query = new URLSearchParams({select:'id,title,description,starts_at,location,image_path,link_url',is_published:'eq.true',order:'starts_at.asc'});
  try {
    const response = await fetch(`${config.url}/rest/v1/events?${query}`, {headers:{apikey:config.publishableKey,Authorization:`Bearer ${config.publishableKey}`}});
    if (!response.ok) throw new Error(`Supabase events request failed: ${response.status}`);
    const remoteEvents = await response.json();
    const eventKey = event => `${event.title}|${new Date(event.starts_at).getTime()}`;
    const remoteKeys = new Set(remoteEvents.map(eventKey));
    events = [...remoteEvents, ...localEvents.filter(event => !remoteKeys.has(eventKey(event)))];
    renderEvents(events);
  } catch (error) {
    console.warn('Não foi possível carregar os eventos publicados.', error);
    renderEvents(events);
  }
}

loadPublishedEvents();
