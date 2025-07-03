<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DocGestionItem;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class DocGestionItemController extends Controller
{
    /** 🔒 Obtener ítems por categoría */
    public function indexByCategory($categoryId)
    {
        try {
            $items = DocGestionItem::where('doc_gestion_category_id', $categoryId)->get();
            return response()->json($items, 200);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Error al obtener los documentos',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    /** 🔒 Crear nuevo ítem */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'doc_gestion_category_id' => ['required', 'exists:doc_gestion_categories,id'],
                'question' => ['required', 'string'],
                'answer'   => ['required', 'string'],
                'file'     => ['nullable', 'file', 'mimes:pdf', 'max:5120'],
            ]);

            if ($request->hasFile('file')) {
                $originalName = pathinfo($request->file('file')->getClientOriginalName(), PATHINFO_FILENAME);
                $slugName = Str::slug($originalName);
                $ext = $request->file('file')->getClientOriginalExtension();
                $filename = time() . '_' . $slugName . '.' . $ext;
                $validated['file_path'] = $request->file('file')->storeAs('doc-gestion', $filename, 'public');
            }

            $item = DocGestionItem::create($validated);

            return response()->json([
                'message' => 'Documento creado',
                'item'    => $item
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Error de validación',
                'errors'  => $e->errors()
            ], 422);
        } catch (QueryException $e) {
            return response()->json([
                'message' => 'Error en base de datos',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    /** 🔒 Editar ítem */
    public function update(Request $request, $id)
    {
        try {
            $validated = $request->validate([
                'question' => ['required', 'string'],
                'answer'   => ['required', 'string'],
                'file'     => ['nullable', 'file', 'mimes:pdf', 'max:5120'],
            ]);

            $item = DocGestionItem::findOrFail($id);

            if ($request->hasFile('file')) {
                if ($item->file_path && Storage::disk('public')->exists($item->file_path)) {
                    Storage::disk('public')->delete($item->file_path);
                }

                $originalName = pathinfo($request->file('file')->getClientOriginalName(), PATHINFO_FILENAME);
                $slugName = Str::slug($originalName);
                $ext = $request->file('file')->getClientOriginalExtension();
                $filename = time() . '_' . $slugName . '.' . $ext;
                $validated['file_path'] = $request->file('file')->storeAs('doc-gestion', $filename, 'public');
            }

            $item->update($validated);

            return response()->json([
                'message' => 'Documento actualizado',
                'item'    => $item
            ], 200);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Error de validación',
                'errors'  => $e->errors()
            ], 422);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Documento no encontrado'
            ], 404);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Error inesperado',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    /** 🔒 Eliminar ítem */
    public function destroy($id)
    {
        try {
            $item = DocGestionItem::findOrFail($id);

            if ($item->file_path && Storage::disk('public')->exists($item->file_path)) {
                Storage::disk('public')->delete($item->file_path);
            }

            $item->delete();

            return response()->json([
                'message' => 'Documento eliminado'
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Documento no encontrado'
            ], 404);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Error inesperado',
                'error'   => $e->getMessage()
            ], 500);
        }
    }
}
