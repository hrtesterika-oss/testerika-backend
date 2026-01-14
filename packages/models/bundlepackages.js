module.exports = (sequelize, Sequelize) => {
    const BundlePackages = sequelize.define(
        "tblbundle_packages",
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            type:{
                type:Sequelize.STRING,
                defaultValue:"Bundle"
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
            }
        }, {
        tableName: "tblbundle_packages"
    });
    return BundlePackages
}