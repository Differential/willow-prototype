import { RESTDataSource } from 'apollo-datasource-rest';
import ApollosConfig from '@apollosproject/config';
// import { report } from '../bugsnag';

export default class LiveStream extends RESTDataSource {
  async getIsLive({ channelId }) {
    let response;
    try {
      response = await this.get(
        `https://www.youtube.com/channel/${channelId}/live`,
        null,
        { cacheOptions: { ttl: 60 } }
      );

      const isLive =
        response.includes('og:video:url') &&
        !response.includes('\\"status\\":\\"LIVE_STREAM_OFFLINE\\"');

      if (isLive) {
        const videoId = response.match(
          /itemprop="videoId" content="(.*?)">/
        )[1];
        return { isLive: true, videoId };
      }
    } catch (e) {
      report(e, { Youtube: { ChannelId: channelId, Response: response } });
    }
    return { isLive: false };
  }

  // Given a logged in user, what is the youtube channelID of their campus?
  getYoutubeChannelIdForCampus = async () => {
    const { Person } = this.context.dataSources;
    const { campusId } = await Person.getCurrentUserCampusId();

    if (!campusId) {
      return null;
    }

    // Now let's lookup the GUID for the CampusId (static values)
    const campusConfig = ApollosConfig.ROCK_MAPPINGS.CAMPUS_DATA_VIEWS.find(
      ({ CampusId }) => CampusId === campusId
    );
    if (campusConfig) {
      return campusConfig.YoutubeChannelId;
    }
    return null;
  };

  async getLiveStream() {
    const channelId = await this.getYoutubeChannelIdForCampus();
    if (!channelId) return { isLive: false };

    const { isLive, videoId } = await this.getIsLive.call(this, { channelId });

    if (isLive) {
      return {
        isLive,
        media: { sources: [{ uri: videoId }] },
      };
    }
    return { isLive: false };
  }

  async getLiveStreams() {
    const { ContentItem } = this.context.dataSources;
    // This logic is a little funky right now.
    // The follow method looks at the sermon feed and the `getLiveStream` on this module
    // If we have data in the sermon feed, and the `getLiveStream.isLive` is true
    // this returns an array of livestreams
    const liveItems = await ContentItem.getActiveLiveStreamContent();
    return Promise.all(
      liveItems.map(async (item) => ({
        contentItem: item,
        ...(await this.getLiveStream()),
      }))
    );
  }
}
