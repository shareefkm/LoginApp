var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/signup',(req,res)=>{
  res.render('user/signUp')
})
router.post('/signup',(req,res)=>{
  console.log(req.body)
  res.redirect('/')
})
router.get('/login',(req,res)=>{
  res.render('user/login')
})

module.exports = router;
