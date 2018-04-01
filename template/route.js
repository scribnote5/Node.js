const express = require('express');
const router = express.Router();
router.get('/', (req, res) => {
    // pug 파일을 전송
    res.render('main');
});
router.get('/about', (req, res) => {
    // pug 파일을 전송
    res.render('about');
});
module.exports = router;