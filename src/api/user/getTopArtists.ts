import { z } from "zod";
import { getApi } from "../api";


/**
 * Request parameters for getting a user's top artists
 */
type GetTopArtistsRequest = {
  /** Last.fm username */
  user: string;
  /** Time period (default: 'overall') */
  period?: 'overall' | '7day' | '1month' | '3month' | '6month' | '12month';
  /** Number of results per page (default: 50, max: 1000) */
  limit?: number;
  /** Page number for pagination (default: 1) */
  page?: number;
};


/**
 * Get the top artists listened to by a user over a specified time period.
 * @param request - Request parameters
 * @param request.user - Last.fm username
 * @param request.period - Time period: 'overall' | '7day' | '1month' | '3month' | '6month' | '12month' (default: 'overall')
 * @param request.limit - Number of results per page (default: 50, max: 1000)
 * @param request.page - Page number for pagination (default: 1)
 * @returns Promise resolving to top artists with metadata
 * @throws {Error} If HTTP request fails
 * @see https://www.last.fm/api/show/user.getTopArtists
 * @example
 * ```typescript
 * const response = await getTopArtists({
 *   user: 'username',
 *   period: '6month',
 *   limit: 5
 * });
 * response.topartists.artist.forEach((artist, index) => {
 *   console.log(`${index + 1}. ${artist.name}`);
 * });
 * ```
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


/**
 * Zod schema for validating API responses
 */
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
/**
 * Response from the getTopArtists API call containing user's top artists with metadata
 */
export type GetTopArtistsResponse = z.infer<typeof GetTopArtistsResponse>;
