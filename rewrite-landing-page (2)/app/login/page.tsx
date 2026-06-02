"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen bg-[#071326] flex flex-col">
      {/* Mobile Layout */}
      <div className="md:hidden min-h-screen flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -right-20 top-20 w-64 h-64 rounded-full bg-brand-mint/5 blur-3xl" />
        <div className="absolute -left-20 -bottom-20 w-56 h-56 rounded-full bg-[#D97862]/5 blur-3xl" />

        <div className="relative z-10 w-full max-w-sm flex flex-col gap-8">
          {/* Logo */}
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-slate-100 font-[var(--font-plus-jakarta)]">
              Talentify SV
            </h1>
          </div>

          {/* Welcome text */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-slate-100">Bienvenido de nuevo</h2>
            <p className="text-on-surface-variant text-base">Accede a tu red de talento</p>
          </div>

          {/* OAuth buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button className="py-3 px-4 rounded-xl border border-outline-variant/15 bg-surface-container-high hover:bg-surface-container-highest transition-all font-inter text-sm font-semibold text-slate-200">
              Google
            </button>
            <button className="py-3 px-4 rounded-xl border border-outline-variant/15 bg-surface-container-high hover:bg-surface-container-highest transition-all font-inter text-sm font-semibold text-slate-200">
              LinkedIn
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="h-px bg-outline-variant/20 flex-1" />
            <span className="text-outline-variant text-xs font-semibold tracking-widest uppercase">O USA TU CORREO</span>
            <div className="h-px bg-outline-variant/20 flex-1" />
          </div>

          {/* Form */}
          <div className="space-y-4">
            {/* Email */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-on-surface-variant tracking-widest uppercase">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-on-surface-variant/50" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nombre@ejemplo.com"
                  className="w-full pl-12 pr-4 py-3.5 rounded-lg border border-outline-variant/15 bg-[#030E21] text-slate-100 placeholder-on-surface-variant/40 font-inter text-base focus:outline-none focus:border-brand-turquoise transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-on-surface-variant tracking-widest uppercase">
                  Contraseña
                </label>
                <Link href="#" className="text-xs font-semibold text-brand-turquoise hover:text-brand-turquoise/80 transition-all">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-on-surface-variant/50" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3.5 rounded-lg border border-outline-variant/15 bg-[#030E21] text-slate-100 placeholder-on-surface-variant/40 font-inter text-base focus:outline-none focus:border-brand-turquoise transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-on-surface-variant/50 hover:text-on-surface-variant transition-all"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Login button */}
            <button className="w-full py-4 rounded-2xl bg-brand-turquoise text-on-brand-turquoise font-bold text-base shadow-lg shadow-brand-turquoise/20 hover:opacity-90 active:scale-95 transition-all font-[var(--font-plus-jakarta)] mt-6">
              Iniciar sesión
            </button>
          </div>

          {/* Sign up link */}
          <div className="text-center space-y-1">
            <p className="text-on-surface-variant text-sm">¿No tienes una cuenta?</p>
            <Link href="/register" className="text-brand-turquoise font-bold text-sm hover:text-brand-turquoise/80 transition-all">
              Regístrate gratis
            </Link>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex min-h-screen">
        {/* Left side - Image and text */}
        <div className="hidden lg:flex flex-1 bg-gradient-to-br from-[#101C2F] to-[#0a0f1b] flex-col justify-end p-16 relative overflow-hidden">
          {/* Background image placeholder */}
          <div className="absolute inset-0 opacity-20 bg-gradient-to-t from-[#071326] via-transparent to-transparent" />

          <div className="relative z-10 space-y-8 max-w-md">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-mint/20 bg-brand-mint/10 w-fit">
              <span className="w-2 h-2 rounded-full bg-brand-mint" />
              <span className="text-brand-mint text-xs font-bold tracking-widest uppercase">Mercado Activo</span>
            </div>

            {/* Heading */}
            <h1 className="text-5xl font-extrabold text-brand-turquoise leading-tight">
              Curando el futuro del trabajo de alto impacto.
            </h1>

            {/* Description */}
            <p className="text-on-surface-variant text-lg leading-relaxed">
              Únete a un ecosistema de élite donde el talento de primer nivel encuentra oportunidades visionarias.
            </p>
          </div>
        </div>

        {/* Right side - Login form */}
        <div className="flex-1 lg:flex-none lg:w-[600px] flex flex-col justify-center items-center p-12 bg-[#071326]">
          <div className="w-full max-w-md space-y-8">
            {/* Tabs */}
            <div className="inline-flex p-1 rounded-xl bg-[#030E21] w-full">
              <button className="flex-1 py-2.5 px-4 rounded-lg bg-brand-turquoise text-white font-inter text-sm font-semibold">
                Iniciar Sesión
              </button>
              <Link href="/register" className="flex-1 py-2.5 px-4 rounded-lg text-on-surface-variant font-inter text-sm font-semibold hover:text-slate-300 transition-all">
                Crear Cuenta
              </Link>
            </div>

            {/* Welcome text */}
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-slate-100 font-[var(--font-plus-jakarta)]">
                Bienvenido de nuevo
              </h2>
              <p className="text-on-surface-variant text-base">
                Ingresa tus credenciales para acceder a tu panel de curador.
              </p>
            </div>

            {/* OAuth buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button className="py-3 px-4 rounded-xl border border-outline-variant/15 bg-surface-container-high hover:bg-surface-container-highest transition-all font-inter text-sm font-semibold text-slate-200">
                Google
              </button>
              <button className="py-3 px-4 rounded-xl border border-outline-variant/15 bg-surface-container-high hover:bg-surface-container-highest transition-all font-inter text-sm font-semibold text-slate-200">
                LinkedIn
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4">
              <div className="h-px bg-outline-variant/20 flex-1" />
              <span className="text-outline-variant text-xs font-semibold tracking-widest uppercase">O CONTINÚA CON CORREO</span>
              <div className="h-px bg-outline-variant/20 flex-1" />
            </div>

            {/* Form */}
            <div className="space-y-5">
              {/* Email */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-on-surface-variant tracking-widest uppercase">
                  Dirección de Correo
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-4 w-5 h-5 text-on-surface-variant/50" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="curador@talentifysy.com"
                    className="w-full pl-12 pr-4 py-[18px] rounded-lg border border-outline-variant/15 bg-[#030E21] text-slate-100 placeholder-on-surface-variant/40 font-inter text-base focus:outline-none focus:border-brand-turquoise transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-on-surface-variant tracking-widest uppercase">
                    Contraseña
                  </label>
                  <Link href="#" className="text-xs font-semibold text-brand-turquoise hover:text-brand-turquoise/80 transition-all">
                    Olvidé mi contraseña?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-4 w-5 h-5 text-on-surface-variant/50" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-[18px] rounded-lg border border-outline-variant/15 bg-[#030E21] text-slate-100 placeholder-on-surface-variant/40 font-inter text-base focus:outline-none focus:border-brand-turquoise transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-4 text-on-surface-variant/50 hover:text-on-surface-variant transition-all"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Login button */}
              <button className="w-full py-4 rounded-xl bg-brand-turquoise text-on-brand-turquoise font-bold text-lg shadow-lg shadow-brand-turquoise/20 hover:opacity-90 active:scale-95 transition-all font-[var(--font-plus-jakarta)]">
                Iniciar sesión en Talentify SV
              </button>
            </div>

            {/* Terms */}
            <p className="text-slate-300 text-sm leading-relaxed text-center">
              Al iniciar sesión, aceptas nuestros Términos de Servicio y nuestra Política de Privacidad.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#071326] border-t border-outline-variant/10 hidden md:block">
        <div className="max-w-7xl mx-auto px-8 py-12 flex justify-between items-center">
          <div className="space-y-2">
            <p className="text-slate-100 font-bold text-xl font-[var(--font-plus-jakarta)]">Talentify SV</p>
            <p className="text-on-surface-variant text-sm">© 2026 Talentify SV. Curando el futuro del trabajo.</p>
          </div>
          <div className="flex gap-8">
            <Link href="#" className="text-on-surface-variant text-sm hover:text-slate-300 transition-all">Política de Privacidad</Link>
            <Link href="#" className="text-on-surface-variant text-sm hover:text-slate-300 transition-all">Términos de Servicio</Link>
            <Link href="#" className="text-on-surface-variant text-sm hover:text-slate-300 transition-all">Centro de Ayuda</Link>
            <Link href="#" className="text-on-surface-variant text-sm hover:text-slate-300 transition-all">Política de Cookies</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
