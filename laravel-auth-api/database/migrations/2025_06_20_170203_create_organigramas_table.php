<?php

// database/migrations/xxxx_xx_xx_create_organigramas_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('organigramas', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->unsignedBigInteger('parent_id')->nullable();
            $table->integer('orden')->default(0);
            $table->boolean('activo')->default(true);
            $table->timestamps();

            $table->foreign('parent_id')->references('id')->on('organigramas')->onDelete('cascade');
        });
    }

    public function down(): void {
        Schema::dropIfExists('organigramas');
    }
};
