import MarkerClusterer from 'googlemaps/js-marker-clusterer';
import {
  inject, 
  customElement,
  inlineView, 
  bindable, 
  bindingMode,
  TaskQueue,
  Container
} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {MarkerAdded, MarkerRemoved} from './marker';
import {EventListeners} from './event-listeners';

@customElement('marker-clusterer')
@inlineView('<template><div><content></content></div></template>')
@inject(EventAggregator, TaskQueue, Container)
export class MarkerClustererCustomElement {
  
  @bindable({ defaultBindingMode: bindingMode.oneTime }) ignoreHidden = true;
  @bindable gridSize = 60;
  @bindable maxZoom = null;
  @bindable styles = [];
  @bindable({ defaultBindingMode: bindingMode.oneTime }) calculator;
  
  constructor(eventAggregator, taskQueue, container) {
    this.eventAggregator = eventAggregator;
    this.taskQueue = taskQueue;
    this.container = container;
    this.eventListeners = new EventListeners();
  }
  
  get map() {
    if (this.container.hasResolver(google.maps.Map, true)) {
      return this.container.get(google.maps.Map);
    }
    throw new Error('marker elements must be placed inside a map element');
  }
  
  gridSizeChanged(value) {
    this.clusterer.setGridSize(value);
  }
  
  maxZoomChanged(value) {
    this.clusterer.setMaxZoom(value);
  }
  
  stylesChanged(value) {
    this.clusterer.setStyles(value);
    this.clusterer.resetViewport();
    this.clusterer.redraw();
  }

  bind(bindingContext) {
  }
  
  attached() {
    this.clusterer = this.createClusterer();
    
    this.markerAddedSubscription = this.eventAggregator.subscribe(MarkerAdded, e => {
      this.addMarker(e.marker);
    });
    this.markerRemovedSubscription = this.eventAggregator.subscribe(MarkerRemoved, e => {
      this.removeMarker(e.marker);
    });
  }

  detached() {
    this.markerAddedSubscription.dispose();
    this.markerAddedSubscription = null;
    this.markerRemovedSubscription.dispose();
    this.markerRemovedSubscription = null;
    
    this.destroyMarker();
  }

  unbind() {
  }
  
  createClusterer() {
    return new MarkerClusterer(this.map, [], {
      ignoreHidden: this.ignoreHidden,
      gridSize: this.gridSize,
      maxZoom: this.maxZoom,
      styles: this.styles,
      calculator: this.calculator
    });
  }
  
  addMarker(marker) {
    this.clusterer.addMarker(marker);
    //TODO register subscription for specific marker
    this.eventListeners.listen(marker, 'visible_changed', () => {
      if (!this.needsRepaint) {
        this.needsRepaint = true;
        this.taskQueue.queueMicroTask(() => {
          this.clusterer.repaint();
          this.needsRepaint = false;
        });
      }
    });
  }
  
  removeMarker(marker) {
    //TODO unregister subscription for specific marker on 'visible_changed'
    this.clusterer.removeMarker(marker);
  }
}