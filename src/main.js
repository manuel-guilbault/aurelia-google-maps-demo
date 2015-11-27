import 'bootstrap';

export function configure(aurelia) {
  aurelia.use
    .standardConfiguration()
    .developmentLogging()
    .plugin('aurelia-validation')
    .plugin('aurelia-dialog')
    .feature('maps')
    .feature('places');

  aurelia.start().then(a => a.setRoot());
}
