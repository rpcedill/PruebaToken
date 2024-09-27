const { Sequelize } = require('sequelize');


//taba, usuario, contraseña
const sequelize = new Sequelize('taba', 'usuario', 'contraseña', {
    host: 'localhost', // dirección del servidor
    dialect: 'mysql',
    logging: false, 
});

const conectarBD = async () => {
    try {
        await sequelize.authenticate();
        console.log('Conexión a la base de datos establecida con éxito.');
    } catch (error) {
        console.error('No se pudo conectar a la base de datos:', error);
    }
};

conectarBD();

module.exports = sequelize;