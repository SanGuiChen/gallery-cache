import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useAppStore } from '../stores/appStore';
import { convertFileSrc } from '@tauri-apps/api/core';
import { writeImage } from '@tauri-apps/plugin-clipboard-manager';
import Masonry from 'react-masonry-css';
import type { ImageInfo } from '../types';

const CARD_GAP = 12;

interface ContextMenuState {
  visible: boolean;
  x: number;
  y: number;
  imageId: string | null;
}

interface ImageCardProps {
  image: ImageInfo;
  onDelete: (id: string) => void;
  onAddTag: (imageId: string) => void;
  onClick: (id: string) => void;
  onContextMenu: (e: React.MouseEvent, id: string) => void;
  onDragStart: (e: React.DragEvent, image: ImageInfo) => void;
  onDragEnd: () => void;
}

const ImageCard: React.FC<ImageCardProps> = React.memo(({ image, onDelete, onAddTag, onClick, onContextMenu, onDragStart, onDragEnd }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const getImagePath = useAppStore(state => state.getImagePath);
  const [imageSrc, setImageSrc] = useState<string>('');

  useEffect(() => {
    getImagePath(image.filename).then(src => {
      setImageSrc(convertFileSrc(src));
    });
  }, [image.filename, getImagePath]);

  return (
    <div
      className="relative group rounded-lg overflow-hidden bg-[var(--color-bg-card)] cursor-pointer transition-all duration-200 hover:shadow-xl hover:scale-[1.02]"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      style={{ marginBottom: CARD_GAP }}
      onClick={() => onClick(image.id)}
      onContextMenu={(e) => onContextMenu(e, image.id)}
      draggable
      onDragStart={(e) => onDragStart(e, image)}
      onDragEnd={onDragEnd}
    >
      {/* Loading skeleton */}
      {!loaded && !error && (
        <div className="absolute inset-0 bg-[var(--color-bg-card)] animate-pulse" />
      )}

      {/* Error state */}
      {error && (
        <div className="flex items-center justify-center bg-[var(--color-bg-card)] text-[var(--color-text-secondary)] py-8">
          <div className="text-center">
            <div className="text-2xl mb-2">⚠️</div>
            <div className="text-xs">加载失败</div>
          </div>
        </div>
      )}

      {/* Image */}
      {imageSrc && (
        <img
          src={imageSrc}
          alt={image.original_name || image.filename}
          className={`w-full h-auto object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          loading="lazy"
          draggable={false}
        />
      )}

      {/* Hover overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-3 transition-opacity duration-200 ${showActions ? 'opacity-100' : 'opacity-0'}`}
      >
        {image.original_name && (
          <div className="text-white text-xs truncate mb-2">
            {image.original_name}
          </div>
        )}
        <div className="flex gap-2 justify-end">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddTag(image.id);
            }}
            className="px-2 py-1 bg-white/20 hover:bg-white/30 text-white text-xs rounded backdrop-blur-sm transition-colors"
          >
            标签
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(image.id);
            }}
            className="px-2 py-1 bg-red-500/80 hover:bg-red-500 text-white text-xs rounded transition-colors"
          >
            删除
          </button>
        </div>
      </div>
    </div>
  );
});

ImageCard.displayName = 'ImageCard';

// Grid view card (fixed aspect ratio)
interface GridImageCardProps {
  image: ImageInfo;
  onDelete: (id: string) => void;
  onAddTag: (imageId: string) => void;
  onClick: (id: string) => void;
  onContextMenu: (e: React.MouseEvent, id: string) => void;
  onDragStart: (e: React.DragEvent, image: ImageInfo) => void;
  onDragEnd: () => void;
}

const GridImageCard: React.FC<GridImageCardProps> = React.memo(({ image, onDelete, onAddTag, onClick, onContextMenu, onDragStart, onDragEnd }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const getImagePath = useAppStore(state => state.getImagePath);
  const [imageSrc, setImageSrc] = useState<string>('');

  useEffect(() => {
    getImagePath(image.filename).then(src => {
      setImageSrc(convertFileSrc(src));
    });
  }, [image.filename, getImagePath]);

  return (
    <div
      className="relative group rounded-lg overflow-hidden bg-[var(--color-bg-card)] cursor-pointer transition-all duration-200 hover:shadow-xl hover:scale-[1.02] aspect-square"
      onClick={() => onClick(image.id)}
      onContextMenu={(e) => onContextMenu(e, image.id)}
      draggable
      onDragStart={(e) => onDragStart(e, image)}
      onDragEnd={onDragEnd}
    >
      {!loaded && !error && (
        <div className="absolute inset-0 bg-[var(--color-bg-card)] animate-pulse" />
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-bg-card)] text-[var(--color-text-secondary)]">
          <div className="text-center">
            <div className="text-2xl mb-1">⚠️</div>
            <div className="text-xs">加载失败</div>
          </div>
        </div>
      )}
      {imageSrc && (
        <img
          src={imageSrc}
          alt={image.original_name || image.filename}
          className={`w-full h-full object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          loading="lazy"
          draggable={false}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
        <div className="flex gap-1 w-full justify-end">
          <button
            onClick={(e) => { e.stopPropagation(); onAddTag(image.id); }}
            className="px-2 py-1 bg-white/20 hover:bg-white/30 text-white text-xs rounded backdrop-blur-sm transition-colors"
          >
            标签
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(image.id); }}
            className="px-2 py-1 bg-red-500/80 hover:bg-red-500 text-white text-xs rounded transition-colors"
          >
            删除
          </button>
        </div>
      </div>
    </div>
  );
});

GridImageCard.displayName = 'GridImageCard';

// Main ImageGrid with drag-drop, context menu, view modes

// Image Viewer Modal
interface ImageViewerProps {
  images: ImageInfo[];
  currentId: string;
  onClose: () => void;
  onNavigate: (id: string) => void;
}

const ImageViewer: React.FC<ImageViewerProps> = ({ images, currentId, onClose, onNavigate }) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const getImagePath = useAppStore(state => state.getImagePath);
  const [imageSrc, setImageSrc] = useState<string>('');

  const currentImage = images.find(i => i.id === currentId);
  const currentIndex = images.findIndex(i => i.id === currentId);

  useEffect(() => {
    if (currentImage) {
      getImagePath(currentImage.filename).then(src => {
        setImageSrc(convertFileSrc(src));
      });
    }
  }, [currentImage, getImagePath]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        if (currentIndex > 0) {
          onNavigate(images[currentIndex - 1].id);
        }
      } else if (e.key === 'ArrowRight') {
        if (currentIndex < images.length - 1) {
          onNavigate(images[currentIndex + 1].id);
        }
      } else if (e.key === '+' || e.key === '=') {
        setScale(s => Math.min(s + 0.25, 3));
      } else if (e.key === '-') {
        setScale(s => Math.max(s - 0.25, 0.5));
      } else if (e.key === '0') {
        setScale(1);
        setPosition({ x: 0, y: 0 });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, images, onClose, onNavigate]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setScale(s => Math.max(0.5, Math.min(3, s + delta)));
  };

  if (!currentImage) return null;

  return (
    <div
      className="fixed inset-0 bg-black/95 z-50 flex flex-col"
      onClick={onClose}
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/50 to-transparent">
        <div className="text-white text-sm">
          {currentIndex + 1} / {images.length}
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-white text-xs">
            <button
              onClick={(e) => { e.stopPropagation(); setScale(s => Math.max(0.5, s - 0.25)); }}
              className="px-2 py-1 bg-white/20 rounded hover:bg-white/30"
            >
              −
            </button>
            <span className="w-12 text-center">{Math.round(scale * 100)}%</span>
            <button
              onClick={(e) => { e.stopPropagation(); setScale(s => Math.min(3, s + 0.25)); }}
              className="px-2 py-1 bg-white/20 rounded hover:bg-white/30"
            >
              +
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setScale(1); setPosition({ x: 0, y: 0 }); }}
              className="px-2 py-1 bg-white/20 rounded hover:bg-white/30 ml-2"
            >
              100%
            </button>
          </div>
          <button
            className="text-white text-2xl hover:text-gray-300 w-8 h-8 flex items-center justify-center"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
      </div>

      {/* Image info */}
      <div className="absolute bottom-0 left-0 right-0 z-10 p-4 bg-gradient-to-t from-black/50 to-transparent">
        <div className="flex items-center justify-between text-white text-xs">
          <div>
            {currentImage.original_name && (
              <div className="font-medium">{currentImage.original_name}</div>
            )}
            <div className="text-gray-400 mt-1">
              {currentImage.width} × {currentImage.height} • {formatFileSize(currentImage.size)}
            </div>
          </div>
          <div className="text-gray-400">
            来源: {currentImage.source === 'paste' ? '粘贴' : currentImage.source === 'cdn' ? 'CDN' : '文件'}
          </div>
        </div>
      </div>

      {/* Navigation arrows */}
      {currentIndex > 0 && (
        <button
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white text-2xl transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onNavigate(images[currentIndex - 1].id);
          }}
        >
          ‹
        </button>
      )}
      {currentIndex < images.length - 1 && (
        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white text-2xl transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onNavigate(images[currentIndex + 1].id);
          }}
        >
          ›
        </button>
      )}

      {/* Image */}
      <div
        className="flex-1 flex items-center justify-center overflow-hidden cursor-grab"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        style={{ cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
      >
        {imageSrc && (
          <img
            src={imageSrc}
            alt=""
            className="max-w-full max-h-full object-contain transition-transform duration-150"
            style={{
              transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
            }}
            draggable={false}
          />
        )}
      </div>

      {/* Help hint */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 z-10 text-gray-400 text-xs bg-black/30 px-3 py-1 rounded-full">
        ← → 导航 | 滚轮缩放 | ESC 关闭
      </div>
    </div>
  );
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

// Main ImageGrid with drag-drop, context menu, view modes
export const ImageGrid: React.FC = () => {
  const { getFilteredImages, deleteImage, addImageTagRelation, tags, saveImageFromBase64, selectedTagId, viewMode, getImagePath, setDraggingImageId } = useAppStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [showTagSelector, setShowTagSelector] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({ visible: false, x: 0, y: 0, imageId: null });

  const images = getFilteredImages();

  const handleDelete = async (id: string) => {
    if (confirm('确定要删除这张图片吗？')) {
      await deleteImage(id);
    }
  };

  const handleAddTag = (imageId: string) => {
    setShowTagSelector(imageId);
  };

  const handleSelectTag = async (tagId: string) => {
    if (showTagSelector) {
      await addImageTagRelation(showTagSelector, tagId);
      setShowTagSelector(null);
    }
  };

  // Context menu handlers
  const handleContextMenu = (e: React.MouseEvent, imageId: string) => {
    e.preventDefault();
    e.stopPropagation();
    const menuX = Math.min(e.clientX, window.innerWidth - 200);
    const menuY = Math.min(e.clientY, window.innerHeight - 200);
    setContextMenu({ visible: true, x: menuX, y: menuY, imageId });
  };

  const closeContextMenu = () => {
    setContextMenu({ visible: false, x: 0, y: 0, imageId: null });
  };

  const handleCopyImage = async (imageId: string) => {
    closeContextMenu();
    const image = images.find(i => i.id === imageId);
    if (!image) return;
    try {
      const path = await getImagePath(image.filename);
      await writeImage(path);
    } catch (err) {
      console.error('Failed to copy image:', err);
    }
  };

  const handleViewDetail = (imageId: string) => {
    closeContextMenu();
    setSelectedImageId(imageId);
  };

  const handleContextAddTag = (imageId: string) => {
    closeContextMenu();
    setShowTagSelector(imageId);
  };

  const handleContextDelete = async (imageId: string) => {
    closeContextMenu();
    await handleDelete(imageId);
  };

  // Close context menu on click outside or escape
  useEffect(() => {
    if (!contextMenu.visible) return;
    const handleClick = () => closeContextMenu();
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeContextMenu(); };
    document.addEventListener('click', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [contextMenu.visible]);

  // Drag and drop handlers for file import
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.types.includes('Files')) {
      setIsDragOver(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(f => f.type.startsWith('image/'));

    for (const file of imageFiles) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = event.target?.result as string;
        if (base64) {
          await saveImageFromBase64(base64, 'file');
        }
      };
      reader.readAsDataURL(file);
    }
  }, [saveImageFromBase64]);

  // Drag start for image-to-tag drag
  const handleDragStart = (e: React.DragEvent, image: ImageInfo) => {
    e.dataTransfer.setData('application/x-gallery-image-id', image.id);
    e.dataTransfer.effectAllowed = 'copy';
    setDraggingImageId(image.id);
  };

  // Drag end to clear the dragging state
  const handleDragEnd = () => {
    setDraggingImageId(null);
  };

  const breakpointColumns = {
    default: 4,
    1600: 3,
    1200: 2,
    800: 2,
    500: 1
  };

  return (
    <div className="h-full flex flex-col relative">
      {/* Tag selector dropdown */}
      {showTagSelector && (
        <div
          className="absolute top-4 right-4 w-56 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg shadow-xl z-40 p-2"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-xs text-[var(--color-text-secondary)] px-2 py-1 mb-1">
            选择标签
          </div>
          {tags.filter(t => t.parentId === null).length === 0 ? (
            <div className="text-xs text-[var(--color-text-disabled)] px-2 py-2">
              暂无标签，请先在侧边栏创建
            </div>
          ) : (
            tags.filter(t => t.parentId === null).map(tag => (
              <div key={tag.id}>
                <button
                  onClick={() => handleSelectTag(tag.id)}
                  className="w-full text-left px-2 py-1.5 text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] rounded"
                >
                  {tag.name}
                </button>
                {tags.filter(t => t.parentId === tag.id).map(child => (
                  <button
                    key={child.id}
                    onClick={() => handleSelectTag(child.id)}
                    className="w-full text-left px-2 py-1.5 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] rounded ml-4"
                  >
                    {child.name}
                  </button>
                ))}
              </div>
            ))
          )}
          <button
            onClick={() => setShowTagSelector(null)}
            className="w-full text-center px-2 py-1.5 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] rounded mt-1"
          >
            取消
          </button>
        </div>
      )}

      {/* Context menu */}
      {contextMenu.visible && (
        <div
          className="fixed bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg shadow-xl z-50 py-1 min-w-[160px]"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => contextMenu.imageId && handleViewDetail(contextMenu.imageId)}
            className="w-full text-left px-4 py-2 text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] flex items-center gap-2"
          >
            <span>🔍</span> 查看详情
          </button>
          <button
            onClick={() => contextMenu.imageId && handleContextAddTag(contextMenu.imageId)}
            className="w-full text-left px-4 py-2 text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] flex items-center gap-2"
          >
            <span>🏷️</span> 添加标签
          </button>
          <button
            onClick={() => contextMenu.imageId && handleCopyImage(contextMenu.imageId)}
            className="w-full text-left px-4 py-2 text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] flex items-center gap-2"
          >
            <span>📋</span> 复制图片
          </button>
          <div className="h-px bg-[var(--color-border)] my-1" />
          <button
            onClick={() => contextMenu.imageId && handleContextDelete(contextMenu.imageId)}
            className="w-full text-left px-4 py-2 text-sm text-[var(--color-error)] hover:bg-[var(--color-bg-secondary)] flex items-center gap-2"
          >
            <span>🗑️</span> 删除
          </button>
        </div>
      )}

      {/* Grid */}
      <div
        ref={containerRef}
        className={`flex-1 overflow-y-auto p-4 transition-colors ${isDragOver ? 'bg-[var(--color-accent)]/10' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {images.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4 opacity-50">📷</div>
              <p className="text-[var(--color-text-secondary)] text-lg">
                {selectedTagId ? '该标签下没有图片' : '暂无图片'}
              </p>
              <p className="text-sm text-[var(--color-text-disabled)] mt-2">
                粘贴图片 (Ctrl/Cmd + V) 或拖拽图片到此处
              </p>
            </div>
          </div>
        ) : viewMode === 'masonry' ? (
          <Masonry
            breakpointCols={breakpointColumns}
            className="flex w-auto -ml-4"
            columnClassName="pl-4 bg-clip-padding"
          >
            {images.map(image => (
              <ImageCard
                key={image.id}
                image={image}
                onDelete={handleDelete}
                onAddTag={handleAddTag}
                onClick={setSelectedImageId}
                onContextMenu={handleContextMenu}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              />
            ))}
          </Masonry>
        ) : (
          <div className="grid gap-3 grid-cols-[repeat(auto-fill,minmax(200px,1fr))]">
            {images.map(image => (
              <GridImageCard
                key={image.id}
                image={image}
                onDelete={handleDelete}
                onAddTag={handleAddTag}
                onClick={setSelectedImageId}
                onContextMenu={handleContextMenu}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              />
            ))}
          </div>
        )}
      </div>

      {/* Drop overlay */}
      {isDragOver && (
        <div className="absolute inset-0 bg-[var(--color-accent)]/20 border-4 border-dashed border-[var(--color-accent)] rounded-lg flex items-center justify-center z-30 pointer-events-none">
          <div className="text-center">
            <div className="text-5xl mb-2 text-[var(--color-accent)]">📥</div>
            <div className="text-[var(--color-accent)] font-medium">释放以导入图片</div>
          </div>
        </div>
      )}

      {/* Image viewer */}
      {selectedImageId && images.find(i => i.id === selectedImageId) && (
        <ImageViewer
          images={images}
          currentId={selectedImageId}
          onClose={() => setSelectedImageId(null)}
          onNavigate={setSelectedImageId}
        />
      )}
    </div>
  );
};
