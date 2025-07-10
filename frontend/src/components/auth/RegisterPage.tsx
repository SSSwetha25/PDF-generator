
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Eye, EyeOff, Hexagon } from "lucide-react";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Password validation
    if (formData.password.length < 6) {
      toast({
        title: "Weak Password",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      // API call structure - replace with actual API endpoint
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: "Registration Successful",
          description: "Please login with your credentials",
        });
        navigate("/login");
      } else {
        throw new Error("Registration failed");
      }
    } catch (error) {
      // For demo purposes, simulate successful registration
      console.log("API call would be made to:", formData);
      toast({
        title: "Registration Successful",
        description: "Please login with your credentials",
      });
      navigate("/login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="flex items-center justify-between p-6">
        <div className="flex items-center space-x-2">
          <Hexagon className="h-6 w-6 text-green-400" />
          <span className="text-xl font-bold text-white">levitation</span>
          <span className="text-xs text-gray-400">infotech</span>
        </div>
        <Button 
          asChild
          className="bg-green-400 hover:bg-green-500 text-black font-medium px-6"
        >
          <Link to="/login">Login</Link>
        </Button>
      </header>

      {/* Main Content */}
      <div className="flex items-center justify-center px-4 pb-8">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left side - Register Form */}
          <div className="flex flex-col items-center justify-center">
            <div className="w-full max-w-md space-y-6">
              {/* Logo and Header */}
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <Hexagon className="h-8 w-8 text-green-400" />
                  <span className="text-2xl font-bold text-white">levitation</span>
                  <span className="text-sm text-gray-400">infotech</span>
                </div>
                <h1 className="text-3xl font-bold text-white">Sign up to begin journey</h1>
                <p className="text-gray-400">This is basic signup page which is used for levitation assignment purpose.</p>
              </div>

              {/* Register Form */}
              <div className="space-y-4">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-white">Enter your name</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Enter Email ID"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-400"
                      required
                    />
                    <p className="text-xs text-gray-400">This name will be displayed with your inquiry</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter Email ID"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-400"
                      required
                    />
                    <p className="text-xs text-gray-400">This email will be displayed with your inquiry</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-white">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter the Password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-400 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    <p className="text-xs text-gray-400">Any further updates will be forwarded on this Email ID</p>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-green-400 hover:bg-green-500 text-black font-medium"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating Account..." : "Register"}
                  </Button>
                </form>
              </div>

              {/* Login Link */}
              <div className="text-center">
                <span className="text-gray-400">Already have account? </span>
                <Link to="/login" className="text-green-400 hover:text-green-300">
                  Login here
                </Link>
              </div>
            </div>
          </div>

          {/* Right side - Image/Animation */}
          <div className="flex items-center justify-center">
            <div className="relative w-full max-w-lg">
              <div className="bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-2xl p-8 backdrop-blur-sm border border-slate-700">
                <div className="text-center space-y-4">
                  <div className="w-32 h-32 mx-auto bg-slate-700 rounded-lg flex items-center justify-center">
                    <Hexagon className="h-16 w-16 text-green-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Connecting People</h3>
                  <h3 className="text-2xl font-bold text-green-400">With Technology</h3>
                  <p className="text-gray-400">
                    SOFTWARE DEVELOPMENT | GST | CONSULTANT SERVICES | SETUP SUPPORT | 
                    CORPORATE FINANCE
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
