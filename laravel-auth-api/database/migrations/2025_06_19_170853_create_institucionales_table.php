<?php

// database/migrations/xxxx_xx_xx_create_institucionales_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('institucionales', function (Blueprint $table) {
            $table->id();
            $table->text('vision');
            $table->text('mision');
            $table->string('imagen')->nullable();  // ruta de la imagen
            $table->boolean('activo')->default(false); // solo uno puede estar activo
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('institucionales');
    }
};

