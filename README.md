# Last.fm API Wrapper

A TypeScript wrapper for the Last.fm API, published as `@alator21/lastfm` on JSR.

## Installation

```bash
# Using Bun
bun add @alator21/lastfm

# Using npm
npm install @alator21/lastfm

# Using Deno
deno add @alator21/lastfm
```

## Quick Start

```typescript
import { 
  initializeLastFmApi, 
  getSession, 
  scrobble, 
  updateNowPlaying,
  getTopTracks,
  getTopArtists
} from '@alator21/lastfm';

// Initialize the API with your credentials
initializeLastFmApi('YOUR_API_KEY', 'YOUR_SHARED_SECRET');
```

## Authentication

First, get a session key for the user:

```typescript
// After user authorizes your app and you get the auth token
const sessionResponse = await getSession({ 
  authToken: 'AUTH_TOKEN_FROM_USER' 
});
const sessionKey = sessionResponse.session.key;
```

## Usage Examples

### Scrobbling a Track

```typescript
import { scrobble } from '@alator21/lastfm';

const response = await scrobble({
  artist: 'Radiohead',
  track: 'Creep',
  album: 'Pablo Honey', // optional
  timestamp: new Date(),
  sessionKey: 'USER_SESSION_KEY'
});

console.log(`Scrobbled! Accepted: ${response.scrobbles['@attr'].accepted}`);
```

### Update Now Playing

```typescript
import { updateNowPlaying } from '@alator21/lastfm';

const response = await updateNowPlaying({
  artist: 'The Beatles',
  track: 'Hey Jude',
  album: 'Hey Jude', // optional
  sessionKey: 'USER_SESSION_KEY'
});

console.log(`Now playing: ${response.nowplaying.track['#text']}`);
```

### Get User's Top Tracks

```typescript
import { getTopTracks } from '@alator21/lastfm';

const response = await getTopTracks({
  user: 'username',
  period: '1month', // 'overall' | '7day' | '1month' | '3month' | '6month' | '12month'
  limit: 10, // optional
  page: 1 // optional
});

response.toptracks.track.forEach((track, index) => {
  console.log(`${index + 1}. ${track.name} by ${track.artist.name} (${track.playcount} plays)`);
});
```

### Get User's Top Artists

```typescript
import { getTopArtists } from '@alator21/lastfm';

const response = await getTopArtists({
  user: 'username',
  period: '6month',
  limit: 5
});

response.topartists.artist.forEach((artist, index) => {
  console.log(`${index + 1}. ${artist.name}`);
});
```

## API Reference

### Functions

#### `initializeLastFmApi(apiKey: string, sharedSecret: string): void`

Initializes the Last.fm API with your credentials. Must be called before using any other methods.

**Parameters:**
- `apiKey` - Your Last.fm API key
- `sharedSecret` - Your Last.fm shared secret

**Throws:**
- `Error` if API is already initialized

---

#### `getSession(request: GetSessionRequest): Promise<GetSessionResponse>`

Fetches a session key for a user after they've authorized your application.

**Parameters:**
- `request.authToken` - Auth token obtained from Last.fm authorization flow

**Returns:** Promise resolving to session information

**Last.fm API:** [`auth.getSession`](https://www.last.fm/api/show/auth.getSession)

---

#### `scrobble(request: ScrobbleRequest): Promise<ScrobbleResponse>`

Adds a track play to a user's profile (scrobbles the track).

**Parameters:**
- `request.artist` - The artist name
- `request.track` - The track name  
- `request.timestamp` - When the track was played (Date object)
- `request.sessionKey` - User's session key
- `request.album?` - Album name (optional)

**Returns:** Promise resolving to scrobble result with acceptance status

**Last.fm API:** [`track.scrobble`](https://www.last.fm/api/show/track.scrobble)

---

#### `updateNowPlaying(request: UpdateNowPlayingRequest): Promise<UpdateNowPlayingResponse>`

Notifies Last.fm that a user has started listening to a track.

**Parameters:**
- `request.artist` - The artist name
- `request.track` - The track name
- `request.sessionKey` - User's session key  
- `request.album?` - Album name (optional)

**Returns:** Promise resolving to now playing status

**Last.fm API:** [`track.updateNowPlaying`](https://www.last.fm/api/show/track.updateNowPlaying)

---

#### `getTopTracks(request: GetTopTracksRequest): Promise<GetTopTracksResponse>`

Gets the top tracks for a user over a specified time period.

**Parameters:**
- `request.user` - Last.fm username
- `request.period?` - Time period: `'overall'` | `'7day'` | `'1month'` | `'3month'` | `'6month'` | `'12month'` (default: `'overall'`)
- `request.limit?` - Number of results per page (default: 50, max: 1000)
- `request.page?` - Page number for pagination (default: 1)

**Returns:** Promise resolving to top tracks with metadata

**Last.fm API:** [`user.getTopTracks`](https://www.last.fm/api/show/user.getTopTracks)

---

#### `getTopArtists(request: GetTopArtistsRequest): Promise<GetTopArtistsResponse>`

Gets the top artists for a user over a specified time period.

**Parameters:**
- `request.user` - Last.fm username
- `request.period?` - Time period: `'overall'` | `'7day'` | `'1month'` | `'3month'` | `'6month'` | `'12month'` (default: `'overall'`)
- `request.limit?` - Number of results per page (default: 50, max: 1000)  
- `request.page?` - Page number for pagination (default: 1)

**Returns:** Promise resolving to top artists with metadata

**Last.fm API:** [`user.getTopArtists`](https://www.last.fm/api/show/user.getTopArtists)

### Type Definitions

#### Request Types

```typescript
interface GetSessionRequest {
  authToken: string;
}

interface ScrobbleRequest {
  artist: string;
  track: string;
  timestamp: Date;
  sessionKey: string;
  album?: string;
}

interface UpdateNowPlayingRequest {
  artist: string;
  track: string;
  sessionKey: string;
  album?: string;
}

interface GetTopTracksRequest {
  user: string;
  period?: 'overall' | '7day' | '1month' | '3month' | '6month' | '12month';
  limit?: number;
  page?: number;
}

interface GetTopArtistsRequest {
  user: string;
  period?: 'overall' | '7day' | '1month' | '3month' | '6month' | '12month';
  limit?: number;
  page?: number;
}
```

#### Response Types

All response types are exported and can be imported:

```typescript
import { 
  type GetSessionResponse,
  type ScrobbleResponse,
  type UpdateNowPlayingResponse,
  type GetTopTracksResponse,
  type GetTopArtistsResponse 
} from '@alator21/lastfm';
```

**GetSessionResponse:**
```typescript
{
  session: {
    name: string;      // Username
    key: string;       // Session key for authenticated requests
    subscriber: number; // 0 = free user, 1 = subscriber
  }
}
```

**ScrobbleResponse:**
```typescript
{
  scrobbles: {
    '@attr': {
      accepted: number;  // Number of scrobbles accepted
      ignored: number;   // Number of scrobbles ignored
    };
    scrobble: {
      artist: { '#text': string; corrected: string };
      albumArtist: { '#text': string; corrected: string };
      track: { '#text': string; corrected: string };
      album: { '#text': string; corrected: string };
      ignoredMessage: { '#text': string; code: string };
      timestamp: string;
    }
  }
}
```

**UpdateNowPlayingResponse:**
```typescript
{
  nowplaying: {
    artist: { '#text': string; corrected: string };
    albumArtist: { '#text': string; corrected: string };
    track: { '#text': string; corrected: string };
    album: { '#text': string; corrected: string };
    ignoredMessage: { '#text': string; code: string };
  }
}
```

**GetTopTracksResponse:**
```typescript
{
  toptracks: {
    track: Array<{
      name: string;
      playcount: number;
      mbid?: string;
      url: string;
      duration: number;
      artist: {
        name: string;
        url: string;
        mbid: string;
      };
      image: Array<{
        '#text': string;  // URL
        size: 'small' | 'medium' | 'large' | 'extralarge';
      }>;
      '@attr': {
        rank: number;
      };
      streamable: {
        '#text': string;
        fulltrack: string;
      };
    }>;
    '@attr': {
      user: string;
      totalPages: number;
      page: number;
      perPage: number;
      total: number;
    };
  }
}
```

**GetTopArtistsResponse:**
```typescript
{
  topartists: {
    artist: Array<{
      name: string;
      url: string;
      mbid: string;
    }>;
    '@attr': {
      user: string;
      totalPages: number;
      page: number;
      perPage: number;
      total: number;
    };
  }
}
```

## Development Status

This library is a work in progress. Currently implemented:
- ✅ Authentication (`auth.getSession`)
- ✅ Track scrobbling (`track.scrobble`) 
- ✅ Now playing updates (`track.updateNowPlaying`)
- ✅ User top tracks (`user.getTopTracks`)
- ✅ User top artists (`user.getTopArtists`)

More endpoints will be added in future releases.
