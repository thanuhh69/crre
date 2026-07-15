import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    mediaType: {
        type: String,
        enum: ["image", "video", "pdf", "none"],
        default: "image"
    },
    media: {
        type: String
    },
    caption:{
        type:String
    },
    category: { 
        type: String, 
        enum: ["Certificate", "Project", "Research Paper", "Internship", "Workshop", "Hackathon", "Achievement", "Technical Blog", "Event", "Project Reel"],
        default: "Project"
    },
    projectTitle: { type: String, default: "" },
    techStack: { type: String, default: "" },
    githubRepo: { type: String, default: "" },
    liveDemo: { type: String, default: "" },
    linkedinPost: { type: String, default: "" },
    certificateIssuer: { type: String, default: "" },
    certificateDate: { type: Date },
    pdfUrl: { type: String, default: "" },
    likes:[
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        }
    ],
    comments:[
        {
        author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"},
        message:{
            type:String
        }
        }
    ]

}, { timestamps: true })

const Post = mongoose.model("Post",postSchema)
export default Post