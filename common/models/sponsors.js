module.exports = (sequelize, Sequelize) => {
    const Sponsors = sequelize.define(
        "tblsponsors",
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            name: {
                type: Sequelize.STRING
            },
            mobile_number: {
                type: Sequelize.STRING
            },
            email: {
                type: Sequelize.STRING
            },
            logo: {
                type: Sequelize.STRING
            },
            link: {
                type: Sequelize.STRING
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
        tableName: "tblsponsors"
    });
    return Sponsors
}