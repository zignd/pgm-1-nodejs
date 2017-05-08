'use strict';

const Joi = require('joi');
const VError = require('verror');

const resMsgs = require('../../common/res_msgs');

const Pokemon = require('../../../models/pokemon');

const pokemonSchema = Joi.object().keys({
    name: Joi.string().required(),
    price: Joi.number().positive().required(),
    stock: Joi.number().integer().positive().required()
});

async function validation(req, res, next) {
    const pokemon = {
        name: req.params.name,
        price: req.params.price,
        stock: req.params.stock
    };
    Joi.validate(pokemon, pokemonSchema, { abortEarly: false }, (err) => {
        if (err) {
            err = {
                code: resMsgs.ValidationError.code,
                message: resMsgs.ValidationError.message,
                details: err.details
            };

            return res.status(400).send(err);
        }

        req.pokemon = pokemon;
        return next();
    });
}

async function handler(req, res) {
    try {
        let pokemon = await Pokemon.findOne({
            where: {
                name: req.pokemon.name
            }
        });

        if (pokemon) {
            pokemon.price = req.pokemon.price;
            pokemon.stock = req.pokemon.stock;
            await pokemon.save();
        } else {
            pokemon = await Pokemon.create({
                name: req.pokemon.name,
                price: req.pokemon.price,
                stock: req.pokemon.stock
            });
        }

        res.send(pokemon);
    } catch (err) {
        log.error(new VError({
            cause: err,
            info: {
                request: req
            }
        }, 'failed to create/update a Pokémon'));
        res.status(500).send({
            message: 'An unexpected error occurred.'
        });
    }
}

module.exports = [validation, handler];