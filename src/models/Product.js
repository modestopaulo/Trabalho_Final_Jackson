module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define('Product', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        price: {
            type: DataTypes.DECIMAL(10, 2), // DECIMAL(10, 2)
            allowNull: false,
        },
        stockQuantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        categoryId: { // Chave estrangeira para Category
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    }, {
        tableName: 'products',
    });

    Product.associate = (models) => {
        // Um produto pertence a uma categoria (Many-to-One)
        Product.belongsTo(models.Category, {
            foreignKey: 'categoryId',
            as: 'category',
        });

        // Relacionamento N:N com Pedidos através da tabela OrderItem
        Product.belongsToMany(models.Order, {
            through: models.OrderItem, // Tabela intermediária
            foreignKey: 'productId',
            as: 'orders',
        });
    };

    return Product;
};