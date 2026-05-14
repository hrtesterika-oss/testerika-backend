
module.exports=(sequelize,Sequelize)=>{
    const StaffEmailOtp=sequelize.define('tbl_staff_email_otp',{
        id:{
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        email:{
            type:Sequelize.STRING
        },
        expires:{
            type:Sequelize.DATE
        },
        otp:{
            type:Sequelize.INTEGER
        },
        createdAt:{
            type:Sequelize.DATE,
            allowNull:false
        },
        updatedAt:{
            type:Sequelize.DATE,
            allowNull:false
        },
        deletedAt:{
            type:Sequelize.DATE,
        }
    },
    {
    tableName:"tbl_staff_email_otp"
    })
    return StaffEmailOtp
}

