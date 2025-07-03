<?php
// app/Models/Convocatoria.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Convocatoria extends Model
{
    protected $fillable = ['titulo', 'descripcion_corta', 'fecha_cierre', 'activo'];

    public function adjuntos() {
        return $this->hasMany(ConvocatoriaAdjunto::class);
    }
}
