// Local Storage Utility for managing lists and vote data

export interface ListItem {
  id: string;
  title: string;
  playerCount?: string;
  gameType?: string;
}

export interface List {
  id: string;
  title: string;
  description?: string;
  category: string;
  totalCount: number;
  createdBy: string;
  createdAt: string;
  options: ListItem[];
  isPublic: boolean;
}

export interface VoteSession {
  id: string;
  listId: string;
  voteType: "vote" | "bracket";
  participants: string[];
  results?: any;
  createdAt: string;
  completedAt?: string;
}

export interface Friend {
  id: string;
  name: string;
  username: string;
  avatar: string;
}

// Storage Keys
const STORAGE_KEYS = {
  LISTS: 'togethr_lists',
  VOTE_SESSIONS: 'togethr_vote_sessions',
  FRIENDS: 'togethr_friends',
  USER_FAVORITES: 'togethr_favorites',
} as const;

// Generic localStorage helper
class LocalStorageHelper {
  private static isClient = typeof window !== 'undefined';

  static get<T>(key: string, defaultValue: T): T {
    if (!this.isClient) return defaultValue;
    
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading from localStorage (${key}):`, error);
      return defaultValue;
    }
  }

  static set<T>(key: string, value: T): void {
    if (!this.isClient) return;
    
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing to localStorage (${key}):`, error);
    }
  }

  static remove(key: string): void {
    if (!this.isClient) return;
    
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing from localStorage (${key}):`, error);
    }
  }

  static clear(): void {
    if (!this.isClient) return;
    
    try {
      window.localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
}

// List Storage Operations
export class ListStorage {
  // Create
  static createList(list: Omit<List, 'id' | 'createdAt'>): List {
    const lists = this.getAllLists();
    const newList: List = {
      ...list,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    
    lists.push(newList);
    LocalStorageHelper.set(STORAGE_KEYS.LISTS, lists);
    return newList;
  }

  // Read
  static getAllLists(): List[] {
    return LocalStorageHelper.get<List[]>(STORAGE_KEYS.LISTS, []);
  }

  static getListById(id: string): List | null {
    const lists = this.getAllLists();
    return lists.find(list => list.id === id) || null;
  }

  static getListsByCategory(category: string): List[] {
    const lists = this.getAllLists();
    return lists.filter(list => list.category === category);
  }

  static getPublicLists(): List[] {
    const lists = this.getAllLists();
    return lists.filter(list => list.isPublic);
  }

  // Update
  static updateList(id: string, updates: Partial<List>): List | null {
    const lists = this.getAllLists();
    const index = lists.findIndex(list => list.id === id);
    
    if (index === -1) return null;
    
    lists[index] = { ...lists[index], ...updates };
    LocalStorageHelper.set(STORAGE_KEYS.LISTS, lists);
    return lists[index];
  }

  // Delete
  static deleteList(id: string): boolean {
    const lists = this.getAllLists();
    const filteredLists = lists.filter(list => list.id !== id);
    
    if (filteredLists.length === lists.length) return false;
    
    LocalStorageHelper.set(STORAGE_KEYS.LISTS, filteredLists);
    return true;
  }

  // Search
  static searchLists(query: string): List[] {
    const lists = this.getAllLists();
    const lowerQuery = query.toLowerCase();
    
    return lists.filter(list =>
      list.title.toLowerCase().includes(lowerQuery) ||
      list.description?.toLowerCase().includes(lowerQuery)
    );
  }
}

// Vote Session Storage Operations
export class VoteSessionStorage {
  // Create
  static createSession(session: Omit<VoteSession, 'id' | 'createdAt'>): VoteSession {
    const sessions = this.getAllSessions();
    const newSession: VoteSession = {
      ...session,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    
    sessions.push(newSession);
    LocalStorageHelper.set(STORAGE_KEYS.VOTE_SESSIONS, sessions);
    return newSession;
  }

  // Read
  static getAllSessions(): VoteSession[] {
    return LocalStorageHelper.get<VoteSession[]>(STORAGE_KEYS.VOTE_SESSIONS, []);
  }

  static getSessionById(id: string): VoteSession | null {
    const sessions = this.getAllSessions();
    return sessions.find(session => session.id === id) || null;
  }

  static getSessionsByListId(listId: string): VoteSession[] {
    const sessions = this.getAllSessions();
    return sessions.filter(session => session.listId === listId);
  }

  // Update
  static updateSession(id: string, updates: Partial<VoteSession>): VoteSession | null {
    const sessions = this.getAllSessions();
    const index = sessions.findIndex(session => session.id === id);
    
    if (index === -1) return null;
    
    sessions[index] = { ...sessions[index], ...updates };
    LocalStorageHelper.set(STORAGE_KEYS.VOTE_SESSIONS, sessions);
    return sessions[index];
  }

  static completeSession(id: string, results: any): VoteSession | null {
    return this.updateSession(id, {
      results,
      completedAt: new Date().toISOString(),
    });
  }

  // Delete
  static deleteSession(id: string): boolean {
    const sessions = this.getAllSessions();
    const filteredSessions = sessions.filter(session => session.id !== id);
    
    if (filteredSessions.length === sessions.length) return false;
    
    LocalStorageHelper.set(STORAGE_KEYS.VOTE_SESSIONS, filteredSessions);
    return true;
  }
}

// Friends Storage Operations
export class FriendStorage {
  // Create
  static addFriend(friend: Omit<Friend, 'id'>): Friend {
    const friends = this.getAllFriends();
    const newFriend: Friend = {
      ...friend,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    
    friends.push(newFriend);
    LocalStorageHelper.set(STORAGE_KEYS.FRIENDS, friends);
    return newFriend;
  }

  // Read
  static getAllFriends(): Friend[] {
    return LocalStorageHelper.get<Friend[]>(STORAGE_KEYS.FRIENDS, []);
  }

  static getFriendById(id: string): Friend | null {
    const friends = this.getAllFriends();
    return friends.find(friend => friend.id === id) || null;
  }

  // Update
  static updateFriend(id: string, updates: Partial<Friend>): Friend | null {
    const friends = this.getAllFriends();
    const index = friends.findIndex(friend => friend.id === id);
    
    if (index === -1) return null;
    
    friends[index] = { ...friends[index], ...updates };
    LocalStorageHelper.set(STORAGE_KEYS.FRIENDS, friends);
    return friends[index];
  }

  // Delete
  static deleteFriend(id: string): boolean {
    const friends = this.getAllFriends();
    const filteredFriends = friends.filter(friend => friend.id !== id);
    
    if (filteredFriends.length === friends.length) return false;
    
    LocalStorageHelper.set(STORAGE_KEYS.FRIENDS, filteredFriends);
    return true;
  }
}

// Favorites Storage Operations
export class FavoriteStorage {
  // Add to favorites
  static addFavorite(listId: string): void {
    const favorites = this.getAllFavorites();
    if (!favorites.includes(listId)) {
      favorites.push(listId);
      LocalStorageHelper.set(STORAGE_KEYS.USER_FAVORITES, favorites);
    }
  }

  // Remove from favorites
  static removeFavorite(listId: string): void {
    const favorites = this.getAllFavorites();
    const filteredFavorites = favorites.filter(id => id !== listId);
    LocalStorageHelper.set(STORAGE_KEYS.USER_FAVORITES, filteredFavorites);
  }

  // Get all favorites
  static getAllFavorites(): string[] {
    return LocalStorageHelper.get<string[]>(STORAGE_KEYS.USER_FAVORITES, []);
  }

  // Check if favorite
  static isFavorite(listId: string): boolean {
    const favorites = this.getAllFavorites();
    return favorites.includes(listId);
  }

  // Toggle favorite
  static toggleFavorite(listId: string): boolean {
    const isFav = this.isFavorite(listId);
    if (isFav) {
      this.removeFavorite(listId);
      return false;
    } else {
      this.addFavorite(listId);
      return true;
    }
  }
}

// Initialize with mock data if empty
export function initializeMockData(): void {
  const lists = ListStorage.getAllLists();
  
  if (lists.length === 0) {
    // Add mock lists
    const mockLists = [
      {
        title: "Tek Bilgisayarda Oynanan Oyunlar",
        description: "En iyi lokal multiplayer oyunlar",
        category: "game",
        totalCount: 4,
        createdBy: "@must",
        isPublic: true,
        options: [
          { id: "1", title: "Bopl Battle", playerCount: "2-4 kişi", gameType: "Arena / Party Game" },
          { id: "2", title: "Stick Fight: The Game", playerCount: "2-4 kişi", gameType: "Arena / Party Game" },
          { id: "3", title: "Ultimate Chicken Horse", playerCount: "2-4 kişi", gameType: "Arena / Party Game" },
          { id: "4", title: "Tricky Towers", playerCount: "2-4 kişi", gameType: "Arena / Party Game" },
        ],
      },
      {
        title: "Evde oynanacak oyunlar",
        description: "Evde arkadaşlarla oynanacak en iyi oyunlar",
        category: "game",
        totalCount: 4,
        createdBy: "@user",
        isPublic: true,
        options: [
          { id: "1", title: "Among Us", playerCount: "4-10 kişi", gameType: "Social Deduction" },
          { id: "2", title: "Gang Beasts", playerCount: "2-4 kişi", gameType: "Party Game" },
          { id: "3", title: "Overcooked 2", playerCount: "1-4 kişi", gameType: "Co-op" },
          { id: "4", title: "Mario Kart 8", playerCount: "1-4 kişi", gameType: "Racing" },
        ],
      },
      {
        title: "Hafta sonu aktivite fikirleri",
        description: "Hafta sonları yapılabilecek aktiviteler",
        category: "activity",
        totalCount: 4,
        createdBy: "@admin",
        isPublic: true,
        options: [
          { id: "1", title: "Piknik yapmak", playerCount: "2+ kişi", gameType: "Outdoor" },
          { id: "2", title: "Sinema", playerCount: "1+ kişi", gameType: "Entertainment" },
          { id: "3", title: "Kafe gezme", playerCount: "2+ kişi", gameType: "Social" },
          { id: "4", title: "Müze ziyareti", playerCount: "1+ kişi", gameType: "Culture" },
        ],
      },
      {
        title: "Korku filmi önerileri",
        description: "En iyi korku filmleri",
        category: "movie",
        totalCount: 4,
        createdBy: "@cinema",
        isPublic: true,
        options: [
          { id: "1", title: "The Conjuring", gameType: "Horror / Supernatural" },
          { id: "2", title: "Hereditary", gameType: "Horror / Drama" },
          { id: "3", title: "A Quiet Place", gameType: "Horror / Thriller" },
          { id: "4", title: "Get Out", gameType: "Horror / Thriller" },
        ],
      },
    ];

    mockLists.forEach(list => ListStorage.createList(list));
  }

  // Add mock friends if empty
  const friends = FriendStorage.getAllFriends();
  if (friends.length === 0) {
    const mockFriends = [
      { name: "Ahmet Yılmaz", username: "@ahmet", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmet" },
      { name: "Ayşe Demir", username: "@ayse", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ayse" },
      { name: "Mehmet Kaya", username: "@mehmet", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mehmet" },
      { name: "Zeynep Şahin", username: "@zeynep", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Zeynep" },
    ];

    mockFriends.forEach(friend => FriendStorage.addFriend(friend));
  }
}
