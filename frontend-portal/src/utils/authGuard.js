import axios from 'axios';

/**
 * Higher-order function para envolver getServerSideProps:
 * • Valida la sesión del usuario con Sanctum (Laravel).
 * • Si está autenticado, ejecuta el gssp original y le pasa `user`.
 * • Si no, redirige a /login antes de renderizar la página.
 */
export function withAuth(gssp) {
  return async (context) => {
    const { req } = context;
    const cookie = req.headers.cookie ?? '';

    // 1️⃣ Extraer el token CSRF si existe (Laravel Sanctum usa esta cookie)
    const match = cookie.match(/XSRF-TOKEN=([^;]+)/);
    const xsrf = match ? decodeURIComponent(match[1]) : '';

    try {
      // 2️⃣ Crear cliente Axios para verificar el usuario autenticado
      const api = axios.create({
        baseURL: 'http://localhost:8000',   // Back-end Laravel
        withCredentials: true,
        headers: {
          Cookie: cookie,
          Accept: 'application/json',
          Origin: 'http://localhost:3000',
          Referer: 'http://localhost:3000/',
          'X-Requested-With': 'XMLHttpRequest',
          ...(xsrf && { 'X-XSRF-TOKEN': xsrf }),
        },
      });

      // 3️⃣ Consultar al backend para verificar la sesión
      const { data } = await api.get('/api/user');
      const user = data.user ?? data;

      // 4️⃣ Ejecutar getServerSideProps original y pasarle el usuario
      return await gssp(context, user);
    } catch (err) {
      // 5️⃣ No autenticado ⇒ redirige al login
      return {
        redirect: { destination: '/login', permanent: false },
      };
    }
  };
}
