import SparkMD5 from "spark-md5";

/**
 * Create an API signature for Last.fm API authentication.
 * Sorts parameters alphabetically, concatenates with shared secret, and creates MD5 hash.
 * @param params - Object containing API parameters as key-value pairs
 * @param sharedSecret - Your Last.fm shared secret
 * @returns MD5 hash signature for API authentication
 * @internal This is an internal utility function used by API methods for authentication
 */
export function createSignature(params: Record<string, string>, sharedSecret: string): string {
  const sortedParams = Object.keys(params)
    .sort()
    .reduce((acc, key) => acc + key + params[key], '');
  const stringToSign = sortedParams + sharedSecret;
  return SparkMD5.hash(stringToSign);
}
