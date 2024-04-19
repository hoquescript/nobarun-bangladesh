import { useRouter } from 'next/router';
import { gql } from '@apollo/client';
import client from '../apollo-client';

const GET_LOGIN_DATA = gql`
  query getLoginData($data: LoginInput!) {
    login(data: $data) {
      token
      id
      displayName
      image
      permission {
        Appearance {
          delete
          edit
          view
        }
        Blogs {
          delete
          edit
          view
        }
        Dashboard {
          delete
          edit
          view
        }
        Product {
          delete
          edit
          view
        }
        Settings {
          delete
          edit
          view
        }
        Review {
          delete
          edit
          view
        }
      }
      image
    }
  }
`;

const useUserInfo = async (email, password) => {
  const user = await client.query({
    query: GET_LOGIN_DATA,
    variables: { data: { email, password } },
  });
  return user.data?.login;
};

export default useUserInfo;