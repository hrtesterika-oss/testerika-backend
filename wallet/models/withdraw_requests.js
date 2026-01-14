module.exports = (sequelize, Sequelize) => {
    const WithdrawRequests = sequelize.define(
        "tblwithdraw_requests",
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
            upi_id: {
                type: Sequelize.STRING
            },
            amount: {
                type: Sequelize.DECIMAL
            },
            account_number: {
                type: Sequelize.STRING
            },
            ifsc_code: {
                type: Sequelize.STRING
            },
            branch_name: {
                type: Sequelize.STRING
            },
            withdraw_status: {
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
        tableName: "tblwithdraw_requests"
    });
    return WithdrawRequests
}