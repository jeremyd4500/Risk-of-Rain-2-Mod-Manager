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

        const settings = fs.readFileSync('src/utils/data/settings.json');
        const json = JSON.parse(settings);
        console.log('Updating localStorage with the current values in settings.json');
        Object.keys(json).forEach((key) => {
            if (key === 'installedMods') {
                localStorage.setItem(key, JSON.stringify(json[key]));
            } else {
                localStorage.setItem(key, json[key]);
            }
        });
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
                this.db.set(req.query.key, req.query.value).write();
                localStorage.setItem(req.query.key, req.query.value);
                console.log(
                    `Updated ${req.query.key} to ${
                        req.query.value
                    } in localStorage and settings.json`
                );
                res.send(`Success: set >${req.query.key}< to >${req.query.value}<`);
            }
            return next();
        });

        // Updates a value in settings.json
        this.server.get(this.endpoints.updateMultiple, (req, res, next) => {
            for (const key in req.query) {
                this.db.set(key, req.query[key]).write();
                localStorage.setItem(key, req.query[key]);
                console.log(
                    `Updated ${key} to ${req.query[key]} in localStorage and settings.json`
                );
            }
            res.send('Done');
            return next();
        });

        // Extracts a zip file to a designated directory
        this.server.get(this.endpoints.extract, (req, res, next) => {
            if (
                !req.query.name ||
                !req.query.destination ||
                !req.query.iconURL ||
                !req.query.version
            ) {
                res.send(
                    'ERROR: Incorrect or insufficient parameters. name, destination, iconURL, and version expected.'
                );
            } else {
                const unZipper = new decompress(
                    `${app.getAppPath()}\\src\\cache\\${req.query.name}.zip`
                );

                unZipper.on('error', (err) => {
                    res.send(`ERROR: ${err}`);
                });

                unZipper.on('extract', () => {
                    res.send(`Finished extracting ${req.query.name}.`);
                });

                unZipper.extract({
                    path: req.query.destination
                });

                let newMod = true;
                const installedMods = this.db.get('installedMods').value();
                installedMods.forEach((mod) => {
                    if (mod.name === req.query.name) {
                        newMod = false;
                    }
                });

                if (newMod) {
                    this.db
                        .get('installedMods')
                        .push({
                            iconURL: req.query.iconURL,
                            name: req.query.name,
                            version: req.query.version
                        })
                        .write();
                    localStorage.setItem(
                        'installedMods',
                        JSON.stringify(this.db.get('installedMods').value())
                    );
                }
            }
            return next();
        });
    };
}
