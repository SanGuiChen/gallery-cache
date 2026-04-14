import React, { useState } from 'react';
import { useAppStore } from '../stores/appStore';
import { UNTAGGED_TAG_ID, type Tag } from '../types';
<<<<<<< HEAD
=======
import { IconFolder, IconImage, IconPencil, IconTag } from './icons/DeskIcons';
>>>>>>> 57eddd3 (Initial commit)

interface TagContextMenuState {
  visible: boolean;
  x: number;
  y: number;
  tagId: string | null;
}

interface TagItemProps {
  tag: Tag;
  level: number;
  selectedTagId: string | null;
  editingId: string | null;
  editingName: string;
  newTagParentId: string | null | undefined;
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
<<<<<<< HEAD
  onMove: (id: string, direction: 'up' | 'down') => void;
  onOpenContextMenu: (e: React.MouseEvent, tag: Tag) => void;
=======
  onOpenContextMenu: (e: React.MouseEvent, tag: Tag) => void;
  onReorder: (dragTagId: string, dropTagId: string) => void;
>>>>>>> 57eddd3 (Initial commit)
  dragOverTagId: string | null;
  onDragOver: (tagId: string) => void;
  onDragLeave: (tagId: string) => void;
  onDrop: (tagId: string) => void;
<<<<<<< HEAD
=======
  isDragging: boolean;
  onDragStart: (tagId: string) => void;
  onDragEnd: () => void;
>>>>>>> 57eddd3 (Initial commit)
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
<<<<<<< HEAD
  onMove,
  onOpenContextMenu,
=======
  onOpenContextMenu,
  onReorder,
>>>>>>> 57eddd3 (Initial commit)
  dragOverTagId,
  onDragOver,
  onDragLeave,
  onDrop,
<<<<<<< HEAD
=======
  isDragging,
  onDragStart,
  onDragEnd,
>>>>>>> 57eddd3 (Initial commit)
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
<<<<<<< HEAD
      className={`
          flex items-center gap-1.5 rounded-xl px-3 py-2 cursor-pointer
          transition-all duration-150 group
          ${isDragOver ? 'bg-[var(--color-accent)]/20 ring-1 ring-[var(--color-accent)] ring-inset' : ''}
          ${isSelected ? 'bg-[rgba(99,102,241,0.16)] text-white' : 'hover:bg-[rgba(255,255,255,0.04)]'}
        `}
        style={{ paddingLeft: `${12 + level * 16}px` }}
=======
        className={`
          flex items-center gap-1.5 rounded-lg px-3 py-2 cursor-pointer
          transition-colors duration-150 group
          ${isDragOver ? 'bg-[rgba(91,143,249,0.12)] ring-1 ring-[var(--color-accent)] ring-inset' : ''}
          ${isDragging ? 'opacity-50' : ''}
          ${isSelected ? 'bg-[var(--color-bg-selected)] text-[var(--color-text-primary)]' : 'hover:bg-[#f0f0f0]'}
        `}
        style={{ paddingLeft: `${12 + level * 16}px` }}
        draggable
        onDragStart={(e) => {
          e.dataTransfer.effectAllowed = 'move';
          onDragStart(tag.id);
        }}
        onDragEnd={onDragEnd}
>>>>>>> 57eddd3 (Initial commit)
        onClick={() => onSelect(isSelected ? null : tag.id)}
        onContextMenu={(e) => {
          e.preventDefault();
          if (!isSelected) onSelect(tag.id);
          onOpenContextMenu(e, tag);
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

<<<<<<< HEAD
        {/* Tag icon */}
        <span className="text-xs">
          {level === 0 ? '📁' : '📄'}
        </span>
=======
        <IconFolder className="h-4 w-4 shrink-0 text-[var(--color-text-secondary)]" />
>>>>>>> 57eddd3 (Initial commit)

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
<<<<<<< HEAD
              onMove(tag.id, 'up');
            }}
            className="w-5 h-5 flex items-center justify-center text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] text-[10px]"
            title="上移"
          >
            ↑
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMove(tag.id, 'down');
            }}
            className="w-5 h-5 flex items-center justify-center text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] text-[10px]"
            title="下移"
          >
            ↓
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
=======
>>>>>>> 57eddd3 (Initial commit)
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
<<<<<<< HEAD
              onMove={onMove}
              onOpenContextMenu={onOpenContextMenu}
=======
              onOpenContextMenu={onOpenContextMenu}
              onReorder={onReorder}
>>>>>>> 57eddd3 (Initial commit)
              dragOverTagId={dragOverTagId}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
<<<<<<< HEAD
=======
              isDragging={isDragging}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
>>>>>>> 57eddd3 (Initial commit)
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const Sidebar: React.FC = () => {
  const config = useAppStore(state => state.config);
<<<<<<< HEAD
  const tags = useAppStore(state => state.tags);
  const selectedTagId = useAppStore(state => state.selectedTagId);
  const selectDataPath = useAppStore(state => state.selectDataPath);
=======
  const selectDataPath = useAppStore(state => state.selectDataPath);
  const tags = useAppStore(state => state.tags);
  const selectedTagId = useAppStore(state => state.selectedTagId);
>>>>>>> 57eddd3 (Initial commit)
  const setSelectedTagId = useAppStore(state => state.setSelectedTagId);
  const addTag = useAppStore(state => state.addTag);
  const updateTag = useAppStore(state => state.updateTag);
  const deleteTag = useAppStore(state => state.deleteTag);
<<<<<<< HEAD
  const moveTag = useAppStore(state => state.moveTag);
=======
  const reorderTag = useAppStore(state => state.reorderTag);
>>>>>>> 57eddd3 (Initial commit)
  const addImageTagRelation = useAppStore(state => state.addImageTagRelation);
  const clearImageTagRelations = useAppStore(state => state.clearImageTagRelations);
  const draggingImageId = useAppStore(state => state.draggingImageId);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [newTagParentId, setNewTagParentId] = useState<string | null | undefined>(undefined);
  const [newTagName, setNewTagName] = useState('');
  const [dragOverTagId, setDragOverTagId] = useState<string | null>(null);
<<<<<<< HEAD
=======
  const [draggingTagId, setDraggingTagId] = useState<string | null>(null);
>>>>>>> 57eddd3 (Initial commit)
  const [contextMenu, setContextMenu] = useState<TagContextMenuState>({ visible: false, x: 0, y: 0, tagId: null });

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
      setNewTagParentId(undefined);
    }
  };

  const handleDeleteTag = async (id: string) => {
    setContextMenu({ visible: false, x: 0, y: 0, tagId: null });
    if (confirm('确定要删除这个标签吗？\n\n注意：图片会变为未分类状态，但不会被删除。')) {
      await deleteTag(id);
      if (selectedTagId === id || selectedTagId === null) {
        // Keep selection if deleted root tag with children
      }
    }
  };

  const closeContextMenu = () => {
    setContextMenu({ visible: false, x: 0, y: 0, tagId: null });
  };

  const handleOpenContextMenu = (e: React.MouseEvent, tag: Tag) => {
    const menuX = Math.min(e.clientX, window.innerWidth - 220);
    const menuY = Math.min(e.clientY, window.innerHeight - 220);
    setContextMenu({ visible: true, x: menuX, y: menuY, tagId: tag.id });
  };

<<<<<<< HEAD
  const handleMoveTag = async (id: string, direction: 'up' | 'down') => {
    closeContextMenu();
    await moveTag(id, direction);
=======
  const handleReorder = async (dragTagId: string, dropTagId: string) => {
    if (dragTagId === dropTagId) return;
    await reorderTag(dragTagId, dropTagId);
    setDraggingTagId(null);
    setDragOverTagId(null);
>>>>>>> 57eddd3 (Initial commit)
  };

  const contextTag = contextMenu.tagId ? tags.find(tag => tag.id === contextMenu.tagId) ?? null : null;

  React.useEffect(() => {
    if (!contextMenu.visible) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeContextMenu();
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [contextMenu.visible]);

<<<<<<< HEAD
  // Drag-to-tag handlers
  const handleDragOver = (tagId: string) => {
    setDragOverTagId(tagId);
  };

  const handleDragLeave = (_tagId: string) => {
    setDragOverTagId(null);
=======
  // Drag-to-tag handlers (for image drag and tag reorder)
  const handleDragOver = (tagId: string) => {
    if (draggingImageId || draggingTagId) {
      setDragOverTagId(tagId);
    }
  };

  const handleDragLeave = (_tagId: string) => {
    // Don't clear immediately - let the dragOver of the next element handle it
>>>>>>> 57eddd3 (Initial commit)
  };

  const handleDrop = async (tagId: string) => {
    setDragOverTagId(null);
<<<<<<< HEAD
    if (draggingImageId) {
=======
    if (draggingTagId) {
      await handleReorder(draggingTagId, tagId);
    } else if (draggingImageId) {
>>>>>>> 57eddd3 (Initial commit)
      await addImageTagRelation(draggingImageId, tagId);
    }
  };

  return (
    <div
<<<<<<< HEAD
      className="h-full w-[296px] bg-[rgba(26,28,32,0.92)] flex flex-col border-r border-[rgba(255,255,255,0.06)] backdrop-blur-xl"
      onDragOver={(e) => { if (draggingImageId) { e.preventDefault(); } }}
      onDrop={(e) => { if (draggingImageId) { e.preventDefault(); e.stopPropagation(); } }}
      onClick={() => closeContextMenu()}
    >
      {/* Header */}
      <div className="p-5 border-b border-[rgba(255,255,255,0.06)]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] text-[var(--color-text-secondary)] uppercase tracking-[0.22em] font-medium">
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
          className="font-mono text-xs text-[var(--color-text-secondary)] truncate rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.035)] px-3 py-2.5 shadow-[0_8px_24px_rgba(0,0,0,0.14)]"
          title={config?.dataPath}
        >
          {config?.dataPath || '未设置'}
        </div>
=======
      className="flex h-full w-[296px] shrink-0 flex-col border-r border-[var(--color-border)] bg-[var(--color-bg-sidebar)] pl-6"
      onDragOver={(e) => { if (draggingImageId || draggingTagId) { e.preventDefault(); } }}
      onDrop={(e) => { if (draggingImageId || draggingTagId) { e.preventDefault(); e.stopPropagation(); } }}
      onClick={() => closeContextMenu()}
    >
      <div className="border-b border-[var(--color-border)] p-4">
        <div className="mb-2 flex items-center gap-2">
          <IconFolder className="h-4 w-4 text-[var(--color-text-secondary)]" />
          <span className="text-sm font-medium text-[var(--color-text-primary)]">数据目录</span>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-page)] px-3 py-2.5">
          <span className="min-w-0 flex-1 truncate font-mono text-xs text-[var(--color-text-secondary)]" title={config?.dataPath}>
            {config?.dataPath || '未设置'}
          </span>
          <button
            type="button"
            onClick={() => void selectDataPath()}
            className="shrink-0 rounded p-1 text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-accent)]"
            title="更改存储目录"
          >
            <IconPencil className="h-4 w-4" />
          </button>
        </div>
>>>>>>> 57eddd3 (Initial commit)
      </div>

      {/* Tags Section */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
<<<<<<< HEAD
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] text-[var(--color-text-secondary)] uppercase tracking-[0.22em] font-medium">
              标签分类
            </span>
            <button
=======
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <IconTag className="h-4 w-4 text-[var(--color-text-secondary)]" />
              <span className="text-sm font-medium text-[var(--color-text-primary)]">标签分类</span>
            </div>
            <button
              type="button"
>>>>>>> 57eddd3 (Initial commit)
              onClick={() => {
                setNewTagParentId(null);
                setNewTagName('');
              }}
<<<<<<< HEAD
              className="w-6 h-6 flex items-center justify-center text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] hover:bg-[var(--color-accent)]/10 rounded transition-colors"
              title="添加一级标签"
            >
              +
=======
              className="flex h-7 w-7 items-center justify-center rounded text-[var(--color-accent)] transition-colors hover:bg-[rgba(91,143,249,0.1)]"
              title="添加一级标签"
            >
              <span className="text-lg leading-none">+</span>
>>>>>>> 57eddd3 (Initial commit)
            </button>
          </div>

          {/* All images option */}
          <div
            className={`
<<<<<<< HEAD
              mb-1 flex items-center gap-2 rounded-2xl px-3 py-2.5 cursor-pointer
              transition-all duration-150
              ${selectedTagId === null ? 'bg-[rgba(91,140,255,0.16)] text-white shadow-[0_0_0_1px_rgba(91,140,255,0.16)_inset]' : 'hover:bg-[rgba(255,255,255,0.04)]'}
=======
              mb-1 flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 transition-colors
              ${selectedTagId === null ? 'bg-[var(--color-bg-selected)]' : 'hover:bg-[#f0f0f0]'}
>>>>>>> 57eddd3 (Initial commit)
            `}
            onClick={() => setSelectedTagId(null)}
            onDragOver={(e) => { e.preventDefault(); setDragOverTagId('__all__'); }}
            onDragLeave={() => setDragOverTagId(null)}
            onDrop={(e) => {
              setDragOverTagId(null);
              if (draggingImageId) {
                e.preventDefault();
                void clearImageTagRelations(draggingImageId);
              }
            }}
          >
<<<<<<< HEAD
            <span className="text-sm">🖼️</span>
=======
            <IconImage className="h-4 w-4 text-[var(--color-text-secondary)]" />
>>>>>>> 57eddd3 (Initial commit)
            <span className="text-sm text-[var(--color-text-primary)]">全部图片</span>
          </div>

          <div
            className={`
<<<<<<< HEAD
              mb-2 flex items-center gap-2 rounded-2xl px-3 py-2.5 cursor-pointer
              transition-all duration-150
              ${selectedTagId === UNTAGGED_TAG_ID ? 'bg-[rgba(91,140,255,0.16)] text-white shadow-[0_0_0_1px_rgba(91,140,255,0.16)_inset]' : 'hover:bg-[rgba(255,255,255,0.04)]'}
            `}
            onClick={() => setSelectedTagId(UNTAGGED_TAG_ID)}
          >
            <span className="text-sm">🗂️</span>
=======
              mb-2 flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 transition-colors
              ${selectedTagId === UNTAGGED_TAG_ID ? 'bg-[var(--color-bg-selected)]' : 'hover:bg-[#f0f0f0]'}
            `}
            onClick={() => setSelectedTagId(UNTAGGED_TAG_ID)}
          >
            <IconFolder className="h-4 w-4 text-[var(--color-text-secondary)]" />
>>>>>>> 57eddd3 (Initial commit)
            <span className="text-sm text-[var(--color-text-primary)]">未分类</span>
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
                    setNewTagParentId(undefined);
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
                  setNewTagParentId(undefined);
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
                setNewTagParentId(undefined);
                setNewTagName('');
              }}
              onEditNameChangeForNew={setNewTagName}
<<<<<<< HEAD
              onMove={handleMoveTag}
              onOpenContextMenu={handleOpenContextMenu}
=======
              onOpenContextMenu={handleOpenContextMenu}
              onReorder={handleReorder}
>>>>>>> 57eddd3 (Initial commit)
              dragOverTagId={dragOverTagId}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
<<<<<<< HEAD
=======
              isDragging={draggingTagId === tag.id}
              onDragStart={setDraggingTagId}
              onDragEnd={() => setDraggingTagId(null)}
>>>>>>> 57eddd3 (Initial commit)
            />
          ))}

          {rootTags.length === 0 && newTagParentId === undefined && (
            <div className="text-center py-8 text-[var(--color-text-disabled)] text-sm">
              <div className="text-3xl mb-2">📂</div>
              <div>暂无标签</div>
              <div className="text-xs mt-1">点击上方 + 创建第一个标签</div>
            </div>
          )}
        </div>
      </div>

      {contextTag && contextMenu.visible && (
        <div
<<<<<<< HEAD
          className="fixed z-50 min-w-[180px] rounded-xl border border-[rgba(255,255,255,0.08)] bg-[var(--color-bg-card)] py-1 shadow-xl"
=======
          className="fixed z-50 min-w-[180px] rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-page)] py-1 shadow-lg"
>>>>>>> 57eddd3 (Initial commit)
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => {
              closeContextMenu();
              handleStartEdit(contextTag);
            }}
            className="w-full px-4 py-2 text-left text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)]"
          >
            重命名
          </button>
          <button
            onClick={() => {
              closeContextMenu();
              setNewTagParentId(contextTag.id);
              setNewTagName('');
            }}
            className="w-full px-4 py-2 text-left text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)]"
          >
            添加子标签
          </button>
<<<<<<< HEAD
          <button
            onClick={() => void handleMoveTag(contextTag.id, 'up')}
            className="w-full px-4 py-2 text-left text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)]"
          >
            上移
          </button>
          <button
            onClick={() => void handleMoveTag(contextTag.id, 'down')}
            className="w-full px-4 py-2 text-left text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)]"
          >
            下移
          </button>
=======
>>>>>>> 57eddd3 (Initial commit)
          <div className="my-1 h-px bg-[var(--color-border)]" />
          <button
            onClick={() => void handleDeleteTag(contextTag.id)}
            className="w-full px-4 py-2 text-left text-sm text-[var(--color-error)] hover:bg-[var(--color-bg-secondary)]"
          >
            删除
          </button>
        </div>
      )}

<<<<<<< HEAD
      {/* Footer */}
      <div className="p-4 border-t border-[rgba(255,255,255,0.06)] text-center">
        <span className="text-[10px] text-[var(--color-text-disabled)]">
          Gallery Cache v0.1.0
        </span>
      </div>
=======
>>>>>>> 57eddd3 (Initial commit)
    </div>
  );
};
