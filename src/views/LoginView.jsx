import React, { useState } from "react";
import { Boxes, Lock, Mail, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigation } from "../context/NavigationContext";
import { VIEWS } from "../constants";

export default function LoginView({ onLoginSuccess: propOnLoginSuccess }) {
  let authCtx = null;
  let navCtx = null;

  try {
    authCtx = useAuth();
  } catch (e) {}

  try {
    navCtx = useNavigation();
  } catch (e) {}

  const onLoginSuccess =
    propOnLoginSuccess ??
    (() => {
      authCtx?.login();
      navCtx?.navigateTo(VIEWS.DASHBOARD);
    });

  const [email, setEmail] = useState("operator@rfms.io");
  const [password, setPassword] = useState("••••••••••••");
  const [remember, setRemember] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    onLoginSuccess();
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen w-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white select-none overflow-y-auto">
      {/* Left Industrial Branding Column */}
      <div className="flex-1 bg-gradient-to-br from-[#18191d] via-[#121316] to-[#0c0d10] text-white p-8 sm:p-14 flex flex-col justify-between relative overflow-hidden min-h-[360px]">
        {/* Ambient background glow */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Brand Header */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Boxes className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg font-bold tracking-wide">RFMS</div>
            <div className="text-[11px] text-slate-400 font-medium">
              Robotics Fleet Management System
            </div>
          </div>
        </div>

        {/* Hero Copy */}
        <div className="my-10 relative z-10 max-w-lg">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Move<br />
            Automate<br />
            Grow <span className="text-blue-500">—</span>
          </h1>
          <p className="mt-5 text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            Intelligent AGV solutions for a smarter industry.
          </p>

          <div className="mt-8 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-sm max-w-md">
            <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">
              Autonomous Fleet Orchestration
            </div>
            <div className="text-sm font-medium text-slate-200">
              18 Active AGVs Synchronized across Production & Dispatch
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-xs text-slate-400">
          Powered by DeepMind Industrial Robotics OS • v2.4.0
        </div>
      </div>

      {/* Right Modern Form Card */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 lg:p-16">
        <div className="w-full max-w-md space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Operator Sign In
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Enter your plant credentials to access the AGV command console.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Work Email or Operator ID
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="operator@rfms.io"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <a
                  href="#"
                  className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 accent-blue-600"
                />
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                  Remember this workstation
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2 mt-4"
            >
              <span>Authenticate Session</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Help Badge */}
          <div className="p-3 bg-slate-100/70 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-center">
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Demo Environment: Click{" "}
              <strong className="text-slate-800 dark:text-slate-200">
                Authenticate Session
              </strong>{" "}
              to login directly.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
