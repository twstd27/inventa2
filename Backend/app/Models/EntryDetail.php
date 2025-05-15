<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class EntryDetail extends Model
{
    use HasFactory;

    protected $dates = ['deletes_at'];
    protected $fillable = [
        'entry_id',
        'product_id',
        'quantity',
        'cost',
    ];

    public function entries()
    {
        return $this->belongsTo(Entry::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class)->withTrashed()->select(['id','code','name']);
    }
}
