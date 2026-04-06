import React, { useState, useRef } from 'react';
import { useAppStore } from '../stores/appStore';

export const Toolbar: React.FC = () => {
  const { searchQuery, setSearchQuery, downloadImage, images, viewMode, setViewMode, sortBy, setSortBy } = useAppStore();
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState({ current: 0, total: 0 });
  const [downloadStatus, setDownloadStatus] = useState<string>('');
  const overlayRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    const urls = urlInput.split('\n').filter(u => u.trim());
    if (urls.length === 0) return;

    setIsDownloading(true);
    setDownloadProgress({ current: 0, total: urls.length });
    setDownloadStatus('开始下载...');

    try {
      for (let i = 0; i < urls.length; i++) {
        const url = urls[i].trim();
        if (url) {
          setDownloadProgress({ current: i + 1, total: urls.length });
          setDownloadStatus(`正在下载 ${i + 1}/${urls.length}...`);
          await downloadImage(url);
        }
      }
      setDownloadStatus('下载完成！');
      setTimeout(() => {
        setShowUrlInput(false);
        setUrlInput('');
        setDownloadStatus('');
      }, 1000);
    } catch (err) {
      console.error('Download failed:', err);
      setDownloadStatus('下载失败，请检查 URL');
    } finally {
      setIsDownloading(false);
      setDownloadProgress({ current: 0, total: 0 });
    }
  };

  const handleClickOutside = (e: React.MouseEvent) => {
    if (overlayRef.current && !overlayRef.current.contains(e.target as Node)) {
      if (!isDownloading) {
        setShowUrlInput(false);
        setUrlInput('');
      }
    }
  };

  return (
    <div className="relative">
      <div className="h-12 bg-[var(--color-bg-secondary)] border-b border-[var(--color-border)] flex items-center px-4 gap-4">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] text-sm">
              🔍
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索图片名称..."
              className="w-full bg-[var(--color-bg-card)] text-[var(--color-text-primary)] pl-9 pr-3 py-1.5 rounded-md text-sm border border-[var(--color-border)] focus:border-[var(--color-accent)] outline-none transition-colors placeholder:text-[var(--color-text-disabled)]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] text-sm"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowUrlInput(!showUrlInput)}
            disabled={isDownloading}
            className="px-4 py-1.5 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white rounded-md text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <span>📥</span>
            <span>{showUrlInput ? '取消' : '添加 URL'}</span>
          </button>
        </div>

        {/* View switch */}
        <div className="flex items-center gap-1 bg-[var(--color-bg-card)] rounded-md p-0.5 border border-[var(--color-border)]">
          <button
            onClick={() => setViewMode('masonry')}
            title="瀑布流视图"
            className={`px-2 py-1 rounded text-sm transition-colors ${
              viewMode === 'masonry'
                ? 'bg-[var(--color-accent)] text-white'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            ⊞
          </button>
          <button
            onClick={() => setViewMode('grid')}
            title="网格视图"
            className={`px-2 py-1 rounded text-sm transition-colors ${
              viewMode === 'grid'
                ? 'bg-[var(--color-accent)] text-white'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            ▦
          </button>
        </div>

        {/* Sort dropdown */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'name' | 'size')}
            className="bg-[var(--color-bg-card)] text-[var(--color-text-primary)] text-sm px-3 py-1.5 pr-8 rounded-md border border-[var(--color-border)] focus:border-[var(--color-accent)] outline-none appearance-none cursor-pointer hover:border-[var(--color-accent)] transition-colors"
          >
            <option value="date">按日期</option>
            <option value="name">按名称</option>
            <option value="size">按大小</option>
          </select>
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] text-xs pointer-events-none">
            ▼
          </span>
        </div>

        {/* Status */}
        <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
          <span className="bg-[var(--color-bg-card)] px-2 py-0.5 rounded">
            🖼️ {images.length}
          </span>
        </div>
      </div>

      {/* URL Input Overlay */}
      {showUrlInput && (
        <div
          className="fixed inset-0 z-40"
          onClick={handleClickOutside}
        >
          <div
            ref={overlayRef}
            className="absolute top-12 right-4 w-[420px] bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)]">
              <div>
                <h3 className="text-sm font-medium text-[var(--color-text-primary)]">
                  从 CDN 导入图片
                </h3>
                <p className="text-xs text-[var(--color-text-disabled)] mt-0.5">
                  支持批量导入，每行一个 URL
                </p>
              </div>
              <button
                onClick={() => !isDownloading && setShowUrlInput(false)}
                disabled={isDownloading}
                className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] disabled:opacity-50"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="p-4">
              <textarea
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.png&#10;..."
                disabled={isDownloading}
                className="w-full h-36 bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] px-3 py-2 rounded-lg text-sm border border-[var(--color-border)] focus:border-[var(--color-accent)] outline-none resize-none placeholder:text-[var(--color-text-disabled)] disabled:opacity-50 font-mono"
              />

              {/* Progress */}
              {isDownloading && (
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-[var(--color-text-secondary)]">{downloadStatus}</span>
                    <span className="text-[var(--color-accent)]">
                      {downloadProgress.current} / {downloadProgress.total}
                    </span>
                  </div>
                  <div className="h-1.5 bg-[var(--color-bg-secondary)] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[var(--color-accent)] transition-all duration-300 rounded-full"
                      style={{ width: `${(downloadProgress.current / downloadProgress.total) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-2 mt-3">
                <button
                  onClick={() => {
                    setShowUrlInput(false);
                    setUrlInput('');
                  }}
                  disabled={isDownloading}
                  className="px-4 py-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] disabled:opacity-50 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleDownload}
                  disabled={isDownloading || !urlInput.trim()}
                  className="px-4 py-2 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isDownloading ? (
                    <>
                      <span className="animate-spin">⏳</span>
                      <span>正在导入 {downloadProgress.current}/{downloadProgress.total}...</span>
                    </>
                  ) : (
                    <>
                      <span>⬇️</span>
                      <span>导入 {urlInput.split('\n').filter(u => u.trim()).length} 张</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
