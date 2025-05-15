<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QuotationDetail extends Model
{
    use HasFactory;

    protected $dates = ['deletes_at'];
    protected $fillable = [
        'sale_id',
        'product_id',
        'quantity',
        'price',
    ];

    public function quotations()
    {
        return $this->belongsTo(Quotation::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class)->withTrashed()->select(['id','code','name','price_wholesome']);
    }
}
