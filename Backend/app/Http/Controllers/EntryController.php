<?php

namespace App\Http\Controllers;

use App\Models\Entry;
use App\Models\EntryDetail;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class EntryController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return JsonResponse
     */
    public function index()
    {
        $entries = Entry::orderByDesc('id')->get();

        return response()->json(['data' => $entries],200);
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
            'type' => 'required',
            'doc_date' => 'required',
            'user_id' => 'required'
        ];

        $this->validate($request, $rules);
        $entry = Entry::create($request->all());

        $detalles = json_decode($request->detalles);
        foreach ($detalles as $detalle){
            $entry->entryDetails()->create([
                'product_id' => $detalle->product->id,
                'quantity' => $detalle->quantity,
                'cost' => $detalle->cost
            ]);
        }
        return response()->json(['data' => $entry], 201);
    }

    /**
     * Display the specified resource.
     *
     * @param Entry $entry
     * @return JsonResponse
     */
    public function show(Entry $entry)
    {
        $entrada = Entry::findOrFail($entry->id);

        return response()->json(['data' => $entrada], 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param Entry $entry
     * @return JsonResponse
     */
    public function update(Request $request, Entry $entry)
    {
        $entryClean = $entry;
        $entry->fill($request->only([
            'branch_id',
            'type',
            'doc_date',
            'comments'
        ]));

        if($entry->isClean()){
            $entry = $entryClean;
        }
        else{
            $entry->save();
        }

        EntryDetail::where('entry_id',$entry->id)->delete();

        $detalles = json_decode($request->detalles);
        foreach ($detalles as $detalle){
            $entry->entryDetails()->create([
                'product_id' => $detalle->product->id,
                'quantity' => $detalle->quantity,
                'cost' => $detalle->cost
            ]);
        }

        return response()->json(['data' => $entry], 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Entry $entry
     * @return JsonResponse
     * @throws Exception
     */
    public function destroy(Entry $entry)
    {
        $entry->delete();

        return response()->json(['data' => $entry], 200);
    }

    public function Entradas(Request $request)
    {
        $perPage   = $request->input('limit', 5);
        $page      = $request->input('page', 1);
        $search    = $request->input('search', '');
        $trashed   = $request->boolean('trashed', false);
        $startDate = $request->input('start_date', '');
        $endDate   = $request->input('end_date', '');

        $query = Entry::where('type', 'entrada')->orderByDesc('id');

        if ($trashed) {
            $query->withTrashed();
        }

        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->whereHas('branch', function ($bq) use ($search) {
                    $bq->where('name', 'like', "%$search%");
                })
                ->orWhere('comments', 'like', "%$search%")
                ->orWhereHas('entryDetails', function ($eq) use ($search) {
                    $eq->whereHas('product', function ($pq) use ($search) {
                        $pq->where('name', 'like', "%$search%");
                    });
                });
            });
        }

        if (!empty($startDate)) {
            $query->whereDate('doc_date', '>=', $startDate);
        }
        if (!empty($endDate)) {
            $query->whereDate('doc_date', '<=', $endDate);
        }

        $entradas = $query->paginate($perPage, ['*'], 'page', $page);

        $entradas->getCollection()->transform(function ($entry) {
            $entry->doc_date_format = date('d/m/Y', strtotime($entry->doc_date));
            $entry->branch;
            $entry->entryDetails->each(function ($entryDetail) {
                $entryDetail->product;
            });
            return $entry;
        });

        return response()->json($entradas, 200);
    }

    public function Salidas(Request $request)
    {
        $perPage   = $request->input('limit', 5);
        $page      = $request->input('page', 1);
        $search    = $request->input('search', '');
        $trashed   = $request->boolean('trashed', false);
        $startDate = $request->input('start_date', '');
        $endDate   = $request->input('end_date', '');

        $query = Entry::where('type', 'salida')->orderByDesc('id');

        if ($trashed) {
            $query->withTrashed();
        }

        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->whereHas('branch', function ($bq) use ($search) {
                    $bq->where('name', 'like', "%$search%");
                })
                ->orWhere('comments', 'like', "%$search%")
                ->orWhereHas('entryDetails', function ($eq) use ($search) {
                    $eq->whereHas('product', function ($pq) use ($search) {
                        $pq->where('name', 'like', "%$search%");
                    });
                });
            });
        }

        if (!empty($startDate)) {
            $query->whereDate('doc_date', '>=', $startDate);
        }
        if (!empty($endDate)) {
            $query->whereDate('doc_date', '<=', $endDate);
        }

        $salidas = $query->paginate($perPage, ['*'], 'page', $page);

        $salidas->getCollection()->transform(function ($entry) {
            $entry->doc_date_format = date('d/m/Y', strtotime($entry->doc_date));
            $entry->branch;
            $entry->entryDetails->each(function ($entryDetail) {
                $entryDetail->product;
            });
            return $entry;
        });

        return response()->json($salidas, 200);
    }

}
