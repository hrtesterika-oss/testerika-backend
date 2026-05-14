module.exports = (sequelize, Sequelize) => {
    const PassTypeFeatures = sequelize.define(
      'tblpass_type_features',
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        pass_type_id: {
          type: Sequelize.INTEGER
        },
        feature:{
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
        }
      },
      {
        tableName: 'tblpass_type_features'
      }
    )
    return PassTypeFeatures
  }
  