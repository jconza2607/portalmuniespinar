<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\SectionImage;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;

class SectionImageController extends Controller
{
    public function index()
    {
        try {
            $images = SectionImage::orderBy('section')->get()->map(function ($img) {
                return [
                    'id' => $img->id,
                    'section' => $img->section,
                    'label' => $img->label,
                    'image_url' => asset('storage/' . $img->image_path),
                ];
            });

            return response()->json($images);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Error al obtener imágenes',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getBySection($section) {
        $image = SectionImage::where('section', $section)->where('active', true)->first();
        if (!$image) return response()->json(['message' => 'No encontrada'], 404);

        return response()->json([
            'section' => $image->section,
            'image_url' => asset('storage/' . $image->image_path),
        ]);
    }

    public function store(Request $request) {
        $validated = $request->validate([
            'section' => 'required|string|unique:section_images',
            'image' => 'required|image|max:2048',
            'active' => 'boolean'
        ]);

        $filename = time().'_'.Str::slug($request->section).'.'.$request->file('image')->getClientOriginalExtension();
        $validated['image_path'] = $request->file('image')->storeAs('sections', $filename, 'public');

        $image = SectionImage::create($validated);

        return response()->json(['message' => 'Imagen creada.', 'id' => $image->id], 201);
    }

    public function update(Request $request, $id) {
        $image = SectionImage::findOrFail($id);

        $validated = $request->validate([
            'section' => 'sometimes|required|string|unique:section_images,section,' . $id,
            'image' => 'nullable|image|max:2048',
            'active' => 'boolean'
        ]);

        if ($request->hasFile('image')) {
            if ($image->image_path && Storage::disk('public')->exists($image->image_path)) {
                Storage::disk('public')->delete($image->image_path);
            }
            $filename = time().'_'.Str::slug($request->section ?? $image->section).'.'.$request->file('image')->getClientOriginalExtension();
            $validated['image_path'] = $request->file('image')->storeAs('sections', $filename, 'public');
        }

        $image->update($validated);

        return response()->json(['message' => 'Actualizado correctamente.']);
    }

    public function destroy($id) {
        $image = SectionImage::findOrFail($id);

        if ($image->image_path && Storage::disk('public')->exists($image->image_path)) {
            Storage::disk('public')->delete($image->image_path);
        }

        $image->delete();
        return response()->json(['message' => 'Eliminado correctamente.']);
    }
}