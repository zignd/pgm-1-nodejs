'use strict';

const VError = require('verror');

const Pokemon = require('../../../models/pokemon');

async function handler(req, res) {
    try {
        // TODO: validate the req.body using joi maybe
        let pokemon = await Pokemon.findOne({
            where: {
                name: req.params.name
            }
        });

        if (pokemon) {
            pokemon.price = req.params.price;
            pokemon.stock = req.params.stock;
            await pokemon.save();
        } else {
            pokemon = await Pokemon.create({
                name: req.params.name,
                price: req.params.price,
                stock: req.params.stock
            });
        }

        res.send(pokemon);
    } catch (err) {
        log.error(new VError({
            cause: err,
            info: {
                request: req
            }
        }, 'failed to create a new Pokémon'));
        res.status(500).send({
            message: 'An unexpected error occurred.'
        });
    }
}

module.exports = handler;