import uploadOnCloudinary from "../config/cloudinary.js"
import Story from "../models/story.model.js"
import User from "../models/user.model.js"

export const uploadStory = async (req, res) => {
    try {
        const user = await User.findById(req.userId)
        if (user.story) {
            await Story.findByIdAndDelete(user.story)
            user.story = null
        }

        const { mediaType } = req.body

        let media;
        if (req.file) {
            media = await uploadOnCloudinary(req.file.path)
        } else {
            return res.status(400).json({ message: "media is required" })
        }
        const story = await Story.create({
            author: req.userId, mediaType, media
        })
        user.story = story._id
        await user.save()
        const populatedStory = await Story.findById(story._id).populate("author", "name userName profileImage")
            .populate("viewers", "name userName profileImage")
        return res.status(200).json(populatedStory)
    } catch (error) {
        return res.status(500).json({ message: "story upload error" })
    }
}

export const viewStory = async (req, res) => {
    try {
        const storyId = req.params.storyId
        const story = await Story.findById(storyId)

        if (!story) {
            return res.status(400).json({ message: "story not found" })
        }

        const viewersIds = story.viewers.map(id => id.toString())
        if (!viewersIds.includes(req.userId.toString())) {
            story.viewers.push(req.userId)
            await story.save()
        }

        const populatedStory = await Story.findById(story._id).populate("author", "name userName profileImage")
            .populate("viewers", "name userName profileImage")
        return res.status(200).json(populatedStory)
    } catch (error) {
        return res.status(500).json({ message: "story view error" })
    }
}


export const getStoryByUserName=async (req,res)=>{
    try {
        const userName=req.params.userName
        const user=await User.findOne({userName})
        if(!user){
             return res.status(400).json({ message: "user not found" })
        }

        const story=await Story.find({
            author:user._id
        }).populate("viewers author")

         return res.status(200).json(story)
    } catch (error) {
         return res.status(500).json({ message: "story get by userName error" })
    }
}

export const getAllStories=async (req,res)=>{
    try {
        const currentUser=await User.findById(req.userId)
        const followingIds=currentUser.following

        const stories=await Story.find({
            author:{$in:followingIds}
        }).populate("viewers author")
           .sort({createdAt:-1})

           return res.status(200).json(stories)


    } catch (error) {
           return res.status(500).json({ message: "All story get error" })
    }
}

export const deleteStory = async (req, res) => {
    try {
        const storyId = req.params.storyId
        const story = await Story.findById(storyId)
        
        if (!story) {
            return res.status(404).json({ message: "Story not found" })
        }
        
        // Check if the user is the author of the story
        if (story.author.toString() !== req.userId.toString()) {
            return res.status(403).json({ message: "Unauthorized: You can only delete your own stories" })
        }
        
        // Set user's story field to null
        const user = await User.findById(req.userId)
        if (user.story && user.story.toString() === storyId.toString()) {
            user.story = null
            await user.save()
        }
        
        // Delete the story
        await Story.findByIdAndDelete(storyId)
        
        return res.status(200).json({ message: "Story deleted successfully", storyId })
    } catch (error) {
        console.error('deleteStory error', error)
        return res.status(500).json({ message: `delete story error ${error.message || error}` })
    }
}
