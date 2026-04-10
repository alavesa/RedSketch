import { describe, it, expect, vi, beforeEach } from "vitest";
import { FigmaReader, figmaDataToFileContent } from "../src/figma/reader.js";

// Mock the global fetch
const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

function makeFigmaResponse(document: Record<string, unknown>, components = {}) {
  return {
    ok: true,
    status: 200,
    json: () =>
      Promise.resolve({
        name: "Test File",
        document,
        components,
      }),
  };
}

function makeFigmaNodesResponse(
  nodeId: string,
  document: Record<string, unknown>,
  components = {}
) {
  return {
    ok: true,
    status: 200,
    json: () =>
      Promise.resolve({
        name: "Test File",
        nodes: {
          [nodeId]: { document, components },
        },
      }),
  };
}

beforeEach(() => {
  mockFetch.mockReset();
});

describe("FigmaReader", () => {
  const reader = new FigmaReader("fake-token");

  it("reads a file and extracts nodes, text, and components", async () => {
    mockFetch.mockResolvedValueOnce(
      makeFigmaResponse({
        id: "0:0",
        name: "Document",
        type: "DOCUMENT",
        children: [
          {
            id: "1:0",
            name: "Page 1",
            type: "CANVAS",
            children: [
              {
                id: "1:1",
                name: "Login Frame",
                type: "FRAME",
                children: [
                  {
                    id: "1:2",
                    name: "Email Label",
                    type: "TEXT",
                    characters: "Enter your email",
                  },
                  {
                    id: "1:3",
                    name: "Password Label",
                    type: "TEXT",
                    characters: "Password",
                  },
                ],
              },
              {
                id: "1:4",
                name: "SignupButton",
                type: "COMPONENT",
              },
            ],
          },
        ],
      })
    );

    const data = await reader.read("test-file-key");

    expect(data.fileKey).toBe("test-file-key");
    expect(data.fileName).toBe("Test File");
    expect(data.nodeId).toBeUndefined();
    expect(data.nodes.length).toBe(4); // FRAME + 2 TEXT + COMPONENT
    expect(data.textContent).toEqual(["Enter your email", "Password"]);
    expect(data.componentNames).toContain("SignupButton");
    expect(data.hierarchy).toContain("Login Frame");
    expect(data.hierarchy).toContain("Enter your email");
  });

  it("reads a specific node by ID", async () => {
    mockFetch.mockResolvedValueOnce(
      makeFigmaNodesResponse("1:1", {
        id: "1:1",
        name: "Login Frame",
        type: "FRAME",
        children: [
          {
            id: "1:2",
            name: "Title",
            type: "TEXT",
            characters: "Sign In",
          },
        ],
      })
    );

    const data = await reader.read("test-file-key", "1:1");

    expect(data.nodeId).toBe("1:1");
    expect(data.nodes.length).toBe(2); // FRAME + TEXT
    expect(data.textContent).toEqual(["Sign In"]);
  });

  it("skips decorative node types", async () => {
    mockFetch.mockResolvedValueOnce(
      makeFigmaResponse({
        id: "0:0",
        name: "Document",
        type: "DOCUMENT",
        children: [
          {
            id: "1:0",
            name: "Page",
            type: "CANVAS",
            children: [
              { id: "1:1", name: "Background", type: "RECTANGLE" },
              { id: "1:2", name: "Divider", type: "LINE" },
              { id: "1:3", name: "Icon", type: "VECTOR" },
              { id: "1:4", name: "Circle", type: "ELLIPSE" },
              {
                id: "1:5",
                name: "Actual Content",
                type: "FRAME",
                children: [],
              },
            ],
          },
        ],
      })
    );

    const data = await reader.read("test-file-key");

    expect(data.nodes.length).toBe(1); // Only the FRAME
    expect(data.nodes[0].name).toBe("Actual Content");
  });

  it("resolves component names from instances", async () => {
    mockFetch.mockResolvedValueOnce(
      makeFigmaResponse(
        {
          id: "0:0",
          name: "Document",
          type: "DOCUMENT",
          children: [
            {
              id: "1:0",
              name: "Page",
              type: "CANVAS",
              children: [
                {
                  id: "1:1",
                  name: "Button Instance",
                  type: "INSTANCE",
                  componentId: "comp-1",
                },
              ],
            },
          ],
        },
        { "comp-1": { name: "PrimaryButton", description: "Main CTA" } }
      )
    );

    const data = await reader.read("test-file-key");

    expect(data.componentNames).toContain("PrimaryButton");
    expect(data.nodes[0].componentName).toBe("PrimaryButton");
  });

  it("throws on empty design with no usable nodes", async () => {
    mockFetch.mockResolvedValueOnce(
      makeFigmaResponse({
        id: "0:0",
        name: "Document",
        type: "DOCUMENT",
        children: [
          {
            id: "1:0",
            name: "Page",
            type: "CANVAS",
            children: [
              { id: "1:1", name: "Decoration", type: "VECTOR" },
            ],
          },
        ],
      })
    );

    await expect(reader.read("test-file-key")).rejects.toThrow(
      "No usable design elements found"
    );
  });

  it("throws on 404", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: "Not Found",
    });

    await expect(reader.read("bad-key")).rejects.toThrow("Figma file not found");
  });

  it("throws on 403", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 403,
      statusText: "Forbidden",
    });

    await expect(reader.read("private-key")).rejects.toThrow("access denied");
  });

  it("throws helpful message for unsupported file types", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: () => Promise.resolve({ err: "File type not supported by this endpoint" }),
    });

    await expect(reader.read("make-key")).rejects.toThrow(
      "not supported by the Figma REST API"
    );
  });

  it("deduplicates component names", async () => {
    mockFetch.mockResolvedValueOnce(
      makeFigmaResponse(
        {
          id: "0:0",
          name: "Document",
          type: "DOCUMENT",
          children: [
            {
              id: "1:0",
              name: "Page",
              type: "CANVAS",
              children: [
                { id: "1:1", name: "Btn1", type: "INSTANCE", componentId: "c1" },
                { id: "1:2", name: "Btn2", type: "INSTANCE", componentId: "c1" },
                { id: "1:3", name: "Btn3", type: "INSTANCE", componentId: "c1" },
              ],
            },
          ],
        },
        { c1: { name: "Button", description: "" } }
      )
    );

    const data = await reader.read("test-file-key");

    expect(data.componentNames).toEqual(["Button"]); // Deduplicated
  });
});

describe("figmaDataToFileContent", () => {
  it("produces structured content from design data", () => {
    const result = figmaDataToFileContent({
      fileKey: "abc",
      fileName: "My Design",
      nodeId: "1:2",
      nodes: [],
      textContent: ["Hello", "World"],
      componentNames: ["Button", "Input"],
      hierarchy: "[FRAME] Main\n  [TEXT] Hello",
    });

    expect(result.path).toBe("figma://abc/1:2");
    expect(result.language).toBe("figma-design");
    expect(result.content).toContain("# Figma Design: My Design");
    expect(result.content).toContain("- Button");
    expect(result.content).toContain("- Input");
    expect(result.content).toContain('"Hello"');
    expect(result.content).toContain('"World"');
    expect(result.content).toContain("[FRAME] Main");
  });

  it("handles empty design data", () => {
    const result = figmaDataToFileContent({
      fileKey: "abc",
      fileName: "Empty",
      nodes: [],
      textContent: [],
      componentNames: [],
      hierarchy: "",
    });

    expect(result.content).toContain("(no named components found)");
    expect(result.content).toContain("(no text content found)");
  });
});
