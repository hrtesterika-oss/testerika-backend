module.exports = (sequelize, Sequelize) => {
    const CourseCategories = sequelize.define(
        "tblcourse_categories",
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            // course_id: {
            //     type: Sequelize.INTEGER
            // },
            course_category: {
                type: Sequelize.STRING
            },
            slug: {
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
        tableName: "tblcourse_categories"
    });
    return CourseCategories
}