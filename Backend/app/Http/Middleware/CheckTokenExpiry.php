<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckTokenExpiry
{
    public function handle(Request $request, Closure $next)
    {
        $user = auth('api')->user();

        if ($user && $user->token_expires_at && now()->gt($user->token_expires_at)) {
            $user->api_token = null;
            $user->token_expires_at = null;
            $user->save();

            return response()->json(['message' => 'Token expirado'], 401);
        }

        return $next($request);
    }
}
