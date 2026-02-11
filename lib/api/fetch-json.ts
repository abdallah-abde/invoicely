export async function fetchJson(
  input: RequestInfo,
  init?: RequestInit,
): Promise<any> {
  const res = await fetch(input, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });

  const json = await res.json();

  if (!res.ok) {
    throw json;
  }

  return json;
}
