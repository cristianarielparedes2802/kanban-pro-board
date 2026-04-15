# React Professional Kanban Board

A high-performance project management dashboard built to demonstrate mastery of **React 19** advanced patterns, rendering optimization, and data persistence.

This is a personal project developed to showcase my ability to implement scalable architectures and frontend software engineering best practices.

## Key Features

- **Task Management:** Full Kanban workflow across four columns — *To Do*, *In Progress*, *In Review*, and *Done*.
- **Drag & Drop:** Intuitive cross-column card movement powered by `@dnd-kit`, with pointer-based collision detection for accurate drops.
- **Component Architecture:** Implementation of the **Compound Components** pattern (`Board → Board.Column → Board.Card`) for a modular and highly reusable structure.
- **Optimized Performance:** Strategic use of `useMemo`, `useCallback`, and `React.memo` to prevent unnecessary re-renders in data-heavy scenarios.
- **Advanced Filters:** Dynamic filtering by label, priority (Alta / Media / Baja), and text search — all without performance degradation.
- **Local Persistence:** Automatic synchronization with `localStorage` via the custom `useLocalStorage` hook, including cross-tab sync.
- **Mock Authentication:** Simulated auth system with protected routes using `React Router v7`.
- **UI/UX:** Dark/Light Mode with CSS custom properties, smooth theme transitions, and a responsive layout.

## Tech Stack

| Layer | Technology |
|---|---|
| Core | React 19 |
| Routing | React Router v7 |
| Drag & Drop | @dnd-kit/core + @dnd-kit/sortable |
| Styling | Tailwind CSS v4 (Utility-First) |
| Global State | Context API |
| Testing | React Testing Library + Vitest |

## Technical Concepts Applied

To demonstrate a deep understanding of the React ecosystem, the following concepts were implemented:

- **Design Patterns:** *Compound Components* (`Board.Column`, `Board.Card`) to decouple business logic from visual structure, exposing a clean composition API.
- **Performance Optimization:**
  - `useMemo` for derived state — filtered tasks and `tasksByColumn` index built once per state change.
  - `useCallback` to stabilize event handlers, DnD callbacks, and task mutation functions.
  - `React.memo` on `Board.Card` and `Board.Column` to prevent cascading updates during drag operations.
- **Custom Hooks:**
  - `useLocalStorage` — generic persistence with JSON serialization and cross-tab synchronization via `StorageEvent`.
  - `useKanban` — encapsulates all DnD logic (sensors, collision detection, drag handlers) and modal state, keeping `Board.jsx` lean.
- **Context API:** `AuthContext` and `TaskContext` are split by responsibility. `TaskContext` exposes a pre-computed `tasksByColumn` map for O(1) column lookups during render.
- **Clean Code:** Domain-based folder structure (`/components`, `/context`, `/hooks`, `/views`, `/types`) with strict adherence to *Separation of Concerns*.

## Project Structure

```
/src
  /components
    /Board       → Board.jsx · Board.Column.jsx · Board.Card.jsx
    /ui          → Badge · Button · Modal · TaskForm
  /context       → TaskContext.jsx  (AuthContext + TaskContext)
  /hooks         → useLocalStorage.js · useKanban.js
  /views         → Login.jsx · BoardView.jsx
  /types         → index.js  (JSDoc typedefs + seed data)
  /__tests__     → useLocalStorage.test.js · TaskContext.test.jsx
```

## Installation and Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/kanban-pro-board.git
   cd kanban-pro-board
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Run the test suite:**
   ```bash
   npm test
   ```

> **Demo credentials:** The authentication is simulated — any non-empty email and password will grant access.

## Developer Notes

This dashboard was built focusing on both developer efficiency and end-user performance. The decision to use the Context API instead of an external state management library was intentional: it proves that complex, derived state can be handled effectively with native React tools when the context is properly split by responsibility and memoized correctly.

The DnD implementation uses `pointerWithin` as the primary collision detection strategy (instead of `closestCorners`), which resolves the common issue of cards jumping to adjacent columns when dropped near column borders.

---

Developed by **Cristian Ariel Paredes**
