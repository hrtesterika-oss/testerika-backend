module.exports = (sequelize, Sequelize) => {
    const ExamResults = sequelize.define(
        "tblexam_results",
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
            bundleid:{
                type:Sequelize.INTEGER
            },
            packageid:{
                type: Sequelize.INTEGER
            },
            subpackageid:{
                type: Sequelize.INTEGER
            },
            examid: {
                type: Sequelize.INTEGER
            },
            examsectionid: {
                type: Sequelize.INTEGER
            },
            resultanalysisid: {
                type: Sequelize.INTEGER
            },
            question_bank_id:{
                type:Sequelize.INTEGER
            },
            question_id: {
                type: Sequelize.INTEGER
            },
            user_ans_option_id: {
                type: Sequelize.INTEGER
            },
            question_status:{
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
        tableName: "tblexam_results"
    });
    return ExamResults
}