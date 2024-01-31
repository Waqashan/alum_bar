const express=require("express");
const router=express.Router();
const contrl=require('../controller/contrller')
const middlware=require("../middle/mddle")

// product controller



router.post('/signup',contrl.signup);
router.post('/login',contrl.login);
// router.post('/forgot-password',contrl.forgotPassword);
router.get('/getdata',middlware.authVerify,contrl.getdata);
router.post('/forgot-password',contrl.forgotPassword);
router.post('/reset=password',contrl.resetpassword);





module.exports = router;