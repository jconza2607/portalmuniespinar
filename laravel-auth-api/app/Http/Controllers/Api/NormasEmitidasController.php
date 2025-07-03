<?php

// app/Http/Controllers/Api/NormasEmitidasController.php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\NormasEmitidasCategory;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;
use Illuminate\Validation\ValidationException;

class NormasEmitidasController extends Controller
{
    /** 🟢 Público */
    public function index()
    {
        try {
            $data = NormasEmitidasCategory::with([
                'items:id,normas_emitidas_category_id,question,answer,file_path'
            ])->get(['id', 'name']);

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

    /** 🔒 Admin */
    public function adminIndex()
    {
        $data = NormasEmitidasCategory::with('items')->get();
        return response()->json($data, 200);
    }

    public function store(Request $r)
    {
        $validated = $r->validate(['name'=>'required|string|max:255']);
        $cat = NormasEmitidasCategory::create($validated);
        return response()->json(['category'=>$cat], 201);
    }

    public function show($id)
    {
        $cat = NormasEmitidasCategory::with('items')->findOrFail($id);
        return response()->json($cat, 200);
    }

    public function update(Request $r, $id)
    {
        $validated = $r->validate(['name'=>'required|string|max:255']);
        $cat = NormasEmitidasCategory::findOrFail($id);
        $cat->update($validated);
        return response()->json(['category'=>$cat], 200);
    }

    public function destroy($id)
    {
        $cat = NormasEmitidasCategory::findOrFail($id);
        $cat->delete();
        return response()->json(['message'=>'Categoría eliminada'], 200);
    }
}
