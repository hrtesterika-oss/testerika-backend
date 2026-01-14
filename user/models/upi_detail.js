module.exports = (sequelize, Sequelize) => {
    const UpiDetails = sequelize.define(
        "tblupi_details",
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            user_id: {
                type: Sequelize.INTEGER
            },
            upi_id: {
                type: Sequelize.STRING
            },
            name: {
                type: Sequelize.STRING
            },
            father_name: {
                type: Sequelize.STRING
            },
            reject_reason: {
                type: Sequelize.TEXT
            },
            upi_status: {
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
        tableName: "tblupi_details"
    });
    return UpiDetails
}