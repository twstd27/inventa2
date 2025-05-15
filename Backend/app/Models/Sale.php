<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Sale extends Model
{
    use HasFactory, SoftDeletes;

    protected $dates = ['deletes_at'];
    protected $fillable = [
        'branch_id',
        'invoice',
        'invoice_number',
        'customer',
        'customer_number',
        'doc_total',
        'doc_date',
        'comments',
        'user_id'
    ];

    public function saleDetails()
    {
        return $this->hasMany(SaleDetail::class);
    }

    public function branch()
    {
        return $this->belongsTo(Branch::class)->select(['id','name']);
    }

    public function user()
    {
        return $this->belongsTo(User::class)->select(['id','name','lastname','email']);
    }
}
