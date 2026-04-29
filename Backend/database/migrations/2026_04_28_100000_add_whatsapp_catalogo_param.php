<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

class AddWhatsappCatalogoParam extends Migration
{
    public function up()
    {
        if (!DB::table('params')->where('name', 'NumeroWhatsAppCatalogo')->exists()) {
            DB::table('params')->insert([
                'name'        => 'NumeroWhatsAppCatalogo',
                'description' => 'Número de WhatsApp para consultas del catálogo público (formato internacional sin +, ej: 59170000000)',
                'type'        => 'text',
                'value'       => '',
                'created_at'  => now(),
                'updated_at'  => now(),
            ]);
        }
    }

    public function down()
    {
        DB::table('params')->where('name', 'NumeroWhatsAppCatalogo')->delete();
    }
}
