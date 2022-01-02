import useRecentBlogs from '@hook/useRecentBlogs';
import useWindowSize from '@hook/useWindowSize';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getTheme } from '../../utils/utils';
import Box from '../Box';
import Container from '../Container';
import FlexBox from '../FlexBox';
import Grid from '../grid/Grid';
import Icon from '../icon/Icon';
import Typography from '../Typography';

const StyledLink = styled.a`
  position: relative;
  display: block;
  padding: 0.3rem 0rem;
  color: ${getTheme('colors.gray.500')};
  cursor: pointer;
  border-radius: 4px;
  :hover {
    color: ${getTheme('colors.gray.100')};
  }
`;

const Footer: React.FC = () => {
  const width = useWindowSize();
  const [blogs, setBlogs] = useState([]);
  useEffect(() => {
    useRecentBlogs().then((data) => setBlogs(data));
  }, []);

  const Blog = (
    <Grid item lg={4} md={width < 1025 ? 12 : 6}>
      <Typography fontSize="26px" fontWeight="600" mb="1.25rem" lineHeight="1">
        Recent Blog Post
      </Typography>
      <div>
        {blogs &&
          blogs.map((blog, idx) => (
            <Link href={`/blogs/${blog.blogTitle}`} key={blog.blogTitle + idx}>
              <StyledLink
                style={{
                  color: '#fff',
                  fontSize: '16px',
                  textDecoration: 'underline',
                  fontFamily: "'SolaimanLipi', sans-serif",
                }}
              >
                {blog.blogTitle}
              </StyledLink>
            </Link>
          ))}
      </div>
    </Grid>
  );
  const Contact = (
    <Grid item lg={4} md={6} sm={12} xs={12}>
      <Typography fontSize="18px" mb="1.25rem" textAlign="justify">
        <strong>NOBARUN INTERNATIONAL</strong> is leading supplier of Digital
        Safety & Security Products, Supermarket Equipments, Slaughterhouse
        Equipments & Commercial Kitchen Equipments in Bangladesh.
      </Typography>
      <FlexBox className="flex" mx="-5px">
        {iconList.map((item) => (
          <a
            href={item.url}
            target="_blank"
            rel="noreferrer noopenner"
            key={item.iconName}
          >
            <Box
              m="5px"
              size="small"
              p="10px"
              bg="rgba(0,0,0,0.56)"
              border="1px solid #fff"
              borderRadius="50%"
            >
              <Icon size="12px" defaultcolor="auto">
                {item.iconName}
              </Icon>
            </Box>
          </a>
        ))}
      </FlexBox>
      <Typography py="0.8rem" fontSize="18px" fontWeight="600">
        Copyright @Nobarun International (2017-2021)
      </Typography>
    </Grid>
  );
  return (
    <footer>
      <Box
        style={{
          backgroundImage: 'linear-gradient(#1CA346,#6FBA1A)',
        }}
      >
        <Container p="1rem" color="white">
          <Box py="5rem" overflow="hidden">
            <Grid container spacing={6}>
              <Grid item lg={4} md={6} sm={12}>
                <Typography
                  fontSize="26px"
                  fontWeight="600"
                  mb="1.25rem"
                  lineHeight="1"
                >
                  Corporate Office
                </Typography>
                <Typography fontSize="16px">Planet Ornate</Typography>
                <Typography fontSize="16px">
                  H#199(1st Floor), R#01,Mohakhali New DOHS
                </Typography>
                <Typography fontSize="16px">Dhaka 1206, Bangladesh.</Typography>
                <Typography fontSize="16px" mb="1rem">
                  Email: nobarunbd@gmail.com
                  <br />
                  Phone: +8801711 998626
                </Typography>
              </Grid>
              {width > 1024 || width < 765 ? Blog : Contact}
              {width < 1024 && width > 765 ? Blog : Contact}
            </Grid>
          </Box>
        </Container>
      </Box>
    </footer>
  );
};

const iconList = [
  {
    iconName: 'facebook',
    url: 'hhttps://www.facebook.com/nobaruninternational',
  },
  { iconName: 'twitter', url: 'https://twitter.com/nobarunbd' },
  {
    iconName: 'youtube',
    url: '/',
  },
  { iconName: 'google', url: '/' },
  { iconName: 'instagram', url: '/' },
];

export default Footer;
