<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RolesSeeder extends Seeder
{
    public function run()
    {
        $roles = [
            [
                'name'        => 'admin',
                'permissions' => json_encode([
                    ['value' => 'todos', 'label' => 'Todos los módulos'],
                ]),
                'created_at'  => '2020-11-09 11:06:58',
                'updated_at'  => '2020-11-09 11:06:58',
            ],
            [
                'name'        => 'Cajero',
                'permissions' => json_encode([
                    ['value' => 'POS', 'label' => 'POS', 'modulo' => 'ventas'],
                    // TODO: agregar el resto de permisos del Cajero
                ]),
                'created_at'  => '2020-12-04 13:39:02',
                'updated_at'  => '2025-10-10 10:32:14',
            ],
        ];

        foreach ($roles as $role) {
            DB::table('roles')->updateOrInsert(
                ['name' => $role['name']],
                $role
            );
        }
    }
}
