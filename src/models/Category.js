module.exports = (sequelize, DataTypes) => {
    const Category = sequelize.define('Category', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
    }, {
        tableName: 'categories',
    });

    Category.associate = (models) => {
        // Uma categoria pode ter muitos produtos 
        Category.hasMany(models.Product, {
            foreignKey: 'categoryId', // Nome da coluna de chave estrangeira em Product
            as: 'products',
        });
    };

    return Category;
};