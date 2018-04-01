/*
 [컬렉션]
 SQL 테이블
 */

const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    id: {type: String, required: true, unique: true},
    pw: String,
    data: Object,
    created_at: {type : Date, index : {unique : false }, 'default' : Date.now}
});
// model로 User라는 것을 만들어 exports 하면 다른 파일에서 User 모델 사용
// 몽고디비에는 users라는 컬렉션이 생김
module.exports = mongoose.model('UserModel', userSchema);