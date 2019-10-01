import React, { PureComponent } from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import { get } from 'lodash';

import {
  FeedView,
  PaddedView,
  BackgroundView,
  ThemeMixin,
  HighlightCard,
} from '@apollosproject/ui-kit';

import { SafeAreaView } from 'react-navigation';
import PageTitle from '../../ui/PageTitle';
import CampusSelectButton from '../../ui/CampusSelectButton';
import OverlayBackgroundImage from '../../ui/OverlayBackgroundImage';
import FindCampusAd from '../../ui/FindCampusAd';
import fetchMoreResolver from '../../utils/fetchMoreResolver';

import StretchyView from '../../ui/StretchyView';
import FeaturesFeed from '../home/Features';
import CampaignFeed from '../../ui/CampaignFeed';

import GET_FEED from './getFeed';
import GET_USER_CAMPUS from './getUserCampus';

import Icon from './Icon';

class MyWillow extends PureComponent {
  static navigationOptions = {
    tabBarIcon: Icon,
    tabBarLabel: 'My Willow',
  };

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
      setParams: PropTypes.func,
      navigate: PropTypes.func,
    }),
  };

  handleOnPress = (item) => {
    this.props.navigation.navigate('ContentSingle', {
      itemId: item.id,
      transitionKey: item.transitionKey,
    });
  };

  renderNoCampusContent = () => <FindCampusAd />;

  renderMyWillowContent() {
    return (
      <BackgroundView>
        <StretchyView
          StretchyComponent={
            <OverlayBackgroundImage style={{ aspectRatio: 0.8 }} />
          }
        >
          {(scrollViewProps) => (
            <SafeAreaView style={StyleSheet.absoluteFill}>
              <Query
                query={GET_FEED}
                variables={{
                  first: 10,
                  after: null,
                }}
                fetchPolicy="cache-and-network"
              >
                {({ loading, error, data, refetch, fetchMore, variables }) => (
                  <FeedView
                    ListItemComponent={({ title, coverImage, summary }) => (
                      <HighlightCard
                        title={title}
                        coverImage={coverImage && coverImage.sources}
                        summary={summary}
                        hasAction
                      />
                    )}
                    ListHeaderComponent={
                      <>
                        <ThemeMixin mixin={{ type: 'dark' }}>
                          <PaddedView>
                            <PageTitle>My Willow</PageTitle>
                            <CampusSelectButton bordered />
                          </PaddedView>
                        </ThemeMixin>
                        <CampaignFeed
                          type="myWillowCampaign"
                          onPressItem={this.handleOnPress}
                        />
                        <FeaturesFeed navigation={this.props.navigation} />
                      </>
                    }
                    content={get(data, 'tvFeed.edges', []).map(
                      (edge) => edge.node
                    )}
                    fetchMore={fetchMoreResolver({
                      collectionName: 'tvFeed',
                      fetchMore,
                      variables,
                      data,
                    })}
                    isLoading={loading}
                    error={error}
                    refetch={refetch}
                    onPressItem={this.handleOnPress}
                    {...scrollViewProps}
                  />
                )}
              </Query>
            </SafeAreaView>
          )}
        </StretchyView>
      </BackgroundView>
    );
  }

  render() {
    return (
      <Query query={GET_USER_CAMPUS} fetchPolicy="cache-and-network">
        {({
          data: { currentUser: { profile: { campus } = {} } = {} } = {},
          loading,
        }) =>
          campus || loading
            ? this.renderMyWillowContent()
            : this.renderNoCampusContent()
        }
      </Query>
    );
  }
}

export default MyWillow;
