

const API_KEY = "22c69d392ae6c6aacd74c3bee37e5e58"; 
const CURRENT_URL = "https://api.openweathermap.org/data/2.5/weather";
const FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast";

const cityInput = document.getElementById("cityInput");
const checkBtn = document.getElementById("checkBtn");
const statusBox = document.getElementById("status");
const currentBox = document.getElementById("currentBox");
const forecastBox = document.getElementById("forecastBox");

checkBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (!city) {
    setStatus("Wpisz nazwę miasta", true);
    return;
  }
  setStatus("Pobieram dane…");
  currentBox.innerHTML = "";
  forecastBox.innerHTML = "";
  getCurrentXHR(city);
  getForecastFetch(city);
});

// CURRENT (XMLHttpRequest) 
function getCurrentXHR(city) {
  const url = `${CURRENT_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=pl`;

  const xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);

  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status < 300) {
      const data = JSON.parse(xhr.responseText);
      console.log("CURRENT RESPONSE:", data); 
      renderCurrent(data);
      setStatus("Gotowe ");
    } else {
      setStatus("Nie znaleziono miasta lub błąd API (current).", true);
    }
  };

  xhr.onerror = function () {
    setStatus("Błąd sieci (current).", true);
  };

  xhr.send();
}

// FORECAST (Fetch API) 
function getForecastFetch(city) {
  const url = `${FORECAST_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=pl`;

  fetch(url)
    .then(res => {
      if (!res.ok) throw new Error("Forecast error");
      return res.json();
    })
    .then(data => {
      console.log("FORECAST RESPONSE:", data); 
      renderForecast(data);
    })
    .catch(() => {
      setStatus("Nie udało się pobrać prognozy (forecast).", true);
    });
}


function renderCurrent(d) {
  const timeStr = formatDateTime(d.dt * 1000);
  const icon = d.weather?.[0]?.icon;
  const desc = d.weather?.[0]?.description ?? "-";

  currentBox.innerHTML = `
    <div class="block-title">Aktualna pogoda — ${d.name}, ${d.sys?.country ?? ""}</div>
    <article class="card glass">
      <div class="icon-wrap">
        ${icon ? `<img alt="${desc}" src="https://openweathermap.org/img/wn/${icon}@2x.png" />` : ""}
      </div>
      <div class="meta">
        <div class="time">${timeStr}</div>
        <div class="desc">${desc}</div>
      </div>
      <div class="temp">
        <div class="main">${round(d.main?.temp)}°C</div>
        <div class="feels">Odczuwalna: ${round(d.main?.feels_like)}°C</div>
      </div>
    </article>
  `;
}

function renderForecast(d) {
 
  const list = d.list.filter((_, i) => i % 2 === 0);

  const cards = list.map(item => {
    const timeStr = formatDateTime(item.dt * 1000);
    const icon = item.weather?.[0]?.icon;
    const desc = item.weather?.[0]?.description ?? "-";
    return `
      <article class="card glass">
        <div class="icon-wrap">
          ${icon ? `<img alt="${desc}" src="https://openweathermap.org/img/wn/${icon}@2x.png" />` : ""}
        </div>
        <div class="meta">
          <div class="time">${timeStr}</div>
          <div class="desc">${desc}</div>
        </div>
        <div class="temp">
          <div class="main">${round(item.main?.temp)}°C</div>
          <div class="feels">Odczuwalna: ${round(item.main?.feels_like)}°C</div>
        </div>
      </article>
    `;
  }).join("");

  forecastBox.innerHTML = `
    <div class="block-title">Prognoza 5-dniowa</div>
    ${cards || `<div class="error">Brak danych prognozy.</div>`}
  `;
}

function setStatus(msg, isError=false){
  statusBox.textContent = msg;
  statusBox.className = "status" + (isError ? " error" : "");
}

function round(x){
  return (typeof x === "number") ? x.toFixed(1) : "-";
}

function formatDateTime(ms){
  const dt = new Date(ms);
  return dt.toLocaleString("pl-PL", {
    year:"numeric", month:"2-digit", day:"2-digit",
    hour:"2-digit", minute:"2-digit"
  });
}
