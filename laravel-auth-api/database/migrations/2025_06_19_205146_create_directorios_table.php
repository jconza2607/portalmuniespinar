<?php

// database/migrations/xxxx_xx_xx_create_directorios_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('directorios', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->string('cargo');
            $table->string('telefono')->nullable();
            $table->string('correo')->nullable();     // ← agregado
            $table->string('area')->nullable();       // ← agregado
            $table->string('foto')->nullable();       // Ruta relativa al storage
            $table->unsignedInteger('orden')->default(0);
            $table->boolean('activo')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('directorios');
    }
};

