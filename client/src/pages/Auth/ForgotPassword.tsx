import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, CheckCircle2 } from "lucide-react";
import { Logo } from "../../components/Logo";
import { SpatialCard } from "../../components/SpatialCard";
import { ThreeSceneBackground } from "../../components/ThreeSceneBackground";

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="relative min-h-screen bg-[#080D1A] text-white flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-['Inter'] overflow-hidden selection:bg-[#FF6B4A] selection:text-white">
      {/* 1. 3D WebGL Three.js Particle and Wireframe Scene */}
      <ThreeSceneBackground />

      {/* 2. Cinematic Athletic Background Photo with Multi-Stop Dark Vignette */}
      <div
        className="fixed inset-0 pointer-events-none bg-cover bg-center filter brightness-[0.22] contrast-[1.25] saturate-[1.2] -z-10"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2093&auto=format&fit=crop')"
        }}
      />
      <div
        className="fixed inset-0 pointer-events-none -z-10"
        style={{
          background: "radial-gradient(circle at 50% 40%, rgba(8, 13, 26, 0.35) 0%, rgba(8, 13, 26, 0.85) 60%, #080D1A 100%)"
        }}
      />

      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex flex-col items-center mb-3 group">
          <Logo size="lg" animated={true} />
        </Link>
        <h2 className="text-3xl font-black tracking-tight text-white font-['Plus_Jakarta_Sans']">
          Password Recovery
        </h2>
        <p className="mt-1 text-xs font-bold text-slate-400 uppercase tracking-widest">
          Enter your email to receive recovery instructions.
        </p>
      </div>

      <div className="relative z-10 mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <SpatialCard glowColor="cyan" depth="md">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="spatial-glass py-8 px-6 sm:px-10 shadow-2xl rounded-[32px]"
          >
          {sent ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-12 h-12 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 size={24} />
              </div>
              <h3 className="text-base font-bold text-white">Check your email</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                If an account exists for <strong className="text-white">{email}</strong>, you will receive password reset instructions.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-xs font-bold text-[#FF6B4A] hover:underline pt-2"
              >
                <ArrowLeft size={14} /> Back to Sign In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Your registered email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Mail size={17} />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="athlete@fittrack.com"
                    className="w-full pl-10 pr-4 py-3 bg-slate-900/80 border border-white/10 rounded-2xl text-sm focus:border-[#FF6B4A] focus:ring-1 focus:ring-[#FF6B4A] focus:outline-none text-white placeholder-slate-500 transition-all font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-[#FF6B4A] hover:bg-[#FA5A36] text-white font-black text-sm rounded-2xl shadow-lg shadow-[#FF6B4A]/25 transition-all cursor-pointer"
              >
                Send Reset Link
              </button>

              <div className="text-center pt-2">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
                >
                  <ArrowLeft size={14} /> Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </motion.div>
        </SpatialCard>
      </div>
    </div>
  );
};
