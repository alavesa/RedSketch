import type { FigmaNode, FigmaDesignData } from "../types/index.js";
import { log } from "../utils/logger.js";

const FIGMA_API = "https://api.figma.com/v1";

// Node types that carry security-relevant information
const RELEVANT_TYPES = new Set([
  "FRAME",
  "GROUP",
  "COMPONENT",
  "COMPONENT_SET",
  "INSTANCE",
  "TEXT",
  "SECTION",
]);

const MAX_HIERARCHY_CHARS = 50_000;

interface FigmaApiNode {
  id: string;
  name: string;
  type: string;
  characters?: string;
  children?: FigmaApiNode[];
  absoluteBoundingBox?: { x: number; y: number; width: number; height: number };
  componentId?: string;
}

interface FigmaFileResponse {
  name: string;
  document: FigmaApiNode;
  components: Record<string, { name: string; description: string }>;
}

interface FigmaNodesResponse {
  name: string;
  nodes: Record<string, { document: FigmaApiNode; components: Record<string, { name: string; description: string }> }>;
}

export class FigmaReader {
  constructor(private token: string) {}

  async read(fileKey: string, nodeId?: string): Promise<FigmaDesignData> {
    let rootNode: FigmaApiNode;
    let fileName: string;
    let components: Record<string, { name: string; description: string }> = {};

    if (nodeId) {
      // Fetch specific node(s)
      const url = `${FIGMA_API}/files/${fileKey}/nodes?ids=${encodeURIComponent(nodeId)}`;
      const data = await this.fetch<FigmaNodesResponse>(url);
      fileName = data.name;

      const nodeData = data.nodes[nodeId];
      if (!nodeData) {
        throw new Error(`Node ${nodeId} not found in file ${fileKey}`);
      }
      rootNode = nodeData.document;
      components = nodeData.components ?? {};
    } else {
      // Fetch entire file (depth-limited to avoid huge payloads)
      const url = `${FIGMA_API}/files/${fileKey}?depth=4`;
      const data = await this.fetch<FigmaFileResponse>(url);
      fileName = data.name;
      rootNode = data.document;
      components = data.components ?? {};
    }

    const nodes: FigmaNode[] = [];
    const textContent: string[] = [];
    const componentNames: string[] = [];

    this.flattenNode(rootNode, nodes, textContent, componentNames, components);

    const hierarchy = this.buildHierarchy(rootNode, 0);

    log.verbose(`Parsed ${nodes.length} nodes, ${textContent.length} text elements, ${componentNames.length} components`);

    return {
      fileKey,
      fileName,
      nodeId,
      nodes,
      textContent,
      componentNames: [...new Set(componentNames)],
      hierarchy: hierarchy.slice(0, MAX_HIERARCHY_CHARS),
    };
  }

  private flattenNode(
    node: FigmaApiNode,
    nodes: FigmaNode[],
    textContent: string[],
    componentNames: string[],
    components: Record<string, { name: string; description: string }>,
  ): void {
    if (RELEVANT_TYPES.has(node.type)) {
      const figmaNode: FigmaNode = {
        id: node.id,
        name: node.name,
        type: node.type,
      };

      if (node.characters) {
        figmaNode.characters = node.characters;
        textContent.push(node.characters);
      }

      if (node.type === "INSTANCE" && node.componentId && components[node.componentId]) {
        figmaNode.componentName = components[node.componentId].name;
        componentNames.push(figmaNode.componentName);
      }

      if (node.type === "COMPONENT") {
        componentNames.push(node.name);
      }

      if (node.absoluteBoundingBox) {
        figmaNode.absoluteBoundingBox = node.absoluteBoundingBox;
      }

      nodes.push(figmaNode);
    }

    if (node.children) {
      for (const child of node.children) {
        this.flattenNode(child, nodes, textContent, componentNames, components);
      }
    }
  }

  private buildHierarchy(node: FigmaApiNode, depth: number): string {
    if (!RELEVANT_TYPES.has(node.type) && node.type !== "DOCUMENT" && node.type !== "CANVAS") {
      return "";
    }

    const indent = "  ".repeat(depth);
    const textSuffix = node.characters ? ` "${node.characters.slice(0, 80)}"` : "";
    let line = `${indent}[${node.type}] ${node.name}${textSuffix}\n`;

    if (node.children) {
      for (const child of node.children) {
        line += this.buildHierarchy(child, depth + 1);
      }
    }

    return line;
  }

  private async fetch<T>(url: string): Promise<T> {
    const response = await fetch(url, {
      headers: {
        "X-Figma-Token": this.token,
      },
    });

    if (!response.ok) {
      if (response.status === 400) {
        const body = await response.json().catch(() => ({})) as Record<string, unknown>;
        if (typeof body.err === "string" && body.err.includes("File type not supported")) {
          throw new Error("This file type is not supported by the Figma REST API. Make files (figma.com/make/) cannot be read via the API yet. Try using a standard design file (figma.com/design/) instead.");
        }
        throw new Error(`Figma API error (400): ${typeof body.err === "string" ? body.err : "Bad Request"}`);
      }
      if (response.status === 403) {
        throw new Error("Figma API access denied. Check your FIGMA_ACCESS_TOKEN has read access to this file.");
      }
      if (response.status === 404) {
        throw new Error("Figma file not found. Check the URL and your token's access permissions.");
      }
      throw new Error(`Figma API error (${response.status}): ${response.statusText}`);
    }

    return response.json() as Promise<T>;
  }
}

export function figmaDataToFileContent(data: FigmaDesignData): { path: string; content: string; language: string } {
  const parts: string[] = [];

  parts.push(`# Figma Design: ${data.fileName}`);
  if (data.nodeId) parts.push(`# Node: ${data.nodeId}`);
  parts.push("");

  parts.push("## Component Names");
  if (data.componentNames.length > 0) {
    for (const name of data.componentNames) {
      parts.push(`- ${name}`);
    }
  } else {
    parts.push("(no named components found)");
  }
  parts.push("");

  parts.push("## Text Content Found");
  if (data.textContent.length > 0) {
    for (const text of data.textContent) {
      parts.push(`- "${text.slice(0, 200)}"`);
    }
  } else {
    parts.push("(no text content found)");
  }
  parts.push("");

  parts.push("## Design Hierarchy");
  parts.push(data.hierarchy);

  return {
    path: `figma://${data.fileKey}/${data.nodeId ?? "root"}`,
    content: parts.join("\n"),
    language: "figma-design",
  };
}
