import React from 'react'
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import dp from "../assets/dp.webp"
import { useRef } from 'react';
import { useState } from 'react';
import axios from 'axios';
import { serverUrl } from '../App';
import { setProfileData, setUserData } from '../redux/userSlice';
import { ClipLoader } from 'react-spinners';
function EditProfile() {
    const { userData } = useSelector(state => state.user)
    const navigate = useNavigate()
    const imageInput = useRef()
    const [frontendImage, setFrontendImage] = useState(userData.profileImage || dp)
    const [backendImage, setBackendImage] = useState(null)
    const [name, setName] = useState(userData.name || "")
    const [userName, setUserName] = useState(userData.userName || "")
    const [bio, setBio] = useState(userData.bio || "")
    const [profession, setProfession] = useState(userData.profession || "")
    const [gender, setGender] = useState(userData.gender || "")
    const [department, setDepartment] = useState(userData.department || "")
    const [year, setYear] = useState(userData.year || "1st Year")
    const [rollNumber, setRollNumber] = useState(userData.rollNumber || "")
    const [github, setGithub] = useState(userData.github || "")
    const [linkedin, setLinkedin] = useState(userData.linkedin || "")
    const [portfolio, setPortfolio] = useState(userData.portfolio || "")
    const [skills, setSkills] = useState(userData.skills || "")
    const [programmingLanguages, setProgrammingLanguages] = useState(userData.programmingLanguages || "")
    const [achievements, setAchievements] = useState(userData.achievements || "")
    const [interests, setInterests] = useState(userData.interests || "")
    const dispatch=useDispatch()
    const [loading,setLoading]=useState(false)
    const handleImage = (e) => {
        const file = e.target.files[0]
        setBackendImage(file)
        setFrontendImage(URL.createObjectURL(file))
    }

    const handleEditProfile=async ()=>{
        setLoading(true)
        try {
            const formdata=new FormData()
            formdata.append("name",name)
            formdata.append("userName",userName)
             formdata.append("bio",bio)
              formdata.append("profession",profession)
               formdata.append("gender",gender)
               formdata.append("department",department)
               formdata.append("year",year)
               formdata.append("rollNumber",rollNumber)
               formdata.append("github",github)
               formdata.append("linkedin",linkedin)
               formdata.append("portfolio",portfolio)
               formdata.append("skills",skills)
               formdata.append("programmingLanguages",programmingLanguages)
               formdata.append("achievements",achievements)
               formdata.append("interests",interests)
               if(backendImage){
                formdata.append("profileImage",backendImage)
               }
            const result=await axios.post(`${serverUrl}/api/user/editProfile`,formdata,{withCredentials:true})
            dispatch(setProfileData(result.data))
            dispatch(setUserData(result.data))
            setLoading(false)
            navigate(`/profile/${userData.userName}`)
        } catch (error) {
           console.log(error) 
            setLoading(false)
        }
    }

    return (
        <div className='w-full min-h-[100vh] bg-[#00509d] flex items-center flex-col gap-[20px] pb-[100px]'>
            <div className='w-full h-[80px]  flex items-center gap-[20px] px-[20px]'>
                <MdOutlineKeyboardBackspace className='text-white cursor-pointer w-[25px]  h-[25px] ' onClick={() => navigate(`/profile/${userData.userName}`)} />
                <h1 className='text-white text-[20px] font-semibold'>Edit Profile</h1>
            </div>
            <div className='w-[80px] h-[80px] md:w-[100px] md:h-[100px] border-2 border-white rounded-full cursor-pointer overflow-hidden' onClick={() => imageInput.current.click()}>
                <input type='file' accept='image/*' ref={imageInput} hidden onChange={handleImage} />
                <img src={frontendImage} alt="" className='w-full object-cover' />
            </div>

            <div className='text-[#ffd100] text-center text-[18px] font-semibold cursor-pointer' onClick={() => imageInput.current.click()}>Change Your Profile Picture</div>

            <input type="text" className='w-[90%] max-w-[600px] h-[60px] bg-white/10 border-2 border-white/20 rounded-2xl text-white font-semibold px-[20px] outline-none placeholder:text-gray-300' placeholder='Enter Your Name' onChange={(e)=>setName(e.target.value)} value={name}/>
            <input type="text" className='w-[90%] max-w-[600px] h-[60px] bg-white/10 border-2 border-white/20 rounded-2xl text-white font-semibold px-[20px] outline-none placeholder:text-gray-300' placeholder='Enter Your userName' onChange={(e)=>setUserName(e.target.value)} value={userName}/>
            <input type="text" className='w-[90%] max-w-[600px] h-[60px] bg-white/10 border-2 border-white/20 rounded-2xl text-white font-semibold px-[20px] outline-none placeholder:text-gray-300' placeholder='Bio' onChange={(e)=>setBio(e.target.value)} value={bio}/>
            <input type="text" className='w-[90%] max-w-[600px] h-[60px] bg-white/10 border-2 border-white/20 rounded-2xl text-white font-semibold px-[20px] outline-none placeholder:text-gray-300' placeholder='Profession' onChange={(e)=>setProfession(e.target.value)} value={profession}/>
            <input type="text" className='w-[90%] max-w-[600px] h-[60px] bg-white/10 border-2 border-white/20 rounded-2xl text-white font-semibold px-[20px] outline-none placeholder:text-gray-300' placeholder='Gender' onChange={(e)=>setGender(e.target.value)} value={gender}/>
            
            <input type="text" className='w-[90%] max-w-[600px] h-[60px] bg-white/10 border-2 border-white/20 rounded-2xl text-white font-semibold px-[20px] outline-none placeholder:text-gray-300' placeholder='Department (e.g. CSE)' onChange={(e)=>setDepartment(e.target.value)} value={department}/>
            <select className='w-[90%] max-w-[600px] h-[60px] bg-white/10 border-2 border-white/20 rounded-2xl text-white font-semibold px-[20px] outline-none ' onChange={(e)=>setYear(e.target.value)} value={year}>
                <option value="1st Year" className="text-black">1st Year</option>
                <option value="2nd Year" className="text-black">2nd Year</option>
                <option value="3rd Year" className="text-black">3rd Year</option>
                <option value="4th Year" className="text-black">4th Year</option>
            </select>
            <input type="text" className='w-[90%] max-w-[600px] h-[60px] bg-white/10 border-2 border-white/20 rounded-2xl text-white font-semibold px-[20px] outline-none placeholder:text-gray-300' placeholder='Roll Number' onChange={(e)=>setRollNumber(e.target.value)} value={rollNumber}/>
            <input type="text" className='w-[90%] max-w-[600px] h-[60px] bg-white/10 border-2 border-white/20 rounded-2xl text-white font-semibold px-[20px] outline-none placeholder:text-gray-300' placeholder='GitHub Profile Link' onChange={(e)=>setGithub(e.target.value)} value={github}/>
            <input type="text" className='w-[90%] max-w-[600px] h-[60px] bg-white/10 border-2 border-white/20 rounded-2xl text-white font-semibold px-[20px] outline-none placeholder:text-gray-300' placeholder='LinkedIn Profile Link' onChange={(e)=>setLinkedin(e.target.value)} value={linkedin}/>
            <input type="text" className='w-[90%] max-w-[600px] h-[60px] bg-white/10 border-2 border-white/20 rounded-2xl text-white font-semibold px-[20px] outline-none placeholder:text-gray-300' placeholder='Portfolio Website Link' onChange={(e)=>setPortfolio(e.target.value)} value={portfolio}/>
            <input type="text" className='w-[90%] max-w-[600px] h-[60px] bg-white/10 border-2 border-white/20 rounded-2xl text-white font-semibold px-[20px] outline-none placeholder:text-gray-300' placeholder='Skills (comma separated, e.g. React, Node)' onChange={(e)=>setSkills(e.target.value)} value={skills}/>
            <input type="text" className='w-[90%] max-w-[600px] h-[60px] bg-white/10 border-2 border-white/20 rounded-2xl text-white font-semibold px-[20px] outline-none placeholder:text-gray-300' placeholder='Programming Languages (comma separated, e.g. Java, Python)' onChange={(e)=>setProgrammingLanguages(e.target.value)} value={programmingLanguages}/>
            <input type="text" className='w-[90%] max-w-[600px] h-[60px] bg-white/10 border-2 border-white/20 rounded-2xl text-white font-semibold px-[20px] outline-none placeholder:text-gray-300' placeholder='Achievements' onChange={(e)=>setAchievements(e.target.value)} value={achievements}/>
            <input type="text" className='w-[90%] max-w-[600px] h-[60px] bg-white/10 border-2 border-white/20 rounded-2xl text-white font-semibold px-[20px] outline-none placeholder:text-gray-300' placeholder='Interests' onChange={(e)=>setInterests(e.target.value)} value={interests}/>

            <button className='px-[10px] w-[60%] max-w-[400px]   py-[5px] h-[50px] bg-[#ffd100] hover:bg-[#e6bd00] text-black font-bold mt-[20px] cursor-pointer rounded-2xl transition-all shadow-md' onClick={handleEditProfile}>{loading?<ClipLoader size={30} color='black'/>:"Save Profile"}</button>
        </div>
    )
}

export default EditProfile
