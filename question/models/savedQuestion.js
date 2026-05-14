module.exports = (sequelize, Sequelize) => {
    const SavedQuestion = sequelize.define(
        "tbl_saved_question",
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
            question_bank_id: {
                type: Sequelize.INTEGER
            },
            question_id: {
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
        tableName: "tbl_saved_question"
    });
    return SavedQuestion
}