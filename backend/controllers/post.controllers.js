import uploadOnCloudinary from "../config/cloudinary.js";
import Notification from "../models/notification.model.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import { getSocketId, io } from "../socket.js";

export const uploadPost = async (req, res) => {
    try {
        const { 
            caption, 
            mediaType, 
            category, 
            projectTitle, 
            techStack, 
            githubRepo, 
            liveDemo, 
            linkedinPost, 
            certificateIssuer, 
            certificateDate 
        } = req.body

        let media = "";
        if (req.files && req.files['media'] && req.files['media'][0]) {
            try {
                media = await uploadOnCloudinary(req.files['media'][0].path)
            } catch (err) {
                console.error('uploadOnCloudinary failed for media', err)
                return res.status(500).json({ message: `cloudinary upload failed ${err.message || err}` })
            }
        }

        let pdfUrl = "";
        if (req.files && req.files['pdf'] && req.files['pdf'][0]) {
            try {
                pdfUrl = await uploadOnCloudinary(req.files['pdf'][0].path)
            } catch (err) {
                console.error('uploadOnCloudinary failed for pdf', err)
                return res.status(500).json({ message: `cloudinary upload failed ${err.message || err}` })
            }
        }

        const post = await Post.create({
            caption, 
            media, 
            mediaType: mediaType || (media ? "image" : "none"), 
            author: req.userId,
            category,
            projectTitle,
            techStack,
            githubRepo,
            liveDemo,
            linkedinPost,
            certificateIssuer,
            certificateDate: certificateDate ? new Date(certificateDate) : undefined,
            pdfUrl
        })

        const user = await User.findById(req.userId)
        user.posts.push(post._id)
        await user.save()
        const populatedPost = await Post.findById(post._id).populate("author", "name userName profileImage department year rollNumber github linkedin portfolio")
        return res.status(201).json(populatedPost)
    } catch (error) {
        console.error('uploadPost error', error)
        return res.status(500).json({ message: `uploadPost error ${error.message || error}` })
    }
}


export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find({})
            .populate("author", "name userName profileImage department year rollNumber github linkedin portfolio")
            .populate("comments.author", "name userName profileImage").sort({ createdAt: -1 })
        return res.status(200).json(posts)
    } catch (error) {
        return res.status(500).json({ message: `getallpost error ${error}` })
    }
}

export const like = async (req, res) => {
    try {
        const postId = req.params.postId
        const post = await Post.findById(postId)
        if (!post) {
            return res.status(400).json({ message: "post not found" })
        }

        const alreadyLiked = post.likes.some(id => id.toString() == req.userId.toString())

        if (alreadyLiked) {
            post.likes = post.likes.filter(id => id.toString() != req.userId.toString())
        } else {
            post.likes.push(req.userId)
            if (post.author._id != req.userId) {
                const notification = await Notification.create({
                    sender: req.userId,
                    receiver: post.author._id,
                    type: "like",
                    post: post._id,
                    message:"liked your post"
                })
                const populatedNotification = await Notification.findById(notification._id).populate("sender receiver post")
                const receiverSocketId=getSocketId(post.author._id)
                if(receiverSocketId){
                    io.to(receiverSocketId).emit("newNotification",populatedNotification)
                }
            
            }
        }


        await post.save()
        await post.populate("author", "name userName profileImage")
        io.emit("likedPost", {
            postId: post._id,
            likes: post.likes
        })
        return res.status(200).json(post)
    } catch (error) {
        return res.status(500).json({ message: `likepost error ${error}` })
    }
}

export const comment = async (req, res) => {
    try {
        const { message } = req.body
        const postId = req.params.postId
        const post = await Post.findById(postId)
        if (!post) {
            return res.status(400).json({ message: "post not found" })
        }
        post.comments.push({
            author: req.userId,
            message
        })
         if (post.author._id != req.userId) {
                const notification = await Notification.create({
                    sender: req.userId,
                    receiver: post.author._id,
                    type: "comment",
                    post: post._id,
                    message:"commented on your post"
                })
                const populatedNotification = await Notification.findById(notification._id).populate("sender receiver post")
                const receiverSocketId=getSocketId(post.author._id)
                if(receiverSocketId){
                    io.to(receiverSocketId).emit("newNotification",populatedNotification)
                }
            
            }
        await post.save()
        await post.populate("author", "name userName profileImage"),
            await post.populate("comments.author")
        io.emit("commentedPost", {
            postId: post._id,
            comments: post.comments
        })
        return res.status(200).json(post)
    } catch (error) {
        return res.status(500).json({ message: `comment post error ${error}` })
    }
}

export const saved = async (req, res) => {
    try {
        const postId = req.params.postId
        const user = await User.findById(req.userId)


        const alreadySaved = user.saved.some(id => id.toString() == postId.toString())

        if (alreadySaved) {
            user.saved = user.saved.filter(id => id.toString() != postId.toString())
        } else {
            user.saved.push(postId)
        }
        await user.save()
        user.populate("saved")
        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json({ message: `saved  error ${error}` })
    }
}

export const deletePost = async (req, res) => {
    try {
        const postId = req.params.postId
        const post = await Post.findById(postId)
        
        if (!post) {
            return res.status(404).json({ message: "Post not found" })
        }
        
        // Check if the user is the author of the post
        if (post.author.toString() !== req.userId.toString()) {
            return res.status(403).json({ message: "Unauthorized: You can only delete your own posts" })
        }
        
        // Remove post from user's posts array
        const user = await User.findById(req.userId)
        user.posts = user.posts.filter(id => id.toString() !== postId.toString())
        await user.save()
        
        // Delete related notifications (optional but recommended)
        await Notification.deleteMany({ post: postId })
        
        // Delete the post
        await Post.findByIdAndDelete(postId)
        
        // Emit socket event to update all clients
        io.emit("deletedPost", { postId })
        
        return res.status(200).json({ message: "Post deleted successfully", postId })
    } catch (error) {
        console.error('deletePost error', error)
        return res.status(500).json({ message: `delete post error ${error.message || error}` })
    }
}
