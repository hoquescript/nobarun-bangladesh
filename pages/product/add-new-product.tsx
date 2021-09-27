import React, { useState, useEffect } from 'react';
import { gql, useMutation } from '@apollo/client';
import { useForm, FormProvider } from 'react-hook-form';
import { FaEye, FaSave } from 'react-icons/fa';
import Togglebar from '../../components/controls/togglebar';
import { IKeyPoints } from '../../components/products/AddProduct/KeyPoints';
import { IQuestions } from '../../components/products/AddProduct/Questions';
import Description from '../../components/products/tab/description';
import SEO from '../../components/products/tab/seo';
import { TabContent, TabMenu } from '../../components/shared/Tabmenu';
import Toolbar from '../../components/shared/Toolbar';
import useProductInfo from '../../hooks/Products/useProductInfo';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/client';

const CREATE_NEW_PRODUCTS = gql`
  mutation addProduct($data: CreateNewProduct!) {
    createNewProduct(data: $data) {
      id
    }
  }
`;

const AddProduct = () => {
  const methods = useForm();

  const [tabValue, setTabValue] = useState('description');
  const [info, setInfo] = useState({});

  const [createNewProduct] = useMutation(CREATE_NEW_PRODUCTS);
  useEffect(() => {
    useProductInfo().then((data) => {
      setInfo(data);
    });
  }, []);

  const productsImage = useTypedSelector((state) => state.ui.productsImage);

  const KeyPoint = useState<IKeyPoints[]>([
    {
      id: '',
      title: '',
      content: '',
      images: [],
    },
  ]);
  const question = useState<IQuestions[]>([
    {
      id: '',
      title: '',
      question: '',
      isCollapsed: false,
      isDisabled: false,
    },
  ]);

  const [features, setFeatures] = useState('');
  const [specification, setSpecification] = useState('');
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [keywords, setKeywords] = useState<string[]>([]);
  const tagState = useState<string[]>([]);

  const handleAddProduct = (data: any) => {
    console.log('object');
    const product = {
      ...data,
      price: +data.price,
      originalPrice: +data.price,
      discount: +data.discount,
      relatedProducts,
      images: productsImage,
      keyPoints: KeyPoint[0],
      features,
      specification,
      questions: question[0],
      tags: tagState[0],
      keywords,
    };
    createNewProduct({
      variables: {
        data: product,
      },
    });
    console.log(product);
  };
  return (
    <div className="container ml-50" style={{ maxWidth: '120rem' }}>
      <Toolbar />
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
              <button type="button" className="btn-icon-white ml-20">
                <FaEye />
              </button>
              <button
                type="button"
                className="btn-icon-white ml-20"
                onClick={methods.handleSubmit(handleAddProduct)}
              >
                <FaSave />
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
                keyPointState={KeyPoint}
                question={question}
                tagState={tagState}
                setFeatures={setFeatures}
                setSpecification={setSpecification}
                setTabValue={setTabValue}
                productsImage={productsImage}
                info={info}
                relatedProducts={relatedProducts}
                setRelatedProducts={setRelatedProducts}
              />
            </TabContent>
            <TabContent id="seo" value={tabValue}>
              <SEO
                register={methods.register}
                control={methods.control}
                chips={keywords}
                setChips={setKeywords}
                handleAddProduct={methods.handleSubmit(handleAddProduct)}
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
