const { Sequelize } = require('sequelize')


// localhost

// const sequelize=new Sequelize("testerika_question","postgres","datacube",{
//   dialect:"postgres",
//   host:"localhost",
//   port:5432,
//   database:"testerika_question"
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
db.QuestionBanks = require('./question_banks')(sequelize, Sequelize)
db.Questions = require('./question.js')(sequelize, Sequelize)
db.QuestionCourses = require('./question_courses')(sequelize, Sequelize)
db.QuestionHints = require('./question_hints')(sequelize, Sequelize)
db.QuestionMarks = require('./question_marks')(sequelize, Sequelize)
db.QuestionOptions = require('./question_options')(sequelize, Sequelize)
db.QuestionSolutions = require('./question_solutions')(sequelize, Sequelize)
db.QuestionVerified = require('./question_verified')(sequelize, Sequelize)
db.ReportQuestion=require("./reportQuestion")(sequelize,Sequelize)
db.SavedQuestion=require("./savedQuestion.js")(sequelize,Sequelize)
db.PassageBanks=require("./passage_bank.js")(sequelize,Sequelize)
db.Passages=require("./passages.js")(sequelize,Sequelize)

db.QuestionBanks.hasMany(db.Questions, {
  as: 'questions',
  foreignKey: 'question_bank_id'
})
db.Questions.belongsTo(db.QuestionBanks, { foreignKey: 'question_bank_id' })

db.PassageBanks.hasMany(db.QuestionBanks, {
  as: 'questionBanks',
  foreignKey: 'passage_bank_id'
})
db.QuestionBanks.belongsTo(db.PassageBanks, { foreignKey: 'passage_bank_id' })


db.PassageBanks.hasMany(db.Passages, {
  as: 'passages',
  foreignKey: 'passage_bank_id'
})
db.Passages.belongsTo(db.PassageBanks, { foreignKey: 'passage_bank_id' })


db.Questions.hasOne(db.QuestionHints, { as: 'hint', foreignKey: 'question_id' })
db.QuestionHints.belongsTo(db.Questions, { foreignKey: 'question_id' })

db.QuestionBanks.hasMany(db.QuestionCourses, {
  as: 'courses',
  foreignKey: 'question_bank_id'
})
db.QuestionCourses.belongsTo(db.QuestionBanks, {
  foreignKey: 'question_bank_id'
})

db.Questions.hasMany(db.QuestionOptions, {
  as: 'options',
  foreignKey: 'question_id'
})
db.QuestionOptions.belongsTo(db.Questions, { foreignKey: 'question_id' })

db.Questions.hasOne(db.QuestionSolutions, {
  as: 'solution',
  foreignKey: 'question_id'
})
db.QuestionSolutions.belongsTo(db.Questions, { foreignKey: 'question_id' })

db.Questions.hasOne(db.QuestionVerified, {
  as: 'verified',
  foreignKey: 'question_id'
})
db.QuestionVerified.belongsTo(db.Questions, { foreignKey: 'question_id' })

db.QuestionBanks.hasOne(db.QuestionMarks, {
  as: 'marks',
  foreignKey: 'question_bank_id'
})
db.QuestionMarks.belongsTo(db.QuestionBanks, { foreignKey: 'question_bank_id' })


db.QuestionBanks.hasMany(db.ReportQuestion, {
  as: 'reportQuestions',
  foreignKey: 'question_bank_id'
})
db.ReportQuestion.belongsTo(db.QuestionBanks, { foreignKey: 'question_bank_id' })

db.Questions.hasMany(db.ReportQuestion, {
  as: 'reportQuestions',
  foreignKey: 'question_id'
})
db.ReportQuestion.belongsTo(db.Questions, { foreignKey: 'question_id' })


db.QuestionBanks.hasMany(db.SavedQuestion, {
  as: 'savedQuestions',
  foreignKey: 'question_bank_id'
})
db.SavedQuestion.belongsTo(db.QuestionBanks, { foreignKey: 'question_bank_id' })

db.Questions.hasMany(db.SavedQuestion, {
  as: 'savedQuestions',
  foreignKey: 'question_id'
})
db.SavedQuestion.belongsTo(db.Questions, { foreignKey: 'question_id' })


module.exports = db
