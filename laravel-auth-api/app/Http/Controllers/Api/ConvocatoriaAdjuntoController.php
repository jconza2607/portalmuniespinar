<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ConvocatoriaAdjunto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ConvocatoriaAdjuntoController extends Controller
{
    // CREAR
    public function store(Request $request)
    {
        $data = $request->validate([
            'convocatoria_id' => 'required|exists:convocatorias,id',
            'tipo'            => 'required|string',
            'file'            => 'required|file|mimes:pdf|max:5120',
            'titulo'          => 'nullable|string',
            'descripcion'     => 'nullable|string',
        ]);

        $data['file_path'] = $request->file('file')->store('convocatorias', 'public');
        unset($data['file']);

        $adjunto = ConvocatoriaAdjunto::create($data);
        return response()->json(['message' => 'Adjunto creado', 'data' => $adjunto], 201);
    }

    // ACTUALIZAR
    public function update(Request $request, $id)
    {
        $adjunto = ConvocatoriaAdjunto::findOrFail($id);

        $data = $request->validate([
            'tipo'        => 'sometimes|required|string',
            'titulo'      => 'nullable|string',
            'descripcion' => 'nullable|string',
            'file'        => 'nullable|file|mimes:pdf|max:5120',
        ]);

        if ($request->hasFile('file')) {
            Storage::disk('public')->delete($adjunto->file_path);
            $data['file_path'] = $request->file('file')->store('convocatorias', 'public');
        }

        $adjunto->update($data);

        return response()->json(['message' => 'Adjunto actualizado', 'data' => $adjunto]);
    }

    // ELIMINAR
    public function destroy($id)
    {
        $adjunto = ConvocatoriaAdjunto::findOrFail($id);
        Storage::disk('public')->delete($adjunto->file_path);
        $adjunto->delete();

        return response()->json(['message' => 'Adjunto eliminado']);
    }
}
