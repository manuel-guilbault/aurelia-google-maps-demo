export class LatLngValueConverter {

  constructor() {
    this.parseExpression = '(\d+(?:\.\d+)?),(\d+(?:\.\d+)?)';
    this.parser = new RegExp('^' + this.parseExpression + '$');
  }

  toView(value, precision) {
    if (!value) {
      return '';
    }

    var lat = value.lat(),
        lng = value.lng();
    if (precision !== undefined) {
      lat = lat.toFixed(precision);
      lng = lng.toFixed(precision);
    }
    return lat + ',' + lng;
  }

  fromView(value) {
    var matches = this.parser.exec(value);
    if (matches === null) {
      //TODO log message?
      return null;
    }

    var lat = parseFloat(matches[1]),
        lng = parseFloat(matches[2]);

    return new google.maps.LatLng(lat, lng);
  }
}