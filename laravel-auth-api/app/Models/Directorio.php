<?php

// app/Models/Directorio.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Directorio extends Model
{
    use HasFactory;

    protected $fillable = [
        'nombre',
        'cargo',
        'telefono',
        'correo',      // ← agregado
        'area',        // ← agregado
        'foto',
        'orden',
        'activo',
        'autoridad'
    ];
}

