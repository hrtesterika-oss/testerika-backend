module.exports = (sequelize, Sequelize) => {
    const SponsorshipPrograms = sequelize.define(
        "tblsponsorship_subscriptions",
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            sponsor_program_id: {
                type: Sequelize.INTEGER
            },
            sponsor_id: {
                type: Sequelize.INTEGER
            },
            type: {
                type: Sequelize.STRING
            },
            amount: {
                type: Sequelize.DECIMAL
            },
            discount: {
                type: Sequelize.DECIMAL
            },
            net_amount: {
                type: Sequelize.DECIMAL
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
        tableName: "tblsponsorship_subscriptions"
    });
    return SponsorshipPrograms
}