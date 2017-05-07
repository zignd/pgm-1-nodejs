'use strict';

const Sequelize = require('sequelize');

const sequelize = new Sequelize('pokemons', null, null, {
	dialect: 'sqlite'
});

const Pokemon = sequelize.define('pokemon', {
	name: {
		type: Sequelize.STRING,
		allowNull: false,
		unique: true
	},
	price: {
		type: Sequelize.INTEGER,
		allowNull: false
	},
	stock: {
		type: Sequelize.INTEGER,
		allowNull: true,
		defaultValue: 1
	}
});

module.exports = Pokemon;