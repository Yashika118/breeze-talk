import express from "express";
import {signup,login,logout, updateProfile, checkAuth} from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";
const router=express.Router();

// router.post("/signup",(req,res)=>{
//     res.send("signup route");
    //  we can separate these functions into controller folder for clean code
// })



router.post("/signup",signup);

router.post("/login",login);

router.post("/logout",logout);

// for protectRoute we use file auth.middleware.js
router.put("/update-profile",protectRoute,updateProfile);

router.get("/check",protectRoute,checkAuth);

export default router;