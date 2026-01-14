const { Sequelize } = require("sequelize");

// const sequelize = new Sequelize(
//   'testerika_packages',
//   'postgres',
//   'datacube',
//   {
//     dialect: 'postgres',
//     host:"localhost",
//     port:5432,
//     database:'testerika_packages'
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
db.Packages = require("./packages")(sequelize, Sequelize);
db.SubPackages = require("./subpackages")(sequelize, Sequelize);
db.PackageCourses = require("./packagecourses")(sequelize, Sequelize);
db.PackageSubpackages = require("./packagesubpackages")(sequelize, Sequelize);
db.SubpackageCourses = require("./subpackagecourses")(sequelize, Sequelize);
db.SubPackageExams = require("./subpackageexams")(sequelize, Sequelize);
db.BundlePackages = require("./bundlepackages")(sequelize, Sequelize);
db.BundlePackageids = require("./bundlepackageids")(sequelize, Sequelize);
db.Packagesales = require("./packagesales")(sequelize, Sequelize);
db.Exams=require("./exams")(sequelize,Sequelize)
db.ExamTypes=require("./examTypes")(sequelize,Sequelize)
db.ExamSections=require("./examSections")(sequelize,Sequelize)
db.ExamCourses=require("./examCourses")(sequelize,Sequelize)
db.ExamSectionQuestions=require("./examSectionQuestions")(sequelize,Sequelize)
db.ExamResults=require("./examResults")(sequelize,Sequelize)
db.ExamResultAnalysis=require("./examResultAnalysis")(sequelize,Sequelize)
db.PackageCart=require("./packageCart")(sequelize,Sequelize)
db.PackageWishlist=require("./packageWishlist")(sequelize,Sequelize)
db.Transactions=require("./transaction")(sequelize,Sequelize)
db.ExamSectionResultAnalysis=require("./examSectionResultAnalysis")(sequelize,Sequelize)
db.SavedExamQuestion=require("./savedexamquestion")(sequelize,Sequelize)
db.ReportExamQuestion=require("./reportExamQuestion")(sequelize,Sequelize)
db.UserDoubt=require("./userDoubt")(sequelize,Sequelize)
db.UserDoubtSolution=require("./userDoubtSolution")(sequelize,Sequelize)
db.UserDoubtReport=require("./doubtReport")(sequelize,Sequelize)


db.Packages.hasMany(db.PackageCart,{as:"carts",foreignKey:"package_id"})
db.PackageCart.belongsTo(db.Packages,{foreignKey:"package_id"})


db.BundlePackages.hasMany(db.PackageCart,{as:"carts",foreignKey:"bundle_id"})
db.PackageCart.belongsTo(db.BundlePackages,{foreignKey:"bundle_id"})


db.Packages.hasMany(db.PackageWishlist,{as:"wishlists",foreignKey:"package_id"})
db.PackageWishlist.belongsTo(db.Packages,{foreignKey:"package_id"})


db.BundlePackages.hasMany(db.PackageWishlist,{as:"wishlists",foreignKey:"bundle_id"})
db.PackageWishlist.belongsTo(db.BundlePackages,{foreignKey:"bundle_id"})


db.Packages.hasMany(db.PackageSubpackages,{as:"subpackages",foreignKey:"packageid"})
db.PackageSubpackages.belongsTo(db.Packages,{foreignKey:"packageid"})

db.SubPackages.hasMany(db.PackageSubpackages,{as:"subpackages",foreignKey:"subpackageid"})
db.PackageSubpackages.belongsTo(db.SubPackages,{foreignKey:"subpackageid"})

db.Packages.hasMany(db.PackageCourses,{as:"packagecourses",foreignKey:"packageid"})
db.PackageCourses.belongsTo(db.Packages,{foreignKey:"packageid"})

db.SubPackages.hasMany(db.SubpackageCourses,{as:"subpackagecourses",foreignKey:"subpackageid"})
db.SubpackageCourses.belongsTo(db.SubPackages,{foreignKey:"subpackageid"})

db.BundlePackages.hasMany(db.BundlePackageids,{as:"bundlepackages",foreignKey:"bundleid"})
db.BundlePackageids.belongsTo(db.BundlePackages,{foreignKey:"bundleid"})

db.Packages.hasMany(db.BundlePackageids,{as:"bundlepackages",foreignKey:"packageid"})
db.BundlePackageids.belongsTo(db.Packages,{foreignKey:"packageid"})


db.Packages.hasMany(db.Packagesales,{as:"packagesales",foreignKey:"packageid"})
db.Packagesales.belongsTo(db.Packages,{foreignKey:"packageid"})

db.BundlePackages.hasMany(db.Packagesales,{as:"packagesales",foreignKey:"bundleid"})
db.Packagesales.belongsTo(db.BundlePackages,{foreignKey:"bundleid"})



db.SubPackages.hasMany(db.ExamResultAnalysis,{as:"examresultanalysis",foreignKey:"subpackageid"})
db.ExamResultAnalysis.belongsTo(db.SubPackages,{foreignKey:"subpackageid"})

db.SubPackages.hasMany(db.SubPackageExams,{as:"exams",foreignKey:"subpackageid"})
db.SubPackageExams.belongsTo(db.SubPackages,{foreignKey:"subpackageid"})

db.Exams.hasMany(db.SubPackageExams,{as:"exams",foreignKey:"examid"})
db.SubPackageExams.belongsTo(db.Exams,{foreignKey:"examid"})

db.ExamTypes.hasMany(db.Exams,{as:"exams",foreignKey:"examtypesid"})
db.Exams.belongsTo(db.ExamTypes,{foreignKey:"examtypesid"})


db.Exams.hasMany(db.ExamSections,{as:"examsections",foreignKey:"examid"})
db.ExamSections.belongsTo(db.Exams,{foreignKey:"examid"})

db.Exams.hasMany(db.ExamCourses,{as:"examcourses",foreignKey:"examid"})
db.ExamCourses.belongsTo(db.Exams,{foreignKey:"examid"})

db.ExamSections.hasMany(db.ExamSectionQuestions,{as:"questions",foreignKey:"examsectionid"})
db.ExamSectionQuestions.belongsTo(db.ExamSections,{foreignKey:"examsectionid"})


db.Exams.hasMany(db.ExamResultAnalysis,{as:"resultanalysis",foreignKey:"examid"})
db.ExamResultAnalysis.belongsTo(db.Exams,{foreignKey:"examid"})

db.ExamResultAnalysis.hasMany(db.ExamResults,{as:"examresults",foreignKey:"resultanalysisid"})
db.ExamResults.belongsTo(db.ExamResultAnalysis,{foreignKey:"resultanalysisid"})

db.ExamResultAnalysis.hasMany(db.ExamSectionResultAnalysis,{as:"examsections",foreignKey:"resultanalysisid"})
db.ExamSectionResultAnalysis.belongsTo(db.ExamResultAnalysis,{foreignKey:"resultanalysisid"})

db.Transactions.hasOne(db.Packagesales,{as:"sales",foreignKey:"transaction_id"})
db.Packagesales.belongsTo(db.Transactions,{foreignKey:"transaction_id"})



db.Packages.hasMany(db.ReportExamQuestion,{as:"reportquestions",foreignKey:"packageid"})
db.ReportExamQuestion.belongsTo(db.Packages,{foreignKey:"packageid"})

db.BundlePackages.hasMany(db.ReportExamQuestion,{as:"reportquestions",foreignKey:"bundleid"})
db.ReportExamQuestion.belongsTo(db.BundlePackages,{foreignKey:"bundleid"})



db.SubPackages.hasMany(db.ReportExamQuestion,{as:"reportquestions",foreignKey:"subpackageid"})
db.ReportExamQuestion.belongsTo(db.SubPackages,{foreignKey:"subpackageid"})


db.Exams.hasMany(db.ReportExamQuestion,{as:"reportquestions",foreignKey:"examid"})
db.ReportExamQuestion.belongsTo(db.Exams,{foreignKey:"examid"})

db.ExamSections.hasMany(db.ReportExamQuestion,{as:"reportquestions",foreignKey:"examsectionid"})
db.ReportExamQuestion.belongsTo(db.ExamSections,{foreignKey:"examsectionid"})


db.UserDoubt.hasMany(db.UserDoubtSolution,{as:"solutions",foreignKey:"doubt_id"})
db.UserDoubtSolution.belongsTo(db.UserDoubt,{foreignKey:"doubt_id"})


db.UserDoubt.hasMany(db.UserDoubtReport,{as:"reports",foreignKey:"doubt_id"})
db.UserDoubtReport.belongsTo(db.UserDoubt,{foreignKey:"doubt_id"})


module.exports = db;