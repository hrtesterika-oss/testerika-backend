module.exports = (sequelize, Sequelize) => {
    const Subjects = sequelize.define(
        "tblsubjects",
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            course_ids:{
                type:Sequelize.JSON
              },
            subject_name: {
                type: Sequelize.STRING
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
        tableName: "tblsubjects"
    });
    return Subjects
}