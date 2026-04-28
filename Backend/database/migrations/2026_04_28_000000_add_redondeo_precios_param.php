<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

class AddRedondeoPreciosParam extends Migration
{
    public function up()
    {
        if (!DB::table('params')->where('name', 'RedondeoPrecios')->exists()) {
            DB::table('params')->insert([
                'name'        => 'RedondeoPrecios',
                'description' => 'Redondeo de precios en POS (0=desactivado, 1=entero, 5=múltiplo de 5, 10=múltiplo de 10, 50=múltiplo de 50)',
                'type'        => 'number',
                'value'       => '0',
                'created_at'  => now(),
                'updated_at'  => now(),
            ]);
        }
    }

    public function down()
    {
        DB::table('params')->where('name', 'RedondeoPrecios')->delete();
    }
}
