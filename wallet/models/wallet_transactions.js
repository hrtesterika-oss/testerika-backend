module.exports = (sequelize, Sequelize) => {
    const WalletTransactions = sequelize.define(
        "tblwallet_transactions",
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
            withdraw_id: {
                type: Sequelize.INTEGER
            },
            quiz_id: {
                type: Sequelize.INTEGER
            },
            transaction_id: {
                type: Sequelize.STRING
            },
            tds_amount: {
                type: Sequelize.DECIMAL
            },
            gross_amount: {
                type: Sequelize.DECIMAL
            },
            amount: {
                type: Sequelize.DECIMAL
            },
            coupon_id: {
                type: Sequelize.INTEGER
            },
            coupon_amount: {
                type: Sequelize.DECIMAL
            },
            coupon_code: {
                type: Sequelize.STRING
            },
            type: {
                type: Sequelize.STRING
            },
            transaction_type: {
                type: Sequelize.STRING
            },
            debit_from: {
                type: Sequelize.STRING
            },
            referred_by: {
                type: Sequelize.INTEGER
            },
            narration: {
                type: Sequelize.STRING
            },
            transaction_status: {
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
        tableName: "tblwallet_transactions"
    });
    return WalletTransactions
}