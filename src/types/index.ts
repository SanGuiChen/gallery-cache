export interface ImageInfo {
  id: string;
  filename: string;
  original_name: string;
  width: number;
  height: number;
  size: number;
  created_at: number;
  imported_at: number;
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
