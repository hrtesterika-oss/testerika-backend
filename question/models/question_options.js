module.exports = (sequelize, Sequelize) => {
    const QuestionOptions = sequelize.define(
        "tblquestion_options",
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            question_id: {
                type: Sequelize.INTEGER
            },
            option: {
                type: Sequelize.TEXT
            },
            // language: {
            //     type: Sequelize.STRING
            // },
            right_option: {
                type: Sequelize.INTEGER
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
        tableName: "tblquestion_options"
    });
    return QuestionOptions
}