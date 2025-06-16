const jwt = require('jsonwebtoken');
require('dotenv').config(); // Para acessar process.env.JWT_SECRET

const authMiddleware = (req, res, next) => {
    // Obter o token do cabeçalho da requisição
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: 'Autenticação necessária: Token não fornecido.' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Autenticação necessária: Token inválido.' });
    }

    try {
        // Verificar e decodificar o token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Anexar o ID do usuário ao objeto 'req'
        // para que os controladores possam acessá-los
        req.userId = decoded.id;
        req.userEmail = decoded.email;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expirado. Por favor, faça login novamente.' });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Token inválido ou malformado.' });
        }
        console.error('Erro na validação do token:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao autenticar.' });
    }
};

module.exports = authMiddleware;
