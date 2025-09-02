import { z } from "zod";
import { getApi } from "../api";
import { createSignature } from "../utils";


/**
 * Request parameters for scrobbling a track
 */
type ScrobbleRequest = {
  /** The artist name */
  artist: string;
  /** The track name */
  track: string;
  /** When the track was played */
  timestamp: Date;
  /** Album name (optional) */
  album?: string;
  /** User's session key */
  sessionKey: string;
};


/**
 * Add a track play to a user's profile (scrobbles the track).
 * @param request - Request parameters
 * @param request.artist - The artist name
 * @param request.track - The track name
 * @param request.timestamp - When the track was played (Date object)
 * @param request.sessionKey - User's session key
 * @param request.album - Album name (optional)
 * @returns Promise resolving to scrobble result with acceptance status
 * @throws {Error} If HTTP request fails
 * @see https://www.last.fm/api/show/track.scrobble
 * @example
 * ```typescript
 * const response = await scrobble({
 *   artist: 'Radiohead',
 *   track: 'Creep',
 *   album: 'Pablo Honey',
 *   timestamp: new Date(),
 *   sessionKey: 'USER_SESSION_KEY'
 * });
 * console.log(`Accepted: ${response.scrobbles['@attr'].accepted}`);
 * ```
 */
export async function scrobble(request: ScrobbleRequest): Promise<ScrobbleResponse> {
  const api = getApi();
  const url = constructUrl(api.baseUrl);
  const body = constructBody(api.apiKey, api.sharedSecret, request);
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
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
  return ScrobbleResponse.parse(data);
}

function constructUrl(baseUrl: string): URL {
  return new URL(baseUrl);
}

function constructBody(apiKey: string, sharedSecret: string, request: ScrobbleRequest) {
  const { track, artist, sessionKey, timestamp, album } = request;
  const params: Record<string, string> = {
    method: 'track.scrobble',
    artist,
    track,
    timestamp: Math.floor(timestamp.getTime() / 1000).toString(10),
    api_key: apiKey,
    sk: sessionKey
  };
  if (album !== undefined) {
    params['album'] = album;
  }
  const signature = createSignature(params, sharedSecret);
  params['api_sig'] = signature;
  params['format'] = 'json'
  return params;
}

/**
 * Zod schema for validating API responses
 */
const ScrobbleResponse = z.object({
  scrobbles: z.object({
    '@attr': z.object({
      accepted: z.number(),
      ignored: z.number()
    }),
    scrobble: z.object({
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
      timestamp: z.string()
    })
  })
});

/**
 * Response from the scrobble API call containing scrobble results and metadata
 */
export type ScrobbleResponse = z.infer<typeof ScrobbleResponse>;
