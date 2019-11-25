var express = require('express');
var router = express.Router();
const queries = require('../modules/queries');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// path function must be exported in modules/queries.js
router.post('/create', queries.create);
router.get('/read/:id', queries.read);
router.get('/readAll', queries.readAll);
router.patch('/update', queries.update);
router.delete('/delete/:id', queries.deleteBike);

module.exports = router;
