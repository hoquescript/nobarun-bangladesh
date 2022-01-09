import { gql } from 'graphql-request';
import Client from '../../config/GraphqlClient';

const GET_ALL_MEDIAS = gql`
  {
    getAllImagesAndVideos {
      images {
        name
        src
        genre
      }
      videos {
        name
        src
        genre
      }
    }
  }
`;

const useAllMedia = async () => {
  const data = await Client.request(GET_ALL_MEDIAS);
  return {
    images: data.getAllImagesAndVideos.images,
    videos: data.getAllImagesAndVideos.videos,
  };
};

export default useAllMedia;
