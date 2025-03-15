import { DeleteImageHandlerProps } from "../types";

async function deleteImageHandler({
  accountId,
  apiKey,
  filePath,
}: DeleteImageHandlerProps) {
  const baseUrl = "https://api.bytescale.com";
  const path = `/v2/accounts/${accountId}/files`;
  const entries = (obj: { filePath: string }) =>
    Object.entries(obj).filter(([, val]) => (val ?? null) !== null);
  const query = entries({ filePath } ?? {})
    .flatMap(([k, v]) => (Array.isArray(v) ? v.map((v2) => [k, v2]) : [[k, v]]))
    .map((kv) => kv.join("="))
    .join("&");
  console.log(query);

  const response = await fetch(
    `${baseUrl}${path}${query.length > 0 ? "?" : ""}${query}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    },
  );

  if (Math.floor(response.status / 100) !== 2) {
    const result = await response.json();
    throw new Error(`Bytescale API Error: ${JSON.stringify(result)}`);
  }
}

export default deleteImageHandler;
