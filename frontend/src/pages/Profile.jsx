import axios from 'axios'
import React from 'react'
import { serverUrl } from '../App'
import { UNSAFE_createClientRoutesWithHMRRevalidationOptOut, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setProfileData, setUserData } from '../redux/userSlice'
import { useEffect } from 'react'
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import dp from "../assets/dp.webp"
import Nav from '../components/Nav'
import FollowButton from '../components/FollowButton'
import Post from '../components/Post'
import { useState } from 'react'
import { FaGithub, FaLinkedin, FaGlobe } from 'react-icons/fa'
import LoopCard from '../components/LoopCard'

function Profile() {

    const { userName } = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [postType,setPostType]=useState("certificates")
    const { profileData, userData } = useSelector(state => state.user)
    const { postData } = useSelector(state => state.post)
    const { loopData } = useSelector(state => state.loop)
    const handleProfile = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/user/getProfile/${userName}`, { withCredentials: true })
            dispatch(setProfileData(result.data))
        } catch (error) {
            console.log(error)
        }
    }
    const handleLogOut = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/auth/signout`, { withCredentials: true })
            dispatch(setUserData(null))
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        handleProfile()
    }, [userName, dispatch])
    return (
        <div className='w-full min-h-screen bg-[#00509d]'>
            <div className='w-full h-[80px] flex justify-between items-center px-[30px] text-white'>
                <div onClick={() => navigate("/")}><MdOutlineKeyboardBackspace className='text-white cursor-pointer w-[25px]  h-[25px] ' /></div>
                <div className='font-semibold text-[20px]'>{profileData?.userName}</div>
                <div className='font-bold cursor-pointer text-[15px] bg-[#ffd100] text-black px-[15px] py-[6px] rounded-full hover:bg-[#e6bd00] transition-all shadow-md' onClick={handleLogOut}>Log Out</div>
            </div>

            <div className='w-full flex flex-col md:flex-row items-center md:items-start gap-[20px] lg:gap-[50px] pt-[20px] px-[20px] md:px-[10%] justify-center text-white'>
                <div className='w-[100px] h-[100px] md:w-[150px] md:h-[150px] border-4 border-gray-800 rounded-full cursor-pointer overflow-hidden flex-shrink-0'>
                    <img src={profileData?.profileImage || dp} alt="" className='w-full h-full object-cover' />
                </div>
                <div className='flex flex-col gap-[8px] text-center md:text-left w-full max-w-[600px]'>
                    <div className='flex flex-col md:flex-row md:items-center gap-[10px] justify-center md:justify-start'>
                        <h2 className='font-bold text-[26px]'>{profileData?.name}</h2>
                        {profileData?.rollNumber && <span className='text-gray-400 text-[14px] bg-gray-800 px-[8px] py-[2px] rounded-md'>{profileData.rollNumber}</span>}
                    </div>
                    <div className='text-gray-300 text-[15px] font-semibold'>
                        {profileData?.department ? `${profileData.department} • ` : ''}{profileData?.year}
                    </div>
                    {profileData?.bio && <div className='text-[16px] text-gray-200 mt-[2px]'>{profileData?.bio}</div>}
                    
                    {/* Social Links */}
                    <div className='flex items-center justify-center md:justify-start gap-[15px] mt-[10px]'>
                        {profileData?.github && (
                            <a href={profileData.github.startsWith('http') ? profileData.github : `https://${profileData.github}`} target="_blank" rel="noopener noreferrer" className='text-white hover:text-gray-400 text-[24px] transition-colors'>
                                <FaGithub />
                            </a>
                        )}
                        {profileData?.linkedin && (
                            <a href={profileData.linkedin.startsWith('http') ? profileData.linkedin : `https://${profileData.linkedin}`} target="_blank" rel="noopener noreferrer" className='text-blue-500 hover:text-blue-400 text-[24px] transition-colors'>
                                <FaLinkedin />
                            </a>
                        )}
                        {profileData?.portfolio && (
                            <a href={profileData.portfolio.startsWith('http') ? profileData.portfolio : `https://${profileData.portfolio}`} target="_blank" rel="noopener noreferrer" className='text-teal-400 hover:text-teal-300 text-[24px] transition-colors'>
                                <FaGlobe />
                            </a>
                        )}
                    </div>

                    {/* Skills & Programming Languages */}
                    {profileData?.skills && (
                        <div className='mt-[10px]'>
                            <span className='text-[14px] text-gray-400 block mb-[4px] font-semibold'>Skills:</span>
                            <div className='flex flex-wrap gap-[6px] justify-center md:justify-start'>
                                {profileData.skills.split(',').map((skill, i) => (
                                    <span key={i} className='bg-blue-600/30 text-blue-400 border border-blue-600/50 px-[10px] py-[2px] rounded-full text-[13px] font-medium'>{skill.trim()}</span>
                                ))}
                            </div>
                        </div>
                    )}
                    {profileData?.programmingLanguages && (
                        <div className='mt-[8px]'>
                            <span className='text-[14px] text-gray-400 block mb-[4px] font-semibold'>Languages:</span>
                            <div className='flex flex-wrap gap-[6px] justify-center md:justify-start'>
                                {profileData.programmingLanguages.split(',').map((lang, i) => (
                                    <span key={i} className='bg-teal-600/30 text-teal-400 border border-teal-600/50 px-[10px] py-[2px] rounded-full text-[13px] font-medium'>{lang.trim()}</span>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {profileData?.achievements && (
                        <div className='mt-[8px] text-[14px] text-gray-300'>
                            <span className='font-semibold text-gray-400'>Achievements: </span>{profileData.achievements}
                        </div>
                    )}
                    {profileData?.interests && (
                        <div className='mt-[4px] text-[14px] text-gray-300'>
                            <span className='font-semibold text-gray-400'>Interests: </span>{profileData.interests}
                        </div>
                    )}
                </div>
            </div>

            <div className='w-full h-[85px] flex items-center justify-center gap-[40px] md:gap-[60px] px-[20%] pt-[20px] text-white'>
                <div>
                    <div className='text-white text-[22px] md:text-[30px] font-semibold'>{profileData?.posts.length}</div>
                    <div className='text-[18px] md:text-[22px] text-[#ffffffc7]'>Posts</div>
                </div>
                <div>
                    <div className='flex items-center justify-center gap-[20px]'>
                        <div className='flex relative'>
                            {profileData?.followers?.slice(0, 3).map((user, index) => (

                                <div className={`w-[40px] h-[40px]  border-2 border-black rounded-full cursor-pointer overflow-hidden ${index>0?`absolute left-[${index*9}px]`:""}`}>
                                    <img src={user.profileImage || dp} alt="" className='w-full object-cover' />
                                </div>
                            ))}


                        </div>
                        <div className='text-white text-[22px] md:text-[30px] font-semibold'>
                            {profileData?.followers.length}
                        </div>
                    </div>
                    <div className='text-[18px] md:text-[22px] text-[#ffffffc7]'>Followers</div>
                </div>
                <div>
                    <div className='flex items-center justify-center gap-[20px]'>
                        <div className='flex relative'>

                             {profileData?.following?.slice(0, 3).map((user, index) => (
                               


                                <div className={`w-[40px] h-[40px]  border-2 border-black rounded-full cursor-pointer overflow-hidden ${index>0?`absolute left-[${index*10}px]`:""}`}>
                                    <img src={user?.profileImage || dp} alt="" className='w-full object-cover' />
                                </div>
                            ))}

                        </div>
                        <div className='text-white text-[22px] md:text-[30px] font-semibold'>
                            {profileData?.following.length}
                        </div>
                    </div>
                    <div className='text-[18px] md:text-[22px] text-[#ffffffc7]'>Following</div>
                </div>
            </div>

            <div className='w-full h-[80px] flex justify-center items-center gap-[20px] mt-[10px]'>
                {profileData?._id == userData._id
                    &&
                    <button className='px-[15px] min-w-[150px] py-[5px] h-[40px] bg-[#ffd100] hover:bg-[#e6bd00] text-black font-semibold cursor-pointer rounded-2xl transition-all shadow-md' onClick={() => navigate("/editprofile")}>Edit Profile</button>}

                {profileData?._id != userData._id
                    &&
                    <FollowButton tailwind={'px-[10px] min-w-[150px] py-[5px] h-[40px] bg-[white] cursor-pointer rounded-2xl'} targetUserId={profileData?._id} onFollowChange={handleProfile} />
                }
            </div>

            <div className='w-full min-h-[100vh]  flex justify-center mt-[20px]'>
                <div className='w-full max-w-[900px] flex flex-col items-center rounded-t-[30px] bg-white relative gap-[20px] pt-[30px] pb-[100px]'>
                    <div className='w-[90%] max-w-[650px] h-[80px] bg-[white] rounded-full flex justify-around items-center gap-[5px] border border-gray-200 shadow-sm px-[10px]' >
                        {["certificates", "projects", "reels", "achievements"].map((tab) => (
                            <div 
                                key={tab}
                                className={`${postType === tab ? "bg-black text-white shadow-lg" : "text-black hover:bg-gray-100"} px-[15px] py-[10px] rounded-full text-[16px] font-semibold cursor-pointer transition-all capitalize`}
                                onClick={() => setPostType(tab)}
                            >
                                {tab}
                            </div>
                        ))}
                    </div>

                    <Nav />

                    <div className='w-full flex flex-col items-center gap-[20px] mt-[10px]'>
                        {postType === "reels" ? (
                            loopData.filter(l => l.author?._id === profileData?._id).length > 0 ? (
                                loopData.filter(l => l.author?._id === profileData?._id).map((loop, index) => (
                                    <div key={index} className='w-full max-w-[500px] h-[100vh] mb-[40px] flex items-center justify-center'>
                                        <LoopCard loop={loop} />
                                    </div>
                                ))
                            ) : (
                                <div className='text-center text-gray-500 font-medium py-10'>No Reels Uploaded Yet</div>
                            )
                        ) : (
                            postData.filter(post => {
                                if (post.author?._id !== profileData?._id) return false;
                                if (postType === "certificates") {
                                    return ["Certificate", "Internship", "Research Paper"].includes(post.category);
                                } else if (postType === "projects") {
                                    return ["Project", "Workshop", "Hackathon", "Technical Blog", "Event"].includes(post.category);
                                } else if (postType === "achievements") {
                                    return post.category === "Achievement";
                                }
                                return false;
                            }).length > 0 ? (
                                postData.filter(post => {
                                    if (post.author?._id !== profileData?._id) return false;
                                    if (postType === "certificates") {
                                        return ["Certificate", "Internship", "Research Paper"].includes(post.category);
                                    } else if (postType === "projects") {
                                        return ["Project", "Workshop", "Hackathon", "Technical Blog", "Event"].includes(post.category);
                                    } else if (postType === "achievements") {
                                        return post.category === "Achievement";
                                    }
                                    return false;
                                }).map((post, index) => (
                                    <Post post={post} key={index} />
                                ))
                            ) : (
                                <div className='text-center text-gray-500 font-medium py-10 capitalize'>No {postType} Uploaded Yet</div>
                            )
                        )}
                    </div>


                    
                </div>
            </div>
        </div>
    )
}

export default Profile
