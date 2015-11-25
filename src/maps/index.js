export {Map} from './map';
export {Marker} from './marker';
export {InfoWindow} from './info-window';
export {LatLngValueConverter} from './lat-lng-value-converter';
export {LatLngBoundsValueConverter} from './lat-lng-bounds-value-converter';

export function configure(config) {
    config.globalResources(
        './map',
        './marker',
        './info-window',
        './lat-lng-value-converter',
        './lat-lng-bounds-value-converter'
    );
};
