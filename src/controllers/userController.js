const db = require('../config/database');
const bcrypt = require('bcryptjs');

const User = db.User;

// Controlador para obter o perfil do usuário autenticado
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.userId, {
            attributes: ['id', 'name', 'email'],
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


exports.updateProfile = async (req, res) => {
    const { name, email, password } = req.body; 

    try {
        const user = await User.findByPk(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        if (email && email !== user.email) {
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser && existingUser.id !== user.id) {
                return res.status(409).json({ message: 'Este email já está em uso.' });
            }
            user.email = email;
        }

        if (name) {
            user.name = name;
        }
        
        if (password) {
            user.password = await bcrypt.hash(password, 10);
        }

        await user.save();

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

        await user.destroy();

        res.status(200).json({ message: 'Conta excluída com sucesso!' });
    } catch (error) {
        console.error('Erro ao excluir conta:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao excluir conta.' });
    }
};
