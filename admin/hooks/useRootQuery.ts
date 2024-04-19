import { gql } from 'graphql-request';
import Client from '../config/GraphqlClient';

const GET_ROOT_QUERY = gql`
  query {
    getRootData {
      totalProducts
      totalEnquery
      totalBlogPost
      totalReviews
      topProductEnquery {
        product {
          id: slug
          productName
          title
          images
        }
        reviewCount
        ratingAverage
      }
      recentProduct {
        product {
          id: slug
          productName
          title
          images
        }
        reviewCount
        ratingAverage
      }
      recentReviews {
        product {
          id: slug
          productName
          title
          images
        }
        reviewCount
        ratingAverage
      }
    }
  }
`;

const useRootQuery = async (token) => {
  const requestHeaders = {
    authorization: `Bearer ${token}`,
  };
  if (token) {
    const data = await Client.request(GET_ROOT_QUERY, {}, requestHeaders);
    const dashboard = data.getRootData;
    return {
      summary: {
        totalProducts: dashboard.totalProducts,
        totalQueries: dashboard.totalEnquery,
        totalPosts: dashboard.totalBlogPost,
        totalReviews: dashboard.totalReviews,
      },
      enquiries: dashboard.topProductEnquery,
      recentProducts: dashboard.recentProduct,
      recentReviews: dashboard.recentReviews,
    };
  } else return {};
};

export default useRootQuery;