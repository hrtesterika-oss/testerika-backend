'use strict';
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5006;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Generic stub helper ──────────────────────────────────────────────────────
const ok = (data = null) => (req, res) =>
  res.status(200).json({ success: true, data, message: 'stub response' });

const emptyList = ok([]);
const emptyObj  = ok({});

// ─── Auth routes ─────────────────────────────────────────────────────────────
const auth = express.Router();
auth.get('/',             emptyList);
auth.get('/:id',          emptyObj);
auth.post('/',            ok({ id: 1 }));
auth.post('/login',       ok({ token: 'stub-token', user: {} }));
auth.post('/register',    ok({ id: 1 }));
auth.put('/:id',          ok());
auth.delete('/:id',       ok());
app.use('/api/conferenceQuiz/auth', auth);

// ─── Quiz routes ─────────────────────────────────────────────────────────────
const quiz = express.Router();
quiz.get('/',                      emptyList);
quiz.get('/admin',                 emptyList);
quiz.get('/admin-setting',         emptyObj);
quiz.get('/payment-gateway',       emptyObj);
quiz.get('/payment-gateway/getPaymentGatewayCredentials/:type', emptyObj);
quiz.get('/getPaymentGatewayCredentials/:type',                 emptyObj);
quiz.get('/getPins/:id',           emptyList);
quiz.get('/shareIndex/:id',        emptyObj);
quiz.get('/pin/:id',               emptyObj);
quiz.get('/start/:id',             emptyObj);
quiz.get('/book',                  emptyList);
quiz.get('/course',                emptyList);
quiz.get('/:id',                   emptyObj);
quiz.post('/',                     ok({ id: 1 }));
quiz.post('/pin',                  ok({ id: 1 }));
quiz.post('/getResult',            emptyObj);
quiz.post('/showRank',             emptyObj);
quiz.put('/:id',                   ok());
quiz.delete('/:id',                ok());
app.use('/api/conferenceQuiz/quiz', quiz);

// ─── Quiz admin sub-routes ────────────────────────────────────────────────────
const quizAdmin = express.Router();
quizAdmin.all('*', ok([]));
app.use('/api/conferenceQuiz/quiz/admin', quizAdmin);

// ─── Payment gateway sub-route ────────────────────────────────────────────────
const paymentGateway = express.Router();
paymentGateway.all('*', emptyObj);
app.use('/api/conferenceQuiz/quiz/payment-gateway', paymentGateway);

// ─── Template routes ──────────────────────────────────────────────────────────
const template = express.Router();
template.get('/',    emptyList);
template.get('/:id', emptyObj);
template.post('/',   ok({ id: 1 }));
template.put('/:id', ok());
template.delete('/:id', ok());
app.use('/api/conferenceQuiz/template', template);

// ─── Poll routes ──────────────────────────────────────────────────────────────
const poll = express.Router();
poll.all('*', (req, res) => res.status(200).json({ success: true, data: [], message: 'stub' }));
app.use('/api/conferenceQuiz/poll', poll);

// ─── Web admin-setting routes ─────────────────────────────────────────────────
const webAdmin = express.Router();
webAdmin.all('*', (req, res) => res.status(200).json({ success: true, data: {}, message: 'stub' }));
app.use('/api/conferenceQuiz/web/admin-setting', webAdmin);

// ─── Fallback ─────────────────────────────────────────────────────────────────
app.all('/api/conferenceQuiz/*', (req, res) => {
  console.log(`[STUB] ${req.method} ${req.path}`);
  res.status(200).json({ success: true, data: null, message: 'stub fallback' });
});

app.listen(PORT, () => {
  console.log(`[conferenceQuiz STUB] running on port ${PORT}`);
});
