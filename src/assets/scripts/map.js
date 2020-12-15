/*
Example for use
import { MapWidget } from './map.js';
MapWidget.init(); for create map
MapWidget.confirmedAllTime(); add circles for confirmed cases for all time
*/

import CovidAPI from './Covid19API.js';
import './leaflet-src.js';
import '../styles/leaflet.css';

const MapContainer = {
  elements: {
    mapImg: '',
    circles: []
  },

  init() {
    const mapBlock = document.querySelector('.map_widget');
    const mapOptions = {
      center: [0, 0],
      zoom: 1,
      zoomDelta: 0.25,
      zoomSnap: 0.25
    };
    // eslint-disable-next-line no-undef
    this.elements.mapImg = new L.Map(mapBlock, mapOptions);
    // eslint-disable-next-line no-undef
    const layer = new L.TileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png', {
      maxZoom: 20,
      minZoom: 1
    });
    this.elements.mapImg.addLayer(layer);
    this.confirmedAllTime();
  },

  confirmedAllTime() {
    CovidAPI.getSummary().then((database) => {
      for (let i = 0; i < database.countries.length; i += 1) {
        let radiusCircle;
        if (database.countries[i].totalConfirmed < 500000 && database.countries[i].totalConfirmed > 100000) {
          radiusCircle = 5;
        } else if (database.countries[i].totalConfirmed < 1000000 && database.countries[i].totalConfirmed >= 500000) {
          radiusCircle = 7;
        } else if (database.countries[i].totalConfirmed >= 1000000 && database.countries[i].totalConfirmed < 5000000) {
          radiusCircle = 9;
        } else if (database.countries[i].totalConfirmed > 5000000) {
          radiusCircle = 11;
        } else {
          radiusCircle = 3;
        }
        // eslint-disable-next-line no-undef
        const circle = new L.CircleMarker(database.countries[i].latLon, {
          color: 'rgba(8,138,179,0.7)',
          fillColor: 'rgba(8,138,179,1)',
          fillOpacity: 0.7,
          radius: radiusCircle
        });
        this.elements.circles.push(circle);
        circle.addTo(MapContainer.elements.mapImg).on('click', () => {
          MapContainer.focusMap(database.countries[i], database.countries[i].totalConfirmed, circle);
        });
      }
    // eslint-disable-next-line no-console
    }).catch((error) => console.log(error.message));
  },

  focusMap(dataObj, causes, circle) {
    circle.closePopup();
    this.elements.mapImg.setView([dataObj.latLon[0], dataObj.latLon[1]], 5);
    const popapMap = document.querySelector('.map_popap');
    popapMap.innerHTML = `
    ${dataObj.name}<br>
    Confirmed cases: ${causes.toLocaleString()}`;
    popapMap.style.display = 'block';
  },

  confirmedlastDay() {
    MapContainer.elements.circles.forEach((elem) => {
      MapContainer.elements.mapImg.removeLayer(elem);
    });
    MapContainer.elements.circles = [];
    CovidAPI.getSummary().then((database) => {
      for (let i = 0; i < database.countries.length; i += 1) {
        let radiusCircle;
        if (database.countries[i].newConfirmed < 5000 && database.countries[i].newConfirmed > 1000) {
          radiusCircle = 5;
        } else if (database.countries[i].newConfirmed < 10000 && database.countries[i].newConfirmed >= 5000) {
          radiusCircle = 7;
        } else if (database.countries[i].newConfirmed >= 10000 && database.countries[i].newConfirmed < 50000) {
          radiusCircle = 9;
        } else if (database.countries[i].newConfirmed > 50000) {
          radiusCircle = 14;
        } else {
          radiusCircle = 3;
        }
        // eslint-disable-next-line no-undef
        const circle = new L.CircleMarker(database.countries[i].latLon, {
          color: 'rgba(8,138,179,0.7)',
          fillColor: 'rgba(8,138,179,1)',
          fillOpacity: 0.7,
          radius: radiusCircle
        });
        MapContainer.elements.circles.push(circle);
        circle.addTo(MapContainer.elements.mapImg).on('click', () => {
          MapContainer.focusMap(database.countries[i], database.countries[i].newConfirmed, circle);
        });
      }
    // eslint-disable-next-line no-console
    }).catch((error) => console.log(error.message));
  }

};

// eslint-disable-next-line import/prefer-default-export
export const MapWidget = MapContainer;
