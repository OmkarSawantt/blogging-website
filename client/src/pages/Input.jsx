import React, { useEffect, useState } from 'react';
import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

const Input = () => {
  const [imageUpload, setImageUpload] = useState(null);
  const [url, setUrl] = useState(null);

  const uploadImage = () => {
    if (imageUpload == null) return;
    const imageRef = ref(storage, `images/${imageUpload.name}`);
    uploadBytes(imageRef, imageUpload).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((downloadURL) => {
        setUrl(downloadURL);
        console.log(downloadURL)
        alert("Image uploaded successfully");
      });
    }).catch(error => {
      console.error("Error uploading image: ", error);
    });
  };

  return (
    <section className='posts'>
      <input type='file' onChange={(e) => { setImageUpload(e.target.files[0]) }} />
      <button onClick={uploadImage}>Upload Image</button>
      {url && <img src={url} alt="Uploaded" style={{ width: '200px', marginTop: '20px' }} />}
      <p>{url}</p>
    </section>
  );
};

export default Input;
