module.exports = (sequelize, Sequelize) => {
    const SubPackageCourses = sequelize.define(
        "tblsubpackage_courses",
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            subpackageid: {
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
        }, {
        tableName: "tblsubpackage_courses"
    });
    return SubPackageCourses
}