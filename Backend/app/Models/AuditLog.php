<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AuditLog extends Model
{
    protected $fillable = [
        'user_id',
        'action',
        'model',
        'model_id',
        'model_label',
        'changes',
        'ip_address',
    ];

    protected $casts = [
        'changes' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class)->withTrashed();
    }

    /**
     * Registra una acción en el log de auditoría.
     */
    public static function log(
        string $action,
        ?string $model = null,
        ?int $modelId = null,
        ?string $modelLabel = null,
        ?array $changes = null
    ): void {
        static::create([
            'user_id'     => auth()->id(),
            'action'      => $action,
            'model'       => $model,
            'model_id'    => $modelId,
            'model_label' => $modelLabel,
            'changes'     => $changes,
            'ip_address'  => request()->ip(),
        ]);
    }
}
