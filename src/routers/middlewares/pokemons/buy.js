'use strict';

const config = require('../../../services/config');

const express = require('express');
const request = require('request-promise');
const VError = require('verror');

const Pokemon = require('../../../models/pokemon');

const resMsgs = require('../../common/res_msgs');

async function handler(req, res) {
    try {
        const pokemon = await Pokemon.findOne({
            where: {
                name: req.params.name
            }
        });
        if (!pokemon) {
            return res.status(400).send({
                code: resMsgs.PokemonNotRegistered,
                message: `No ${req.params.name} in stock.`
            });
        }
        if (pokemon.stock < req.body.quantity) {
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
                amount: pokemon.price * req.body.quantity * 100,
                card_number: req.body.card_number,
                card_expiration_date: req.body.card_expiration_date,
                card_holder_name: req.body.card_holder_name,
                card_cvv: req.body.card_cvv,
                metadata: {
                    product: 'pokemon',
                    name: pokemon.name,
                    quantity: req.body.quantity
                }
            }
        };
        const body = await request(options);

        if (body.status === 'paid') {
            pokemon.stock -= req.body.quantity;
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
        res.status(500).send({
            code: resMsgs.UnexpectedError.code,
            message: resMsgs.UnexpectedError.message
        });
    }
}

module.exports = handler;