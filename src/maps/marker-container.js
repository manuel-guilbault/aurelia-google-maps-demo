export class MarkerContainer {
  addMarker(marker) {
    throw new Error('MarkerContainer subclasses must implement addMarker');
  }
  
  removeMarker(marker) {
    throw new Error('MarkerContainer subclasses must implement removeMarker');
  }
}
