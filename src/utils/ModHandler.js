const app = window.require('electron').remote.app;
const decompress = window.require('decompress-zip');
const download = window.require('download');
const FileSync = window.require('lowdb/adapters/FileSync');
const fs = window.require('fs');
const low = window.require('lowdb');
const restify = window.require('restify');
const rp = window.require('request-promise');

export class ModHandler {
    constructor() {
        this.adapter = new FileSync('src/utils/data/settings.json');
        this.db = low(this.adapter);

        this.destination = 'src/cache';

        this.endpoints = {
            download: '/api/download',
            endpoints: '/api/endpoints',
            extract: '/api/extract',
            fetchMods: '/api/fetchMods',
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
            console.log({
                action: 'GET',
                params: { ...req.query },
                path: '/'
            });
            res.send(`How'd you wind up here? Try /api/endpoints to see all available endpoints.`);
            return next();
        });

        // Lists all available endpoints
        this.server.get(this.endpoints.endpoints, (req, res, next) => {
            console.log({
                action: 'GET',
                params: { ...req.query },
                path: this.endpoints.endpoints
            });
            res.send(this.endpoints);
            return next();
        });

        // Downloads a mod
        this.server.get(this.endpoints.download, (req, res, next) => {
            console.log({
                action: 'GET',
                params: { ...req.query },
                path: this.endpoints.download
            });

            const expectedParams = [
                'author',
                'deprecated',
                'description',
                'destination',
                'downloadURL',
                'folderName',
                'iconURL',
                'latestVersion',
                'name',
                'version',
                'webURL'
            ];

            if (!this.validParams(expectedParams, req.query)) {
                console.error(
                    `Incorrect parameter(s).\nExpected: ${expectedParams}.\nActual: ${Object.keys(
                        req.query
                    )}`
                );
                res.send(
                    `Incorrect parameter(s).\nExpected: ${expectedParams}.\nActual: ${Object.keys(
                        req.query
                    )}`
                );
            } else {
                download(req.query.downloadURL).then((data) => {
                    if (!fs.existsSync(this.destination)) {
                        fs.mkdirSync(this.destination);
                    }
                    fs.writeFileSync(`${this.destination}/${req.query.folderName}.zip`, data);
                    res.send(`Finished downloading ${req.query.name}.`);
                });
            }
            return next();
        });

        // Updates values in settings.json
        this.server.get(this.endpoints.update, (req, res, next) => {
            console.log({
                action: 'GET',
                params: { ...req.query },
                path: this.endpoints.update
            });
            for (const key in req.query) {
                this.db.set(key, req.query[key]).write();
                localStorage.setItem(key, req.query[key]);
            }
            res.send('Done');
            return next();
        });

        // Extracts a zip file to a designated directory
        this.server.get(this.endpoints.extract, (req, res, next) => {
            console.log({
                action: 'GET',
                params: { ...req.query },
                path: this.endpoints.extract
            });

            const expectedParams = [
                'author',
                'deprecated',
                'description',
                'destination',
                'downloadURL',
                'folderName',
                'iconURL',
                'latestVersion',
                'name',
                'version',
                'webURL'
            ];

            if (!this.validParams(expectedParams, req.query)) {
                console.error(
                    `Incorrect parameter(s).\nExpected: ${expectedParams}.\nActual: ${Object.keys(
                        req.query
                    )}`
                );
                res.send(
                    `Incorrect parameter(s).\nExpected: ${expectedParams}.\nActual: ${Object.keys(
                        req.query
                    )}`
                );
            } else {
                const unZipper = new decompress(
                    `${app.getAppPath()}\\src\\cache\\${req.query.folderName}.zip`
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
                            ...req.query
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

        // fetches mods from thunderstore.io
        this.server.get(this.endpoints.fetchMods, (req, res, next) => {
            console.log({
                action: 'GET',
                params: { ...req.query },
                path: this.endpoints.fetchMods
            });
            rp('https://thunderstore.io/api/v1/package/')
                .then((html) => {
                    res.send(JSON.parse(html));
                })
                .catch((error) => {
                    alert(error);
                });
            return next();
        });
    };

    validParams = (expected, actual) => {
        let validParams = true;
        expected.forEach((param) => {
            if (!Object.keys(actual).includes(param)) {
                validParams = false;
            }
        });
        return validParams;
    };
}
