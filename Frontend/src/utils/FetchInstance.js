export default class FetchInstance {
  #base;
  constructor(base = "http://www.example.com") {
    this.#base = base;
  }

  async fetch({ method = "HEAD", path = "", query = {}, options = {} }) {
    const { token = "" } =
      JSON.parse(window?.localStorage?.getItem?.("auth") ?? "null") ?? {};
    const search = new URLSearchParams(query).toString();
    const res = await fetch(`${this.#base}${path}?${search}`, {
      ...options,
      headers: { ...(options.headers ?? {}), authorization: `Bearer ${token}` },
      method: method.toUpperCase(),
    });
    const { message, error, data } = await res.json();
    const { ok, status, headers } = res;
    return {
      ok,
      status,
      headers: Object.fromEntries(headers.entries()),
      body: { message, error, data },
    };
  }
}
