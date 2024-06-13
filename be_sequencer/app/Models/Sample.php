<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Sample extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'url'
    ];

    public function kit () : BelongsTo  {
        return $this->belongsTo(Kit::class);
    }
}
