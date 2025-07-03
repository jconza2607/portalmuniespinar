<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\MenuController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\TopbarController;
use App\Http\Controllers\Api\TopbarLogoController;
use App\Http\Controllers\Api\InstitucionalController;
use App\Http\Controllers\Api\DirectorioController;
use App\Http\Controllers\Api\OrganigramaController;
use App\Http\Controllers\Api\DocGestionController;
use App\Http\Controllers\Api\DocGestionItemController;
use App\Http\Controllers\Api\NormasEmitidasController;
use App\Http\Controllers\Api\NormasEmitidasItemController;
use App\Http\Controllers\Api\ConvocatoriaController;
use App\Http\Controllers\Api\ConvocatoriaAdjuntoController;
use App\Http\Controllers\Api\SliderController;
use App\Http\Controllers\Api\SectionImageController;


/* User */
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::get('/user', [AuthController::class, 'user'])->middleware('auth:sanctum');

// RUTA PÚBLICA
Route::get('/menu', [MenuController::class, 'index']);
// RUTAS PROTEGIDAS (auth:sanctum)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/menu', [MenuController::class, 'store']);         // Crear menú
    Route::put('/menu/{id}', [MenuController::class, 'update']);    // Editar menú
    Route::delete('/menu/{id}', [MenuController::class, 'destroy']); // Eliminar menú
});

// 🟢 RUTA PÚBLICA (correo activo)
Route::get('/topbar', [TopbarController::class, 'show']);

// 🔒 RUTAS PROTEGIDAS (solo autenticados con Sanctum)
Route::middleware('auth:sanctum')->prefix('topbars')->group(function () {
    Route::get('/', [TopbarController::class, 'index']);         // Listar
    Route::post('/', [TopbarController::class, 'store']);        // Crear
    Route::put('/{id}', [TopbarController::class, 'update']);    // Editar
    Route::delete('/{id}', [TopbarController::class, 'destroy']); // Eliminar
});

// 🟢 Ruta pública (logo activo)
Route::get('/topbar-logo', [TopbarLogoController::class, 'show']);

// 🔒 Rutas protegidas con Sanctum
Route::middleware('auth:sanctum')->prefix('topbar-logos')->group(function () {
    Route::get('/', [TopbarLogoController::class, 'index']);          // Listar todos
    Route::post('/', [TopbarLogoController::class, 'store']);         // Crear nuevo
    Route::put('/{id}', [TopbarLogoController::class, 'update']);     // Editar (activar/desactivar)
    Route::delete('/{id}', [TopbarLogoController::class, 'destroy']); // Eliminar
});

// 🟢 Ruta pública: obtener solo la versión activa
Route::get('/institucional', [InstitucionalController::class, 'show']);

// 🔒 Rutas protegidas (admin) agrupadas por prefijo
Route::middleware('auth:sanctum')->prefix('institucionales')->group(function () {
    Route::get('/', [InstitucionalController::class, 'index']);         // Listar todos
    Route::post('/', [InstitucionalController::class, 'store']);        // Crear nuevo
    Route::put('/{id}', [InstitucionalController::class, 'update']);    // Editar existente
    Route::delete('/{id}', [InstitucionalController::class, 'destroy']); // Eliminar
    Route::post('/{id}/activar', [InstitucionalController::class, 'activar']); // Activar uno
});

// 🟢 Ruta pública: obtener todos los registros activos
Route::get('/directorio', [DirectorioController::class, 'index']);

// 🔒 Rutas protegidas para administración del directorio
Route::middleware('auth:sanctum')->prefix('directorios')->group(function () {
    Route::get('/', [DirectorioController::class, 'index']);        // Listar todos
    Route::get('/{id}', [DirectorioController::class, 'show']);     // Mostrar uno
    Route::post('/', [DirectorioController::class, 'store']);       // Crear
    Route::put('/{id}', [DirectorioController::class, 'update']);   // Editar
    Route::delete('/{id}', [DirectorioController::class, 'destroy']); // Eliminar
});

// 🟢 Ruta pública: obtener todo el organigrama activo (solo nodos con 'activo' = true)
Route::get('/organigrama', [OrganigramaController::class, 'index']); // público

// 🔒 Rutas protegidas: administración del organigrama
Route::middleware('auth:sanctum')->prefix('organigramas')->group(function () {
    Route::get('/', [OrganigramaController::class, 'adminIndex']);   // Listar todo (admin)
    Route::get('/{id}', [OrganigramaController::class, 'show']);     // Ver nodo individual
    Route::post('/', [OrganigramaController::class, 'store']);       // Crear nuevo nodo
    Route::put('/{id}', [OrganigramaController::class, 'update']);   // Editar nodo
    Route::delete('/{id}', [OrganigramaController::class, 'destroy']); // Eliminar nodo
});

// 🟢 Pública: obtener documentos de gestión agrupados
Route::get('/doc-gestion', [DocGestionController::class, 'index']);

// 🔒 Protegidas: CRUD solo para autenticados
Route::middleware('auth:sanctum')->prefix('doc-gestion')->group(function () {
    Route::get('/', [DocGestionController::class, 'adminIndex']);     // Listar todo
    Route::get('/{id}', [DocGestionController::class, 'show']);       // Ver categoría + ítems
    Route::post('/', [DocGestionController::class, 'store']);         // Crear
    Route::put('/{id}', [DocGestionController::class, 'update']);     // Editar
    Route::delete('/{id}', [DocGestionController::class, 'destroy']); // Eliminar
});

Route::middleware('auth:sanctum')->prefix('doc-gestion-items')->group(function () {
    Route::get('/categoria/{categoryId}', [DocGestionItemController::class, 'indexByCategory']);
    Route::post('/', [DocGestionItemController::class, 'store']);
    Route::put('/{id}', [DocGestionItemController::class, 'update']);
    Route::delete('/{id}', [DocGestionItemController::class, 'destroy']);
});

// 🟢 Pública
Route::get('/normas-emitidas-publico', [NormasEmitidasController::class, 'index']);

// 🔒 Categorías
Route::middleware('auth:sanctum')->prefix('normas-emitidas')->group(function () {
    Route::get('/', [NormasEmitidasController::class, 'adminIndex']);
    Route::get('/{id}', [NormasEmitidasController::class, 'show']);
    Route::post('/', [NormasEmitidasController::class, 'store']);
    Route::put('/{id}', [NormasEmitidasController::class, 'update']);
    Route::delete('/{id}', [NormasEmitidasController::class, 'destroy']);
});

// 🔒 Ítems
Route::middleware('auth:sanctum')->prefix('normas-emitidas-items')->group(function () {
    Route::get('/categoria/{categoryId}', [NormasEmitidasItemController::class, 'indexByCategory']);
    Route::post('/', [NormasEmitidasItemController::class, 'store']);
    Route::post('/{id}', [NormasEmitidasItemController::class, 'update']); // usa _method=PUT
    Route::delete('/{id}', [NormasEmitidasItemController::class, 'destroy']);
});

Route::get('/convocatorias',          [ConvocatoriaController::class, 'index']);
Route::get('/convocatorias/{id}',     [ConvocatoriaController::class, 'show']);

Route::middleware('auth:sanctum')->prefix('convocatorias')->group(function () {
    Route::post('/',        [ConvocatoriaController::class, 'store']);
    Route::put('/{id}',    [ConvocatoriaController::class, 'update']);  // ← spoof PUT
    Route::delete('/{id}',  [ConvocatoriaController::class, 'destroy']);
});

Route::middleware('auth:sanctum')->prefix('convocatoria-adjuntos')->group(function () {
    Route::post('/',        [ConvocatoriaAdjuntoController::class, 'store']);
    Route::put('/{id}',    [ConvocatoriaAdjuntoController::class, 'update']); // ← spoof PUT
    Route::delete('/{id}',  [ConvocatoriaAdjuntoController::class, 'destroy']);
});

// 🟢 Pública
Route::get('/sliders-publico', [SliderController::class, 'index']);
Route::get('/sliders-publico/{id}', [SliderController::class, 'show']);

// 🔒 Admin (auth:sanctum)
Route::middleware('auth:sanctum')->prefix('sliders')->group(function () {
    Route::get('/', [SliderController::class, 'index']);           // (opcional: vista completa admin)
    Route::get('/{id}', [SliderController::class, 'show']);
    Route::post('/', [SliderController::class, 'store']);
    Route::put('/{id}', [SliderController::class, 'update']);
    Route::delete('/{id}', [SliderController::class, 'destroy']);
});

// 🟢 Pública
Route::get('/secciones/{section}', [SectionImageController::class, 'public']);

// 🔒 Admin
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/secciones', [SectionImageController::class, 'index']);
    Route::post('/secciones', [SectionImageController::class, 'store']);
    Route::get('/secciones/{id}', [SectionImageController::class, 'show']);
    Route::put('/secciones/{id}', [SectionImageController::class, 'update']);
    Route::delete('/secciones/{id}', [SectionImageController::class, 'destroy']);
});