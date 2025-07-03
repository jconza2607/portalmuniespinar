<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FileController;

Route::get('/archivos/logo/{filename}', [FileController::class, 'logo']);
