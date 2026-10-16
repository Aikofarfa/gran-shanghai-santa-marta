const WHATSAPP_NUMBER = '573045334401';

const menuGrid = document.querySelector('#menu-grid');
const menuFilters = document.querySelector('#menu-filters');
const menuSearch = document.querySelector('#menu-search');
const menuStatus = document.querySelector('#menu-disclaimer');
const mobileToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('#site-nav');

let menuItems = [];
let selectedCategory = 'all';

function formatPrice(value) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(value);
}

function makeMenuItem(item) {
  const article = document.createElement('article');
  article.className = 'menu-item';

  const title = document.createElement('h4');
  title.textContent = item.name;
  article.append(title);

  const price = document.createElement('div');
  price.className = 'menu-price';
  if (Array.isArray(item.sizes) && item.sizes.length) {
    price.textContent = item.sizes.map((size) => formatPrice(size.price)).join(' · ');
  } else if (Number.isFinite(item.price)) {
    price.textContent = formatPrice(item.price);
  }
  article.append(price);

  const sizeList = document.createElement('div');
  sizeList.className = 'menu-sizes';
  if (Array.isArray(item.sizes) && item.sizes.length) {
    for (const size of item.sizes) {
      const sizeLabel = document.createElement('span');
      sizeLabel.append(document.createTextNode(`${size.label}: `));
      const sizePrice = document.createElement('b');
      sizePrice.textContent = formatPrice(size.price);
      sizeLabel.append(sizePrice);
      sizeList.append(sizeLabel);
    }
  } else {
    const sourceNote = document.createElement('span');
    sourceNote.textContent = item.note || 'Precio transcrito; confirmar por WhatsApp';
    sizeList.append(sourceNote);
  }
  article.append(sizeList);
  return article;
}

function renderMenu() {
  if (!menuGrid) return;
  const query = (menuSearch?.value || '').trim().toLocaleLowerCase('es');
  const filtered = menuItems.filter((item) => {
    const categoryMatches = selectedCategory === 'all' || item.categoryId === selectedCategory;
    const queryMatches = !query || item.name.toLocaleLowerCase('es').includes(query);
    return categoryMatches && queryMatches;
  });

  menuGrid.replaceChildren();
  if (!filtered.length) {
    const empty = document.createElement('p');
    empty.className = 'menu-empty';
    empty.textContent = 'No encontramos platos con esa búsqueda. Prueba con otro nombre o consúltanos por WhatsApp.';
    menuGrid.append(empty);
    return;
  }

  const fragment = document.createDocumentFragment();
  for (const item of filtered) fragment.append(makeMenuItem(item));
  menuGrid.append(fragment);
}

function renderFilters(categories) {
  if (!menuFilters) return;
  menuFilters.replaceChildren();
  for (const category of categories) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'filter-button';
    button.dataset.category = category.id;
    button.setAttribute('aria-pressed', category.id === selectedCategory ? 'true' : 'false');
    button.textContent = category.label;
    button.addEventListener('click', () => {
      selectedCategory = category.id;
      for (const filter of menuFilters.querySelectorAll('.filter-button')) {
        filter.setAttribute('aria-pressed', filter.dataset.category === selectedCategory ? 'true' : 'false');
      }
      renderMenu();
    });
    menuFilters.append(button);
  }
}

async function loadMenu() {
  if (!menuGrid || !menuFilters) return;
  try {
    const response = await fetch('./data/menu.json');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    menuItems = Array.isArray(data.items) ? data.items : [];
    renderFilters(data.categories || []);
    renderMenu();
    if (menuStatus && data.disclaimer) menuStatus.textContent = data.disclaimer;
    menuGrid.setAttribute('aria-busy', 'false');
  } catch (error) {
    const message = document.createElement('p');
    message.className = 'menu-empty';
    message.textContent = 'No pudimos cargar la carta. Escríbenos y te compartimos la versión actualizada.';
    menuGrid.replaceChildren(message);
    menuGrid.setAttribute('aria-busy', 'false');
  }
}

menuSearch?.addEventListener('input', renderMenu);
loadMenu();

mobileToggle?.addEventListener('click', () => {
  const willOpen = mobileToggle.getAttribute('aria-expanded') !== 'true';
  mobileToggle.setAttribute('aria-expanded', String(willOpen));
  mobileToggle.setAttribute('aria-label', willOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
  siteNav?.classList.toggle('is-open', willOpen);
});

siteNav?.addEventListener('click', (event) => {
  if (event.target instanceof HTMLAnchorElement && window.matchMedia('(max-width: 680px)').matches) {
    siteNav.classList.remove('is-open');
    mobileToggle?.setAttribute('aria-expanded', 'false');
    mobileToggle?.setAttribute('aria-label', 'Abrir menú de navegación');
  }
});

const dateInput = document.querySelector('#booking-date');
if (dateInput) {
  const localToday = new Date();
  const year = localToday.getFullYear();
  const month = String(localToday.getMonth() + 1).padStart(2, '0');
  const day = String(localToday.getDate()).padStart(2, '0');
  dateInput.min = `${year}-${month}-${day}`;
}

const reservationForm = document.querySelector('#reservation-form');
reservationForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!reservationForm.reportValidity()) return;

  const formData = new FormData(reservationForm);
  const dateValue = String(formData.get('date'));
  const [year, month, day] = dateValue.split('-').map(Number);
  const formattedDate = new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'long',
    timeZone: 'UTC'
  }).format(new Date(Date.UTC(year, month - 1, day)));

  const lines = [
    'Hola, quisiera solicitar una reserva en Gran Shanghai.',
    `Nombre: ${String(formData.get('name')).trim()}`,
    `Fecha: ${formattedDate}`,
    `Hora aproximada: ${String(formData.get('time'))}`,
    `Personas: ${String(formData.get('partySize'))}`
  ];
  const note = String(formData.get('note') || '').trim();
  if (note) lines.push(`Detalle: ${note}`);
  lines.push('¿Me confirman si hay disponibilidad?');

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`;
  const status = document.querySelector('#form-status');
  if (status) status.textContent = 'Abriendo WhatsApp. La reserva quedará pendiente de confirmación del restaurante.';
  window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
});
