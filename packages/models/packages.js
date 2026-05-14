module.exports = (sequelize, Sequelize) => {
    const Packages = sequelize.define(
        "tblpackages",
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            type:{
                type:Sequelize.STRING,
                defaultValue:"Package"
            },
            categoryid: {
                type: Sequelize.INTEGER
            },
            slug: {
                type: Sequelize.STRING
            },
            name: {
                type: Sequelize.STRING
            },
            description: {
                type: Sequelize.TEXT
            },
            price_inr: {
                type: Sequelize.DECIMAL,
            },
            price_usd: {
                type: Sequelize.DECIMAL,
            },
            thumbnail: {
                type: Sequelize.TEXT
            },
            premiumType: {
                type: Sequelize.INTEGER
            },
            hash: {
                type: Sequelize.TEXT
            },
            featured: {
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
            },
            total_test:{
                type: Sequelize.STRING
            },
            live:{
                type: Sequelize.INTEGER,
                defaultValue:0
            },
            reg_start_date:{
                type: Sequelize.DATE
            },
            reg_end_date:{
                type: Sequelize.DATE
            },
            result_publish_date:{
                type: Sequelize.DATE
            },
            start_date:{
                type: Sequelize.DATE
            },
            end_date:{
                type: Sequelize.DATE
            }
        }, {
        tableName: "tblpackages"
    });
    return Packages
}