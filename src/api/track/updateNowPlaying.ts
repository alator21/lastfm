import { z } from "zod";
import { getApi } from "../api";
import { createSignature } from "../utils";


/**
 * Request parameters for updating now playing status
 */
type UpdateNowPlayingRequest = {
  /** The artist name */
  artist: string;
  /** The track name */
  track: string;
  /** Album name (optional) */
  album?: string;
  /** User's session key */
  sessionKey: string;
};


/**
 * Notify Last.fm that a user has started listening to a track.
 * @param request - Request parameters
 * @param request.artist - The artist name
 * @param request.track - The track name
 * @param request.sessionKey - User's session key
 * @param request.album - Album name (optional)
 * @returns Promise resolving to now playing status
 * @throws {Error} If HTTP request fails
 * @see https://www.last.fm/api/show/track.updateNowPlaying
 * @example
 * ```typescript
 * const response = await updateNowPlaying({
 *   artist: 'The Beatles',
 *   track: 'Hey Jude',
 *   album: 'Hey Jude',
 *   sessionKey: 'USER_SESSION_KEY'
 * });
 * console.log(`Now playing: ${response.nowplaying.track['#text']}`);
 * ```
 */
export async function updateNowPlaying(request: UpdateNowPlayingRequest): Promise<UpdateNowPlayingResponse> {
  const api = getApi();
  const url = constructUrl(api.baseUrl);
  const body = constructBody(api.apiKey, api.sharedSecret, request);
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams(body)
  });
  if (!response.ok) {
    console.error(response);
    const blob = await response.blob();
    const text = await blob.text()
    console.error(text);
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  return UpdateNowPlayingResponse.parse(data);
}

function constructUrl(baseUrl: string): URL {
  return new URL(baseUrl);
}

function constructBody(apiKey: string, sharedSecret: string, request: UpdateNowPlayingRequest) {
  const { track, artist, sessionKey, album } = request;
  const params: Record<string, string> = {
    method: 'track.updateNowPlaying',
    artist,
    track,
    api_key: apiKey,
    sk: sessionKey
  };
  if (album !== undefined) {
    params['album'] = album;
  }
  const signature = createSignature(params, sharedSecret);
  params['api_sig'] = signature;
  params['format'] = 'json'
  if (album !== undefined) { params['album'] = album; }
  return params;
}

const UpdateNowPlayingResponse = z.object({
  nowplaying: z.object({
    artist: z.object({
      '#text': z.string(),
      corrected: z.string()
    }),
    albumArtist: z.object({
      '#text': z.string(),
      corrected: z.string()
    }),
    track: z.object({
      '#text': z.string(),
      corrected: z.string()
    }),
    album: z.object({
      '#text': z.string(),
      corrected: z.string()
    }),
    ignoredMessage: z.object({
      '#text': z.string(),
      code: z.string()
    }),
  })
});

/**
 * Response from the updateNowPlaying API call containing now playing status
 */
export type UpdateNowPlayingResponse = z.infer<typeof UpdateNowPlayingResponse>;
