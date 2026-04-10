export interface FigmaNode {
  id: string;
  name: string;
  type: string;
  characters?: string;
  componentName?: string;
  children?: FigmaNode[];
  absoluteBoundingBox?: { x: number; y: number; width: number; height: number };
}

export interface FigmaDesignData {
  fileKey: string;
  fileName: string;
  nodeId?: string;
  nodes: FigmaNode[];
  textContent: string[];
  componentNames: string[];
  hierarchy: string;
}
