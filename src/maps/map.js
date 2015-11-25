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
    element.id = "map-" + nextMapId++;
  }
  return element;
}

@customElement('map')
@inlineView('<template><content></content></template>')
@inject(Container)
@bindable({ name: 'panCenter', defaultValue: true })
@bindable({ name: 'center', defaultValue: new google.maps.LatLng(0, 0), defaultBindingMode: bindingMode.twoWay })
@bindable({ name: 'panBounds', defaultValue: true })
@bindable({ name: 'bounds', defaultBindingMode: bindingMode.twoWay })
@bindable({ name: 'zoom', defaultValue: 8, defaultBindingMode: bindingMode.twoWay })
@bindable({ name: 'mapTypeId', attribute: 'map-type', defaultValue: google.maps.MapTypeId.ROADMAP })
export class Map {
  constructor(container) {
    this.container = container;
    this.element = normalizeMapElement(container.get(Element));
    this.eventListeners = new EventListeners();
  }

  centerChanged(newCenter) {
    if (!this.ignoreNextCenterChanged) {
      if (this.panCenter) {
        this.map.panTo(newCenter);
      } else {
        this.map.setCenter(newCenter);
      }
    }
    this.ignoreNextCenterChanged = false;
  }

  boundsChanged(bounds) {
    if (!this.ignoreNextBoundsChanged) {
      if (this.panBounds) {
        this.map.panToBounds(this.bounds);
      } else {
        this.map.fitBounds(this.bounds);
      }
    }
    this.ignoreNextBoundsChanged = false;
  }

  zoomChanged(newZoom) {
    if (!this.ignoreNextZoomChanged) {
      this.map.setZoom(newZoom);
    }
    this.ignoreNextZoomChanged = false;
  }

  mapTypeIdChanged(newMapTypeId) {
    this.map.setMapTypeId(newMapTypeId);
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

    this.eventListeners.disposeAll();

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