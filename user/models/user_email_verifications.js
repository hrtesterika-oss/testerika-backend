module.exports = (sequelize, Sequelize) => {
    const UserEmailVerification = sequelize.define(
        "tbluser_email_verifications",
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
            email_verified_at: {
                type: Sequelize.DATE
            },
            email_verification_key: {
                type: Sequelize.STRING
            },
            email_verification_sent_at: {
                type: Sequelize.DATE
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
        tableName: "tbluser_email_verifications"
    });
    return UserEmailVerification
}