import React, { useState, useContext, useEffect , useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { UserContext } from '../context/userContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

const CreatePost = () => {
  const quillRef = useRef(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Uncategorized');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [error, setError] = useState('');
  const [url, setUrl] = useState('');
  const navigate = useNavigate();
  const { currentUser } = useContext(UserContext);
  const token = currentUser?.token;

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);
  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
      ['link', 'image'],
      ['clean'],
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image',
  ];

  const POST_CATEGORIES = [
    "Agriculture", "Buisness", "Education", "Entertainment", "Art",
    "Investment", "Uncategorized", "Weather"
  ];

  const createPost = async (e) => {
    e.preventDefault();
    setError('');

    if (!thumbnail) {
      setError('Thumbnail is required');
      return;
    }

    try {
      const imageRef = ref(storage, `images/${thumbnail.name + uuidv4()}`);
      console.log(imageRef);

      const snapshot = await uploadBytes(imageRef, thumbnail);
      const downloadURL = await getDownloadURL(snapshot.ref);
      setUrl(downloadURL);

      const postData = {
        title,
        category,
        description,
        thumbnail: downloadURL,
      };

      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/posts`,
        postData,
        { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 201) {
        navigate(`/posts/${response.data._id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while creating the post');
    }
  };

  return (
    <section className="create-post">
      <div className="container">
        <h2>Create Post</h2>
        {error && <p className="form__error-message">{error}</p>}
        <form className="form create-post__form" onSubmit={createPost}>
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
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <ReactQuill
            modules={modules}
            formats={formats}
            value={description}
            onChange={setDescription}
            ref={quillRef}
          />
          <input
            type="file"
            onChange={e => setThumbnail(e.target.files[0])}
            accept="image/png, image/jpg, image/jpeg"
          />
          <button type="submit" className="btn primary" disabled={!title || !description || !thumbnail}>
            Create
          </button>
        </form>
      </div>
    </section>
  );
};

export default CreatePost;
