module.exports = (sequelize, Sequelize) => {
    const Packagesales = sequelize.define(
        "tblpackagesales",
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
            packageid: {
                type: Sequelize.INTEGER
            },
            bundleid: {
                type: Sequelize.INTEGER
            },
            passid: {
                type: Sequelize.INTEGER
            },
            transaction_id:{
                type: Sequelize.INTEGER
            },
            transactionid:{
                type:Sequelize.TEXT
            },
            amount: {
                type: Sequelize.DECIMAL
            },
            currency: {
                type: Sequelize.STRING
            },
            payment_method: {
                type: Sequelize.STRING
            },
            buydate: {
                type: Sequelize.DATE,
            },
            expirydate: {
                type: Sequelize.DATE
            },
            active: {
                type: Sequelize.INTEGER
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
        tableName: "tblpackagesales"
    });
    return Packagesales
}