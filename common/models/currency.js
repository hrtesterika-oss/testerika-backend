module.exports = (sequelize, Sequelize) => {
    const Currencies = sequelize.define(
        "tblcurrencies",
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            symbol: {
                type: Sequelize.STRING
            },
            name: {
                type: Sequelize.STRING
            },
            is_default: {
                type: Sequelize.INTEGER
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
        tableName: "tblcurrencies"
    });
    return Currencies
}