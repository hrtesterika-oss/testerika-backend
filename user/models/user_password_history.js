module.exports = (sequelize, Sequelize) => {
    const UserPasswordHistory = sequelize.define(
        "tbluser_password_history",
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
            last_password: {
                type: Sequelize.STRING
            },
            new_pass_key: {
                type: Sequelize.STRING
            },
            new_pass_key_request: {
                type: Sequelize.DATE
            },
            last_password_change: {
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
        tableName: "tbluser_password_history"
    });
    return UserPasswordHistory
}