module.exports = (sequelize, Sequelize) => {
    const QuestionBanks = sequelize.define(
        "tblquestion_banks",
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            passage_bank_id: {
                type: Sequelize.INTEGER
            },
            subject_id: {
                type: Sequelize.INTEGER
            },
            question_type: {
                type: Sequelize.STRING
            },
            level: {
                type: Sequelize.STRING
            },
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
        tableName: "tblquestion_banks"
    });
    return QuestionBanks
}