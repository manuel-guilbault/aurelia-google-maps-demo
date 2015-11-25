import 'bootstrap';

export function configure(aurelia) {
  aurelia.use
    .standardConfiguration()
    .developmentLogging()
    .feature('maps');

  aurelia.start().then(a => a.setRoot());
}
