import React, { Component } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Query } from 'react-apollo';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { SafeAreaView } from 'react-navigation';
import { BackgroundView, PaddedView, FeedView } from '@apollosproject/ui-kit';

import PageTitle from 'WillowCreekApp/src/ui/PageTitle';
import ContentCardConnected from 'WillowCreekApp/src/ui/ContentCardConnected';

import getUserFeed from './getUserFeed';
import Icon from './Icon';

class Grow extends Component {
  static navigationOptions = {
    tabBarIcon: Icon,
    tabBarLabel: 'Grow',
  };

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
      setParams: PropTypes.func,
      navigate: PropTypes.func,
    }),
  };

  handleOnPress = (item) =>
    this.props.navigation.navigate('ContentSingle', {
      itemId: item.id,
      transitionKey: item.transitionKey,
    });

  render() {
    return (
      <BackgroundView>
        <SafeAreaView style={StyleSheet.absoluteFill}>
          <ScrollView>
            <PaddedView>
              <PageTitle>Grow</PageTitle>
            </PaddedView>
            <Query query={getUserFeed} fetchPolicy="cache-and-network">
              {({ loading, error, data, refetch }) => (
                <FeedView
                  ListItemComponent={ContentCardConnected}
                  content={get(data, 'userFeed.edges', []).map(
                    (edge) => edge.node
                  )}
                  isLoading={loading}
                  error={error}
                  refetch={refetch}
                  onPressItem={this.handleOnPress}
                />
              )}
            </Query>
          </ScrollView>
        </SafeAreaView>
      </BackgroundView>
    );
  }
}

export default Grow;
