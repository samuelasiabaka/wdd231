const qs = (selector, scope = document) => scope.querySelector(selector);
const qsa = (selector, scope = document) => [...scope.querySelectorAll(selector)];

function setYearAndModifiedDate() {
  const year = qs('#copyright-year');
  const modified = qs('#last-modified');
  if (year) year.textContent = new Date().getFullYear();
  if (modified) modified.textContent = `Last Modified: ${document.lastModified}`;
}

function setupNavigation() {
  const button = qs('.menu-button');
  const nav = qs('.primary-nav');
  if (!button || !nav) return;
  button.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    button.setAttribute('aria-expanded', String(open));
    button.textContent = open ? '✕' : '☰';
  });
}

function membershipName(level) {
  return ({ 1: 'Member', 2: 'Silver Member', 3: 'Gold Member' })[level] || 'Member';
}

function memberCard(member) {
  const card = document.createElement('article');
  card.className = 'member-card';
  card.innerHTML = `
    <div class="member-top">
      <img class="member-logo" src="images/members/${member.image}" alt="${member.name} logo" loading="lazy">
      <h2 class="member-name">${member.name}</h2>
      <p class="member-tagline">${member.tagline}</p>
    </div>
    <div class="member-body">
      <p><strong>Address:</strong> ${member.address}</p>
      <p><strong>Phone:</strong> <a href="tel:${member.phone.replace(/\s/g, '')}">${member.phone}</a></p>
      <p><strong>Email:</strong> <a href="mailto:${member.email}">${member.email}</a></p>
      <p><strong>Web:</strong> <a href="${member.website}" target="_blank" rel="noopener">Visit website</a></p>
      <p><strong>Focus:</strong> ${member.description}</p>
      <span class="badge">${membershipName(member.membership)}</span>
    </div>`;
  return card;
}

async function loadDirectory() {
  const container = qs('#members');
  if (!container) return;
  try {
    const response = await fetch('data/members.json');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const members = await response.json();
    container.replaceChildren(...members.map(memberCard));
  } catch (error) {
    container.innerHTML = '<div class="banner"><strong>Directory unavailable.</strong> Please refresh the page and try again.</div>';
    console.error('Directory load failed:', error);
  }
}

function setupViewToggle() {
  const members = qs('#members');
  if (!members) return;
  qsa('.view-button').forEach(button => {
    button.addEventListener('click', () => {
      const isList = button.dataset.view === 'list';
      members.classList.toggle('list', isList);
      qsa('.view-button').forEach(btn => {
        btn.classList.toggle('active', btn === button);
        btn.setAttribute('aria-pressed', String(btn === button));
      });
      localStorage.setItem('lcci-directory-view', isList ? 'list' : 'grid');
    });
  });
  const saved = localStorage.getItem('lcci-directory-view');
  if (saved === 'list') qs('[data-view="list"]')?.click();
}

async function loadWeather() {
  const card = qs('#weather-card');
  if (!card) return;
  try {
    const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=6.5244&longitude=3.3792&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=Africa%2FLagos');
    if (!response.ok) throw new Error('Weather request failed');
    const data = await response.json();
    const current = data.current;
    const codes = {
      0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
      45: 'Foggy', 48: 'Rime fog', 51: 'Light drizzle', 53: 'Drizzle', 55: 'Heavy drizzle',
      61: 'Light rain', 63: 'Rain', 65: 'Heavy rain', 80: 'Rain showers', 81: 'Rain showers', 82: 'Heavy showers',
      95: 'Thunderstorm', 96: 'Thunderstorm with hail', 99: 'Thunderstorm with hail'
    };
    card.innerHTML = `
      <div class="weather-main">
        <div><p class="eyebrow">Lagos weather</p><div class="weather-temp">${Math.round(current.temperature_2m)}°C</div><p>${codes[current.weather_code] || 'Current conditions'}</p></div>
        <div class="weather-icon" aria-hidden="true">☁️</div>
      </div>
      <p class="form-note">Humidity ${current.relative_humidity_2m}% · Wind ${Math.round(current.wind_speed_10m)} km/h</p>`;
  } catch (error) {
    card.innerHTML = '<p><strong>Lagos weather</strong><br>Weather data is temporarily unavailable.</p>';
  }
}

function setupJoinForm() {
  const form = qs('#join-form');
  const success = qs('#form-success');
  if (!form || !success) return;
  form.addEventListener('submit', event => {
    event.preventDefault();
    success.classList.add('show');
    success.textContent = 'Thank you. Your membership application has been captured for this academic project demonstration.';
    form.reset();
    success.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
}

setupNavigation();
setYearAndModifiedDate();
loadDirectory();
setupViewToggle();
loadWeather();
setupJoinForm();
