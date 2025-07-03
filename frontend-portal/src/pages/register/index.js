'use client';

import { useState } from 'react';
import { useRouter } from 'next/router';
import { register } from '@/services/auth';
import { withAuth } from '@/utils/authGuard';

export const getServerSideProps = withAuth(async (_ctx, user) => {
  // Aquí podrías cargar datos adicionales si quieres
  return { props: { user } };
});

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await register(name, email, password,passwordConfirmation);
      router.push('/dashboard');
    } catch (err) {
      console.error('Register error:', err);
      setError('Error al registrarse');
    }
  };

  return (
    <div>
      <h1>Registro</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
            <label>Confirmar Contraseña:</label>
            <input
                type="password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                required
            />
        </div>

        <button type="submit">Registrarse</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
