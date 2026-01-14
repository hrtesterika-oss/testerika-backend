module.exports = (sequelize, Sequelize) => {
    const SavedExamQuestion = sequelize.define(
        "tbl_saved_exam_question",
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            userid: {
                type: Sequelize.INTEGER
            },
            passage_id:{
                type: Sequelize.INTEGER  
            },
            question_id: {
                type: Sequelize.INTEGER
            },
            option_id: {
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
        tableName: "tbl_saved_exam_question"
    });
    return SavedExamQuestion
}