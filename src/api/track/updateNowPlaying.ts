import { z } from "zod";
import { getApi } from "../api";
import { createSignature } from "../utils";


type UpdateNowPlayingRequest = {
  artist: string;
  track: string;
  album?: string;
  sessionKey: string;
};


/**
 * Used to notify Last.fm that a user has started listening to a track
 * https://www.last.fm/api/show/track.updateNowPlaying
 */
export async function updateNowPlaying(request: UpdateNowPlayingRequest): Promise<UpdateNowPlayingResponse> {
  const api = getApi();
  const url = constructUrl(api.baseUrl);
  const body = constructBody(api.apiKey, api.sharedSecret, request);
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  if (!response.ok) {
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

type UpdateNowPlayingResponse = z.infer<typeof UpdateNowPlayingResponse>;
