module.exports = (sequelize, Sequelize) => {
    const Exams = sequelize.define(
        "tblexams",
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            key: {
                type: Sequelize.TEXT
            },            
            name: {
                type: Sequelize.STRING
            },
            examtypesid: {
                type: Sequelize.INTEGER
            },
            exam_duration: {
                type: Sequelize.INTEGER
            },
            total_questions: {
                type: Sequelize.INTEGER
            },
            total_marks: {
                type: Sequelize.INTEGER
            },
            negative_marking: {
                type: Sequelize.INTEGER
            },
            draft: {
                type: Sequelize.INTEGER
            },
            result_publish_instantly: {
                type: Sequelize.INTEGER
            },
            result_publish_date: {
                type: Sequelize.DATE
            },
            question_suffling: {
                type: Sequelize.INTEGER
            },
            option_suffling: {
                type: Sequelize.INTEGER
            },
            section_wise_time: {
                type: Sequelize.INTEGER //0 or 1 -> time for each section
            },
            attempt_limit: {
                type: Sequelize.INTEGER
            },
            instructions: {
                type: Sequelize.TEXT //0 or 1 -> time for each section
            },
            skip_button:{
                type: Sequelize.STRING
            },
            registration_exam:{
                type:Sequelize.STRING
            },
            reg_start_date:{
                type: Sequelize.DATE
            },
            reg_end_date:{
                type: Sequelize.DATE
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
          tableName: "tblexams"
        }
        );
    return Exams
}