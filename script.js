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
  ['01', 'Crianças para Cristo', 'Evangelização e formação cristã de crianças em praças, comunidades e espaços abertos.', 'Marcos 10:14'],
  ['02', 'Agência Missionária', 'Formação, envio e apoio a missionários no Brasil e no exterior.', 'Marcos 16:15'],
  ['03', 'Projeto de Discipulado', 'Ensino contínuo e crescimento espiritual para adultos e crianças.', 'Mateus 28:19'],
  ['04', 'Empresários e Novos Empresários', 'Fortalecimento econômico e espiritual para empreendedores cristãos.', 'Provérbios 16:3'],
  ['05', 'Grupo de Apoio Emocional', 'Cuidado integral do ser humano, promovendo saúde emocional e espiritual.', 'Gálatas 6:2'],
  ['06', 'Evangelismo de Rua', 'Evangelização em espaços públicos com acompanhamento e discipulado.', 'Romanos 10:14–15'],
  ['07', 'Irmãos de Rua', 'Cuidado e restauração da dignidade de pessoas em situação de vulnerabilidade. Ação semanal às sextas-feiras, às 20h.', 'Mateus 25:35']
];

document.querySelector('[data-goals]').innerHTML = goals.map(([number, title, text]) => `<article class="goal-card reveal"><span class="card-number">Meta ${number}</span><h3>${title}</h3><p>${text}</p></article>`).join('');
document.querySelector('[data-projects]').innerHTML = projects.map(([number, title, text, verse]) => `<article class="project-card reveal"><span class="card-number">Projeto ${number}</span><h3>${title}</h3><p>${text}</p><span class="quote">${verse}</span></article>`).join('');
document.querySelector('[data-year]').textContent = new Date().getFullYear();

const header = document.querySelector('[data-header]');
window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 12), {passive:true});
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
menuButton.addEventListener('click', () => { const open = nav.classList.toggle('open'); menuButton.setAttribute('aria-expanded', String(open)); });
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => { nav.classList.remove('open'); menuButton.setAttribute('aria-expanded', 'false'); }));

const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } }), {threshold:.12});
document.querySelectorAll('.reveal').forEach(element => observer.observe(element));

document.querySelector('[data-copy-pix]').addEventListener('click', async event => {
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
