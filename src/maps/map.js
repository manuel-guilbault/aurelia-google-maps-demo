import {
  customElement, 
  inject, 
  inlineView,
  bindable, 
  bindingMode, 
  Container
} from 'aurelia-framework';
import {MarkerContainer} from './marker-container';
import {EventListeners} from './event-listeners';

let elementNormalizer = {
  nextMapId: 1,
  
  normalize: function (element) {
    if (!element.id) {
      element.id = "aurelia-google-map.map-" + elementNormalizer.nextMapId++;
    }
    return element;
  }
};

@customElement('map')
@inlineView('<template><div><content></content></div></template>')
@inject(Container, Element)
export class Map {
  
  @bindable panCenter = true;
  @bindable({ defaultBindingMode: bindingMode.twoWay }) center = new google.maps.LatLng(0, 0); 
  @bindable panBounds = true;
  @bindable({ defaultBindingMode: bindingMode.twoWay }) bounds = null;
  @bindable({ defaultBindingMode: bindingMode.twoWay }) zoom = 8;
  @bindable({ attribute: 'map-type' }) mapTypeId = google.maps.MapTypeId.ROADMAP;
  
  constructor(container, element) {
    this.element = elementNormalizer.normalize(element);
    this.eventListeners = new EventListeners();
    this.map = this.createMap();
    container.registerInstance(google.maps.Map, this.map);
    container.registerInstance(MarkerContainer, new MapMarkerContainer(this.map));
  }

  centerChanged(value) {
    if (!this.ignoreNextCenterChanged && value) {
      if (this.panCenter) {
        this.map.panTo(value);
      } else {
        this.map.setCenter(value);
      }
    }
    this.ignoreNextCenterChanged = false;
  }

  boundsChanged(value) {
    if (!this.ignoreNextBoundsChanged && value) {
      if (this.panBounds) {
        this.map.panToBounds(value);
      } else {
        this.map.fitBounds(value);
      }
    }
    this.ignoreNextBoundsChanged = false;
  }

  zoomChanged(value) {
    if (!this.ignoreNextZoomChanged) {
      this.map.setZoom(value);
    }
    this.ignoreNextZoomChanged = false;
  }

  mapTypeIdChanged(value) {
    this.map.setMapTypeId(value);
  }

  attached() {
  }

  detached() {
  }

  createMap() {
    var map = new google.maps.Map(this.element, {
      center: this.center,
      zoom: this.zoom,
      mapTypeId: this.mapTypeId
    });

    this.eventListeners.listen(map, "center_changed", () => {
      this.ignoreNextCenterChanged = true;
      this.center = map.getCenter();
    });
    this.eventListeners.listen(map, "zoom_changed", () => {
      this.ignoreNextZoomChanged = true;
      this.zoom = map.getZoom();
    });
    this.eventListeners.listen(map, "bounds_changed", () => {
      this.ignoreNextBoundsChanged = true;
      this.bounds = map.getBounds();
    });

    return map;
  }
}

class MapMarkerContainer extends MarkerContainer {
  
  constructor(map) {
    super();
    this.map = map;
  }
  
  addMarker(marker) {
    marker.setMap(this.map);
  }
  
  removeMarker(marker) {
    marker.setMap(null);
  }
}