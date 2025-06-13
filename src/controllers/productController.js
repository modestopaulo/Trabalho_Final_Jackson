const db = require('../config/database');
const Product = db.Product;
const Category = db.Category;

exports.createProduct = async (req, res) => {
    const { name, description, price, stockQuantity, categoryId } = req.body;
    if (!name || !description || !price || !stockQuantity || !categoryId) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }
    try {
        const category = await Category.findByPk(categoryId);
        if (!category) {
            return res.status(404).json({ message: 'Categoria não encontrada.' });
        }
        const newProduct = await Product.create({ name, description, price, stockQuantity, categoryId });
        res.status(201).json({ message: 'Produto cadastrado com sucesso!', product: newProduct });
    } catch (error) {
        res.status(500).json({ message: 'Erro interno do servidor ao cadastrar produto.' });
    }
};

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar produtos.' });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Produto não encontrado.' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar produto.' });
    }
};

exports.updateProduct = async (req, res) => {
    const { name, description, price, stockQuantity, categoryId } = req.body;
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Produto não encontrado.' });
        }
        if (categoryId) {
            const category = await Category.findByPk(categoryId);
            if (!category) {
                return res.status(404).json({ message: 'Categoria não encontrada.' });
            }
        }
        await product.update({ name, description, price, stockQuantity, categoryId });
        res.json({ message: 'Produto atualizado com sucesso!', product });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar produto.' });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Produto não encontrado.' });
        }
        await product.destroy();
        res.json({ message: 'Produto excluído com sucesso!' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao excluir produto.' });
    }
};