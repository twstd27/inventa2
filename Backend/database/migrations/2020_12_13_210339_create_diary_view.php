<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class CreateDiaryView extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::statement("
            CREATE VIEW diary_view AS
                SELECT
                    A.id,
                    DATE_FORMAT(A.doc_date,'%Y-%m-%d') doc_date,
                    A.invoice,
                    A.branch_id,
                    B.product_id,
                    C.code,
                    C.name,
                    B.quantity,
                    B.price,
                    B.cost,
                    (B.price * B.quantity) total,
                    ((B.price * B.quantity) - (B.cost * B.quantity)) profit
                FROM `sales` A
                INNER JOIN `sale_details` B ON A.id = B.sale_id
                INNER JOIN `products` C ON B.product_id = C.id
                WHERE A.deleted_at IS NULL;
        ");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropView('diary_view');
    }
}
