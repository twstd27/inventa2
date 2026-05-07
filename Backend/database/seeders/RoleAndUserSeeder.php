<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class RoleAndUserSeeder extends Seeder
{
    public function run()
    {
        $adminRole = DB::table('roles')->where('name', 'admin')->first();

        DB::table('users')->updateOrInsert(
            ['email' => 'inventa@mail.com'],
            [
                'name'       => 'Admin',
                'lastname'   => 'Sistema',
                'email'      => 'inventa@mail.com',
                'phone'      => null,
                'password'   => Hash::make('password'),
                'role_id'    => $adminRole->id,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );
    }
}
