const bcryptJS=require("bcryptjs")
const JWT=require("jsonwebtoken")
// const API_URL="http://localhost:6008/api/common/option"
// const API_URL_PAYMENT="http://localhost:6006/api/conferenceQuiz/quiz/payment-gateway"
// const API_URL_QUIZ="http://localhost:6006/api/conferenceQuiz/quiz"
// const COMMON_URL="http://localhost:6008/api/common"
const API_URL="https://api.testerika.com/api/common/option"
const API_URL_PAYMENT="https://api.testerika.com/api/conferenceQuiz/quiz/payment-gateway"
const API_URL_QUIZ="https://api.testerika.com/api/conferenceQuiz/quiz"
const COMMON_URL="https://api.testerika.com/api/common"


const hashPassword=async (password)=>{
    const hashPassword=await bcryptJS.hash(password,12)
    if(hashPassword)
        return hashPassword
}

const decryptPassword=async (password,databasePassword)=>{
    const hashPassword=await bcryptJS.compare(password,databasePassword)
    if(hashPassword)
        return true
    else
        return false
}

const createTokenForAuthentication=async (id)=>{
    const token = await JWT.sign(
        { id },
        process.env.TOKEN_KEY,
        {
            expiresIn: "7h",
        }
    );
    if(token){
        return token
    }
}

module.exports={hashPassword,decryptPassword,createTokenForAuthentication,API_URL,API_URL_PAYMENT,API_URL_QUIZ,COMMON_URL}
