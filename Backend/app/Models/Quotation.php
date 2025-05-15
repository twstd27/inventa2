<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Quotation extends Model
{
    use HasFactory, SoftDeletes;

    protected $dates = ['deletes_at'];
    protected $fillable = [
        'customer',
        'branch_id',
        'doc_total',
        'doc_date',
        'comments',
        'user_id'
    ];

    public function quotationDetails()
    {
        return $this->hasMany(QuotationDetail::class);
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
