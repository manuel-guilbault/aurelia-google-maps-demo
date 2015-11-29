import {LogManager} from 'aurelia-framework';

var logger = LogManager.getLogger("google-map");

export class TestMap {
  center = new google.maps.LatLng(48.8566140, 2.3522220);
  zoom = 15;
  bounds = null;
  currentPosition = null;
  places = [];
  nextId = 1;
  
  activate() {
    this.detectCurrentPosition().then(
      position => { this.center = this.currentPosition = position; }, 
      error => logger.info(error)
    );
  }

  detectCurrentPosition() {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(result => {
        resolve(new google.maps.LatLng(result.coords.latitude, result.coords.longitude));
      }, reject);
    });
  }

  goTo(position) {
    this.center = position;
  }

  zoomIn() {
    this.zoom++;
  }

  zoomOut() {
    this.zoom--;
  }
  
  addPlace() {
    let place = {
      position: new google.maps.LatLng(0, 0), 
      name: 'Unknown place ' + this.nextId++
    };
    this.places.push(place);
  }
  
  removePlace(place) {
    var index = this.places.indexOf(place);
    if (index >= 0) {
      this.places.splice(index, 1);
    }
  }
  
  createPosition(lat, lnt) {
    return new google.maps.LatLng(lat, lnt)
  }
}