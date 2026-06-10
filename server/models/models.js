const sequelize = require('../db')
const {DataTypes} = require('sequelize')

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: {type: DataTypes.STRING, unique: true,},
    password: {type: DataTypes.STRING},
    role: {type: DataTypes.STRING, defaultValue: "USER"},
})

const Basket = sequelize.define('basket', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    userId: { type: DataTypes.INTEGER, allowNull: false, unique: true }
})

const BasketCloth = sequelize.define('basket_cloth', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    basketId: { type: DataTypes.INTEGER, allowNull: false },   // внешний ключ на корзину
    clothId: { type: DataTypes.INTEGER, allowNull: false },    // внешний ключ на товар
    size: { type: DataTypes.STRING, allowNull: false },        // 'S', 'M', 'L', 'XL'
    quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    priceAtAdd: { type: DataTypes.INTEGER, allowNull: false },  // цена на момент добавления (не меняется)
})

const PromoCode = sequelize.define('promocode', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    code: { type: DataTypes.STRING, unique: true, allowNull: false },
    discountType: { type: DataTypes.ENUM('percent', 'fixed'), defaultValue: 'percent' },
    discountValue: { type: DataTypes.INTEGER, allowNull: false }, // 10 = 10% или 500 руб
    expiresAt: { type: DataTypes.DATE },
    active: { type: DataTypes.BOOLEAN, defaultValue: true }
})

const Order = sequelize.define('order', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    deliveryType: { type: DataTypes.STRING, allowNull: false },
    deliveryPrice: { type: DataTypes.INTEGER, allowNull: false },
    paymentMethod: { type: DataTypes.STRING, allowNull: false },
    customerFullName: { type: DataTypes.STRING, allowNull: false },
    customerPhone: { type: DataTypes.STRING, allowNull: false },
    customerEmail: { type: DataTypes.STRING, allowNull: false },
    total: { type: DataTypes.INTEGER, allowNull: false },
    status: { type: DataTypes.STRING, defaultValue: 'pending' }
});

const OrderItem = sequelize.define('order_item', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    orderId: { type: DataTypes.INTEGER, allowNull: false },
    clothId: { type: DataTypes.INTEGER, allowNull: false },
    size: { type: DataTypes.STRING, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    price: { type: DataTypes.INTEGER, allowNull: false }
});

const Cloth = sequelize.define('cloth', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name:{type: DataTypes.STRING, unique: true, allowNull: false},
    price:{type: DataTypes.INTEGER, allowNull: false},
    img:{type: DataTypes.STRING, allowNull: false},
})

const ClothSize = sequelize.define('cloth_size', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    size: {type: DataTypes.STRING, allowNull: false},
    stock: {type: DataTypes.INTEGER, allowNull: false, defaultValue: 0},
})


const Type = sequelize.define('type', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name:{type: DataTypes.STRING, unique: true, allowNull: false},
})

const Brand = sequelize.define('brand', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name:{type: DataTypes.STRING, unique: true, allowNull: false},
})

const ClothInfo = sequelize.define('cloth_info', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title:{type: DataTypes.STRING, allowNull: false},
    description:{type: DataTypes.STRING, allowNull: false},
})

const TypeBrand = sequelize.define('typebrand', { 
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

User.hasOne(Basket, { foreignKey: 'userId' })
Basket.belongsTo(User, { foreignKey: 'userId' })

Basket.hasMany(BasketCloth, { foreignKey: 'basketId' })
BasketCloth.belongsTo(Basket, { foreignKey: 'basketId' })

User.hasMany(Order)
Order.belongsTo(User)

Order.hasMany(OrderItem)
OrderItem.belongsTo(Order)

Cloth.hasMany(OrderItem)
OrderItem.belongsTo(Cloth)

Type.hasMany(Cloth)
Cloth.belongsTo(Type)

User.hasMany(Order)
Order.belongsTo(User)

Brand.hasMany(Cloth)
Cloth.belongsTo(Brand)

Cloth.hasMany(BasketCloth, { foreignKey: 'clothId' })
BasketCloth.belongsTo(Cloth, { foreignKey: 'clothId' })

Cloth.hasMany(ClothInfo, {as: 'cloth_infos'});
ClothInfo.belongsTo(Cloth)

Cloth.hasMany(ClothSize, {as: 'cloth_sizes'});
ClothSize.belongsTo(Cloth)

Type.belongsToMany(Brand, {through: TypeBrand})
Brand.belongsToMany(Type, {through: TypeBrand})

module.exports = {
    User,
    Basket,
    BasketCloth,
    Cloth,
    ClothSize,
    Type,
    Brand,
    TypeBrand,
    ClothInfo,
    PromoCode,
    Order,
    OrderItem
}
