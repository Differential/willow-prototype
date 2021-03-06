import { ContentItem } from '@apollosproject/data-connector-rock';
import gql from 'graphql-tag';

const { schema } = ContentItem;

export default gql`
  ${schema}

  type WillowTVContentItem implements Node & ContentItem {
    id: ID!
    title(hyphenated: Boolean): String
    coverImage: ImageMedia
    images: [ImageMedia]
    videos: [VideoMedia]
    audios: [AudioMedia]
    htmlContent: String
    summary: String
    childContentItemsConnection(
      first: Int
      after: String
    ): ContentItemsConnection
    siblingContentItemsConnection(
      first: Int
      after: String
    ): ContentItemsConnection
    parentChannel: ContentChannel
    theme: Theme
    liveStream: LiveStream
    publishDate: String
  }

  extend type VideoMedia {
    youtubeId: String
  }

  extend type Query {
    tvFeed: ContentItemsConnection @cacheControl(maxAge: 0)
  }
`;
