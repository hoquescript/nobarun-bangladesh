import React, { useState, useEffect, useMemo } from 'react';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/client';
import { useAlert } from 'react-alert';
import { gql, useMutation } from '@apollo/client';
import { useForm, FormProvider } from 'react-hook-form';
import { FaEye, FaPlus, FaSave, FaTimes } from 'react-icons/fa';
import { v4 as uuid } from 'uuid';
import Togglebar from '../../components/controls/togglebar';

import { TabContent, TabMenu } from '../../components/shared/Tabmenu';
import { IKeyPoints } from '../../components/products/AddProduct/KeyPoints';
import { IQuestions } from '../../components/products/AddProduct/Questions';
import Description from '../../components/products/tab/description';
import SEO from '../../components/products/tab/seo';
import Toolbar from '../../components/shared/Toolbar';

import {
  useTypedDispatch,
  useTypedSelector,
} from '../../hooks/useTypedSelector';

import {
  resetProductMedia,
  selectProductImage,
  selectProductVideo,
  setAllKeypoints,
  setProductMedia,
} from '../../store/slices/products';

import useProductById from '../../hooks/Products/useProductById';
import { useRouter } from 'next/router';

const CREATE_NEW_PRODUCTS = gql`
  mutation addProduct($data: CreateNewProduct!) {
    createNewProduct(data: $data) {
      id
    }
  }
`;

const EDIT_PRODUCT = gql`
  mutation editProduct($data: EditProductInput!) {
    updateProductById(data: $data)
  }
`;

const defaultValues = {
  isPublished: false,
  productName: '',
  banglaVersionLink: '',
  document: '',
  price: '',
  originalPrice: '',
  discount: '',
  productCode: '',
  category: '',
  collectionName: '',
  stockStatus: '',
  contactPerson: '',
  SeoTitle: '',
  title: '',
  slug: '',
  url: '',
  siteMap: '',
};

const defaultKeypoints = {
  [uuid()]: {
    title: '',
    content: '',
    images: [] as string[],
    videos: [] as string[],
  },
};

const defaultQuestions = {
  [uuid()]: {
    title: '',
    question: '',
    isCollapsed: false,
    isDisabled: false,
  },
};

const AddProduct = () => {
  const alert = useAlert();
  const methods = useForm({
    defaultValues: useMemo(() => defaultValues, [defaultValues]),
  });
  const router = useRouter();
  const pid = router.query.pid;

  const [isEditMode, setIsEditMode] = useState(false);
  const [productId, setProductId] = useState('');
  const [tabValue, setTabValue] = useState('description');

  const [createNewProduct, createState] = useMutation(CREATE_NEW_PRODUCTS);
  const [editProduct, editState] = useMutation(EDIT_PRODUCT);

  const KeyPoint = useState<{ [k: string]: IKeyPoints }>(defaultKeypoints);
  const question = useState<{ [k: string]: IQuestions }>(defaultQuestions);

  const [page, setPage] = useState('');
  const [postSectionKey, setPostSectionKey] = useState('');
  const [info, setInfo] = useState<any>({});

  const [features, setFeatures] = useState('');
  const [specification, setSpecification] = useState('');
  const [relatedProducts, setRelatedProducts] = useState<
    { id: string; value: string }[]
  >([]);
  const [relatedClients, setRelatedClients] = useState<
    { id: string; value: string }[]
  >([]);
  const [relatedCategories, setRelatedCategories] = useState<
    { id: string; value: string }[]
  >([]);

  const [keywords, setKeywords] = useState<string[]>([]);
  const tagState = useState<string[]>([]);

  const dispatch = useTypedDispatch();
  const productMedia = useTypedSelector(
    (state) => state.products.productMedia.main,
  );
  const productKeypoints = useTypedSelector(
    (state) => state.products.productMedia.keyPoints,
  );
  const points = useTypedSelector((state) => state.products.productKeypoints);

  const author = useTypedSelector((state) => state.profile.userId);

  const formReset = () => {
    //Form Reset
    methods.reset(defaultValues);
    KeyPoint[1](defaultKeypoints);
    question[1](defaultQuestions);
    setFeatures('');
    setSpecification('');
    setRelatedProducts([]);
    setRelatedCategories([]);
    setRelatedClients([]);
    setKeywords([]);
    tagState[1]([]);
    dispatch(resetProductMedia());
    setIsEditMode(false);
  };

  const handleAddProduct = async (data: any) => {
    if (!productMedia.featured) {
      alert.error('Please set a Featured Image');
      return;
    }
    if (info.slugs.some((row) => row.slug === data.slug && data.slug !== pid)) {
      alert.error('Duplicate Product Slug');
      return;
    }

    const keyPoints = Object.keys(KeyPoint[0]).map((key) => {
      const keypoint = KeyPoint[0][key];
      return {
        id: key,
        title: keypoint.title,
        content: points[key],
        images: productKeypoints[key] && productKeypoints[key].images,
        videos: productKeypoints[key] && productKeypoints[key].videos,
      };
    });

    const questions = Object.keys(question[0]).map((key) => {
      const data = question[0][key];
      return {
        id: key,
        title: data.title,
        question: data.question,
      };
    });

    const product = {
      ...data,
      price: +data.price,
      originalPrice: +data.originalPrice,
      discount: +data.discount,
      categories: relatedCategories.map((category) => category.value),
      relatedProducts: relatedProducts.map((product) => product.value),
      relatedClients: relatedClients.map((client) => client.value),
      featured: productMedia.featured,
      images: productMedia.images,
      videos: productMedia.videos,
      keyPoints,
      features,
      specification,
      questions: questions,
      tags: tagState[0],
      keywords,
      author,
    };

    if (data.collectionName === '') delete product.collectionName;
    if (!data.stockStatus){
      data.stockStatus=null;
      product.stockStatus=null;
    }
    if (data.contactPerson === '') delete product.contactPerson;
    if (isEditMode) {
      delete product.id;
      try {
        await editProduct({
          variables: {
            data: {
              editId: productId,
              editableObject: product,
            },
          },
        });
        if (!editState.error) {
          alert.info('Edited Product Successfully');
          setTabValue('description');
          router.push(`/product/${product.slug}`);
        } else {
          throw editState.error.message;
        }
      } catch (error: any) {
        if (error.message) {
          alert.error(error.message);
        } else {
          alert.info('Edited Product Successfully');
          setTabValue('description');
          router.push(`/product/${product.slug}`);
        }
      }
    } else {
      try {
        await createNewProduct({
          variables: {
            data: product,
          },
        });
        if (!createState.error) {
          alert.success('Added New Product Successfully');
          setTabValue('description');
          formReset();
        } else {
          throw createState.error.message;
        }
      } catch (error: any) {
        if (error.message) {
          alert.error(error.message);
        } else {
          alert.success('Added New Product Successfully');
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

  useEffect(() => {
    if (pid !== 'add-new-product') {
      setIsEditMode(true);
      useProductById(pid).then((data) => {
        setProductId(data.mainContent.id);
        methods.reset(data.mainContent);
        KeyPoint[1](data.keyPoints.contents);
        dispatch(setAllKeypoints(data.keyPoints.points));
        dispatch(
          setProductMedia({
            main: data.main,
            keypoint: data.keyPoints.media,
          }),
        );
        question[1](data.questions);
        setFeatures(data.features);
        setSpecification(data.specification);
        setRelatedProducts(data.relatedProducts);
        setRelatedClients(data.relatedClients);
        setRelatedCategories(data.relatedCategories);
        setKeywords(data.keywords);
        tagState[1](data.tags);
      });
    }
  }, []);

  const selectImageHandler = (imageSrc) => {
    dispatch(selectProductImage({ page, src: imageSrc, key: postSectionKey }));
  };
  const selectVideoHandler = (imageSrc) => {
    dispatch(selectProductVideo({ page, src: imageSrc, key: postSectionKey }));
  };

  return (
    <div className="container ml-50" style={{ maxWidth: '120rem' }}>
      <Toolbar
        imageSelector={selectImageHandler}
        videoSelector={selectVideoHandler}
      />
      <FormProvider {...methods}>
        <div>
          <div
            className="main__content__header"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <h2 className="page-title">Product Editor</h2>
            <div>
              <Togglebar name="isPublished">Publish</Togglebar>
              <button
                type="button"
                className="btn-icon-white ml-20"
                onClick={methods.handleSubmit(handleAddProduct, handleError)}
              >
                <FaSave />
              </button>
              {isEditMode && (
                <a
                  className="btn-icon-white ml-20"
                  href={`https://nobarunbd.vercel.app/${pid}`}
                  target="_blank"
                >
                  <FaEye />
                </a>
              )}
              <button
                type="button"
                className="btn-icon-white ml-20"
                onClick={() => {
                  formReset();
                  router.push('/product/add-new-product');
                }}
              >
                <FaPlus />
              </button>
              <button
                type="button"
                className="btn-icon-white ml-20"
                onClick={() => router.push('/product/products')}
              >
                <FaTimes />
              </button>
            </div>
          </div>
          <TabMenu
            menus={['Description', 'SEO']}
            value={tabValue}
            setTabValue={setTabValue}
          >
            <TabContent id="description" value={tabValue}>
              <Description
                register={methods.register}
                control={methods.control}
                getValues={methods.getValues}
                setValue={methods.setValue}
                keyPointState={KeyPoint}
                question={question}
                tagState={tagState}
                features={features}
                setFeatures={setFeatures}
                specification={specification}
                setSpecification={setSpecification}
                setTabValue={setTabValue}
                relatedProducts={relatedProducts}
                setRelatedProducts={setRelatedProducts}
                relatedCategories={relatedCategories}
                setRelatedCategories={setRelatedCategories}
                setPage={setPage}
                setPostSectionKey={setPostSectionKey}
                relatedClients={relatedClients}
                setRelatedClients={setRelatedClients}
                info={info}
                setInfo={setInfo}
                isEditMode={isEditMode}
              />
            </TabContent>
            <TabContent id="seo" value={tabValue}>
              <SEO
                register={methods.register}
                control={methods.control}
                setValue={methods.setValue}
                chips={keywords}
                setChips={setKeywords}
                handleAddProduct={methods.handleSubmit(
                  handleAddProduct,
                  handleError,
                )}
              />
            </TabContent>
          </TabMenu>
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

export default AddProduct;
