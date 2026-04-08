// index.js
const weatherApi = "https://api.weather.gov/alerts/active?area="

// Your code here!
const input = document.getElementById('state-input');
const button = document.getElementById('fetch-btn');
const errorDiv = document.getElementById('error-message');
const loadingDiv = document.getElementById('loading');
const container = document.getElementById('alerts-display');

button.addEventListener('click', () => {
  const state = input.value.trim();
  fetchWeatherAlerts(state);
});

function fetchWeatherAlerts(state) {
  container.innerHTML = '';

  errorDiv.textContent = '';
  errorDiv.className = 'hidden';

  const stateRegex = /^[A-Z]{2}$/;

  if (!stateRegex.test(state)) {
    errorDiv.textContent = 'Please enter a valid 2-letter state code (e.g. CA).';
    errorDiv.className = 'error';
    return;
  }

  loadingDiv.className = 'loading';

  fetch(`https://api.weather.gov/alerts/active?area=${state}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Invalid state code or failed request.');
      }
      return response.json();
    })
    .then(data => {
      loadingDiv.className = 'hidden';
      input.value = '';

      displayAlerts(data);
    })
    .catch(error => {
      loadingDiv.className = 'hidden';

      errorDiv.textContent = error.message;
      errorDiv.className = 'error';

      console.log(error.message);
    });
}

function displayAlerts(data) {
    const alerts = data.features;
    const alertCount = alerts.length;
    const titleText = data.title;

    const summary = document.createElement('h2');
    summary.textContent = `${titleText}: ${alertCount}`;

    const ul = document.createElement('ul');

    alerts.forEach(alert => {
        const li = document.createElement('li');
        const headline = alert.properties.headline;
        li.textContent = headline;
        ul.appendChild(li);
  });
  container.appendChild(ul);
  container.appendChild(summary);
}
