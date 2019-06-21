const restify = window.require('restify');
const download = window.require('download');
const fs = window.require('fs');
const low = window.require('lowdb');
const FileSync = window.require('lowdb/adapters/FileSync');

export class modHandler {
  constructor() {
    this.adapter = new FileSync('src/config.json');
    this.db = low(this.adapter);

    this.destination = 'src/cache';

    this.endpoints = {
      download: '/api/download',
      endpoints: '/api/endpoints',
      install: '/api/install/',
      update: '/api/update'
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
    this.server.get(this.endpoints.endpoints, (req, res, next) => {
      res.send(this.endpoints);
      return next();
    });

    // Downloads a mod
    this.server.get(this.endpoints.download, (req, res, next) => {
      if (!req.query.url || !req.query.name) {
        res.send('Incorrect download parameter. URL and Name expected.');
      } else {
        download(req.query.url).then((data) => {
          if (!fs.existsSync(this.destination)) {
            fs.mkdirSync(this.destination);
          }
          fs.writeFileSync(`${this.destination}/${req.query.name}`, data);
          res.send(`Finished downloading ${req.query.name}.`);
        });
      }
      return next();
    });

    // Updates a value in config.json
    this.server.get(this.endpoints.update, (req, res, next) => {
      if (!req.query.key || !req.query.value) {
        res.send(
          'ERROR: Incorrect or insufficient parameters. Config key and value expected.'
        );
      } else {
        this.db.set(req.query.key, req.query.value).write();
        res.send(`Success: set >${req.query.key}< to >${req.query.value}<`);
      }
      return next();
    });
  };
}
