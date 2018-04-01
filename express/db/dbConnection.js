/*
 [mongodb 설치]
 1) cmd로 설치 경로 이동
 ex) cd C:\Program Files\MongoDB\Server\3.4\bin
 2) 데이터를 만들 저장소에 mongod --dbpath 명령 실행
 ex) mongod --dbpath C:\Users\scribnote5\Desktop\Database\mongodb
 3) *cmd창을 실행 중인 상태로 놔두고* 새로운 cmd 창으로 실행
 ex) cd C:\Program Files\MongoDB\Server\3.4\bin, mongo

 [db 지정]
 use local
 [데이터 추가]
 db.users.insert({id:'sdy',pw:'123',grade:'root'})
 [데이터 검색]
 db.users.find().pretty()
 [데이터 삭제]
 db.users.remove({name:/data/}) => 정규식 사용
 */

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const config = require('../config');

module.exports = () => {
    function connect() {
        mongoose.createConnection(config.dbUrl, function(err) {

            if (err) {
                console.error('mongodb connection error', err);
            } else {
                console.log('mongodb connected');
            }
        });
    }

    connect();
    mongoose.connection.on('disconnected', connect); // 연결 끊어진 경우 재연결
};

