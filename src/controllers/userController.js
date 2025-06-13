const db = require('../config/database');
const bcrypt = require('bcryptjs');

const User = db.User;

// Controlador para obter o perfil do usuário autenticado
exports.getProfile = async (req, res) => {
    try {
        // O ID do usuário vem do middleware de autenticação (req.userId)
        const user = await User.findByPk(req.userId, {
            attributes: ['id', 'name', 'email'], // Excluir a senha
        });

        if (!user) {
            return res.status(404).json({ message: 'Perfil de usuário não encontrado.' });
        }

        res.status(200).json({
            id: user.id,
            name: user.name,
            email: user.email
        });
    } catch (error) {
        console.error('Erro ao obter perfil:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao obter perfil.' });
    }
};

// Controlador para atualizar o perfil do usuário autenticado
exports.updateProfile = async (req, res) => {
    const { name, email, password } = req.body; // A senha pode ser opcionalmente atualizada

    try {
        const user = await User.findByPk(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        // Se o email foi fornecido e é diferente, verificar se já existe
        if (email && email !== user.email) {
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser && existingUser.id !== user.id) { // Garante que não é o próprio usuário
                return res.status(409).json({ message: 'Este email já está em uso.' });
            }
            user.email = email;
        }

        // Atualizar nome se fornecido
        if (name) {
            user.name = name;
        }

        // Se uma nova senha foi fornecida, fazer o hash
        if (password) {
            user.password = await bcrypt.hash(password, 10);
        }

        await user.save(); // Salvar as alterações

        res.status(200).json({
            message: 'Perfil atualizado com sucesso!',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        console.error('Erro ao atualizar perfil:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao atualizar perfil.' });
    }
};

// Controlador para excluir a conta do usuário autenticado
exports.deleteAccount = async (req, res) => {
    try {
        const user = await User.findByPk(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        await user.destroy(); // Excluir o usuário

        res.status(200).json({ message: 'Conta excluída com sucesso!' });
    } catch (error) {
        console.error('Erro ao excluir conta:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao excluir conta.' });
    }
};

// Controlador para criar um novo usuário
exports.createUser = async (req, res) => {
    try {
        const { name, email, password, telefone } = req.body;

        // Verifica se o email já existe
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ message: 'Este email já está em uso.' });
        }

        // Criptografa a senha
        const hashedPassword = await bcrypt.hash(password, 10);

        // Cria o usuário
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            telefone 
        });

        res.status(201).json({
            id: newUser.id,
            name: newUser.name,
            email: newUser.email
        });
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao criar usuário.' });
    }
};