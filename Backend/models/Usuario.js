const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.js'); 

const Usuario = sequelize.define('Usuario', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    }
});

module.exports = Usuario;