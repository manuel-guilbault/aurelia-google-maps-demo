export class App {
  configureRouter(config, router) {
    config.title = 'Aurelia';
    config.map([
      { route: ['', 'test-map'], name: 'test-map',      moduleId: 'test-map',      nav: true, title: 'Test Map' }
    ]);

    this.router = router;
  }
}
