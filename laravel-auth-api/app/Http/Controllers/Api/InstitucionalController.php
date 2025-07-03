<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Institucional;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;

class InstitucionalController extends Controller
{
    /** Mostrar el contenido activo (público) */
    public function show()
    {
        try {
            $activo = Institucional::where('activo', true)->first();
            return response()->json($activo, 200);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Error al obtener contenido institucional.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /** Listar todas las versiones (admin) */
    public function index()
    {
        try {
            $items = Institucional::orderByDesc('created_at')->get();
            return response()->json($items, 200);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Error al listar contenidos.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /** Registrar nueva versión */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'vision' => 'required|string',
                'mision' => 'required|string',
                'imagen' => 'nullable|image|max:2048',
            ]);

            if ($request->hasFile('imagen')) {
                $path = $request->file('imagen')->store('institucionales', 'public');
                $validated['imagen'] = $path;
            }

            $item = Institucional::create($validated);

            return response()->json([
                'message' => 'Registrado correctamente.',
                'data' => $item
            ], 201);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Error de validación.',
                'errors' => $e->errors(),
            ], 422);
        } catch (QueryException $e) {
            return response()->json([
                'message' => 'Error en la base de datos.',
                'error' => $e->getMessage(),
            ], 500);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Error inesperado al registrar.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /** Actualizar una versión */
    public function update(Request $request, $id)
    {
        try {
            $item = Institucional::findOrFail($id);

            $validated = $request->validate([
                'vision' => 'required|string',
                'mision' => 'required|string',
                'imagen' => 'nullable|image|max:2048',
            ]);

            if ($request->hasFile('imagen')) {
                if ($item->imagen && Storage::disk('public')->exists($item->imagen)) {
                    Storage::disk('public')->delete($item->imagen);
                }
                $validated['imagen'] = $request->file('imagen')->store('institucionales', 'public');
            }

            $item->update($validated);

            return response()->json([
                'message' => 'Actualizado correctamente.',
                'data' => $item
            ], 200);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Contenido no encontrado.',
            ], 404);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Error de validación.',
                'errors' => $e->errors(),
            ], 422);
        } catch (QueryException $e) {
            return response()->json([
                'message' => 'Error en la base de datos.',
                'error' => $e->getMessage(),
            ], 500);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Error inesperado al actualizar.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /** Eliminar una versión */
    public function destroy($id)
    {
        try {
            $item = Institucional::findOrFail($id);

            if ($item->imagen && Storage::disk('public')->exists($item->imagen)) {
                Storage::disk('public')->delete($item->imagen);
            }

            $item->delete();

            return response()->json([
                'message' => 'Eliminado correctamente.'
            ], 200);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'No encontrado.',
            ], 404);
        } catch (QueryException $e) {
            return response()->json([
                'message' => 'Error en base de datos.',
                'error' => $e->getMessage(),
            ], 500);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Error inesperado al eliminar.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /** Activar una versión (y desactivar las demás) */
    public function activar($id)
    {
        try {
            Institucional::where('activo', true)->update(['activo' => false]);

            $item = Institucional::findOrFail($id);
            $item->activo = true;
            $item->save();

            return response()->json([
                'message' => 'Contenido activado.',
                'data' => $item,
            ], 200);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'No encontrado.',
            ], 404);
        } catch (QueryException $e) {
            return response()->json([
                'message' => 'Error en base de datos.',
                'error' => $e->getMessage(),
            ], 500);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Error inesperado al activar.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
