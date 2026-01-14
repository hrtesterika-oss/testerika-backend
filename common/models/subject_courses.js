module.exports = (sequelize, Sequelize) => {
    const SubjectCourses = sequelize.define(
        "tblsubject_courses",
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            subject_id: {
                type: Sequelize.INTEGER
            },
            course_category_id: {
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
        tableName: "tblsubject_courses"
    });
    return SubjectCourses
}