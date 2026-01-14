module.exports = (sequelize, Sequelize) => {
    const ExamResultAnalysis = sequelize.define(
        "tblexam_result_analysis",
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
           
            total_questions: {
                type: Sequelize.INTEGER
            },
            time_taken: {
                type: Sequelize.INTEGER
            },
            easy_correct: {
                type: Sequelize.INTEGER
            },
            moderate_correct: {
                type: Sequelize.INTEGER
            },
            difficult_correct: {
                type: Sequelize.INTEGER
            },
            start_date: {
                type: Sequelize.DATE
            },
            finish_date: {
                type: Sequelize.DATE
            },
            exam_status:{
                type:Sequelize.STRING,
                defaultValue:"initialized" // paused //completed // running
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
        tableName: "tblexam_result_analysis"
    });
    return ExamResultAnalysis
}