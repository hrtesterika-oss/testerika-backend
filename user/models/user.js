module.exports = (sequelize, Sequelize) => {
  const Users = sequelize.define(
    "tblusers",
    {
      id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      firstname: {
        type: Sequelize.STRING
      },
      lastname: {
        type: Sequelize.STRING
      },
      fathername: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      email_verified: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      phone: {
        type: Sequelize.STRING
      },
      phone_verified: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      dob: {
        type: Sequelize.STRING
      },
      gender: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      profile_image: {
        type: Sequelize.STRING
      },
      locale: {
        type: Sequelize.STRING
      },
      touchId_enable: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      status: {
        type: Sequelize.INTEGER,
        defaultValue:1
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
      userType:{
        type:Sequelize.STRING
      }
    },
    {
      tableName: "tblusers",
    }
  );
  return Users;
};
