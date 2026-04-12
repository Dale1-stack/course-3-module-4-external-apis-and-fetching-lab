// index.js
const weatherApi = "https://api.weather.gov/alerts/active?area=";

// DOM elements
const input = document.getElementById('state-input');
const button = document.getElementById('fetch-btn');
const errorDiv = document.getElementById('error-message');
const loadingDiv = document.getElementById('loading');
const container = document.getElementById('alerts-display');

// Attach event listener ONLY if button exists
if (button && input) {
  button.addEventListener('click', () => {
    const state = input.value.trim();

    // ✅ Clear input immediately
    input.value = '';

    fetchWeatherAlerts(state);
  });
}

function fetchWeatherAlerts(state) {
  // ✅ Ensure fetch is ALWAYS called (important for tests)
  
  // Clear container
  if (container) container.innerHTML = '';

  // Clear error (HIDE it)
  if (errorDiv) {
    errorDiv.textContent = '';
    errorDiv.className = 'hidden';
  }

  // Show loading
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

      // ✅ Ensure error stays hidden after success
      if (errorDiv) {
        errorDiv.textContent = '';
        errorDiv.className = 'hidden';
      }

      displayAlerts(data);
    })
    .catch(error => {
      if (loadingDiv) loadingDiv.className = 'hidden';

      // ✅ SHOW error (remove hidden)
      if (errorDiv) {
        errorDiv.textContent = error.message;
        errorDiv.className = 'error'; // NOT hidden
      }
    });
}

function displayAlerts(data) {
  const alerts = data.features || [];
  const alertCount = alerts.length;

  // ❗ Tests expect EXACT text:
  const summary = document.createElement('h2');
  summary.textContent = `Weather Alerts: ${alertCount}`;

  if (container) container.appendChild(summary);

  const ul = document.createElement('ul');

  alerts.forEach(alert => {
    const li = document.createElement('li');
    li.textContent = alert.properties.headline;
    ul.appendChild(li);
  });

  if (container) container.appendChild(ul);
}