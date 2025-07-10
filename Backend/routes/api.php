<?php

use App\Http\Controllers\BranchController;
use App\Http\Controllers\BrandController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\EntryController;
use App\Http\Controllers\EntryDetailController;
use App\Http\Controllers\ImageController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\QuotationController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\SaleController;
use App\Http\Controllers\ParamController;
use App\Http\Controllers\PriceListController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

//Usuarios
Route::post('login',[UserController::class, 'Login']);
Route::get('users/lista',[UserController::class, 'Lista']);
Route::post('users/{id}/restore',[UserController::class, 'Restore']);
Route::resource('users', UserController::class)->except(['create', 'edit']);

//Roles
Route::get('roles/combo',[RoleController::class, 'RoleCombo']);
Route::post('roles/{id}/restore',[RoleController::class, 'Restore']);
Route::resource('roles', RoleController::class)->except(['create', 'edit']);

//Marcas
Route::get('brands/combo',[BrandController::class, 'BrandCombo']);
Route::post('brands/{id}/restore',[BrandController::class, 'Restore']);
Route::resource('brands', BrandController::class)->except(['create', 'edit']);

//Categorias
Route::get('categories/combo',[CategoryController::class, 'CategoryCombo']);
Route::post('categories/{id}/restore',[CategoryController::class, 'Restore']);
Route::resource('categories', CategoryController::class)->except(['create', 'edit']);
//Route::resource('categories.products', 'CategoryProductController', ['only' => ['index']]);

//Productos
Route::get('products/combo',[ProductController::class, 'ProductCombo']);
//Route::post('products/{id}/addimg',[ProductController::class, 'StoreImg']);
Route::post('products/{id}/uploadimg',[ProductController::class, 'StoreImg']);
//Route::post('products/{id}/removeimg',[ProductController::class, 'RemoveImg']);
Route::post('products/{id}/deleteimg',[ProductController::class, 'RemoveImg']);
Route::post('products/{id}/restore',[ProductController::class, 'Restore']);
Route::get('products/lista',[ProductController::class, 'Lista']);
Route::get('products/etiquetas',[ProductController::class, 'Etiquetas']);
//Route::get('products/{id}/mostrar',[ProductController::class, 'MostrarProducto']);
//Route::get('products/{id}/categories/data', 'ProductCategoryController@ProductCategories');
//Route::put('products/{id}/categories/{id_category}/update', 'ProductCategoryController@BorrarActualizarCategoria');
Route::resource('products', ProductController::class)->except(['create', 'edit']);
//Route::resource('products.categories', 'ProductCategoryController', ['only' => ['index', 'update', 'destroy']]);

//Sucursales
Route::get('branches/combo',[BranchController::class, 'BranchCombo']);
Route::post('branches/{id}/restore',[BranchController::class, 'Restore']);
Route::resource('branches', BranchController::class)->except(['create', 'edit']);

//Entradas y Salidas
Route::get('entries/entradas',[EntryController::class, 'Entradas']);
Route::get('entries/salidas',[EntryController::class, 'Salidas']);
Route::resource('entries', EntryController::class)->except(['create', 'edit']);

//Detalle Entradas y Salidas
Route::resource('entrydetails', EntryDetailController::class)->except(['create', 'edit']);

//Ventas
Route::get('sales/lista',[SaleController::class, 'Lista']);
Route::get('sales/diario',[SaleController::class, 'Diario']);
Route::resource('sales', SaleController::class)->except(['create', 'edit']);

//Cotizaciones
Route::get('quotations/lista',[QuotationController::class, 'Lista']);
Route::resource('quotations', QuotationController::class)->except(['create', 'edit']);

//Imagenes
Route::resource('images', ImageController::class)->except(['create', 'edit']);

//Parametros
Route::post('params/{id}/restore',[ParamController::class, 'Restore']);
Route::resource('params', ParamController::class)->except(['create', 'edit']);

//Precios
Route::get('pricelists/combo',[PriceListController::class, 'PriceListCombo']);
Route::post('pricelists/{id}/restore',[PriceListController::class, 'Restore']);
Route::resource('pricelists', PriceListController::class)->except(['create', 'edit']);
