<?php

// app/Models/NormasEmitidasCategory.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NormasEmitidasCategory extends Model
{
    protected $fillable = ['name'];

    public function items()
    {
        return $this->hasMany(NormasEmitidasItem::class, 'normas_emitidas_category_id');
    }
}
