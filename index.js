const weatherApi = "https://api.weather.gov/alerts/active?area=";

function init() {
  const input = document.getElementById('state-input');
  const button = document.getElementById('fetch-btn');
  const errorDiv = document.getElementById('error-message');
  const loadingDiv = document.getElementById('loading');
  const container = document.getElementById('alerts-display');

  function fetchWeatherAlerts(state) {
    container.innerHTML = '';

    errorDiv.textContent = '';
    errorDiv.className = 'hidden';

    loadingDiv.className = 'loading';

    return fetch(`${weatherApi}${state}`)
      .then(res => {
        if (!res.ok) throw new Error('Request failed');
        return res.json();
      })
      .then(data => {
        loadingDiv.className = 'hidden';
        displayAlerts(data);
      })
      .catch(err => {
        loadingDiv.className = 'hidden';
        errorDiv.textContent = err.message;
        errorDiv.className = 'error';
      });
  }

  function displayAlerts(data) {
    const alerts = data.features || [];

    const h2 = document.createElement('h2');
    h2.textContent = `Weather Alerts: ${alerts.length}`;

    const ul = document.createElement('ul');

    alerts.forEach(a => {
      const li = document.createElement('li');
      li.textContent = a.properties.headline;
      ul.appendChild(li);
    });

    container.appendChild(h2);
    container.appendChild(ul);
  }

  button.addEventListener('click', () => {
    const state = input.value.trim();

   
    input.value = '';

    fetchWeatherAlerts(state);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}