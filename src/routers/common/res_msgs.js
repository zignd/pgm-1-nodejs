'use strict';

module.exports = {
    UnexpectedError: {
        code: 'UnexpectedError',
        message: 'An unexpected error occurred.',
    },
    PokemonNotRegistered: 'PokemonNotRegistered',
    NotEnoughInStock: 'NotEnoughInStock',
    PurchaseCompleted: {
        code: 'PurchaseCompleted',
        message: 'Purchase completed.'
    },
    PurchaseRefused: {
        code: 'PurchaseRefused',
        message: 'Purchase refused. Check the provided credit card informations.'
    },
    ValidationError: {
        code: 'ValidationError',
        message: 'Invalid arguments were provided. Check the details property for more information.'
    }
};