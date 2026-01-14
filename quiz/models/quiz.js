module.exports = (sequelize, Sequelize) => {
  const Quizzes = sequelize.define(
    "tblquizzes",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      key: {
        type: Sequelize.STRING
      },
      subject_id: {
        type: Sequelize.INTEGER
      },
      quiz_type_id: {
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      duration: {
        type: Sequelize.INTEGER
      },
      total_questions: {
        type: Sequelize.INTEGER
      },
      marks: {
        type: Sequelize.DECIMAL
      },
      language: {
        type: Sequelize.STRING
      },
      question_choices:{
         type:Sequelize.STRING
      },
      question_added_to_quiz_type:{
        type:Sequelize.JSON
     },
     question_visibility:{
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
      tableName: "tblquizzes",
    }
  );
  return Quizzes;
};
