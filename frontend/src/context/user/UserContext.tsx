import axios, { AxiosError } from "axios";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import toast, { Toaster } from "react-hot-toast";

const server = import.meta.env.VITE_API_BASE_URL;

export interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  playlist: string[];
}

interface UserContextType {
  user: User | null;
  isAuth: boolean;
  loading: boolean;
  btnloading: boolean;
  registerUser: (
    username: string,
    email: string,
    password: string,
    navigate: (path: string) => void
  ) => Promise<void>;
  loginUser: (
    email: string,
    password: string,
    navigate: (path: string) => void
  ) => Promise<void>;
  addToPlaylist: (id: string) => void;
  logoutUser: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  async function registerUser(
    username: string,
    email: string,
    password: string,
    navigate: (path: string) => void
  ) {
    setBtnLoading(true);
    try {
      const { data } = await axios.post(`${server}/api/users/user/register`, {
        username,
        email,
        password,
      });
      toast.success(data.message);
      localStorage.setItem("token", data.token as string);
      setUser(data.user as User);
      setIsAuth(true);
      navigate("/");
    } catch (error: unknown) {
      const err = error as AxiosError<{ message?: string }>;
      toast.error(err.response?.data?.message ?? "Registration failed");
    } finally {
      setBtnLoading(false);
    }
  }

  async function loginUser(
    email: string,
    password: string,
    navigate: (path: string) => void
  ) {
    setBtnLoading(true);
    try {
      const { data } = await axios.post(`${server}/api/users/user/login`, {
        email,
        password,
      });
      toast.success(data.message);
      localStorage.setItem("token", data.token as string);
      setUser(data.user as User);
      setIsAuth(true);
      navigate("/");
    } catch (error: unknown) {
      const err = error as AxiosError<{ message?: string }>;
      toast.error(err.response?.data?.message ?? "Login failed");
    } finally {
      setBtnLoading(false);
    }
  }

  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const { data } = await axios.get<User>(`${server}/api/users/user/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(data);
      setIsAuth(true);
    } catch {
      // Token invalid or expired — clear it silently
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  }, []);

  function logoutUser() {
    localStorage.removeItem("token");
    setUser(null);
    setIsAuth(false);
    toast.success("Logged out");
  }

  async function addToPlaylist(id: string) {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in first");
      return;
    }
    try {
      const { data } = await axios.post(
        `${server}/api/users/song/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(data.message);
      fetchUser();
    } catch (error: unknown) {
      const err = error as AxiosError<{ message?: string }>;
      toast.error(err.response?.data?.message ?? "Failed to update playlist");
    }
  }

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <UserContext.Provider
      value={{
        user,
        isAuth,
        loading,
        btnloading: btnLoading,
        loginUser,
        registerUser,
        logoutUser,
        addToPlaylist,
      }}
    >
      {children}
      <Toaster />
    </UserContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useUserData = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserData must be used within a UserProvider");
  }
  return context;
};
