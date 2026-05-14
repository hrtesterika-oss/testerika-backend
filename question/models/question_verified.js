module.exports = (sequelize, Sequelize) => {
    const QuestionVerified = sequelize.define(
        "tblquestion_verified",
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
            is_verified: {
                type: Sequelize.INTEGER
            },
            verified_by: {
                type: Sequelize.STRING
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
        tableName: "tblquestion_verified"
    });
    return QuestionVerified
}