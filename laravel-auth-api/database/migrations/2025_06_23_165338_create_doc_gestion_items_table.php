<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('doc_gestion_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('doc_gestion_category_id')->constrained()->onDelete('cascade');
            $table->string('question');
            $table->text('answer');
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('doc_gestion_items');
    }
};

