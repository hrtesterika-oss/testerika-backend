module.exports = (sequelize, Sequelize) => {
    const QuestionSolutions = sequelize.define(
        "tblquestion_solutions",
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
            solution: {
                type: Sequelize.TEXT
            },
            // language: {
            //     type: Sequelize.STRING
            // },
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
        tableName: "tblquestion_solutions"
    });
    return QuestionSolutions
}