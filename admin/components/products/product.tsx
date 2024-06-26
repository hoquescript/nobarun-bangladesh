import React, { useEffect } from 'react';
import { useRef } from 'react';
import { FaEye, FaStar } from 'react-icons/fa';

import styles from '../../styles/pages/products.module.scss';

const Product = (props) => {
  const {
    productName,
    category,
    specification,
    productCode,
    images,
    isPublished,
  } = props;

  const description = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const text = description.current?.innerText;
    if (text && description.current && text?.length > 70) {
      const value = text.substring(0, 70).concat('...');
      // console.log(object);
      description.current.innerText = value;
    }
  }, []);

  return (
    <div className={styles.product}>
      <h3 className="heading-tertiary">{productName}</h3>
      <div className="row mt-20">
        <figure className="col-4">
          <img src={images[0]} alt="" />
        </figure>
        <div className="col-8">
          <div className="flex mb-20">
            <input
              type="text"
              className="custom-input small mr-20"
              value={category}
              disabled
              style={{ width: '20rem' }}
            />
            <label htmlFor="product" className={`custom-switch`}>
              <input
                type="checkbox"
                id="isPublished"
                defaultChecked={isPublished}
              />
              <span>&nbsp;</span>
            </label>
          </div>
          <div
            ref={description}
            dangerouslySetInnerHTML={{
              __html: specification,
            }}
          />
          <h4>
            SKU
            <input
              type="text"
              className="custom-input small ml-20 mt-20"
              style={{ width: '12rem' }}
              value={productCode}
              disabled
            />
          </h4>
        </div>
        {/* <div className="col-12"> */}
        <div className={styles.product__info}>
          <span className={styles.product__meta}>
            <span></span>
            <h5 style={{ color: '#e81f1f' }}>Shuvo Islam</h5>
          </span>
          <span className={styles.product__meta}>
            <FaEye className="mr-10" />
            3.5k
          </span>
          <span className={styles.product__meta}>
            <FaStar className="mr-10 mb-5" />
            4.9 (71)
          </span>
        </div>
        {/* </div> */}
      </div>
    </div>
  );
};

export default Product;
