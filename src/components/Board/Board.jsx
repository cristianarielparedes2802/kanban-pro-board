import React from 'react'
import { DndContext, DragOverlay } from '@dnd-kit/core'
import { useTaskContext } from '../../context/TaskContext'
import { useKanban } from '../../hooks/useKanban'
import BoardColumn from './Board.Column'
import BoardCard from './Board.Card'
import Modal from '../ui/Modal'
import TaskForm from '../ui/TaskForm'

/**
 * Board — Compound root component.
 * Owns the DnD context and delegates logic to useKanban.
 *
 * Usage:
 *   <Board />
 *
 * Compound access (for custom layouts):
 *   <Board.Column column={col} ... />
 *   <Board.Card taskId={id} ... />
 */
function Board() {
  const { columns } = useTaskContext()

  const {
    sensors,
    collisionDetection,
    activeTask,
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
    modal,
    openAdd,
    openEdit,
    closeModal,
    handleSubmit,
    deleteTask,
  } = useKanban()

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={collisionDetection}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        {/* ── Columns layout ── */}
        <div className="flex gap-5 overflow-x-auto pb-8 px-6 pt-2 min-h-0 flex-1 snap-x snap-mandatory md:snap-none scroll-smooth">
          {columns.map((column) => (
            <BoardColumn
              key={column.id}
              column={column}
              onAddTask={openAdd}
              onEditTask={openEdit}
              onDeleteTask={deleteTask}
            />
          ))}
        </div>

        {/* ── Drag overlay (ghost card while dragging) ── */}
        <DragOverlay dropAnimation={null}>
          {activeTask ? (
            <div
              className="
                rotate-1 scale-105 w-72 pointer-events-none
                bg-zinc-800 border border-amber-500/40 rounded-xl p-4
                shadow-2xl shadow-black/70 ring-1 ring-amber-500/20
              "
            >
              <p className="text-sm font-medium text-zinc-100 leading-snug">
                {activeTask.title}
              </p>
              {activeTask.description && (
                <p className="mt-1.5 text-xs text-zinc-500 line-clamp-1">
                  {activeTask.description}
                </p>
              )}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* ── Create / Edit modal ── */}
      <Modal
        open={modal.open}
        onClose={closeModal}
        title={modal.mode === 'add' ? 'New task' : 'Edit task'}
      >
        <TaskForm
          task={modal.task}
          onSubmit={handleSubmit}
          onCancel={closeModal}
        />
      </Modal>
    </>
  )
}

// ── Compound components ────────────────────────────────────────────────────────
Board.Column = BoardColumn
Board.Card   = BoardCard

export default Board
