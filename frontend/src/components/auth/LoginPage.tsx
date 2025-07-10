
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Eye, EyeOff, Hexagon } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

interface LoginPageProps {
  setIsAuthenticated: (auth: boolean) => void;
}

const LoginPage = ({ setIsAuthenticated }: LoginPageProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      // API call structure - replace with actual API endpoint
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("userEmail", email);
        setIsAuthenticated(true);
        toast({
          title: "Login Successful",
          description: "Welcome back!",
        });
        navigate("/add-products");
      } else {
        throw new Error("Login failed");
      }
    } catch (error) {
      // For demo purposes, simulate successful login
      console.log("API call would be made to:", { email, password });
      localStorage.setItem("authToken", "demo-token");
      localStorage.setItem("userEmail", email);
      setIsAuthenticated(true);
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
      navigate("/add-products");
    } finally {
      setIsLoading(false);
    }
  };

  const carouselImages = [
    {
      src: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=800&h=600&fit=crop",
      alt: "Woman using laptop"
    },
    {
      src: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&h=600&fit=crop",
      alt: "Modern laptop setup"
    }
  ];

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
          <Link to="/register">Connecting People With Technology</Link>
        </Button>
      </header>

      {/* Main Content */}
      <div className="flex items-center justify-center px-4 pb-8">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left side - Auto-scrolling Image Carousel */}
          <div className="flex items-center justify-center">
            <div className="relative w-96 h-[500px]">
              <Carousel
                plugins={[
                  Autoplay({
                    delay: 3000,
                  })
                ]}
                className="w-full h-full"
                opts={{
                  align: "start",
                  loop: true,
                }}
              >
                <CarouselContent className="h-full">
                  {carouselImages.map((image, index) => (
                    <CarouselItem key={index} className="h-full">
                      <div className="relative h-full">
                        <img
                          src={image.src}
                          alt={image.alt}
                          className="w-full h-full object-cover rounded-2xl"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent rounded-2xl" />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
              
              {/* Text overlay */}
              <div className="absolute bottom-8 left-8 right-8 text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-slate-700/80 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <Hexagon className="h-8 w-8 text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Connecting People</h3>
                <h3 className="text-xl font-bold text-green-400">with Technology</h3>
                <p className="text-gray-300 text-xs">
                  SOFTWARE DEVELOPMENT | GST | CONSULTANT SERVICES | SETUP SUPPORT | 
                  CORPORATE FINANCE
                </p>
              </div>
            </div>
          </div>

          {/* Right side - Login Form */}
          <div className="flex flex-col items-center justify-center">
            <div className="w-full max-w-md space-y-6">
              {/* Logo and Header */}
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <Hexagon className="h-8 w-8 text-green-400" />
                  <span className="text-2xl font-bold text-white">levitation</span>
                  <span className="text-sm text-gray-400">infotech</span>
                </div>
                <h1 className="text-3xl font-bold text-white">Let the Journey begin!</h1>
                <p className="text-gray-400">This is basic login page which is used for levitation assignment purpose.</p>
              </div>

              {/* Login Form */}
              <div className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter Email ID"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-400"
                      required
                    />
                    <p className="text-xs text-gray-400">This email will be displayed with your inquiry</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-white">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter the Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-green-400 hover:bg-green-500 text-black font-medium"
                    disabled={isLoading}
                  >
                    {isLoading ? "Logging in..." : "Login now"}
                  </Button>

                  <div className="text-right">
                    <Link to="#" className="text-green-400 hover:text-green-300 text-sm">
                      Forgot password ?
                    </Link>
                  </div>
                </form>
              </div>

              {/* Register Link */}
              <div className="text-center">
                <span className="text-gray-400">Don't have an account? </span>
                <Link to="/register" className="text-green-400 hover:text-green-300">
                  Register here
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
