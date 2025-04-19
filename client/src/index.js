import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Layout from './components/Layout';
import ErrorPage from './pages/ErrorPage'
import Home from './pages/Home'
import PostDetail from './pages/PostDetail'
import Register from './pages/Register'
import Login from './pages/Login'
import UserProfile from './pages/UserProfile'
import Authors from './pages/Authors'
import CreatePost from './pages/CreatePost'
import EditPost from './pages/EditPost'
import DeletePost from './pages/DeletePost'
import AuthorPost from './pages/AutorPosts'
import Dashboard from './pages/Dashboard'
import CategoryPost from './pages/CategoryPost'
import Logout from './pages/Logout'
import UserProvider from './context/userContext';
import SearchPage from './pages/SearchPage';
import Input from './pages/Input'
const router=createBrowserRouter([
  {
    path:"/",
    element:<UserProvider><Layout/></UserProvider>,
    errorElement:<ErrorPage/>,
    children:[
      {index:true,element:<Home/>},
      {path:"posts/:id",element:<PostDetail/>},
      {path:"register",element:<Register/>},
      {path:"login",element:<Login/>},
      {path:"profile/:id",element:<UserProfile/>},
      {path:"authors",element:<Authors/>},
      {path:"create",element:<CreatePost/>},
      {path:"posts/categories/:category",element:<CategoryPost/>},
      {path:"posts/users/:id",element:<AuthorPost/>},
      {path:"myposts/:id",element:<Dashboard/>},
      {path:"posts/:id/edit",element:<EditPost/>},
      {path:"posts/:id/delete",element:<DeletePost/>},
      {path:"logout",element:<Logout/>},
      {path:"search",element:<SearchPage/>},
      {path:"input",element:<Input/>},
    ]
  }
])
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
);