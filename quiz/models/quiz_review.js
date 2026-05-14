module.exports = (sequelize, Sequelize) => {
    const QuizReview = sequelize.define(
        "tbl_quiz_review",
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
            rate:{
                type: Sequelize.INTEGER
            },
            review: {
                type: Sequelize.TEXT
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
        tableName: "tbl_quiz_review"
    });
    return QuizReview
}