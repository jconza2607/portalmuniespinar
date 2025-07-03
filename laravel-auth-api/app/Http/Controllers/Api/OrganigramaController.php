<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Organigrama;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpException;

class OrganigramaController extends Controller
{
    // 🔓 Listar todos los nodos activos en modo árbol
    public function index()
    {
        try {
            $tree = Organigrama::whereNull('parent_id')
                ->where('activo', true)
                ->with('childrenRecursive')
                ->orderBy('orden')
                ->get();

            return response()->json($tree);
        } catch (QueryException $e) {
            return response()->json([
                'message' => 'Error al obtener el organigrama.',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    // GET /api/organigramas (privado)
    public function adminIndex()
    {
        try {
            $tree = Organigrama::whereNull('parent_id')
                ->with('childrenRecursive')
                ->orderBy('orden')
                ->get();

            return response()->json($tree);
        } catch (QueryException $e) {
            return response()->json([
                'message' => 'Error al obtener el organigrama.',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    // 🔐 Mostrar un nodo específico
    public function show($id)
    {
        try {
            $item = Organigrama::with('children')->findOrFail($id);
            return response()->json($item);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Nodo no encontrado.'
            ], 404);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al mostrar el nodo.',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    // 🔐 Crear un nuevo nodo
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'nombre'    => 'required|string|max:255',
                'parent_id' => 'nullable|exists:organigramas,id',
                'orden'     => 'nullable|integer',
                'activo'    => 'boolean'
            ]);

            $node = Organigrama::create($validated);

            return response()->json($node, 201);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Error de validación.',
                'errors'  => $e->errors()
            ], 422);

        } catch (QueryException $e) {
            return response()->json([
                'message' => 'Error al crear el nodo.',
                'error'   => $e->getMessage()
            ], 500);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error inesperado al crear el nodo.',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    // 🔐 Actualizar un nodo existente
    public function update(Request $request, $id)
    {
        try {
            $node = Organigrama::findOrFail($id);

            $validated = $request->validate([
                'nombre'    => 'required|string|max:255',
                'parent_id' => 'nullable|exists:organigramas,id',
                'orden'     => 'nullable|integer',
                'activo'    => 'boolean'
            ]);

            $node->update($validated);

            return response()->json($node);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Error de validación.',
                'errors'  => $e->errors()
            ], 422);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Nodo no encontrado.'
            ], 404);

        } catch (QueryException $e) {
            return response()->json([
                'message' => 'Error al actualizar el nodo.',
                'error'   => $e->getMessage()
            ], 500);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error inesperado al actualizar el nodo.',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    // 🔐 Eliminar un nodo
    public function destroy($id)
    {
        try {
            $node = Organigrama::findOrFail($id);

            if ($node->children()->count() > 0) {
                return response()->json([
                    'message' => 'No se puede eliminar: el nodo tiene subniveles.'
                ], 400);
            }

            $node->delete();

            return response()->json([
                'message' => 'Nodo eliminado correctamente.'
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json(['message' => 'Nodo no encontrado.'], 404);
        } catch (QueryException $e) {
            return response()->json([
                'message' => 'Error al eliminar el nodo.',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

}
