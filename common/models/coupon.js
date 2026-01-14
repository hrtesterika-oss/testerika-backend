module.exports = (sequelize, Sequelize) => {
    const Coupons = sequelize.define(
      'tblcoupons',
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        coupon_name: {
          type: Sequelize.STRING
        },
        coupon_code: {
          type: Sequelize.STRING,
          unique: true,
        },
        description: {
          type: Sequelize.TEXT
        },
        discount_percentage_inr: {
          type: Sequelize.INTEGER
        },
        discount_percentage_usd: {
          type: Sequelize.INTEGER
        },
        max_user_limit: {
            type: Sequelize.INTEGER
          },
          max_used_by_one_user: {
            type: Sequelize.INTEGER
          },
          min_order_amount_inr:{
            type:Sequelize.INTEGER
          },
          min_order_amount_usd:{
            type:Sequelize.INTEGER
          },
          apply_for_purchase: {
            type: Sequelize.JSON
          },
          visible_on_panel: {
            type: Sequelize.INTEGER
          },
          start_date: {
            type: Sequelize.DATE,
          },
          expiry_date: {
            type: Sequelize.DATE
          },
          user_id:{
            type: Sequelize.JSON
          },
          discount_type:{
            type:Sequelize.STRING
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
        },
        reseller:{
          type:Sequelize.INTEGER,
          defaultValue:0
        },
        reseller_payable_amount:{
          type:Sequelize.DOUBLE,
          defaultValue:0
        }
      },
      {
        tableName: 'tblcoupons'
      }
    )
    return Coupons
  }
  