module.exports = (sequelize, Sequelize) => {
    const PackageCart = sequelize.define(
        "tbl_package_cart",
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },            
            user_id: {
                type: Sequelize.INTEGER // full length
            },
            package_id: {
                type: Sequelize.INTEGER // full length
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
        }, 
        {
          tableName: "tbl_package_cart"
        }
        );
    return PackageCart
}