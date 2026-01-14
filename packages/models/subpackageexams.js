module.exports = (sequelize, Sequelize) => {
    const SubPackageExams = sequelize.define(
        "tblsubpackage_exams",
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
            examid: {
                type: Sequelize.INTEGER
            },
            type: {
                type: Sequelize.STRING // Free / Paid
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
        tableName: "tblsubpackage_exams"
    });
    return SubPackageExams
}