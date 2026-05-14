module.exports = (sequelize, Sequelize) => {
    const QuizNotifications = sequelize.define(
        "tbl_quiz_notifications",
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            quiz_id:{
                type:Sequelize.INTEGER
            },
            notification_subject:{
                type: Sequelize.STRING
            },
            send_push_notification:{
                type:Sequelize.INTEGER
            },
            show_my_name:{
                type:Sequelize.INTEGER
            },
            message: {
                type: Sequelize.TEXT
            },
            notification_type:{
                type: Sequelize.STRING
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
        tableName: "tbl_quiz_notifications"
    });
    return QuizNotifications
}