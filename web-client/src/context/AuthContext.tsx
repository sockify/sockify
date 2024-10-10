import { useAdminLoginMutation } from "@/api/admins/queries";
import { LOCAL_STORAGE_AUTH_TOKEN_KEY } from "@/shared/constants";
import { isJwtTokenExpired } from "@/shared/utils/jwt";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const loginMutation = useAdminLoginMutation();

  const [token, setToken] = useState<string | null>(null);
  const isAuthenticated = Boolean(token && !isJwtTokenExpired(token));
  const isLoading = loginMutation.isPending;

  useEffect(() => {
    const storedToken = localStorage.getItem(LOCAL_STORAGE_AUTH_TOKEN_KEY);

    if (storedToken) {
      if (isJwtTokenExpired(storedToken)) {
        localStorage.removeItem(LOCAL_STORAGE_AUTH_TOKEN_KEY);
      } else {
        setToken(storedToken);
      }
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

    navigate("/admin/login");
    toast.success("Logged out.");
  };

  return (
    <AuthContext.Provider
      value={{ token, isAuthenticated, login, logout, isLoading }}
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
