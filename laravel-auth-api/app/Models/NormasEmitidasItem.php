<?php

// app/Models/NormasEmitidasItem.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NormasEmitidasItem extends Model
{
    protected $fillable = [
        'normas_emitidas_category_id',
        'question',
        'answer',
        'file_path',
    ];

    public function category()
    {
        return $this->belongsTo(NormasEmitidasCategory::class, 'normas_emitidas_category_id');
    }
}
