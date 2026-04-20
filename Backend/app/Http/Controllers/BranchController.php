<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class BranchController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return JsonResponse
     */
    public function index()
    {
        // Ordenar: primero los que no están eliminados (deleted_at == null), luego los eliminados, y dentro de cada grupo por id descendente
        $branches = Branch::withTrashed()
            ->orderByRaw('CASE WHEN deleted_at IS NULL THEN 0 ELSE 1 END')
            ->orderByDesc('id')
            ->get();

        return response()->json(['data' => $branches],200);
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
            'name' => 'required|unique:branches',
            'user_id' => 'required'
        ];

        $this->validate($request, $rules);
        $branch = Branch::create($request->all());

        return response()->json(['data' => $branch], 201);
    }

    /**
     * Display the specified resource.
     *
     * @param Branch $branch
     * @return JsonResponse
     */
    public function show(Branch $branch)
    {
        $sucursal = Branch::findOrFail($branch);

        return response()->json(['data' => $sucursal], 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param Branch $branch
     * @return JsonResponse
     */
    public function update(Request $request, Branch $branch)
    {
        $branchClean = $branch;
        $branch->fill($request->only([
            'name',
            'address',
            'phone',
            'venta_sin_stock'
        ]));

        if($branch->isClean()){
            return response()->json(['data' => $branchClean], 200);
        }
        $branch->save();

        return response()->json(['data' => $branch], 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Branch $branch
     * @return JsonResponse
     * @throws Exception
     */
    public function destroy(Branch $branch)
    {
        $branch->delete();

        return response()->json(['data' => $branch], 200);
    }

    /**
     * Restore the specified resource from storage.
     *
     * @param $id
     * @return JsonResponse
     */
    public function Restore($id)
    {
        $branch = Branch::withTrashed()->findOrFail($id);
        Branch::withTrashed()->find($id)->restore();

        return response()->json(['data' => $branch], 200);
    }

    /**
     * Display a listing of the resource for combobox.
     *
     * @return JsonResponse
     */
    public function BranchCombo()
    {
        $branches = Branch::all();

        $branches->each(function ($branch) {
            $branch->value = $branch->id;
            $branch->label = $branch->name;
            unset(
                $branch->id,
                $branch->user_id,
                $branch->name,
                $branch->address,
                $branch->phone,
                $branch->created_at,
                $branch->deleted_at,
                $branch->updated_at
            );
            // venta_sin_stock se mantiene para que el POS pueda leerlo
        });

        return response()->json(['data' => $branches], 200);
    }
}
