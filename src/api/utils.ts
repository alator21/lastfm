import SparkMD5 from "spark-md5";

export function createSignature(params: Record<string, string>, sharedSecret: string): string {
  const sortedParams = Object.keys(params)
    .sort()
    .reduce((acc, key) => acc + key + params[key], '');
  const stringToSign = sortedParams + sharedSecret;
  return SparkMD5.hash(stringToSign);
}
