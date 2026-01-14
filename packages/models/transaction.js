module.exports = (sequelize, Sequelize) => {
    const Transactions = sequelize.define(
        "tbl_transactions",
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            userid:{
                type: Sequelize.INTEGER
            },
            packageid: {
                type: Sequelize.INTEGER
            },
            bundleid: {
                type: Sequelize.INTEGER
            },
            passid: {
                type: Sequelize.INTEGER
            },
            couponid: {
                type: Sequelize.INTEGER
            },
            orderid:{
                type:Sequelize.TEXT
            },
            transactionid:{
                type:Sequelize.TEXT
            },
            currency: {
                type: Sequelize.STRING
            },
            payment_method: {
                type: Sequelize.STRING
            },
            payment_status: {
                type: Sequelize.STRING
            },
            buydate: {
                type: Sequelize.DATE,
            },
            expirydate: {
                type: Sequelize.DATE
            },
            total_amount: {
                type: Sequelize.DECIMAL
            },
            coupon_discount: {
                type: Sequelize.DECIMAL,
            },
            payable_amount: {
                type: Sequelize.DECIMAL
            },
            active: {
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
            }
        }, {
        tableName: "tbl_transactions"
    });
    return Transactions
}