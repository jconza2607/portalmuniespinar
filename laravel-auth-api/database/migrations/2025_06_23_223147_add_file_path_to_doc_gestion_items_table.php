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
        Schema::table('doc_gestion_items', function (Blueprint $table) {
            $table->string('file_path')->nullable()->after('answer'); // o después del campo que prefieras
        });
    }

    public function down()
    {
        Schema::table('doc_gestion_items', function (Blueprint $table) {
            $table->dropColumn('file_path');
        });
    }

};
