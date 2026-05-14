module.exports = (sequelize, Sequelize) => {
    const BookCourses = sequelize.define(
        "tblbook_courses",
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            book_id: {
                allowNull: false,
                type: Sequelize.INTEGER
            },
            course_id: {
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
        tableName: "tblbook_courses"
    });
    return BookCourses
}