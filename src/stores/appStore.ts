import { create } from 'zustand';
import { invoke } from '@tauri-apps/api/core';
import { open } from '@tauri-apps/plugin-dialog';
<<<<<<< HEAD
=======
import { readFile } from '@tauri-apps/plugin-fs';
>>>>>>> 57eddd3 (Initial commit)
import { UNTAGGED_TAG_ID, type AppConfig, type Tag, type ImageInfo, type ImageTagRelation } from '../types';

type ViewMode = 'masonry' | 'grid';
type SortBy = 'date' | 'name' | 'size';
type NoticeType = 'success' | 'error' | 'info';

interface AppNotification {
  id: string;
  message: string;
  type: NoticeType;
}

interface AppState {
  config: AppConfig | null;
  isInitialized: boolean;
  isInitializing: boolean;
  initializationError: string | null;
  tags: Tag[];
  images: ImageInfo[];
  relations: ImageTagRelation[];
  selectedTagId: string | null;
  searchQuery: string;
  viewMode: ViewMode;
  sortBy: SortBy;
  draggingImageId: string | null;
  notifications: AppNotification[];

  initialize: () => Promise<void>;
  selectDataPath: () => Promise<void>;
  setSelectedTagId: (tagId: string | null) => void;
  setSearchQuery: (query: string) => void;
  setViewMode: (mode: ViewMode) => void;
  setSortBy: (sort: SortBy) => void;
  setDraggingImageId: (id: string | null) => void;
  pushNotification: (message: string, type?: NoticeType) => void;
  dismissNotification: (id: string) => void;

  addTag: (name: string, parentId: string | null) => Promise<void>;
  updateTag: (id: string, name: string) => Promise<void>;
  deleteTag: (id: string) => Promise<void>;
  moveTag: (id: string, direction: 'up' | 'down') => Promise<void>;
<<<<<<< HEAD
=======
  reorderTag: (dragTagId: string, dropTagId: string) => Promise<void>;
>>>>>>> 57eddd3 (Initial commit)

  addImage: (image: ImageInfo) => Promise<void>;
  deleteImage: (id: string) => Promise<void>;
  addImageTagRelation: (imageId: string, tagId: string) => Promise<void>;
  removeImageTagRelation: (imageId: string, tagId: string) => Promise<void>;
  clearImageTagRelations: (imageId: string) => Promise<void>;

  saveImageFromBase64: (base64Data: string, source: string) => Promise<ImageInfo>;
  saveImageFromFile: (file: File, source: 'paste' | 'file') => Promise<ImageInfo>;
  downloadImage: (url: string) => Promise<ImageInfo>;
<<<<<<< HEAD
=======
  importImages: () => Promise<void>;
  updateImageName: (imageId: string, newName: string) => Promise<void>;
>>>>>>> 57eddd3 (Initial commit)
  getImagePath: (filename: string) => Promise<string>;

  getFilteredImages: () => ImageInfo[];
}

export const useAppStore = create<AppState>((set, get) => ({
  config: null,
  isInitialized: false,
  isInitializing: true,
  initializationError: null,
  tags: [],
  images: [],
  relations: [],
  selectedTagId: null,
  searchQuery: '',
  viewMode: 'masonry',
  sortBy: 'date',
  draggingImageId: null,
  notifications: [],

  initialize: async () => {
    set({ isInitializing: true, initializationError: null });
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
          isInitializing: false,
        });
        return;
      }
      set({ isInitialized: false, config: null, isInitializing: false });
    } catch {
      set({ isInitialized: false, config: null, isInitializing: false });
    }
  },

  selectDataPath: async () => {
    set({ isInitializing: true, initializationError: null });
    try {
      const selected = await open({
        directory: true,
        multiple: false,
        title: '选择图片存储目录',
      });

      if (selected && typeof selected === 'string') {
        const now = Date.now();
        const config: AppConfig = {
          version: 1,
          dataPath: selected,
          theme: 'dark',
          lastOpenedAt: now,
        };

        await invoke('init_data_dir', { dataPath: selected });
        await invoke('save_config', { config });

        set({
          config,
          tags: [],
          images: [],
          relations: [],
          isInitialized: true,
          isInitializing: false,
          initializationError: null,
          selectedTagId: null,
        });
        return;
      }

      set({ isInitializing: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : '初始化目录失败，请重试';
      set({
        isInitializing: false,
        initializationError: message,
      });
    }
  },

  setSelectedTagId: (tagId) => set({ selectedTagId: tagId }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setSortBy: (sort) => set({ sortBy: sort }),
  setDraggingImageId: (id) => set({ draggingImageId: id }),
  pushNotification: (message, type = 'info') => {
    const id = crypto.randomUUID();
    set(state => ({
      notifications: [...state.notifications, { id, message, type }],
    }));
    window.setTimeout(() => {
      get().dismissNotification(id);
    }, 2800);
  },
  dismissNotification: (id) =>
    set(state => ({
      notifications: state.notifications.filter(notification => notification.id !== id),
    })),

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
    const { config, tags, relations, selectedTagId } = get();
    if (!config) return;

    const deletedTagIds = new Set<string>();
    const stack = [id];

    while (stack.length > 0) {
      const currentId = stack.pop()!;
      if (deletedTagIds.has(currentId)) continue;
      deletedTagIds.add(currentId);

      tags
        .filter(tag => tag.parentId === currentId)
        .forEach(tag => stack.push(tag.id));
    }

    const newTags = tags.filter(t => !deletedTagIds.has(t.id));
    const newRelations = relations.filter(r => !deletedTagIds.has(r.tagId));
    await invoke('save_tags', { dataPath: config.dataPath, tagsData: { tags: newTags } });
    await invoke('save_image_tags', { dataPath: config.dataPath, imageTagsData: { relations: newRelations } });
    set({
      tags: newTags,
      relations: newRelations,
      selectedTagId: selectedTagId && deletedTagIds.has(selectedTagId) ? null : selectedTagId,
    });
  },

  moveTag: async (id, direction) => {
    const { config, tags } = get();
    if (!config) return;

    const target = tags.find(tag => tag.id === id);
    if (!target) return;

    const siblings = tags
      .filter(tag => tag.parentId === target.parentId)
      .sort((a, b) => a.order - b.order);
    const currentIndex = siblings.findIndex(tag => tag.id === id);
    const swapIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (currentIndex === -1 || swapIndex < 0 || swapIndex >= siblings.length) {
      return;
    }

    const reordered = [...siblings];
    [reordered[currentIndex], reordered[swapIndex]] = [reordered[swapIndex], reordered[currentIndex]];

    const nextOrders = new Map(reordered.map((tag, index) => [tag.id, index]));
    const newTags = tags.map(tag =>
      nextOrders.has(tag.id) ? { ...tag, order: nextOrders.get(tag.id)! } : tag
    );

    await invoke('save_tags', { dataPath: config.dataPath, tagsData: { tags: newTags } });
    set({ tags: newTags });
  },

<<<<<<< HEAD
=======
  reorderTag: async (dragTagId, dropTagId) => {
    const { config, tags } = get();
    if (!config) return;

    const dragTag = tags.find(tag => tag.id === dragTagId);
    const dropTag = tags.find(tag => tag.id === dropTagId);
    if (!dragTag || !dropTag) return;
    if (dragTag.parentId !== dropTag.parentId) return; // Can only reorder within same parent

    const siblings = tags
      .filter(tag => tag.parentId === dragTag.parentId)
      .sort((a, b) => a.order - b.order);

    const dragIndex = siblings.findIndex(tag => tag.id === dragTagId);
    const dropIndex = siblings.findIndex(tag => tag.id === dropTagId);

    if (dragIndex === -1 || dropIndex === -1) return;

    // Move dragTag to dropIndex position
    const reordered = [...siblings];
    reordered.splice(dragIndex, 1);
    reordered.splice(dropIndex, 0, dragTag);

    const nextOrders = new Map(reordered.map((tag, index) => [tag.id, index]));
    const newTags = tags.map(tag =>
      nextOrders.has(tag.id) ? { ...tag, order: nextOrders.get(tag.id)! } : tag
    );

    await invoke('save_tags', { dataPath: config.dataPath, tagsData: { tags: newTags } });
    set({ tags: newTags });
  },

>>>>>>> 57eddd3 (Initial commit)
  addImage: async (image) => {
    const { config, images, selectedTagId } = get();
    if (!config) return;

    const newImages = [...images, image];
    await invoke('save_images', { dataPath: config.dataPath, imagesData: { images: newImages } });
    set({ images: newImages });

    if (selectedTagId && selectedTagId !== UNTAGGED_TAG_ID) {
      await get().addImageTagRelation(image.id, selectedTagId);
    }
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

    if (relations.some(r => r.imageId === imageId && r.tagId === tagId)) {
      return;
    }

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

  clearImageTagRelations: async (imageId) => {
    const { config, relations } = get();
    if (!config) return;

    const newRelations = relations.filter(r => r.imageId !== imageId);
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
      originalName: '',
    });

    await get().addImage(image);
    return image;
  },

  saveImageFromFile: async (file, source) => {
    const base64Data = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result;
        if (typeof result === 'string') {
          resolve(result);
        } else {
          reject(new Error('无法读取文件内容'));
        }
      };
      reader.onerror = () => reject(reader.error ?? new Error('读取文件失败'));
      reader.readAsDataURL(file);
    });

    const { config } = get();
    if (!config) throw new Error('Not initialized');

    const image = await invoke<ImageInfo>('save_image_from_base64', {
      dataPath: config.dataPath,
      base64Data,
      source,
      originalName: file.name,
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

<<<<<<< HEAD
=======
  importImages: async () => {
    const { config, saveImageFromBase64 } = get();
    if (!config) throw new Error('Not initialized');

    const selected = await open({
      multiple: true,
      filters: [{
        name: 'Images',
        extensions: ['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp'],
      }],
    });

    if (!selected) return;

    const filePaths = Array.isArray(selected) ? selected : [selected];
    const failures: string[] = [];

    for (const filePath of filePaths) {
      try {
        const contents = await readFile(filePath);
        const base64 = btoa(String.fromCharCode(...contents));
        const ext = filePath.split('.').pop()?.toLowerCase() || 'png';
        const mimeType = ext === 'jpg' ? 'image/jpeg' : `image/${ext}`;
        const dataUrl = `data:${mimeType};base64,${base64}`;
        await saveImageFromBase64(dataUrl, 'file');
      } catch (err) {
        console.error('Failed to import:', filePath, err);
        failures.push(filePath);
      }
    }

    if (failures.length === 0) {
      get().pushNotification(`成功导入 ${filePaths.length} 张图片`, 'success');
    } else {
      get().pushNotification(`导入完成，失败 ${failures.length} 张`, 'error');
    }
  },

  updateImageName: async (imageId, newName) => {
    const { config, images } = get();
    if (!config) throw new Error('Not initialized');

    await invoke('update_image_name', {
      dataPath: config.dataPath,
      imageId,
      newName,
    });

    const newImages = images.map(img =>
      img.id === imageId ? { ...img, originalName: newName } : img
    );
    set({ images: newImages });
  },

>>>>>>> 57eddd3 (Initial commit)
  getImagePath: async (filename) => {
    const { config } = get();
    if (!config) throw new Error('Not initialized');
    return invoke<string>('get_image_path', { dataPath: config.dataPath, filename });
  },

  getFilteredImages: () => {
    const { images, relations, selectedTagId, searchQuery, sortBy } = get();

    let filtered = [...images];

    if (selectedTagId === UNTAGGED_TAG_ID) {
      const taggedImageIds = new Set(relations.map(relation => relation.imageId));
      filtered = filtered.filter(image => !taggedImageIds.has(image.id));
    } else if (selectedTagId) {
      const imageIds = relations
        .filter(r => r.tagId === selectedTagId)
        .map(r => r.imageId);
      filtered = filtered.filter(i => imageIds.includes(i.id));
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(i =>
        i.originalName.toLowerCase().includes(query) ||
        i.filename.toLowerCase().includes(query)
      );
    }

    if (sortBy === 'date') {
      return filtered.sort((a, b) => b.importedAt - a.importedAt);
    } else if (sortBy === 'name') {
      return filtered.sort((a, b) => (a.originalName || a.filename).localeCompare(b.originalName || b.filename));
    } else if (sortBy === 'size') {
      return filtered.sort((a, b) => b.size - a.size);
    }
    return filtered;
  },
}));
