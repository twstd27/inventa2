<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProductsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('code');
            $table->string('name');
            $table->decimal('price',16,2)->unsigned()->default(0);
            $table->integer('price_type')->unsigned()->default(0);
            $table->decimal('price_wholesome',16,2)->unsigned()->default(0);
            $table->decimal('price_discount',16,2)->unsigned()->default(0);
            $table->decimal('cost',16,2)->unsigned();
            $table->decimal('price_percent',16,2)->unsigned()->default(0);
            $table->decimal('wholesome_percent',16,2)->unsigned()->default(0);
            $table->decimal('discount_percent',16,2)->unsigned()->default(0);
            $table->decimal('cost_usd',16,2)->unsigned()->default(0);
            $table->string('description', 1000)->nullable();
            $table->foreignId('brand_id')->constrained();
            $table->foreignId('user_id')->constrained();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('products');
    }
}
