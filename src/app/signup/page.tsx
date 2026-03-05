"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

import { Eye, EyeOff, Smartphone, Cpu, Mail, Lock, User, ArrowRight, Chrome, Check } from "lucide-react";


import Navbar from "@/components/Navbar";


import Footer from "@/components/Footer";


import { useAuth } from "@/contexts/AuthContext";



const perks = [
  "Save your favorite phones to wishlist",
  "Get notified on price drops & launches",
  "Compare up to 3 phones side-by-side",
  "Personalized phone recommendations",
];

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { signup } = useAuth();

  const passwordStrength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const strengthLabel = ["", "Weak", "Good", "Strong"];
  const strengthColor = ["", "bg-red-500", "bg-amber-500", "bg-green-500"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) return;
    setError("");
    setLoading(true);
    try {
      await signup(name, email, password);
      router.push("/");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Sign up failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen page-bg">
      <Navbar />

      <div className="flex items-start justify-center px-4 py-12">
        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

          {/* Left — perks panel */}
          <div className="glass-card rounded-2xl p-8 flex flex-col gap-6">
            <div>
              <div className="bg-primary rounded-2xl px-4 py-3 flex items-center gap-2 mb-5 shadow-lg shadow-primary/30 w-fit">
                <Smartphone size={22} className="text-white" />
                <Cpu size={18} className="text-white" />
              </div>
              <h2 className="text-2xl font-black tracking-tight mb-2">Join MobilePhoneCompare</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The ultimate mobile specifications database. Track, compare, and discover every phone on the market.
              </p>
            </div>

            {/* Perks */}
            <div className="space-y-3">
              {perks.map((perk, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                    <Check size={12} className="text-primary" />
                  </div>
                  <span className="text-sm font-medium">{perk}</span>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 pt-2 border-t border-border/40">
              {[
                { value: "10K+", label: "Phones" },
                { value: "500K+", label: "Users" },
                { value: "Free", label: "Forever" },
              ].map((s, i) => (
                <div key={i} className="text-center p-3 rounded-xl bg-white/30">
                  <p className="text-lg font-black text-primary">{s.value}</p>
                  <p className="text-[11px] text-muted-foreground font-medium">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — form */}
          <div className="glass-card rounded-2xl p-7">
            <h3 className="text-xl font-black mb-1">Create your account</h3>
            <p className="text-sm text-muted-foreground mb-5">Free forever. No credit card required.</p>

            {/* Google */}
            <button className="w-full flex items-center justify-center gap-3 border border-border/60 bg-white/40 hover:bg-white/60 rounded-xl py-2.5 text-sm font-semibold transition-all mb-5">
              <Chrome size={16} className="text-blue-500" />
              Sign up with Google
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-border/50" />
              <span className="text-xs text-muted-foreground font-medium">or with email</span>
              <div className="flex-1 h-px bg-border/50" />
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide block mb-1.5">Full Name</label>
                <div className="relative">
                  <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="John Doe"
                    required
                    className="w-full bg-white/50 border border-border/60 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-primary/60 focus:bg-white/70 transition-all"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide block mb-1.5">Email</label>
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
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide block mb-1.5">Password</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Min. 8 characters"
                    required
                    className="w-full bg-white/50 border border-border/60 rounded-xl pl-10 pr-11 py-2.5 text-sm focus:outline-none focus:border-primary/60 focus:bg-white/70 transition-all"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {/* Strength bar */}
                {password.length > 0 && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex gap-1 flex-1">
                      {[1, 2, 3].map(level => (
                        <div key={level} className={`h-1 flex-1 rounded-full transition-all ${passwordStrength >= level ? strengthColor[passwordStrength] : "bg-border/40"}`} />
                      ))}
                    </div>
                    <span className="text-[10px] font-bold text-muted-foreground">{strengthLabel[passwordStrength]}</span>
                  </div>
                )}
              </div>

              {/* Confirm password */}
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide block mb-1.5">Confirm Password</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Repeat your password"
                    required
                    className={`w-full bg-white/50 border rounded-xl pl-10 pr-11 py-2.5 text-sm focus:outline-none transition-all ${
                      confirmPassword && confirmPassword !== password
                        ? "border-red-400/60 focus:border-red-400"
                        : "border-border/60 focus:border-primary/60 focus:bg-white/70"
                    }`}
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {confirmPassword && confirmPassword !== password && (
                  <p className="text-[11px] text-red-500 mt-1 font-medium">Passwords don't match</p>
                )}
              </div>

              {/* Terms */}
              <div className="flex items-start gap-2.5">
                <button
                  type="button"
                  onClick={() => setAgreed(!agreed)}
                  className={`w-[18px] h-[18px] rounded border-2 flex items-center justify-center transition-all shrink-0 mt-0.5 ${
                    agreed ? "bg-primary border-primary" : "bg-white/50 border-border/60"
                  }`}
                >
                  {agreed && <Check size={10} className="text-white" strokeWidth={3} />}
                </button>
                <span className="text-xs text-muted-foreground leading-relaxed">
                  I agree to the{" "}
                  <Link href="/" className="text-primary hover:underline font-semibold">Terms of Service</Link>
                  {" "}and{" "}
                  <Link href="/" className="text-primary hover:underline font-semibold">Privacy Policy</Link>
                </span>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || !agreed || (!!confirmPassword && confirmPassword !== password)}
                className="w-full bg-primary text-primary-foreground py-2.5 rounded-xl font-bold text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Create Account <ArrowRight size={15} /></>
                )}
              </button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-5">
              Already have an account?{" "}
              <Link href="/login" className="text-primary font-bold hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

