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

function compileContent(container) {
  var element = container.get(Element);
  var compiler = container.get(ViewCompiler);
  var resources = container.get(ViewResources);

  var content = transferChildren(element, document.createDocumentFragment());
  return compiler.compile(content, resources);
}

var infoWindow = new google.maps.InfoWindow({ content: '' });


@customElement('info-window')
@noView()
@processContent(false)
@inject(Container)
export class InfoWindow {
  constructor(container) {
    this.container = container;
    this.contentFactory = compileContent(container);
    this.contentView = null;
    this.content = null;
    this.eventListeners = new EventListeners();
  }

  get map() {
    return this.container.get(google.maps.Map);
  }

  get marker() {
    if (this.container.hasResolver(google.maps.Marker, true)) {
      return this.container.get(google.maps.Marker);
    }
    if (this.container.hasResolver('info-window-anchor', true)) {
      return this.container.get('info-window-anchor');
    }
    throw new Error('');
  }

  bind(bindingContext, overrideContext) {
    this.contentView = this.contentFactory.create(this.container.createChild());
    this.contentView.created();
    this.contentView.bind(bindingContext, overrideContext);
  }

  attached() {
    this.content = transferChildren(this.contentView.fragment, document.createElement('div'));
    this.eventListeners.listen(this.marker, 'click', () => {
      infoWindow.setContent(this.content);
      infoWindow.open(this.map, this.marker);
    });
    this.contentView.attached();
  }

  detached() {
    infoWindow.close();
    this.eventListeners.disposeAll();
    this.contentView.detached();
  }

  unbind() {
    this.contentView.unbind()
    this.contentView = null;
  }
}
