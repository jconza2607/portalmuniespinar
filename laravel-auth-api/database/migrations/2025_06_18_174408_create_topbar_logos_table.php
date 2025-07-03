<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::create('topbar_logos', function (Blueprint $table) {
        $table->id();
        $table->string('filename');         // nombre del archivo subido
        $table->boolean('enabled')->default(false); // si está activo
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('topbar_logos');
    }
};
