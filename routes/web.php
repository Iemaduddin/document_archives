<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware('auth')->group(function () {
    Route::middleware('role:Super Admin')->group(function () {
        Route::resource('users', \App\Http\Controllers\UserController::class);
    });
    // Dasboard
    Route::get('/dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');
    // Get Data Document per Category per month filter year for Chart
    Route::get('/dashboard/documents/{year}', [\App\Http\Controllers\DashboardController::class, 'documentsPerMonth'])
        ->name('dashboard.documents');

    Route::resource('categories', \App\Http\Controllers\CategoryController::class);
    Route::resource('documents', \App\Http\Controllers\DocumentController::class);
    Route::get('/documents/download/{document}', [\App\Http\Controllers\DocumentController::class, 'download'])
        ->name('documents.download');
    Route::get('/about', function () {
        return Inertia::render('About');
    })->name('about');
});



require __DIR__ . '/auth.php';
