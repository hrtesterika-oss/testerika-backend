module.exports = (sequelize, Sequelize) => {
    const SponsorshipPrograms = sequelize.define(
        "tblsponsorship_programs",
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            quiz_id: {
                type: Sequelize.INTEGER
            },
            name: {
                type: Sequelize.STRING
            },
            image: {
                type: Sequelize.STRING
            },
            sponsors: {
                type: Sequelize.INTEGER
            },
            co_sponsors: {
                type: Sequelize.INTEGER
            },
            sponsor_fee: {
                type: Sequelize.DECIMAL
            },
            co_sponsor_fee: {
                type: Sequelize.DECIMAL
            },
            description: {
                type: Sequelize.TEXT
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
        tableName: "tblsponsorship_programs"
    });
    return SponsorshipPrograms
}