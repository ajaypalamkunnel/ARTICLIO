import { Router } from "express";
import { ArticleRepository } from "../repositories/implementation/Article/ArticleRepositlry";
import ArticleService from "../services/implementation/Article/ArticleService";
import ArtileController from "../controller/implementation/Article/ArticleController";
import UserRepository from "../repositories/implementation/User/UserRepository";
import UserService from "../services/implementation/User/UserService";
import UserController from "../controller/implementation/User/UserController";


const router = Router()

const articleRepository = new ArticleRepository()
const articleService = new ArticleService(articleRepository)
const articleController = new ArtileController(articleService)

const userRepository = new UserRepository()
const userService = new UserService(userRepository)
const userController = new UserController(userService)


router.get("/get-all-category",(req,res)=>{
    articleController.getpaginatedCategory(req,res)
})

router.post("/registration",(req,res)=>{
    userController.registerUser(req,res)
})

router.post("/resend-otp",(req,res)=>{
    userController.resendOtp(req,res)
})

router.post("/verify-otp",(req,res)=>{
    userController.verifyOtp(req,res)
})

router.post("/login",(req,res)=>{
    userController.postLogin(req,res)
})


export default router