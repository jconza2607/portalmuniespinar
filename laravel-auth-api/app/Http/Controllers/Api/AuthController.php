<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /*** Iniciar sesión */
    public function login(Request $request)
    {
        try {
            $request->validate([
                'email'    => ['required', 'email'],
                'password' => ['required'],
            ]);

            if (!Auth::attempt($request->only('email', 'password'), true)) {
                return response()->json([
                    'message' => 'Credenciales inválidas'
                ], 422);
            }

            return response()->json([
                'message' => 'Inicio de sesión exitoso',
                'user'    => Auth::user()->only('id', 'name', 'email'),
            ], 200);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Error de validación',
                'errors'  => $e->errors(),
            ], 422);

        } catch (AuthenticationException $e) {
            return response()->json([
                'message' => 'No autenticado',
            ], 401);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Recurso no encontrado',
            ], 404);

        } catch (QueryException $e) {
            return response()->json([
                'message' => 'Error en la base de datos',
                'error'   => $e->getMessage(),
            ], 500);

        } catch (HttpException $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], $e->getStatusCode());

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Ocurrió un error inesperado',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    /*** Registrar un nuevo usuario */
    public function register(Request $request)
    {
        try {
            $validated = $request->validate([
                'name'     => ['required', 'string', 'max:255'],
                'email'    => ['required', 'email', 'max:255', 'unique:users,email'],
                'password' => ['required', 'string', 'min:8', 'confirmed'],
            ]);

            $user = User::create([
                'name'     => $validated['name'],
                'email'    => $validated['email'],
                'password' => Hash::make($validated['password']),
            ]);

            Auth::login($user);

            return response()->json([
                'message' => 'Usuario registrado correctamente.',
                'user'    => $user->only('id', 'name', 'email'),
            ], 201);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Error de validación',
                'errors'  => $e->errors(),
            ], 422);

        } catch (QueryException $e) {
            return response()->json([
                'message' => 'Error en la base de datos',
                'error'   => $e->getMessage(),
            ], 500);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Ocurrió un error inesperado',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    /*** Cerrar sesión */
    public function logout(Request $request)
    {
        try {
            if (! $request->user()) {           // No hay sesión
                return response()->json([
                    'message' => 'No hay sesión activa.'
                ], 401);
            }

            // ⏩ Cerrar sesión en el guard de sesión ('web')
            Auth::guard('web')->logout();

            // Invalidar y regenerar la sesión
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return response()->json([
                'message' => 'Sesión cerrada exitosamente.'
            ], 200);

        } catch (\Throwable $e) {
            \Log::error('Logout error: '.$e->getMessage());
            return response()->json([
                'message' => 'Error al cerrar sesión. Intenta nuevamente.'
            ], 500);
        }
    }

    /*** Obtener usuario autenticado */
    public function user(Request $request)
    {
        try {
            $user = $request->user();

            return response()->json([
                'user' => $user ? $user->only('id', 'name', 'email') : null
            ], 200);

        } catch (AuthenticationException $e) {
            return response()->json([
                'message' => 'No autenticado',
            ], 401);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Ocurrió un error al obtener el usuario',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }
}
