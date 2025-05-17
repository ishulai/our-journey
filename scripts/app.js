let map = null;

let currentDateIndex = 0;

const renderTitleScreen = async () => {
  return new Promise((resolve, reject) => {
    const currentDate = DATES[currentDateIndex];
    id("title").innerText = currentDate.title;
    id("date").innerText = currentDate.date;
    show(id("title-screen"));
    setTimeout(() => {
      hide(id("title-screen"));
      resolve();
    }, 3000); // TODO: 3000
  });
};

const getRandomItems = (arr, num = 3) => {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  if (arr.length < num) return arr;
  return shuffled.slice(0, num);
}

let currentPlaceIndex = 0;

const renderPlace = () => {
  const currentDate = DATES[currentDateIndex];
  const currentPlaces = getRandomItems(currentDate.places);

  var group = new L.featureGroup();

  map.addLayer(group);

  currentPlaces.forEach((place, i) => {
    reset(id("content" + (i + 1)), false);
    reset(id("photocard" + (i + 1)), true);
    reset(id("photocard" + (i + 1)).parentElement, true);
    id("photocard" + (i + 1)).style.backgroundImage = "url('images/" + currentDate.folder + "/" + place.image + "')";
    id("place-title-" + (i + 1)).innerText = place.title;
    id("place-address-" + (i + 1)).innerText = place.address;
    id("place-description-" + (i + 1)).innerText = place.description;
    const marker = L.marker([place.lat, place.lng])
      .addTo(group);
    marker.on('click', () => {
      if (currentPlaces[currentPlaceIndex].address === place.address) {
        hide(id("photocard" + (currentPlaceIndex + 1)));
        show(id("content" + (currentPlaceIndex + 1)));
        map.removeLayer(marker);
      }
    });
  });

  map.fitBounds(group.getBounds(), {
    padding: [22, 22]
  });
}

const renderGame = () => {
  show(id("game-container"));

  setTimeout(() => {
    if (!map) {
      map = L.map('map', {
        zoomControl: false,
        dragging: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        boxZoom: false,
        keyboard: false,
        tap: false,
        touchZoom: false
      });
  
      const osm = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png');
      map.addLayer(osm);
    }
  
    renderPlace();
  }, ANIMATION_TIME + 50);
}

const renderDate = async () => {
  await renderTitleScreen();
  renderGame();
}

const renderEnding = async () => {
  const endingTitle = id("ending-title");
  reset(endingTitle, false);
  show(id("ending-screen"));
  await wait(400);
  show(endingTitle);
  await wait(2000);
  hide(endingTitle);
  endingTitle.innerText = "Happy 6 months, baby ♡";
  await wait(400);
  show(endingTitle);
  await wait(3000);
  hide(endingTitle);
  endingTitle.innerText = "I can't imagine life without you ♡♡♡";
  await wait(400);
  show(endingTitle);
  await wait(3000);
  hide(endingTitle);
  await wait(400);
  id("ending-letter").innerText = LETTER;
  show(id("ending-letter"));
}

id("start-button").addEventListener("click", () => {
  hide(id("home-screen"));
  renderDate();
  // renderEnding(); // TODO: remove this
});

for (let i = 1; i <= 3; i++) {
  id("photocard" + i).parentElement.addEventListener("click", (e) => {
    if (currentPlaceIndex === i - 1) {
      hide(id("photocard" + i).parentElement);
      currentPlaceIndex++;
    }
    if (currentPlaceIndex === 3) {
      currentDateIndex++;
      currentPlaceIndex = 0;
      hide(id("game-container"));
      if (currentDateIndex === DATES.length) {
        renderEnding();
      } else {
        renderDate();
      }
    }
  });
}