<?php

// app/Http/Controllers/Api/DirectorioController.php

namespace App\Http\Controllers\Api;

use App\Models\Directorio;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\JsonResponse;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str; 

use Exception;

class DirectorioController extends Controller
{
    /**
     * 🟢 Listar todos los miembros activos (público)
     */
    public function index(Request $request)
    {
        try {
            $perPage = $request->input('per_page', 5); // por defecto 10
            $items = Directorio::orderBy('orden')->paginate($perPage);

            return response()->json($items);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Error al obtener directorios',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * 🔎 Mostrar un miembro del directorio por ID
     */
    public function show($id): JsonResponse
    {
        try {
            $item = Directorio::findOrFail($id);
            return response()->json($item, 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'No encontrado'], 404);
        } catch (Exception $e) {
            return response()->json(['error' => 'Error al obtener el directorio', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * 🔒 Crear nuevo miembro del directorio
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $data = $request->validate([
                'nombre'     => 'required|string|max:255',
                'cargo'      => 'required|string|max:255',
                'telefono'   => 'nullable|string|max:20',
                'correo'     => 'nullable|email|max:255',
                'area'       => 'nullable|string|max:255',
                'orden'      => 'nullable|integer',
                'activo'     => 'nullable|in:0,1,true,false',
                'autoridad'  => 'nullable|in:0,1,true,false',
                'foto'       => 'nullable|image|max:2048',    // 2 MB máx.
            ]);

            $data['activo']    = filter_var($request->input('activo'), FILTER_VALIDATE_BOOLEAN);
            $data['autoridad'] = filter_var($request->input('autoridad'), FILTER_VALIDATE_BOOLEAN);

            // ⬇️ Si viene foto, guardar con nombre único
            if ($request->hasFile('foto')) {
                $file      = $request->file('foto');
                $extension = $file->getClientOriginalExtension();
                $filename  = Str::uuid() . '.' . $extension;          // evita colisiones
                $data['foto'] = $file->storeAs('directorios', $filename, 'public');
            }

            $directorio = Directorio::create($data);

            return response()->json($directorio, 201);
        } catch (\Throwable $e) {
            Log::error('Error al crear directorio', ['error' => $e->getMessage()]);
            return response()->json([
                'message' => 'Error al crear directorio',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * 🔒 Actualizar un miembro del directorio
     */
    public function update(Request $request, $id): JsonResponse
    {
        try {
            $directorio = Directorio::findOrFail($id);

            // CORRECCIÓN CLAVE: La validación ahora usa 'boolean' que es más robusto.
            $data = $request->validate([
                'nombre'     => 'sometimes|required|string|max:255',
                'cargo'      => 'sometimes|required|string|max:255',
                'telefono'   => 'nullable|string|max:20',
                'correo'     => 'nullable|email|max:255',
                'area'       => 'nullable|string|max:255',
                'orden'      => 'nullable|integer',
                'foto'       => 'nullable|image|max:2048',
                'activo'     => 'nullable|boolean',
                'autoridad'  => 'nullable|boolean',
            ]);

            // CORRECCIÓN CLAVE: Se procesan los booleanos con el método de Laravel.
            // Esto evita el error si los campos no vienen en el request (ej. checkbox sin marcar).
            if ($request->has('activo')) {
                $data['activo'] = $request->boolean('activo');
            }
            if ($request->has('autoridad')) {
                $data['autoridad'] = $request->boolean('autoridad');
            }

            // ⬇️ Reemplazar foto si se envía una nueva
            if ($request->hasFile('foto')) {
                // Borra la existente para no dejar basura en el servidor
                if ($directorio->foto && Storage::disk('public')->exists($directorio->foto)) {
                    Storage::disk('public')->delete($directorio->foto);
                }

                $file = $request->file('foto');
                $extension = $file->getClientOriginalExtension();
                $filename = Str::uuid() . '.' . $extension;
                $data['foto'] = $file->storeAs('directorios', $filename, 'public');
            }

            $directorio->update($data);

            // Devolver el modelo actualizado
            return response()->json($directorio->fresh(), 200);

        } catch (ModelNotFoundException $e) {
            return response()->json(['message' => 'Directorio no encontrado'], 404);
        } catch (ValidationException $e) {
            return response()->json(['message' => 'Datos inválidos', 'errors' => $e->errors()], 422);
        } catch (Exception $e) {
            Log::error('Error al actualizar directorio', [
                'id'    => $id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(), // El trace es muy útil para depurar
            ]);

            return response()->json([
                'message' => 'Error al actualizar el registro',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }
    /**
     * 🔒 Eliminar un miembro del directorio
     */
    public function destroy($id): JsonResponse
    {
        try {
            $directorio = Directorio::findOrFail($id);

            if ($directorio->foto && Storage::disk('public')->exists($directorio->foto)) {
                Storage::disk('public')->delete($directorio->foto);
            }

            $directorio->delete();
            return response()->json(['message' => 'Eliminado correctamente'], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Directorio no encontrado'], 404);
        } catch (Exception $e) {
            return response()->json(['error' => 'Error al eliminar', 'message' => $e->getMessage()], 500);
        }
    }
}