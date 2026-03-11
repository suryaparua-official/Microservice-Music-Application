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
  logoutUser: () => Promise<void>;
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
      localStorage.setItem("token", data.token);
      setUser(data.user);
      setIsAuth(true);
      setBtnLoading(false);
      navigate("/");
    } catch (error: unknown) {
      const err = error as AxiosError<{ message?: string }>;
      toast.error(err.response?.data?.message || "An error occured");
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
      localStorage.setItem("token", data.token);
      setUser(data.user);
      setIsAuth(true);
      setBtnLoading(false);
      navigate("/");
    } catch (error: unknown) {
      const err = error as AxiosError<{ message?: string }>;
      toast.error(err.response?.data?.message || "An error occured");
      setBtnLoading(false);
    }
  }

  const fetchUser = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      const { data } = await axios.get<User>(`${server}/api/users/user/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(data);
      setIsAuth(true);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  async function logoutUser() {
    localStorage.clear();
    setUser(null);
    setIsAuth(false);

    toast.success("User Logged Out!");
  }

  async function addToPlaylist(id: string) {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login first");
        return;
      }

      const { data } = await axios.post(
        `${server}/api/users/song/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(data.message);
      fetchUser();
    } catch (error: unknown) {
      const err = error as AxiosError<{ message?: string }>;
      toast.error(err.response?.data?.message || "An error occured");
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
