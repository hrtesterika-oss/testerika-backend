module.exports = (sequelize, Sequelize) => {
    const ExamTypes = sequelize.define(
        "tblexamtypes",
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },            
            name: {
                type: Sequelize.STRING // full length
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
          tableName: "tblexamtypes"
        }
        );
    return ExamTypes
}