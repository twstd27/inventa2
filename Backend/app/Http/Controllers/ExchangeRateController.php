<?php

namespace App\Http\Controllers;

use App\Models\ExchangeRate;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class ExchangeRateController extends Controller
{
    public function index()
    {
        $rates = ExchangeRate::withTrashed()->orderByDesc('id')->get();

        return response()->json(['data' => $rates], 200);
    }

    public function store(Request $request)
    {
        $rules = [
            'description' => 'required',
            'value'       => 'required|numeric',
        ];

        $this->validate($request, $rules);
        $rate = ExchangeRate::create($request->only(['description', 'value']));

        return response()->json(['data' => $rate], 201);
    }

    public function show($id)
    {
        $rate = ExchangeRate::findOrFail($id);

        return response()->json(['data' => $rate], 200);
    }

    public function update(Request $request, $id)
    {
        $rate = ExchangeRate::findOrFail($id);

        $rules = [
            'description' => 'required',
            'value'       => 'required|numeric',
        ];

        $this->validate($request, $rules);
        $rate->update($request->only(['description', 'value']));

        return response()->json(['data' => $rate], 200);
    }

    public function destroy($id)
    {
        $rate = ExchangeRate::findOrFail($id);
        $rate->delete();

        return response()->json(['data' => $rate], 200);
    }

    public function Restore($id)
    {
        $rate = ExchangeRate::withTrashed()->findOrFail($id);
        $rate->restore();

        return response()->json(['data' => $rate], 200);
    }

    public function ExchangeRateCombo()
    {
        $rates = ExchangeRate::orderByDesc('id')->get();

        $rates->each(function ($rate) {
            $rate->value_id = $rate->id;
            $rate->label = $rate->description . ' (' . $rate->value . ')';
            unset(
                $rate->id,
                $rate->created_at,
                $rate->updated_at,
                $rate->deleted_at
            );
        });

        return response()->json(['data' => $rates], 200);
    }
}
