import { ContentItem } from '@apollosproject/data-connector-rock';
import ApollosConfig from '@apollosproject/config';
import gql from 'graphql-tag';
import { get } from 'lodash';

const { schema } = ContentItem;
const { ROCK_MAPPINGS } = ApollosConfig;

class ExtendedContentItem extends ContentItem.dataSource {
  expanded = true;

  byPersonaGuid = (guid) =>
    guid
      ? this.request(`ContentChannelItems/GetFromPersonDataView?guids=${guid}`)
          .andFilter(this.LIVE_CONTENT())
          .orderBy('StartDateTime', 'desc')
      : this.request('ContentChannelItems')
          .andFilter(this.LIVE_CONTENT())
          .orderBy('StartDateTime', 'desc');

  getPersonaGuidForCampus = async () => {
    let campusId = 'DEFAULT';
    try {
      const { id } = await this.context.dataSources.Auth.getCurrentPerson();
      const {
        id: rockCampusId,
      } = await this.context.dataSources.Campus.getForPerson({ personId: id });
      campusId = rockCampusId;
    } catch (e) {
      // No campus or no current user.
      return null;
    }
    console.log(campusId);
    if (
      ApollosConfig.ROCK_MAPPINGS.CAMPUS_DATA_VIEWS.find(
        ({ CampusId }) => CampusId === campusId
      )
    ) {
      return ApollosConfig.ROCK_MAPPINGS.CAMPUS_DATA_VIEWS.find(
        ({ CampusId }) => CampusId === campusId
      ).CampusDataViewGuid;
    }
    return null;
  };

  getContentItemsForCampus = async () => {
    const campusPersonaGuid = await this.getPersonaGuidForCampus();
    return this.byPersonaGuid(campusPersonaGuid);
  };
}

const resolver = {
  ...ContentItem.resolver,
  Query: {
    ...ContentItem.resolver.Query,
    growCampaign: async (root, args, { dataSources }) =>
      dataSources.ContentItem.paginate({
        cursor: await dataSources.ContentItem.getCursorByParentContentItemId([
          ROCK_MAPPINGS.GROW_FEATURE_ITEM_ID,
        ]),
        args,
      }),
    myWillowCampaign: async (root, args, { dataSources }) =>
      dataSources.ContentItem.paginate({
        cursor: await dataSources.ContentItem.getCursorByParentContentItemId([
          ROCK_MAPPINGS.MY_WILLOW_FEATURE_ITEM_ID,
        ]),
        args,
      }),
  },
  ContentItem: {
    ...ContentItem.resolver.ContentItem,
    __resolveType: async (attrs, ...otherProps) => {
      if (get(attrs, 'attributeValues.youtubeId.value', '') !== '') {
        return 'WillowTVContentItem';
      }
      if (Object.hasOwnProperty.call(attrs, 'eventOccurrenceId'))
        return 'WillowCalendarEventContentItem';
      // if (
      //   Object.hasOwnProperty.call(attrs, 'kind') &&
      //   attrs.kind.includes('youtube')
      // )
      //   return 'WillowTVContentItem';
      return ContentItem.resolver.ContentItem.__resolveType(
        attrs,
        ...otherProps
      );
    },
  },
};

const overrideSchema = gql`
  ${schema}
  extend type Query {
    growCampaign: ContentItemsConnection
    myWillowCampaign: ContentItemsConnection
  }
`;

export {
  ExtendedContentItem as dataSource,
  resolver,
  overrideSchema as schema,
};
