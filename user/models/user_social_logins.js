module.exports = (sequelize, Sequelize) => {
    const UserSocialLogins = sequelize.define(
        "tbluser_social_logins",
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
            oauth_provider: {
                type: Sequelize.STRING
            },
            oauth_uid: {
                type: Sequelize.STRING
            },
            profile_url: {
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
        }, {
        tableName: "tbluser_social_logins"
    });
    return UserSocialLogins
}