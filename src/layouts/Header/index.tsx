import React, { useCallback } from "react";
import { Button } from "../../components/Button";
import { LogOut } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store";
import { authService } from "../../services/authService";
import { logout } from "../../store/authSlice";

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = useCallback(() => {
    authService.logout();
    dispatch(logout());
  }, [dispatch]);

  return (
    <div className="mb-12 flex items-center justify-between">
      <div>
        <h1 className="text-foreground">Admin Portal</h1>
        <p className="text-foreground mt-2">
          Welcome, {user?.first_name} {user?.last_name}
        </p>
      </div>
      <Button 
        onClick={handleLogout}
        variant="outline"
        className="bg-card border-border hover:bg-secondary/50 text-foreground rounded-lg"
      >
        <LogOut className="h-4 w-4 mr-2" />
        Sign Out
      </Button>
    </div>
  )
}

export default Header;
