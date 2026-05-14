module.exports = (sequelize, Sequelize) => {
    const UserDoubtSolution = sequelize.define(
        "tbl_user_doubt_solution",
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            userid: {
                type: Sequelize.INTEGER
            },
            doubt_id:{
                type: Sequelize.INTEGER
            },
            solution:{
                type:Sequelize.TEXT
            },
            hint_or_reference:{
                type:Sequelize.TEXT
            },
            image:{
                type:Sequelize.JSON
            },
            status:{
                type:Sequelize.INTEGER,
                defaultValue:1
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
        tableName: "tbl_user_doubt_solution"
    });
    return UserDoubtSolution
}