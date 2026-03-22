<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use App\Models\EntryDetail;
use App\Models\ExchangeRate;
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
     * Resuelve el tipo de cambio global desde params.
     * El param puede guardar el ID del tipo de cambio o el valor directo (retrocompatibilidad).
     */
    private function getGlobalExchangeRate(): float
    {
        $row = DB::select("SELECT value FROM `params` WHERE name = 'TipoCambio' LIMIT 1");
        if (!isset($row[0])) return 6.96;
        $er = ExchangeRate::find((int)$row[0]->value);
        return $er ? (float)$er->value : (float)$row[0]->value;
    }

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

          $global_exchange_rate = $this->getGlobalExchangeRate();
          $er = $product->exchange_rate_id ? ExchangeRate::find($product->exchange_rate_id) : null;
          $exchange_rate = $er ? (float)$er->value : $global_exchange_rate;

          $auxPrice = round(($product->cost_usd * $exchange_rate * (1 + $product->price_percent)), 2);
          $auxPriceDiscount = round(($product->cost_usd * $exchange_rate * (1 + $product->discount_percent)), 2);
          $auxPriceWholesome = round(($product->cost_usd * $exchange_rate * (1 + $product->wholesome_percent)), 2);
          
          $product->price = number_format((ceil($auxPrice * 2) / 2), 2, ".", "");
          $product->price_discount = number_format((ceil($auxPriceDiscount * 2) / 2), 2, ".", "");
          $product->price_wholesome = number_format((ceil($auxPriceWholesome * 2) / 2), 2, ".", "");

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
            'price_discount' => 'required',
            'price_wholesome' => 'required',
            'cost' => 'required',
            'price_percent' => 'required',
            'discount_percent' => 'required',
            'wholesome_percent' => 'required',
            'cost_usd' => 'required',
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
     * @param $id
     * @return JsonResponse
     */
    public function show($id)
    {
        $producto = Product::where('code', $id)->first();

        if (!$producto) {
            return response()->json([
                'message' => "Producto no encontrado"
            ], 404);
        }

        $producto->marca = Brand::withTrashed()->findOrFail($producto->brand_id)->name;
            
        $query = DB::select("
            SELECT SUM(
                CASE WHEN `a`.`type` = 'entrada'
                    THEN `b`.`quantity`
                    ELSE -`b`.`quantity` END) AS `quantity`
            FROM (`entries` `a` LEFT JOIN `entry_details` `b` ON (`a`.`id` = `b`.`entry_id`))
            WHERE `a`.`deleted_at` IS NULL AND
                  `a`.`branch_id` = 1 AND
                  `b`.`product_id` = ".$producto->id."
            GROUP BY `a`.`branch_id`,`b`.`product_id`
        "); 
        // modificar branch_id CV 2 - BIGTOOL 1
        
        if(isset($query[0])){
            $producto->quantity = ($query[0]->quantity == null) ? "0.00" : $query[0]->quantity;
        }
        else{
            $producto->quantity = "0.00";
        }

        $global_exchange_rate = $this->getGlobalExchangeRate();
        $er = $producto->exchange_rate_id ? ExchangeRate::find($producto->exchange_rate_id) : null;
        $exchange_rate = $er ? (float)$er->value : $global_exchange_rate;

        $auxPrice = round(($producto->cost_usd * $exchange_rate * (1 + $producto->price_percent)), 2);
        $auxPriceDiscount = round(($producto->cost_usd * $exchange_rate * (1 + $producto->discount_percent)), 2);
        $auxPriceWholesome = round(($producto->cost_usd * $exchange_rate * (1 + $producto->wholesome_percent)), 2);
        
        $producto->price = number_format((ceil($auxPrice * 2) / 2), 2, ".", "");
        $producto->price_discount = number_format((ceil($auxPriceDiscount * 2) / 2), 2, ".", "");
        $producto->price_wholesome = number_format((ceil($auxPriceWholesome * 2) / 2), 2, ".", "");


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

        return response()->json(['producto' => $producto], 200);
        // $producto = Product::findOrFail($id);

        // return response()->json(['data' => $producto],200);
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
            'price_percent',
            'discount_percent',
            'wholesome_percent',
            'cost_usd',
            'exchange_rate_id',
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
     * Show all products for etiquetas.
     *
     * @return JsonResponse
     */
    public function Etiquetas()
    {
      $products = Product::select('price_percent', 'code', 'name', 'cost_usd', 'exchange_rate_id')->get();

      $global_exchange_rate = $this->getGlobalExchangeRate();

      $products->each(function ($product) use ($global_exchange_rate) {
        $er = $product->exchange_rate_id ? ExchangeRate::find($product->exchange_rate_id) : null;
        $exchange_rate = $er ? (float)$er->value : $global_exchange_rate;

        $auxPrice = round(($product->cost_usd * $exchange_rate * (1 + $product->price_percent)), 2);  
        $product->price = number_format((ceil($auxPrice * 2) / 2), 2, ".", "");
        unset(
            $product->price_percent
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
        $path = $request->file('image')->store('images', 'public');
        Storage::disk('public')->setVisibility($path, 'public');

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

        $borrar = Storage::disk('public')->delete('images/'.$imagen->name);

        //$borrar = File::delete("storage/images/".$imagen->name);

        if($borrar){
            $product->images()->detach($imagen->id);
            $imagen->delete();
            return response()->json(['data' => ['status' => 'ok']], 200);
        }

        return response()->json(['data' => ['status' => 'error']], 200);
    }
}
