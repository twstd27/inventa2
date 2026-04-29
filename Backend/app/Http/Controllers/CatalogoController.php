<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use App\Models\Category;
use App\Models\ExchangeRate;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CatalogoController extends Controller
{
    private function getGlobalExchangeRate(): float
    {
        $row = DB::select("SELECT value FROM `params` WHERE name = 'TipoCambio' LIMIT 1");
        if (!isset($row[0])) return 6.96;
        $er = ExchangeRate::find((int)$row[0]->value);
        return $er ? (float)$er->value : (float)$row[0]->value;
    }

    public function categories(): JsonResponse
    {
        $categories = Category::select('id', 'name')->get()->map(function ($cat) {
            return [
                'id'   => $cat->id,
                'name' => $cat->name,
                'slug' => Str::slug($cat->name),
            ];
        });

        return response()->json(['data' => $categories], 200);
    }

    public function products(Request $request, string $slug): JsonResponse
    {
        $category = Category::all()->first(function ($cat) use ($slug) {
            return Str::slug($cat->name) === $slug;
        });

        if (!$category) {
            return response()->json(['message' => 'Categoría no encontrada'], 404);
        }

        $page = max(1, (int) $request->get('page', 1));

        $paginator = $category->products()->with(['images', 'categories'])->paginate(24, ['*'], 'page', $page);

        $global_exchange_rate = $this->getGlobalExchangeRate();

        $paginator->getCollection()->transform(function ($product) use ($global_exchange_rate) {
            $brand = Brand::withTrashed()->find($product->brand_id);
            $product->marca = $brand ? $brand->name : '';
            // $product->marca = Brand::withTrashed()->find($product->brand_id)?->name ?? '';

            $er = $product->exchange_rate_id ? ExchangeRate::find($product->exchange_rate_id) : null;
            $exchange_rate = $er ? (float)$er->value : $global_exchange_rate;

            $auxPrice           = round($product->cost_usd * $exchange_rate * (1 + $product->price_percent), 2);
            $product->price     = number_format((ceil($auxPrice * 2) / 2), 2, '.', '');

            $product->categories->each(function ($cat) {
                $cat->value = $cat->id;
                $cat->label = $cat->name;
                unset($cat->id, $cat->name, $cat->description, $cat->created_at, $cat->deleted_at, $cat->updated_at, $cat->pivot);
            });

            $product->images->each(function ($img) {
                unset($img->created_at, $img->updated_at, $img->pivot);
            });

            unset($product->price_discount, $product->price_wholesome, $product->cost, $product->cost_usd,
                  $product->price_percent, $product->discount_percent, $product->wholesome_percent,
                  $product->exchange_rate_id, $product->brand_id, $product->price_type, $product->user_id,
                  $product->deleted_at);

            return $product;
        });

        return response()->json([
            'data'         => $paginator->items(),
            'current_page' => $paginator->currentPage(),
            'last_page'    => $paginator->lastPage(),
            'total'        => $paginator->total(),
        ], 200);
    }

    public function params(): JsonResponse
    {
        $allowed = ['RedondeoPrecios', 'NumeroWhatsAppCatalogo'];

        $params = DB::table('params')
            ->whereIn('name', $allowed)
            ->get(['name', 'value']);

        return response()->json(['data' => $params], 200);
    }
}
