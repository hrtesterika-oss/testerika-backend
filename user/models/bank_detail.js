module.exports = (sequelize, Sequelize) => {
    const BankDetails = sequelize.define(
        "tblbank_details",
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
            account_number: {
                type: Sequelize.STRING
            },
            ifsc_code: {
                type: Sequelize.STRING
            },
            bank_name: {
                type: Sequelize.STRING
            },
            branch_name: {
                type: Sequelize.STRING
            },
            state: {
                type: Sequelize.STRING,
                status:1
            },
            bank_proof_url: {
                type: Sequelize.STRING
            },
            reject_reason: {
                type: Sequelize.TEXT
            },
            bank_status: {
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
        tableName: "tblbank_details"
    });
    return BankDetails
}