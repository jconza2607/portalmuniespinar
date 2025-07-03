<?php

// app/Models/Organigrama.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Organigrama extends Model
{
    protected $fillable = ['nombre', 'parent_id', 'orden', 'activo'];

    public function children(): HasMany {
        return $this->hasMany(Organigrama::class, 'parent_id')->orderBy('orden');
    }

    public function parent() {
        return $this->belongsTo(Organigrama::class, 'parent_id');
    }

    public function childrenRecursive()
    {
        return $this->children()->with('childrenRecursive');
    }
}
