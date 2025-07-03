<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Topbar;
use Illuminate\Database\QueryException;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class TopbarController extends Controller
{
    /*** 🔍 Listar todos los topbars (admin) */
    public function index()
    {
        try {
            return response()->json(Topbar::all(), 200);
        } catch (QueryException $e) {
            return response()->json(['message' => 'Error en la base de datos', 'error' => $e->getMessage()], 500);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error inesperado', 'error' => $e->getMessage()], 500);
        }
    }

    /*** 📩 Mostrar el topbar activo (público) */
    public function show()
    {
        try {
            $topbar = Topbar::where('enabled', true)->latest()->first();
            return response()->json($topbar, 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'No se pudo cargar el topbar', 'error' => $e->getMessage()], 500);
        }
    }

    /*** ✅ Crear un nuevo topbar */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'email'   => 'required|email|max:255',
                'enabled' => 'required|boolean',
            ]);

            // Desactivar otros si este está habilitado
            if ($validated['enabled']) {
                Topbar::where('enabled', true)->update(['enabled' => false]);
            }

            $topbar = Topbar::create($validated);

            return response()->json([
                'message' => 'Topbar creado correctamente.',
                'data'    => $topbar,
            ], 201);
        } catch (ValidationException $e) {
            return response()->json(['message' => 'Error de validación', 'errors' => $e->errors()], 422);
        } catch (QueryException $e) {
            return response()->json(['message' => 'Error en la base de datos', 'error' => $e->getMessage()], 500);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Ocurrió un error inesperado', 'error' => $e->getMessage()], 500);
        }
    }

    /*** ✏️ Editar un topbar existente */
    public function update(Request $request, $id)
    {
        try {
            $topbar = Topbar::findOrFail($id);

            $validated = $request->validate([
                'email'   => 'required|email|max:255',
                'enabled' => 'required|boolean',
            ]);

            // Desactivar otros si este se activa
            if ($validated['enabled']) {
                Topbar::where('enabled', true)->where('id', '!=', $id)->update(['enabled' => false]);
            }

            $topbar->update($validated);

            return response()->json([
                'message' => 'Topbar actualizado correctamente.',
                'data'    => $topbar,
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['message' => 'Topbar no encontrado'], 404);
        } catch (ValidationException $e) {
            return response()->json(['message' => 'Error de validación', 'errors' => $e->errors()], 422);
        } catch (QueryException $e) {
            return response()->json(['message' => 'Error en la base de datos', 'error' => $e->getMessage()], 500);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Ocurrió un error inesperado', 'error' => $e->getMessage()], 500);
        }
    }

    /*** 🗑️ Eliminar un topbar */
    public function destroy($id)
    {
        try {
            $topbar = Topbar::findOrFail($id);
            $topbar->delete();

            return response()->json(['message' => 'Topbar eliminado correctamente.'], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['message' => 'Topbar no encontrado'], 404);
        } catch (QueryException $e) {
            return response()->json(['message' => 'Error en la base de datos', 'error' => $e->getMessage()], 500);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error inesperado', 'error' => $e->getMessage()], 500);
        }
    }
}
