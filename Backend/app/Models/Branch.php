<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Branch extends Model
{
    use HasFactory, SoftDeletes;

    protected $dates = ['deletes_at'];
    protected $fillable = [
        'name',
        'address',
        'phone',
        'user_id',
        'venta_sin_stock'
    ];

    public function user()
    {
        return $this->belongsTo(User::class)->select(['id','name','lastname','email']);
    }
}
