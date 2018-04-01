// 템플릿

/*
 [Pug(Jade)]
 템플릿 엔진
 들여쓰기에 주의
 */

const express = require('express');
const path = require('path');
const app = express();
const route = require('./route.js');

// 엔진을 pug로 설정
app.set('view engine', 'pug');
// pug 파일들이 있는 폴더 설정
app.set('views', path.join(__dirname, 'html'));
app.use(express.static(path.join(__dirname, 'html')));
app.use('/', route);
// 에러 처리 부분
app.listen(8080, () => {
    console.log('Express App on port 8080!');
});