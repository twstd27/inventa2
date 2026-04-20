<?php

namespace App\Observers;

use App\Models\AuditLog;
use Illuminate\Database\Eloquent\Model;

/**
 * Observer genérico que registra created/updated/deleted/restored
 * en la tabla audit_logs para cualquier modelo que lo registre.
 *
 * Registro en AppServiceProvider:
 *   Product::observe(AuditObserver::class);
 *   Sale::observe(AuditObserver::class);
 */
class AuditObserver
{
    public function created(Model $model): void
    {
        AuditLog::log('created', class_basename($model), $model->id, $this->label($model));
    }

    public function updated(Model $model): void
    {
        $dirty = $model->getDirty();
        // Excluir campos no relevantes para auditoría
        unset($dirty['updated_at'], $dirty['deleted_at']);

        if (empty($dirty)) return;

        AuditLog::log('updated', class_basename($model), $model->id, $this->label($model), $dirty);
    }

    public function deleted(Model $model): void
    {
        // SoftDelete → acción 'deleted', Hard delete → acción 'hard_deleted'
        $action = method_exists($model, 'trashed') ? 'deleted' : 'hard_deleted';
        AuditLog::log($action, class_basename($model), $model->id, $this->label($model));
    }

    public function restored(Model $model): void
    {
        AuditLog::log('restored', class_basename($model), $model->id, $this->label($model));
    }

    private function label(Model $model): string
    {
        return $model->name ?? $model->title ?? $model->email ?? (string) $model->id;
    }
}
