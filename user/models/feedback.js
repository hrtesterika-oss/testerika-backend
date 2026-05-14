module.exports = (sequelize, Sequelize) => {
    const Feedbacks = sequelize.define(
        "tblfeedbacks",
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
            mobile_number: {
                type: Sequelize.STRING
            },
            email: {
                type: Sequelize.STRING
            },
            message: {
                type: Sequelize.TEXT
            },
            status: {
                type: Sequelize.INTEGER,
                defaultValue: 1
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
        tableName: "tblfeedbacks"
    });
    return Feedbacks
}