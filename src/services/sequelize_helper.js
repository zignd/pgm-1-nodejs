'use strict';

const Pokemon = require('../models/pokemon');

async function syncModels() {
    await Pokemon.sync({ force: true });
}

module.exports = {
    syncModels
};