export class EventListeners {
  constructor() {
    this.registrations = [];
  }

  listen(instance, eventName, listener) {
    var registration = google.maps.event.addListener(instance, eventName, listener);
    this.registrations.push(registration);
    return registration;
  }

  dispose(registration) {
    var index = this.registrations.indexOf(registration);
    if (index < 0) {
      return false;
    }

    google.maps.event.removeListener(this.registrations[index]);
    this.registration.splice(index, 1);
    return true;
  }

  disposeAll() {
    for (var i = 0; i < this.registrations.length; ++i) {
      google.maps.event.removeListener(this.registrations[i]);
    }
    this.registrations = [];
  }
}
