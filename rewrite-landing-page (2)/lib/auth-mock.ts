export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  profile?: {
    experience: string;
    skills: string[];
    location: string;
  };
}

export interface Credentials {
  email: string;
  password: string;
}

// Mock users database
const MOCK_USERS: Record<string, { password: string; user: User }> = {
  "alex.rivera@editorial.market": {
    password: "password123",
    user: {
      id: "user_1",
      name: "Alex Rivera",
      email: "alex.rivera@editorial.market",
      role: "Senior Developer",
      avatar: "AR",
      profile: {
        experience: "Senior Fullstack",
        skills: ["React", "TypeScript", "Node.js"],
        location: "Remote"
      }
    }
  },
  "test@test.com": {
    password: "test123",
    user: {
      id: "user_2",
      name: "Test User",
      email: "test@test.com",
      role: "Developer",
      avatar: "TU",
      profile: {
        experience: "Mid-level",
        skills: ["React", "Vue.js"],
        location: "San Salvador"
      }
    }
  }
};

export async function authenticate(credentials: Credentials): Promise<User | null> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const mockUser = MOCK_USERS[credentials.email];
  
  if (mockUser && mockUser.password === credentials.password) {
    return mockUser.user;
  }
  
  return null;
}

export function getStoredUser(): User | null {
  if (typeof window === 'undefined') return null;
  
  const stored = localStorage.getItem('talentify_user');
  if (!stored) return null;
  
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function saveUser(user: User): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('talentify_user', JSON.stringify(user));
}

export function logout(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('talentify_user');
}
