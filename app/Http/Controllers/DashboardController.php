<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        // Total Users
        $total_users = \App\Models\User::count();
        // Total Categories
        $total_categories = \App\Models\Category::count();
        // Total Documents
        $total_documents = \App\Models\Document::count();
        // Chart Jumlah Dokumen per Kategori
        $categories = \App\Models\Category::withCount('documents')->get();

        // Chart Jumlah Dokumen per Bulan (12 bulan tahun ini)
        // $year = date('Y');

        // $documents_per_month_category = \App\Models\Document::selectRaw('MONTH(created_at) as month, category_id, COUNT(*) as count')
        //     ->whereYear('created_at', $year)
        //     ->groupBy('month', 'category_id')
        //     ->get();

        // $categoriesData = \App\Models\Category::all();

        // // Bentuk series
        // $monthlyDocuments = $categoriesData->map(function ($cat) use ($documents_per_month_category) {
        //     $data = [];
        //     for ($m = 1; $m <= 12; $m++) {
        //         $doc = $documents_per_month_category
        //             ->where('month', $m)
        //             ->where('category_id', $cat->id)
        //             ->first();
        //         $data[] = $doc ? (int) $doc->count : 0;
        //     }
        //     return [
        //         'name' => $cat->name,
        //         'data' => $data, // <-- ini harus array angka murni
        //     ];
        // })->values();
        // // dd($monthlyDocuments);
        return inertia('Dashboard', [
            'total_users' => $total_users,
            'total_categories' => $total_categories,
            'total_documents' => $total_documents,
            'categories' => $categories,
            // 'monthlyDocuments' => $monthlyDocuments,
        ]);
    }
    public function documentsPerMonth($year)
    {
        $documents_per_month_category = \App\Models\Document::selectRaw('MONTH(created_at) as month, category_id, COUNT(*) as count')
            ->whereYear('created_at', $year)
            ->groupBy('month', 'category_id')
            ->get();

        $categoriesData = \App\Models\Category::all();

        $monthlyDocuments = $categoriesData->map(function ($cat) use ($documents_per_month_category) {
            $data = [];
            for ($m = 1; $m <= 12; $m++) {
                $doc = $documents_per_month_category
                    ->where('month', $m)
                    ->where('category_id', $cat->id)
                    ->first();
                $data[] = $doc ? (int) $doc->count : 0;
            }
            return [
                'name' => $cat->name,
                'data' => $data,
            ];
        })->values();

        return response()->json($monthlyDocuments);
    }
}
