module.exports = {
    up: (queryInterface, Sequelize) =>
        queryInterface.createTable("tbluser_courses", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            user_id: {
                type: Sequelize.INTEGER
            },
            course_id: {
                type: Sequelize.INTEGER
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
        queryInterface.dropTable('tbluser_courses')
    }
}