const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.js');
const Usuario = require('./Usuario.js');

const Token = sequelize.define('Token', {
    valor: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    expiracion: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    usuarioId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Usuarios', 
            key: 'id'
        }
    },
    estado: {
        type: DataTypes.ENUM("USADO","SIN USAR"),
        defaultValue: "SIN USAR",
    },
    fechaUso: {
        type: DataTypes.DATE,
        defaultValue: null,
    }
});
Token.belongsTo(Usuario, { foreignKey: 'usuarioId' });

module.exports = Token;