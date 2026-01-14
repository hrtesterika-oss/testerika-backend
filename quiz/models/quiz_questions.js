module.exports = (sequelize, Sequelize) => {
    const QuizQuestions = sequelize.define(
        "tblquiz_questions",
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            quiz_id: {
                type: Sequelize.INTEGER
            },
            question_bank_id: {
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
        }, {
        tableName: "tblquiz_questions"
    });
    return QuizQuestions
}