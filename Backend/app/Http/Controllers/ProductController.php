<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use App\Models\EntryDetail;
use App\Models\Image;
use App\Models\Product;
use Exception;
use File;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request)
    {
      if ($request->has('q')) {
          $searchTerms = explode(' ', $request->get('q'));
          $products = Product::where(function ($query) use ($searchTerms) {
              foreach ($searchTerms as $term) {
                  $query->where(function ($subQuery) use ($term) {
                      $subQuery->where('name', 'like', '%' . $term . '%')
                              ->orWhere('code', 'like', '%' . $term . '%');
                  });
              }
          })->take(24)->get();
      } else {
          $products = Product::all();
      }

        $products->each(function ($product) use ($request) {

            $product->marca = Brand::withTrashed()->findOrFail($product->brand_id)->name;
            
            $query = DB::select("
                SELECT SUM(
                   CASE WHEN `a`.`type` = 'entrada'
                       THEN `b`.`quantity`
                       ELSE -`b`.`quantity` END) AS `quantity`
                FROM (`entries` `a` LEFT JOIN `entry_details` `b` ON (`a`.`id` = `b`.`entry_id`))
                WHERE `a`.`deleted_at` IS NULL AND
                      `a`.`branch_id` = ".$request->b." AND
                      `b`.`product_id` = ".$product->id."
                GROUP BY `a`.`branch_id`,`b`.`product_id`
            ");
            
            if(isset($query[0])){
                $product->quantity = ($query[0]->quantity == null) ? "0.00" : $query[0]->quantity;
            }
            else{
                $product->quantity = "0.00";
            }

            if($product->price_type == '1'){
              $query_price_list = DB::select("
                SELECT t2.percent 
                FROM `params` t1
                LEFT JOIN `pricelists` t2 ON t1.value = t2.id
                WHERE t1.name = 'ListaPrecioDefecto' AND t2.id = t1.value
              ");

              if(isset($query_price_list[0])){
                $product->price = round($product->price + ($product->price * $query_price_list[0]->percent / 100), 2);
                $product->price_discount = round($product->price_discount + ($product->price_discount * $query_price_list[0]->percent / 100), 2);
                $product->price_wholesome = round($product->price_wholesome + ($product->price_wholesome * $query_price_list[0]->percent / 100), 2);
              }
            }

            $product->categories->each(function ($category) {
                $category->value = $category->id;
                $category->label = $category->name;
                unset(
                    $category->id,
                    $category->name,
                    $category->description,
                    $category->created_at,
                    $category->deleted_at,
                    $category->updated_at,
                    $category->pivot
                );
            });

            $product->images->each(function ($image) {
                unset(
                    $image->created_at,
                    $image->updated_at,
                    $image->pivot
                );
            });

        });

        return response()->json(['data' => $products],200);
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
            'code' => 'required',
            'name' => 'required',
            'price' => 'required',
            'price_type' => 'required',
            'price_discount' => 'required',
            'price_wholesome' => 'required',
            'cost' => 'required',
            'brand_id' => 'required',
            'user_id' => 'required'
        ];

        $this->validate($request, $rules);

        $product = Product::create($request->all());
        $product->categories()->attach($request->categories);

        return response()->json(['data' => $product], 201);
    }

    /**
     * Display the specified resource.
     *
     * @param Product $product
     * @return JsonResponse
     */
    public function show(Product $product)
    {
        $producto = Product::findOrFail($product->id);

        return response()->json(['data' => $producto],200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param Product $product
     * @return JsonResponse
     */
    public function update(Request $request, Product $product)
    {
        $productClean = $product;
        $product->fill($request->only([
            'code',
            'name',
            'description',
            'price',
            'price_type',
            'price_discount',
            'price_wholesome',
            'cost',
            'brand_id'
        ]));

        $product->categories()->sync($request->categories);

        if($product->isClean()){
            return response()->json(['data' => $productClean], 200);
        }
        $product->save();


        return response()->json(['data' => $request->categories], 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Product $product
     * @return JsonResponse
     * @throws Exception
     */
    public function destroy(Product $product)
    {
        $product->delete();

        return response()->json(['data' => $product], 200);
    }

    /**
     * Restore the specified resource from storage.
     *
     * @param $id
     * @return JsonResponse
     */
    public function Restore($id)
    {
        $product = Product::withTrashed()->findOrFail($id);
        Product::withTrashed()->find($id)->restore();

        return response()->json(['data' => $product], 200);
    }

    public function Lista(Request $request)
    {
      $perPage = $request->input('per_page', 5);
      $page = $request->input('page', 1);
      $search = $request->input('search', '');

      $query = Product::withTrashed()->with(['categories', 'images']);

      // Aplicar el filtro global con múltiples términos
      if (!empty($search)) {
          $searchTerms = explode(' ', $search); // Dividir la búsqueda en términos
          $query->where(function ($q) use ($searchTerms) {
              foreach ($searchTerms as $term) {
                  $q->where(function ($subQuery) use ($term) {
                      $subQuery->where('name', 'like', '%' . $term . '%')
                          ->orWhere('code', 'like', '%' . $term . '%')
                          ->orWhere('description', 'like', '%' . $term . '%');
                  });
              }
          });
      }

      $products = $query->paginate($perPage, ['*'], 'page', $page);

      $products->getCollection()->transform(function ($product) {
          $product->marca = Brand::withTrashed()->findOrFail($product->brand_id)->name;

          $product->categories->transform(function ($category) {
              return [
                  'value' => $category->id,
                  'label' => $category->name,
              ];
          });

          $product->images = $product->images->map(function ($image) {
              return [
                  'id' => $image->name,
              ];
          });

          return $product;
      });

      return response()->json($products, 200);
		    // $perPage = $request->input('per_page', 5);
        // $page = $request->input('page', 1);

        // $products = Product::withTrashed()
        //     ->with(['categories', 'images'])
        //     ->paginate($perPage, ['*'], 'page', $page);

        // $products->getCollection()->transform(function ($product) {
        //     $product->marca = Brand::withTrashed()->findOrFail($product->brand_id)->name;

        //     $product->categories->transform(function ($category) {
        //         return [
        //             'value' => $category->id,
        //             'label' => $category->name,
        //         ];
        //     });

        //     $product->images = $product->images->map(function ($image) {
        //         return [
        //             'id' => $image->name,
        //         ];
        //     });
        //     // unset($product->brand);

        //     return $product;
        // });

        // return response()->json($products, 200);


        // $products = Product::withTrashed()->get();

        // $products->each(function ($product) {

        //     $product->marca = Brand::withTrashed()->findOrFail($product->brand_id)->name;

        //     $product->categories->each(function ($category) {
        //         $category->value = $category->id;
        //         $category->label = $category->name;
        //         unset(
        //             $category->id,
        //             $category->name,
        //             $category->description,
        //             $category->created_at,
        //             $category->deleted_at,
        //             $category->updated_at,
        //             $category->pivot
        //         );
        //     });

        //     $product->images->each(function ($image) {
        //         unset(
        //             $image->created_at,
        //             $image->updated_at,
        //             $image->pivot
        //         );
        //     });

        // });

        // return response()->json(['data' => $products],200);
    }

    /**
     * Display the specified resource.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function MostrarProducto(Request $request)
    {
        $producto = Product::findOrFail($request->id);
        $producto->marca = Brand::withTrashed()->findOrFail($producto->brand_id)->name;
        $producto->categories;
        $producto->images;

        $producto->categories->each(function ($category) {
            $category->value = $category->id;
            $category->label = $category->name;
            unset(
                $category->id,
                $category->name,
                $category->description,
                $category->created_at,
                $category->deleted_at,
                $category->updated_at,
                $category->pivot
            );
        });

        $producto->images->each(function ($image) {
            unset(
                $image->created_at,
                $image->updated_at,
                $image->pivot
            );
        });

        return response()->json(['data' => $producto],200);
    }

    /**
     * Show all products for combobox.
     *
     * @return JsonResponse
     */
    public function ProductCombo()
    {
        $products = Product::all();

        $products->each(function ($product) {
            $product->value = $product->id;
            $product->label = $product->code." - ".$product->name;
            $product->categories = [];
            $product->images = [];
            unset(
                $product->id,
                $product->name,
                $product->code,
                $product->price,
                $product->price_discount,
                $product->price_wholesome,
                $product->description,
                $product->brand_id,
                $product->created_at,
                $product->deleted_at,
                $product->updated_at
            );
        });

        return response()->json(['data' => $products],200);
    }

    /**
     * Upload and add Image to Product
     *
     * @param $id
     * @param Request $request
     * @return JsonResponse
     */
    public function StoreImg($id, Request $request)
    {
        $product = Product::findOrFail($id);
        $path = $request->file('image')->store('images', 's3');
        Storage::disk('s3')->setVisibility($path,'public');

        $imagen = Image::create(['name' => basename($path)]);

        if($imagen != null){
            $product->images()->attach($imagen->id);
            return response()->json(['data' => ['status' => 'ok', 'image' => $imagen]], 200);
        }
        return response()->json(['data' => ['status' => 'error']], 200);
    }

    /**
     * Remove image and detach from product.
     *
     * @param $id
     * @param Request $request
     * @return JsonResponse
     */
    public function RemoveImg($id, Request $request)
    {
        $imagen = Image::findOrFail($request->id);
        $product = Product::findOrFail($id);

        $borrar = Storage::disk('s3')->delete('images/'.$imagen->name);

        //$borrar = File::delete("storage/images/".$imagen->name);

        if($borrar){
            $product->images()->detach($imagen->id);
            $imagen->delete();
            return response()->json(['data' => ['status' => 'ok']], 200);
        }

        return response()->json(['data' => ['status' => 'error']], 200);
    }
}
