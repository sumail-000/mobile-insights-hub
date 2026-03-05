"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

import { Eye, EyeOff, Smartphone, Cpu, Mail, Lock, ArrowRight, Chrome } from "lucide-react";


import Navbar from "@/components/Navbar";


import Footer from "@/components/Footer";


import { useAuth } from "@/contexts/AuthContext";



export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      router.push("/");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen page-bg">
      <Navbar />

      <div className="flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">

          {/* Logo mark */}
          <div className="flex flex-col items-center mb-8">
            <div className="bg-primary rounded-2xl px-4 py-3 flex items-center gap-2 mb-4 shadow-lg shadow-primary/30">
              <Smartphone size={22} className="text-white" />
              <Cpu size={18} className="text-white" />
            </div>
            <h1 className="text-2xl font-black tracking-tight">Welcome back</h1>
            <p className="text-sm text-muted-foreground mt-1">Sign in to your MobilePhoneCompare account</p>
          </div>

          {/* Card */}
          <div className="glass-card rounded-2xl p-7">

            {/* Social login */}
            <button className="w-full flex items-center justify-center gap-3 border border-border/60 bg-white/40 hover:bg-white/60 rounded-xl py-2.5 text-sm font-semibold transition-all mb-5 group">
              <Chrome size={16} className="text-blue-500" />
              Continue with Google
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-border/50" />
              <span className="text-xs text-muted-foreground font-medium">or sign in with email</span>
              <div className="flex-1 h-px bg-border/50" />
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm mb-4">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1.5">Email</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full bg-white/50 border border-border/60 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-primary/60 focus:bg-white/70 transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Password</label>
                  <Link href="/forgot-password" className="text-xs text-primary hover:underline font-medium">Forgot password?</Link>
                </div>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Your password"
                    required
                    className="w-full bg-white/50 border border-border/60 rounded-xl pl-10 pr-11 py-2.5 text-sm focus:outline-none focus:border-primary/60 focus:bg-white/70 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Remember me */}
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setRememberMe(!rememberMe)}
                  className={`w-4.5 h-4.5 rounded border-2 flex items-center justify-center transition-all shrink-0 ${
                    rememberMe ? "bg-primary border-primary" : "bg-white/50 border-border/60"
                  }`}
                  style={{ width: 18, height: 18 }}
                >
                  {rememberMe && <div className="w-2 h-2 bg-white rounded-sm" />}
                </button>
                <span className="text-sm text-muted-foreground">Remember me for 30 days</span>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-primary-foreground py-2.5 rounded-xl font-bold text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Sign In <ArrowRight size={15} /></>
                )}
              </button>
            </form>
          </div>

          {/* Footer link */}
          <p className="text-center text-sm text-muted-foreground mt-5">
            Don't have an account?{" "}
            <Link href="/signup" className="text-primary font-bold hover:underline">
              Create one free
            </Link>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}

