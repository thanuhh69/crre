import express from "express"
import isAuth from "../middlewares/isAuth.js"

import { upload } from "../middlewares/multer.js"
import { comment, deletePost, getAllPosts,like, saved, uploadPost } from "../controllers/post.controllers.js"


const postRouter=express.Router()

postRouter.post("/upload",isAuth,upload.fields([
    { name: "media", maxCount: 1 },
    { name: "pdf", maxCount: 1 }
]),uploadPost)
postRouter.get("/getAll",isAuth,getAllPosts)
postRouter.get("/like/:postId",isAuth,like)
postRouter.get("/saved/:postId",isAuth,saved)
postRouter.post("/comment/:postId",isAuth,comment)
postRouter.delete("/delete/:postId",isAuth,deletePost)

export default postRouter
