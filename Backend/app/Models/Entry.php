<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Entry extends Model
{
    use HasFactory, SoftDeletes;

    protected $dates = ['deletes_at'];
    protected $fillable = [
        'branch_id',
        'type',
        'doc_date',
        'comments',
        'user_id',
        'sale_id'
    ];

    public function entryDetails()
    {
        return $this->hasMany(EntryDetail::class);
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
