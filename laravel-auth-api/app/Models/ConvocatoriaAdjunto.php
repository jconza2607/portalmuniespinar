<?php
// app/Models/ConvocatoriaAdjunto.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ConvocatoriaAdjunto extends Model
{
    protected $fillable = ['convocatoria_id', 'tipo', 'file_path', 'titulo', 'descripcion'];

    public function convocatoria() {
        return $this->belongsTo(Convocatoria::class);
    }
}
