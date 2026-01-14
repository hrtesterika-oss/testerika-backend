module.exports = (sequelize, Sequelize) => {
    const ReportQuestion = sequelize.define(
        "tbl_report_question",
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
            report_reason:{
                type:Sequelize.TEXT
            },
            reported:{
                type:Sequelize.INTEGER,
                defaultValue:0
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
        tableName: "tbl_report_question"
    });
    return ReportQuestion
}