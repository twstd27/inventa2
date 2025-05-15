<?php

namespace App\Http\Controllers;

use App\Models\Diary;
use App\Models\Entry;
use App\Models\Sale;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class SaleController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return JsonResponse
     */
    public function index(Request $request)
    {
      $perPage = $request->input('limit', 5);
      $page = $request->input('page', 1);
  
      $sales = Sale::with(['user', 'branch', 'saleDetails.product']) // Cargar relaciones necesarias
          ->orderByDesc('id')
          ->paginate($perPage, ['*'], 'page', $page);
  
      $sales->getCollection()->transform(function ($sale) {
          $sale->branch;
          $sale->saleDetails->each(function ($entryDetail) {
              $entryDetail->product;
          });
          return $sale;
      });
  
      return response()->json($sales, 200);
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
        $sale = Sale::create($request->all());

        $lineas = json_decode($request->lineas);
        foreach ($lineas as $linea){
            $sale->saleDetails()->create([
                'product_id' => $linea->product->id,
                'quantity' => $linea->quantity,
                'price' => $linea->price,
                'cost' => $linea->cost
            ]);
        }

        $entry = Entry::create([
            'branch_id' => $sale->branch_id,
            'type' => 'salida',
            'doc_date' => $sale->created_at,
            'comments' => 'Generado a partir de venta #'.$sale->id,
            'user_id' => $request->user_id,
            'sale_id' => $sale->id
        ]);

        $detalles = json_decode($request->lineas);
        foreach ($detalles as $detalle){
            $entry->entryDetails()->create([
                'product_id' => $detalle->product->id,
                'quantity' => $detalle->quantity,
                'cost' => $detalle->price
            ]);
        }
        return response()->json(['data' => $sale], 201);
    }

    /**
     * Display the specified resource.
     *
     * @param Sale $sale
     * @return JsonResponse
     */
    public function show(Sale $sale)
    {
        $venta = Sale::findOrFail($sale->id);
        $venta->branch;
        $venta->saleDetails->each(function ($saleDetail) {
            $saleDetail->product;
        });

        return response()->json(['data' => $venta], 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param Sale $sale
     * @return JsonResponse
     */
    public function update(Request $request, Sale $sale)
    {
        return response()->json(['data' => $sale], 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Sale $sale
     * @return JsonResponse
     * @throws Exception
     */
    public function destroy(Sale $sale)
    {
        $sale->delete();
        $entry = Entry::where('sale_id', $sale->id)->firstOrFail();
        $entry->delete();
        return response()->json(['data' => $sale], 200);
    }

    public function Lista()
    {
        $sales = Sale::orderByDesc('id')->take(10)->get();

        $sales->each(function ($sale) {
            $sale->branch;
            $sale->user;
            $sale->saleDetails->each(function ($saleDetail) {
                $saleDetail->product;
            });
        });

        return response()->json(['data' => $sales],200);
    }

    /**
     * Display a listing of products sold in a specific date.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function Diario(Request $request)
    {
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');
        $branchId = $request->input('b');

        $products = DB::select("
        SELECT `a`.`id` AS `id`,
              date_format(`a`.`doc_date`,'%d/%m/%Y') AS `doc_date`,
              `a`.`invoice` AS `invoice`,
              `a`.`branch_id` AS `branch_id`,
              `b`.`product_id` AS `product_id`,
              `c`.`code` AS `code`,
              `c`.`name` AS `name`,
              `b`.`quantity` AS `quantity`,
              `b`.`price` AS `price`,
              `b`.`cost` AS `cost`,
              `b`.`price` * `b`.`quantity` AS `total`,
              `b`.`price` * `b`.`quantity` - `b`.`cost` * `b`.`quantity` AS `profit` 
            FROM ((`sales` `a` join `sale_details` `b` on(`a`.`id` = `b`.`sale_id`)) join `products` `c` on(`b`.`product_id` = `c`.`id`)) 
            WHERE `a`.`deleted_at` IS NULL 
                AND `a`.`doc_date` BETWEEN '$startDate 00:00:00' AND '$endDate 23:59:59'
                AND `a`.`branch_id` = $branchId
            ORDER BY `a`.`id`
        ");

        return response()->json(['data' => $products], 200);
    }
}
