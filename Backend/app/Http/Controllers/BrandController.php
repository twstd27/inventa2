<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class BrandController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return JsonResponse
     */
    public function index()
    {
        $brands = Brand::withTrashed()->orderByDesc('id')->get();

        return response()->json(['data' => $brands], 200);
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
            'name' => 'required|unique:brands',
            'user_id' => 'required'
        ];

        $this->validate($request, $rules);
        $brand = Brand::create($request->all());

        return response()->json(['data' => $brand], 201);
    }

    /**
     * Display the specified resource.
     *
     * @param Brand $brand
     * @return JsonResponse
     */
    public function show(Brand $brand)
    {
        $marca = Brand::findOrFail($brand);

        return response()->json(['data' => $marca], 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param Brand $brand
     * @return JsonResponse
     */
    public function update(Request $request, Brand $brand)
    {
        $brandClean = $brand;
        $brand->fill($request->only([
            'name',
            'description'
        ]));

        if($brand->isClean()){
            return response()->json(['data' => $brandClean], 200);
        }
        $brand->save();

        return response()->json(['data' => $brand], 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Brand $brand
     * @return JsonResponse
     * @throws Exception
     */
    public function destroy(Brand $brand)
    {
        $brand->delete();

        return response()->json(['data' => $brand],200);
    }

    /**
     * Restore the specified resource from storage.
     *
     * @param $id
     * @return JsonResponse
     */
    public function Restore($id)
    {
        $brand = Brand::withTrashed()->findOrFail($id);
        Brand::withTrashed()->find($id)->restore();

        return response()->json(['data' => $brand], 200);
    }

    /**
     * Display a listing of the resource for combobox.
     *
     * @return JsonResponse
     */
    public function BrandCombo()
    {
        $brands = Brand::all();

        $brands->each(function ($brand) {
            $brand->value = $brand->id;
            $brand->label = $brand->name;
            unset(
                $brand->id,
                $brand->name,
                $brand->description,
                $brand->created_at,
                $brand->deleted_at,
                $brand->updated_at
            );
        });

        return response()->json(['data' => $brands],200);
    }
}
