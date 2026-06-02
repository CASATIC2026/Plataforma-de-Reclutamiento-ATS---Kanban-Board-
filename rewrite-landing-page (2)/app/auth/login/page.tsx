"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authenticate, saveUser } from "@/lib/auth-mock";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("alex.rivera@editorial.market");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await authenticate({ email, password });
      
      if (user) {
        saveUser(user);
        router.push("/dashboard");
      } else {
        setError("Correo o contraseña inválidos");
      }
    } catch (err) {
      setError("Error al iniciar sesión. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050A14] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link href="/" className="inline-block mb-12">
          <h1 className="text-2xl font-bold text-slate-100">
            Talentify <span className="text-brand-turquoise">SV</span>
          </h1>
        </Link>

        <div className="rounded-2xl border border-outline-variant/10 bg-[#0F1B28] p-8">
          <h2 className="text-2xl font-bold text-slate-100 mb-2">Inicia sesión</h2>
          <p className="text-on-surface-variant mb-8">Accede a tu cuenta de Talentify SV</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Correo Electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full px-4 py-3 rounded-lg bg-surface-container border border-outline-variant/20 text-slate-100 placeholder-on-surface-variant focus:border-brand-turquoise focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg bg-surface-container border border-outline-variant/20 text-slate-100 placeholder-on-surface-variant focus:border-brand-turquoise focus:outline-none transition-colors"
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 rounded-xl bg-brand-turquoise text-on-brand-turquoise font-bold hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-outline-variant/10">
            <p className="text-xs text-on-surface-variant mb-3">
              Credenciales de demostración:
            </p>
            <div className="space-y-2 text-xs text-on-surface-variant/80">
              <p><strong>Email:</strong> alex.rivera@editorial.market</p>
              <p><strong>Contraseña:</strong> password123</p>
              <p className="pt-2">O</p>
              <p><strong>Email:</strong> test@test.com</p>
              <p><strong>Contraseña:</strong> test123</p>
            </div>
          </div>

          <Link
            href="/"
            className="block text-center mt-6 text-brand-turquoise hover:text-brand-turquoise/80 transition-colors text-sm font-medium"
          >
            Volver a inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
