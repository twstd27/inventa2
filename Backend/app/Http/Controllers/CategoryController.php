<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return JsonResponse
     */
    public function index()
    {
        $categories = Category::withTrashed()->orderByDesc('id')->get();

        return response()->json(['data' => $categories],200);
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
            'name' => 'required|unique:categories',
            'user_id' => 'required'
        ];

        $this->validate($request, $rules);
        $category = Category::create($request->all());

        return response()->json(['data' => $category],201);
    }

    /**
     * Display the specified resource.
     *
     * @param Category $category
     * @return JsonResponse
     */
    public function show(Category $category)
    {
        $categoria = Category::findOrFail($category);

        return response()->json(['data' => $categoria],200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param Category $category
     * @return JsonResponse
     */
    public function update(Request $request, Category $category)
    {
        $categoryClean = $category;
        $category->fill($request->only([
            'name',
            'description'
        ]));

        if($category->isClean()){
            return response()->json(['data' => $categoryClean],200);
        }
        $category->save();

        return response()->json(['data' => $category],200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Category $category
     * @return JsonResponse
     * @throws Exception
     */
    public function destroy(Category $category)
    {
        $category->delete();

        return response()->json(['data' => $category],200);
    }

    /**
     * Restore the specified resource from storage.
     *
     * @param $id
     * @return JsonResponse
     */
    public function Restore($id)
    {
        $category = Category::withTrashed()->findOrFail($id);
        Category::withTrashed()->find($id)->restore();

        return response()->json(['data' => $category],200);
    }

    /**
     * Display a listing of the resource for combobox.
     *
     * @return JsonResponse
     */
    public function CategoryCombo()
    {
        $categories = Category::all();

        $categories->each(function ($category) {
            $category->value = $category->id;
            $category->label = $category->name;
            unset(
                $category->id,
                $category->name,
                $category->description,
                $category->created_at,
                $category->deleted_at,
                $category->updated_at
            );
        });

        return response()->json(['data' => $categories],200);
    }
}
