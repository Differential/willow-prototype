import gql from 'graphql-tag';

import { contentItemFragment } from 'WillowCreekApp/src/content-single/getContentItem';
import { tileCardFragment } from 'WillowCreekApp/src/ui/ContentCardConnected';

export default gql`
  query getContentChannels {
    contentChannels {
      id
      name
      childContentItemsConnection(first: 3) {
        edges {
          node {
            id
            ...contentItemFragment
            ...tileCardFragment
          }
        }
      }
    }
  }
  ${contentItemFragment}
  ${tileCardFragment}
`;
