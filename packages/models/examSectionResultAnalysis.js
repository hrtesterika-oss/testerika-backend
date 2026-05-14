module.exports = (sequelize, Sequelize) => {
    const ExamSectionResultAnalysis = sequelize.define(
        "tblexam_section_result_analysis",
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
            resultanalysisid: {
                type: Sequelize.INTEGER
            },
            examsectionid: {
                type: Sequelize.INTEGER
            },
            time_taken: {
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
        tableName: "tblexam_section_result_analysis"
    });
    return ExamSectionResultAnalysis
}