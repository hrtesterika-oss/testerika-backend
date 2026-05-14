module.exports = (sequelize, Sequelize) => {
    const QuizResultAnalysis = sequelize.define(
        "tblquiz_result_analysis",
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
            total_questions: {
                type: Sequelize.INTEGER
            },
            obtained_marks: {
                type: Sequelize.DECIMAL
            },
            time_taken: {
                type: Sequelize.INTEGER
            },
            easy_correct: {
                type: Sequelize.INTEGER
            },
            moderate_correct: {
                type: Sequelize.INTEGER
            },
            difficult_correct: {
                type: Sequelize.INTEGER
            },
            quiz_status:{
                type:Sequelize.STRING,
                defaultValue:"initialized"
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
        tableName: "tblquiz_result_analysis"
    });
    return QuizResultAnalysis
}