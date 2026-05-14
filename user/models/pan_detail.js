module.exports = (sequelize, Sequelize) => {
    const PanDetails = sequelize.define(
        "tblpan_details",
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
            name: {
                type: Sequelize.STRING
            },
            pannumber: {
                type: Sequelize.STRING
            },
            dob: {
                type: Sequelize.STRING
            },
            pan_url: {
                type: Sequelize.STRING
            },
            reject_reason: {
                type: Sequelize.TEXT
            },
            pan_status: {
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
        tableName: "tblpan_details"
    });
    return PanDetails
}