module.exports = (sequelize, Sequelize) => {
    const UserDoubtReport = sequelize.define(
        "tbl_user_doubt_report",
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
            report_reason:{
                type:Sequelize.TEXT
            },
            mark_reported:{
                type:Sequelize.INTEGER,
                defaultValue:0
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
        tableName: "tbl_user_doubt_report"
    });
    return UserDoubtReport
}