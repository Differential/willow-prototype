import React from 'react';
import { Query, Mutation } from 'react-apollo';

import PropTypes from 'prop-types';

import Share from 'apolloschurchapp/src/ui/Share';
import Like from 'apolloschurchapp/src/ui/Like';
import getSessionId from 'apolloschurchapp/src/store/getSessionId';
import SideBySideView from 'apolloschurchapp/src/ui/SideBySideView';

import createInteraction from './createInteraction';
import getLikedContentItem from './getLikedContentItem';

const ActionContainer = ({ content, itemId }) => (
  <SideBySideView>
    <Query query={getSessionId} fetchPolicy="cache-only">
      {({ data: { sessionId } }) =>
        sessionId ? (
          <Query query={getLikedContentItem} variables={{ itemId }}>
            {({
              data: {
                node: { isLiked },
              },
              refetch,
            }) => (
              <Mutation
                mutation={createInteraction}
                update={(
                  cache,
                  {
                    data: {
                      createInteraction: { operation },
                    },
                  }
                ) => {
                  cache.writeQuery({
                    query: getLikedContentItem,
                    data: { isLiked: operation === 'Like' },
                  });
                }}
              >
                {(createNewInteraction) => (
                  <Like
                    itemId={itemId}
                    sessionId={sessionId}
                    isLiked={isLiked}
                    operation={isLiked ? 'Unlike' : 'Like'}
                    toggleLike={async (variables) => {
                      try {
                        await createNewInteraction({ variables });
                        await refetch();
                      } catch (e) {
                        console.log(e);
                      }
                    }}
                  />
                )}
              </Mutation>
            )}
          </Query>
        ) : null
      }
    </Query>
    <Share content={content} />
  </SideBySideView>
);

ActionContainer.propTypes = {
  content: PropTypes.shape({}),
  itemId: PropTypes.string,
};

export default ActionContainer;