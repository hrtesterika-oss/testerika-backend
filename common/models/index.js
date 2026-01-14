const { Sequelize } = require("sequelize");

// const sequelize = new Sequelize(
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


// localhost 
// const sequelize = new Sequelize("testerika_common","postgres","datacube",
//   {
//     dialect: "postgres",
//     host:"localhost",
//     port:5432,
//     database: "testerika_common",
//   }
// );

const db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.Sliders = require('./slider')(sequelize, Sequelize);
db.Currencies = require('./currency')(sequelize, Sequelize);
db.Options = require('./options')(sequelize, Sequelize);
db.Books = require('./book')(sequelize, Sequelize);
db.BookCourses = require('./book_courses')(sequelize, Sequelize);
db.Coupons = require('./coupon')(sequelize, Sequelize);
// db.CouponUses = require('./coupon_uses')(sequelize, Sequelize);
// db.CouponDates = require('./coupon_dates')(sequelize, Sequelize);
db.Courses = require('./courses')(sequelize, Sequelize);
db.CourseCategories = require('./course_categories')(sequelize, Sequelize);
db.Notifications = require('./notification')(sequelize, Sequelize);
db.DismissNotifications = require('./dismiss_notifications')(sequelize, Sequelize);
db.Roles = require('./roles')(sequelize, Sequelize);
db.RolePermissions = require('./role_permissions')(sequelize, Sequelize);
db.Permissions = require('./permissions')(sequelize, Sequelize);
db.Staff = require('./staff')(sequelize, Sequelize);
db.Sponsors = require('./sponsors')(sequelize, Sequelize);
db.SponsorshipProgram = require('./sponsorship_programs')(sequelize, Sequelize);
db.SponsorshipSubscriptions = require('./sponsorship_subscriptions')(sequelize, Sequelize);
db.StaffPermissions = require('./staff_permissions')(sequelize, Sequelize);
db.Subjects = require('./subjects')(sequelize, Sequelize);
db.SubjectCourses = require('./subject_courses')(sequelize, Sequelize);
db.StaffEmailOtp=require("./staff_email_otp")(sequelize,Sequelize)
db.Passes=require("./passes")(sequelize,Sequelize)
db.PassType=require("./pass_type")(sequelize,Sequelize)
db.PassTypeFeature=require("./pass_type_features")(sequelize,Sequelize)
db.ResellerSales=require("./reseller_sales")(sequelize,Sequelize)

db.PassType.hasMany(db.Passes,{as:"passes",foreignKey:"pass_type_id"})
db.Passes.belongsTo(db.PassType,{foreignKey:"pass_type_id"})
db.PassType.hasMany(db.PassTypeFeature,{as:"features",foreignKey:"pass_type_id"})
db.PassTypeFeature.belongsTo(db.PassType,{foreignKey:"pass_type_id"})

// db.Subjects.hasMany(db.SubjectCourses, { as: 'courses', foreignKey: 'subject_id' });
// db.SubjectCourses.belongsTo(db.Subjects, { foreignKey: "subject_id" });

db.Staff.hasMany(db.StaffPermissions, { as: 'permissions', foreignKey: 'staff_id' });
db.StaffPermissions.belongsTo(db.Staff, { foreignKey: 'staff_id' });

db.Permissions.hasOne(db.RolePermissions, { as: 'role_permission', foreignKey: 'permission_id' });
db.RolePermissions.belongsTo(db.Permissions, { foreignKey: 'permission_id' });


db.Permissions.hasMany(db.StaffPermissions, { as: 'staff_permission', foreignKey: 'permission_id' });
db.StaffPermissions.belongsTo(db.Permissions, { foreignKey: 'permission_id' });


db.Roles.hasMany(db.RolePermissions, { as: 'permissions', foreignKey: 'role_id' });
db.RolePermissions.belongsTo(db.Roles, { foreignKey: 'role_id' });

db.Roles.hasMany(db.Staff, { as: 'assigned_to', foreignKey: 'role_id' })
db.Staff.belongsTo(db.Roles, { foreignKey: 'role_id' })

// db.Courses.hasMany(db.CourseCategories, { as: 'course_category', foreignKey: 'course_id' });
// db.CourseCategories.belongsTo(db.Courses, { as: 'courses', foreignKey: "course_id" });
  db.CourseCategories.hasMany(db.Courses,{as:'courses',foreignKey:"category_id"})
  db.Courses.belongsTo(db.CourseCategories,{foreignKey:"category_id"})


// db.Coupons.hasOne(db.CouponUses, { as: 'coupon_uses', foreignKey: 'coupon_id' });
// db.CouponUses.belongsTo(db.Coupons, { foreignKey: "coupon_id" });

// db.Coupons.hasOne(db.CouponDates, { as: 'coupon_dates', foreignKey: 'coupon_id' });
// db.CouponDates.belongsTo(db.Coupons, { foreignKey: "coupon_id" });

db.Courses.hasMany(db.BookCourses,{as:"bookCourses",foreignKey:"course_id"})
db.BookCourses.belongsTo(db.Courses,{foreignKey:"course_id"})

db.Books.hasMany(db.BookCourses, { as: 'courses', foreignKey: 'book_id' });
db.BookCourses.belongsTo(db.Books, { foreignKey: "book_id" });

module.exports = db;
