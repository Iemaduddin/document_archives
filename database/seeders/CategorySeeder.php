<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            ['name' => 'Pengumuman', 'description' => 'Surat-surat yang terkait dengan pengumuman'],
            ['name' => 'Undangan', 'description' => 'Undangan rapat, koordinasi, dlsb.'],
            ['name' => 'Nota Dinas', 'description' => 'Surat-surat yang bersifat dinas internal'],
            ['name' => 'Pemberitahuan', 'description' => 'Surat pemberitahuan resmi']
        ];
        foreach ($categories as $category) {
            \App\Models\Category::create($category);
        }
    }
}
