module.exports = (sequelize, Sequelize) => {
    const PackageCourses = sequelize.define(
        "tblpackage_courses",
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            packageid: {
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
        tableName: "tblpackage_courses"
    });
    return PackageCourses
}