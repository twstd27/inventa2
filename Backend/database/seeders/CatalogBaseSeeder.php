<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CatalogBaseSeeder extends Seeder
{
    public function run()
    {
        DB::table('brands')->updateOrInsert(
            ['name' => 'Genérica'],
            ['name' => 'Genérica', 'description' => null, 'user_id' => null, 'created_at' => now(), 'updated_at' => now()]
        );

        DB::table('categories')->updateOrInsert(
            ['name' => 'General'],
            ['name' => 'General', 'description' => null, 'user_id' => null, 'created_at' => now(), 'updated_at' => now()]
        );
    }
}
