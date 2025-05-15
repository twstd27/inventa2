<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\User;
use DB;
use Exception;
use Hash;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return JsonResponse
     */
    public function index()
    {
        $users = User::all();

        return response()->json(['data' => $users],200);
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
            'name' => 'required',
            'lastname' => 'required',
            'role_id' => 'required',
            'email' => 'email|unique:users',
            'password' => 'required|min:5'
        ];

        $this->validate($request, $rules);

        $fields = $request->all();
        $fields['password'] = bcrypt($request->password);
        $fields['verification_token'] = User::generarVerificationToken();

        $user = User::create($fields);

        return response()->json(['data' => $user],201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return JsonResponse
     */
    public function show($id)
    {
        $user = User::findOrFail($id);
        return response()->json(['data' => $user], 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param int $id
     * @return JsonResponse
     * @throws ValidationException
     */
    public function update(Request $request, int $id)
    {
        $user = User::findOrFail($id);
        $userClean = $user;

        if($request->email != $user->email){
            $rules = [
                'email' => 'email|unique:users'
            ];

            $this->validate($request, $rules);
        }

        $user->fill($request->only([
            'name',
            'lastname',
            'email',
            'phone',
            'role_id'
        ]));

        if (!$user->isDirty()){
            $user = $userClean;
        }
        else{
            $user->save();
        }

        return response()->json(['data' => $user],200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param User $user
     * @return JsonResponse
     * @throws Exception
     */
    public function destroy(User $user)
    {
        $user->delete();

        return response()->json(['data' => $user],200);
    }

    /**
     * Restore the specified resource from storage.
     *
     * @param $id
     * @return JsonResponse
     */
    public function Restore($id)
    {
        $user = User::withTrashed()->findOrFail($id);
        User::withTrashed()->find($id)->restore();

        return response()->json(['data' => $user], 200);
    }

    public function Login(Request $request)
    {
        $rules = [
            'email' => 'required',
            'password' => 'required|string'
        ];
        $this->validate($request, $rules);

        $usuario = DB::table('users')->select('id','password')->where('email', '=', $request->email)->first();

        $response = array(
            'status' => 'error',
            'message' => 'usuario o contraseña incorrectos'
        );

        if($usuario != null){
            if(Hash::check($request->password, $usuario->password)) {
                $user = User::find($usuario->id);
                if($user != null){
                    $user->permissions = json_decode(Role::withTrashed()->findOrFail($user->role_id)->permissions);
                    $response = array(
                        'status' => 'ok',
                        'usuario' => $user
                    );
                }
            }
        }

        return response()->json(['data' => $response],200);
    }

    public function Lista()
    {
        $users = User::withTrashed()->get();

        $users->each(function ($user) {
            $user->rol = Role::withTrashed()->findOrFail($user->role_id)->name;
        });

        return response()->json(['data' => $users],200);
    }
}
