import React, { useState } from 'react';

interface AIConfigModalProps {
  onClose: () => void;
  onSave: (apiKey: string) => void;
}

export const AIConfigModal: React.FC<AIConfigModalProps> = ({ onClose, onSave }) => {
  const [apiKey, setApiKey] = useState('');

  const handleSave = () => {
    if (apiKey.trim()) {
      onSave(apiKey.trim());
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
          <div>
            <h3 className="text-base font-semibold text-[var(--color-text-primary)]">AI 配置</h3>
            <p className="mt-1 text-xs text-[var(--color-text-secondary)]">输入 MiniMax API Key 以启用图片识别</p>
          </div>
          <button
            className="text-xl text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        <div className="p-5">
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-3 py-2 text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent)]"
            placeholder="请输入 API Key"
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
            保存
          </button>
        </div>
      </div>
    </div>
  );
};