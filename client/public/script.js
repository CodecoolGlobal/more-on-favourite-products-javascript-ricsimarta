import { products } from '/data.js';
let favorites = [];
const albumsGroupedByVendorName = products
  .filter(album => album.price >= 1000)
  .sort((a, b) => a.price - b.price)
  .reduce((acc, curr) => {
    acc[curr.vendor.name] ? acc[curr.vendor.name].push(curr) : acc[curr.vendor.name] = [curr]
    return acc
  }, {});

const divElement = (content) => {
  return `<div>${content}</div>`;
}

const trackElement = (trackData) => {
  return divElement(`
    <p>track name: ${trackData.name}</p>
    <p>composer: ${trackData.composer}</p>
    <p>length: ${convertMsToTime(trackData.milliseconds)}</p>
  `)
}

const tracksElement = (tracksArray) => {
  return tracksArray.map(track => trackElement(track)).join("");
}

const albumDivElement = (content) => {
  return `<div class="album">${content}</div>`;
}

const albumElement = (albumData) => {
  const tracksHtml = tracksElement(albumData.details);

  return albumDivElement(`
      <h2 class="album-id">${albumData.id}</h2>
      <h3>price: ${albumData.price}</h3>
      <button class="album-${albumData.id} favorite">+</button>
      <p class="album-name">album name: ${albumData.name}</p>
      ${divElement(tracksHtml)}
    `);
}

const vendorElement = (vendorName, albumsHtml) => {
  return `
    <section>
      <h2>${vendorName}</h2>
      <div class="albums">
        ${albumsHtml}
      </div>
    </section>
  `
}

const favAlbumsButtonElement = () => `<button class="fav-albums">Favorite albums</button>`;

const resetListElement = () => `<button class="reset">Reset list</button>`

const convertMsToTime = (ms) => {
  let seconds = Math.round(ms / 1000);
  let minutes = Math.floor(seconds / 60);
  seconds -= minutes * 60;
  let hours = Math.floor(minutes / 60);
  minutes -= hours * 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().length < 2 ? `0${seconds}` : seconds}`
}

const createProductList = (rootElement) => {
  rootElement.innerHTML = "";
  
  rootElement.insertAdjacentHTML("beforeend", favAlbumsButtonElement());
  const favAlbumsButton = document.querySelector("button.fav-albums");
  favAlbumsButton.addEventListener("click", () => {
    rootElement.innerHTML = "";
    
    rootElement.insertAdjacentHTML("beforeend", resetListElement());
    const resetListButton = document.querySelector("button.reset");
    resetListButton.addEventListener("click", () => createProductList(rootElement));

    const newHtml = favorites.map(album => albumElement(album)).join("");
    rootElement.insertAdjacentHTML("beforeend", newHtml);

    favorites = [];
  })

  for (const vendorName in albumsGroupedByVendorName) {
    const vendorAlbumsHtml = albumsGroupedByVendorName[vendorName]
      .map(album => albumElement(album))
      .join("");

    rootElement.insertAdjacentHTML("beforeend", vendorElement(vendorName, vendorAlbumsHtml));
  }

  const buttonElements = document.querySelectorAll("button.favorite");
  buttonElements.forEach(button => button.addEventListener("click", () => {
    const albumId = Number(button.classList[0].substring(6));
    const albumObj = products.find(album => album.id === albumId);
    if (button.textContent === "+") {
      favorites.push(albumObj);
      button.textContent = "-";
    } else {
      const albumIndex = favorites.findIndex(album => album.id === albumId);
      favorites.splice(albumIndex, 1);
      button.textContent = "+";
    }
  }));
}

const loadEvent = function () {
  const rootElement = document.querySelector("#root");

  createProductList(rootElement);
}

window.addEventListener("load", loadEvent);