<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Str;

class User extends Authenticatable
{
    use HasFactory, Notifiable, SoftDeletes;

    protected $dates = ['deletes_at'];
    protected $fillable = [
        'name',
        'lastname',
        'email',
        'phone',
        'password',
        'role_id'
    ];

    protected $hidden = [
        'password',
        'remember_token'
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public static function generarVerificationToken()
    {
        return Str::random(40);
    }

    public function role()
    {
        return $this->belongsTo(Role::class)->withTrashed();
    }
}
