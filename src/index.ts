export { initializeLastFmApi } from './api/api.ts';
// auth
export { getSession, type GetSessionResponse } from './api/auth/getSession.ts'
// track
// export { getInfo } from './api/track/getInfo.ts'
// export { love } from './api/track/love.ts'
export { scrobble, type ScrobbleResponse } from './api/track/scrobble.ts'
// export { unlove } from './api/track/unlove.ts'
export { updateNowPlaying, type UpdateNowPlayingResponse } from './api/track/updateNowPlaying.ts'
// user
export { getTopTracks, type GetTopTracksResponse } from './api/user/getTopTracks.ts'
export { getTopArtists, type GetTopArtistsResponse } from './api/user/getTopArtists.ts'

