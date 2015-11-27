import {
  inject, 
  customElement, 
  noView,
  processContent,
  bindable, 
  bindingMode, 
  Container,
  ViewCompiler,
  ViewResources
} from 'aurelia-framework';
import {EventListeners} from './event-listeners';

function transferChildren(from, to) {
  var currentChild = from.firstChild,
      nextSibling;
  while (currentChild) {
    nextSibling = currentChild.nextSibling;
    to.appendChild(currentChild);
    currentChild = nextSibling;
  }
  return to;
}

function compileContent(element, compiler, resources) {
  var content = transferChildren(element, document.createDocumentFragment());
  return compiler.compile(content, resources);
}

var currentViewController = {
  currentView: null,
  
  attachView: function(view) {
    currentViewController.currentView = view;
    currentViewController.currentView.attached();
  },
  
  detachCurrentView: function() {
    if (this.currentView) {
      this.currentView.detached();
      this.currentView = null;
    }
  }
};

var infoWindow = new google.maps.InfoWindow({ content: '' });
google.maps.event.addListener(infoWindow, 'closeclick', currentViewController.detachCurrentView);

@customElement('info-window')
@noView()
@processContent(false)
@inject(Element, ViewCompiler, ViewResources, Container)
export class InfoWindow {
  constructor(element, compiler, resources, container) {
    this.contentFactory = compileContent(element, compiler, resources);
    this.container = container;
    this.contentView = null;
    this.content = null;
    this.eventListeners = new EventListeners();
  }

  get map() {
    if (this.container.hasResolver(google.maps.Map, true)) {
      return this.container.get(google.maps.Map);
    }
    throw new Error('inf-window elements must be placed inside a map element');
  }

  get marker() {
    if (this.container.hasResolver(google.maps.Marker, true)) {
      return this.container.get(google.maps.Marker);
    }
    throw new Error('inf-window elements must be placed inside a marker element');
  }

  bind(bindingContext, overrideContext) {
    this.contentView = this.contentFactory.create(this.container.createChild());
    this.contentView.created();
    this.contentView.bind(bindingContext, overrideContext);
  }

  attached() {
    this.content = transferChildren(this.contentView.fragment, document.createElement('div'));
    this.eventListeners.listen(this.marker, 'click', () => {
      currentViewController.detachCurrentView();
      infoWindow.setContent(this.content);
      currentViewController.attachView(this.contentView);
      infoWindow.open(this.map, this.marker);
    });
  }

  detached() {
    infoWindow.close();
    currentViewController.detachCurrentView();
    this.eventListeners.disposeAll();
  }

  unbind() {
    this.contentView.unbind()
    this.contentView = null;
  }
}
