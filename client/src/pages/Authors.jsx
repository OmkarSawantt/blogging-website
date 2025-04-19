import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Loader from '../components/Loader'
import axios from 'axios'


const Authors = () => {
  const [authors,setAuthors]=useState([])
  const [isLoading,setIsLoading]=useState(false)


  useEffect(()=>{
    const getAuthors=async()=>{
      setIsLoading(true);
      try {
        const response=await axios.get(`${process.env.REACT_APP_BASE_URL}/users`)
        setAuthors(response.data)
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false)
    }

    getAuthors();
  }, [])

  if(isLoading){
    return <Loader/>
  }

  return (
    <section className="authors">
      {authors.length >0 ?<div className="container authors__container">
        {
          authors.map(({_id:id,avatar,name,posts})=>{
            return <Link key={id} to={`/posts/users/${id}`} className='author'>
              <div className="author__avatar">
                <img src={`${avatar}`} alt={`Image Of${name}`} />
              </div>
              <div className="author__info">
                <h4>{name}</h4>
                <p>{posts}</p>
              </div>
            </Link>
          })
        }
      </div>:<h2 className='center'>No User/Authors found.</h2>}
    </section>
  )
}

export default Authors
