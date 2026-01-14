const { Sequelize } = require('sequelize')




// const sequelize=new Sequelize("testerika_quiz","postgres","datacube",{
//   dialect:"postgres",
//   host:"localhost",
//   port:5432,
//   database:"testerika_quiz"
// })



//production
const sequelize = new Sequelize(
  process.env.DB_NAME || "testerika_production",
  process.env.DB_USER || "testerika_prod_user",
  process.env.DB_PASSWORD || "TestProd2024Secure",
  {
    dialect: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: 5432,
    database: process.env.DB_NAME || "testerika_production",
    logging: false
  }
);
const db = {}

db.sequelize = sequelize
db.Sequelize = Sequelize
db.Quizzes = require('./quiz')(sequelize, Sequelize)
db.QuizResults = require('./quiz_results')(sequelize, Sequelize)
db.QuizResultAnalysis = require('./quiz_result_analysis')(sequelize, Sequelize)
db.QuizQuestions = require('./quiz_questions')(sequelize, Sequelize)
db.QuizPrizeDetails = require('./quiz_prize_details')(sequelize, Sequelize)
db.QuizDates = require('./quiz_dates')(sequelize, Sequelize)
db.QuizCourses = require('./quiz_courses')(sequelize, Sequelize)
db.QuizTypes = require('./quiz_types')(sequelize, Sequelize)
db.UserRegistration=require("./user_registration_quiz")(sequelize,Sequelize)
db.QuizNotifications=require("./quiz_notifications")(sequelize,Sequelize)
db.PassageBank=require("./passage_bank")(sequelize,Sequelize)
db.Passage=require("./passages")(sequelize,Sequelize)

db.QuizReview=require("./quiz_review")(sequelize,Sequelize)

db.Quizzes.hasMany(db.QuizNotifications,{foreignKey:"quiz_id",as:"notifications"})
db.QuizNotifications.belongsTo(db.Quizzes,{foreignKey:"quiz_id"})
db.Quizzes.hasMany(db.QuizReview,{foreignKey:"quiz_id",as:"reviews"})
db.QuizReview.belongsTo(db.Quizzes,{foreignKey:"quiz_id"})


db.PassageBank.hasMany(db.Passage,{foreignKey:"passage_bank_id",as:"passages"})
db.Passage.belongsTo(db.PassageBank,{foreignKey:"passage_bank_id"})






db.Quizzes.hasMany(db.QuizResults, { foreignKey: 'quiz_id',as:"results" })
db.QuizResults.belongsTo(db.Quizzes, { foreignKey: 'quiz_id' })



db.Quizzes.hasMany(db.QuizResultAnalysis, { foreignKey: 'quiz_id' })
db.QuizResultAnalysis.belongsTo(db.Quizzes, { foreignKey: 'quiz_id' })


db.QuizResultAnalysis.hasMany(db.QuizResults, { foreignKey: 'result_analysis_id',as:"resultAnalysis" })
db.QuizResults.belongsTo(db.QuizResultAnalysis, { foreignKey: 'result_analysis_id' })



db.Quizzes.hasMany(db.QuizQuestions, { as: 'questions', foreignKey: 'quiz_id' })
db.QuizQuestions.belongsTo(db.Quizzes, { foreignKey: 'quiz_id' })

db.Quizzes.hasOne(db.QuizDates, { as: 'dates', foreignKey: 'quiz_id' })
db.QuizDates.belongsTo(db.Quizzes, { foreignKey: 'quiz_id' })

db.Quizzes.hasOne(db.QuizPrizeDetails, { as: 'prize', foreignKey: 'quiz_id' })
db.QuizPrizeDetails.belongsTo(db.Quizzes, { foreignKey: 'quiz_id' })

db.Quizzes.hasMany(db.QuizCourses, { as: 'courses', foreignKey: 'quiz_id' })
db.QuizCourses.belongsTo(db.Quizzes, { foreignKey: 'quiz_id' })

db.QuizTypes.hasMany(db.Quizzes, { foreignKey: 'quiz_type_id' })
db.Quizzes.belongsTo(db.QuizTypes, { foreignKey: 'quiz_type_id' })

db.Quizzes.hasMany(db.UserRegistration,{foreignKey:"quiz_id",as:"users"})
db.UserRegistration.belongsTo(db.Quizzes,{foreignKey:"quiz_id"})

module.exports = db
