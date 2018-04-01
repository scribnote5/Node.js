// 메인 서버

/*
 [Middleware]
 요청에 대한 응답 과정 중간에서 어떠한 동작을 하는 프로그램
 동작 순서 : 클라이언트 요청 => 미들웨어 처리 => 라우터 처리 => 클라이언트 응답
 express.static 도 미들웨어이며 express.static을 제외하고 다 분리되어 npm install 설치 필요

 [종류]
 Logger : Morgan, Winston
 페이지 압축 전송 : Compression
 Session : session
 POST : Body-parser
 Cookie : cookie-parser
 REST API : Method-override
 다른 도메인간의 Ajax : Cors
 File upload : Multer
 */

const express = require('express');
const app = express(); // express 객체 생성

const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override'); // REST API 사용시 필요

const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const multer = require('multer');
const compression = require('compression');
const cors = require('cors');

const db = require('./db/dbConnection.js'); // mongodb 실행
db();

const route = require('./route.js'); // 라우터
const config = require('./config.js'); // 설정 파일

/*
 [미들웨어 사용방법]
 미들웨어는 request, response를 매개변수로 받아 조작 가능
 마지막으로 next()를 하면 다음 미들웨어로 넘어가지만 next() 하지 않으면 더 이상 진행안됨
 에러가 발생했을 때는 next(error)처럼 next의 인자로 error 정보를 넣어 라우팅 부분으로 넘김
 안에 에러 객체를 넣어주었을 때 에러는 라우팅에서 처리
 */
app.use((req, res, next) => {
    // console.log('1 middleware run!');
    next();
});

/*
[static 미들웨어]
 실제 경로와 브라우저의 경로를 달리 해서 쉽게 서버 파일에 접근하지 못하도록 함
 */
// localhost:8080/html/except.pug (x)
// localhost:8080/static/except.pug (o)
app.use('/static', express.static(path.join(__dirname, 'html')));

app.use(compression());
app.use(cors());
app.use(cookieParser());
app.use(expressSession({
    secret: 'my key',
    resave: true,
    saveUninitialized: true
}));

/*
 [bodyParser 미들웨어]
 POST 방식 요청 파라미터 받음
 */
app.use(bodyParser.urlencoded({extended: true})); // body에 대한 url encoding 확장
app.use(bodyParser.json()); // bodyParser 객체의 json()을 사용하여 request body에 오는 데이터를 json으로 변환

app.use(methodOverride()); // PUT, DELETE를 지원 안 하는 클라이언트 지원



// 라우터 객체를 app 객체에 등록
// app.use('/test', route); => /test/about
app.use('/', route);

// 404 에러 처리
app.use((req, res, next) => {
    // console.log("404 error!");
    res.sendFile(path.join(__dirname, 'html', 'error.html'));
    //res.status(404).send('404 error');
    //next();
});

// next(err)로 넘겨줬던 에러가 최종적으로 도착하는 부분
// 이 부분이 없으면 next로 에러를 넘겨주었을 시 처리할 부분이 없어 서버가 죽음
// 에러를 기록하고 브라우저에 서버에서 에러가 발생했다고 알림
app.use((err, req, res, next) => { // 에러 처리 부분
    console.error(err.stack); // 에러 메시지 표시
    // console.log("500 error!");
    res.sendFile(path.join(__dirname, 'html', 'error.html'));
    // res.status(500).send('500 error!'); // 500 상태 표시 후 에러 메시지 전송
});

app.listen(config.serverPort, () => {
    console.log('Express App on port 8080!');
});
