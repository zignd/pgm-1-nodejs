'use strict';

const config = require('../../../services/config');

const Joi = require('joi');
const request = require('request-promise');
const VError = require('verror');

const Pokemon = require('../../../models/pokemon');

const resMsgs = require('../../common/res_msgs');

const purchaseSchema = Joi.object().keys({
    name: Joi.string().required(),
    quantity: Joi.number().integer().positive().required(),
    card_number: Joi.string().required(),
    card_expiration_date: Joi.string().required(),
    card_holder_name: Joi.string().required(),
    card_cvv: Joi.string().required()
});

function validation(req, res, next) {
    const purchase = {
        name: req.params.name,
        quantity: req.body.quantity,
        card_number: req.body.card_number,
        card_expiration_date: req.body.card_expiration_date,
        card_holder_name: req.body.card_holder_name,
        card_cvv: req.body.card_cvv
    };

    const result = Joi.validate(purchase, purchaseSchema, { abortEarly: false });
    if (result.error) {
        return res.status(400).send({
            code: resMsgs.ValidationError.code,
            message: resMsgs.ValidationError.message,
            details: result.error.details
        });
    }

    req.purchase = purchase;
    return next();
}

async function handler(req, res) {
    try {
        const pokemon = await Pokemon.findOne({
            where: {
                name: req.purchase.name
            }
        });
        if (!pokemon) {
            return res.status(400).send({
                code: resMsgs.PokemonNotRegistered,
                message: `No ${req.purchase.name} in stock.`
            });
        }
        if (pokemon.stock < req.purchase.quantity) {
            return res.status(400).send({
                code: resMsgs.NotEnoughInStock,
                message: `Not enough ${pokemon.name} in stock: ${pokemon.stock}`
            });
        }

        const options = {
            uri: 'https://api.pagar.me/1/transactions',
            method: 'POST',
            json: {
                api_key: config.get('pagar_me_api_key'),
                amount: pokemon.price * req.purchase.quantity * 100,
                card_number: req.purchase.card_number,
                card_expiration_date: req.purchase.card_expiration_date,
                card_holder_name: req.purchase.card_holder_name,
                card_cvv: req.purchase.card_cvv,
                metadata: {
                    product: 'pokemon',
                    name: pokemon.name,
                    quantity: req.purchase.quantity
                }
            }
        };
        const body = await request(options);

        if (body.status === 'paid') {
            pokemon.stock -= req.purchase.quantity;
            await pokemon.save();
            return res.send({
                code: resMsgs.PurchaseCompleted.code,
                message: resMsgs.PurchaseCompleted.message,
            });
        } else if (body.status === 'refused') {
            return res.status(400).send({
                code: resMsgs.PurchaseRefused.code,
                message: resMsgs.PurchaseRefused.message
            });
        } else {
            throw new VError({
                info: {
                    request: options
                }
            }, 'unexpected response from the API');
        }
    } catch (err) {
        log.error(new VError({
            cause: err,
            info: {
                request: req
            }
        }, 'failed to conclude the purchase'));
        return res.status(500).send({
            code: resMsgs.UnexpectedError.code,
            message: resMsgs.UnexpectedError.message
        });
    }
}

module.exports = [validation, handler];