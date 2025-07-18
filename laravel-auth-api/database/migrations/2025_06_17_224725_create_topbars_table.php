<?php

// database/migrations/xxxx_xx_xx_create_topbars_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('topbars', function (Blueprint $table) {
            $table->id();
            $table->string('email')->nullable();
            $table->boolean('enabled')->default(true); // activo por defecto
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('topbars');
    }
};

