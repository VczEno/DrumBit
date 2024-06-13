<?php

namespace App\Http\Controllers;

use App\Models\Sample;
use App\Http\Requests\StoreSampleRequest;
use App\Http\Requests\UpdateSampleRequest;
use Illuminate\Support\Facades\Storage;

class SampleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Sample::get();
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
    public function store(StoreSampleRequest $request)
    { 
        
        /* $prova=new Sample;
        $prova->name='nomediprova';
        $prova->url=$request->file("sample")->storeAs( 'public', 'prova.wav');
        
        $prova->save();
        return $prova;
 */

        $prova=new Sample;
        $filename= $request->file('sample')->getClientOriginalName(); //prendo il nome originale
        $prova->name=$filename;
        $prova->url=$request->file("sample")->storeAs( 'public', $filename); //salvo il file nello storage con il suo nome
        
        $prova->save(); //lo salvo nel DB !!come salvo KitId?
        return $prova;
    }

    /**
     * Display the specified resource.
     */
    public function show(Sample $sample)
    {
        $url=Storage::url($sample->name);
        return $url;
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Sample $sample)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSampleRequest $request, Sample $sample)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Sample $sample)
    {
        //
    }
}
