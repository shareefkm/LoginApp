const express = require('express');
// const { response } = require('../app');
const adminHelperse = require('../helpers/admin-helperse');
const router = express.Router();
const userHelpers = require('../helpers/user-helpers')
const nocache = require('nocache');
const { response } = require('../app');
const admin = true

router.get('/',(req,res)=>{
  if(req.session.adminLoggedIn){
    userHelpers.getAllUser().then((users)=>{
      res.render('admin/home',{admin,users,"adminLoggedIn":req.session.adminLoggedIn})
    })
  }else{
    res.redirect('/admin/login')
  }
})
router.get('/login',(req,res)=>{
  if(req.session.adminLoggedIn){
    res.redirect('/admin')
  }else{
    res.render('admin/adminLogin',{admin,"adminErr":req.session.adminErr,"passErr":req.session.adminPassErr})
    req.session.adminErr = false
    req.session.adminPassErr = false
  }
})

router.post('/login',(req,res)=>{
  adminHelperse.doLogin(req.body).then((response)=>{
    if(response.status){
      req.session.admin = response.admin
      req.session.adminLoggedIn = true
      res.redirect('/admin')
    }else if(response.adminPass){
      req.session.adminPassErr = true
      res.redirect("/admin/login")
    }else{
      req.session.adminErr = true
      res.redirect("/admin/login")
    }
  })
})
router.get('/logout',(req,res)=>{
  req.session.destroy()
  console.log('logged')
  res.redirect('/admin/login')
})
router.get('/deleteUser',(req,res)=>{
  adminHelperse.deleteUser(req.query.id).then(()=>{
    res.redirect('/admin')
  })
})
router.get('/editUser/:id',async(req,res)=>{
  if(req.session.adminLoggedIn){
    let editUser = await userHelpers.getUser(req.params.id)
    res.render('admin/editUser',{admin,editUser,"adminLoggedIn":req.session.adminLoggedIn})
  }else{
    res.redirect('/admin/login')
  }  
})
router.post('/editUser/:id',(req,res)=>{
  const id = req.params
  const body = req.body
  console.log(id,body)
  adminHelperse.editUser(id,body).then((el)=>{
    res.redirect('/admin')
  })
   
})
router.get('/addUser',(req,res)=>{
  if(req.session.adminLoggedIn){
    res.render('admin/addUser',{admin,"adminLoggedIn":req.session.adminLoggedIn})
  }else{
    res.redirect('/admin/login')
  }
})
router.post('/addUser',(req,res)=>{
  userHelpers.doSignup(req.body).then((response)=>{
    if(response.status){
      req.session.status=true
      res.redirect('/admin')
    }else{
      req.session.userStatus=true
      res.redirect('/admin/addUser')
    }
    // res.redirect('/admin')
  })
})


module.exports = router;
