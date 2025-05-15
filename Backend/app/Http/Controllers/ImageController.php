<?php

namespace App\Http\Controllers;

use App\Models\Image;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ImageController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        return response()->json(['data' => 'hola'], 200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return false|Response|string
     */
    public function store(Request $request)
    {
        return response()->json(['data' => ['status' => 'ok']], 200);
    }

    /**
     * Display the specified resource.
     *
     * @param Image $image
     * @return JsonResponse
     */
    public function show(Image $image): JsonResponse
    {
        return response()->json(['data' => ['status' => 'ok']], 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param Image $image
     * @return JsonResponse
     */
    public function update(Request $request, Image $image): JsonResponse
    {
        return response()->json(['data' => ['status' => 'ok']], 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Image $image
     * @return JsonResponse
     */
    public function destroy(Image $image)
    {
        return response()->json(['data' => ['status' => 'ok']], 200);
    }
}
