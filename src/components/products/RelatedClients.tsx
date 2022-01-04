import React from 'react';
import Box from '@component/Box';
import HoverBox from '@component/HoverBox';
import { H2, H4 } from '@component/Typography';
import FlexBox from '@component/FlexBox';

interface ClientProps {
  slides?: number;
  isProductDetails?: boolean;
  clients: any;
}

const RelatedClients: React.FC<ClientProps> = (props) => {
  const { clients } = props;
  const Clients = clients?.map((item, ind) => (
    <Box key={ind} className="client client_related" mr="1rem">
      <HoverBox borderRadius={5} className="client__body">
        <img src={item.imgUrl} className="client__image" />
      </HoverBox>
      <H4 fontSize="1.4rem" fontWeight="600" className="client__title">
        {item.title}
      </H4>
    </Box>
  ));
  return (
    <Box pt="1em" mb="2rem">
      <FlexBox justifyContent="center" alignItems="center" mb="1em">
        <FlexBox alignItems="center">
          <H2
            fontWeight="600"
            fontSize="26px"
            textAlign="center"
            lineHeight="1"
          >
            Our Clients
          </H2>
        </FlexBox>
      </FlexBox>
      <div className="container">
        <div className="scroll-wrapper">{Clients}</div>
        <div className="scroll-wrapper">{Clients}</div>
      </div>
    </Box>
  );
};

export default RelatedClients;
