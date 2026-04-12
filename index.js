// index.js
const weatherApi = "https://api.weather.gov/alerts/active?area=";

const input = document.getElementById('state-input');
const button = document.getElementById('fetch-btn');
const errorDiv = document.getElementById('error-message');
const loadingDiv = document.getElementById('loading');
const container = document.getElementById('alerts-display');

if (button) {
  button.addEventListener('click', () => {
    const state = input.value.trim();

    if (input) input.value = '';

    fetchWeatherAlerts(state);
  });
}

function fetchWeatherAlerts(state) {
  if (container) container.innerHTML = '';

  if (errorDiv) {
    errorDiv.textContent = '';
    errorDiv.className = 'hidden';
  }

  const stateRegex = /^[A-Z]{2}$/;

  if (!stateRegex.test(state)) {
    if (errorDiv) {
      errorDiv.textContent = 'Please enter a valid 2-letter state code (e.g. CA).';
      errorDiv.className = 'error';
    }
    return;
  }

  if (loadingDiv) loadingDiv.className = 'loading';

  fetch(`${weatherApi}${state}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Invalid state code or failed request.');
      }
      return response.json();
    })
    .then(data => {
      if (loadingDiv) loadingDiv.className = 'hidden';

      displayAlerts(data);
    })
    .catch(error => {
      if (loadingDiv) loadingDiv.className = 'hidden';

      if (errorDiv) {
        errorDiv.textContent = error.message;
        errorDiv.className = 'error';
      }
    });
}

function displayAlerts(data) {
  const alerts = data.features || [];
  const alertCount = alerts.length;
  const titleText = data.title;

  const summary = document.createElement('h2');
  summary.textContent = `${titleText}: ${alertCount}`;

  if (container) container.appendChild(summary);

  if (alertCount === 0) {
    const noAlerts = document.createElement('p');
    noAlerts.textContent = 'No active alerts for this state.';
    if (container) container.appendChild(noAlerts);
    return;
  }

  const ul = document.createElement('ul');

  alerts.forEach(alert => {
    const li = document.createElement('li');
    li.textContent = alert.properties.headline;
    ul.appendChild(li);
  });
  if (container) container.appendChild(ul);
}
