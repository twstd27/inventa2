<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ParamsSeeder extends Seeder
{
    public function run()
    {
        $params = [
            [
                'name'        => 'VentasPrecioCero',
                'description' => 'Permitir Ventas con precio cero (0)',
                'type'        => 'ventas',
                'value'       => '0',
                'created_at'  => '2025-05-13 13:41:24',
                'updated_at'  => '2025-05-13 13:41:24',
            ],
            [
                'name'        => 'ListaPrecioDefecto',
                'description' => 'Lista de Precio por defecto',
                'type'        => 'ventas',
                'value'       => '2',
                'created_at'  => '2025-05-18 11:33:41',
                'updated_at'  => '2025-05-18 11:33:41',
            ],
            [
                'name'        => 'VentasSinStock',
                'description' => 'Permitir Ventas de artículos que no tengan stock',
                'type'        => 'ventas',
                'value'       => '0',
                'created_at'  => '2025-04-13 13:27:12',
                'updated_at'  => '2025-04-13 13:27:12',
            ],
            [
                'name'        => 'TipoCambio',
                'description' => 'Tipo de cambio',
                'type'        => 'ventas',
                'value'       => '1',
                'created_at'  => '2025-06-30 00:53:53',
                'updated_at'  => '2026-03-13 00:38:10',
            ],
            [
                'name'        => 'RedondeoPrecios',
                'description' => 'Redondeo de precios en POS (0=desactivado, 1=entero más cercano)',
                'type'        => 'number',
                'value'       => '0',
                'created_at'  => '2026-04-28 12:14:03',
                'updated_at'  => '2026-04-28 12:14:03',
            ],
            [
                'name'        => 'NumeroWhatsAppCatalogo',
                'description' => 'Número de WhatsApp para consultas del catálogo público',
                'type'        => 'text',
                'value'       => '',
                'created_at'  => '2026-04-29 03:57:42',
                'updated_at'  => '2026-05-03 18:33:25',
            ],
        ];

        foreach ($params as $param) {
            DB::table('params')->updateOrInsert(
                ['name' => $param['name']],
                $param
            );
        }
    }
}
