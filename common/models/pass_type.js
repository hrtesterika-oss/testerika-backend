module.exports = (sequelize, Sequelize) => {
    const PassType = sequelize.define(
      'tblpass_type',
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        name: {
          type: Sequelize.STRING
        },
        visible:{
          type:Sequelize.INTEGER
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
        tableName: 'tblpass_type'
      }
    )
    return PassType
  }
  