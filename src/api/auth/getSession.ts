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
  const method = 'auth.getSession';
  const signature = createSignature({
    method,
    "api_key": apiKey,
    "token": authToken
  }, sharedSecret);
  const url = new URL(baseUrl);
  url.searchParams.set(`method`, method);
  url.searchParams.set(`format`, `json`);
  url.searchParams.set(`api_key`, apiKey);
  url.searchParams.set(`token`, authToken);
  url.searchParams.set(`api_sig`, signature);
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
