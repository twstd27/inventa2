<?php

namespace App\Http\Controllers;

use App\Models\Quotation;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class QuotationController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return JsonResponse
     */
    public function index()
    {
        $quotations = Quotation::orderByDesc('id')->get();

        $quotations->each(function ($quotation) {
            $quotation->branch;
            $quotation->user;
            $quotation->quotationDetails->each(function ($quotationDetail) {
                $quotationDetail->product;
            });
        });

        return response()->json(['data' => $quotations],200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return JsonResponse
     * @throws ValidationException
     */
    public function store(Request $request)
    {
        $rules = [
            'branch_id' => 'required',
            'doc_total' => 'required',
            'user_id' => 'required'
        ];

        $this->validate($request, $rules);
        $quotation = Quotation::create($request->all());

        $lineas = json_decode($request->lineas);
        foreach ($lineas as $linea){
            $quotation->quotationDetails()->create([
                'product_id' => $linea->product->id,
                'quantity' => $linea->quantity,
                'price' => $linea->price
            ]);
        }

        return response()->json(['data' => $quotation], 201);
    }

    /**
     * Display the specified resource.
     *
     * @param Quotation $quotation
     * @return JsonResponse
     */
    public function show(Quotation $quotation)
    {
        $cotizacion = Quotation::findOrFail($quotation->id);
        $cotizacion->branch;
        $cotizacion->user;
        $cotizacion->quotationDetails->each(function ($quotationDetail) {
            $quotationDetail->product;
        });

        return response()->json(['data' => $cotizacion], 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param Quotation $quotation
     * @return JsonResponse
     */
    public function update(Request $request, Quotation $quotation)
    {
        return response()->json(['data' => $quotation], 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Quotation $quotation
     * @return JsonResponse
     * @throws Exception
     */
    public function destroy(Quotation $quotation)
    {
        $quotation->delete();
        return response()->json(['data' => $quotation], 200);
    }

    public function Lista()
    {
        $quotations = Quotation::orderByDesc('id')->take(20)->get();

        $quotations->each(function ($quotation) {
            $quotation->branch;
            $quotation->user;
            $quotation->quotationDetails->each(function ($quotationDetail) use ($quotation) {
                $quotationDetail->product;
                $query = DB::select("
                SELECT SUM(
                       CASE WHEN `a`.`type` = 'entrada'
                           THEN `b`.`quantity`
                           ELSE -`b`.`quantity` END) AS `quantity`
                    FROM (`entries` `a` LEFT JOIN `entry_details` `b` ON (`a`.`id` = `b`.`entry_id`))
                    WHERE `a`.`deleted_at` IS NULL AND
                          `a`.`branch_id` = ".$quotation->branch_id." AND
                          `b`.`product_id` = ".$quotationDetail->product_id."
                    GROUP BY `a`.`branch_id`,`b`.`product_id`
                ");
                
                if(isset($query[0])){
                    $quotationDetail->maxQuantity = ($query[0]->quantity == null) ? "0.00" : $query[0]->quantity;
                }
                else{
                    $quotationDetail->maxQuantity = "0.00";
                }
                
                // $quotationDetail->maxQuantity = DB::table('products_stock_view')
                //     ->where('branch_id', $quotation->branch_id)
                //     ->where('product_id', $quotationDetail->product_id)
                //     ->value('quantity');
            });
        });

        return response()->json(['data' => $quotations],200);
    }
}
