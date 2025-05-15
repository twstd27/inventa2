<?php

namespace App\Http\Controllers;

use App\Models\PriceList;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class PriceListController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return JsonResponse
     */
    public function index()
    {
        $lists = PriceList::withTrashed()->orderByDesc('id')->get();

        return response()->json(['data' => $lists],200);
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
            'name' => 'required|unique:pricelists',
            'percent' => 'required',
            'user_id' => 'required'
        ];

        $this->validate($request, $rules);
        $list = PriceList::create($request->all());

        return response()->json(['data' => $list], 201);
    }

    /**
     * Display the specified resource.
     *
     * @param PriceList $list
     * @return JsonResponse
     */
    public function show(PriceList $list)
    {
        $lista = PriceList::findOrFail($list->id);

        return response()->json(['data' => $lista], 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param int $id
     * @return JsonResponse
     */
    public function update(Request $request, $id)
    {
        $list = PriceList::findOrFail($id);

        $rules = [
            'name' => 'required|unique:pricelists,name,' . $list->id,
            'percent' => 'required'
        ];

        $this->validate($request, $rules);

        $list->update($request->only([
            'name',
            'percent'
        ]));

        return response()->json(['data' => $list], 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param PriceList $list
     * @return JsonResponse
     * @throws Exception
     */
    public function destroy(PriceList $list)
    {
        $list->delete();

        return response()->json(['data' => $list], 200);
    }

    /**
     * Restore the specified resource from storage.
     *
     * @param $id
     * @return JsonResponse
     */
    public function Restore($id)
    {
        $list = PriceList::withTrashed()->findOrFail($id);
        PriceList::withTrashed()->find($id)->restore();

        return response()->json(['data' => $list], 200);
    }

    /**
     * Display a listing of the resource for combobox.
     *
     * @return JsonResponse
     */
    public function PriceListCombo()
    {
        $lists = PriceList::all();

        $lists->each(function ($list) {
            $list->value = $list->id;
            $list->label = $list->percent . '% - ' . $list->name;
            unset(
                $list->id,
                $list->user_id,
                $list->name,
                $list->created_at,
                $list->deleted_at,
                $list->updated_at
            );
        });

        return response()->json(['data' => $lists], 200);
    }
}
