import React, { useState, useMemo, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import { useForm, FormProvider } from 'react-hook-form';
import { gql, useMutation } from '@apollo/client';
import { v4 as uuid } from 'uuid';
import { FaEye, FaPlus, FaSave, FaTimes } from 'react-icons/fa';
import { useAlert } from 'react-alert';

import Combobox from '../../components/controls/combobox';
import TextEditor from '../../components/shared/TextEditor';

import {
  useTypedDispatch,
  useTypedSelector,
} from '../../hooks/useTypedSelector';
import FileButton from '../../components/controls/file';
import Toolbar from '../../components/shared/Toolbar';

import { resetMediaSelection, setMedia } from '../../store/slices/ui';
import Togglebar from '../../components/controls/togglebar';
import Textfield from '../../components/controls/textfield';
import Category from '../../components/clients/Category';
import useClientById from '../../hooks/Client/useClientById';
import Checkbox from '../../components/controls/checkbox';

const CREATE_CLIENT = gql`
  mutation addClient($data: NewClientInput!) {
    addNewClient(data: $data) {
      id
    }
  }
`;

const EDIT_CLIENT = gql`
  mutation editClient($data: EditClient!) {
    EditClientById(data: $data)
  }
`;

const defaultValues = {
  clientName: '',
  isFeatured: false,
};

const AddClient = () => {
  const {
    query: { clid },
    asPath,
    push,
  } = useRouter();
  const alert = useAlert();
  const methods = useForm({
    defaultValues: useMemo(() => defaultValues, [defaultValues]),
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const [description, setDescription] = useState('');
  const [categories, setCategories] = useState([]);

  const [createClient, createState] = useMutation(CREATE_CLIENT);
  const [editClient, editState] = useMutation(EDIT_CLIENT);

  const dispatch = useTypedDispatch();

  const token = useTypedSelector((state) => state.ui.token);
  const images = useTypedSelector((state) => state.ui.clientMedia.images);

  useEffect(() => {
    if (clid !== 'add-new-client') {
      setIsEditMode(true);
      useClientById(clid, token).then((data) => {
        methods.reset(data);
        // @ts-ignore
        dispatch(setMedia({ path: asPath, src: data?.image }));
        // @ts-ignore
        setDescription(data?.description);
        setCategories(data.categories);
      });
    }
  }, [token]);

  const formReset = () => {
    //Resetting
    methods.reset(defaultValues);
    dispatch(resetMediaSelection());
    setCategories([]);
    setDescription('');
  };

  const onSubmit = async (data) => {
    const client = {
      clientName: data?.clientName,
      description,
      logo: images[0],
      isPublished: data.isPublished,
      isFeatured: data.isFeatured,
      categories,
    };

    if (isEditMode) {
      await editClient({
        variables: {
          data: {
            editId: clid,
            editableObject: client,
          },
        },
      });
      if (!editState.error) {
        alert.info('Edited Client Successfully');
      } else {
        alert.error(editState.error.message);
      }
    } else {
      try {
        await createClient({
          variables: {
            data: client,
          },
        });
        if (!createState.error) {
          formReset();
          alert.success('Posted Client Successfully');
        } else {
          throw createState.error.message;
        }
      } catch (error: any) {
        if (error.message) {
          alert.error(error.message);
        } else {
          formReset();
          alert.success('Posted Client Successfully');
        }
      }
    }
  };
  return (
    <div className="container center">
      <Toolbar />
      <FormProvider {...methods}>
        <div
          className="main__content__header"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h2 className="heading-primary">Add Client</h2>
          <div>
            <Togglebar name="isPublished" />

            <button
              type="button"
              className="btn-icon-white ml-20"
              onClick={methods.handleSubmit(onSubmit)}
            >
              <FaSave />
            </button>
            <button
              type="button"
              className="btn-icon-white ml-20"
              onClick={() => {
                formReset();
                push('/client/add-new-client');
              }}
            >
              <FaPlus />
            </button>
            <button
              type="button"
              className="btn-icon-white ml-20"
              onClick={() => push('/client/clients')}
            >
              <FaTimes />
            </button>
          </div>
        </div>
        <div className="wrapper-section">
          <div className="wrapper-section__content">
            <div className="row">
              <div className="col-12">
                <Textfield
                  required
                  label="Client Name"
                  placeholder="Enter Client Name"
                  name="clientName"
                />
              </div>
              <div className="col-12 mt-20">
                <Category
                  categories={categories}
                  setCategories={setCategories}
                />
              </div>
            </div>
            <div className="row" style={{ alignItems: 'center' }}>
              <div className="col-4 mt-60">
                <Checkbox name="isFeatured">Featured Client</Checkbox>
              </div>
              <div
                className="col-8"
                style={{
                  transform: isEditMode ? '' : 'translateY(15px)',
                  flexDirection: 'row',
                }}
              >
                <div className={`field`}>
                  <label>Client Logo</label>
                  <FileButton showMedia page="client" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="wrapper-section">
          <div className="wrapper-section__title flex sb">
            <h3 className="heading-secondary">Description</h3>
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
            onClick={methods.handleSubmit(onSubmit)}
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

export default AddClient;