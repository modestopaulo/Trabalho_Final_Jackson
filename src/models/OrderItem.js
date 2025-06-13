module.exports = (sequelize, DataTypes) => {
    const OrderItem = sequelize.define('OrderItem', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        quantity: { // Quantidade de um produto específico neste pedido
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },
        price: { // Preço do produto no momento do pedido (pode variar com o tempo)
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        orderId: { // Chave estrangeira para Order
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        productId: { // Chave estrangeira para Product
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    }, {
        tableName: 'order_items', // Nome da tabela intermediária
    });

    OrderItem.associate = (models) => {
        // Um item de pedido pertence a um pedido
        OrderItem.belongsTo(models.Order, {
            foreignKey: 'orderId',
            as: 'order',
        });

        // Um item de pedido pertence a um produto
        OrderItem.belongsTo(models.Product, {
            foreignKey: 'productId',
            as: 'product',
        });
    };

    return OrderItem;
};