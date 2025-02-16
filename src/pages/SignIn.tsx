
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock sign-in logic
    if (email === "admin@salon.com" && password === "admin") {
      navigate("/admin");
    } else if (email && password) {
      navigate("/dashboard");
    }
    toast({
      title: "Welcome back!",
      description: "You have successfully signed in.",
    });
  };

  return (
    <div className="min-h-screen bg-salon-cream flex items-center justify-center px-4">
      <div className="glass-card w-full max-w-md p-8 rounded-2xl">
        <h1 className="heading-lg text-center mb-8">Sign In</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full bg-salon-gold hover:bg-salon-gold/90">
            Sign In
          </Button>
        </form>
        <p className="text-center mt-6 text-sm text-salon-dark/70">
          Don't have an account?{" "}
          <Link to="/signup" className="text-salon-gold hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
