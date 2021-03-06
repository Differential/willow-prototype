import React, { PureComponent } from 'react';
import { Query } from 'react-apollo';
import { get } from 'lodash';
import PropTypes from 'prop-types';

import { ErrorCard, ThemeMixin } from '@apollosproject/ui-kit';

import { TrackEventWhenLoaded } from '@apollosproject/ui-analytics';
import { InteractWhenLoadedConnected } from '@apollosproject/ui-connected';

import NavigationHeader from '../ui/NavigationHeader';
import ActionContainer from './ActionContainer';
import GET_CONTENT_ITEM from './getContentItem';

import DevotionalContentItem from './DevotionalContentItem';
import UniversalContentItem from './UniversalContentItem';
import WeekendContentItem from './WeekendContentItem';
import ContentSeriesContentItem from './ContentSeriesContentItem';

class ContentSingle extends PureComponent {
  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
      push: PropTypes.func,
    }),
  };

  static navigationOptions = {
    header: NavigationHeader,
    headerTransparent: true,
    headerMode: 'float',
  };

  get itemId() {
    return this.props.navigation.getParam('itemId', []);
  }

  get queryVariables() {
    return { itemId: this.itemId };
  }

  renderContent = ({ content, loading, error }) => {
    let { __typename } = content;
    if (!__typename && this.itemId) {
      [__typename] = this.itemId.split(':');
    }

    switch (__typename) {
      case 'ContentSeriesContentItem':
        return (
          <ContentSeriesContentItem
            id={this.itemId}
            content={content}
            loading={loading}
            error={error}
          />
        );
      case 'DevotionalContentItem':
        return (
          <DevotionalContentItem
            id={this.itemId}
            content={content}
            loading={loading}
            error={error}
          />
        );
      case 'WeekendContentItem':
        return (
          <WeekendContentItem
            id={this.itemId}
            content={content}
            loading={loading}
            error={error}
          />
        );
      case 'UniversalContentItem':
      case 'WillowTVContentItem':
      default:
        return (
          <UniversalContentItem
            id={this.itemId}
            content={content}
            loading={loading}
            error={error}
          />
        );
    }
  };

  renderWithData = ({ loading, error, data }) => {
    if (error) return <ErrorCard error={error} />;

    const content = data.node || {};

    const { theme = {}, id } = content;
    const colors = get(theme, 'colors') || {};
    const { primary, secondary, screen, paper } = colors;

    return (
      <ThemeMixin
        mixin={
          content.theme
            ? {
                type: 'light',
                colors: {
                  ...(primary ? { primary, tertiary: primary } : {}),
                  ...(secondary ? { secondary } : {}),
                  ...(screen ? { screen } : {}),
                  ...(paper ? { paper } : {}),
                },
              }
            : {}
        }
      >
        <TrackEventWhenLoaded
          loaded={!!(!loading && content.title)}
          eventName={'View Content'}
          properties={{
            title: content.title,
            itemId: this.itemId,
            contentChannel: get(content, 'parentChannel.name'),
          }}
        />
        <InteractWhenLoadedConnected
          isLoading={loading}
          nodeId={this.itemId}
          action={'COMPLETE'}
        />
        {this.renderContent({ content, loading, error })}
        <ActionContainer itemId={id} />
      </ThemeMixin>
    );
  };

  render() {
    return (
      <Query query={GET_CONTENT_ITEM} variables={this.queryVariables}>
        {this.renderWithData}
      </Query>
    );
  }
}

export default ContentSingle;
