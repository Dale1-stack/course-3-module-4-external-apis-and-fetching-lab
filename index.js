const weatherApi = "https://api.weather.gov/alerts/active?area=";

const input = document.getElementById('state-input');
const button = document.getElementById('fetch-btn');
const errorDiv = document.getElementById('error-message');
const loadingDiv = document.getElementById('loading');
const container = document.getElementById('alerts-display');

button.addEventListener('click', () => {
  const state = input.value.trim();

  input.value = '';

  fetchWeatherAlerts(state);
});

function fetchWeatherAlerts(state) {

  container.innerHTML = '';

  errorDiv.textContent = '';
  errorDiv.className = 'hidden';

  loadingDiv.className = 'loading';

  fetch(`${weatherApi}${state}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Invalid state code or failed request.');
      }
      return response.json();
    })
    .then(data => {
      console.log(data); 

      loadingDiv.className = 'hidden';

      displayAlerts(data);
    })
    .catch(error => {
      loadingDiv.className = 'hidden';

      errorDiv.textContent = error.message;
      errorDiv.className = 'error';
    });
}


function displayAlerts(data) {
  const alerts = data.features || [];
  const alertCount = alerts.length;

 
  const summary = document.createElement('h2');
  summary.textContent =
    `Current watches, warnings, and advisories for ${data.title.split(' for ')[1]}: ${alertCount}`;

  container.appendChild(summary);

  const ul = document.createElement('ul');

  alerts.forEach(alert => {
    const li = document.createElement('li');
    li.textContent = alert.properties.headline;
    ul.appendChild(li);
  });

  container.appendChild(ul);
}