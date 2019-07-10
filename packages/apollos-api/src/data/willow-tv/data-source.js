import { RESTDataSource } from 'apollo-datasource-rest';

export default class Youtube extends RESTDataSource {
  baseURL = 'https://content.googleapis.com/youtube/v3';

  willSendRequest = (request) => {
    request.params.set('key', process.env.YOUTUBE_API_KEY);
  };

  async getFromId(id) {
    const result = await this.get('videos', { part: 'snippet', id });
    console.log(result.items[0]);
    if (!result.items || !result.items.length) return null;

    return result.items[0];
  }

  getPlaylistItems = (playlistId) =>
    this.get('playlistItems', {
      part: 'snippet',
      playlistId,
    }).then((result) => ({
      ...result,
      items: result.items.map((item) => ({
        ...item,
        id: item.snippet.resourceId.videoId,
      })),
    }));
}
