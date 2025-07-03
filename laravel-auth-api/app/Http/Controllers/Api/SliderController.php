<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Slider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Database\QueryException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;

class SliderController extends Controller
{
    public function index()
    {
        try {
            $sliders = Slider::orderBy('order')->get()->map(function ($s) {
                return [
                    'id' => $s->id,
                    'title' => $s->title,
                    'subtitle' => $s->subtitle,
                    'image_url' => asset('storage/' . $s->image_path),
                    'button' => [
                        'text' => $s->button_text,
                        'link' => $s->button_link,
                    ],
                    'button2' => [
                        'text' => $s->button2_text,
                        'link' => $s->button2_link,
                    ],
                    'order' => $s->order,
                    'active' => $s->active,
                ];
            });

            return response()->json($sliders, 200);
        } catch (QueryException $e) {
            return response()->json(['message' => 'Error de base de datos', 'error' => $e->getMessage()], 500);
        } catch (\Throwable $e) {
            return response()->json(['message' => 'Error inesperado', 'error' => $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        try {
            $slider = Slider::findOrFail($id);

            return response()->json([
                'id' => $slider->id,
                'title' => $slider->title,
                'subtitle' => $slider->subtitle,
                'image_url' => asset('storage/' . $slider->image_path),
                'button' => [
                    'text' => $slider->button_text,
                    'link' => $slider->button_link,
                ],
                'button2' => [
                    'text' => $slider->button2_text,
                    'link' => $slider->button2_link,
                ],
                'order' => $slider->order,
                'active' => $slider->active,
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json(['message' => 'Slider no encontrado'], 404);
        } catch (\Throwable $e) {
            return response()->json(['message' => 'Error inesperado', 'error' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'title' => 'string',
                'subtitle' => 'string',
                'image' => 'required|image|mimes:jpg,jpeg,png,webp|max:202048',
                'button_text' => 'string',
                'button_link' => 'url',
                'button2_text' => 'string',
                'button2_link' => 'url',
                'order' => 'nullable|integer',
                'active' => 'boolean',
            ]);

            $original = pathinfo($request->file('image')->getClientOriginalName(), PATHINFO_FILENAME);
            $slug = Str::slug($original, '_') ?: 'imagen';
            $ext = $request->file('image')->getClientOriginalExtension();
            $imageName = time() . '_' . $slug . '.' . $ext;
            $validated['image_path'] = $request->file('image')->storeAs('sliders', $imageName, 'public');

            $slider = Slider::create($validated);

            return response()->json(['message' => 'Slider creado correctamente.'], 201);
        } catch (ValidationException $e) {
            return response()->json(['message' => 'Error de validación', 'errors' => $e->errors()], 422);
        } catch (QueryException $e) {
            return response()->json(['message' => 'Error de base de datos', 'error' => $e->getMessage()], 500);
        } catch (\Throwable $e) {
            return response()->json(['message' => 'Error inesperado', 'error' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $slider = Slider::findOrFail($id);

            $validated = $request->validate([
                'title' => 'sometimes|required|string',
                'subtitle' => 'nullable|string',
                'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
                'button_text' => 'nullable|string',
                'button_link' => 'nullable|url',
                'button2_text' => 'nullable|string',
                'button2_link' => 'nullable|url',
                'order' => 'nullable|integer',
                'active' => 'boolean',
            ]);

            if ($request->hasFile('image')) {
                if ($slider->image_path && Storage::disk('public')->exists($slider->image_path)) {
                    Storage::disk('public')->delete($slider->image_path);
                }
                $original = pathinfo($request->file('image')->getClientOriginalName(), PATHINFO_FILENAME);
                $slug = Str::slug($original, '_') ?: 'imagen';
                $ext = $request->file('image')->getClientOriginalExtension();
                $imageName = time() . '_' . $slug . '.' . $ext;
                $validated['image_path'] = $request->file('image')->storeAs('sliders', $imageName, 'public');
            }

            $slider->update($validated);

            return response()->json(['message' => 'Slider actualizado correctamente.'], 200);
        } catch (ValidationException $e) {
            return response()->json(['message' => 'Error de validación', 'errors' => $e->errors()], 422);
        } catch (ModelNotFoundException $e) {
            return response()->json(['message' => 'Slider no encontrado'], 404);
        } catch (QueryException $e) {
            return response()->json(['message' => 'Error de base de datos', 'error' => $e->getMessage()], 500);
        } catch (\Throwable $e) {
            return response()->json(['message' => 'Error inesperado', 'error' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $slider = Slider::findOrFail($id);

            if ($slider->image_path && Storage::disk('public')->exists($slider->image_path)) {
                Storage::disk('public')->delete($slider->image_path);
            }

            $slider->delete();

            return response()->json(['message' => 'Slider eliminado correctamente.'], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['message' => 'Slider no encontrado'], 404);
        } catch (QueryException $e) {
            return response()->json(['message' => 'Error de base de datos', 'error' => $e->getMessage()], 500);
        } catch (\Throwable $e) {
            return response()->json(['message' => 'Error inesperado', 'error' => $e->getMessage()], 500);
        }
    }
}
