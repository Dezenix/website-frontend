import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Dumpform.css';
import { addDoc } from 'firebase/firestore';
import { ideaRef } from '../firebase';
import { storage } from '../firebase';
import { ref as storageRef, uploadBytes } from 'firebase/storage';
import images from '../images.jsx';

let fileToBeUploaded;

const DumpForm = () => {
  const inputFile = useRef(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fileToBeUploaded, setfileToBeUploaded] = useState('');

  const [formData, setformData] = useState({
    name: '',
    email: '',
    description: '',
    imageURL: '',
  });

  const handleChange = (e) => {
    setformData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const submitIdea = async (e) => {
    e.preventDefault();

    setLoading(true);

    const { name, email, description, imageURL } = formData;

    if (name && email && description) {
      const newRef = await addDoc(ideaRef, {
        name: name,
        email: email,
        description: description,
        votes: 0,
        date: Date.now(),
        imageURL: imageURL ? imageURL : '',
      });

      const newID = newRef.id;

      if (fileToBeUploaded) {
        const fileRef = storageRef(storage, `ideaForm/${newID}/desc-1-${fileToBeUploaded.name}`);
        const result = await uploadBytes(fileRef, fileToBeUploaded);
      }

      setformData({ name: '', email: '', description: '' });

      alert('Idea Submitted');
      navigate('/');
    }
  };

  const onImageClicked = () => {
    inputFile.current.click();
    // fileToBeUploaded = event.dataTransfer.files[0];
  };

  const onImageChanged = (e) => {
    e.preventDefault();
    setfileToBeUploaded(e.target.files[0]);

    console.log(e.target.files[0]);
  };

  const onImageDropped = (event) => {
    event.preventDefault();
    setfileToBeUploaded(c);

    console.log(event.dataTransfer.files[0]);
  };

  return (
    <>
      <div className="dump_form">
        <Link to="/">
          <button className="cancel__form">X</button>
        </Link>
        <div className="form__heading">
          <h1 id="greeting__msg">
            Hi There <img src={images.wave} alt="wave" />
          </h1>

          <p id="form__msg">
            Feel free to share your ideas and the community will help you to turn it into a product.
          </p>
        </div>
        <form className="form__container">
          <label htmlFor="name" className="input__lables">
            Enter your full name:<span className="asteriks">*</span>
          </label>
          <input
            className="input__field"
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            maxLength={50}
            autoComplete="off"
          />

          {/* Work around for opening file picker */}
          <label htmlFor="filePicker" className="input__lables" />
          <input
            id="filePicker"
            onChange={onImageChanged}
            ref={inputFile}
            type="file"
            style={{ display: 'none' }}
          />

          <label htmlFor="email" className="input__lables">
            Enter email address:<span className="asteriks">*</span>
          </label>
          <input
            className="input__field"
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            autoComplete="off"
          />
          <label htmlFor="description" className="input__lables">
            Brief Description of idea:<span className="asteriks">*</span>
          </label>
          <textarea
            className="input__field text__area"
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            maxLength={1000}
            autoComplete="off"
          />
          <label htmlFor="dropzone" className="input__lables">
            Please share Graphical Description (If any)
          </label>

          {/* TODO: Style this properly */}
          <div
            draggable
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onClick={onImageClicked}
            onDrop={(event) => onImageDropped(event)}
            className="input__field drop__zone"
            title="Drop Your Graphical Description Here"
          >
            {fileToBeUploaded.name}
            <img src={''} alt="" className="upload__img" />
          </div>
          <label htmlFor="imageURL" className="input__lables">
            Please share any Relavent Link ( Figma, etc )
          </label>
          <input
            className="input__field"
            type="URL"
            id="imageURL"
            name="imageURL"
            value={formData.imageURL}
            onChange={handleChange}
            autoComplete="off"
          />
          <button
            title="Click to Submit Your Idea"
            id="submit__button"
            type="submit"
            onClick={submitIdea}
          >
            Submit Idea
          </button>
        </form>
      </div>
    </>
  );
};

export default DumpForm;
