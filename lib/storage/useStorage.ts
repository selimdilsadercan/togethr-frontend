import { useState, useEffect, useCallback } from 'react';
import {
  ListStorage,
  VoteSessionStorage,
  FriendStorage,
  FavoriteStorage,
  initializeMockData,
  type List,
  type VoteSession,
  type Friend,
} from './localStorage';

// Hook for managing lists
export function useLists() {
  const [lists, setLists] = useState<List[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshLists = useCallback(() => {
    const allLists = ListStorage.getAllLists();
    setLists(allLists);
  }, []);

  useEffect(() => {
    // Initialize mock data on first load
    initializeMockData();
    refreshLists();
    setLoading(false);
  }, [refreshLists]);

  const createList = useCallback((list: Omit<List, 'id' | 'createdAt'>) => {
    const newList = ListStorage.createList(list);
    refreshLists();
    return newList;
  }, [refreshLists]);

  const updateList = useCallback((id: string, updates: Partial<List>) => {
    const updated = ListStorage.updateList(id, updates);
    refreshLists();
    return updated;
  }, [refreshLists]);

  const deleteList = useCallback((id: string) => {
    const success = ListStorage.deleteList(id);
    if (success) refreshLists();
    return success;
  }, [refreshLists]);

  const getListById = useCallback((id: string) => {
    return ListStorage.getListById(id);
  }, []);

  const searchLists = useCallback((query: string) => {
    return ListStorage.searchLists(query);
  }, []);

  const getPublicLists = useCallback(() => {
    return ListStorage.getPublicLists();
  }, []);

  return {
    lists,
    loading,
    createList,
    updateList,
    deleteList,
    getListById,
    searchLists,
    getPublicLists,
    refreshLists,
  };
}

// Hook for managing vote sessions
export function useVoteSessions() {
  const [sessions, setSessions] = useState<VoteSession[]>([]);

  const refreshSessions = useCallback(() => {
    const allSessions = VoteSessionStorage.getAllSessions();
    setSessions(allSessions);
  }, []);

  useEffect(() => {
    refreshSessions();
  }, [refreshSessions]);

  const createSession = useCallback((session: Omit<VoteSession, 'id' | 'createdAt'>) => {
    const newSession = VoteSessionStorage.createSession(session);
    refreshSessions();
    return newSession;
  }, [refreshSessions]);

  const updateSession = useCallback((id: string, updates: Partial<VoteSession>) => {
    const updated = VoteSessionStorage.updateSession(id, updates);
    refreshSessions();
    return updated;
  }, [refreshSessions]);

  const completeSession = useCallback((id: string, results: any) => {
    const completed = VoteSessionStorage.completeSession(id, results);
    refreshSessions();
    return completed;
  }, [refreshSessions]);

  const deleteSession = useCallback((id: string) => {
    const success = VoteSessionStorage.deleteSession(id);
    if (success) refreshSessions();
    return success;
  }, [refreshSessions]);

  const getSessionsByListId = useCallback((listId: string) => {
    return VoteSessionStorage.getSessionsByListId(listId);
  }, []);

  return {
    sessions,
    createSession,
    updateSession,
    completeSession,
    deleteSession,
    getSessionsByListId,
    refreshSessions,
  };
}

// Hook for managing friends
export function useFriends() {
  const [friends, setFriends] = useState<Friend[]>([]);

  const refreshFriends = useCallback(() => {
    const allFriends = FriendStorage.getAllFriends();
    setFriends(allFriends);
  }, []);

  useEffect(() => {
    initializeMockData();
    refreshFriends();
  }, [refreshFriends]);

  const addFriend = useCallback((friend: Omit<Friend, 'id'>) => {
    const newFriend = FriendStorage.addFriend(friend);
    refreshFriends();
    return newFriend;
  }, [refreshFriends]);

  const updateFriend = useCallback((id: string, updates: Partial<Friend>) => {
    const updated = FriendStorage.updateFriend(id, updates);
    refreshFriends();
    return updated;
  }, [refreshFriends]);

  const deleteFriend = useCallback((id: string) => {
    const success = FriendStorage.deleteFriend(id);
    if (success) refreshFriends();
    return success;
  }, [refreshFriends]);

  const getFriendById = useCallback((id: string) => {
    return FriendStorage.getFriendById(id);
  }, []);

  return {
    friends,
    addFriend,
    updateFriend,
    deleteFriend,
    getFriendById,
    refreshFriends,
  };
}

// Hook for managing favorites
export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  const refreshFavorites = useCallback(() => {
    const allFavorites = FavoriteStorage.getAllFavorites();
    setFavorites(allFavorites);
  }, []);

  useEffect(() => {
    refreshFavorites();
  }, [refreshFavorites]);

  const addFavorite = useCallback((listId: string) => {
    FavoriteStorage.addFavorite(listId);
    refreshFavorites();
  }, [refreshFavorites]);

  const removeFavorite = useCallback((listId: string) => {
    FavoriteStorage.removeFavorite(listId);
    refreshFavorites();
  }, [refreshFavorites]);

  const toggleFavorite = useCallback((listId: string) => {
    const isFav = FavoriteStorage.toggleFavorite(listId);
    refreshFavorites();
    return isFav;
  }, [refreshFavorites]);

  const isFavorite = useCallback((listId: string) => {
    return FavoriteStorage.isFavorite(listId);
  }, []);

  return {
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    refreshFavorites,
  };
}

// Combined hook for everything
export function useStorage() {
  const lists = useLists();
  const sessions = useVoteSessions();
  const friends = useFriends();
  const favorites = useFavorites();

  return {
    lists,
    sessions,
    friends,
    favorites,
  };
}
