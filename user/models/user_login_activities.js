module.exports = (sequelize, Sequelize) => {
    const UserLoginActivities = sequelize.define(
        "tbluser_login_activities",
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
            login_ip: {
                type: Sequelize.STRING
            },
            last_login: {
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
        tableName: "tbluser_login_activities"
    });
    return UserLoginActivities
}