module.exports = (sequelize, Sequelize) => {
    const PackageSubpackages = sequelize.define(
        "tblpackage_subpackages",
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            packageid: {
                type: Sequelize.INTEGER
            },
            subpackageid: {
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
        tableName: "tblpackage_subpackages"
    });
    return PackageSubpackages
}