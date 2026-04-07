export const UNTAGGED_TAG_ID = '__untagged__';

export interface ImageInfo {
  id: string;
  filename: string;
  originalName: string;
  width: number;
  height: number;
  size: number;
  createdAt: number;
  importedAt: number;
  source: 'paste' | 'cdn' | 'file';
}

export interface Tag {
  id: string;
  name: string;
  parentId: string | null;
  order: number;
  createdAt: number;
}

export interface ImageTagRelation {
  imageId: string;
  tagId: string;
}

export interface AppConfig {
  version: number;
  dataPath: string;
  theme: string;
  lastOpenedAt: number;
}

export interface TagsData {
  tags: Tag[];
}

export interface ImageTagsData {
  relations: ImageTagRelation[];
}

export interface ImagesData {
  images: ImageInfo[];
}
