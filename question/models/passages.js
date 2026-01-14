module.exports = (sequelize, Sequelize) => {
    const Passages = sequelize.define(
      "tblpassages",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        passage_bank_id: {
          type: Sequelize.INTEGER
        },
        passage: {
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
        tableName: "tblpassages",
      }
    );
    return Passages;
  };
  