const { Sequelize } = require('sequelize')


//  const sequelize=new Sequelize(
//   "testerika_wallet","postgres","datacube",{
//     dialect:"postgres",
//     host:"localhost",
//     port:5432,
//     database:"testerika_wallet"
//   }
//  )



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

db.WalletTransactions = require('./wallet_transactions')(sequelize, Sequelize)
db.WithdrawRequests = require('./withdraw_requests')(sequelize, Sequelize)
db.PaymentSupports = require('./payment_supports')(sequelize, Sequelize)

module.exports = db
