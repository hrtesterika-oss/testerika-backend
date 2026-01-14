module.exports=(sequelize,Sequelize)=>{
     const UserRegistration=sequelize.define(
        'tbl_user_registration_quiz',
       {
          id:{
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
          },
          user_id:{
            type:Sequelize.INTEGER,
          },
          quiz_id:{
            type:Sequelize.INTEGER,
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
            allowNull:true
          }
       },
       {
        tableName: "tbl_user_registration_quiz"
       }
     )
     return UserRegistration
    }