<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DocGestionCategory;
use App\Models\DocGestionItem;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpException;

class DocGestionController extends Controller
{
    /** 🟢 Público: Obtener todas las categorías con ítems */
    public function index()
    {
        try {
            $data = DocGestionCategory::with('items:id,doc_gestion_category_id,question,answer')
                ->get(['id', 'name']);

            return response()->json($data, 200);

        } catch (QueryException $e) {
            return response()->json([
                'message' => 'Error en la base de datos',
                'error'   => $e->getMessage()
            ], 500);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error inesperado',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    /** 🔒 Admin: Listar todo con relaciones */
    public function adminIndex()
    {
        try {
            $data = DocGestionCategory::with('items')->get();
            return response()->json($data, 200);

        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Error al obtener los documentos',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    /** 🔒 Crear nueva categoría */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => ['required', 'string', 'max:255'],
            ]);

            $category = DocGestionCategory::create($validated);

            return response()->json([
                'message'  => 'Categoría creada',
                'category' => $category
            ], 201);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Error de validación',
                'errors'  => $e->errors()
            ], 422);

        } catch (QueryException $e) {
            return response()->json([
                'message' => 'Error en la base de datos',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    /** 🔒 Mostrar categoría individual */
    public function show($id)
    {
        try {
            $category = DocGestionCategory::with('items')->findOrFail($id);

            return response()->json($category, 200);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Categoría no encontrada'
            ], 404);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error inesperado',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    /** 🔒 Actualizar categoría */
    public function update(Request $request, $id)
    {
        try {
            $validated = $request->validate([
                'name' => ['required', 'string', 'max:255'],
            ]);

            $category = DocGestionCategory::findOrFail($id);
            $category->update($validated);

            return response()->json([
                'message'  => 'Categoría actualizada',
                'category' => $category
            ], 200);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Error de validación',
                'errors'  => $e->errors()
            ], 422);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Categoría no encontrada'
            ], 404);

        } catch (QueryException $e) {
            return response()->json([
                'message' => 'Error en la base de datos',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    /** 🔒 Eliminar categoría */
    public function destroy($id)
    {
        try {
            $category = DocGestionCategory::findOrFail($id);
            $category->delete();

            return response()->json([
                'message' => 'Categoría eliminada'
            ], 200);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Categoría no encontrada'
            ], 404);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error inesperado',
                'error'   => $e->getMessage()
            ], 500);
        }
    }
}
