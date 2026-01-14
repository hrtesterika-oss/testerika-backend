module.exports = (sequelize, Sequelize) => {
    const UserDoubt = sequelize.define(
        "tbl_user_doubt",
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
            course_id:{
                type: Sequelize.INTEGER
            },
            subject_id:{
                type: Sequelize.INTEGER
            },
            other_subject:{
                type:Sequelize.TEXT
            },
            question:{
                type:Sequelize.TEXT
            },
            hint_or_reference:{
                type:Sequelize.TEXT
            },
            image:{
                type:Sequelize.JSON
            },
            active:{
                type:Sequelize.INTEGER,
                defaultValue:0
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
        tableName: "tbl_user_doubt"
    });
    return UserDoubt
}