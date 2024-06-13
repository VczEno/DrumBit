<?php

namespace App\Http\Controllers;

use App\Models\pattern;
use App\Http\Requests\StorepatternRequest;
use App\Http\Requests\UpdatepatternRequest;

class PatternController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Pattern::get();
    }
    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorepatternRequest $request)
    {
        $patternData= [
            'pattern'=> $request->pattern,
            'user_id' => $request->user_id
        ];

        Pattern::create($patternData);

        return response(['message: pattern salvato con successo']);
    }

    /**
     * Display the specified resource.
     */
    public function show(pattern $pattern)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(pattern $pattern)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatepatternRequest $request, pattern $pattern)
    {
        $patternData= [
            'pattern'=> $request->pattern,
            'user_id' => $request->user_id
        ];
        $pattern = Pattern::find($request->id);
        $pattern->update($patternData);

        return response(['message: pattern aggiornato con successo']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(pattern $pattern)
    {
        $pattern->delete();
        
        return response(['message: pattern eliminato con successo']);
    }
}
