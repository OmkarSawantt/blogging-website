import React, { useState, useContext, useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { UserContext } from '../context/userContext';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';

const EditPost = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Uncategorized');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [error, setError] = useState('');
  const [url, setUrl] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentUser } = useContext(UserContext);
  const token = currentUser?.token;
  const quillRef = useRef(null);

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  useEffect(() => {
    const getPost = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/posts/${id}`);
        setTitle(response.data.title);
        setDescription(response.data.description);
        setCategory(response.data.category);
        setUrl(response.data.thumbnail);
      } catch (error) {
        console.log(error);
      }
    };
    getPost();
  }, [id]);

  const POST_CATEGORIES = [
    "Agriculture", "Business", "Education", "Entertainment", "Art",
    "Investment", "Uncategorized", "Weather"
  ];

  const editPost = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const postData = new FormData();
      postData.set('title', title);
      postData.set('category', category);
      postData.set('description', description);

      if (thumbnail) {
        const pathStart = url.indexOf("/o/") + 3;
        const pathEnd = url.indexOf("?alt=");
        const filePath = decodeURIComponent(url.substring(pathStart, pathEnd));
        const oldFileRef = ref(storage, filePath);

        await deleteObject(oldFileRef);

        const imageRef = ref(storage, `images/${thumbnail.name + uuidv4()}`);
        const snapshot = await uploadBytes(imageRef, thumbnail);
        const downloadURL = await getDownloadURL(snapshot.ref);

        postData.set('thumbnail', downloadURL);
        setUrl(downloadURL); 
      } else {
        postData.set('thumbnail', url);
      }

      const response = await axios.patch(`${process.env.REACT_APP_BASE_URL}/posts/${id}`, postData, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 200) {
        navigate(`/posts/${id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <section className="create-post">
      <div className="container">
        <h2>Edit Post</h2>
        {error && <p className="form__error-message">{error}</p>}
        <form className="form create-post__form" onSubmit={editPost}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            autoFocus
          />
          <select
            name="category"
            value={category}
            onChange={e => setCategory(e.target.value)}
          >
            {POST_CATEGORIES.map(cat => (
              <option key={cat}>{cat}</option>
            ))}
          </select>
          <ReactQuill
            ref={quillRef}
            modules={{
              toolbar: [
                [{ 'header': [1, 2, false] }],
                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
                ['link', 'image'],
                ['clean']
              ]
            }}
            formats={[
              'header', 'bold', 'italic', 'underline', 'strike', 'blockquote',
              'list', 'bullet', 'indent', 'link', 'image'
            ]}
            value={description}
            onChange={setDescription}
          />
          <input
            type="file"
            onChange={e => setThumbnail(e.target.files[0])}
            accept="image/png, image/jpg, image/jpeg"
          />
          <div className="below">
            <button type="submit" className="btn primary">Update</button>
            <button className="btn primary">
              <Link to={`/posts/${id}`} className="right">Done</Link>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default EditPost;
