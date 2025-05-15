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
            $table->decimal('price',16,2)->unsigned();
            $table->integer('price_type')->unsigned();
            $table->decimal('price_wholesome',16,2)->unsigned();
            $table->decimal('price_discount',16,2)->unsigned();
            $table->decimal('cost',16,2)->unsigned();
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
