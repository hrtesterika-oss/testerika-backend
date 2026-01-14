
module.exports = (sequelize, Sequelize) => {
    const Verifications = sequelize.define(
        "tblverifications",
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            kyc_id: {
                type: Sequelize.INTEGER
            },
            type: {
                type: Sequelize.STRING
            },
            verified: {
                type: Sequelize.BOOLEAN
            },
            verified_at: {
                type: Sequelize.STRING
            },
            verified_by: {
                type: Sequelize.STRING
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
        },
        {
            tableName: "tblverifications",
        }
    );
    return Verifications;
};