<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('convocatoria_adjuntos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('convocatoria_id')->constrained()->cascadeOnDelete();
            $table->string('tipo');
            $table->string('file_path');
            $table->string('titulo')->nullable();
            $table->text('descripcion')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('convocatoria_adjuntos');
    }
};
