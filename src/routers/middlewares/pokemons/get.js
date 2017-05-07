'use strict';

const VError = require('verror');

const Pokemon = require('../../../models/pokemon');

async function handler(req, res) {
    try {
        const pokemons = await Pokemon.findAll();
        res.send(pokemons);
    } catch (err) {
        log.error(new VError({
            cause: err,
            info: {
                request: req
            }
        }, 'failed to get the Pokémons'));
        res.status(500).send({
            message: 'An unexpected error occurred.'
        });
    }
}

module.exports = handler;