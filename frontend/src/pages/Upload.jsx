import React from 'react'
import { useState } from 'react';
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { FiPlusSquare } from "react-icons/fi";
import { useRef } from 'react';
import VideoPlayer from '../components/VideoPlayer';
import axios from 'axios';
import { serverUrl } from '../App';
import { useDispatch, useSelector } from 'react-redux';
import { setPostData } from '../redux/postSlice';
import { setCurrentUserStory, setStoryData } from '../redux/storySlice';
import { setLoopData } from '../redux/loopSlice';
import { ClipLoader } from 'react-spinners';
import { setUserData } from '../redux/userSlice';
function Upload() {
    const navigate = useNavigate()
    const [uploadType, setUploadType] = useState("post")
    const [frontendMedia, setFrontendMedia] = useState(null)
    const [backendMedia, setBackendMedia] = useState(null)
    const [mediaType, setMediaType] = useState("")
    const [caption,setCaption]=useState("")
    const [githubLink,setGithubLink]=useState("")
    const [linkedinLink,setLinkedinLink]=useState("")
    const [category, setCategory] = useState("Project")
    const [projectTitle, setProjectTitle] = useState("")
    const [techStack, setTechStack] = useState("")
    const [githubRepo, setGithubRepo] = useState("")
    const [liveDemo, setLiveDemo] = useState("")
    const [linkedinPost, setLinkedinPost] = useState("")
    const [certificateIssuer, setCertificateIssuer] = useState("")
    const [certificateDate, setCertificateDate] = useState("")
    const [backendPdf, setBackendPdf] = useState(null)
    const [frontendPdfName, setFrontendPdfName] = useState("")
    const [portfolioLink, setPortfolioLink] = useState("")
    const mediaInput = useRef()
    const dispatch=useDispatch()
    const {postData}=useSelector(state=>state.post)
     const {storyData}=useSelector(state=>state.story)
      const {loopData}=useSelector(state=>state.loop)
      const [loading,setLoading]=useState(false)
    const handleMedia = (e) => {
        const file = e.target.files[0]
        console.log(file)
        if (file.type.includes("image")) {
            setMediaType("image")
        } else {
            setMediaType("video")
        }
        setBackendMedia(file)
        setFrontendMedia(URL.createObjectURL(file))
    }

    const handlePdfChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setBackendPdf(file)
            setFrontendPdfName(file.name)
        }
    }

const uploadPost=async ()=>{
   
    try {
        const formData=new FormData()
        formData.append("caption",caption)
        formData.append("mediaType",mediaType || (backendMedia ? "image" : "none"))
        if (backendMedia) {
            formData.append("media",backendMedia)
        }
        formData.append("category",category)
        formData.append("projectTitle",projectTitle)
        formData.append("techStack",techStack)
        formData.append("githubRepo",githubRepo)
        formData.append("liveDemo",liveDemo)
        formData.append("linkedinPost",linkedinPost)
        formData.append("certificateIssuer",certificateIssuer)
        formData.append("certificateDate",certificateDate)
        if (backendPdf) {
            formData.append("pdf",backendPdf)
        }
        const result=await axios.post(`${serverUrl}/api/post/upload`,formData,{withCredentials:true})
       dispatch(setPostData([...postData,result.data]))
       setLoading(false)
       navigate("/")
    } catch (error) {
        console.log(error)
    }
}

const uploadStory=async ()=>{
    try {
        const formData=new FormData()
        formData.append("mediaType",mediaType)
        formData.append("media",backendMedia)
        const result=await axios.post(`${serverUrl}/api/story/upload`,formData,{withCredentials:true})
       dispatch(setCurrentUserStory(result.data))
         setLoading(false)
       navigate("/")
    } catch (error) {
        console.log(error)
    }
}
const uploadLoop=async ()=>{
    try {
        const formData=new FormData()
        formData.append("caption",caption)
        formData.append("media",backendMedia)
        formData.append("githubLink",githubLink)
        formData.append("linkedinLink",linkedinLink)
        formData.append("projectTitle",projectTitle)
        formData.append("techStack",techStack)
        formData.append("portfolioLink",portfolioLink)
        const result=await axios.post(`${serverUrl}/api/loop/upload`,formData,{withCredentials:true})
         dispatch(setLoopData([...loopData,result.data]))
         setLoading(false)
       navigate("/")
    } catch (error) {
        console.log(error)
    }
}

const handleUpload=()=>{
    setLoading(true)
    if(uploadType=="post"){
        uploadPost()
    }else if(uploadType=="story"){
        uploadStory()
    }else{
        uploadLoop()
    }
}

    return (
        <div className='w-full min-h-[100vh] bg-[#00509d] flex flex-col items-center pb-[100px] overflow-y-auto'>
            <div className='w-full h-[80px]  flex items-center gap-[20px] px-[20px]'>
                <MdOutlineKeyboardBackspace className='text-white cursor-pointer w-[25px]  h-[25px] ' onClick={() => navigate(`/`)} />
                <h1 className='text-white text-[20px] font-semibold'>Upload Media</h1>
            </div>

            <div className='w-[90%] max-w-[600px] h-[80px] bg-white/10 border border-white/20 rounded-full flex justify-around items-center gap-[10px] px-[10px] mb-4' >
                <div className={`${uploadType == "post" ? "bg-[#ffd100] text-black shadow-lg" : "text-white hover:bg-white/10"}  w-[28%] h-[80%] flex justify-center items-center text-[19px] font-semibold rounded-full cursor-pointer transition-all`} onClick={() => setUploadType("post")}>Post</div>
                <div className={`${uploadType == "story" ? "bg-[#ffd100] text-black shadow-lg" : "text-white hover:bg-white/10"}  w-[28%] h-[80%] flex justify-center items-center text-[19px] font-semibold rounded-full cursor-pointer transition-all`} onClick={() => setUploadType("story")}>Story</div>
                <div className={`${uploadType == "loop" ? "bg-[#ffd100] text-black shadow-lg" : "text-white hover:bg-white/10"}  w-[28%] h-[80%] flex justify-center items-center text-[19px] font-semibold rounded-full cursor-pointer transition-all`} onClick={() => setUploadType("loop")}>Loop</div>
            </div>

             {!frontendMedia && (
                <div className="w-[90%] max-w-[500px] flex flex-col gap-4 mt-6">
                    {uploadType === "post" && (
                        <div className="w-full flex flex-col gap-2">
                            <label className="text-white font-semibold">Select Post Category:</label>
                            <select 
                                className="w-full bg-[#0a1010] border-2 border-gray-700 rounded-2xl text-white font-semibold p-3 outline-none" 
                                value={category} 
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                {["Project", "Certificate", "Research Paper", "Internship", "Workshop", "Hackathon", "Achievement", "Technical Blog", "Event"].map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                    )}
                    <div className='w-full h-[200px] bg-[#0e1316] border-gray-800 border-2 flex flex-col items-center justify-center gap-[8px] rounded-2xl cursor-pointer hover:bg-[#353a3d]' onClick={() => mediaInput.current.click()}>
                        <input type="file" accept={uploadType=="loop"?"video/*":""} hidden ref={mediaInput} onChange={handleMedia} />
                        <FiPlusSquare className='text-white cursor-pointer w-[25px] h-[25px]' />
                        <div className='text-white text-[19px] font-semibold'>Upload visual thumbnail / video</div>
                    </div>
                </div>
             )}

            {frontendMedia &&
                <div className='w-[80%] max-w-[500px] min-h-[250px] flex flex-col items-center justify-center mt-[2vh] overflow-y-auto pb-[50px]'>
             {mediaType=="image" && <div className='w-full flex flex-col items-center justify-center mt-[2vh] '>
                <img src={frontendMedia} alt="" className='h-[150px] object-cover rounded-2xl mb-4'/>
                </div>}

                  {mediaType=="video" && <div className='w-full flex flex-col items-center justify-center mt-[2vh] '>
                <div className="h-[150px] flex items-center justify-center overflow-hidden rounded-2xl mb-4">
                    <VideoPlayer media={frontendMedia}/>
                </div>
                </div>}

                {/* Form Fields based on Category/UploadType */}
                {uploadType === "post" && (
                    <div className="w-full flex flex-col gap-3">
                        {/* Common fields */}
                        <input type='text' className='w-full border-b-gray-400 border-b-2 outline-none px-[10px] py-[5px] text-white' placeholder='Write caption/description' onChange={(e)=>setCaption(e.target.value)} value={caption}/>
                        
                        {/* Project fields */}
                        {["Project", "Workshop", "Hackathon", "Technical Blog", "Event"].includes(category) && (
                            <>
                                <input type='text' className='w-full border-b-gray-400 border-b-2 outline-none px-[10px] py-[5px] text-white' placeholder='Project/Post Title' onChange={(e)=>setProjectTitle(e.target.value)} value={projectTitle}/>
                                <input type='text' className='w-full border-b-gray-400 border-b-2 outline-none px-[10px] py-[5px] text-white' placeholder='Tech Stack (comma separated)' onChange={(e)=>setTechStack(e.target.value)} value={techStack}/>
                                <input type='text' className='w-full border-b-gray-400 border-b-2 outline-none px-[10px] py-[5px] text-white' placeholder='GitHub Repository Link' onChange={(e)=>setGithubRepo(e.target.value)} value={githubRepo}/>
                                <input type='text' className='w-full border-b-gray-400 border-b-2 outline-none px-[10px] py-[5px] text-white' placeholder='Live Demo Link' onChange={(e)=>setLiveDemo(e.target.value)} value={liveDemo}/>
                                <input type='text' className='w-full border-b-gray-400 border-b-2 outline-none px-[10px] py-[5px] text-white' placeholder='LinkedIn Related Post Link' onChange={(e)=>setLinkedinPost(e.target.value)} value={linkedinPost}/>
                            </>
                        )}

                        {/* Certificate fields */}
                        {["Certificate", "Internship", "Research Paper", "Achievement"].includes(category) && (
                            <>
                                <input type='text' className='w-full border-b-gray-400 border-b-2 outline-none px-[10px] py-[5px] text-white' placeholder='Certificate/Achievement Title' onChange={(e)=>setProjectTitle(e.target.value)} value={projectTitle}/>
                                <input type='text' className='w-full border-b-gray-400 border-b-2 outline-none px-[10px] py-[5px] text-white' placeholder='Issuer (e.g. Google, Coursera, College)' onChange={(e)=>setCertificateIssuer(e.target.value)} value={certificateIssuer}/>
                                <div className="w-full flex flex-col gap-1">
                                    <label className="text-gray-400 text-[13px]">Issue Date:</label>
                                    <input type='date' className='w-full border-b-gray-400 border-b-2 outline-none px-[10px] py-[5px] text-white bg-black' onChange={(e)=>setCertificateDate(e.target.value)} value={certificateDate}/>
                                </div>
                            </>
                        )}

                        {/* Optional PDF File */}
                        <div className="w-full mt-3 flex flex-col gap-2">
                            <label className="text-white text-[14px] font-semibold">Upload PDF Document (Optional):</label>
                            <div className="flex items-center gap-[10px]">
                                <label className="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-xl cursor-pointer text-[14px]">
                                    Choose PDF
                                    <input type="file" accept="application/pdf" className="hidden" onChange={handlePdfChange} />
                                </label>
                                {frontendPdfName && <span className="text-green-400 text-[14px] truncate max-w-[200px]">{frontendPdfName}</span>}
                            </div>
                        </div>
                    </div>
                )}

                {uploadType === "loop" && (
                    <div className="w-full flex flex-col gap-3">
                        <input type='text' className='w-full border-b-gray-400 border-b-2 outline-none px-[10px] py-[5px] text-white' placeholder='Write caption/description' onChange={(e)=>setCaption(e.target.value)} value={caption}/>
                        <input type='text' className='w-full border-b-gray-400 border-b-2 outline-none px-[10px] py-[5px] text-white' placeholder='Project Title' onChange={(e)=>setProjectTitle(e.target.value)} value={projectTitle}/>
                        <input type='text' className='w-full border-b-gray-400 border-b-2 outline-none px-[10px] py-[5px] text-white' placeholder='Technologies Used (comma separated)' onChange={(e)=>setTechStack(e.target.value)} value={techStack}/>
                        <input type='text' className='w-full border-b-gray-400 border-b-2 outline-none px-[10px] py-[5px] text-white' placeholder='GitHub Repository Link' onChange={(e)=>setGithubLink(e.target.value)} value={githubLink}/>
                        <input type='text' className='w-full border-b-gray-400 border-b-2 outline-none px-[10px] py-[5px] text-white' placeholder='LinkedIn Profile Link' onChange={(e)=>setLinkedinLink(e.target.value)} value={linkedinLink}/>
                        <input type='text' className='w-full border-b-gray-400 border-b-2 outline-none px-[10px] py-[5px] text-white' placeholder='Portfolio Website Link (optional)' onChange={(e)=>setPortfolioLink(e.target.value)} value={portfolioLink}/>
                    </div>
                )}
                </div>}

                {frontendMedia && <button className='px-[10px] w-[60%] max-w-[400px]   py-[5px] h-[50px] bg-[#ffd100] hover:bg-[#e6bd00] text-black font-bold mt-[50px] cursor-pointer rounded-2xl transition-all shadow-md' onClick={handleUpload}>{loading?<ClipLoader size={30} color='black'/>:`Upload ${uploadType}` }</button>}

        </div>
    )
}

export default Upload