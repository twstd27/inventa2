<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuditLogController extends Controller
{
    /**
     * Retorna el log de auditoría con filtros opcionales.
     * Solo para administradores (role_id = 1).
     *
     * Query params: ?user_id=&action=&model=&start_date=&end_date=&per_page=50
     */
    public function index(Request $request): JsonResponse
    {
        $user = auth()->user();
        if (!$user || $user->role_id !== 1) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $query = AuditLog::with('user:id,name,lastname')
            ->orderBy('created_at', 'desc');

        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }
        if ($request->filled('action')) {
            $query->where('action', $request->action);
        }
        if ($request->filled('model')) {
            $query->where('model', $request->model);
        }
        if ($request->filled('start_date')) {
            $query->whereDate('created_at', '>=', $request->start_date);
        }
        if ($request->filled('end_date')) {
            $query->whereDate('created_at', '<=', $request->end_date);
        }

        $perPage = min((int) $request->get('per_page', 50), 200);
        $logs = $query->paginate($perPage);

        return response()->json($logs, 200);
    }
}
