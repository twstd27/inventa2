<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddTipoDeCambioToProductsTable extends Migration
{
    public function up()
    {
        Schema::create('exchange_rates', function (Blueprint $table) {
            $table->id();
            $table->string('description');
            $table->decimal('value', 10, 4);
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::table('products', function (Blueprint $table) {
            $table->unsignedBigInteger('exchange_rate_id')->nullable()->after('cost_usd');
            $table->foreign('exchange_rate_id')->references('id')->on('exchange_rates')->nullOnDelete();
        });
    }

    public function down()
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropForeign(['exchange_rate_id']);
            $table->dropColumn('exchange_rate_id');
        });

        Schema::dropIfExists('exchange_rates');
    }
}
