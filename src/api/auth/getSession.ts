import { z } from "zod";
import { getApi } from "../api";
import { createSignature } from "../utils";

/**
 * Request parameters for getting a session key
 */
type GetSessionRequest = {
  /** Auth token obtained from Last.fm authorization flow */
  authToken: string;
};

/**
 * Fetch a session key for a user after they've authorized your application.
 * @param request - Request parameters
 * @param request.authToken - Auth token obtained from Last.fm authorization flow
 * @returns Promise resolving to session information
 * @throws {Error} If HTTP request fails
 * @see https://www.last.fm/api/show/auth.getSession
 * @example
 * ```typescript
 * const sessionResponse = await getSession({ 
 *   authToken: 'AUTH_TOKEN_FROM_USER' 
 * });
 * const sessionKey = sessionResponse.session.key;
 * ```
 */
export async function getSession(request: GetSessionRequest): Promise<GetSessionResponse> {
  const api = getApi();
  const url = constructUrl(api.baseUrl, api.apiKey, api.sharedSecret, request);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  return GetSessionResponse.parse(data);
}

function constructUrl(baseUrl: string, apiKey: string, sharedSecret: string, request: GetSessionRequest): URL {
  const { authToken } = request;
  const params: Record<string, string> = {
    method: 'auth.getSession',
    api_key: apiKey,
    token: authToken
  };
  const signature = createSignature(params, sharedSecret);
  params['api_sig'] = signature;
  params['format'] = 'json'
  const url = new URL(baseUrl);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }
  return url;
}


/**
 * Zod schema for validating API responses
 */
const GetSessionResponse = z.object({
  session: z.object({
    name: z.string(),
    key: z.string(),
    subscriber: z.number()
  })
});
/**
 * Response from the getSession API call
 */
export type GetSessionResponse = z.infer<typeof GetSessionResponse>;
