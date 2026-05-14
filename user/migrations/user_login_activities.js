module.exports = {
    up: (queryInterface, Sequelize) =>
        queryInterface.createTable("tbluser_login_activities", {
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
        }),
    down: (queryInterface, Sequelize) => {
        queryInterface.dropTable('tbluser_login_activities')
    }
}