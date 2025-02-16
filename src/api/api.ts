let LAST_FM_API: LastFmApi | undefined;

/**
 * Initialize the last fm integration with your API key and shared secret.
 */
export function initializeLastFmApi(apiKey: string, sharedSecret: string) {
  if (isApiInitialized(LAST_FM_API)) {
    throw new Error('Last FM API is already initialized');
  }
  LAST_FM_API = new LastFmApi(apiKey, sharedSecret);
}


function isApiInitialized(api: LastFmApi | undefined): api is LastFmApi {
  return api !== undefined
}

export function getApi() {
  if (!isApiInitialized(LAST_FM_API)) {
    throw new Error('You need to initialize the API.');
  }
  return LAST_FM_API;
}

class LastFmApi {
  private static readonly DEFAULT_BASE_URL = 'https://ws.audioscrobbler.com/2.0';
  private readonly _apiKey: string;
  private readonly _sharedSecret: string;
  private readonly _baseUrl: string;

  constructor(apiKey: string, sharedSecret: string, baseUrl?: string) {
    this._apiKey = apiKey;
    this._sharedSecret = sharedSecret;
    this._baseUrl = baseUrl !== undefined ? baseUrl : LastFmApi.DEFAULT_BASE_URL
  }

  get apiKey(): string { return this._apiKey; }
  get sharedSecret(): string { return this._sharedSecret; }
  get baseUrl(): string { return this._baseUrl; }
}




