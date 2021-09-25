import axios from 'axios';
import { linkSync } from 'fs';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { AiFillSetting, AiFillYoutube, AiOutlineSearch } from 'react-icons/ai';
import { FaPlus } from 'react-icons/fa';
import {
  useTypedDispatch,
  useTypedSelector,
} from '../../hooks/useTypedSelector';
import {
  addImage,
  addYoutubeLink,
  selectImage,
  toggleToolbar,
} from '../../store/slices/ui';

const baseUrl =
  'https://eyeb3obcg1.execute-api.us-east-2.amazonaws.com/default/uploadAnyTypeMedia';
const objectBaseUrl = 'https://nobarun.s3.us-east-2.amazonaws.com';

const Toolbar = () => {
  const show = useTypedSelector((state) => state.ui.showToolbar);
  const images = useTypedSelector((state) => state.ui.images);
  const links = useTypedSelector((state) => state.ui.links);

  const router = useRouter();
  console.log(router);

  const [imageFile, setImageFile] = useState<FileList | null>(null);
  const [link, setLink] = useState('');
  const dispatch = useTypedDispatch();

  const imageUploadHandler = (e) => {
    const { files } = e.target;
    if (files) {
      setImageFile(files);
    }
  };

  const uploadImages = async () => {
    if (imageFile) {
      for (let i = 0; i < imageFile?.length; i++) {
        const { Key, uploadURL } = await (await axios.get(baseUrl)).data;
        const { url } = await (await axios.put(uploadURL, imageFile[i])).config;
        const objectUrl = `${objectBaseUrl}/${Key}`;
        dispatch(addImage({ src: objectUrl, name: imageFile[i].name }));
      }
    }
  };

  const youtubeLinkHandler = () => {
    dispatch(addYoutubeLink(link));
    setLink('');
  };

  const selectImageHandler = (imageSrc) => {
    dispatch(selectImage({ src: imageSrc, path: router.pathname }));
  };

  useEffect(() => {
    uploadImages();
  }, [imageFile]);

  return (
    <div
      id="tools-panel"
      className={`side-panel side-panel--floated ${show ? 'active' : ''}`}
    >
      <button
        type="button"
        className="btn-icon-fade side-panel__toggle show-panel"
        data-target="#tools-panel"
        onClick={() => {
          dispatch(toggleToolbar(!show));
        }}
      >
        <AiFillSetting />
      </button>
      <div className="side-panel__title">
        <h3>Tools</h3>
      </div>

      <div className="side-panel__content">
        <div className="accordion">
          <div className="accordion__title has-actions active flex sb">
            <h4>Media Gallery</h4>
            <div className="product-images">
              <input
                type="file"
                id="product"
                accept="image/*, video/*"
                style={{ display: 'none', height: '71px' }}
                onChange={(e) => imageUploadHandler(e)}
              />

              <label
                className="add-new-image"
                htmlFor="product"
                style={{ height: '71px' }}
              >
                <FaPlus />
              </label>
            </div>
          </div>
          <div
            className="accordion__content active"
            style={{ display: 'block' }}
          >
            <div className="search-input mb-30">
              <AiOutlineSearch className="search-icon" />
              <input
                type="text"
                className="custom-input"
                placeholder="Search"
              />
            </div>
            <div className="images-gallery">
              {images.map((image) => (
                <div
                  className="images-gallery__image"
                  onClick={() => selectImageHandler(image.src)}
                >
                  <i className="check-circle-icon selected-mark"></i>
                  <figure>
                    <img src={image.src} alt="" />
                  </figure>
                  <h5>{image.name}</h5>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="accordion">
          <div className="accordion__title">
            <h4>Video Gallery</h4>
          </div>
          <div
            className="accordion__content active"
            style={{ display: 'block' }}
          >
            <div className="field video" style={{ position: 'relative' }}>
              <AiFillYoutube className="video__icon" />
              <input
                type="text"
                className="custom-input video__input"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="Post Your Youtube Link"
              />
              <button onClick={youtubeLinkHandler}>+</button>
            </div>
          </div>
          {links.map((link) => {
            const embeddedLink = `https://www.youtube.com/embed/${
              link.split('=')[1]
            }`;
            console.log(embeddedLink);
            return (
              <iframe
                width="150"
                height="150"
                src={embeddedLink}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="ml-20"
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
