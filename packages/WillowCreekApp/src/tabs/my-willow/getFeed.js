import gql from 'graphql-tag';

import { CONTENT_ITEM_FRAGMENT } from 'WillowCreekApp/src/content-single/getContentItem';
import { TILE_CARD_FRAGMENT } from 'WillowCreekApp/src/ui/ContentCardConnected';

export default gql`
  query tvFeed {
    tvFeed {
      edges {
        node {
          id
          ...contentItemFragment
          ...tileCardFragment
        }
      }
    }
  }
  ${CONTENT_ITEM_FRAGMENT}
  ${TILE_CARD_FRAGMENT}
`;