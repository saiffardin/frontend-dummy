/**
 * Each node has a name and an optional list of children.
 */
export interface FsNode {
  id?: number;
  name: string;
  path?: string;
  children?: FsNode[];
  isFolder?: boolean;
  extension?: string;
}
