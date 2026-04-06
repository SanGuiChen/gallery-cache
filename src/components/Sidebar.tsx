import React, { useState } from 'react';
import { useAppStore } from '../stores/appStore';
import type { Tag } from '../types';

interface TagItemProps {
  tag: Tag;
  level: number;
  selectedTagId: string | null;
  editingId: string | null;
  editingName: string;
  newTagParentId: string | null;
  newTagName: string;
  getChildTags: (parentId: string) => Tag[];
  onSelect: (id: string | null) => void;
  onStartEdit: (tag: Tag) => void;
  onSaveEdit: () => void;
  onEditNameChange: (name: string) => void;
  onDelete: (id: string) => void;
  onAddChild: (parentId: string) => void;
  onAddTag: (parentId: string | null) => void;
  onCancelAdd: () => void;
  onEditNameChangeForNew: (name: string) => void;
  dragOverTagId: string | null;
  onDragOver: (tagId: string) => void;
  onDragLeave: (tagId: string) => void;
  onDrop: (tagId: string) => void;
}

const TagItem: React.FC<TagItemProps> = ({
  tag,
  level,
  selectedTagId,
  editingId,
  editingName,
  newTagParentId,
  newTagName,
  getChildTags,
  onSelect,
  onStartEdit,
  onSaveEdit,
  onEditNameChange,
  onDelete,
  onAddChild,
  onAddTag,
  onCancelAdd,
  onEditNameChangeForNew,
  dragOverTagId,
  onDragOver,
  onDragLeave,
  onDrop,
}) => {
  const [expanded, setExpanded] = useState(true);
  const children = getChildTags(tag.id);
  const isSelected = selectedTagId === tag.id;
  const isEditing = editingId === tag.id;
  const isAddingChild = newTagParentId === tag.id;
  const isDragOver = dragOverTagId === tag.id;

  return (
    <div className="select-none">
      <div
        className={`
          flex items-center gap-1.5 px-3 py-2 cursor-pointer
          transition-all duration-150 group
          ${isDragOver ? 'bg-[var(--color-accent)]/20 ring-1 ring-[var(--color-accent)] ring-inset' : ''}
          ${isSelected ? 'bg-[#2a2a2a] border-l-[3px] border-[var(--color-accent)]' : 'border-l-[3px] border-transparent hover:bg-[#2a2a2a]'}
        `}
        style={{ paddingLeft: `${12 + level * 16}px` }}
        onClick={() => onSelect(isSelected ? null : tag.id)}
        onContextMenu={(e) => {
          e.preventDefault();
          if (!isSelected) onSelect(tag.id);
        }}
        onDragOver={(e) => { e.preventDefault(); onDragOver(tag.id); }}
        onDragLeave={(e) => { e.preventDefault(); onDragLeave(tag.id); }}
        onDrop={(e) => { e.preventDefault(); onDrop(tag.id); }}
      >
        {/* Expand/Collapse */}
        {children.length > 0 ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
            className="w-4 h-4 flex items-center justify-center text-[10px] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-transform duration-200"
            style={{ transform: expanded ? 'rotate(0deg)' : 'rotate(-90deg)' }}
          >
            ▼
          </button>
        ) : (
          <span className="w-4" />
        )}

        {/* Tag icon */}
        <span className="text-xs">
          {level === 0 ? '📁' : '📄'}
        </span>

        {/* Tag name */}
        {isEditing ? (
          <input
            type="text"
            value={editingName}
            onChange={(e) => onEditNameChange(e.target.value)}
            onBlur={onSaveEdit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onSaveEdit();
              if (e.key === 'Escape') onSaveEdit();
            }}
            className="flex-1 bg-[var(--color-bg-card)] text-[var(--color-text-primary)] px-2 py-0.5 rounded text-sm outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
            autoFocus
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span
            className="flex-1 text-sm truncate text-[var(--color-text-primary)]"
            onDoubleClick={(e) => {
              e.stopPropagation();
              onStartEdit(tag);
            }}
          >
            {tag.name}
          </span>
        )}

        {/* Action buttons */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddChild(tag.id);
            }}
            className="w-5 h-5 flex items-center justify-center text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] text-xs"
            title="添加子标签"
          >
            +
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(tag.id);
            }}
            className="w-5 h-5 flex items-center justify-center text-[var(--color-text-secondary)] hover:text-[var(--color-error)] text-xs"
            title="删除标签"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Add child input */}
      {isAddingChild && (
        <div
          className="flex gap-1 px-3 py-1.5 animate-in slide-in-from-top-1 duration-150"
          style={{ paddingLeft: `${28 + level * 16}px` }}
        >
          <input
            type="text"
            value={newTagName}
            onChange={(e) => onEditNameChangeForNew(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onAddTag(tag.id);
              if (e.key === 'Escape') onCancelAdd();
            }}
            placeholder="子标签名..."
            className="flex-1 bg-[var(--color-bg-card)] text-[var(--color-text-primary)] px-2 py-1 rounded text-sm outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
            autoFocus
          />
          <button
            onClick={() => onAddTag(tag.id)}
            className="px-2 py-1 text-[var(--color-accent)] hover:bg-[var(--color-accent)]/10 rounded text-sm"
          >
            ✓
          </button>
          <button
            onClick={onCancelAdd}
            className="px-2 py-1 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] rounded text-sm"
          >
            ✕
          </button>
        </div>
      )}

      {/* Children */}
      {children.length > 0 && (
        <div
          className={`overflow-hidden transition-all duration-200 ${expanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
        >
          {children.map(child => (
            <TagItem
              key={child.id}
              tag={child}
              level={level + 1}
              selectedTagId={selectedTagId}
              editingId={editingId}
              editingName={editingName}
              newTagParentId={newTagParentId}
              newTagName={newTagName}
              getChildTags={getChildTags}
              onSelect={onSelect}
              onStartEdit={onStartEdit}
              onSaveEdit={onSaveEdit}
              onEditNameChange={onEditNameChange}
              onDelete={onDelete}
              onAddChild={onAddChild}
              onAddTag={onAddTag}
              onCancelAdd={onCancelAdd}
              onEditNameChangeForNew={onEditNameChangeForNew}
              dragOverTagId={dragOverTagId}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const Sidebar: React.FC = () => {
  const {
    config,
    tags,
    selectedTagId,
    selectDataPath,
    setSelectedTagId,
    addTag,
    updateTag,
    deleteTag,
    addImageTagRelation,
    draggingImageId,
  } = useAppStore();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [newTagParentId, setNewTagParentId] = useState<string | null>(null);
  const [newTagName, setNewTagName] = useState('');
  const [dragOverTagId, setDragOverTagId] = useState<string | null>(null);

  const rootTags = tags.filter(t => t.parentId === null).sort((a, b) => a.order - b.order);
  const getChildTags = (parentId: string) =>
    tags.filter(t => t.parentId === parentId).sort((a, b) => a.order - b.order);

  const handleStartEdit = (tag: Tag) => {
    setEditingId(tag.id);
    setEditingName(tag.name);
  };

  const handleSaveEdit = async () => {
    if (editingId && editingName.trim()) {
      await updateTag(editingId, editingName.trim());
    }
    setEditingId(null);
    setEditingName('');
  };

  const handleAddTag = async (parentId: string | null) => {
    if (newTagName.trim()) {
      await addTag(newTagName.trim(), parentId);
      setNewTagName('');
      setNewTagParentId(null);
    }
  };

  const handleDeleteTag = async (id: string) => {
    if (confirm('确定要删除这个标签吗？\n\n注意：图片会变为未分类状态，但不会被删除。')) {
      await deleteTag(id);
      if (selectedTagId === id || selectedTagId === null) {
        // Keep selection if deleted root tag with children
      }
    }
  };

  // Drag-to-tag handlers
  const handleDragOver = (tagId: string) => {
    setDragOverTagId(tagId);
  };

  const handleDragLeave = (_tagId: string) => {
    setDragOverTagId(null);
  };

  const handleDrop = async (tagId: string) => {
    setDragOverTagId(null);
    if (draggingImageId) {
      await addImageTagRelation(draggingImageId, tagId);
    }
  };

  return (
    <div
      className="h-full w-[280px] bg-[var(--color-bg-secondary)] flex flex-col border-r border-[var(--color-border)]"
      onDragOver={(e) => { if (draggingImageId) { e.preventDefault(); } }}
      onDrop={(e) => { if (draggingImageId) { e.preventDefault(); e.stopPropagation(); } }}
    >
      {/* Header */}
      <div className="p-4 border-b border-[var(--color-border)]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-[var(--color-text-secondary)] uppercase tracking-wider font-medium">
            数据目录
          </span>
          <button
            onClick={selectDataPath}
            className="text-xs text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] transition-colors"
          >
            更改
          </button>
        </div>
        <div
          className="font-mono text-xs text-[var(--color-text-secondary)] truncate bg-[var(--color-bg-card)] px-2 py-1.5 rounded"
          title={config?.dataPath}
        >
          {config?.dataPath || '未设置'}
        </div>
      </div>

      {/* Tags Section */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-[var(--color-text-secondary)] uppercase tracking-wider font-medium">
              标签分类
            </span>
            <button
              onClick={() => setNewTagParentId(null)}
              className="w-6 h-6 flex items-center justify-center text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] hover:bg-[var(--color-accent)]/10 rounded transition-colors"
              title="添加一级标签"
            >
              +
            </button>
          </div>

          {/* All images option */}
          <div
            className={`
              flex items-center gap-2 px-3 py-2 cursor-pointer mb-1 rounded-md
              transition-all duration-150
              ${selectedTagId === null ? 'bg-[#2a2a2a] border-l-[3px] border-[var(--color-accent)]' : 'border-l-[3px] border-transparent hover:bg-[#2a2a2a]'}
            `}
            onClick={() => setSelectedTagId(null)}
            onDragOver={(e) => { e.preventDefault(); setDragOverTagId('__all__'); }}
            onDragLeave={() => setDragOverTagId(null)}
            onDrop={(e) => {
              setDragOverTagId(null);
              if (draggingImageId) {
                e.preventDefault();
              }
            }}
          >
            <span className="text-sm">🖼️</span>
            <span className="text-sm text-[var(--color-text-primary)]">全部图片</span>
          </div>

          {/* Add root tag input */}
          {newTagParentId === null && (
            <div className="flex gap-1 px-3 py-1.5 mb-2 animate-in slide-in-from-top-1 duration-150">
              <input
                type="text"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddTag(null);
                  if (e.key === 'Escape') {
                    setNewTagParentId(null);
                    setNewTagName('');
                  }
                }}
                placeholder="新标签..."
                className="flex-1 bg-[var(--color-bg-card)] text-[var(--color-text-primary)] px-2 py-1 rounded text-sm outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
                autoFocus
              />
              <button
                onClick={() => handleAddTag(null)}
                className="px-2 py-1 text-[var(--color-accent)] hover:bg-[var(--color-accent)]/10 rounded text-sm"
              >
                ✓
              </button>
              <button
                onClick={() => {
                  setNewTagParentId(null);
                  setNewTagName('');
                }}
                className="px-2 py-1 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] rounded text-sm"
              >
                ✕
              </button>
            </div>
          )}

          {/* Tag tree */}
          {rootTags.map(tag => (
            <TagItem
              key={tag.id}
              tag={tag}
              level={0}
              selectedTagId={selectedTagId}
              editingId={editingId}
              editingName={editingName}
              newTagParentId={newTagParentId}
              newTagName={newTagName}
              getChildTags={getChildTags}
              onSelect={setSelectedTagId}
              onStartEdit={handleStartEdit}
              onSaveEdit={handleSaveEdit}
              onEditNameChange={setEditingName}
              onDelete={handleDeleteTag}
              onAddChild={setNewTagParentId}
              onAddTag={handleAddTag}
              onCancelAdd={() => {
                setNewTagParentId(null);
                setNewTagName('');
              }}
              onEditNameChangeForNew={setNewTagName}
              dragOverTagId={dragOverTagId}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            />
          ))}

          {rootTags.length === 0 && newTagParentId === null && (
            <div className="text-center py-8 text-[var(--color-text-disabled)] text-sm">
              <div className="text-3xl mb-2">📂</div>
              <div>暂无标签</div>
              <div className="text-xs mt-1">点击上方 + 创建第一个标签</div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-[var(--color-border)] text-center">
        <span className="text-[10px] text-[var(--color-text-disabled)]">
          Gallery Cache v0.1.0
        </span>
      </div>
    </div>
  );
};
