import React,{useContext ,useEffect ,useState} from 'react'
import {UserContext} from '../context/userContext'
import { Link, useNavigate ,useLocation} from 'react-router-dom'
import axios from 'axios'
import Loader from '../components/Loader'
import { storage } from '../firebase';
import {ref,deleteObject} from 'firebase/storage'
const DeletePost = ({postId:id}) => {
  const navigate=useNavigate()
  const location=useLocation()
  const [isLoading,setIsLoading]=useState(false)
  const {currentUser}=useContext(UserContext)
  const token =currentUser?.token;
  let thumbnail

  useEffect(()=>{
    if(!token){
      navigate('/login')
    }
  }, [])
  useEffect(()=>{
    const getPost =async ()=>{
      try {
        const response=await axios.get(`${process.env.REACT_APP_BASE_URL}/posts/${id}`)
        thumbnail=response.data.thumbnail
      } catch (error) {
        console.log(error);
      }
    }
    getPost();
  }, [])

  const removePost = async ()=>{
    setIsLoading(true)
    try {
      const pathStart = thumbnail.indexOf("/o/") + 3;
      const pathEnd = thumbnail.indexOf("?alt=");
      const filePath = decodeURIComponent(thumbnail.substring(pathStart, pathEnd));
      const fileRef = ref(storage, filePath);
      await deleteObject(fileRef);
      
      const response =await axios.delete(`${process.env.REACT_APP_BASE_URL}/posts/${id}`,{withCredentials:true,headers:{Authorization:`Bearer ${token}`}})
      if(response.status===200){
          if(location.pathname === `/myposts/${currentUser.id}`){
           navigate(0)
          }else{
            navigate('/')
         }
       }
      setIsLoading(false)
    } catch (error) {
      console.log("Couldn't delete post");
    }
  }
  if(isLoading){
    return <Loader/>
  }

  return (
    <Link className='btn sm danger' onClick={()=>removePost(id)}>Delete</Link>
  )
}

export default DeletePost
