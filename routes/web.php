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
        Route::get('/dashboard', function () {
            return Inertia::render('Dashboard');
        })->name('dashboard');
        Route::resource('users', \App\Http\Controllers\UserController::class);
    });
    Route::resource('categories', \App\Http\Controllers\CategoryController::class);
    Route::resource('documents', \App\Http\Controllers\DocumentController::class);
    Route::get('/documents/download/{document}', [\App\Http\Controllers\DocumentController::class, 'download'])
        ->name('documents.download');
    Route::get('/about', function () {
        return Inertia::render('About');
    })->name('about');
});



require __DIR__ . '/auth.php';
