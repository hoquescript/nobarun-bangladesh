import Box from '@component/Box';
import Button from '@component/buttons/Button';
import IconButton from '@component/buttons/IconButton';
import Card from '@component/Card';
import CheckBox from '@component/CheckBox';
import FlexBox from '@component/FlexBox';
import Grid from '@component/grid/Grid';
import Icon from '@component/icon/Icon';
import Modal from '@component/modal/Modal';
import TextField from '@component/text-field/TextField';
import TextArea from '@component/textarea/TextArea';
import { H1, SemiSpan } from '@component/Typography';
import Link from 'next/link';
import React, { useState } from 'react';

interface AddQueryProps {
  isOpen: boolean;
  setIsOpen: any;
  id: string;
  productName: string;
  productCode: string;
  contact: any;
}
const validateEmail = (email) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  );
};
const AddQuery = (props: AddQueryProps) => {
  const { isOpen, setIsOpen, productName, productCode, contact } = props;

  const [isAgreed, setIsAgreed] = useState(false);
  const [showEmailError, setShowEmailError] = useState(false);
  // const [showPhoneError, setShowPhoneError] = useState(false);

  const [state, setState] = useState({
    fullName: '',
    mobileNo: '',
    email: '',
    company: '',
    address: '',
    attachment: '',
    message: '',
  });

  const onCloseHandler = () => {
    setIsOpen(false);
  };

  const handleChange = (evt) => {
    const value = evt.target.value;
    const name = evt.target.name;
    if (name === 'email') {
      if (validateEmail(value)) setShowEmailError(false);
      else setShowEmailError(true);
    }
    setState({
      ...state,
      [name]: value,
    });
  };

  const onSubmit = () => {
    if (showEmailError) return;
    if (state.email === '' || state.mobileNo === '') return;
    fetch(`https://formsubmit.co/ajax/${contact?.email}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        'Product Name': productName,
        'Product Code': productCode,
        'Full Name': state.fullName,
        'Mobile Number': state.mobileNo,
        'Email Address': state.email,
        'Company Name': state.company,
        Address: state.address,
        Attachment: '',
        Message: state.message,
      }),
    })
      .then((response) => response.json())
      .then(() => {
        setState({
          fullName: '',
          mobileNo: '',
          email: '',
          company: '',
          address: '',
          attachment: '',
          message: '',
        });
        setIsOpen(false);
      })
      .catch((error) => console.log(error));
  };

  return (
    <Modal open={isOpen} onClose={onCloseHandler}>
      <Card className="query" position="relative">
        <Box maxWidth="809px">
          <Box textAlign="center" className="query__header">
            <H1>Product Enquiry</H1>
            <SemiSpan>We will contact you within short time</SemiSpan>
          </Box>
          <IconButton
            style={{ position: 'absolute', right: '15px', top: '15px' }}
            onClick={onCloseHandler}
          >
            <Icon>close</Icon>
          </IconButton>
          <div>
            <div className="query__hero-wrapper">
              <img src="/Review.png" className="query__hero" />
            </div>
            <Box className="query__form">
              <Grid container spacing={5}>
                <Grid item md={6} sm={12} xs={12}>
                  <TextField
                    fullwidth
                    name="fullName"
                    label="Your Full Name"
                    value={state.fullName}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item md={6} sm={12} xs={12}>
                  <TextField
                    fullwidth
                    name="mobileNo"
                    label="Your Mobile No"
                    value={state.mobileNo}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item md={6} sm={12} xs={12}>
                  <TextField
                    fullwidth
                    name="email"
                    label="Your Email Address"
                    value={state.email}
                    errorText={showEmailError && 'Email is wrong'}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item md={6} sm={12} xs={12}>
                  <TextField
                    fullwidth
                    name="company"
                    label="Company Name"
                    value={state.company}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item md={6} sm={12} xs={12}>
                  <TextField
                    fullwidth
                    name="address"
                    label="Full Address"
                    value={state.address}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item md={6} sm={12} xs={12} alignItems="center">
                  <label htmlFor="attachment" className="query__file">
                    <input type="file" name="attachment" id="attachment" />
                    <FlexBox alignItems="center">
                      {/*
                          // @ts-ignore */}
                      <Icon size="5rem" color="#16ACEC" mr="1rem">
                        uploadQuery
                      </Icon>
                      Upload Attachment
                    </FlexBox>
                  </label>
                </Grid>
                <Grid item md={12} sm={12} xs={12}>
                  <TextArea
                    name="message"
                    label="Write your Details Message"
                    labelColor="warn"
                    rows={8}
                    className="query__textarea"
                    value={state.message}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FlexBox alignItems="center">
                    <input
                      type="checkbox"
                      id="terms"
                      name="terms"
                      defaultChecked={isAgreed}
                      onChange={(e) => {
                        console.log(e.target.checked);
                        setIsAgreed(e.target.checked);
                      }}
                    />
                    <label htmlFor="terms">
                      <Link href="/terms">
                        <a className="query__terms">
                          I agree to the terms and conditions
                        </a>
                      </Link>
                    </label>
                  </FlexBox>
                </Grid>

                <Grid item xs={12}>
                  <Button
                    disabled={!isAgreed}
                    variant="contained"
                    size="large"
                    px="4rem"
                    fullwidth
                    style={{
                      backgroundColor: '#EC1C24',
                      color: '#fff',
                      maxWidth: '30rem',
                      margin: 'auto',
                    }}
                    onClick={onSubmit}
                  >
                    Send
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </div>
        </Box>
      </Card>
    </Modal>
  );
};

export default AddQuery;
