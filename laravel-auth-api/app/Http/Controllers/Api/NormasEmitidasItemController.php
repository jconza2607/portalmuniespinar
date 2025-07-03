<?php

// app/Http/Controllers/Api/NormasEmitidasItemController.php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\NormasEmitidasItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class NormasEmitidasItemController extends Controller
{
    public function indexByCategory($categoryId)
    {
        return response()->json(
            NormasEmitidasItem::where('normas_emitidas_category_id',$categoryId)->get(), 200
        );
    }

    public function store(Request $r)
    {
        $v = $r->validate([
            'normas_emitidas_category_id'=>'required|exists:normas_emitidas_categories,id',
            'question'=>'required|string',
            'answer'=>'required|string',
            'file'=>'nullable|file|mimes:pdf|max:5120',
        ]);

        if ($r->hasFile('file')) {
            $name   = Str::slug(pathinfo($r->file('file')->getClientOriginalName(), PATHINFO_FILENAME));
            $v['file_path'] = $r->file('file')
                                ->storeAs('normas-emitidas', time().'_'.$name.'.pdf','public');
        }

        return response()->json(['item'=>NormasEmitidasItem::create($v)], 201);
    }

    public function update(Request $r, $id)
    {
        $item = NormasEmitidasItem::findOrFail($id);

        $v = $r->validate([
            'question'=>'required|string',
            'answer'=>'required|string',
            'file'=>'nullable|file|mimes:pdf|max:5120',
        ]);

        if ($r->hasFile('file')) {
            if ($item->file_path && Storage::disk('public')->exists($item->file_path)) {
                Storage::disk('public')->delete($item->file_path);
            }
            $name   = Str::slug(pathinfo($r->file('file')->getClientOriginalName(), PATHINFO_FILENAME));
            $v['file_path'] = $r->file('file')
                                ->storeAs('normas-emitidas', time().'_'.$name.'.pdf','public');
        }

        $item->update($v);
        return response()->json(['item'=>$item], 200);
    }

    public function destroy($id)
    {
        $item = NormasEmitidasItem::findOrFail($id);
        if ($item->file_path && Storage::disk('public')->exists($item->file_path)) {
            Storage::disk('public')->delete($item->file_path);
        }
        $item->delete();
        return response()->json(['message'=>'Ítem eliminado'], 200);
    }
}

