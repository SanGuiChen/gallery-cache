import { create } from 'zustand';
import { invoke } from '@tauri-apps/api/core';
import { open } from '@tauri-apps/plugin-dialog';
import type { AppConfig, Tag, ImageInfo, ImageTagRelation } from '../types';

type ViewMode = 'masonry' | 'grid';
type SortBy = 'date' | 'name' | 'size';

interface AppState {
  config: AppConfig | null;
  isInitialized: boolean;
  tags: Tag[];
  images: ImageInfo[];
  relations: ImageTagRelation[];
  selectedTagId: string | null;
  searchQuery: string;
  viewMode: ViewMode;
  sortBy: SortBy;
  draggingImageId: string | null;

  initialize: () => Promise<void>;
  selectDataPath: () => Promise<void>;
  setSelectedTagId: (tagId: string | null) => void;
  setSearchQuery: (query: string) => void;
  setViewMode: (mode: ViewMode) => void;
  setSortBy: (sort: SortBy) => void;
  setDraggingImageId: (id: string | null) => void;

  addTag: (name: string, parentId: string | null) => Promise<void>;
  updateTag: (id: string, name: string) => Promise<void>;
  deleteTag: (id: string) => Promise<void>;

  addImage: (image: ImageInfo) => Promise<void>;
  deleteImage: (id: string) => Promise<void>;
  addImageTagRelation: (imageId: string, tagId: string) => Promise<void>;
  removeImageTagRelation: (imageId: string, tagId: string) => Promise<void>;

  saveImageFromBase64: (base64Data: string, source: string) => Promise<ImageInfo>;
  downloadImage: (url: string) => Promise<ImageInfo>;
  getImagePath: (filename: string) => Promise<string>;

  getFilteredImages: () => ImageInfo[];
}

export const useAppStore = create<AppState>((set, get) => ({
  config: null,
  isInitialized: false,
  tags: [],
  images: [],
  relations: [],
  selectedTagId: null,
  searchQuery: '',
  viewMode: 'masonry',
  sortBy: 'date',
  draggingImageId: null,

  initialize: async () => {
    try {
      const config = await invoke<AppConfig>('get_config');
      if (config && config.dataPath) {
        const tagsData = await invoke<{ tags: Tag[] }>('load_tags', { dataPath: config.dataPath });
        const imagesData = await invoke<{ images: ImageInfo[] }>('load_images', { dataPath: config.dataPath });
        const imageTagsData = await invoke<{ relations: ImageTagRelation[] }>('load_image_tags', { dataPath: config.dataPath });

        set({
          config,
          tags: tagsData.tags || [],
          images: imagesData.images || [],
          relations: imageTagsData.relations || [],
          isInitialized: true,
        });
      }
    } catch {
      set({ isInitialized: false, config: null });
    }
  },

  selectDataPath: async () => {
    const selected = await open({
      directory: true,
      multiple: false,
      title: '选择图片存储目录',
    });

    if (selected && typeof selected === 'string') {
      await invoke('init_data_dir', { dataPath: selected });

      const now = Date.now();
      const config: AppConfig = {
        version: 1,
        dataPath: selected,
        theme: 'dark',
        lastOpenedAt: now,
      };

      await invoke('save_config', { config });
      await invoke('init_data_dir', { dataPath: selected });

      set({
        config,
        tags: [],
        images: [],
        relations: [],
        isInitialized: true,
      });
    }
  },

  setSelectedTagId: (tagId) => set({ selectedTagId: tagId }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setSortBy: (sort) => set({ sortBy: sort }),
  setDraggingImageId: (id) => set({ draggingImageId: id }),

  addTag: async (name, parentId) => {
    const { config, tags } = get();
    if (!config) return;

    const newTag: Tag = {
      id: crypto.randomUUID(),
      name,
      parentId,
      order: tags.filter(t => t.parentId === parentId).length,
      createdAt: Date.now(),
    };

    const newTags = [...tags, newTag];
    await invoke('save_tags', { dataPath: config.dataPath, tagsData: { tags: newTags } });
    set({ tags: newTags });
  },

  updateTag: async (id, name) => {
    const { config, tags } = get();
    if (!config) return;

    const newTags = tags.map(t => t.id === id ? { ...t, name } : t);
    await invoke('save_tags', { dataPath: config.dataPath, tagsData: { tags: newTags } });
    set({ tags: newTags });
  },

  deleteTag: async (id) => {
    const { config, tags, relations } = get();
    if (!config) return;

    const newTags = tags.filter(t => t.id !== id && t.parentId !== id);
    const newRelations = relations.filter(r => r.tagId !== id);
    await invoke('save_tags', { dataPath: config.dataPath, tagsData: { tags: newTags } });
    await invoke('save_image_tags', { dataPath: config.dataPath, imageTagsData: { relations: newRelations } });
    set({ tags: newTags, relations: newRelations });
  },

  addImage: async (image) => {
    const { config, images } = get();
    if (!config) return;

    const newImages = [...images, image];
    await invoke('save_images', { dataPath: config.dataPath, imagesData: { images: newImages } });
    set({ images: newImages });
  },

  deleteImage: async (id) => {
    const { config, images, relations } = get();
    if (!config) return;

    const image = images.find(i => i.id === id);
    if (image) {
      await invoke('delete_image', { dataPath: config.dataPath, imageId: id, filename: image.filename });
    }

    const newImages = images.filter(i => i.id !== id);
    const newRelations = relations.filter(r => r.imageId !== id);
    await invoke('save_images', { dataPath: config.dataPath, imagesData: { images: newImages } });
    await invoke('save_image_tags', { dataPath: config.dataPath, imageTagsData: { relations: newRelations } });
    set({ images: newImages, relations: newRelations });
  },

  addImageTagRelation: async (imageId, tagId) => {
    const { config, relations } = get();
    if (!config) return;

    const newRelation: ImageTagRelation = { imageId, tagId };
    const newRelations = [...relations, newRelation];
    await invoke('save_image_tags', { dataPath: config.dataPath, imageTagsData: { relations: newRelations } });
    set({ relations: newRelations });
  },

  removeImageTagRelation: async (imageId, tagId) => {
    const { config, relations } = get();
    if (!config) return;

    const newRelations = relations.filter(r => !(r.imageId === imageId && r.tagId === tagId));
    await invoke('save_image_tags', { dataPath: config.dataPath, imageTagsData: { relations: newRelations } });
    set({ relations: newRelations });
  },

  saveImageFromBase64: async (base64Data, source) => {
    const { config } = get();
    if (!config) throw new Error('Not initialized');

    const image = await invoke<ImageInfo>('save_image_from_base64', {
      dataPath: config.dataPath,
      base64Data,
      source,
    });

    await get().addImage(image);
    return image;
  },

  downloadImage: async (url) => {
    const { config } = get();
    if (!config) throw new Error('Not initialized');

    const image = await invoke<ImageInfo>('download_image', {
      dataPath: config.dataPath,
      url,
    });

    await get().addImage(image);
    return image;
  },

  getImagePath: async (filename) => {
    const { config } = get();
    if (!config) throw new Error('Not initialized');
    return invoke<string>('get_image_path', { dataPath: config.dataPath, filename });
  },

  getFilteredImages: () => {
    const { images, relations, selectedTagId, searchQuery, sortBy } = get();

    let filtered = images;

    if (selectedTagId) {
      const imageIds = relations
        .filter(r => r.tagId === selectedTagId)
        .map(r => r.imageId);
      filtered = filtered.filter(i => imageIds.includes(i.id));
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(i =>
        i.original_name.toLowerCase().includes(query) ||
        i.filename.toLowerCase().includes(query)
      );
    }

    if (sortBy === 'date') {
      return filtered.sort((a, b) => b.imported_at - a.imported_at);
    } else if (sortBy === 'name') {
      return filtered.sort((a, b) => (a.original_name || a.filename).localeCompare(b.original_name || b.filename));
    } else if (sortBy === 'size') {
      return filtered.sort((a, b) => b.size - a.size);
    }
    return filtered;
  },
}));
