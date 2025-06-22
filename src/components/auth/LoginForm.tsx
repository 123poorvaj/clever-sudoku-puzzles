
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Phone, Mail } from 'lucide-react';

const loginSchema = z.object({
  identifier: z.string().min(1, 'Email or phone number is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onToggleMode: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onToggleMode }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginMode, setLoginMode] = useState<'email' | 'phone'>('email');
  const { login } = useAuth();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      // For now, we'll treat phone numbers as email format for Firebase Auth
      // In a real app, you'd implement phone authentication
      const identifier = loginMode === 'phone' 
        ? `${data.identifier}@phone.auth` 
        : data.identifier;
      
      await login(identifier, data.password);
      toast({
        title: "Welcome!",
        description: "You have successfully logged in.",
      });
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="bg-white border-none shadow-2xl rounded-3xl overflow-hidden">
        <CardHeader className="text-center pb-4 pt-8">
          <div className="w-16 h-16 mx-auto mb-6">
            <img 
              src="/lovable-uploads/d3fd23ab-0e1e-41ff-b624-faeef78325aa.png" 
              alt="Sudoku Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800 mb-2">Welcome!</CardTitle>
          <CardDescription className="text-gray-500 text-sm">
            Sign in to continue your Sudoku journey
          </CardDescription>
        </CardHeader>
        
        <CardContent className="px-8 pb-8">
          <div className="flex mb-4 bg-gray-100 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setLoginMode('email')}
              className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                loginMode === 'email' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Mail className="w-4 h-4 mr-2" />
              Email
            </button>
            <button
              type="button"
              onClick={() => setLoginMode('phone')}
              className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                loginMode === 'phone' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Phone className="w-4 h-4 mr-2" />
              Phone
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="identifier" className="text-gray-700 text-sm font-medium">
                {loginMode === 'email' ? 'Email' : 'Phone Number'}
              </Label>
              <Input
                id="identifier"
                type={loginMode === 'email' ? 'email' : 'tel'}
                placeholder={loginMode === 'email' ? 'Enter your email' : 'Enter your phone number'}
                className="h-12 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-gray-50"
                {...register('identifier')}
              />
              {errors.identifier && (
                <p className="text-red-500 text-xs">{errors.identifier.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 text-sm font-medium">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter Password"
                  className="h-12 pr-10 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-gray-50"
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300 text-base"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Don't have an account?{' '}
              <button
                onClick={onToggleMode}
                className="text-blue-600 hover:text-blue-800 font-semibold"
              >
                Sign up
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
