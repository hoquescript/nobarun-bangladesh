import React, { useState, useMemo, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import { useForm, FormProvider } from 'react-hook-form';
import { gql, useMutation } from '@apollo/client';
import { FaPlus, FaPlusCircle, FaSave, FaTimes } from 'react-icons/fa';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import { useAlert } from 'react-alert';

import Combobox from '../../../components/controls/combobox';

import TextEditor from '../../../components/shared/TextEditor';
import Togglebar from '../../../components/controls/togglebar';

import {
  useTypedDispatch,
  useTypedSelector,
} from '../../../hooks/useTypedSelector';
import useAllBlogCategories from '../../../hooks/Blogs/useAllBlogCategory';
import useBlogCategoryById from '../../../hooks/Blogs/useBlogCategoryById';
import FileButton from '../../../components/controls/file';
import Toolbar from '../../../components/shared/Toolbar';
import { resetMediaSelection, setMedia } from '../../../store/slices/ui';
import SlugGenerator from '../../../components/blogs/SlugCategory';

const CREATE_CATEGORY = gql`
  mutation addNewBlogCategory($data: CreateNewBlogCategoryInput!) {
    addNewBlogCategory(data: $data) {
      id
    }
  }
`;

const EDIT_CATEGORY = gql`
  mutation editBlogCategory($data: EditBlogCategory!) {
    editBlogCategory(data: $data)
  }
`;

const defaultValues = {
  name: '',
  description: '',
  image: '',
  slug: '',
  isPublished: false,
  parentCategory: '',
};

const AddCategory = () => {
  const alert = useAlert();
  const router = useRouter();
  const catid = router.query.catid;

  const methods = useForm({
    defaultValues: useMemo(() => defaultValues, [defaultValues]),
  });

  const [createCategory, createState] = useMutation(CREATE_CATEGORY);
  const [editCategory, editState] = useMutation(EDIT_CATEGORY);

  const [isEditMode, setIsEditMode] = useState(false);
  const [categories, setCategories] = useState([]);
  const [description, setDescription] = useState('');

  const dispatch = useTypedDispatch();

  const token = useTypedSelector((state) => state.ui.token);
  const images = useTypedSelector((state) => state.ui.blogCategoryMedia.images);

  useEffect(() => {
    if (catid !== 'add') {
      setIsEditMode(true);
      useBlogCategoryById(catid, token).then((data) => {
        methods.reset(data);
        // @ts-ignore
        dispatch(setMedia({ path: router.asPath, src: data.image }));
        // @ts-ignore
        setDescription(data.description);
      });
    }
  }, [token]);

  useEffect(() => {
    useAllBlogCategories().then((category) => setCategories(category));
  }, []);

  const formReset = () => {
    //Resetting
    methods.reset(defaultValues);
    dispatch(resetMediaSelection());
    setDescription('');
  };
  const onSubmit = (data: any) => {
    const category = {
      name: data.name,
      description,
      image: images[0],
      slug: data.slug,
      isPublished: data.isPublished,
      parentCategory: data.parentCategory,
      id: '',
    };

    if (isEditMode) {
      // @ts-ignore
      delete category.id;
      delete category.parentCategory;
      category.id = data.id;

      try {
        editCategory({
          variables: {
            data: {
              editId: catid,
              editableObject: category,
            },
          },
        });
        if (!editState.error) {
          alert.info('Edited Blog Category Successfully');
        } else {
          throw editState.error.message;
        }
      } catch (error: any) {
        if (error.message) {
          alert.error(error.message);
        } else {
          alert.info('Edited Blog Category Successfully');
        }
      }
    } else {
      try {
        category.id = uuid();
        createCategory({
          variables: {
            data: category,
          },
        });
        if (!createState.error) {
          formReset();
          alert.success('Posted Blog Category Successfully');
        } else {
          throw createState.error.message;
        }
      } catch (error: any) {
        if (error.message) {
          alert.error(error.message);
        } else {
          formReset();
          alert.success('Posted Blog Category Successfully');
        }
      }
    }
  };

  const handleError = (error) => {
    Object.values(error).forEach((err) => {
      // @ts-ignore
      alert.error(err.message);
    });
  };

  return (
    <div className="container center">
      <Toolbar />
      <FormProvider {...methods}>
        <div className="main__content__header flex sb">
          <h2 className="heading-primary">Product Editor</h2>
          <div>
            <Togglebar name="isPublished" />
            <button
              type="button"
              className="btn-icon-white ml-20"
              onClick={methods.handleSubmit(onSubmit, handleError)}
            >
              <FaSave />
            </button>
            <button
              type="button"
              className="btn-icon-white ml-20"
              onClick={() => {
                formReset();
                router.push('/blogs/categories/add');
              }}
            >
              <FaPlus />
            </button>
            <button
              type="button"
              className="btn-icon-white ml-20"
              onClick={() => router.push('/blogs/categories')}
            >
              <FaTimes />
            </button>
          </div>
        </div>
        <div className="wrapper-section">
          <div className="wrapper-section__content">
            <div className="row">
              <SlugGenerator
                register={methods.register}
                control={methods.control}
                setValue={methods.setValue}
              />
              {!isEditMode && (
                <div className="col-4 mt-20 mb-20 mr-60">
                  <Combobox
                    name="parentCategory"
                    label="Parent Category"
                    placeholder="Select Category"
                    options={categories || []}
                  />
                </div>
              )}
              <div
                className={isEditMode ? 'col-6 mt-20' : 'col-6  mt-20 ml-60'}
                style={{
                  transform: isEditMode ? '' : 'translateY(30px)',
                  flexDirection: 'row',
                }}
              >
                <FileButton showMedia page="bCategory" />
              </div>
            </div>
          </div>
        </div>
        <div className="wrapper-section">
          <div className="wrapper-section__title flex sb">
            <h3 className="heading-secondary">Description</h3>
            <button type="button" className="btn-outline-green">
              <FaPlusCircle className="btn-icon-small" />
              Add Description
            </button>
          </div>
          <div className="wrapper-section__content">
            <div className="field mt-20">
              <TextEditor
                value={description}
                onChange={(content: string) => setDescription(content)}
              />
            </div>
          </div>
        </div>
        <div className="center mt-30">
          <button
            className="btn-green"
            onClick={methods.handleSubmit(onSubmit, handleError)}
          >
            Save
          </button>
        </div>
      </FormProvider>
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

export default AddCategory;