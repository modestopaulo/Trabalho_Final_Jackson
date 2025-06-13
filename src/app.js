const express = require('express');
const app = express();


app.use(express.json()); // Permite que o Express leia JSON no corpo das requisições

// Importar e usar as rotas
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const orderRoutes = require('./routes/orderRoutes'); // Corrigido nome do arquivo

app.use('/api/auth', authRoutes); // Rotas de autenticação (login, registro)
app.use('/api/users', userRoutes); // Rotas de gerenciamento de usuários (perfil)
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req, res) => {
    res.send('API RESTful em Node.js com Sequelize');
});
// Middleware para tratamento de erros 
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo deu errado!');
});

module.exports = app;