module.exports = (sequelize, Sequelize) => {
    const ResellerSales = sequelize.define(
        "tbl_reseller_sales",
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            reseller_id: {
                type: Sequelize.INTEGER
            },
            user_id: {
                type: Sequelize.INTEGER
            },
            sales_id: {
                type: Sequelize.INTEGER
            },
            coupon_id: {
                type: Sequelize.INTEGER
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            deletedAt: {
                type: Sequelize.DATE
            },
            amount:{
                type: Sequelize.DOUBLE
            },
            status:{
                type: Sequelize.INTEGER,
                defaultValue:0
            }
        }, {
        tableName: "tbl_reseller_sales"
    });
    return ResellerSales
}