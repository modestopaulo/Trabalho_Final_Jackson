const db = require('../config/database');
const Category = db.Category;
const Product = db.Product;

exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.findAll();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar categorias.' });
    }
};

exports.createCategory = async (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ message: 'Nome da categoria é obrigatório.' });
    }
    try {
        const category = await Category.create({ name });
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar categoria.' });
    }
};

exports.updateCategory = async (req, res) => {
    const { name } = req.body;
    const { id } = req.params;
    if (!name) {
        return res.status(400).json({ message: 'Nome da categoria é obrigatório.' });
    }
    try {
        const category = await Category.findByPk(id);
        if (!category) {
            return res.status(404).json({ message: 'Categoria não encontrada.' });
        }
        category.name = name;
        await category.save();
        res.json({ message: 'Categoria atualizada com sucesso.', category });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar categoria.' });
    }
};

exports.deleteCategory = async (req, res) => {
    const { id } = req.params;
    try {
        const products = await Product.findAll({ where: { categoryId: id } });
        if (products.length > 0) {
            return res.status(400).json({ message: 'Não é possível excluir uma categoria com produtos associados.' });
        }
        const category = await Category.findByPk(id);
        if (!category) {
            return res.status(404).json({ message: 'Categoria não encontrada.' });
        }
        await category.destroy();
        res.json({ message: 'Categoria excluída com sucesso.' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao excluir categoria.' });
    }
};