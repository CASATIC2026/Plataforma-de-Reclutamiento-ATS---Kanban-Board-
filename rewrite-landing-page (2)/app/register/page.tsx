"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from "lucide-react";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    specialty: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-[#071326] flex flex-col">
      {/* Mobile Layout */}
      <div className="md:hidden min-h-screen flex flex-col pt-16 pb-10">
        {/* Hero image section */}
        <div className="relative h-64 bg-gradient-to-br from-[#101C2F] to-[#0a0f1b] overflow-hidden mb-6">
          <div className="absolute inset-0 opacity-40 bg-gradient-to-t from-[#071326] via-transparent to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
            <h2 className="text-2xl font-extrabold font-[var(--font-plus-jakarta)] mb-2">
              Únete a la élite del talento tecnológico
            </h2>
            <p className="text-sm text-on-surface-variant">
              Accede a las oportunidades más exclusivas y conecta con empresas que están definiendo el futuro del trabajo digital.
            </p>
          </div>
        </div>

        {/* Form section */}
        <div className="flex-1 px-6 space-y-6">
          {/* Heading */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-slate-100 font-[var(--font-plus-jakarta)]">Crear cuenta</h1>
            <p className="text-on-surface-variant text-base">Empieza tu trayectoria profesional hoy mismo.</p>
          </div>

          {/* Form */}
          <div className="space-y-4">
            {/* Name */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-on-surface-variant tracking-widest uppercase">
                Nombre completo
              </label>
              <div className="relative">
                <User className="absolute left-4 top-3.5 w-5 h-5 text-on-surface-variant/50" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ej. Alex Meridian"
                  className="w-full pl-12 pr-4 py-3.5 rounded-lg border border-outline-variant/15 bg-[#030E21] text-slate-100 placeholder-on-surface-variant/40 font-inter text-base focus:outline-none focus:border-brand-turquoise transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-on-surface-variant tracking-widest uppercase">
                Dirección de correo electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-on-surface-variant/50" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="email@ejemplo.com"
                  className="w-full pl-12 pr-4 py-3.5 rounded-lg border border-outline-variant/15 bg-[#030E21] text-slate-100 placeholder-on-surface-variant/40 font-inter text-base focus:outline-none focus:border-brand-turquoise transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-on-surface-variant tracking-widest uppercase">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-on-surface-variant/50" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
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

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-on-surface-variant tracking-widest uppercase">
                Confirmar contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-on-surface-variant/50" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3.5 rounded-lg border border-outline-variant/15 bg-[#030E21] text-slate-100 placeholder-on-surface-variant/40 font-inter text-base focus:outline-none focus:border-brand-turquoise transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-3.5 text-on-surface-variant/50 hover:text-on-surface-variant transition-all"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Specialty */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-on-surface-variant tracking-widest uppercase">
                Especialidad
              </label>
              <select
                name="specialty"
                value={formData.specialty}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-outline-variant/15 bg-[#030E21] text-slate-100 font-inter text-base focus:outline-none focus:border-brand-turquoise transition-all appearance-none cursor-pointer"
              >
                <option value="">Selecciona tu especialidad</option>
                <option value="frontend">Desarrollador Frontend</option>
                <option value="backend">Desarrollador Backend</option>
                <option value="fullstack">Desarrollador Fullstack</option>
                <option value="devops">DevOps Engineer</option>
                <option value="designer">Diseñador UX/UI</option>
                <option value="pm">Product Manager</option>
              </select>
            </div>

            {/* Terms checkbox */}
            <div className="flex gap-3">
              <input type="checkbox" id="terms" className="w-4 h-4 mt-1 accent-brand-turquoise" />
              <label htmlFor="terms" className="text-xs text-on-surface-variant/80 leading-relaxed">
                Acepto los Términos de Servicio y la Política de Privacidad de Talentify SV.
              </label>
            </div>

            {/* Register button */}
            <button className="w-full py-4 rounded-2xl bg-brand-turquoise text-on-brand-turquoise font-bold text-base shadow-lg shadow-brand-turquoise/20 hover:opacity-90 active:scale-95 transition-all font-[var(--font-plus-jakarta)] flex items-center justify-center gap-2 mt-6">
              Crear cuenta en Talentify SV
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 py-2">
            <div className="h-px bg-outline-variant/20 flex-1" />
            <span className="text-outline-variant text-xs font-bold tracking-widest uppercase">O REGÍSTRATE CON</span>
            <div className="h-px bg-outline-variant/20 flex-1" />
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

          {/* Sign in link */}
          <div className="text-center space-y-1 py-8">
            <p className="text-on-surface-variant text-sm">¿Ya tienes una cuenta?</p>
            <Link href="/login" className="text-[#FFB4A3] font-bold text-sm hover:text-[#FFB4A3]/80 transition-all">
              Iniciar sesión
            </Link>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex min-h-screen">
        {/* Left side - Image and text */}
        <div className="flex-1 bg-gradient-to-br from-[#101C2F] to-[#0a0f1b] flex flex-col justify-end p-20 relative overflow-hidden">
          {/* Background overlay */}
          <div className="absolute inset-0 opacity-20 bg-gradient-to-t from-[#071326] via-transparent to-transparent" />

          <div className="relative z-10 space-y-8 max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-turquoise/20 bg-brand-turquoise/10 w-fit">
              <span className="w-2 h-2 rounded-full bg-brand-turquoise" />
              <span className="text-brand-turquoise text-xs font-bold tracking-widest uppercase">Curating Excellence</span>
            </div>

            {/* Heading */}
            <h1 className="text-7xl font-extrabold text-brand-turquoise leading-tight">
              Únete a la élite del talento tecnológico.
            </h1>

            {/* Description */}
            <p className="text-on-surface-variant text-lg leading-relaxed">
              Accede a las oportunidades más exclusivas y conecta con empresas que están definiendo el futuro del trabajo digital.
            </p>
          </div>
        </div>

        {/* Right side - Register form */}
        <div className="flex-1 flex flex-col justify-center items-center p-12 bg-[#071326]">
          <div className="w-full max-w-md space-y-8">
            {/* Welcome text */}
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-slate-100 font-[var(--font-plus-jakarta)]">Crear cuenta</h2>
              <p className="text-on-surface-variant text-base">Empieza tu trayectoria profesional hoy mismo.</p>
            </div>

            {/* Form */}
            <div className="space-y-5">
              {/* Name */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-on-surface-variant tracking-widest uppercase">
                  Nombre completo
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-4 w-5 h-5 text-on-surface-variant/50" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Ej. Alex Meridian"
                    className="w-full pl-12 pr-4 py-[18px] rounded-lg border border-outline-variant/15 bg-[#030E21] text-slate-100 placeholder-on-surface-variant/40 font-inter text-base focus:outline-none focus:border-brand-turquoise transition-all"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-on-surface-variant tracking-widest uppercase">
                  Dirección de correo electrónico
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-4 w-5 h-5 text-on-surface-variant/50" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="email@ejemplo.com"
                    className="w-full pl-12 pr-4 py-[18px] rounded-lg border border-outline-variant/15 bg-[#030E21] text-slate-100 placeholder-on-surface-variant/40 font-inter text-base focus:outline-none focus:border-brand-turquoise transition-all"
                  />
                </div>
              </div>

              {/* Password and Confirm Password side by side */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-on-surface-variant tracking-widest uppercase">
                    Contraseña
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-4 w-5 h-5 text-on-surface-variant/50" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full pl-12 pr-4 py-[18px] rounded-lg border border-outline-variant/15 bg-[#030E21] text-slate-100 placeholder-on-surface-variant/40 font-inter text-base focus:outline-none focus:border-brand-turquoise transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-on-surface-variant tracking-widest uppercase">
                    Confirmar contraseña
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-4 w-5 h-5 text-on-surface-variant/50" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full pl-12 pr-4 py-[18px] rounded-lg border border-outline-variant/15 bg-[#030E21] text-slate-100 placeholder-on-surface-variant/40 font-inter text-base focus:outline-none focus:border-brand-turquoise transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Specialty */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-on-surface-variant tracking-widest uppercase">
                  Rol profesional (Opcional)
                </label>
                <select
                  name="specialty"
                  value={formData.specialty}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-outline-variant/15 bg-[#030E21] text-slate-100 font-inter text-base focus:outline-none focus:border-brand-turquoise transition-all appearance-none cursor-pointer"
                >
                  <option value="">Selecciona tu especialidad</option>
                  <option value="frontend">Desarrollador Frontend</option>
                  <option value="backend">Desarrollador Backend</option>
                  <option value="fullstack">Desarrollador Fullstack</option>
                  <option value="devops">DevOps Engineer</option>
                  <option value="designer">Diseñador UX/UI</option>
                  <option value="pm">Product Manager</option>
                </select>
              </div>

              {/* Terms checkbox */}
              <div className="flex gap-3">
                <input type="checkbox" id="terms" className="w-4 h-4 mt-1 accent-brand-turquoise" />
                <label htmlFor="terms" className="text-xs text-on-surface-variant/80 leading-relaxed">
                  Acepto los Términos de Servicio y la Política de Privacidad de Talentify SV.
                </label>
              </div>

              {/* Register button */}
              <button className="w-full py-4 rounded-xl bg-brand-turquoise text-on-brand-turquoise font-bold text-base shadow-lg shadow-brand-turquoise/20 hover:opacity-90 active:scale-95 transition-all font-[var(--font-plus-jakarta)] flex items-center justify-center gap-2">
                Crear cuenta en Talentify SV
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4">
              <div className="h-px bg-outline-variant/20 flex-1" />
              <span className="text-outline-variant text-xs font-semibold tracking-widest uppercase">O REGÍSTRATE CON</span>
              <div className="h-px bg-outline-variant/20 flex-1" />
            </div>

            {/* OAuth buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button className="py-3 px-4 rounded-lg border border-outline-variant/15 bg-surface-container-high hover:bg-surface-container-highest transition-all font-inter text-sm font-semibold text-slate-200">
                Google
              </button>
              <button className="py-3 px-4 rounded-lg border border-outline-variant/15 bg-surface-container-high hover:bg-surface-container-highest transition-all font-inter text-sm font-semibold text-slate-200">
                LinkedIn
              </button>
            </div>

            {/* Sign in link */}
            <div className="text-center space-y-1 pt-2">
              <p className="text-on-surface-variant text-base">¿Ya tienes una cuenta?</p>
              <Link href="/login" className="text-brand-turquoise font-bold text-base hover:text-brand-turquoise/80 transition-all">
                Iniciar sesión
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
