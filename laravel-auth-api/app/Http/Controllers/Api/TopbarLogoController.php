<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\TopbarLogo;
use Illuminate\Database\QueryException;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class TopbarLogoController extends Controller
{
    /*** 🔍 Listar todos los logos (admin) */
    public function index()
    {
        try {
            return response()->json(TopbarLogo::all(), 200);
        } catch (QueryException $e) {
            return response()->json(['message' => 'Error en la base de datos', 'error' => $e->getMessage()], 500);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error inesperado', 'error' => $e->getMessage()], 500);
        }
    }

    /*** 📩 Mostrar el logo activo (público) */
    public function show()
    {
        try {
            $logo = TopbarLogo::where('enabled', true)->latest()->first();
            return response()->json($logo, 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'No se pudo cargar el logo', 'error' => $e->getMessage()], 500);
        }
    }

    /*** ✅ Subir nuevo logo */
    public function store(Request $request)
    {
        try {
            $request->validate([
                'logo'    => 'required|file|mimes:jpg,jpeg,png,svg,webp,gif',
                'enabled' => 'required|boolean',
            ]);

            $file = $request->file('logo');
            $filename = uniqid() . '.' . $file->getClientOriginalExtension();
            /* $destinationPath = '/mnt/portalweb/logo/'; */
            $destinationPath = 'z:\\';

            // Validación de escritura
            if (!is_writable($destinationPath)) {
                return response()->json(['message' => 'No se puede escribir en el directorio de destino'], 500);
            }

            // Intenta mover
            $file->move($destinationPath, $filename);

            // Desactiva otros si se activa este
            if ($request->enabled) {
                TopbarLogo::where('enabled', true)->update(['enabled' => false]);
            }

            $logo = TopbarLogo::create([
                'filename' => $destinationPath . $filename,
                'enabled' => $request->enabled,
            ]);

            return response()->json(['message' => 'Logo subido correctamente', 'data' => $logo], 201);

        } catch (\Exception $e) {
            \Log::error('Error al subir logo: ' . $e->getMessage());
            return response()->json(['message' => 'Error al subir logo', 'error' => $e->getMessage()], 500);
        }
    }

    /*** ✏️ Editar un logo existente */
    public function update(Request $request, $id)
    {
        try {
            $logo = TopbarLogo::findOrFail($id);

            $validated = $request->validate([
                'enabled' => 'required|boolean',
                'logo'    => 'nullable|mimes:png,svg|max:2048',
            ]);

            // Desactivar otros si este se activa
            if ($validated['enabled']) {
                TopbarLogo::where('enabled', true)->where('id', '!=', $id)->update(['enabled' => false]);
            }

            // Si se sube un nuevo archivo, reemplazar
            if ($request->hasFile('logo')) {
                $file = $request->file('logo');
                $filename = uniqid() . '.' . $file->getClientOriginalExtension();
                $path = '/mnt/portalweb/logo/' . $filename;

                $file->move('/mnt/portalweb/logo/', $filename);
                $logo->filename = $path;
            }

            $logo->enabled = $validated['enabled'];
            $logo->save();

            return response()->json(['message' => 'Logo actualizado correctamente.', 'data' => $logo], 200);

        } catch (ModelNotFoundException $e) {
            return response()->json(['message' => 'Logo no encontrado'], 404);
        } catch (ValidationException $e) {
            return response()->json(['message' => 'Error de validación', 'errors' => $e->errors()], 422);
        } catch (\Throwable $e) {
            return response()->json(['message' => 'Error inesperado', 'error' => $e->getMessage()], 500);
        }
    }

    /*** 🗑️ Eliminar un logo */
    public function destroy($id)
    {
        try {
            $logo = TopbarLogo::findOrFail($id);

            // Eliminar archivo del NAS
            $filepath = "/mnt/portalweb/logo/" . $logo->filename;
            if (file_exists($filepath)) {
                unlink($filepath);
            }

            // Eliminar de la base de datos
            $logo->delete();

            return response()->json(['message' => 'Logo eliminado correctamente.'], 200);

        } catch (ModelNotFoundException $e) {
            return response()->json(['message' => 'Logo no encontrado'], 404);
        } catch (QueryException $e) {
            return response()->json(['message' => 'Error en la base de datos', 'error' => $e->getMessage()], 500);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error inesperado', 'error' => $e->getMessage()], 500);
        }
    }
}
