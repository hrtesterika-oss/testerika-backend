// Local microservice URLs (override via .env when deploying).
const API_URL =
  process.env.API_URL || 'http://localhost:6008/api/common/option';
const QUESTION_BANK_URL =
  process.env.QUESTION_BANK_URL ||
  'http://localhost:6002/api/question/questionBank';
const QUESTION_URL =
  process.env.QUESTION_URL || 'http://localhost:6002/api/question/question';
const QUIZ_URL =
  process.env.QUIZ_URL || 'http://localhost:6003/api/quiz/quiz';
const PAYMENT_GATEWAY_API_KEY =
  process.env.PAYMENT_GATEWAY_API_KEY ||
  'http://localhost:6006/api/conferenceQuiz/quiz/payment-gateway';
const PASSES_API_URL =
  process.env.PASSES_API_URL || 'http://localhost:6008/api/common/passes';
const USER_URL =
  process.env.USER_URL || 'http://localhost:6001/api/user/user';

module.exports = {
  API_URL,
  QUESTION_BANK_URL,
  PAYMENT_GATEWAY_API_KEY,
  PASSES_API_URL,
  QUESTION_URL,
  QUIZ_URL,
  USER_URL,
};
