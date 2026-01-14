module.exports = (sequelize, Sequelize) => {
    const ExamCourses = sequelize.define(
        "tblexamcourses",
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
            courseid: {
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
        }, 
        {
          tableName: "tblexamcourses"
        }
        );
    return ExamCourses
}