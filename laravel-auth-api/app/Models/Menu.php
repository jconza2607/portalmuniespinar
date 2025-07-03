<?php

// app/Models/Menu.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Menu extends Model
{
    protected $fillable = [
        'label',
        'href',
        'icon',            // ← importante incluirlo aquí
        'parent_id',
        'enabled',
    ];

    public function children()
    {
        return $this->hasMany(Menu::class, 'parent_id');
    }
}