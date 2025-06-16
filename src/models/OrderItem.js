module.exports = (sequelize, DataTypes) => {
    const OrderItem = sequelize.define('OrderItem', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        quantity: { 
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },
        price: { 
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        orderId: { 
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        productId: { 
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    }, {
        tableName: 'order_items',
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
