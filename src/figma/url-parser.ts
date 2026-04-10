export interface FigmaUrlParts {
  fileKey: string;
  nodeId?: string;
}

/**
 * Parse a Figma URL into fileKey and optional nodeId.
 *
 * Supported formats:
 *   figma.com/design/:fileKey/:fileName?node-id=:nodeId
 *   figma.com/design/:fileKey/branch/:branchKey/:fileName
 *   figma.com/file/:fileKey/...
 *   figma.com/make/:fileKey/:fileName
 *   figma.com/board/:fileKey/:fileName (FigJam)
 */
export function parseFigmaUrl(url: string): FigmaUrlParts {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error(`Invalid Figma URL: ${url}`);
  }

  if (!parsed.hostname.endsWith("figma.com")) {
    throw new Error(`Not a Figma URL: ${url}`);
  }

  const segments = parsed.pathname.split("/").filter(Boolean);

  // figma.com/design/:fileKey/branch/:branchKey/:fileName
  // figma.com/design/:fileKey/:fileName
  // figma.com/file/:fileKey/:fileName
  if (segments.length < 2 || !["design", "file", "make", "board"].includes(segments[0])) {
    throw new Error(`Unsupported Figma URL format: ${url}`);
  }

  let fileKey = segments[1];

  // Branch URLs: use branchKey instead of fileKey
  if (segments[2] === "branch" && segments[3]) {
    fileKey = segments[3];
  }

  // Extract node-id from query params (convert - to : for API format)
  const nodeIdParam = parsed.searchParams.get("node-id");
  const nodeId = nodeIdParam ? nodeIdParam.replace(/-/g, ":") : undefined;

  return { fileKey, nodeId };
}
