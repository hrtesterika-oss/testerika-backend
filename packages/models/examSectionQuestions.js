module.exports = (sequelize, Sequelize) => {
    const ExamSectionQuestions = sequelize.define(
        "tblexamsectionsquestions",
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            examsectionid: {
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
        }, 
        {
          tableName: "tblexamsectionsquestions"
        }
        );
    return ExamSectionQuestions
}