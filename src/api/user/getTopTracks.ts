import { z } from "zod";
import { getApi } from "../api";

/**
 * Request parameters for getting a user's top tracks
 */
type GetTopTracksRequest = {
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
 * Get the top tracks for a user over a specified time period.
 * @param request - Request parameters
 * @param request.user - Last.fm username
 * @param request.period - Time period: 'overall' | '7day' | '1month' | '3month' | '6month' | '12month' (default: 'overall')
 * @param request.limit - Number of results per page (default: 50, max: 1000)
 * @param request.page - Page number for pagination (default: 1)
 * @returns Promise resolving to top tracks with metadata
 * @throws {Error} If HTTP request fails
 * @see https://www.last.fm/api/show/user.getTopTracks
 * @example
 * ```typescript
 * const response = await getTopTracks({
 *   user: 'username',
 *   period: '1month',
 *   limit: 10
 * });
 * response.toptracks.track.forEach((track, index) => {
 *   console.log(`${index + 1}. ${track.name} by ${track.artist.name} (${track.playcount} plays)`);
 * });
 * ```
 */
export async function getTopTracks(request: GetTopTracksRequest): Promise<GetTopTracksResponse> {
  const api = getApi();
  const url = constructUrl(api.baseUrl, api.apiKey, request);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  return GetTopTracksResponse.parse(data);
}

function constructUrl(baseUrl: string, apiKey: string, request: GetTopTracksRequest): URL {
  const { user, period, limit, page } = request;
  const url = new URL(baseUrl);
  url.searchParams.set(`method`, `user.gettoptracks`);
  url.searchParams.set(`format`, `json`);
  url.searchParams.set(`api_key`, apiKey);
  url.searchParams.set(`user`, user);
  period !== undefined && url.searchParams.set(`period`, period);
  page !== undefined && url.searchParams.set(`page`, page.toString(10));
  limit !== undefined && url.searchParams.set(`limit`, limit.toString(10));
  url.searchParams.set(`extended`, '1');
  return url;
}



const ImageSchema = z.object({
  '#text': z.string().url(),
  size: z.enum(['small', 'medium', 'large', 'extralarge']),
});

const ArtistSchema = z.object({
  name: z.string(),
  url: z.string().url(),
  mbid: z.string()
});

const TrackSchema = z.object({
  name: z.string(),
  playcount: z.string().transform(Number),
  mbid: z.string().optional(),
  url: z.string().url(),
  duration: z.string().transform(Number),
  artist: ArtistSchema,
  image: z.array(ImageSchema),
  '@attr': z.object({
    rank: z.string().transform(Number),
  }),
  streamable: z.object({
    '#text': z.string(),
    fulltrack: z.string(),
  }),
});

/**
 * Zod schema for validating API responses
 */
const GetTopTracksResponse = z.object({
  toptracks: z.object({
    track: z.array(TrackSchema),
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
 * Response from the getTopTracks API call containing user's top tracks with metadata
 */
export type GetTopTracksResponse = z.infer<typeof GetTopTracksResponse>;
