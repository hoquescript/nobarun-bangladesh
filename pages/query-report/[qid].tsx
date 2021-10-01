import React, { useState, useMemo, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import { gql, useMutation } from '@apollo/client';
import { useForm, FormProvider } from 'react-hook-form';
import { useAlert } from 'react-alert';

import Textarea from '../../components/controls/textarea';
import Textfield from '../../components/controls/textfield';

import { InputFileUpload } from '../../components/controls/fileUpload';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import useQueryById from '../../hooks/Query/useQueryById';
import styles from '../../styles/pages/query-report.module.scss';
import ProductCode from '../../components/shared/ProductCode';

const ADD_NEW_QUERY = gql`
  mutation addNewQuery($data: AddQueryUserInput!) {
    addNewQueryUserByAdmin(data: $data) {
      name
    }
  }
`;

const EDIT_NEW_QUERY = gql`
  mutation editQuery($data: EditQueryUserInput!) {
    editQueryUserInfo(data: $data)
  }
`;

const defaultValues = {
  companyName: '',
  email: '',
  fullName: '',
  message: '',
  notes: '',
  number: '',
  address: '',
  productCode: '',
};

const AddNewQuery = () => {
  const methods = useForm({
    defaultValues: useMemo(() => defaultValues, [defaultValues]),
  });
  const alert = useAlert();
  const router = useRouter();
  const qid = router.query.qid;

  const [createQuery, createState] = useMutation(ADD_NEW_QUERY);
  const [editQuery, editState] = useMutation(EDIT_NEW_QUERY);

  const [isEditMode, setIsEditMode] = useState(false);
  const [attachment, setAttachment] = useState('');
  const fileInputRef = React.useRef();

  const addNewQuery = (data) => {
    const query = {
      company: data.companyName,
      email: data.email,
      name: data.fullName,
      message: data.message,
      notes: data.notes,
      phone: data.number,
      address: data.address,
      productCode: data.productCode,
      attachment,
    };
    methods.reset(defaultValues);
    setAttachment('');
    // @ts-ignore
    fileInputRef.current.value = '';
    if (isEditMode) {
      editQuery({
        variables: {
          data: {
            editId: qid,
            editableObject: query,
          },
        },
      });
      if (!editState.error) {
        alert.info('Edited Query Successfully');
      } else {
        alert.error(editState.error.message);
      }
    } else {
      createQuery({
        variables: {
          data: query,
        },
      });
      if (!createState.error) {
        alert.success('Posted Query Successfully');
      } else {
        alert.error(createState.error.message);
      }
    }
  };

  const token = useTypedSelector((state) => state.ui.token);
  useEffect(() => {
    if (qid !== 'add-new-query') {
      setIsEditMode(true);
      useQueryById(qid, token).then((data) => {
        methods.reset(data);
        // @ts-ignore
        setAttachment(data.attachment);
      });
    }
  }, [token]);

  return (
    <div className={styles.addNewQuery}>
      <h1 className="heading-primary ml-5 mb-40">Add New Query</h1>
      <FormProvider {...methods}>
        <div className="grid two mb-20">
          <Textfield
            name="fullName"
            label="Full Name"
            placeholder="Enter your Name"
          />
          <Textfield
            type="tel"
            name="number"
            label="Phone"
            placeholder="Enter your Number"
          />
        </div>
        <div className="grid two mb-20">
          <Textfield
            type="email"
            name="email"
            label="Email"
            placeholder="Enter your Email"
          />
          <Textfield
            name="address"
            label="Address"
            placeholder="Enter your Address"
          />
        </div>
        <div className="grid two mb-20">
          <div className="field">
            <label>Attachments</label>
            <InputFileUpload
              ref={fileInputRef}
              onChangeHandler={(url) => setAttachment(url)}
            />
          </div>
          <Textfield
            name="companyName"
            label="Company Name"
            placeholder="Enter your Company Name"
          />
        </div>
        <div className="grid three mt-30 mb-30">
          <ProductCode />
        </div>
        <div className="grid one mb-20">
          <Textarea name="message" label="Message" />
        </div>
        <div className="grid one mb-20">
          <Textarea name="notes" label="Add your Notes" />
        </div>
        <div className="center mt-30">
          <button
            className="btn-green"
            onClick={methods.handleSubmit(addNewQuery)}
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

export default AddNewQuery;
