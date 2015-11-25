import {LogManager} from 'aurelia-framework';

var logger = LogManager.getLogger("google-map");

export class TestMap {
  constructor() {
    this.center = new google.maps.LatLng(48.8566140, 2.3522220);
    this.zoom = 15;
    this.bounds = null;
    this.myPosition = null;
    this.places = [
        {
          name: 'Montreal', 
          position: new google.maps.LatLng(45.50169, -73.56726),
          isSelected: false
        },
        {
          name: 'Joliette',
          position: new google.maps.LatLng(46.014163, -73.418478),
          isSelected: false
        }
    ];
  }

  activate() {
    var vm = this;
    this.findMyPosition().then(position => {
      vm.center = vm.myPosition = position;
    }, error => {
      logger.info(error);
    });
  }

  findMyPosition() {
    return new Promise(function(resolve, reject) {
      navigator.geolocation.getCurrentPosition(function(result) {
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

  select(place) {
    for (var i = 0; i < this.places.length; ++i) {
      if (this.places[i] !== place) {
        this.places[i].isSelected = false;
      }
    }
    if (place) {
      place.isSelected = true;
    }
  }
}