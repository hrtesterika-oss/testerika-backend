const jwt = require("jsonwebtoken");

const config = process.env;

const checkUserAuthorizedOrNot = async (req, res, next) => {
  try {
    let authorizedDevice=req.header.useragent
    if(authorizedDevice.browser==="okhttp" || authorizedDevice.browser==="okhttps" || authorizedDevice.browser==="Chrome"){
      return next()
    }
    else{
      return res.status(401).json({
        success:false,
        statusCode:401,
        message:"You are not authorized to access"
      })
    }
  } catch (err) {
    return res.status(401).json({
      success:false,
      statusCode:401,
      message:"You are not authorized to access"
    });
  }
};

module.exports = checkUserAuthorizedOrNot;