module.exports = (sequelize, Sequelize) => {
    const CouponUses = sequelize.define(
        "tblcoupon_uses",
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            coupon_id: {
                type: Sequelize.INTEGER
            },
            max_user: {
                type: Sequelize.INTEGER
            },
            used_so_far: {
                type: Sequelize.INTEGER,
                defaultValue: 0
            },
            max_use_per_user: {
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
        tableName: "tblcoupon_uses"
    });
    return CouponUses
}