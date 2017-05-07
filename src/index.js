'use strict';

const config = require('./services/config');

const bodyParser = require('body-parser');
const bunyan = require('bunyan');
const express = require('express');

const pokemonsRouter = require('./routers/pokemons');
// const getPokemonsRouter = require('./routers/get_pokemons');
// const createPokemonsRouter = require('./routers/create_pokemons');
// const buyPokemonsRouter = require('./routers/buy_pokemons');

const sequelizeHelper = require('./services/sequelize_helper');

global.log = bunyan.createLogger({ name: config.get('app_name') });

async function init() {
    await sequelizeHelper.syncModels();

    const app = express();
    app.use(bodyParser.urlencoded());
    app.use(bodyParser.json());

    app.use('/pokemons', pokemonsRouter);
    // app.use('/get-pokemons', getPokemonsRouter);
    // app.use('/create-pokemons', createPokemonsRouter);
    // app.use('/buy-pokemons', buyPokemonsRouter);

    app.listen(config.get('server_port'), function () {
        log.info('listening on http://localhost:' + config.get('server_port'));
    });
}

init().catch(err => {
    log.fatal(err);
});

