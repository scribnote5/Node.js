// 라우팅

/*
 [라우팅]
 클라이언트에서 보내는 주소에 따라 다른 처리
 */

const express = require('express');

const app = express(); // express 객체 생성

const path = require('path');
const multer = require('multer'); // 파일 업로드

const methodOverride = require('method-override');
const bodyParser = require('body-parser');
// ...
app.use(methodOverride()); // PUT, DELETE를 지원 안 하는 클라이언트를 위해
app.use(bodyParser.json()); // body의 데이터를 json형식으로 받음
app.use(bodyParser.urlencoded({ extended: true })); // qs모듈로 쿼리스트링 파싱

// 파일 업로드
const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, callback) {
            callback(null, 'upload/');
        },
        filename: function (req, file, callback) {
            callback(null, file.originalname);
        }
    }),
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

const User = require('./db/user.js'); // db

const router = express.Router(); // 라우터 분리

/*
 [REST API]
 GET : 조회
 POST : 생성

 // 사용하려면 메소드 오버라이드 필요
 PUT : 전체 수정
 PATCH : 부분 수정
 DELETE : 삭제
 */



router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'login.html'));
});
router.get('/get/:name', (req, res) => {
    res.send(req.params.name);
});
router.post('/post', (req, res) => {
    console.log("post");
    console.log(req.body.id);
});
router.put('/put', (req, res) => {
    console.error('put!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
   // console.log(req.body.id);
    // res.sendFile(path.join(__dirname, 'html', 'post.html'));
    res.send("sadasdsasdsdasdasad");
});
router.get('/post', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'post.html'));
});

router.delete('/delete/:id', (req, res) => {
    console.log(req.body.id);
    res.sendFile(path.join(__dirname, 'html', 'post.html'));
});

// /loginCheck 뒤에 오는 값을 파라미터로 처리, :name을 토큰이라함
router.post('/paramCheck/:name', (req, res) => {
    console.log("로그인 클릭")
    console.log("action 태그의 토큰으로 받은 값 : " + req.params.name);
    console.log(req.body.id + ", " + req.body.pw);
});

/*
 [쿠키]
 */
router.get('/cookie', (req, res) => {
    console.log("쿠키 호출");

    res.cookie('user', {
        lid: 'sdy',
        name: '송대영'
    });

    res.send(req.cookies);
});

/*
 [세션]
 */
router.get('/session', (req, res) => {
    //console.log(req.session.user);
    if (req.session.user) {
        res.send('세션이 존재합니다.');
    } else {
        req.session.user = {
            id: 'sdy',
            name: '송대영'
        };
        res.send('세션이 존재하지 않으므로 세션을 생성합니다.');

    }
});
router.get('/sessionOut', (req, res) => {
    if (req.session.user) {
        req.session.destroy();  // 모든 세션 삭제
        //res.clearCookie('user'); // 쿠키 삭제
        res.send('세션이 존재하므로 세션을 제거합니다.');
    } else {
        res.send('세션이 존재하지 않습니다.');

    }
});
router.get('/fileUpload', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'fileUpload.html'));
});
/*
 [파일 업로드]
 */
/*
// 단일 파일 업로드
app.post('/up', upload.single('imageFile'), (req, res) => {
    console.log(req.file);
});

// 다중 파일 업로드 : name 같은 경우
router.post('/fileUpload', upload.array('imageFile'), (req, res) => {
    console.log(req.files);
});

// 다중 파일 업로드 : html에서 multiple 타입 업로드
// upload.fields('imageFile[]') 대신 upload.array('imageFile[]') 사용 가능
router.post('/fileUpload',upload.fields([{ name: 'imageFile[]' }]), (req, res) => {
    console.log(req.files);
});
*/

// 다중 파일 업로드 : name 다른 경우
router.post('/fileUpload', upload.fields([{name: 'imageFile'}, {name: 'imageFile2'}]), (req, res) => {
    console.log(req.files);
});

/*
 [db]
 */
// 로그인
router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'login.html'));
});
// 검색
router.post('/login', (req, res) => {
    var id = req.body.id;
    var pw = req.body.pw;

    console.log(id + ', ' + pw);

    User.find({"id": id, "pw": pw}, (err, user) => {
        if (err) {
            return console.error(err);
        }

        console.log("사용자를 조회합니다.");
        if (user.length > 0) {
            console.log("로그인 되었습니다. : " + user);
            res.sendFile(path.join(__dirname, 'html', 'main.html'));
        } else {
            console.log("로그인 실패하였습니다");
            res.sendFile(path.join(__dirname, 'html', 'login.html'));
        }
    });
});

// 회원가입
router.get('/join', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'join.html'));
});

// 데이터 추가
router.post('/join', (req, res) => {
    var id = req.body.id;
    var pw = req.body.pw;
    var data = req.body.data;

    console.log(id + ', ' + pw + ', ' + data);

    var user = new User({"id": id, "pw": pw, "daa": data});
    user.save(function (err, book) {
        if (err) {
            return console.error(err);
        }

        console.log("User 추가 " + user);
        res.sendFile(path.join(__dirname, 'html', 'join.html'));
    });

});

/*
 [주소 부분 와일드 카드]
 app.get('/post/:id') => /post/sdy, /post/ybh 가능
 app.get('/post/a') => URL이 post 방식으로 a가 오더라도 앞에 걸림

 와일드카드 라우터는 맨 뒤로 이동
*/

/*router.all('*', (req, res) => {
    console.log("all을 사용한 모든 route 에러 처리");
});*/

// 모듈로 만드는 부분
module.exports = router;