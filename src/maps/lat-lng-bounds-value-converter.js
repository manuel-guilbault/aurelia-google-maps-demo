import {LatLngValueConverter} from './lat-lng-value-converter';

var latLngConverter = new LatLngValueConverter();

export class LatLngBoundsValueConverter {
  constructor() {
    this.parseExpression = latLngConverter.parseExpression
      + ';' + latLngConverter.parseExpression;
    this.parser = new RegExp('^' + this.parseExpression + '$');
  }

  toView(value, precision) {
    if (!value) {
      return '';
    }

    return latLngConverter.toView(value.getNorthEast(), precision)
        + '; ' + latLngConverter.toView(value.getSouthWest(), precision);
  }

  fromView(value) {
    var matches = this.parser.exec(value);
    if (matches === null) {
      //TODO log message?
      return null;
    }

    var neLat = parseFloat(matches[1]),
        neLng = parseFloat(matches[2]),
        swLat = parseFloat(matches[3]),
        swLng = parseFloat(matches[4]);

    return new google.maps.LatLngBounds(
        new google.maps.LatLng(neLat, neLng),
        new google.maps.LatLng(swLat, swLng)
    );
  }
}