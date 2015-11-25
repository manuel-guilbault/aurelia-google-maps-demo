﻿import {
  inject, 
  customElement, 
  inlineView, 
  bindable, 
  bindingMode, 
  Container
} from 'aurelia-framework';
import {EventListeners} from './event-listeners';

@customElement('marker')
@inlineView('<template><content></content></template>')
@inject(Container)
@bindable({ name: 'position', defaultBindingMode: bindingMode.twoWay })
@bindable({ name: 'title', defaultValue: '' })
@bindable({ name: 'visible', defaultValue: true })
@bindable({ name: 'draggable', defaultValue: true })
@bindable({ name: 'icon' })
@bindable({ name: 'click' })
export class Marker {
  constructor(container) {
    this.container = container;
    this.eventListeners = new EventListeners();
  }

  get map() {
    return this.container.get(google.maps.Map);
  }

  positionChanged(value) {
    if (!this.ignoreNextPositionChanged) {
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

  bind(bindingContext) {
  }

  attached() {
    this.marker = this.createMarker();
    this.container.registerInstance(google.maps.Marker, this.marker);
    this.container.registerInstance('info-window-anchor', this.marker);
  }

  detached() {
    this.destroyMarker();
  }

  unbind() {
  }

  createMarker() {
    var marker = new google.maps.Marker({
      map: this.map,
      position: this.position,
      title: this.title,
      visible: this.visible,
      draggable: this.draggable,
      icon: this.icon
    });
        
    this.eventListeners.disposeAll();

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

  destroyMarker() {
    this.eventListeners.disposeAll();
    this.marker = null;
  }
}