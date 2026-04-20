<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddVentaSinStockToBranchesTable extends Migration
{
    public function up()
    {
        Schema::table('branches', function (Blueprint $table) {
            // null = usar parámetro global, true = permite vender sin stock, false = no permite
            $table->boolean('venta_sin_stock')->nullable()->default(null)->after('phone');
        });
    }

    public function down()
    {
        Schema::table('branches', function (Blueprint $table) {
            $table->dropColumn('venta_sin_stock');
        });
    }
}
