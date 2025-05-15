<?php

namespace App\Http\Controllers;

use App\Models\EntryDetail;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class EntryDetailController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return JsonResponse
     */
    public function index()
    {
        $entryDetails = EntryDetail::all();

        return response()->json(['data' => $entryDetails],200);
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
            'product_id' => 'required',
            'branch_id' => 'required',
            'quantity' => 'required',
            'cost' => 'required'
        ];

        $this->validate($request, $rules);
        $entryDetail = EntryDetail::create($request->all());

        return response()->json(['data' => $entryDetail], 201);
    }

    /**
     * Display the specified resource.
     *
     * @param EntryDetail $entryDetail
     * @return JsonResponse
     */
    public function show(EntryDetail $entryDetail)
    {
        $detalle = EntryDetail::findOrFail($entryDetail);

        return response()->json(['data' => $detalle], 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param EntryDetail $entryDetail
     * @return JsonResponse
     */
    public function update(Request $request, EntryDetail $entryDetail)
    {
        $entryDetailClean = $entryDetail;
        $entryDetail->fill($request->only([
            'entry_id',
            'product_id',
            'quantity',
            'cost'
        ]));

        if($entryDetail->isClean()){
            return response()->json(['data' => $entryDetailClean], 200);
        }
        $entryDetail->save();

        return response()->json(['data' => $entryDetail], 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param EntryDetail $entryDetail
     * @return JsonResponse
     * @throws Exception
     */
    public function destroy(EntryDetail $entryDetail)
    {
        $entryDetail->delete();

        return response()->json(['data' => $entryDetail], 200);
    }
}
