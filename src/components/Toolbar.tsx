<<<<<<< HEAD
import React, { useState, useRef } from 'react';
import { useAppStore } from '../stores/appStore';
=======
import React from 'react';
import { useAppStore } from '../stores/appStore';
import { IconFolder, IconSearch } from './icons/DeskIcons';
>>>>>>> 57eddd3 (Initial commit)

export const Toolbar: React.FC = () => {
  const searchQuery = useAppStore(state => state.searchQuery);
  const setSearchQuery = useAppStore(state => state.setSearchQuery);
<<<<<<< HEAD
  const downloadImage = useAppStore(state => state.downloadImage);
  const images = useAppStore(state => state.images);
  const viewMode = useAppStore(state => state.viewMode);
  const setViewMode = useAppStore(state => state.setViewMode);
  const sortBy = useAppStore(state => state.sortBy);
  const setSortBy = useAppStore(state => state.setSortBy);
  const pushNotification = useAppStore(state => state.pushNotification);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState({ current: 0, total: 0 });
  const [downloadStatus, setDownloadStatus] = useState<string>('');
  const [downloadErrors, setDownloadErrors] = useState<string[]>([]);
  const overlayRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    const urls = urlInput.split('\n').filter(u => u.trim());
    if (urls.length === 0) return;

    setIsDownloading(true);
    setDownloadProgress({ current: 0, total: urls.length });
    setDownloadStatus('开始下载...');
    setDownloadErrors([]);

    const failures: string[] = [];

    for (let i = 0; i < urls.length; i++) {
      const url = urls[i].trim();
      if (url) {
        setDownloadProgress({ current: i + 1, total: urls.length });
        setDownloadStatus(`正在下载 ${i + 1}/${urls.length}...`);
        try {
          await downloadImage(url);
        } catch (err) {
          console.error('Download failed:', err);
          failures.push(url);
        }
      }
    }

    if (failures.length === 0) {
      setDownloadStatus('下载完成！');
      pushNotification(`成功导入 ${urls.length} 张图片`, 'success');
      setTimeout(() => {
        setShowUrlInput(false);
        setUrlInput('');
        setDownloadStatus('');
        setDownloadErrors([]);
      }, 1000);
    } else {
      setDownloadErrors(failures);
      setDownloadStatus(`完成 ${urls.length - failures.length} 条，失败 ${failures.length} 条`);
      pushNotification(`导入完成，失败 ${failures.length} 条 URL`, 'error');
    }

    setIsDownloading(false);
    setDownloadProgress({ current: 0, total: 0 });
  };

  const handleClickOutside = (e: React.MouseEvent) => {
    if (overlayRef.current && !overlayRef.current.contains(e.target as Node)) {
      if (!isDownloading) {
        setShowUrlInput(false);
        setUrlInput('');
        setDownloadErrors([]);
      }
    }
  };

  return (
    <div className="relative">
      <div className="h-16 border-b border-[rgba(255,255,255,0.06)] bg-[rgba(26,28,32,0.78)] backdrop-blur-xl flex items-center px-6 gap-4">
        <div className="flex-1 max-w-2xl">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] text-sm">
              🔍
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索图片名称..."
              className="w-full rounded-[20px] border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.035)] py-3 pl-11 pr-4 text-sm text-[var(--color-text-primary)] shadow-[0_10px_28px_rgba(0,0,0,0.12)] outline-none transition-colors focus:border-[var(--color-accent)] placeholder:text-[var(--color-text-disabled)]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] text-sm"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowUrlInput(!showUrlInput)}
            disabled={isDownloading}
            className="rounded-[18px] bg-[var(--color-accent)] px-4 py-2.5 text-sm font-medium text-white shadow-[0_12px_30px_rgba(91,140,255,0.3)] transition-colors hover:bg-[var(--color-accent-hover)] disabled:opacity-50 flex items-center gap-2"
          >
            <span>📥</span>
            <span>{showUrlInput ? '取消' : '添加链接'}</span>
          </button>
        </div>

        <div className="flex items-center gap-1 rounded-[18px] border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.035)] p-1">
          <button
            onClick={() => setViewMode('masonry')}
            title="瀑布流视图"
            className={`rounded-xl px-3 py-2 text-sm transition-colors ${
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
            className={`rounded-xl px-3 py-2 text-sm transition-colors ${
              viewMode === 'grid'
                ? 'bg-[var(--color-accent)] text-white'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            ▦
          </button>
        </div>

        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'name' | 'size')}
            className="appearance-none rounded-[18px] border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.035)] px-4 py-2.5 pr-9 text-sm text-[var(--color-text-primary)] outline-none transition-colors hover:border-[var(--color-accent)] focus:border-[var(--color-accent)] cursor-pointer"
          >
            <option value="date">按日期</option>
            <option value="name">按名称</option>
            <option value="size">按大小</option>
          </select>
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] text-xs pointer-events-none">
            ▼
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
          <span className="rounded-[18px] border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.035)] px-3 py-2 text-xs">
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
            className="absolute right-5 top-14 z-50 w-[420px] overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[var(--color-bg-card)] animate-in fade-in slide-in-from-top-2 duration-200"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)]">
              <div>
                <h3 className="text-sm font-medium text-[var(--color-text-primary)]">
                  从 URL / CDN 导入图片
                </h3>
                <p className="text-xs text-[var(--color-text-disabled)] mt-0.5">
                  支持批量导入，每行一个 URL 或 CDN 图片地址
                </p>
              </div>
              <button
                onClick={() => {
                  if (!isDownloading) {
                    setShowUrlInput(false);
                    setDownloadErrors([]);
                  }
                }}
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
                placeholder="https://example.com/image1.jpg&#10;https://cdn.example.com/path/asset?x-oss-process=image/resize,w_1200&#10;//cdn.example.com/image"
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

              {!isDownloading && downloadErrors.length > 0 && (
                <div className="mt-3 rounded-lg border border-[var(--color-error)]/30 bg-[var(--color-error)]/10 p-3">
                  <div className="text-xs font-medium text-[var(--color-error)]">
                    以下 URL 导入失败
                  </div>
                  <div className="mt-2 max-h-24 space-y-1 overflow-y-auto font-mono text-[11px] text-[var(--color-text-secondary)]">
                    {downloadErrors.map((url) => (
                      <div key={url} className="break-all">
                        {url}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-2 mt-3">
                <button
                  onClick={() => {
                    setShowUrlInput(false);
                    setUrlInput('');
                    setDownloadErrors([]);
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
=======
  const importImages = useAppStore(state => state.importImages);

  return (
    <div
      className="flex h-14 shrink-0 items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-bg-page)]"
      style={{ padding: '0 25px' }}
    >
      <div className="w-full max-w-xs">
        <div className="relative">
          <IconSearch className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-disabled]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder=""
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] py-2 pl-9 pr-4 text-sm text-[var(--color-text-primary)] outline-none transition-colors placeholder:text-[var(--color-text-disabled)] focus:border-[var(--color-accent)]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-[15px]">
        <button
          type="button"
          onClick={() => void importImages()}
          className="flex shrink-0 items-center justify-center text-[var(--color-accent)] transition-colors hover:text-[var(--color-accent-hover)]"
          title="本地导入"
        >
          <IconFolder className="h-5 w-5" />
        </button>
      </div>
>>>>>>> 57eddd3 (Initial commit)
    </div>
  );
};
