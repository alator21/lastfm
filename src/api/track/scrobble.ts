import { z } from "zod";
import { getApi } from "../api";
import { createSignature } from "../utils";


type ScrobbleRequest = {
  artist: string;
  track: string;
  timestamp: Date;
  album?: string;
  sessionKey: string;
};


/**
 * Used to add a track-play to a user's profile
 * https://www.last.fm/api/show/track.scrobble
 */
export async function scrobble(request: ScrobbleRequest): Promise<ScrobbleResponse> {
  const api = getApi();
  const url = constructUrl(api.baseUrl);
  const body = constructBody(api.apiKey, api.sharedSecret, request);
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
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
  const signature = createSignature(params, sharedSecret);
  params['api_sig'] = signature;
  params['format'] = 'json'
  if (album !== undefined) { params['album'] = album; }
  return params;
}

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

export type ScrobbleResponse = z.infer<typeof ScrobbleResponse>;
