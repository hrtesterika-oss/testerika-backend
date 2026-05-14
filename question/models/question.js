module.exports = (sequelize, Sequelize) => {
  const Questions = sequelize.define(
    "tblquestions",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      question_bank_id: {
        type: Sequelize.INTEGER
      },
      question: {
        type: Sequelize.TEXT
      },
      language: {
        type: Sequelize.STRING
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
      tableName: "tblquestions",
    }
  );
  return Questions;
};
