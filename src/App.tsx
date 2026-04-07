import { useEffect } from 'react';
import { useAppStore } from './stores/appStore';
import { WelcomeScreen } from './components/WelcomeScreen';
import { Sidebar } from './components/Sidebar';
import { Toolbar } from './components/Toolbar';
import { ImageGrid } from './components/ImageGrid';
import { UNTAGGED_TAG_ID } from './types';
import { readImage, readText } from '@tauri-apps/plugin-clipboard-manager';

const REMOTE_URL_PATTERN = /(?:https?:)?\/\/[^\s<>"')]+/gi;

function normalizeRemoteUrl(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  const normalized = trimmed.startsWith('//') ? `https:${trimmed}` : trimmed;

  try {
    const url = new URL(normalized);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return null;
    }
    return url.toString();
  } catch {
    return null;
  }
}

function extractRemoteUrls(value: string): string[] {
  const matches = value.match(REMOTE_URL_PATTERN) ?? [];
  const uniqueUrls = new Set<string>();

  for (const match of matches) {
    const normalized = normalizeRemoteUrl(match);
    if (normalized) {
      uniqueUrls.add(normalized);
    }
  }

  return [...uniqueUrls];
}

async function clipboardImageToDataUrl(): Promise<string | null> {
  try {
    const image = await readImage();
    const [{ width, height }, rgba] = await Promise.all([image.size(), image.rgba()]);
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    if (!context) return null;

    const imageData = new ImageData(new Uint8ClampedArray(rgba), width, height);
    context.putImageData(imageData, 0, 0);
    return canvas.toDataURL('image/png');
  } catch {
    return null;
  }
}

function App() {
  const isInitialized = useAppStore(state => state.isInitialized);
  const isInitializing = useAppStore(state => state.isInitializing);
  const initialize = useAppStore(state => state.initialize);
  const saveImageFromFile = useAppStore(state => state.saveImageFromFile);
  const saveImageFromBase64 = useAppStore(state => state.saveImageFromBase64);
  const downloadImage = useAppStore(state => state.downloadImage);
  const config = useAppStore(state => state.config);
  const images = useAppStore(state => state.images);
  const selectedTagId = useAppStore(state => state.selectedTagId);
  const tags = useAppStore(state => state.tags);
  const viewMode = useAppStore(state => state.viewMode);
  const notifications = useAppStore(state => state.notifications);
  const dismissNotification = useAppStore(state => state.dismissNotification);
  const pushNotification = useAppStore(state => state.pushNotification);
  const getFilteredImages = useAppStore(state => state.getFilteredImages);
  const filteredImages = getFilteredImages();

  useEffect(() => {
    initialize();
  }, [initialize]);

  // Handle paste events
  useEffect(() => {
    const handlePaste = async (e: ClipboardEvent) => {
      if (!config) return;
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target instanceof HTMLInputElement ||
          target instanceof HTMLTextAreaElement ||
          target instanceof HTMLSelectElement ||
          target.isContentEditable)
      ) {
        return;
      }

      const items = e.clipboardData?.items;
      if (items) {
        for (const item of items) {
          if (item.type.startsWith('image/')) {
            e.preventDefault();
            const file = item.getAsFile();
            if (file) {
              try {
                await saveImageFromFile(file, 'paste');
                pushNotification('已从剪贴板导入图片', 'success');
              } catch (error) {
                console.error('Paste image import failed:', error);
                pushNotification('粘贴图片失败', 'error');
              }
            }
            return;
          }
        }
      }

      const pastedText = e.clipboardData?.getData('text/plain')?.trim() || '';
      const clipboardText = pastedText || (await readText().catch(() => ''));
      const urls = extractRemoteUrls(clipboardText);

      if (urls.length > 0) {
        e.preventDefault();
        const failures: string[] = [];
        for (const url of urls) {
          try {
            await downloadImage(url);
          } catch (error) {
            console.error('Paste URL import failed:', error);
            failures.push(url);
          }
        }

        if (failures.length === 0) {
          pushNotification(`已通过粘贴导入 ${urls.length} 张 URL 图片`, 'success');
        } else {
          pushNotification(`URL 粘贴导入完成，失败 ${failures.length} 条`, 'error');
        }
        return;
      }

      const fallbackImage = await clipboardImageToDataUrl();
      if (fallbackImage) {
        e.preventDefault();
        try {
          await saveImageFromBase64(fallbackImage, 'paste');
          pushNotification('已从剪贴板导入图片', 'success');
        } catch (error) {
          console.error('Clipboard image fallback failed:', error);
          pushNotification('粘贴图片失败', 'error');
        }
      }
    };

    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [config, downloadImage, pushNotification, saveImageFromBase64, saveImageFromFile]);

  if (isInitializing && !isInitialized) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-[var(--color-bg-primary)]">
        <div className="text-center">
          <div className="w-10 h-10 mx-auto mb-4 rounded-full border-2 border-[var(--color-border)] border-t-[var(--color-accent)] animate-spin" />
          <p className="text-sm text-[var(--color-text-secondary)]">正在加载 Gallery Cache...</p>
        </div>
      </div>
    );
  }

  if (!isInitialized) {
    return <WelcomeScreen />;
  }

  return (
    <div className="relative h-full w-full overflow-hidden bg-[var(--color-bg-primary)]">
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,rgba(255,255,255,0.045),transparent)]" />
        <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-[rgba(91,140,255,0.08)] blur-3xl" />
      </div>

      <div className="relative z-10 flex h-full w-full flex-col">
      <div className="h-[52px] border-b border-[rgba(255,255,255,0.06)] bg-[rgba(26,28,32,0.88)] backdrop-blur-xl flex items-center px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-[rgba(91,140,255,0.16)] text-sm text-[var(--color-accent)] shadow-[0_0_0_1px_rgba(91,140,255,0.2)_inset]">
            ◧
          </div>
          <div>
            <span className="block text-[15px] font-semibold tracking-[0.01em] text-[var(--color-text-primary)]">
              Gallery Cache
            </span>
            <span className="block text-[10px] uppercase tracking-[0.28em] text-[var(--color-text-disabled)]">
              Visual board
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Toolbar />
          <ImageGrid />
        </div>
      </div>

      <div className="h-10 border-t border-[rgba(255,255,255,0.06)] bg-[rgba(26,28,32,0.88)] backdrop-blur-xl flex items-center px-5 text-[11px] text-[var(--color-text-secondary)]">
        <span>总计 {images.length} 张</span>
        <span className="mx-2">|</span>
        <span>当前结果 {filteredImages.length} 张</span>
        <span className="mx-2">|</span>
        <span>
          {selectedTagId
            ? `当前标签: ${selectedTagId === UNTAGGED_TAG_ID ? '未分类' : tags.find(t => t.id === selectedTagId)?.name || '未知'}`
            : '全部图片'}
        </span>
        <span className="mx-2">|</span>
        <span>{viewMode === 'masonry' ? '瀑布流视图' : '网格视图'}</span>
        <span className="mx-2">|</span>
        <span className="truncate text-[var(--color-text-disabled)]">{config?.dataPath}</span>
        <span className="flex-1" />
        <span>Gallery Cache v0.1.0</span>
      </div>
      </div>

      {notifications.length > 0 && (
        <div className="pointer-events-none fixed right-5 top-16 z-[60] flex w-80 flex-col gap-2">
          {notifications.map((notification) => (
            <button
              key={notification.id}
              className={`pointer-events-auto rounded-2xl border px-4 py-3 text-left shadow-[0_14px_40px_rgba(0,0,0,0.28)] backdrop-blur-xl transition ${
                notification.type === 'success'
                  ? 'border-emerald-500/30 bg-emerald-500/18 text-emerald-100'
                  : notification.type === 'error'
                    ? 'border-red-500/30 bg-red-500/18 text-red-100'
                    : 'border-[var(--color-border)] bg-[rgba(35,38,43,0.92)] text-[var(--color-text-primary)]'
              }`}
              onClick={() => dismissNotification(notification.id)}
            >
              <div className="text-sm">{notification.message}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
