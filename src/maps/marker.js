import {
  inject, 
  customElement, 
  inlineView, 
  bindable, 
  bindingMode, 
  Container
} from 'aurelia-framework';
import {MarkerContainer} from './marker-container';
import {EventListeners} from './event-listeners';

@customElement('marker')
@inlineView('<template><div><content></content></div></template>')
@inject(google.maps.Map, MarkerContainer, Container)
export class Marker {
  
  @bindable({ defaultBindingMode: bindingMode.twoWay }) position = null;
  @bindable title = '';
  @bindable visible = true;
  @bindable draggable = true;
  @bindable icon = null;
  @bindable click = null;

  constructor(map, markerContainer, container) {
    this.map = map;
    this.markerContainer = markerContainer;
    this.eventListeners = new EventListeners();
    this.marker = this.createMarker();
    container.registerInstance(google.maps.Marker, this.marker);
  }

  positionChanged(value) {
    if (!this.ignoreNextPositionChanged && value) {
      this.marker.setPosition(value);
    }
    this.ignoreNextPositionChanged = false;
  }
  
  titleChanged(value) {
    this.marker.setTitle(value);
  }
  
  visibleChanged(value) {
    this.marker.setVisible(value);
  }
  
  draggableChanged(value) {
    this.marker.setDraggable(value);
  }

  iconChanged(value) {
    this.marker.setIcon(value);
  }

  attached() {
    this.markerContainer.addMarker(this.marker);
  }

  detached() {
    this.markerContainer.removeMarker(this.marker);
  }

  createMarker() {
    var marker = new google.maps.Marker({
      position: this.position,
      title: this.title,
      visible: this.visible,
      draggable: this.draggable,
      icon: this.icon
    });
        
    this.eventListeners.listen(marker, 'position_changed', () => {
      this.ignoreNextPositionChanged = true;
      this.position = marker.getPosition();
    });
    this.eventListeners.listen(marker, 'click', () => {
      if (typeof this.click === 'function') {
        this.click();
      }
    });

    return marker;
  }
}