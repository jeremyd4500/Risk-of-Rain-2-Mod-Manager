const app = window.require('electron').remote.app;
const decompress = window.require('decompress-zip');
const download = window.require('download');
const FileSync = window.require('lowdb/adapters/FileSync');
const fs = window.require('fs');
const low = window.require('lowdb');
const restify = window.require('restify');

export class ModHandler {
    constructor() {
        this.adapter = new FileSync('src/utils/data/settings.json');
        this.db = low(this.adapter);

        this.destination = 'src/cache';

        this.endpoints = {
            download: '/api/download',
            endpoints: '/api/endpoints',
            extract: '/api/extract',
            install: '/api/install/',
            update: '/api/update',
            updateMultiple: '/api/updateMultiple'
        };

        this.server = restify.createServer({
            name: 'Mod Handler',
            version: '1.0.0'
        });
    }

    init = () => {
        this.server.use(restify.plugins.acceptParser(this.server.acceptable));
        this.server.use(restify.plugins.bodyParser());
        this.server.use(restify.plugins.queryParser());
    };

    start = () => {
        this.init();

        this.server.listen(9001, () => {
            console.log(`${this.server.name} listening at ${this.server.url}`);
        });

        this.server.get('/', (req, res, next) => {
            res.send(`How'd you wind up here? Try /api/endpoints to see all available endpoints.`);
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
                    fs.writeFileSync(`${this.destination}/${req.query.name}.zip`, data);
                    res.send(`Finished downloading ${req.query.name}.`);
                });
            }
            return next();
        });

        // Updates a value in settings.json
        this.server.get(this.endpoints.update, (req, res, next) => {
            if (!req.query.key || !req.query.value) {
                res.send(
                    'ERROR: Incorrect or insufficient parameters. Config key and value expected.'
                );
            } else {
                let value;
                if (req.query.value === 'true') {
                    value = true;
                } else if (req.query.value === 'false') {
                    value = false;
                } else {
                    value = req.query.value;
                }
                this.db.set(req.query.key, value).write();
                res.send(`Success: set >${req.query.key}< to >${req.query.value}<`);
            }
            return next();
        });

        // Updates a value in settings.json
        this.server.get(this.endpoints.updateMultiple, (req, res, next) => {
            for (const key in req.query) {
                let value;
                if (req.query[key] === 'true') {
                    value = true;
                } else if (req.query[key] === 'false') {
                    value = false;
                } else {
                    value = req.query[key];
                }
                this.db.set(key, value).write();
            }
            res.send('Done');
            return next();
        });

        // Extracts a zip file to a designated directory
        this.server.get(this.endpoints.extract, (req, res, next) => {
            if (!req.query.name || !req.query.destination) {
                res.send(
                    'ERROR: Incorrect or insufficient parameters. name and destination expected.'
                );
            } else {
                const unzipper = new decompress(
                    `${app.getAppPath()}\\src\\cache\\${req.query.name}.zip`
                );
                unzipper.on('error', (err) => {
                    res.send(`ERROR: ${err}`);
                });
                unzipper.on('extract', () => {
                    res.send(`Finished extracting ${req.query.name}`);
                });
                unzipper.extract({
                    path: req.query.destination
                });
            }
            return next();
        });
    };
}
