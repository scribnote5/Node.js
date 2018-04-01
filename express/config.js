// 설정 파일
module.exports = {
    serverPort: 8080,
    dbUrl: 'localhost:27017/local',
    dbSchemas: [
        {file:'./db/userSchema', collection:'./db/users', schemaName:'./db/UserSchema', modelName:'./db/UserModel'}
    ],
    route_info: [
        //===== User =====//
        {file:'./user', path:'/process/login', method:'login', type:'post'}					// user.login
        ,{file:'./user', path:'/process/adduser', method:'adduser', type:'post'}				// user.adduser
        ,{file:'./user', path:'/process/listuser', method:'listuser', type:'post'}			// user.listuser
    ]
}