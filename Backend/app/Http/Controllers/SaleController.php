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
        $perPage    = $request->input('limit', 5);
        $page       = $request->input('page', 1);
        $search     = $request->input('search', '');
        $trashed    = $request->boolean('trashed', false);
        $startDate  = $request->input('start_date', '');
        $endDate    = $request->input('end_date', '');
        $invoice    = $request->input('invoice', '');

        $query = Sale::with(['user', 'branch', 'saleDetails.product'])
            ->orderByDesc('id');

        if ($trashed) {
            $query->withTrashed();
        }

        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('id', 'like', "%$search%")
                  ->orWhere('invoice_number', 'like', "%$search%")
                  ->orWhere('customer', 'like', "%$search%")
                  ->orWhere('customer_number', 'like', "%$search%")
                  ->orWhere('doc_total', 'like', "%$search%")
                  ->orWhereHas('saleDetails', function ($sq) use ($search) {
                      $sq->whereHas('product', function ($pq) use ($search) {
                          $pq->where('name', 'like', "%$search%");
                      });
                  });
            });
        }

        if (!empty($startDate)) {
            $query->whereDate('created_at', '>=', $startDate);
        }
        if (!empty($endDate)) {
            $query->whereDate('created_at', '<=', $endDate);
        }
        if ($invoice === 'yes') {
            $query->where('invoice', 1);
        } elseif ($invoice === 'no') {
            $query->where('invoice', 0);
        }

        $sales = $query->paginate($perPage, ['*'], 'page', $page);

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
        $endDate   = $request->input('end_date');
        $branchId  = $request->input('b');

        $query = DB::table('sales as a')
            ->join('sale_details as b', 'a.id', '=', 'b.sale_id')
            ->join('products as c', 'b.product_id', '=', 'c.id')
            ->select(
                'a.id as id',
                DB::raw("date_format(a.doc_date,'%d/%m/%Y') as doc_date"),
                'a.invoice as invoice',
                'a.tipo_pago as tipo_pago',
                'a.branch_id as branch_id',
                'b.product_id as product_id',
                'c.code as code',
                'c.name as name',
                'b.quantity as quantity',
                'b.price as price',
                'b.cost as cost',
                DB::raw('b.price * b.quantity as total'),
                DB::raw('b.price * b.quantity - b.cost * b.quantity as profit')
            )
            ->whereNull('a.deleted_at')
            ->whereBetween('a.doc_date', [
                $startDate . ' 00:00:00',
                $endDate   . ' 23:59:59',
            ])
            ->orderBy('a.id');

        // El filtro de sucursal es opcional: si no se pasa, trae todas
        if (!empty($branchId)) {
            $query->where('a.branch_id', $branchId);
        }

        $products = $query->get();

        return response()->json(['data' => $products], 200);
    }
}
