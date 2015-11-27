import {
  customElement, 
  inject, 
  inlineView,
  bindable, 
  bindingMode, 
  Container
} from 'aurelia-framework';
import {EventListeners} from './event-listeners';

var nextMapId = 1;

function normalizeMapElement(element) {
  if (!element.id) {
    element.id = "aurelia-google-map.map-" + nextMapId++;
  }
  return element;
}

@customElement('map')
@inlineView('<template><div><content></content></div></template>')
@inject(Container, Element)
@bindable({ name: 'panCenter', defaultValue: true })
@bindable({ name: 'center', defaultValue: new google.maps.LatLng(0, 0), defaultBindingMode: bindingMode.twoWay })
@bindable({ name: 'panBounds', defaultValue: true })
@bindable({ name: 'bounds', defaultBindingMode: bindingMode.twoWay })
@bindable({ name: 'zoom', defaultValue: 8, defaultBindingMode: bindingMode.twoWay })
@bindable({ name: 'mapTypeId', attribute: 'map-type', defaultValue: google.maps.MapTypeId.ROADMAP })
export class Map {
  constructor(container, element) {
    this.container = container;
    this.element = normalizeMapElement(element);
    this.eventListeners = new EventListeners();
  }

  centerChanged(value) {
    if (!this.ignoreNextCenterChanged) {
      if (this.panCenter) {
        this.map.panTo(value);
      } else {
        this.map.setCenter(value);
      }
    }
    this.ignoreNextCenterChanged = false;
  }

  boundsChanged(value) {
    if (!this.ignoreNextBoundsChanged) {
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

  bind(bindingContext) {
  }

  attached() {
    this.map = this.createMap();
    this.container.registerInstance(google.maps.Map, this.map);
  }

  detached() {
    this.destroyMap();
  }

  unbind() {
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

  destroyMap() {
    this.eventListeners.disposeAll();
    this.map = null;
  }
}