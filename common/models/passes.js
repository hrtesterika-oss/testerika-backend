module.exports = (sequelize, Sequelize) => {
    const Passes = sequelize.define(
      'tblpasses',
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        pass_type_id:{
          type: Sequelize.INTEGER
        },
        pass_name: {
          type: Sequelize.STRING
        },
        duration:{
          type:Sequelize.STRING
        },
        price_inr: {
          type: Sequelize.DECIMAL
        },
        price_usd: {
          type: Sequelize.DECIMAL
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
      },
      {
        tableName: 'tblpasses'
      }
    )
    return Passes
  }
  