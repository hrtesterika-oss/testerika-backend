module.exports = (sequelize, Sequelize) => {
    const QuestionMarks = sequelize.define(
        "tblquestion_marks",
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            question_bank_id: {
                type: Sequelize.INTEGER
            },
            marks: {
                type: Sequelize.DECIMAL
            },
            negative_marks: {
                type: Sequelize.DECIMAL
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
        tableName: "tblquestion_marks"
    });
    return QuestionMarks
}