var express = require('express');
var router = express.Router();
const queries = require('../modules/queries');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// path function must be exported in modules/queries.js
router.post('/create', queries.create);
router.get('/get', queries.get);
router.get('/getAll', queries.getAll);
router.patch('/update', queries.update);
router.delete('/delete/:id', queries.delete);

module.exports = router;
