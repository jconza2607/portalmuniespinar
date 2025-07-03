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
        Schema::create('normas_emitidas_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('normas_emitidas_category_id')->constrained()->onDelete('cascade');
            $table->string('question');
            $table->text('answer');
            $table->string('file_path')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('normas_emitidas_items');
    }
};
