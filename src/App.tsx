import { useEffect } from 'react';
import { useAppStore } from './stores/appStore';
import { WelcomeScreen } from './components/WelcomeScreen';
import { Sidebar } from './components/Sidebar';
import { Toolbar } from './components/Toolbar';
import { ImageGrid } from './components/ImageGrid';

function App() {
  const { isInitialized, initialize, saveImageFromBase64, config, images, selectedTagId, tags } = useAppStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  // Handle paste events
  useEffect(() => {
    const handlePaste = async (e: ClipboardEvent) => {
      if (!config) return;

      const items = e.clipboardData?.items;
      if (!items) return;

      for (const item of items) {
        if (item.type.startsWith('image/')) {
          e.preventDefault();
          const file = item.getAsFile();
          if (file) {
            const reader = new FileReader();
            reader.onload = async (event) => {
              const base64 = event.target?.result as string;
              if (base64) {
                await saveImageFromBase64(base64, 'paste');
              }
            };
            reader.readAsDataURL(file);
          }
          break;
        }
      }
    };

    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [config, saveImageFromBase64]);

  if (!isInitialized) {
    return <WelcomeScreen />;
  }

  return (
    <div className="h-full w-full flex flex-col bg-[var(--color-bg-primary)]">
      {/* Title bar area - for consistency */}
      <div className="h-10 bg-[var(--color-bg-secondary)] border-b border-[var(--color-border)] flex items-center px-4">
        <span className="text-sm font-medium text-[var(--color-text-primary)]">
          Gallery Cache
        </span>
      </div>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Main area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Toolbar />
          <ImageGrid />
        </div>
      </div>

      {/* Status bar */}
      <div className="h-8 bg-[var(--color-bg-secondary)] border-t border-[var(--color-border)] flex items-center px-4 text-xs text-[var(--color-text-secondary)]">
        <span>{images.length} 张图片</span>
        <span className="mx-2">|</span>
        <span>
          {selectedTagId
            ? `当前标签: ${tags.find(t => t.id === selectedTagId)?.name || '未知'}`
            : '全部图片'}
        </span>
        <span className="mx-2">|</span>
        <span className="truncate">{config?.dataPath}</span>
        <span className="flex-1" />
        <span>Gallery Cache v0.1.0</span>
      </div>
    </div>
  );
}

export default App;
