const mapEl = document.getElementById('map');
const locBtn = document.getElementById('locBtn');
const exportBtn = document.getElementById('exportBtn');
const coordsEl = document.getElementById('coords');
const boardEl = document.getElementById('board');
const stolEl = document.getElementById('stol');

let map;
let userMarker;
let tiles = [];
let placed = 0;


function initMap() {
  map = L.map('map').setView([52.2297, 21.0122], 16);

  L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    {
      maxZoom: 19,
      attribution: "Tiles © Esri — World Imagery"
    }
  ).addTo(map);
}


function requestNotificationPermission() {
  if (!("Notification" in window)) return;
  if (Notification.permission === "default") {
    Notification.requestPermission();
  }
}


locBtn.addEventListener('click', () => {
  if (!navigator.geolocation) {
    alert('Twoja przeglądarka nie obsługuje geolokalizacji.');
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;
      coordsEl.textContent = `Lat: ${latitude.toFixed(6)}, Lon: ${longitude.toFixed(6)}`;

      if (userMarker) map.removeLayer(userMarker);
      userMarker = L.marker([latitude, longitude]).addTo(map);
      map.setView([latitude, longitude], 17);
    },
    (err) => alert('Błąd: ' + err.message),
    { enableHighAccuracy: true }
  );
});


exportBtn.addEventListener('click', () => {
  exportBtn.disabled = true;
  exportBtn.textContent = "Przygotowywanie...";

  leafletImage(map, function (err, canvas) {
    if (err) {
      alert("Błąd renderowania: " + err);
      exportBtn.disabled = false;
      exportBtn.textContent = "Pobierz mapę";
      return;
    }

    const preview = document.getElementById("canvasPreview");
    preview.innerHTML = "";
    preview.appendChild(canvas);

    canvas.style.width = "100%";
    canvas.style.borderRadius = "12px";

    splitImageToTiles(canvas, 4, 4);

    exportBtn.disabled = false;
    exportBtn.textContent = "Pobierz mapę";
  });
});


function splitImageToTiles(sourceCanvas, cols, rows) {
  tiles = [];
  placed = 0;
  boardEl.innerHTML = "";
  stolEl.innerHTML = "";

  const w = Math.floor(sourceCanvas.width / cols);
  const h = Math.floor(sourceCanvas.height / rows);

  
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const idx = r * cols + c;

      const temp = document.createElement("canvas");
      temp.width = w;
      temp.height = h;

      const ctx = temp.getContext("2d");
      ctx.drawImage(
        sourceCanvas,
        c * w, r * h, w, h,
        0, 0, w, h
      );

      tiles.push({ index: idx, dataURL: temp.toDataURL("image/png") });
    }
  }

  
  for (let i = 0; i < tiles.length; i++) {
    const cell = document.createElement('div');
    cell.className = "cell";
    cell.dataset.correct = i;
    cell.addEventListener("dragover", ev => ev.preventDefault());
    cell.addEventListener("drop", onDropCell);
    boardEl.appendChild(cell);
  }


  const shuffled = shuffleArray(tiles.slice());
  for (let t of shuffled) {
    const img = document.createElement("img");
    img.src = t.dataURL;
    img.dataset.index = t.index;
    img.className = "draggableTile";
    img.draggable = true;
    img.addEventListener("dragstart", onDragStart);

    stolEl.appendChild(img);
  }
}


function onDragStart(e) {
  e.dataTransfer.setData("text/plain", e.target.dataset.index);
}

function onDropCell(e) {
  e.preventDefault();
  const index = e.dataTransfer.getData("text/plain");
  const cell = e.currentTarget;

  if (cell.dataset.occupied) return;

  const img = stolEl.querySelector(`img[data-index='${index}']`);
  if (!img) return;

  const clone = img.cloneNode();
  clone.className = "tile";
  clone.draggable = false;
  clone.addEventListener("click", onTileRemove);
  cell.appendChild(clone);

  img.remove();
  cell.dataset.occupied = "1";

  if (parseInt(index) === parseInt(cell.dataset.correct)) {
    cell.classList.add("correct");
    placed++;
  }

  checkWin();
}

function onTileRemove(e) {
  const img = e.currentTarget;
  const cell = img.parentElement;
  const index = img.dataset.index;

  img.remove();
  cell.dataset.occupied = "";

  if (parseInt(index) === parseInt(cell.dataset.correct)) {
    placed--;
    cell.classList.remove("correct");
  }

  const back = document.createElement("img");
  back.src = tiles[index].dataURL;
  back.dataset.index = index;
  back.className = "draggableTile";
  back.draggable = true;
  back.addEventListener("dragstart", onDragStart);

  stolEl.appendChild(back);
}

function checkWin() {
  if (placed === tiles.length) {
    showNotification("Gratulacje!", "Ułożyłeś całą układankę.");
  }
}

function showNotification(title, message) {
  if (!("Notification" in window)) {
    alert(title + "\n" + message);
    return;
  }

  if (Notification.permission === "granted") {
    new Notification(title, { body: message });
    return;
  }

  if (Notification.permission !== "denied") {
    Notification.requestPermission().then(p => {
      if (p === "granted") new Notification(title, { body: message });
      else alert(title + "\n" + message);
    });
  } else {
    alert(title + "\n" + message);
  }
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}


initMap();
requestNotificationPermission();
