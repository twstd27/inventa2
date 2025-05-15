<?php

namespace App\Http\Controllers;

use App\Models\Role;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Validation\ValidationException;

class RoleController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return JsonResponse
     */
    public function index()
    {
        $roles = Role::withTrashed()->orderByDesc('id')->get();
        $roles->each(function ($role) {
            $role->permissions = json_decode($role->permissions);
        });

        return response()->json(['data' => $roles],200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return JsonResponse
     * @throws ValidationException
     */
    public function store(Request $request)
    {
        $rules = [
            'name' => 'required|unique:roles',
            'permissions' => 'required'
        ];

        $this->validate($request, $rules);

        $role = Role::create($request->all());

        return response()->json(['data' => $role], 201);
    }

    /**
     * Display the specified resource.
     *
     * @param Role $role
     * @return JsonResponse
     */
    public function show(Role $role)
    {
        $rol = Role::findOrFail($role);

        return response()->json(['data' => $rol], 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param Role $role
     * @return JsonResponse
     */
    public function update(Request $request, Role $role)
    {
        $roleClean = $role;
        $role->fill($request->only([
            'name',
            'permissions',
        ]));

        if($role->isClean()){
            $role = $roleClean;
        }
        $role->save();

        return response()->json(['data' => $role], 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Role $role
     * @return JsonResponse
     * @throws Exception
     */
    public function destroy(Role $role)
    {
        $role->delete();

        return response()->json(['data' => $role], 200);
    }

    /**
     * Restore the specified resource from storage.
     *
     * @param $id
     * @return JsonResponse
     */
    public function Restore($id)
    {
        $role = Role::withTrashed()->findOrFail($id)->restore();

        return response()->json(['data' => $role], 200);
    }

    /**
     * Display a listing of the resource for combobox.
     *
     * @return JsonResponse
     */
    public function RoleCombo()
    {
        $roles = Role::all();

        $roles->each(function ($role) {
            $role->value = $role->id;
            $role->label = $role->name;
            unset(
                $role->id,
                $role->name,
                $role->permissions,
                $role->created_at,
                $role->updated_at,
                $role->deleted_at
            );
        });

        return response()->json(['data' => $roles], 200);
    }
}
