const { Sequelize } = require("sequelize");

// const sequelize = new Sequelize(
//   'testerika_user',
//   'postgres',
//   'datacube',
//   {
//     dialect: 'postgres',
//     host:"localhost",
//     port:5432,
//     database:'testerika_user'
//   }
// )

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

const db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.User = require("./user")(sequelize, Sequelize);
db.UserAddress = require("./user_address")(sequelize, Sequelize);
db.UserCourses = require("./user_courses")(sequelize, Sequelize);
db.UserDeleteAccount = require("./user_delete_account")(sequelize, Sequelize);
db.UserDeviceInfo = require("./user_device_info")(sequelize, Sequelize);
db.UserEmailVerification = require("./user_email_verifications")(sequelize, Sequelize);
db.UserLoginActivities = require("./user_login_activities")(sequelize, Sequelize);
db.UserPasswordHistory = require("./user_password_history")(sequelize, Sequelize);
db.UserReferralCodes = require("./user_referral_codes")(sequelize, Sequelize);
db.UserSocialLogins = require("./user_social_logins")(sequelize, Sequelize);
db.UserOtp = require("./user_otp")(sequelize, Sequelize);
db.EmailTemplate = require("./email_template")(sequelize, Sequelize);
db.Pincodes = require("./pincodes")(sequelize, Sequelize);
db.ActiviyLogs = require("./activity_logs")(sequelize, Sequelize);
db.Feedbacks = require("./feedback")(sequelize, Sequelize);
db.BankDetail = require("./bank_detail")(sequelize, Sequelize);
db.UpiDetail = require("./upi_detail")(sequelize, Sequelize);
db.PanDetail = require("./pan_detail")(sequelize, Sequelize);
db.Verifications = require("./verification")(sequelize, Sequelize);




db.User.hasOne(db.UserAddress, { as: 'address', foreignKey: 'user_id' });
db.UserAddress.belongsTo(db.User, { foreignKey: "user_id" });

db.User.hasMany(db.UserCourses, { foreignKey: 'user_id' });
db.UserCourses.belongsTo(db.User, { foreignKey: "user_id" });

db.User.hasOne(db.UserDeleteAccount, { foreignKey: 'user_id' });
db.UserDeleteAccount.belongsTo(db.User, { foreignKey: "user_id" });

db.User.hasOne(db.UserDeviceInfo, { as: 'device', foreignKey: 'user_id' });
db.UserDeviceInfo.belongsTo(db.User, { foreignKey: "user_id" });

db.User.hasOne(db.UserEmailVerification, { foreignKey: 'user_id' });
db.UserEmailVerification.belongsTo(db.User, { foreignKey: "user_id" });

db.User.hasMany(db.UserLoginActivities, { foreignKey: 'user_id' });
db.UserLoginActivities.belongsTo(db.User, { foreignKey: "user_id" });

db.User.hasMany(db.UserPasswordHistory, { foreignKey: 'user_id' });
db.UserPasswordHistory.belongsTo(db.User, { foreignKey: "user_id" });

db.User.hasOne(db.UserReferralCodes, { as: 'referral', foreignKey: 'user_id' });
db.UserReferralCodes.belongsTo(db.User, { foreignKey: "user_id" });

db.User.hasMany(db.UserSocialLogins, { foreignKey: 'user_id' });
db.UserSocialLogins.belongsTo(db.User, { foreignKey: "user_id" });

db.User.hasMany(db.UserOtp, { foreignKey: 'user_id' });
db.UserOtp.belongsTo(db.User, { foreignKey: "user_id" });

db.User.hasMany(db.Feedbacks, {as:"feedbacks", foreignKey: 'user_id' });
db.Feedbacks.belongsTo(db.User, { foreignKey: 'user_id' });

db.User.hasOne(db.BankDetail, { as: 'bank', foreignKey: 'user_id' });
db.BankDetail.belongsTo(db.User, { foreignKey: "user_id" });

db.User.hasOne(db.UpiDetail, { as: 'upi', foreignKey: 'user_id' });
db.UpiDetail.belongsTo(db.User, { foreignKey: "user_id" });

db.User.hasOne(db.PanDetail, { as: 'pan', foreignKey: 'user_id' });
db.PanDetail.belongsTo(db.User, { foreignKey: "user_id" });

db.BankDetail.hasOne(db.Verifications, { as: 'verification', foreignKey: 'kyc_id' });
db.Verifications.belongsTo(db.BankDetail, { foreignKey: "kyc_id" });

db.PanDetail.hasOne(db.Verifications, { as: 'verification', foreignKey: 'kyc_id' });
db.Verifications.belongsTo(db.PanDetail, { foreignKey: "kyc_id" });

db.UpiDetail.hasOne(db.Verifications, { as: 'verification', foreignKey: 'kyc_id' });
db.Verifications.belongsTo(db.UpiDetail, { foreignKey: "kyc_id" });


module.exports = db;
