"use strict";

console.log(">> Ready :) or not");

//Constants

const btnResetAll = document.querySelector(".js-reset");
const buttonSearch = document.querySelector(".js-search-button");
const serieName = document.querySelector(".js-search-input");
const log = document.querySelector(".js-log-button");

//Empty arrays to create lists

let series = [];
let favourites = [];

//Function to collect data from api
const getDataFromApi = () => {
  fetch(`http://api.tvmaze.com/search/shows?q=:${serieName.value}`)
    .then((response) => response.json())
    .then((data) => {
      series = [];
      for (let i = 0; i < data.length; i++) {
        series.push(data[i].show);
      }
      paintSeries();
    });
};

//Run function to collect data from api
buttonSearch.addEventListener("click", getDataFromApi);

//Function to paint the series in the html whith the click event
const paintSeries = () => {
  let firstCodeHTML = "";
  for (let index = 0; index < series.length; index += 1) {
    firstCodeHTML += `<li id = "${series[index].id}" data-index="${index}"
    data-id="${series[index].id}" class="js-seriesSelected">`;
    firstCodeHTML += `<article>`;
    if (series[index].image !== null) {
      firstCodeHTML += `<img src="${series[index].image.medium}"
          class="serie-img" alt="Foto de la serie ${series[index].name}"/>`;
    } else {
      firstCodeHTML += `<img src="https://via.placeholder.com/210x295/ffffff/666666/?text=TV"
          class="serie-img" alt="Foto de la serie ${series[index].name}"/>`;
    }
    firstCodeHTML += `<h2> ${series[index].name}</h2>`;
    firstCodeHTML += `<h3> Time: ${series[index].schedule.time}</h3>`;
    firstCodeHTML += `</article>`;
    firstCodeHTML += `</li>`;
  }
  const seriesElement = document.querySelector(".js-elements");
  seriesElement.innerHTML = firstCodeHTML;
  listenSeriesClick();
};

const logIn = () => {
  for (let index = 0; index < series.length; index += 1) {
    console.log(series[index].name);
  }
};
log.addEventListener("click", logIn);

//Function to paint favourites in the html whith the click event in series
const paintFavourites = () => {
  let secondCodeHTML = "";
  for (let index = 0; index < favourites.length; index += 1) {
    secondCodeHTML += `<li id = "${favourites[index].id}" data-index="${index} class="id"
    data-id="${favourites[index].id}" class="favourite-background">`;
    secondCodeHTML += `<article class="article">`;
    if (favourites[index].image !== null) {
      secondCodeHTML += `<img src="${favourites[index].image.medium}"
          class="serie-img" alt="Foto de la serie ${favourites[index].name}"/>`;
    } else {
      secondCodeHTML += `<img src="https://via.placeholder.com/210x295/ffffff/666666/?text=TV"
          class="serie-img" alt="Foto de la serie ${favourites[index].name}"/>`;
    }
    secondCodeHTML += `<h2> ${favourites[index].name}</h2>`;
    secondCodeHTML += `</article>`;
    secondCodeHTML += `</li>`;
  }
  const favouritesElements = document.querySelector(".js-favourites");
  favouritesElements.innerHTML = secondCodeHTML;
};

//Function to search clicked element and add to favourites
//At the same time, we change background-color and color
//Remove hide class in the reset button
const handleSeriesClick = (ev) => {
  const clickedSerie = parseInt(ev.currentTarget.id);
  const serie = series.find((serieItem) => serieItem.id === clickedSerie);
  if (!favourites.includes(serie)) {
    alert("Added to your favourites!");
    favourites.push(serie);
    updateLocalStorage();
    event.currentTarget.classList.add("favourite-background-click");
    paintFavourites();
    btnResetAll.classList.remove("hide");
  } else {
    alert("Already in your favourites!");
  }
};
//Run function start
const listenSeriesClick = () => {
  const seriesBtns = document.querySelectorAll(".js-seriesSelected");
  for (const seriesBtn of seriesBtns) {
    seriesBtn.addEventListener("click", handleSeriesClick);
  }
};

//Local Storage, function to update data in local storage
//another function to get data from local storage
// With this, when we refresh the site, local storage stays in
const updateLocalStorage = () => {
  localStorage.setItem("favourites", JSON.stringify(favourites));
};

const getFromLocalStorage = () => {
  const data = JSON.parse(localStorage.getItem("favourites"));
  if (data !== null) {
    favourites = data;
  }
};

//Reset favourites

const resetFavourites = () => {
  favourites = [];
  updateLocalStorage();
  paintFavourites();
};

btnResetAll.addEventListener("click", resetFavourites);

getFromLocalStorage();
paintSeries();
paintFavourites();
