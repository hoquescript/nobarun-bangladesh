import React, { useState } from 'react';
import StarRatings from 'react-star-ratings';
import { gql, useQuery, useMutation } from '@apollo/client';
import { useForm, FormProvider } from 'react-hook-form';
import {
  AiOutlineClose,
  AiOutlinePlus,
  AiOutlineWarning,
} from 'react-icons/ai';

import Toolbar from '../../components/shared/Toolbar';

import Textarea from '../../components/controls/textarea';
import Textfield from '../../components/controls/textfield';

import styles from '../../styles/pages/review.module.scss';
import Togglebar from '../../components/controls/togglebar';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/client';

const CREATE_REVIEW = gql`
  mutation createReview($data: CreateNewReview!) {
    createReview(data: $data) {
      id
    }
  }
`;

const AddReview = () => {
  const methods = useForm();
  const [rating, setRating] = useState(2);

  const [createReview] = useMutation(CREATE_REVIEW);

  const addNewReview = (data) => {
    createReview({
      variables: {
        data: {
          ...data,
          rating,
          product: '614dba9ac8d3558394d7e4a8',
        },
      },
    });
  };
  return (
    <FormProvider {...methods}>
      <Toolbar />
      <div className="container center">
        <div className="row">
          <div className="col-xl-9">
            {/* <div className="container"> */}
            <div className="main__content__header mb-40">
              <h2 className="page-title">Add Review</h2>
              <div>
                <Togglebar name="isPublished">Publish</Togglebar>
                <button type="button" className="btn-icon-white ml-20">
                  <AiOutlineClose />
                </button>
              </div>
            </div>
            <div className="wrapper-section">
              <div className="wrapper-section__content">
                <div className="row">
                  <div className="col-12">
                    <div className="flex mb-30">
                      <h4 className="heading-tertiary mr-30 ">
                        Review Rating
                        <sup style={{ color: 'red' }}>*</sup>
                      </h4>
                      <StarRatings
                        rating={rating}
                        changeRating={(stars: number) => setRating(stars)}
                        numberOfStars={5}
                        name="rating"
                        starDimension="30px"
                        starRatedColor="#F4643A"
                        starHoverColor="#F4643A"
                        starEmptyColor="#946557"
                      />
                    </div>
                  </div>
                  <div className="col-12 mb-10">
                    <Textfield name="title" label="Company Name" />
                  </div>
                  <div className="col-6 mb-10">
                    <Textfield name="name" label="Your Name" />
                  </div>
                  <div className="col-6 mb-10">
                    <Textfield name="email" label="Your e-Mail Address" />
                  </div>
                  <div className="col-12 mb-10">
                    <Textarea name="reviewText" label="Your Reviews" />
                  </div>
                  <div className="product-images">
                    <figure>
                      <button type="button" className="remove-image">
                        <i className="times-icon"></i>
                      </button>
                      <img src="/images/product-img.jpg" alt="" />
                    </figure>
                    <figure>
                      <button type="button" className="remove-image">
                        <i className="times-icon"></i>
                      </button>
                      <img src="/images/product-img.jpg" alt="" />
                    </figure>
                    <figure>
                      <button type="button" className="remove-image">
                        <i className="times-icon"></i>
                      </button>
                      <img src="/images/product-img.jpg" alt="" />
                    </figure>
                    <figure>
                      <button type="button" className="remove-image">
                        <i className="times-icon"></i>
                      </button>
                      <img src="/images/product-img.jpg" alt="" />
                    </figure>
                    <div className="product-images">
                      <input
                        type="file"
                        id="product"
                        accept="image/*, video/*"
                        style={{ display: 'none', height: '71px' }}
                        // onChange={(e) => imageUploadHandler(e)}
                      />

                      <label
                        className="add-new-image"
                        htmlFor="product"
                        style={{ height: '71px' }}
                      >
                        <AiOutlinePlus />
                      </label>
                    </div>
                  </div>
                </div>
                <p className="mt-20 flex">
                  <AiOutlineWarning
                    className="mr-10"
                    style={{ height: 25, width: 25, color: 'red' }}
                  />
                  Allowed file types:
                  <strong className="ml-10">jpg, gif, png</strong>, max total
                  size of files: <strong className="ml-10">24MB</strong>, max
                  number of files:
                  <strong className="ml-10">8</strong>
                </p>
                <div className="center mt-30">
                  <button
                    className="btn-green"
                    onClick={methods.handleSubmit(addNewReview)}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FormProvider>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });
  if (!session) {
    return {
      redirect: {
        destination: '/auth/login',
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
};

export default AddReview;
