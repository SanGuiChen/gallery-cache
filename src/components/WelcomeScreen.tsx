import React from 'react';
import { useAppStore } from '../stores/appStore';

export const WelcomeScreen: React.FC = () => {
  const selectDataPath = useAppStore(state => state.selectDataPath);

  return (
    <div className="h-full w-full flex items-center justify-center bg-[var(--color-bg-primary)]">
      <div className="text-center max-w-md mx-auto px-8 py-16">
        {/* Logo */}
        <div className="w-20 h-20 mx-auto mb-8 bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-hover)] rounded-2xl flex items-center justify-center shadow-lg shadow-[var(--color-accent)]/20">
          <span className="text-4xl">🖼️</span>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-semibold mb-3 text-[var(--color-text-primary)]">
          Gallery Cache
        </h1>
        <p className="text-[var(--color-text-secondary)] mb-2">
          本地图片管理工具
        </p>
        <p className="text-[var(--color-text-disabled)] mb-8 text-sm">
          安全、快速、高效地管理您的图片收藏
        </p>

        {/* Features */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="p-3 bg-[var(--color-bg-secondary)] rounded-xl">
            <div className="text-xl mb-1">📂</div>
            <div className="text-xs text-[var(--color-text-secondary)]">本地存储</div>
          </div>
          <div className="p-3 bg-[var(--color-bg-secondary)] rounded-xl">
            <div className="text-xl mb-1">🏷️</div>
            <div className="text-xs text-[var(--color-text-secondary)]">标签分类</div>
          </div>
          <div className="p-3 bg-[var(--color-bg-secondary)] rounded-xl">
            <div className="text-xl mb-1">📋</div>
            <div className="text-xs text-[var(--color-text-secondary)]">瀑布流展示</div>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={selectDataPath}
          className="px-6 py-3 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white rounded-xl font-medium transition-all duration-200 shadow-lg shadow-[var(--color-accent)]/30 hover:shadow-[var(--color-accent)]/40 hover:scale-105"
        >
          选择图片存储文件夹
        </button>

        <p className="mt-6 text-xs text-[var(--color-text-disabled)]">
          所有图片将保存在您选择的数据目录中
        </p>
      </div>
    </div>
  );
};
