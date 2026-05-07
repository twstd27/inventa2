<?php

namespace App\Providers;

use App\Models\Entry;
use App\Models\Product;
use App\Models\Sale;
use App\Models\User;
use App\Observers\AuditObserver;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        // Auditoría automática de modelos críticos
        Entry::observe(AuditObserver::class);
        Product::observe(AuditObserver::class);
        Sale::observe(AuditObserver::class);
        User::observe(AuditObserver::class);
    }
}
