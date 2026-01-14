module.exports = (sequelize, Sequelize) => {
    const Courses = sequelize.define(
        "tblcourses",
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            category_id:{
                type:Sequelize.INTEGER
            },
            course_name: {
                type: Sequelize.STRING
            },
            image: {
                type: Sequelize.STRING
            },
            position: {
                type: Sequelize.INTEGER
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
        tableName: "tblcourses"
    });
    return Courses
}