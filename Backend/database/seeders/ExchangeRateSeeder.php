<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ExchangeRateSeeder extends Seeder
{
    public function run()
    {
        if (DB::table('exchange_rates')->count() === 0) {
            DB::table('exchange_rates')->insert([
                'description' => 'TC por defecto',
                'value'       => 14.0000,
                'created_at'  => now(),
                'updated_at'  => now(),
            ]);
        }
    }
}
