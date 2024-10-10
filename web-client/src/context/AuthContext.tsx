import { useAdminLoginMutation } from "@/api/admins/queries";
import { LOCAL_STORAGE_AUTH_TOKEN_KEY } from "@/shared/constants";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import toast from "react-hot-toast";

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  isLoading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const isAuthenticated = Boolean(token);

  const loginMutation = useAdminLoginMutation();
  const isLoading = loginMutation.isPending;

  useEffect(() => {
    const storedToken = localStorage.getItem(LOCAL_STORAGE_AUTH_TOKEN_KEY);
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const login = async (username: string, password: string) => {
    const { token } = await loginMutation.mutateAsync({ username, password });

    setToken(token);
    localStorage.setItem(LOCAL_STORAGE_AUTH_TOKEN_KEY, token);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem(LOCAL_STORAGE_AUTH_TOKEN_KEY);
    toast.success("Logged out.");
  };

  return (
    <AuthContext.Provider
      value={{ token, isAuthenticated, login, isLoading, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
