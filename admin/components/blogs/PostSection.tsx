import React, { useRef } from 'react';
import { v4 as uuid } from 'uuid';
import { FaEdit, FaMinus, FaPlus, FaSave } from 'react-icons/fa';
import { MdKeyboardArrowDown } from 'react-icons/md';
import SunEditorCore from 'suneditor/src/lib/core';
import {
  useTypedDispatch,
  useTypedSelector,
} from '../../hooks/useTypedSelector';
import FileButton from '../controls/file';
import TextEditor from '../shared/TextEditor';
import { setKeypoints } from '../../store/slices/blogs';

export interface IPostSection {
  id?: string;
  title: string;
  content: string;
  images?: string[];
  isCollapsed?: boolean;
  isDisabled?: boolean;
}

interface PostSectionProps {
  keyPointState: [{ [k: string]: IPostSection }, any];
  setPage: any;
  setPostSectionKey: any;
}

const PostSection = (props: PostSectionProps) => {
  const {
    keyPointState: [keyPoints, setKeyPoints],
    setPage,
    setPostSectionKey,
  } = props;
  const editor = useRef<SunEditorCore>();

  const dispatch = useTypedDispatch();
  const points = useTypedSelector((state) => state.blogs.postSection);

  const onKeyPointsContentChange = (
    idx: string,
    key: 'title' | 'content',
    value: string,
  ) => {
    const points = { ...keyPoints };
    points[idx][key] = value;
    setKeyPoints(points);
  };

  const addKeyPoints = () => {
    const modifiedKeyPoint = { ...keyPoints };
    Object.values(modifiedKeyPoint).forEach(
      //@ts-ignore
      (point) => (point.isCollapsed = true),
    );
    setKeyPoints({
      ...keyPoints,
      [uuid()]: {
        id: '',
        title: '',
        content: '',
        images: [],
        videos: [],
        isCollapsed: false,
      },
    });
  };
  const saveEditKeyPoints = (idx) => {
    const keyPointsArr = { ...keyPoints };
    keyPointsArr[idx].isDisabled = !keyPointsArr[idx].isDisabled;
    setKeyPoints(keyPointsArr);
  };
  const deleteKeyPoints = (idx) => {
    if (Object.keys(keyPoints).length > 1) {
      const keyPointsArr = { ...keyPoints };
      delete keyPointsArr[idx];
      setKeyPoints(keyPointsArr);
    }
  };
  const collapseKeyPoints = (idx) => {
    const keyPointsArr = { ...keyPoints };
    keyPointsArr[idx].isCollapsed = !keyPointsArr[idx].isCollapsed;
    setKeyPoints(keyPointsArr);
  };

  return (
    <div className="wrapper-section">
      {Object.keys(keyPoints).map((key) => (
        <div className="form_accordion" key={key}>
          <div className="form_accordion__title flex sb">
            <input
              className="custom-input large"
              style={{ height: '5rem', width: '50rem' }}
              disabled={keyPoints[key].isDisabled}
              placeholder="Title of the Post"
              value={keyPoints[key].title}
              onChange={(e) =>
                onKeyPointsContentChange(key, 'title', e.target.value)
              }
            />
            <div className="flex">
              <FileButton
                page="bPostSection"
                setPage={setPage}
                showMedia
                postKey={key}
                setPostSectionKey={setPostSectionKey}
              />
              <button
                type="button"
                className="btn-icon-white ml-20"
                onClick={addKeyPoints}
              >
                <FaPlus />
              </button>
              <button
                type="button"
                className="btn-icon-white ml-20"
                onClick={() => deleteKeyPoints(key)}
              >
                <FaMinus />
              </button>
              <button
                type="button"
                className="btn-icon-white ml-20"
                onClick={() => saveEditKeyPoints(key)}
              >
                {keyPoints[key].isDisabled ? <FaEdit /> : <FaSave />}
              </button>
              <button
                type="button"
                className="btn-icon-white ml-20"
                onClick={() => collapseKeyPoints(key)}
              >
                <MdKeyboardArrowDown
                  style={{
                    height: 30,
                    width: 30,
                  }}
                />
              </button>
            </div>
          </div>
          <div
            className={`form_accordion__content ${
              !keyPoints[key].isCollapsed ? 'active' : ''
            }`}
          >
            <TextEditor
              ref={editor}
              name={key}
              value={points[key]}
              multiple
              disabled={keyPoints[key].isDisabled}
              onChange={(content: string) => {
                dispatch(setKeypoints({ id: key, content }));
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostSection;
