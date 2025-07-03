// src/pages/login/index.js
'use client';

import { useState } from 'react';
import { useRouter } from 'next/router';
import { login } from '@/services/auth';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuth() ?? {};
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login(email, password);    // POST /api/login
      if (setUser && res?.data?.user) setUser(res.data.user);
      router.push('/dashboard');
    } catch (err) {
      setError(err.response?.status === 422
        ? 'Credenciales inválidas'
        : 'Error inesperado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="login section">
        <div className="container">
          <div className="inner">
            <div className="row">
              <div className="col-lg-6">
                <div className="login-left">{/* Aquí puedes poner una imagen o animación */}</div>
              </div>

              <div className="col-lg-6">
                <div className="login-form">
                  <h2>Iniciar sesión</h2>
                 
                  <form className="form" onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-12">
                        <div className="form-group">
                          <input
                            type="email"
                            name="email"
                            placeholder="Correo electrónico"
                            value={email}
                            onChange={(e) => setEmail(e.target.value.toLowerCase())} // 🔽 Forzar valor
                            required
                          />
                        </div>
                      </div>

                      <div className="col-12">
                        <div className="form-group">
                          <input
                            type="password"
                            name="password"
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="col-12">
                        <div className="form-group login-btn">
                          <button className="btn" type="submit" disabled={loading}>
                            {loading ? 'Ingresando…' : 'Iniciar Sesión'}
                          </button>
                        </div>

                        {error && (
                          <div className="form-group">
                            <p style={{ color: 'red' }}>{error}</p>
                          </div>
                        )}

                        <div className="checkbox">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="rememberMe"
                            />
                            <label className="form-check-label" htmlFor="rememberMe">
                              Recordarme
                            </label>
                          </div>
                        </div>

                        <Link href="#" className="lost-pass">
                          ¿Olvidaste tu contraseña?
                        </Link>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}