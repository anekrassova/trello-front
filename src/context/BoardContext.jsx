import React, { createContext, useContext, useState, useCallback } from 'react';
import * as boardService from '../services/boardService';
import * as columnService from '../services/columnService';

const BoardContext = createContext();

export const BoardProvider = ({ children }) => {
  const [boards, setBoards] = useState([]);
  const [columnsByBoard, setColumnsByBoard] = useState({});

  const fetchBoards = useCallback(async () => {
    try {
      const response = await boardService.getBoards();
      setBoards(response.data);
    } catch (error) {
      console.error('Ошибка загрузки досок:', error);
    }
  }, []);

  const fetchColumns = useCallback(async (boardId) => {
    try {
      const response = await columnService.getColumns(boardId);
      const columns = response.data;
      setColumnsByBoard((prev) => ({
        ...prev,
        [boardId]: columns || [],
      }));
    } catch (error) {
      console.error('Ошибка загрузки колонок:', error);
    }
  }, []);

  const onCreateBoard = useCallback(async (title) => {
    try {
      const response = await boardService.createBoard(title);
      const newBoard = response.data;
      setBoards((prev) => [...prev, newBoard]);
      return newBoard;
    } catch (error) {
      console.error('Ошибка создания доски:', error);
    }
  }, []);

  const onDeleteBoard = useCallback(async (id) => {
    try {
      await boardService.deleteBoard(id);
      setBoards((prev) => prev.filter((board) => board.id !== id));
    } catch (error) {
      console.error('Ошибка удаления доски:', error);
    }
  }, []);

  const onCreateColumn = useCallback(async (boardId, title) => {
    try {
      const response = await columnService.createColumn(boardId, title);
      const newColumn = response.data;
      setColumnsByBoard((prev) => ({
        ...prev,
        [boardId]: [...(prev[boardId] || []), newColumn],
      }));
    } catch (error) {
      console.error('Ошибка создания колонки:', error);
    }
  }, []);

  const onDeleteColumn = useCallback(async (boardId, columnId) => {
    try {
      await columnService.deleteColumn(columnId);
      setColumnsByBoard((prev) => ({
        ...prev,
        [boardId]: (prev[boardId] || []).filter((col) => col.id !== columnId),
      }));
    } catch (error) {
      console.error('Ошибка удаления колонки:', error);
    }
  }, []);

  const onEditColumn = useCallback(async (columnId, newTitle, boardId) => {
    try {
      const response = await columnService.updateColumn(columnId, newTitle);
      const updated = response.data;
      setColumnsByBoard((prev) => ({
        ...prev,
        [boardId]: (prev[boardId] || []).map((col) =>
          col.id === columnId ? { ...col, title: updated.title } : col
        ),
      }));
    } catch (error) {
      console.error('Ошибка обновления колонки:', error);
    }
  }, []);

  return (
    <BoardContext.Provider
      value={{
        boards,
        columnsByBoard,
        fetchBoards,
        fetchColumns,
        onCreateBoard,
        onDeleteBoard,
        onCreateColumn,
        onDeleteColumn,
        onEditColumn,
      }}
    >
      {children}
    </BoardContext.Provider>
  );
};

export const useBoard = () => useContext(BoardContext);
