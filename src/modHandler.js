const restify = window.require('restify');
const download = window.require('download');
const fs = window.require('fs');

export class modHandler {
  constructor() {
    this.destination = 'src/cache';

    this.endpoints = {
      download: '/api/download',
      install: '/api/install/:package',
      loadConfig: '/api/loadConfig/'
    };

    this.server = restify.createServer({
      name: 'Mod Handler',
      version: '1.0.0'
    });
  }

  init = () => {
    this.server.use(restify.plugins.acceptParser(this.server.acceptable));
    this.server.use(restify.plugins.queryParser());
    this.server.use(restify.plugins.bodyParser());
  };

  start = () => {
    this.init();

    this.server.listen(9001, () => {
      console.log(`${this.server.name} listening at ${this.server.url}`);
    });

    this.server.get('/', (req, res, next) => {
      res.send(
        `How'd you wind up here? Try /endpoints to see all available endpoints.`
      );
      return next();
    });

    // Lists all available endpoints
    this.server.get('/endpoints', (req, res, next) => {
      res.send(this.endpoints);
      return next();
    });

    // Downloads a mod
    this.server.get(this.endpoints.download, (req, res, next) => {
      if (!req.query.url || !req.query.name) {
        res.send('Incorrect download parameter. URL and Name Expected.');
      } else {
        download(req.query.url).then((data) => {
          if (!fs.existsSync(this.destination)) {
            fs.mkdirSync(this.destination);
          }
          fs.writeFileSync(`${this.destination}/${req.query.name}`, data);
          res.send(`Finished downloading ${req.query.name}.`);
        });
        return next();
      }
    });
  };
}
