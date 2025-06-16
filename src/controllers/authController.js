const db = require('../config/database'); // Importa os modelos e a instância sequelize
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = db.User; // Acessa o modelo User

// Controlador para o registro de usuário
exports.register = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // 1. Verificar se o usuário já existe
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ message: 'Email já cadastrado.' });
        }

        // 2. Hash da senha
        const hashedPassword = await bcrypt.hash(password, 10); // 10 é o salt rounds

        // 3. Criar o novo usuário no banco de dados
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
        });
        
        const token = jwt.sign({ id: newUser.id, email: newUser.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({
            message: 'Usuário registrado com sucesso!',
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
            },
            token,
        });

    } catch (error) {
        console.error('Erro ao registrar usuário:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao registrar usuário.' });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Encontrar o usuário pelo email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        // 2. Comparar a senha fornecida com o hash armazenado
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Senha incorreta.' });
        }

        // 3. Gerar um token JWT
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            message: 'Login realizado com sucesso!',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                telefone: user.telefone
            },
            token,
        });

    } catch (error) {
        console.error('Erro ao fazer login:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao fazer login.' });
    }
};
