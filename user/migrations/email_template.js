module.exports = {
    up: (queryInterface, Sequelize) =>
        queryInterface.createTable("tblemail_templates", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            type: {
                type: Sequelize.STRING
            },
            slug: {
                type: Sequelize.STRING
            },
            language: {
                type: Sequelize.STRING
            },
            name: {
                type: Sequelize.STRING
            },
            subject: {
                type: Sequelize.STRING
            },
            message: {
                type: Sequelize.TEXT
            },
            from_name: {
                type: Sequelize.STRING
            },
            from_email: {
                type: Sequelize.STRING
            },
            plain_text: {
                type: Sequelize.INTEGER
            },
            order: {
                type: Sequelize.STRING
            },
            status: {
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
        queryInterface.dropTable('tblemail_templates')
    }
}