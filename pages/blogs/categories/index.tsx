import React, { useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  FaGripVertical,
  FaEllipsisV,
  FaTrash,
  FaPen,
  FaPlusCircle,
} from 'react-icons/fa';
import Nestable from 'react-nestable';
import { useState } from 'react';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/client';
import { gql, useMutation } from '@apollo/client';

import Togglebar from '../../../components/controls/togglebar';
import Modal from '../../../components/shared/Modal';

import useBlogCategoriesTree from '../../../hooks/Blogs/useBlogCategoriesTree';
import styles from '../../../styles/pages/products.module.scss';

const SET_CATEGORIES_TREE = gql`
  mutation setBlogCategoriesTree($items: [CreateNewBlogCategoryInput!]!) {
    setBlogCategoriesTree(items: $items)
  }
`;

const DELETE_BLOG_CATEGORY = gql`
  mutation deleteBlogCategory($id: String!) {
    deleteBlogCategory(categoryId: $id)
  }
`;

const Categories = () => {
  const [items, setItems] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [createCategory] = useMutation(SET_CATEGORIES_TREE);
  const [deleteCategory] = useMutation(DELETE_BLOG_CATEGORY);

  useEffect(() => {
    useBlogCategoriesTree().then((category) => setItems(category));
  }, []);

  const setCategoryTreeHandler = (dragInfo) => {
    const { items } = dragInfo;
    setItems(items);
    createCategory({
      variables: {
        items,
      },
    });
  };

  const deleteHandler = (id) => {
    deleteCategory({
      variables: {
        id,
      },
    });
  };

  const renderItem = (props) => {
    const { item, index, collapseIcon, handler } = props;
    return (
      <div className="row">
        <div className="col-1 flex ct" style={{ cursor: 'move' }}>
          <FaGripVertical className="mb-20" />
        </div>
        <div className="col-3">
          <h3 className="custom-input">{item.name}</h3>
        </div>
        <div className="col-5">
          <div
            className="custom-input"
            dangerouslySetInnerHTML={{ __html: item.description }}
          />
        </div>
        <div className="col-3 row">
          <div className="col-5">
            <figure className={`${styles.category__image} center`}>
              <img src="/images/product-img.jpg" alt="" />
            </figure>
          </div>
          <div className="col-7 flex ct">
            <label htmlFor={'publish'} className={`custom-switch`}>
              <input
                type="checkbox"
                id="publish"
                defaultChecked={item.isPublished}
                // {...register(name, { required })}
              />
              <span>&nbsp;</span>
            </label>
            <span className={`ml-20 ${styles.category__menu}`}>
              <FaEllipsisV />
              <Modal
                title="Blog Category"
                modalIsOpen={showDeleteModal}
                setIsOpen={setShowDeleteModal}
                confirmHandler={() => deleteHandler(item._id)}
              />
              <div className="table__action_menu">
                <button
                  onClick={() => {
                    setShowDeleteModal(true);
                    console.log('object');
                  }}
                >
                  <FaTrash />
                </button>
                <Link href={`/blogs/categories/${item._id}`}>
                  <a>
                    <FaPen />
                  </a>
                </Link>
              </div>
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container center">
      <div className="flex sb mb-60">
        <h1 className="heading-primary">Categories</h1>
        <Link href="/blogs/categories/add">
          <a className="btn-outline-green small mr-20">
            <FaPlusCircle className="btn-icon-small" />
            Add Category
          </a>
        </Link>
      </div>
      <div className="row">
        <div className="col-1" />
        <div className="col-3 center">Name</div>
        <div className="col-5 center">Description</div>
        <div className="col-3 row">
          <div className="col-6 center">Image</div>
          <div className="col-6 center">Status</div>
        </div>
        <div className="col-12">
          <Nestable
            items={items}
            renderItem={renderItem}
            onChange={setCategoryTreeHandler}
          />
        </div>
      </div>
    </div>
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

export default Categories;
