<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DocumentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $documents = Document::with('category')->get();
        return inertia('Document/Index', compact('documents'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $categories = Category::select('id', 'name')->get();
        return inertia('Document/Create', compact('categories'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'category_id' => 'required|exists:categories,id',
                'document_number' => 'required|max:255',
                'title' => 'required|string|max:255',
            ]);
            // Handle file upload if a document is provided
            if ($request->hasFile('file')) {
                $request->validate([
                    'file' => 'file|mimes:pdf',
                ]);
                $documentName = $request->title . '-' . time();
                $documentPath = $request->file('file')->storeAs(
                    'Documents',
                    $documentName . '.' . $request->file('file')->getClientOriginalExtension(),
                    'public'
                );
                $validated['file'] = $documentPath;
            } else {
                $validated['file'] = null;
            }

            Document::create($validated);

            return redirect()
                ->route('documents.index')
                ->with('success', 'Arsip surat berhasil!.');
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->with('error', 'Gagal arsip surat: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Document $document)
    {
        $category = $document->category()->select('id', 'name')
            ->first();
        return inertia('Document/Show', compact('category', 'document'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Document $document)
    {
        $categories = Category::select('id', 'name')->get();
        return inertia('Document/Edit', compact('categories', 'document'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Document $document)
    {
        try {
            $validated = $request->validate([
                'category_id' => 'required|exists:categories,id',
                'document_number' => 'required|max:255',
                'title' => 'required|string|max:255',
            ]);
            // Handle file upload if a document is provided
            if ($request->hasFile('file')) {
                // Hapus file lama jika ada
                if ($document->file && Storage::disk('public')->exists($document->file)) {
                    Storage::disk('public')->delete($document->file);
                }
                $request->validate([
                    'file' => 'file|mimes:pdf',
                ]);
                $documentName = $request->title . '-' . time();
                $documentPath = $request->file('file')->storeAs(
                    'Documents',
                    $documentName . '.' . $request->file('file')->getClientOriginalExtension(),
                    'public'
                );
                $validated['file'] = $documentPath;
            } else {
                // Jika tidak ada file baru diunggah, pertahankan file lama
                unset($validated['file']);
            }

            $document->update($validated);

            return redirect()
                ->route('documents.index')
                ->with('success', 'Surat berhasil diperbarui!.');
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->with('error', 'Gagal membuat dokumen: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Document $document)
    {
        try {
            $document->delete();
            // Hapus file terkait jika ada
            if ($document->file && Storage::disk('public')->exists($document->file)) {
                Storage::disk('public')->delete($document->file);
            }
            return redirect()
                ->route('documents.index')
                ->with('success', 'Surat berhasil dihapus.');
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->with('error', 'Gagal menghapus surat: ' . $e->getMessage());
        }
    }
    public function download(Document $document)
    {
        $filePath = storage_path('app/public/' . $document->file);

        if (!file_exists($filePath)) {
            abort(404, 'File not found.');
        }

        return response()->download($filePath);
    }
}