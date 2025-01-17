import { z } from "zod";
import { getApi } from "../api";


type GetTopArtistsRequest = {
  user: string;
  period?: 'overall' | '7day' | '1month' | '3month' | '6month' | '12month';
  limit?: number;
  page?: number;
};


/**
 * Get the top artists listened to by a user. You can stipulate a time period. Sends the overall chart by default.
 * https://www.last.fm/api/show/user.getTopArtists
 */
export async function getTopArtists(request: GetTopArtistsRequest): Promise<GetTopArtistsResponse> {
  const api = getApi();
  const url = constructUrl(api.baseUrl, api.apiKey, request);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  return GetTopArtistsResponse.parse(data);
}

function constructUrl(baseUrl: string, apiKey: string, request: GetTopArtistsRequest): URL {
  const { user, period, limit, page } = request;
  const url = new URL(baseUrl);
  url.searchParams.set(`method`, `user.gettopartists`);
  url.searchParams.set(`format`, `json`);
  url.searchParams.set(`api_key`, apiKey);
  url.searchParams.set(`user`, user);
  period !== undefined && url.searchParams.set(`period`, period);
  page !== undefined && url.searchParams.set(`page`, page.toString(10));
  limit !== undefined && url.searchParams.set(`limit`, limit.toString(10));
  url.searchParams.set(`extended`, '1');
  return url;
}

const ArtistSchema = z.object({
  name: z.string(),
  url: z.string().url(),
  mbid: z.string()
});


const GetTopArtistsResponse = z.object({
  topartists: z.object({
    artist: z.array(ArtistSchema),
    '@attr': z.object({
      user: z.string(),
      totalPages: z.string().transform(Number),
      page: z.string().transform(Number),
      perPage: z.string().transform(Number),
      total: z.string().transform(Number),
    }),
  }),
});
export type GetTopArtistsResponse = z.infer<typeof GetTopArtistsResponse>;
