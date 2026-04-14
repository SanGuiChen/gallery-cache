import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useAppStore } from '../stores/appStore';
import { convertFileSrc } from '@tauri-apps/api/core';
import { writeImage } from '@tauri-apps/plugin-clipboard-manager';
import Masonry from 'react-masonry-css';
import { UNTAGGED_TAG_ID, type ImageInfo } from '../types';
<<<<<<< HEAD
=======
import { IconCameraEmpty } from './icons/DeskIcons';
>>>>>>> 57eddd3 (Initial commit)

const CARD_GAP = 20;
const IMAGE_FILE_PATTERN = /\.(png|jpe?g|gif|webp|bmp|svg|avif)$/i;

interface ContextMenuState {
  visible: boolean;
  x: number;
  y: number;
  imageId: string | null;
}

interface ImageDetailsProps {
  image: ImageInfo;
  tagNames: string[];
  allTags: Array<{ id: string; name: string }>;
  activeTagIds: string[];
  onToggleTag: (tagId: string) => Promise<void>;
  onDelete: () => Promise<void>;
  onClose: () => void;
}

interface ImageCardProps {
  image: ImageInfo;
<<<<<<< HEAD
  onDelete: (id: string) => void;
  onAddTag: (imageId: string) => void;
=======
>>>>>>> 57eddd3 (Initial commit)
  onClick: (id: string) => void;
  onContextMenu: (e: React.MouseEvent, id: string) => void;
  onDragStart: (e: React.DragEvent, image: ImageInfo) => void;
  onDragEnd: () => void;
}

<<<<<<< HEAD
const ImageCard: React.FC<ImageCardProps> = React.memo(({ image, onDelete, onAddTag, onClick, onContextMenu, onDragStart, onDragEnd }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [showActions, setShowActions] = useState(false);
=======
const ImageCard: React.FC<ImageCardProps> = React.memo(({ image, onClick, onContextMenu, onDragStart, onDragEnd }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
>>>>>>> 57eddd3 (Initial commit)
  const getImagePath = useAppStore(state => state.getImagePath);
  const [imageSrc, setImageSrc] = useState<string>('');

  useEffect(() => {
    getImagePath(image.filename).then(src => {
      setImageSrc(convertFileSrc(src));
    });
  }, [image.filename, getImagePath]);

  return (
    <div
      className="group cursor-pointer select-none"
<<<<<<< HEAD
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
=======
>>>>>>> 57eddd3 (Initial commit)
      style={{ marginBottom: CARD_GAP }}
      onClick={() => onClick(image.id)}
      onContextMenu={(e) => onContextMenu(e, image.id)}
      draggable
      onDragStart={(e) => onDragStart(e, image)}
      onDragEnd={onDragEnd}
    >
      {/* Loading skeleton */}
      {!loaded && !error && (
        <div className="h-64 rounded-[24px] bg-[var(--color-bg-card)] animate-pulse" />
      )}

      {error && (
<<<<<<< HEAD
        <div className="flex min-h-64 items-center justify-center rounded-[24px] border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] text-[var(--color-text-secondary)] py-8">
=======
        <div className="flex min-h-64 items-center justify-center rounded-[24px] border border-[var(--color-border)] bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] py-8">
>>>>>>> 57eddd3 (Initial commit)
          <div className="text-center">
            <div className="text-2xl mb-2">⚠️</div>
            <div className="text-xs">加载失败</div>
          </div>
        </div>
      )}

      {imageSrc && (
<<<<<<< HEAD
        <div className="relative overflow-hidden rounded-[24px] border border-[rgba(255,255,255,0.06)] bg-[#1b1d21] shadow-[0_18px_40px_rgba(0,0,0,0.18)] transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-[rgba(255,255,255,0.12)] group-hover:shadow-[0_24px_48px_rgba(0,0,0,0.24)]">
=======
        <div className="relative overflow-hidden rounded-[24px] border border-[var(--color-border)] bg-[var(--color-bg-secondary)] shadow-sm transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-[#d8d8d8] group-hover:shadow-md">
>>>>>>> 57eddd3 (Initial commit)
          <img
            src={imageSrc}
            alt={image.originalName || image.filename}
            className={`block w-full h-auto object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setLoaded(true)}
            onError={() => {
              console.error('Failed to load image source:', imageSrc, image);
              setError(true);
            }}
            loading="lazy"
            draggable={false}
          />
<<<<<<< HEAD
          <div
            className={`absolute inset-x-0 bottom-0 flex items-center justify-end gap-2 p-4 transition-opacity duration-200 ${showActions ? 'opacity-100' : 'opacity-0'} bg-gradient-to-t from-black/78 via-black/16 to-transparent`}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddTag(image.id);
              }}
              className="rounded-full bg-white/16 px-3 py-1.5 text-[11px] font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/26"
            >
              标签
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(image.id);
              }}
              className="rounded-full bg-[var(--color-error)] px-3 py-1.5 text-[11px] font-medium text-white transition-colors hover:bg-[var(--color-error)]"
            >
              删除
            </button>
          </div>
=======
>>>>>>> 57eddd3 (Initial commit)
        </div>
      )}

      {!error && (
        <div className="flex items-start justify-between gap-3 px-1.5 pt-3">
<<<<<<< HEAD
          <div className="min-w-0">
=======
          <div className="min-w-0 flex-1">
>>>>>>> 57eddd3 (Initial commit)
            <div className="truncate text-[13px] font-medium text-[var(--color-text-primary)]">
              {image.originalName || image.filename}
            </div>
            <div className="mt-1 text-[11px] text-[var(--color-text-disabled)]">
              {image.source === 'cdn' ? 'CDN 导入' : image.source === 'paste' ? '粘贴导入' : '本地导入'}
            </div>
          </div>
<<<<<<< HEAD
          <span className="shrink-0 rounded-full border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] px-2 py-1 text-[10px] text-[var(--color-text-secondary)]">
=======
          <span className="shrink-0 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-page)] px-2 py-1 text-[10px] text-[var(--color-text-secondary)]">
>>>>>>> 57eddd3 (Initial commit)
            {image.width}×{image.height}
          </span>
        </div>
      )}
    </div>
  );
});

ImageCard.displayName = 'ImageCard';

// Grid view card (fixed aspect ratio)
interface GridImageCardProps {
  image: ImageInfo;
<<<<<<< HEAD
  onDelete: (id: string) => void;
  onAddTag: (imageId: string) => void;
=======
>>>>>>> 57eddd3 (Initial commit)
  onClick: (id: string) => void;
  onContextMenu: (e: React.MouseEvent, id: string) => void;
  onDragStart: (e: React.DragEvent, image: ImageInfo) => void;
  onDragEnd: () => void;
}

<<<<<<< HEAD
const GridImageCard: React.FC<GridImageCardProps> = React.memo(({ image, onDelete, onAddTag, onClick, onContextMenu, onDragStart, onDragEnd }) => {
=======
const GridImageCard: React.FC<GridImageCardProps> = React.memo(({ image, onClick, onContextMenu, onDragStart, onDragEnd }) => {
>>>>>>> 57eddd3 (Initial commit)
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
<<<<<<< HEAD
      className="relative group overflow-hidden rounded-[18px] border border-[rgba(255,255,255,0.05)] bg-[var(--color-bg-card)] cursor-pointer transition-colors duration-200 hover:bg-[#333333] aspect-square"
=======
      className="relative aspect-square cursor-pointer overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-page)] shadow-sm transition-colors duration-200 hover:border-[#d8d8d8] hover:shadow-md"
>>>>>>> 57eddd3 (Initial commit)
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
          alt={image.originalName || image.filename}
          className={`w-full h-full object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setLoaded(true)}
          onError={() => {
            console.error('Failed to load image source:', imageSrc, image);
            setError(true);
          }}
          loading="lazy"
          draggable={false}
        />
      )}
<<<<<<< HEAD
      <div className="absolute inset-0 bg-[rgba(0,0,0,0.55)] opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
        <div className="flex gap-1 w-full justify-end">
          <button
            onClick={(e) => { e.stopPropagation(); onAddTag(image.id); }}
            className="px-2 py-1 bg-[rgba(255,255,255,0.18)] hover:bg-[rgba(255,255,255,0.26)] text-white text-xs rounded transition-colors"
          >
            标签
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(image.id); }}
            className="px-2 py-1 bg-[var(--color-error)] hover:bg-[var(--color-error)] text-white text-xs rounded transition-colors"
          >
            删除
          </button>
        </div>
      </div>
=======
>>>>>>> 57eddd3 (Initial commit)
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
<<<<<<< HEAD
      className="fixed inset-0 z-50 flex flex-col bg-[#101010]"
      onClick={onClose}
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-[rgba(16,16,16,0.92)] border-b border-[rgba(255,255,255,0.08)]">
=======
      className="fixed inset-0 z-50 flex flex-col bg-[rgba(16,22,36,0.96)]"
      onClick={onClose}
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-[rgba(20,26,42,0.82)] border-b border-[rgba(255,255,255,0.16)] backdrop-blur-xl">
>>>>>>> 57eddd3 (Initial commit)
        <div className="text-white text-sm">
          {currentIndex + 1} / {images.length}
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-white text-xs">
            <button
              onClick={(e) => { e.stopPropagation(); setScale(s => Math.max(0.5, s - 0.25)); }}
              className="px-2 py-1 rounded bg-[rgba(255,255,255,0.14)] hover:bg-[rgba(255,255,255,0.22)]"
            >
              −
            </button>
            <span className="w-12 text-center">{Math.round(scale * 100)}%</span>
            <button
              onClick={(e) => { e.stopPropagation(); setScale(s => Math.min(3, s + 0.25)); }}
              className="px-2 py-1 rounded bg-[rgba(255,255,255,0.14)] hover:bg-[rgba(255,255,255,0.22)]"
            >
              +
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setScale(1); setPosition({ x: 0, y: 0 }); }}
              className="ml-2 px-2 py-1 rounded bg-[rgba(255,255,255,0.14)] hover:bg-[rgba(255,255,255,0.22)]"
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
<<<<<<< HEAD
      <div className="absolute bottom-0 left-0 right-0 z-10 p-4 bg-[rgba(16,16,16,0.92)] border-t border-[rgba(255,255,255,0.08)]">
=======
      <div className="absolute bottom-0 left-0 right-0 z-10 p-4 bg-[rgba(20,26,42,0.82)] border-t border-[rgba(255,255,255,0.16)] backdrop-blur-xl">
>>>>>>> 57eddd3 (Initial commit)
        <div className="flex items-center justify-between text-white text-xs">
          <div>
            {currentImage.originalName && (
              <div className="font-medium">{currentImage.originalName}</div>
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
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full flex items-center justify-center text-white text-2xl transition-colors bg-[rgba(255,255,255,0.12)] hover:bg-[rgba(255,255,255,0.2)]"
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
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full flex items-center justify-center text-white text-2xl transition-colors bg-[rgba(255,255,255,0.12)] hover:bg-[rgba(255,255,255,0.2)]"
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
<<<<<<< HEAD
      <div className="absolute top-16 left-1/2 -translate-x-1/2 z-10 rounded-full px-3 py-1 text-xs text-gray-400 bg-[rgba(16,16,16,0.92)] border border-[rgba(255,255,255,0.08)]">
=======
      <div className="absolute top-16 left-1/2 -translate-x-1/2 z-10 rounded-full px-3 py-1 text-xs text-gray-300 bg-[rgba(20,26,42,0.82)] border border-[rgba(255,255,255,0.16)] backdrop-blur-xl">
>>>>>>> 57eddd3 (Initial commit)
        ← → 导航 | 滚轮缩放 | ESC 关闭
      </div>
    </div>
  );
};

const ImageDetailsModal: React.FC<ImageDetailsProps> = ({
  image,
  tagNames,
  allTags,
  activeTagIds,
  onToggleTag,
  onDelete,
  onClose,
}) => {
<<<<<<< HEAD
  const details = [
    ['原始名称', image.originalName || '未记录'],
    ['文件名', image.filename],
    ['分辨率', `${image.width} × ${image.height}`],
    ['大小', formatFileSize(image.size)],
    ['来源', image.source === 'paste' ? '粘贴' : image.source === 'cdn' ? 'CDN' : '本地文件'],
    ['导入时间', new Date(image.importedAt).toLocaleString()],
    ['标签', tagNames.length > 0 ? tagNames.join(' / ') : '未分类'],
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-[rgba(16,16,16,0.82)]" onClick={onClose}>
      <div
        className="w-full max-w-lg rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)]"
=======
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-[rgba(16,16,16,0.82)]" onClick={onClose}>
      <div
        className="w-full max-w-lg rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-page)] shadow-xl"
>>>>>>> 57eddd3 (Initial commit)
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[var(--color-border)] px-5 py-4">
          <div>
            <h3 className="text-base font-semibold text-[var(--color-text-primary)]">图片详情</h3>
            <p className="mt-1 text-xs text-[var(--color-text-secondary)]">查看当前图片的基础信息</p>
          </div>
          <button
            className="text-xl text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="space-y-3 px-5 py-4">
<<<<<<< HEAD
          {details.map(([label, value]) => (
            <div key={label} className="grid grid-cols-[88px_1fr] gap-3 text-sm">
              <span className="text-[var(--color-text-secondary)]">{label}</span>
              <span className="break-all text-[var(--color-text-primary)]">{value}</span>
            </div>
          ))}
=======
          <div className="grid grid-cols-[88px_1fr] gap-3 text-sm">
            <span className="text-[var(--color-text-secondary)]">原始名称</span>
            <span className="break-all text-[var(--color-text-primary)]">{image.originalName || '未记录'}</span>
          </div>
          <div className="grid grid-cols-[88px_1fr] gap-3 text-sm">
            <span className="text-[var(--color-text-secondary)]">文件名</span>
            <span className="break-all text-[var(--color-text-primary)]">{image.filename}</span>
          </div>
          <div className="grid grid-cols-[88px_1fr] gap-3 text-sm">
            <span className="text-[var(--color-text-secondary)]">分辨率</span>
            <span className="break-all text-[var(--color-text-primary)]">{image.width} × {image.height}</span>
          </div>
          <div className="grid grid-cols-[88px_1fr] gap-3 text-sm">
            <span className="text-[var(--color-text-secondary)]">大小</span>
            <span className="break-all text-[var(--color-text-primary)]">{formatFileSize(image.size)}</span>
          </div>
          <div className="grid grid-cols-[88px_1fr] gap-3 text-sm">
            <span className="text-[var(--color-text-secondary)]">来源</span>
            <span className="break-all text-[var(--color-text-primary)]">{image.source === 'paste' ? '粘贴' : image.source === 'cdn' ? 'CDN' : '本地文件'}</span>
          </div>
          <div className="grid grid-cols-[88px_1fr] gap-3 text-sm">
            <span className="text-[var(--color-text-secondary)]">导入时间</span>
            <span className="break-all text-[var(--color-text-primary)]">{new Date(image.importedAt).toLocaleString()}</span>
          </div>
          <div className="grid grid-cols-[88px_1fr] gap-3 text-sm">
            <span className="text-[var(--color-text-secondary)]">标签</span>
            <span className="break-all text-[var(--color-text-primary)]">{tagNames.length > 0 ? tagNames.join(' / ') : '未分类'}</span>
          </div>
>>>>>>> 57eddd3 (Initial commit)

          <div className="pt-2">
            <div className="mb-2 text-xs uppercase tracking-wider text-[var(--color-text-secondary)]">
              快速管理标签
            </div>
            {allTags.length === 0 ? (
              <div className="text-sm text-[var(--color-text-disabled)]">暂无标签，请先在侧边栏创建。</div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => {
                  const active = activeTagIds.includes(tag.id);
                  return (
                    <button
                      key={tag.id}
                      onClick={() => void onToggleTag(tag.id)}
                      className={`rounded-full border px-3 py-1 text-xs transition ${
                        active
                          ? 'border-[var(--color-accent)] bg-[#2d325f] text-[var(--color-text-primary)]'
                          : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-accent)] hover:text-[var(--color-text-primary)]'
                      }`}
                    >
                      {active ? '✓ ' : ''}
                      {tag.name}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end border-t border-[var(--color-border)] px-5 py-4">
          <button
            onClick={() => void onDelete()}
            className="rounded-lg bg-[var(--color-error)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--color-error)]"
          >
            删除图片
          </button>
        </div>
      </div>
    </div>
  );
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

<<<<<<< HEAD
=======
// Rename Modal
interface RenameModalProps {
  image: ImageInfo;
  onRename: (imageId: string, newName: string) => Promise<void>;
  onClose: () => void;
}

const RenameModal: React.FC<RenameModalProps> = ({ image, onRename, onClose }) => {
  const [editName, setEditName] = useState(image.originalName || '');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, []);

  const handleSave = async () => {
    const newName = editName.trim();
    if (newName && newName !== image.originalName) {
      await onRename(image.id, newName);
    }
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-[rgba(16,16,16,0.82)]" onClick={onClose}>
      <div
        className="w-full max-w-sm rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-page)] shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[var(--color-border)] px-5 py-4">
          <h3 className="text-base font-semibold text-[var(--color-text-primary)]">重命名图片</h3>
          <button
            className="text-xl text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        <div className="p-5">
          <input
            ref={inputRef}
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-3 py-2 text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent)]"
            placeholder="请输入新的图片名称"
          />
        </div>
        <div className="flex justify-end gap-2 border-t border-[var(--color-border)] px-5 py-4">
          <button
            onClick={onClose}
            className="rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)]"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            className="rounded-lg bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--color-accent-hover)]"
          >
            确定
          </button>
        </div>
      </div>
    </div>
  );
};

>>>>>>> 57eddd3 (Initial commit)
// Main ImageGrid with drag-drop, context menu, view modes
export const ImageGrid: React.FC = () => {
  const getFilteredImages = useAppStore(state => state.getFilteredImages);
  const deleteImage = useAppStore(state => state.deleteImage);
  const addImageTagRelation = useAppStore(state => state.addImageTagRelation);
  const removeImageTagRelation = useAppStore(state => state.removeImageTagRelation);
<<<<<<< HEAD
=======
  const updateImageName = useAppStore(state => state.updateImageName);
>>>>>>> 57eddd3 (Initial commit)
  const relations = useAppStore(state => state.relations);
  const tags = useAppStore(state => state.tags);
  const saveImageFromFile = useAppStore(state => state.saveImageFromFile);
  const selectedTagId = useAppStore(state => state.selectedTagId);
  const viewMode = useAppStore(state => state.viewMode);
  const getImagePath = useAppStore(state => state.getImagePath);
  const setDraggingImageId = useAppStore(state => state.setDraggingImageId);
  const pushNotification = useAppStore(state => state.pushNotification);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [detailImageId, setDetailImageId] = useState<string | null>(null);
<<<<<<< HEAD
=======
  const [renameImageId, setRenameImageId] = useState<string | null>(null);
>>>>>>> 57eddd3 (Initial commit)
  const [showTagSelector, setShowTagSelector] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({ visible: false, x: 0, y: 0, imageId: null });

  const images = getFilteredImages();

  const handleDelete = async (id: string) => {
    if (confirm('确定要删除这张图片吗？')) {
      await deleteImage(id);
      pushNotification('图片已删除', 'success');
      if (selectedImageId === id) {
        setSelectedImageId(null);
      }
      if (detailImageId === id) {
        setDetailImageId(null);
      }
    }
  };

<<<<<<< HEAD
  const handleAddTag = (imageId: string) => {
    setShowTagSelector(imageId);
  };

=======
>>>>>>> 57eddd3 (Initial commit)
  const handleSelectTag = async (tagId: string) => {
    if (showTagSelector) {
      const hasRelation = relations.some(relation => relation.imageId === showTagSelector && relation.tagId === tagId);
      if (hasRelation) {
        await removeImageTagRelation(showTagSelector, tagId);
      } else {
        await addImageTagRelation(showTagSelector, tagId);
      }
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
      pushNotification('图片已复制到剪贴板', 'success');
    } catch (err) {
      console.error('Failed to copy image:', err);
      pushNotification('复制图片失败', 'error');
    }
  };

  const handleViewDetail = (imageId: string) => {
    closeContextMenu();
    setDetailImageId(imageId);
  };

  const handleContextAddTag = (imageId: string) => {
    closeContextMenu();
    setShowTagSelector(imageId);
  };

  const handleContextDelete = async (imageId: string) => {
    closeContextMenu();
    await handleDelete(imageId);
  };

<<<<<<< HEAD
=======
  const handleContextRename = (imageId: string) => {
    closeContextMenu();
    setRenameImageId(imageId);
  };

>>>>>>> 57eddd3 (Initial commit)
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

  useEffect(() => {
    if (!showTagSelector) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowTagSelector(null);
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [showTagSelector]);

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
    const imageFiles = files.filter(f => f.type.startsWith('image/') || IMAGE_FILE_PATTERN.test(f.name));

    const failures: string[] = [];
    for (const file of imageFiles) {
      try {
        await saveImageFromFile(file, 'file');
      } catch (error) {
        console.error('Drag import failed:', error);
        failures.push(file.name);
      }
    }

    if (imageFiles.length > 0) {
      if (failures.length === 0) {
        pushNotification(`已导入 ${imageFiles.length} 张本地图片`, 'success');
      } else {
        pushNotification(`拖拽导入完成，失败 ${failures.length} 张`, 'error');
      }
    }
  }, [pushNotification, saveImageFromFile]);

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
    default: 6,
    1800: 5,
    1560: 4,
    1220: 3,
    840: 2,
    560: 1
  };

  const rootTags = tags
    .filter(tag => tag.parentId === null)
    .sort((a, b) => a.order - b.order);

  const renderTagOptions = (parentId: string | null = null, level = 0): React.ReactNode =>
    tags
      .filter(tag => tag.parentId === parentId)
      .sort((a, b) => a.order - b.order)
      .map(tag => (
        <React.Fragment key={tag.id}>
          <button
            onClick={() => handleSelectTag(tag.id)}
            className="flex w-full items-center justify-between gap-3 rounded px-2 py-1.5 text-left text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)]"
            style={{ paddingLeft: `${8 + level * 18}px` }}
          >
            <span>
              {level > 0 ? '└ ' : ''}
              {tag.name}
            </span>
            {showTagSelector && relations.some(relation => relation.imageId === showTagSelector && relation.tagId === tag.id) && (
              <span className="text-[var(--color-accent)]">✓</span>
            )}
          </button>
          {renderTagOptions(tag.id, level + 1)}
        </React.Fragment>
      ));

  const detailImage = detailImageId ? images.find(image => image.id === detailImageId) ?? null : null;
  const detailImageTagIds = detailImage
    ? relations.filter(relation => relation.imageId === detailImage.id).map(relation => relation.tagId)
    : [];
  const detailImageTagNames = detailImage
    ? relations
        .filter(relation => relation.imageId === detailImage.id)
        .map(relation => tags.find(tag => tag.id === relation.tagId)?.name)
        .filter((value): value is string => Boolean(value))
    : [];
  const flattenedTags = tags
    .slice()
    .sort((a, b) => a.order - b.order)
    .map(tag => ({ id: tag.id, name: tag.name }));

  return (
    <div className="h-full flex flex-col relative">
      {/* Tag selector dropdown */}
      {showTagSelector && (
        <div
<<<<<<< HEAD
          className="absolute top-4 right-4 z-40 w-56 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)] p-2"
=======
          className="absolute top-4 right-4 z-40 w-56 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-page)] p-2 shadow-md"
>>>>>>> 57eddd3 (Initial commit)
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-xs text-[var(--color-text-secondary)] px-2 py-1 mb-1">
            再次点击已选标签可移除
          </div>
          {rootTags.length === 0 ? (
            <div className="text-xs text-[var(--color-text-disabled)] px-2 py-2">
              暂无标签，请先在侧边栏创建
            </div>
          ) : (
            renderTagOptions()
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
<<<<<<< HEAD
          className="fixed z-50 min-w-[160px] rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)] py-1"
=======
          className="fixed z-50 min-w-[160px] rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-page)] py-1 shadow-lg"
>>>>>>> 57eddd3 (Initial commit)
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
<<<<<<< HEAD
=======
          <button
            onClick={() => contextMenu.imageId && handleContextRename(contextMenu.imageId)}
            className="w-full text-left px-4 py-2 text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] flex items-center gap-2"
          >
            <span>✏️</span> 重命名
          </button>
>>>>>>> 57eddd3 (Initial commit)
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
<<<<<<< HEAD
        className={`flex-1 overflow-y-auto px-6 py-6 transition-colors ${isDragOver ? 'bg-[var(--color-accent)]/10' : ''}`}
=======
        className={`flex-1 overflow-y-auto bg-[var(--color-bg-page)] px-6 py-8 transition-colors ${isDragOver ? 'bg-[rgba(91,143,249,0.06)]' : ''}`}
>>>>>>> 57eddd3 (Initial commit)
        onClick={() => {
          if (showTagSelector) {
            setShowTagSelector(null);
          }
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {images.length === 0 ? (
<<<<<<< HEAD
          <div className="h-full flex items-center justify-center">
            <div className="text-center max-w-sm mx-auto px-4 py-12">
              <div className="w-20 h-20 mx-auto mb-6 bg-[var(--color-bg-secondary)] rounded-2xl flex items-center justify-center">
                <span className="text-4xl opacity-50">📷</span>
              </div>
              <p className="text-[var(--color-text-secondary)] text-lg mb-2">
                {selectedTagId === UNTAGGED_TAG_ID ? '暂无未分类图片' : selectedTagId ? '该标签下没有图片' : '暂无图片'}
              </p>
              <p className="text-sm text-[var(--color-text-disabled)]">
=======
          <div className="flex h-full items-center justify-center">
            <div className="flex flex-col items-center gap-1 px-4 text-center">
              <IconCameraEmpty className="h-[90px] w-[90px] text-[#d0d4dc]" />
              <p className="text-base font-bold text-[var(--color-text-secondary)]">
                {selectedTagId === UNTAGGED_TAG_ID ? '暂无未分类图片' : selectedTagId ? '该标签下没有图片' : '暂无图片'}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)]">
>>>>>>> 57eddd3 (Initial commit)
                粘贴图片 (Ctrl/Cmd + V) 或拖拽图片到此处
              </p>
            </div>
          </div>
        ) : viewMode === 'masonry' ? (
          <div className="mx-auto w-full max-w-[1800px]">
            <Masonry
              breakpointCols={breakpointColumns}
              className="flex w-auto -ml-5"
              columnClassName="pl-5 bg-clip-padding"
            >
              {images.map(image => (
                <ImageCard
                  key={image.id}
                  image={image}
<<<<<<< HEAD
                  onDelete={handleDelete}
                  onAddTag={handleAddTag}
=======
>>>>>>> 57eddd3 (Initial commit)
                  onClick={setSelectedImageId}
                  onContextMenu={handleContextMenu}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                />
              ))}
            </Masonry>
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(220px,1fr))]">
            {images.map(image => (
              <GridImageCard
                key={image.id}
                image={image}
<<<<<<< HEAD
                onDelete={handleDelete}
                onAddTag={handleAddTag}
=======
>>>>>>> 57eddd3 (Initial commit)
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
<<<<<<< HEAD
        <div className="absolute inset-0 bg-[var(--color-accent)]/20 border-4 border-dashed border-[var(--color-accent)] rounded-lg flex items-center justify-center z-30 pointer-events-none">
          <div className="text-center">
            <div className="text-5xl mb-2 text-[var(--color-accent)]">📥</div>
            <div className="text-[var(--color-accent)] font-medium">释放以导入图片</div>
=======
        <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center rounded-lg border-2 border-dashed border-[var(--color-accent)] bg-[rgba(91,143,249,0.08)]">
          <div className="text-center">
            <p className="text-sm font-medium text-[var(--color-accent)]">释放以导入图片</p>
>>>>>>> 57eddd3 (Initial commit)
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

      {detailImage && (
        <ImageDetailsModal
          image={detailImage}
          tagNames={detailImageTagNames}
          allTags={flattenedTags}
          activeTagIds={detailImageTagIds}
          onToggleTag={async (tagId) => {
            if (!detailImage) return;
            const active = detailImageTagIds.includes(tagId);
            if (active) {
              await removeImageTagRelation(detailImage.id, tagId);
              pushNotification('已移除图片标签', 'info');
            } else {
              await addImageTagRelation(detailImage.id, tagId);
              pushNotification('已添加图片标签', 'success');
            }
          }}
          onDelete={async () => {
            if (!detailImage) return;
            await handleDelete(detailImage.id);
          }}
          onClose={() => setDetailImageId(null)}
        />
      )}
<<<<<<< HEAD
=======

      {renameImageId && (() => {
        const imageToRename = images.find(img => img.id === renameImageId);
        if (!imageToRename) return null;
        return (
          <RenameModal
            image={imageToRename}
            onRename={async (imageId, newName) => {
              await updateImageName(imageId, newName);
              pushNotification('图片名称已修改', 'success');
            }}
            onClose={() => setRenameImageId(null)}
          />
        );
      })()}
>>>>>>> 57eddd3 (Initial commit)
    </div>
  );
};
