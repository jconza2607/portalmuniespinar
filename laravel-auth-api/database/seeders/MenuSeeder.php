<?php

// database/seeders/MenuSeeder.php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;

class MenuSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();

        DB::table('menus')->insert([
            [ 'id' => 1, 'label' => 'Dashboard',           'icon' => 'icofont-users', 'href' => 'dashboard',              'parent_id' => null,  'enabled' => true, 'created_at' => $now, 'updated_at' => $now ],
            [ 'id' => 2, 'label' => 'Configuración',       'icon' => 'icofont-users', 'href' => '#',                      'parent_id' => null,  'enabled' => true, 'created_at' => $now, 'updated_at' => $now ],
            [ 'id' => 3, 'label' => 'menu',                'icon' => 'icofont-users', 'href' => 'menu',                   'parent_id' => 2,     'enabled' => true, 'created_at' => $now, 'updated_at' => $now ],
            [ 'id' => 4, 'label' => 'crear',               'icon' => 'icofont-users', 'href' => 'crear',                  'parent_id' => 2,     'enabled' => true, 'created_at' => $now, 'updated_at' => $now ],
            [ 'id' => 5, 'label' => 'HeaderTwo',           'icon' => 'icofont-users', 'href' => '#',                      'parent_id' => null,  'enabled' => true, 'created_at' => $now, 'updated_at' => $now ],
            [ 'id' => 6, 'label' => 'Topbar',              'icon' => 'icofont-users', 'href' => 'admintopbar',            'parent_id' => 7,     'enabled' => true, 'created_at' => $now, 'updated_at' => $now ],
            [ 'id' => 7, 'label' => 'HeaderMiddle',        'icon' => 'icofont-users', 'href' => 'adminheadermiddle',      'parent_id' => 7,     'enabled' => true, 'created_at' => $now, 'updated_at' => $now ],
            [ 'id' => 8, 'label' => 'Municipalidad',       'icon' => 'icofont-users', 'href' => '#',                      'parent_id' => null,  'enabled' => true, 'created_at' => $now, 'updated_at' => $now ],
            [ 'id' => 9, 'label' => 'Vision',              'icon' => 'icofont-users', 'href' => 'adminmunicipalidad',     'parent_id' => 10,    'enabled' => true, 'created_at' => $now, 'updated_at' => $now ],
            [ 'id' =>10, 'label' => 'Directorio',          'icon' => 'icofont-users', 'href' => 'admindirectorio',        'parent_id' => 10,    'enabled' => true, 'created_at' => $now, 'updated_at' => $now ],
            [ 'id' =>11, 'label' => 'Organigrama',         'icon' => 'icofont-users', 'href' => 'adminorganigrama',       'parent_id' => 10,    'enabled' => true, 'created_at' => $now, 'updated_at' => $now ],
            [ 'id' =>12, 'label' => 'Documentos de Gestion','icon' => 'icofont-users','href' => 'admin-doc-gestion',      'parent_id' => 10,    'enabled' => true, 'created_at' => $now, 'updated_at' => $now ],
            [ 'id' =>13, 'label' => 'Normas Emitidas',     'icon' => 'icofont-users', 'href' => 'admin-normas-emitidas',  'parent_id' => 10,    'enabled' => true, 'created_at' => $now, 'updated_at' => $now ],
            [ 'id' =>14, 'label' => 'Bolsa de Trabajo',    'icon' => 'icofont-users', 'href' => '#',                      'parent_id' => null,  'enabled' => true, 'created_at' => $now, 'updated_at' => $now ],
            [ 'id' =>15, 'label' => 'Convocatoria',        'icon' => 'icofont-users', 'href' => 'admin-convocatoria',     'parent_id' => 19,    'enabled' => true, 'created_at' => $now, 'updated_at' => $now ],
            [ 'id' =>16, 'label' => 'Imagenes',            'icon' => 'icofont-users', 'href' => '#',                      'parent_id' => null,  'enabled' => true, 'created_at' => $now, 'updated_at' => $now ],
            [ 'id' =>17, 'label' => 'Slider',              'icon' => 'icofont-users', 'href' => 'admin-slider',           'parent_id' => 21,    'enabled' => true, 'created_at' => $now, 'updated_at' => $now ],
            [ 'id' =>18, 'label' => 'Fondos',              'icon' => 'icofont-users', 'href' => 'admin-images',           'parent_id' => 21,    'enabled' => true, 'created_at' => $now, 'updated_at' => $now ],
        ]);
    }
}