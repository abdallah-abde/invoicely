const cache = new Map<string, { data: any; expires: number }>();

export async function cached<T>(
  key: string,
  ttl: number,
  fn: () => Promise<T>
): Promise<T> {
  const hit = cache.get(key);
  if (hit && hit.expires > Date.now()) return hit.data;

  const data = await fn();
  cache.set(key, { data, expires: Date.now() + ttl });
  return data;
}
