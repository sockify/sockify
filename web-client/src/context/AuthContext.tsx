import { Admin } from "@/api/admins/model";
import { useGetAdminById, useLoginAdminMutation } from "@/api/admins/queries";
import { LOCAL_STORAGE_AUTH_TOKEN_KEY } from "@/shared/constants";
import { decodeJwtToken, isJwtTokenExpired } from "@/shared/utils/jwt";
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
  /** JWT token for the logged in admin. */
  token: string | null;
  /** Details of the currently logged in admin. */
  admin: Admin | null;
  /** True if the JWT token is valid, and is not expired. */
  isAuthenticated: boolean;
  /** Logs in an admin. Throws an error if logging in was unsuccessful. */
  login: (username: string, password: string) => Promise<void>;
  /** Logs out the currently signed in admin. */
  logout: () => void;
  /** True if the admin is currently logging in. */
  isLoggingIn: boolean;
  /** True if the token is being fetched from local storage during initialization. */
  isFetchingToken: boolean;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children?: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const navigate = useNavigate();
  const loginMutation = useLoginAdminMutation();

  const [isFetchingToken, setIsFetchingToken] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [admin, setAdmin] = useState<Admin | null>(null);
  const isAuthenticated = Boolean(token && !isJwtTokenExpired(token));
  const isLoggingIn = loginMutation.isPending;

  const adminId = token ? (decodeJwtToken(token)?.userId ?? 0) : 0;
  const adminQuery = useGetAdminById(adminId, Boolean(token && !admin));

  useEffect(() => {
    const storedToken = localStorage.getItem(LOCAL_STORAGE_AUTH_TOKEN_KEY);

    if (storedToken) {
      if (isJwtTokenExpired(storedToken)) {
        localStorage.removeItem(LOCAL_STORAGE_AUTH_TOKEN_KEY);
      } else {
        setToken(storedToken);
      }
    }
    setIsFetchingToken(false);
  }, []);

  useEffect(() => {
    if (adminQuery.data) {
      setAdmin(adminQuery.data);
    }
  }, [adminQuery.data]);

  useEffect(() => {
    if (adminQuery.isError) {
      toast.error("Unable to fetch admin metadata.");
    }
  }, [adminQuery.isError]);

  const login = async (username: string, password: string) => {
    const { token, admin } = await loginMutation.mutateAsync({
      username,
      password,
    });

    setToken(token);
    localStorage.setItem(LOCAL_STORAGE_AUTH_TOKEN_KEY, token);
    setAdmin(admin);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem(LOCAL_STORAGE_AUTH_TOKEN_KEY);
    setAdmin(null);

    navigate("/admin/login");
    toast.success("Logged out");
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        admin,
        isAuthenticated,
        login,
        logout,
        isLoggingIn,
        isFetchingToken,
      }}
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
