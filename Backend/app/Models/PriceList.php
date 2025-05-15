<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PriceList extends Model
{
    use HasFactory, SoftDeletes;

    protected $dates = ['deletes_at'];
    protected $fillable = [
        'name',
        'percent',
        'user_id'
    ];

    protected $table = 'pricelists';

    public function user()
    {
        return $this->belongsTo(User::class)->select(['id','name','lastname','email']);
    }
}
