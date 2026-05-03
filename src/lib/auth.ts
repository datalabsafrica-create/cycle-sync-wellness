import { LifeStage, CycleType } from './cycleData';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  day: number;
  location: string;
  isPcos: boolean;
  lifeStage?: LifeStage;
  isVegan?: boolean;
  cycleType?: CycleType;
  pregnancyWeek?: number;
}

const USERS_KEY = 'cycle_sync_users';
const CURRENT_USER_KEY = 'cycle_sync_current_user_id';

export function getUsers(): Record<string, UserProfile> {
  const data = localStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : {};
}

export function saveUsers(users: Record<string, UserProfile>) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getCurrentUser(): UserProfile | null {
  const id = localStorage.getItem(CURRENT_USER_KEY);
  if (!id) return null;
  const users = getUsers();
  return users[id] || null;
}

export function saveCurrentUser(id: string | null) {
  if (id) {
    localStorage.setItem(CURRENT_USER_KEY, id);
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
}

export function updateUserProfile(profile: Partial<UserProfile>) {
  const current = getCurrentUser();
  if (!current) return;
  const updated = { ...current, ...profile };
  const users = getUsers();
  users[updated.id] = updated;
  saveUsers(users);
}
