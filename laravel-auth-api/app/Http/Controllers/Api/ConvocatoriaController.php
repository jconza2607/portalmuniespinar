<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Convocatoria;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class ConvocatoriaController extends Controller
{
    public function index()
    {
        return Convocatoria::with('adjuntos')
               ->latest()
               ->get();
    }

    public function show(Request $request, $id)
    {
        try {
            $perPage = $request->query('per_page', 5);
            $convocatoria = Convocatoria::findOrFail($id);

            return response()->json([
                ...$convocatoria->only(['id','titulo','descripcion_corta','fecha_cierre','activo']),
                'adjuntos' => $convocatoria->adjuntos()->latest()->paginate($perPage),
            ]);
        } catch (ModelNotFoundException) {
            return response()->json(['message' => 'Convocatoria no encontrada'], 404);
        }
    }

    public function store(Request $request)
    {
        $base = $request->validate([
            'titulo'            => 'required|string|max:255',
            'descripcion_corta' => 'nullable|string',
            'fecha_cierre'      => 'nullable|date',
            'activo'            => 'boolean',
        ]);

        $conv = Convocatoria::create($base);

        if ($request->has('adjuntos')) {
            $request->validate([
                'adjuntos'              => 'array',
                'adjuntos.*.tipo'       => 'required|string',
                'adjuntos.*.file'       => 'required|file|mimes:pdf|max:5120',
                'adjuntos.*.titulo'     => 'nullable|string',
                'adjuntos.*.descripcion'=> 'nullable|string',
            ]);

            foreach ($request->adjuntos as $a) {
                $path = $a['file']->store('convocatorias', 'public');
                $conv->adjuntos()->create([
                    'tipo'        => $a['tipo'],
                    'file_path'   => $path,
                    'titulo'      => $a['titulo']      ?? null,
                    'descripcion' => $a['descripcion'] ?? null,
                ]);
            }
        }

        return response()->json(['message' => 'Creada', 'data' => $conv->load('adjuntos')], 201);
    }

    public function update(Request $request, $id)
    {
        $conv = Convocatoria::findOrFail($id);

        $data = $request->validate([
            'titulo'            => 'sometimes|required|string|max:255',
            'descripcion_corta' => 'nullable|string',
            'fecha_cierre'      => 'nullable|date',
            'activo'            => 'boolean',
        ]);

        $conv->update($data);

        return response()->json(['message' => 'Actualizada', 'data' => $conv], 200);
    }

    public function destroy($id)
    {
        $conv = Convocatoria::with('adjuntos')->findOrFail($id);

        foreach ($conv->adjuntos as $a) {
            Storage::disk('public')->delete($a->file_path);
        }
        $conv->delete();

        return response()->json(['message' => 'Eliminada'], 200);
    }
}
