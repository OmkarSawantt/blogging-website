import React, { useState ,useContext ,useEffect} from 'react'
import { Link  ,useNavigate , useParams} from 'react-router-dom'
import {UserContext} from '../context/userContext'
import { FaEdit,FaCheck } from 'react-icons/fa'
import axios from 'axios'
import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';
const UserProfile = () => {
  const[avatar,setAvatar]=useState('')
  const[name,setName]=useState('')
  const[email,setEmail]=useState('')
  const[currentPassword,setCurrentPassword]=useState('')
  const[newPassword,setNewPassword]=useState('')
  const[confirmNewPassword,setConfirmNewPassword]=useState('')
  const[error,setError]=useState('')

  const {id}=useParams()
  const DefaultImageurl="https://firebasestorage.googleapis.com/v0/b/uploadingfile-1f51f.appspot.com/o/images%2Fimages.jpeg?alt=media&token=b2ca9a62-a547-4cfa-a1c6-fc7ed52e01f5"
  const[isAvatarTouched,setIsAvatarTouched]=useState(false)

  const navigate=useNavigate()

  const {currentUser}=useContext(UserContext)
  let oldName
  const token =currentUser?.token;

  useEffect(()=>{
    const token =currentUser?.token;
    if(!token){
      navigate('/login')
    }
  }, [token])

  const changeAvatarHandler = async()=>{
    setIsAvatarTouched(false);
    try {
      const response1=await axios.get(`${process.env.REACT_APP_BASE_URL}/users/${id}`)
      oldName=response1?.data.avatar
      if(!oldName===DefaultImageurl){
          const pathStart = oldName.indexOf("/o/") + 3;
          const pathEnd = oldName.indexOf("?alt=");
          const filePath = decodeURIComponent(oldName.substring(pathStart, pathEnd));
          const fileRef = ref(storage, filePath);
          await deleteObject(fileRef);
      }


      const imageRef = ref(storage, `images/${avatar.name + uuidv4()}`);
      const snapshot = await uploadBytes(imageRef, avatar);
      const downloadURL = await getDownloadURL(snapshot.ref);
      const postData={
        avatar:downloadURL
      }

      console.log(postData)
      const response=await axios.post(`${process.env.REACT_APP_BASE_URL}/users/change-avatar`,postData,{withCredentials:true,headers:{Authorization:`Bearer ${token}`}})
      window.location.reload()
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(()=>{
    const getUser=async()=>{
      const response=await axios.get(`${process.env.REACT_APP_BASE_URL}/users/${id}`,{withCredentials:true,headers:{Authorization:`Bearer ${token}`}})
      const {name,email,avatar}=response.data;
      setName(name)
      setEmail(email)
      setAvatar(avatar)
    }
    getUser();
  }, [id])

  const updateUserDetails=async(e)=>{
    e.preventDefault();
    try {
      const userData=new FormData();
      userData.set('name',name)
      userData.set('email',email)
      userData.set('currentPassword',currentPassword)
      userData.set('newPassword',newPassword)
      userData.set('confirmNewPassword',confirmNewPassword)

      const response=await axios.patch(`${process.env.REACT_APP_BASE_URL}/users/edit-user`,userData,{withCredentials:true,headers:{Authorization:`Bearer ${token}`}})
      if(response.status===200){

        navigate('/logout')
      }
    } catch (error) {
      setError(error.response.data.message);
    }
  }

  return (
    <section className="profile">
      <div className="container profile__container">
        <Link to={`/myposts/${currentUser.id}`} className='MyPost btn'>My Posts</Link>
        <div className="profile__details">
          <div className="avatar__wrapper">
            <div className="profile__avatar">
              <img src={`${avatar}`} alt="" />
            </div>
            {/* Update */}
            <form  className="avatar__form">
              <input type="file" name="avatar" id="avatar" onChange={e=>setAvatar(e.target.files[0])} accept='png,jpg,jpeg' />
              <label htmlFor='avatar' onClick={()=>setIsAvatarTouched(true)}><FaEdit/></label>
              </form>
              {isAvatarTouched && <button className="profile__avatar-btn" onClick={changeAvatarHandler}><FaCheck/></button>}
            </div>
            <h1>{currentUser.name}</h1>
          <form className="form profile__form" onSubmit={updateUserDetails}>
            {error &&<p className="form__error-message">{error}</p>}
            <input type="text" placeholder='Full Name' value={name} onChange={e=>setName(e.target.value)} />
            <input type="text" placeholder='Email' value={email} onChange={e=>setEmail(e.target.value)} />
            <input type="password" placeholder='Current Password' value={currentPassword} onChange={e=>setCurrentPassword(e.target.value)} />
            <input type="password" placeholder='New Password' value={newPassword} onChange={e=>setNewPassword(e.target.value)} />
            <input type="password" placeholder='Confirm New Password' value={confirmNewPassword} onChange={e=>setConfirmNewPassword(e.target.value)} />
            <button type="submit" className='btn primary'>Update Details</button>
          </form>

        </div>
        </div>

    </section>
  )
}

export default UserProfile