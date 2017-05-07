'use strict';

const express = require('express');

const buy = require('./middlewares/pokemons/buy');
const get = require('./middlewares/pokemons/get');
const put = require('./middlewares/pokemons/put');

const router = express.Router();

router.post('/name/:name/buy', buy);
router.get('/', get);
router.put('/name/:name/price/:price/stock/:stock', put);

module.exports = router;