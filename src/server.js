require('dotenv').config();
const app = require('./app');
const db = require('./config/database'); 

const PORT = process.env.PORT || 3000;

db.sequelize.authenticate()
    .then(() => {
        console.log('Conexão com o banco de dados estabelecida com sucesso!');
        return db.sequelize.sync({ alter: true }); 
    })
    .then(() => {
        console.log('Modelos sincronizados com o banco de dados!');
        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Erro ao conectar ou sincronizar com o banco de dados:', error);
        process.exit(1); 
    });