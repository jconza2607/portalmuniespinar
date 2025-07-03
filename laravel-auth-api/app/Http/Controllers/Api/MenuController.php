<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Menu;
use Illuminate\Http\Request;

class MenuController extends Controller
{
    // ✅ LISTAR (PÚBLICO)
    public function index()
    {
        $menus = Menu::whereNull('parent_id')
            ->where('enabled', true)
            ->with(['children' => function ($query) {
                $query->where('enabled', true);
            }])
            ->get();

        return response()->json($menus);
    }

    // 🔒 CREAR (PROTEGIDO)
    public function store(Request $request)
    {
        $validated = $request->validate([
            'label' => 'required|string|max:255',
            'href' => 'nullable|string|max:255',
            'icon' => 'nullable|string|max:255',       // ← nuevo campo
            'parent_id' => 'nullable|exists:menus,id',
            'enabled' => 'required|boolean',
        ]);

        $menu = Menu::create($validated);

        return response()->json($menu, 201);
    }

    // 🔒 ACTUALIZAR (PROTEGIDO)
    public function update(Request $request, $id)
    {
        $menu = Menu::findOrFail($id);

        $validated = $request->validate([
            'label' => 'required|string|max:255',
            'href' => 'nullable|string|max:255',
            'icon' => 'nullable|string|max:255',       // ← nuevo campo
            'parent_id' => 'nullable|exists:menus,id',
            'enabled' => 'required|boolean',
        ]);

        $menu->update($validated);

        return response()->json($menu);
    }

    // 🔒 ELIMINAR (PROTEGIDO)
    public function destroy($id)
    {
        $menu = Menu::findOrFail($id);
        $menu->delete();

        return response()->json(['message' => 'Menú eliminado']);
    }
}
