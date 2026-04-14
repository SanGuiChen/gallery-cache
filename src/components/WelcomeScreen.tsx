import React from 'react';
import { useAppStore } from '../stores/appStore';

export const WelcomeScreen: React.FC = () => {
  const selectDataPath = useAppStore(state => state.selectDataPath);
  const isInitializing = useAppStore(state => state.isInitializing);
  const initializationError = useAppStore(state => state.initializationError);

  return (
<<<<<<< HEAD
    <div className="relative h-full w-full overflow-hidden bg-[var(--color-bg-primary)]">
      <div className="absolute left-1/2 top-[-120px] h-72 w-72 -translate-x-1/2 rounded-full bg-[var(--color-accent)]/18 blur-3xl" />
      <div className="absolute bottom-[-160px] right-[-80px] h-80 w-80 rounded-full bg-white/6 blur-3xl" />
      <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.14) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.14) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      <div className="relative flex h-full w-full items-center justify-center px-6 py-6 sm:px-8 sm:py-8">
        <div className="w-full max-w-5xl rounded-[36px] border border-[rgba(255,255,255,0.08)] bg-[rgba(36,36,36,0.92)] px-6 py-8 sm:px-10 sm:py-12">
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <div className="mb-5 text-[11px] uppercase tracking-[0.32em] text-[var(--color-text-disabled)]">
              Personal Image Archive
            </div>

            <div className="mb-8 flex h-22 w-22 items-center justify-center rounded-[22px] border border-[rgba(255,255,255,0.16)] bg-[linear-gradient(135deg,#6366f1_0%,#7c83ff_100%)] shadow-[0_20px_60px_rgba(99,102,241,0.28)]">
              <span className="text-4xl">🖼️</span>
            </div>

            <h1 className="mb-3 text-3xl font-semibold text-[var(--color-text-primary)] sm:text-4xl">
              Gallery Cache
            </h1>
            <p className="mb-3 text-base text-[var(--color-text-secondary)] sm:text-lg">
              本地图片管理工具
            </p>
            <p className="mb-10 max-w-xl text-sm leading-7 text-[var(--color-text-disabled)] sm:text-base">
              安全、快速、高效地整理你的图片收藏。先选择一个本地目录，后续所有图片与元数据都会稳定保存在里面。
            </p>

            <div className="mb-10 grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-5 py-5 text-left">
                <div className="mb-3 text-2xl">📂</div>
                <div className="mb-1 text-sm font-medium text-[var(--color-text-primary)]">本地存储</div>
                <div className="text-xs leading-6 text-[var(--color-text-secondary)]">图片与元数据都保存在你指定的目录，迁移和备份都更直接。</div>
              </div>
              <div className="rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-5 py-5 text-left">
                <div className="mb-3 text-2xl">🏷️</div>
                <div className="mb-1 text-sm font-medium text-[var(--color-text-primary)]">标签分类</div>
                <div className="text-xs leading-6 text-[var(--color-text-secondary)]">通过多级标签快速整理灵感图、素材图和截图收藏。</div>
              </div>
              <div className="rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-5 py-5 text-left">
                <div className="mb-3 text-2xl">📋</div>
                <div className="mb-1 text-sm font-medium text-[var(--color-text-primary)]">高效浏览</div>
                <div className="text-xs leading-6 text-[var(--color-text-secondary)]">支持瀑布流和网格视图，方便你快速筛选和回看图片。</div>
              </div>
            </div>

            <div className="flex w-full max-w-xl flex-col items-center gap-4">
              <button
                onClick={selectDataPath}
                disabled={isInitializing}
                className="w-full rounded-2xl bg-[var(--color-accent)] px-8 py-3.5 text-white font-medium transition-all duration-200 hover:bg-[var(--color-accent-hover)] hover:shadow-[0_12px_32px_rgba(99,102,241,0.28)] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isInitializing ? '正在初始化目录...' : '选择图片存储文件夹'}
              </button>

              <div className="text-xs leading-6 text-[var(--color-text-disabled)]">
                建议选择一个专用目录，方便后续迁移、备份和长期整理
              </div>
            </div>

            {initializationError && (
              <p className="mt-4 text-sm text-[var(--color-error)]">
                {initializationError}
              </p>
            )}
          </div>
=======
    <div className="relative h-full w-full overflow-hidden bg-[#f5f6f8]">
      <div className="absolute left-1/2 top-[-120px] h-72 w-72 -translate-x-1/2 rounded-full bg-[var(--color-accent)]/22 blur-3xl" />
      <div className="absolute bottom-[-160px] right-[-80px] h-80 w-80 rounded-full bg-[rgba(74,121,255,0.14)] blur-3xl" />
      <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(rgba(123,145,184,0.22) 1px, transparent 1px), linear-gradient(90deg, rgba(123,145,184,0.22) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      <div className="relative flex h-full w-full items-center justify-center px-6 py-10 sm:px-8 sm:py-14">
        <div className="mx-auto flex w-full max-w-4xl flex-col items-center text-center">
          <div className="mb-10 flex h-24 w-24 items-center justify-center rounded-[24px] border border-[rgba(74,121,255,0.2)] bg-[linear-gradient(135deg,#5f86ff_0%,#7e9cff_100%)] shadow-[0_24px_64px_rgba(74,121,255,0.32)]">
            <span className="text-4xl">🖼️</span>
          </div>

          <h1 className="text-[20px] font-semibold tracking-[0.02em] text-[var(--color-text-primary)]">
            灵感搜集库
          </h1>

          <div className="mt-60 flex w-full max-w-lg flex-col items-center gap-7">
            <button
              onClick={selectDataPath}
              disabled={isInitializing}
              className="w-[300px] rounded-2xl bg-[var(--color-accent)] px-8 py-4.5 text-white font-medium transition-all duration-200 hover:bg-[var(--color-accent-hover)] hover:shadow-[0_12px_32px_rgba(99,102,241,0.28)] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isInitializing ? '正在初始化目录...' : '选择图片存储文件夹'}
            </button>

            <div className="mt-3 text-sm leading-7 text-[var(--color-text-disabled)]">
              建议选择一个专用目录，方便后续迁移、备份和长期整理
            </div>
          </div>

          {initializationError && (
            <p className="mt-8 text-sm text-[var(--color-error)]">
              {initializationError}
            </p>
          )}
>>>>>>> 57eddd3 (Initial commit)
        </div>
      </div>
    </div>
  );
};
