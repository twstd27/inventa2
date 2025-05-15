<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Product extends Model
{
    use HasFactory, softDeletes;

    protected $dates = ['deletes_at'];
    protected $fillable = [
        'code',
        'name',
        'description',
        'price',
        'price_type',
        'price_discount',
        'price_wholesome',
        'cost',
        'brand_id',
        'user_id'
    ];

    public function categories()
    {
        return $this->belongsToMany(Category::class)->withTrashed();
    }

    public function images()
    {
        return $this->belongsToMany(Image::class);
    }

    public function brands()
    {
        return $this->belongsTo(Brand::class)->withTrashed();
    }

    public function user()
    {
        return $this->belongsTo(User::class)->select(['id','name','lastname','email']);
    }
}
