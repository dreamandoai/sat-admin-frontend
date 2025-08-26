import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/Card";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { Label } from "../../components/Label";
import { Alert, AlertDescription } from "../../components/Alert";
import { LogIn, AlertCircle, Eye, EyeOff, UserPlus } from "lucide-react";
import { authService } from "../../services/authService";
import type { RootState } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { setCredentials, setLoading } from "../../store/authSlice";
import type { ApiError } from "../../types/api";

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useSelector((state: RootState) => state.auth);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      dispatch(setLoading(true));
      const response = await authService.login({ email, password, role: "admin" });
      dispatch(setCredentials(response));
      navigate('/');
    } catch (error: unknown) {
      dispatch(setLoading(false));
      if (typeof error === 'object' && error !== null && 'message' in error) {
        const apiError = error as ApiError;
        setError(apiError.data.detail);
      } else {
        console.error('Unexpected error:', error);
      }
    }
  };

  useEffect(() => {
    if(isAuthenticated) {
      navigate("/portal");
    }
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="w-full max-w-md bg-card border-border rounded-lg shadow-lg">
        <CardHeader className="bg-secondary/30 rounded-t-lg text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <LogIn className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-h2 font-bold text-foreground">Admin Sign In</CardTitle>
          <p className="text-small text-muted-foreground">Access your admin portal</p>
        </CardHeader>
        <CardContent className="p-6">
          {error && (
            <Alert className="mb-6 border-red-200 bg-red-50 rounded-lg" variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="font-medium text-foreground">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 bg-input-background border-border rounded-lg"
                placeholder="Enter your email address"
                required
              />
            </div>

            <div>
              <Label htmlFor="password" className="font-medium text-foreground">Password</Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-input-background border-border rounded-lg pr-10"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full btn-primary bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium mt-6"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-current border-t-transparent mr-3" />
                  Signing In...
                </>
              ) : (
                <>
                  <LogIn className="h-5 w-5 mr-3" />
                  Sign In
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-small text-muted-foreground">
              Don't have an admin account?
            </p>
            <Button 
              variant="outline" 
              onClick={() => navigate("/register")}
              className="mt-2 bg-transparent border-border hover:bg-secondary/50 text-foreground rounded-lg"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Create Admin Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Login;
