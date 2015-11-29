import {MarkerClusterer} from 'googlemaps/js-marker-clusterer';
import {
  inject, 
  inlineView, 
  bindable, 
  bindingMode,
  TaskQueue,
  Container
} from 'aurelia-framework';
import {MarkerContainer} from './marker-container';
import {EventListeners} from './event-listeners';

@inlineView('<template><div><content></content></div></template>')
@inject(TaskQueue, google.maps.Map, MarkerContainer, Container)
export class MarkerClustererCustomElement {
  
  @bindable({ defaultBindingMode: bindingMode.oneTime }) ignoreHidden = true;
  @bindable gridSize = 60;
  @bindable maxZoom = null;
  @bindable styles = [];
  @bindable({ defaultBindingMode: bindingMode.oneTime }) calculator;
  
  constructor(taskQueue, map, markerContainer, container) {
    this.taskQueue = taskQueue;
    this.container = container;
    
    this.eventListeners = new EventListeners();
    this.visibleChangedSubscriptionByMarker = new Map();
    
    this.clusterer = this.createClusterer(map);
    
    container.registerInstance(
      MarkerContainer, 
      new MarkerContainerDecorator(markerContainer, this)
    );
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
  
  createClusterer(map) {
    return new MarkerClusterer(map, [], {
      ignoreHidden: this.ignoreHidden,
      gridSize: this.gridSize,
      maxZoom: this.maxZoom,
      styles: this.styles,
      calculator: this.calculator
    });
  }
  
  addMarker(marker) {
    this.clusterer.addMarker(marker);
    let subscription = this.eventListeners.listen(marker, 'visible_changed', () => {
      if (!this.needsRepaint) {
        this.needsRepaint = true;
        this.taskQueue.queueMicroTask(() => {
          this.clusterer.repaint();
          this.needsRepaint = false;
        });
      }
    });
    this.visibleChangedSubscriptionByMarker.set(marker, subscription);
  }
  
  removeMarker(marker) {
    let subscription = this.visibleChangedSubscriptionByMarker.get(marker);
    this.eventListeners.dispose(subscription);
    this.clusterer.removeMarker(marker);
  }
}

class MarkerContainerDecorator extends MarkerContainer {
  
  constructor(decorated, clusterer) {
    super();
    this.decorated = decorated;
    this.clusterer = clusterer;
  }
  
  addMarker(marker) {
    this.decorated.addMarker(marker);
    this.clusterer.addMarker(marker);
  }
  
  removeMarker(marker) {
    this.clusterer.removeMarker(marker);
    this.decorated.removeMarker(marker);
  }
}