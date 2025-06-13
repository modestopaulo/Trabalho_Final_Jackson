const db = require('../config/database');
const Order = db.Order;
const OrderItem = db.OrderItem;
const Product = db.Product;

exports.createOrder = async (req, res) => {
    const { items } = req.body;
    const userId = req.userId;
    if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: 'Itens do pedido são obrigatórios.' });
    }
    try {
        let totalPrice = 0;
        for (const item of items) {
            const product = await Product.findByPk(item.productId);
            if (!product) {
                return res.status(404).json({ message: `Produto ID ${item.productId} não encontrado.` });
            }
            if (product.stockQuantity < item.quantity) {
                return res.status(400).json({ message: `Estoque insuficiente para o produto ${product.name}.` });
            }
            totalPrice += parseFloat(product.price) * item.quantity;
        }
        const order = await Order.create({ userId, totalPrice });
        for (const item of items) {
            const product = await Product.findByPk(item.productId);
            await OrderItem.create({
                orderId: order.id,
                productId: item.productId,
                quantity: item.quantity,
                price: product.price
            });
            product.stockQuantity -= item.quantity;
            await product.save();
        }
        res.status(201).json({ message: 'Pedido criado com sucesso!', orderId: order.id });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar pedido.' });
    }
};

exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({
            where: { userId: req.userId },
            include: [
                {
                    model: OrderItem,
                    as: 'order_items',
                    include: [{ model: Product, as: 'product' }]
                }
            ]
        });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar pedidos.' });
    }
};

exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findOne({
            where: { id: req.params.id, userId: req.userId },
            include: [
                {
                    model: OrderItem,
                    as: 'order_items',
                    include: [{ model: Product, as: 'product' }]
                }
            ]
        });
        if (!order) {
            return res.status(404).json({ message: 'Pedido não encontrado.' });
        }
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar pedido.' });
    }
};

exports.deleteOrder = async (req, res) => {
    try {
        const order = await Order.findOne({
            where: { id: req.params.id, userId: req.userId }
        });
        if (!order) {
            return res.status(404).json({ message: 'Pedido não encontrado.' });
        }
        await OrderItem.destroy({ where: { orderId: order.id } });
        await order.destroy();
        res.json({ message: 'Pedido cancelado/excluído com sucesso.' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao cancelar/excluir pedido.' });
    }
};