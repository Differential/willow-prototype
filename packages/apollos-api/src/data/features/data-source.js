import { Features as baseFeatures } from '@apollosproject/data-connector-rock';
import { get } from 'lodash';
import { createGlobalId } from '@apollosproject/server-core';

export default class Features extends baseFeatures.dataSource {
  async personaFeedAlgorithm({ personaId, contentChannelIds, first = 3 }) {
    const { ContentItem } = this.context.dataSources;

    // Get the first three persona items.
    const personaFeed = await ContentItem.byPersonaFeed({
      personaId,
      first,
      contentChannelIds,
    });
    const items = await personaFeed.get();

    // Map them into specific actions.
    return items.map((item, i) => ({
      id: createGlobalId(`${item.id}${i}`, 'ActionListAction'),
      title: item.title,
      subtitle: get(item, 'contentChannel.name'),
      relatedNode: { ...item, __type: ContentItem.resolveType(item) },
      image: ContentItem.getCoverImage(item),
      action: 'READ_CONTENT',
    }));
  }
}