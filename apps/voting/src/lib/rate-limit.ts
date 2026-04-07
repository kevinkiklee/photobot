const stores = new Map<string, Map<string, { count: number; resetAt: number }>>();

export function checkRateLimit(
  namespace: string,
  userId: string,
  limit: number = 20,
  windowMs: number = 60_000,
): boolean {
  let store = stores.get(namespace);
  if (!store) {
    store = new Map();
    stores.set(namespace, store);
  }

  const now = Date.now();
  const entry = store.get(userId);

  if (!entry || now > entry.resetAt) {
    store.set(userId, { count: 1, resetAt: now + windowMs });
    return true;
  }

  entry.count++;
  return entry.count <= limit;
}
