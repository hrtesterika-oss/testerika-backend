module.exports = (sequelize, Sequelize) => {
    const QuizDates = sequelize.define(
        "tblquiz_dates",
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
            question_time: {
                type: Sequelize.INTEGER
            },
            reg_open_date: {
                type: Sequelize.DATE
            },
            start_date: {
                type: Sequelize.DATE
            },
            result_publish_date: {
                type: Sequelize.DATE
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
        tableName: "tblquiz_dates"
    });
    return QuizDates
}