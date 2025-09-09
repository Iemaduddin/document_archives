<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    protected $fillable = ['category_id', 'document_number', 'title', 'file'];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
