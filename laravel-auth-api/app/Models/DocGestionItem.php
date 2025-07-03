<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DocGestionItem extends Model
{
    protected $fillable = ['doc_gestion_category_id', 'question', 'answer','file_path',];

    public function category(): BelongsTo
    {
        return $this->belongsTo(DocGestionCategory::class);
    }
}
