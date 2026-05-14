module.exports = (sequelize, Sequelize) => {
    const ExamSections = sequelize.define(
        "tblexamsections",
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            examid: {
                type: Sequelize.INTEGER
            },
            subjectid: {
                type: Sequelize.INTEGER
            }, 
            section_name: {
                type: Sequelize.STRING
            },   
            duration: {
                 type: Sequelize.DOUBLE
            },
            instruction_duration:{
                type: Sequelize.DOUBLE
            },
            instruction: {
                type: Sequelize.TEXT
            },
            memoryTest:{
                type: Sequelize.INTEGER,
                defaultValue:0
            },
            memoryQuestion:{
                type: Sequelize.TEXT
            },
            memory_duration:{
                type: Sequelize.DOUBLE
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
          tableName: "tblexamsections"
        }
        );
    return ExamSections
}