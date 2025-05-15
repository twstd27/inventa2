<?php

namespace App\Http\Controllers;

use App\Models\Param;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class ParamController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return JsonResponse
     */
    public function index()
    {
        $params = Param::withTrashed()->get();

        return response()->json(['data' => $params],200);
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
            'name' => 'required|unique:params',
            'value' => 'required',
        ];

        $this->validate($request, $rules);
        $param = Param::create($request->all());

        return response()->json(['data' => $param],201);
    }

    /**
     * Display the specified resource.
     *
     * @param Param $param
     * @return JsonResponse
     */
    public function show(Param $param)
    {
        $parametro = Param::findOrFail($param);

        return response()->json(['data' => $parametro],200);
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
        $param = Param::findOrFail($id);

        $rules = [
            'value' => 'required',
        ];

        $this->validate($request, $rules);

        $param->update($request->only([
            'value'
        ]));

        return response()->json(['data' => $param],200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Param $param
     * @return JsonResponse
     * @throws Exception
     */
    public function destroy(Param $param)
    {
        $param->delete();

        return response()->json(['data' => $param],200);
    }

    /**
     * Restore the specified resource from storage.
     *
     * @param $id
     * @return JsonResponse
     */
    public function Restore($id)
    {
        $param = Param::withTrashed()->findOrFail($id);
        Param::withTrashed()->find($id)->restore();

        return response()->json(['data' => $param],200);
    }
}
