module.exports = {
    up: (queryInterface, Sequelize) =>
        queryInterface.createTable("tblusers", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            firstname: {
                type: Sequelize.STRING
            },
            lastname: {
                type: Sequelize.STRING
            },
            fathername: {
                type: Sequelize.STRING
            },
            email: {
                type: Sequelize.STRING
            },
            email_verified: {
                type: Sequelize.INTEGER
            },
            phone: {
                type: Sequelize.STRING
            },
            phone_verified: {
                type: Sequelize.INTEGER
            },
            dob: {
                type: Sequelize.STRING
            },
            gender: {
                type: Sequelize.STRING
            },
            password: {
                type: Sequelize.STRING
            },
            profile_image: {
                type: Sequelize.STRING
            },
            locale: {
                type: Sequelize.STRING
            },
            touchId_enable: {
                type: Sequelize.INTEGER
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
        queryInterface.dropTable('tblusers')
    }
}