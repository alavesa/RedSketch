import { describe, it, expect } from "vitest";
import { parseFigmaUrl } from "../src/figma/url-parser.js";

describe("parseFigmaUrl", () => {
  it("parses a standard design URL with node-id", () => {
    const result = parseFigmaUrl(
      "https://www.figma.com/design/abc123/MyApp?node-id=1-234"
    );
    expect(result.fileKey).toBe("abc123");
    expect(result.nodeId).toBe("1:234");
  });

  it("parses a design URL without node-id", () => {
    const result = parseFigmaUrl(
      "https://www.figma.com/design/abc123/MyApp"
    );
    expect(result.fileKey).toBe("abc123");
    expect(result.nodeId).toBeUndefined();
  });

  it("parses a branch URL and uses branchKey", () => {
    const result = parseFigmaUrl(
      "https://www.figma.com/design/abc123/branch/branch456/MyApp"
    );
    expect(result.fileKey).toBe("branch456");
  });

  it("parses a legacy /file/ URL", () => {
    const result = parseFigmaUrl(
      "https://www.figma.com/file/xyz789/OldFile?node-id=5-10"
    );
    expect(result.fileKey).toBe("xyz789");
    expect(result.nodeId).toBe("5:10");
  });

  it("parses a Make URL", () => {
    const result = parseFigmaUrl(
      "https://www.figma.com/make/make123/GeneratedApp"
    );
    expect(result.fileKey).toBe("make123");
    expect(result.nodeId).toBeUndefined();
  });

  it("parses a FigJam board URL", () => {
    const result = parseFigmaUrl(
      "https://www.figma.com/board/board456/MyBoard?node-id=0-1"
    );
    expect(result.fileKey).toBe("board456");
    expect(result.nodeId).toBe("0:1");
  });

  it("converts multiple dashes in node-id to colons", () => {
    const result = parseFigmaUrl(
      "https://www.figma.com/design/abc/App?node-id=100-200-300"
    );
    expect(result.nodeId).toBe("100:200:300");
  });

  it("ignores extra query params", () => {
    const result = parseFigmaUrl(
      "https://www.figma.com/design/abc/App?node-id=1-2&t=xyz&p=f"
    );
    expect(result.fileKey).toBe("abc");
    expect(result.nodeId).toBe("1:2");
  });

  it("throws on invalid URL", () => {
    expect(() => parseFigmaUrl("not-a-url")).toThrow("Invalid Figma URL");
  });

  it("throws on non-Figma URL", () => {
    expect(() => parseFigmaUrl("https://google.com/design/abc/App")).toThrow(
      "Not a Figma URL"
    );
  });

  it("throws on unsupported path format", () => {
    expect(() =>
      parseFigmaUrl("https://www.figma.com/community/file/abc123")
    ).toThrow("Unsupported Figma URL format");
  });

  it("throws on URL with no file key", () => {
    expect(() => parseFigmaUrl("https://www.figma.com/design")).toThrow(
      "Unsupported Figma URL format"
    );
  });
});
