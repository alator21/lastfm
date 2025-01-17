import { z } from "zod";
import { getApi } from "../api";
import { createSignature } from "../utils";

type GetSessionRequest = {
  authToken: string;
};

/**
 * Fetch a session key for a user.
 * https://www.last.fm/api/show/auth.getSession
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

const GetSessionResponse = z.object({
  session: z.object({
    name: z.string(),
    key: z.string(),
    subscriber: z.number()
  })
});
export type GetSessionResponse = z.infer<typeof GetSessionResponse>;
