module.exports = {
    up: (queryInterface, Sequelize) =>
        queryInterface.createTable("tbluser_device_info", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            user_id: {
                type: Sequelize.INTEGER
            },
            device_id: {
                type: Sequelize.STRING
            },
            device_token: {
                type: Sequelize.STRING
            },
            device_name: {
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
        }),
    down: (queryInterface, Sequelize) => {
        queryInterface.dropTable('tbluser_device_info')
    }
}