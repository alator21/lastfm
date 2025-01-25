import { describe, it, beforeAll } from 'bun:test';
import { initializeLastFmApi } from '../../api';
import { updateNowPlaying } from '../updateNowPlaying';
describe('updateNowPlaying', () => {
  const apiKey = process.env.API_KEY;
  const sharedSecret = process.env.SHARED_SECRET;
  const sessionKey = process.env.SESSION_KEY;

  beforeAll(() => {
    if (apiKey === undefined || sharedSecret === undefined) { throw new Error(`Api key or shared secret missing`); }
    initializeLastFmApi(apiKey, sharedSecret);
  });


  it('updateNowPlaying', async () => {
    if (sessionKey === undefined) {
      throw new Error('session key is missing');
    }
    try {
      await updateNowPlaying({
        artist: 'Paramore',
        track: 'Misery Business',
        sessionKey
      });
    } catch (error) { console.error(error); }
  });

});
