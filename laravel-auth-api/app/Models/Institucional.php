<?php

// app/Models/Institucional.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Institucional extends Model
{
    protected $table = 'institucionales';
    
    protected $fillable = [
        'vision',
        'mision',
        'imagen',
        'activo',
    ];
}
