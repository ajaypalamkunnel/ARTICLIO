import { Router } from "express";
import { ArticleRepository } from "../repositories/implementation/Article/ArticleRepositlry";
import ArticleService from "../services/implementation/Article/ArticleService";
import ArtileController from "../controller/implementation/Article/ArticleController";
import UserRepository from "../repositories/implementation/User/UserRepository";
import UserService from "../services/implementation/User/UserService";
import UserController from "../controller/implementation/User/UserController";
import authMiddleWare from "../middleware/authMiddleware";
import {upload} from "../utils/multerStorage"

const router = Router()

const userRepository = new UserRepository()
const userService = new UserService(userRepository)
const userController = new UserController(userService)

const articleRepository = new ArticleRepository()
const articleService = new ArticleService(articleRepository,userRepository)
const articleController = new ArtileController(articleService,userService)


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

router.post("/post-article",authMiddleWare,upload.array("images",5),(req,res)=>{
    articleController.createArticle(req,res)
})


router.get("/articles",authMiddleWare,(req,res)=>{
    articleController.getArticles(req,res)
})
router.get("/my-articles",authMiddleWare,(req,res)=>{
    articleController.getMyArticles(req,res)
})


router.get("/categories",authMiddleWare,(req,res)=>{
    articleController.getAllCategory(req,res)
})


router.post('/interact',authMiddleWare,(req,res)=>{
    articleController.interact(req,res)
})


router.post("/get-interactions",authMiddleWare,(req,res)=>{
    articleController.getUserInteractions(req,res)
})

export default router