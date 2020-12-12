import CovidAPI from './Covid19API.js';

export default class Map {
  mymap;

  constructor(map) {
    this.map = map;
  }

  allCountries() {
    const mapOptions = {
      center: [0, 0],
      zoom: 1
    };
    this.mymap = new L.Map(this.map, mapOptions);
    const layer = new L.TileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png', {
      maxZoom: 20,
      minZoom: 1
    });
    this.mymap.addLayer(layer);
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
        const circle = new L.CircleMarker(database.countries[i].latLon, {
          color: 'rgba(255,255,255, 0)',
          fillColor: 'red',
          fillOpacity: 0.6,
          radius: radiusCircle
        });
        circle.bindPopup(database.countries[i].name);
        circle.addTo(this.mymap);
      }
    // eslint-disable-next-line no-console
    }).catch((error) => console.log(error.message));
  }

  deleteCircles() {
    console.log(this.mymap._layers);
    for(let i in this.mymap._layers) {
      console.log(i);
    }
  }
}
