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
            ['email' => 'domadesign.bo@gmail.com'],
            [
                'name'       => 'Admin',
                'lastname'   => 'Sistema',
                'email'      => 'domadesign.bo@gmail.com',
                'phone'      => null,
                'password'   => Hash::make('Doma.12345'),
                'role_id'    => $adminRole->id,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );
    }
}
