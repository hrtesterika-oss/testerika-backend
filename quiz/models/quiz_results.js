module.exports = (sequelize, Sequelize) => {
    const QuizResults = sequelize.define(
        "tblquiz_results",
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
            quiz_id: {
                type: Sequelize.INTEGER
            },
            result_analysis_id: {
                type: Sequelize.INTEGER
            },
            question_id: {
                type: Sequelize.INTEGER
            },
            user_ans_option_id: {
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
        tableName: "tblquiz_results"
    });
    return QuizResults
}