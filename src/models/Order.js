module.exports = (sequelize, DataTypes) => {
    const Order = sequelize.define('Order', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        orderDate: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW, 
        },
        totalPrice: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        userId: { // Chave estrangeira para User
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    }, {
        tableName: 'orders',
    });

    Order.associate = (models) => {
        // Um pedido pertence a um usuário 
        Order.belongsTo(models.User, {
            foreignKey: 'userId',
            as: 'user',
        });

        // Relacionamento N:N com Produtos através da tabela OrderItem
        Order.belongsToMany(models.Product, {
            through: models.OrderItem, // Tabela intermediária
            foreignKey: 'orderId',
            as: 'products',
        });

        // Um pedido tem muitos itens (OrderItem) - necessário para o include funcionar
        Order.hasMany(models.OrderItem, {
            foreignKey: 'orderId',
            as: 'order_items',
        });
    };

    return Order;
};
