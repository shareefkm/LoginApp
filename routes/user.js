var express = require('express');
const { response } = require('../app');
var router = express.Router();
const userHelpers = require('../helpers/user-helpers')

/* GET home page. */
router.get('/', function(req, res, next) {
  let user = req.session.user
  res.render('index', { title: 'LoginApp',user });
});
router.get('/signup',(req,res)=>{
  res.render('user/signUp',{"userStatus":req.session.userStatus})
  req.session.userStatus = false;
})
router.post('/signup',(req,res)=>{
  userHelpers.doSignup(req.body).then((response)=>{
    if(response.status){
      console.log(response)
      res.redirect('login')
    }else{
      req.session.userStatus=true
      res.redirect('signup')
    }
  })
})
router.get('/login',(req,res)=>{
  if(req.session.user){
    res.redirect('/')
  }else{
    res.render('user/login',{"passErr":req.session.passErr,"userErr":req.session.userErr})
    req.session.passErr = false
    req.session. userErr = false;
  }
})
router.post('/login',(req,res)=>{
  userHelpers.doLogin(req.body).then((response)=>{
    if(response.status){
      req.session.user = response.user
      req.session.userLogedIn = true;
      res.redirect('/')
    }else if(response.passErr){
      req.session.passErr = true;
        res.redirect('login')
      }else{
        req.session.userErr = true;
        res.redirect('login') 
      
    }
  })
})
router.get('/logout',(req,res)=>{
  req.session.destroy()
  res.redirect('/')
})

module.exports = router;
