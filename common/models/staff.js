module.exports = (sequelize, Sequelize) => {
  const Staff = sequelize.define(
    'tblstaff',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      first_name: {
        type: Sequelize.STRING
      },
      last_name: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      phone_number: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      profile_image: {
        type: Sequelize.STRING
      },
      last_login: {
        type: Sequelize.DATE
      },
      last_password_change: {
        type: Sequelize.DATE
      },
      admin: {
        type: Sequelize.BOOLEAN,
        defaultValue:false
      },
      role_id: {
        type: Sequelize.INTEGER
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
      tableName: 'tblstaff'
    }
  )
  return Staff
}
