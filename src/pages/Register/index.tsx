import { useState } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/Card";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { Label } from "../../components/Label";
import { Alert, AlertDescription } from "../../components/Alert";
import { UserPlus, Eye, EyeOff, AlertCircle } from "lucide-react";
import type { RegisterCredentials, RegisterResponse } from "../../types/auth";
import { authService } from "../../services/authService";
import type { ApiError } from "../../types/api";

interface FormData {
  name: string
  surname: string
  email: string
  password: string
  retypePassword: string
}

interface FormErrors {
  name?: string
  surname?: string
  email?: string
  password?: string
  retypePassword?: string
}

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    surname: '',
    email: '',
    password: '',
    retypePassword: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRetypePassword, setShowRetypePassword] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    }

    // Surname validation
    if (!formData.surname.trim()) {
      newErrors.surname = 'Surname is required'
    } else if (formData.surname.trim().length < 2) {
      newErrors.surname = 'Surname must be at least 2 characters'
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required'
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    }

    // Retype password validation
    if (!formData.retypePassword) {
      newErrors.retypePassword = 'Please retype your password'
    } else if (formData.password !== formData.retypePassword) {
      newErrors.retypePassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof FormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (validateForm()) {
      try {
        const response: RegisterResponse = await authService.register({ 
          first_name: formData.name, 
          last_name: formData.surname,
          email: formData.email,
          password: formData.password,
          role: "admin"
        } as RegisterCredentials);
        if(response.status === "success") {
          navigate('/login');
        }
      } catch (error) {
        setIsLoading(false);
        if (typeof error === 'object' && error !== null && 'message' in error) {
          const apiError = error as ApiError;
          setError(apiError.data.detail);
        } else {
          console.error('Login failed:', error);
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="w-full max-w-md bg-card border-border rounded-lg shadow-lg">
        <CardHeader className="bg-secondary/30 rounded-t-lg text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <UserPlus className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-h2 font-bold text-foreground">Admin Registration</CardTitle>
          <p className="text-small text-muted-foreground">Create your admin account</p>
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
              <Label htmlFor="name" className="font-medium text-foreground">Name</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`mt-1 bg-input-background rounded-lg ${errors.name ? 'border-red-500' : 'border-border'}`}
                placeholder="Enter your first name"
                required
              />
              {errors.name && (
                <p className="text-red-500 text-small">{errors.name}</p>
              )}
            </div>
            <div>
              <Label htmlFor="surname" className="font-medium text-foreground">Surname</Label>
              <Input
                id="surname"
                type="text"
                value={formData.surname}
                onChange={(e) => handleInputChange('surname', e.target.value)}
                className={`mt-1 bg-input-background rounded-lg ${
                  errors.surname ? 'border-red-500' : 'border-border'
                }`}
                placeholder="Enter your last name"
                required
              />
              {errors.surname && (
                <p className="text-red-500 text-small">{errors.surname}</p>
              )}
            </div>
            <div>
              <Label htmlFor="email" className="font-medium text-foreground">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`mt-1 bg-input-background rounded-lg ${
                  errors.email ? 'border-red-500' : 'border-border'
                }`}
                placeholder="Enter your email address"
                required
              />
              {errors.email && (
                <p className="text-red-500 text-small">{errors.email}</p>
              )}
            </div>
            <div>
              <Label htmlFor="password" className="font-medium text-foreground">Password</Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`bg-input-background rounded-lg pr-10 ${errors.password ? 'border-red-500' : 'border-border'}`}
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
              {errors.password && (
                <p className="text-red-500 text-small">{errors.password}</p>
              )}
            </div>
            <div>
              <Label htmlFor="confirmPassword" className="font-medium text-foreground">Confirm Password</Label>
              <div className="relative mt-1">
                <Input
                  id="confirmPassword"
                  type={showRetypePassword ? 'text' : 'password'}
                  value={formData.retypePassword}
                  onChange={(e) => handleInputChange('retypePassword', e.target.value)}
                  className={`bg-input-background rounded-lg pr-10 ${
                    errors.retypePassword ? 'border-red-500' : 'border-border'
                  }`}
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowRetypePassword(!showRetypePassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showRetypePassword ? (
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
                  Creating Account...
                </>
              ) : (
                <>
                  <UserPlus className="h-5 w-5 mr-3" />
                  Create Admin Account
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default Register;
