module.exports = (sequelize, Sequelize) => {
    const BundlePackageids = sequelize.define(
        "tblbundlepackage_ids",
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            bundleid: {
                type: Sequelize.INTEGER
            },
            packageid: {
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
        tableName: "tblbundlepackage_ids"
    });
    return BundlePackageids
}