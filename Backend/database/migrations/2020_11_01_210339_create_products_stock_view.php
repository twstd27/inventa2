<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class CreateProductsStockView extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::statement("
            CREATE VIEW products_stock_view AS
                SELECT
                    A.branch_id,
                    B.product_id,
                    SUM(
                        CASE WHEN type = 'entrada'
                            THEN B.quantity
                            ELSE -B.quantity
                        END
                    ) AS quantity
                FROM
                    entries A
                    LEFT JOIN entry_details B ON A.id = B.entry_id
                    WHERE A.deleted_at IS NULL
                    GROUP BY A.branch_id, B.product_id;
        ");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropView('products_stock_view');
    }
}
