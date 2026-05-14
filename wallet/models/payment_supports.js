module.exports = (sequelize, Sequelize) => {
    const PaymentSupports = sequelize.define(
        "tblpayment_supports",
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            user_id: {
                type: Sequelize.INTEGER
            },
            transaction_id: {
                type: Sequelize.STRING
            },
            screenshot: {
                type: Sequelize.STRING
            },
            comments: {
                type: Sequelize.TEXT
            },
            payment_support_status: {
                type: Sequelize.STRING
            },
            status: {
                type: Sequelize.INTEGER,
                defaultValue: 1
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
        tableName: "tblpayment_supports"
    });
    return PaymentSupports
}