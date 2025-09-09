import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import {
    Box,
    Card,
    Text,
    Flex,
    Button,
    TextField,
    Dialog,
    TextArea,
    AlertDialog,
    Badge,
    Select,
} from "@radix-ui/themes";
import { PageProps } from "@/types";
import { useState } from "react";
interface Auth {
    user: {
        name: string;
    };
}

interface Props {
    auth: Auth;
}

interface Category {
    id: number;
    name: string;
}
interface Document {
    id: number;
    category_id: number;
    document_number: string;
    title: string;
    file: File | string;
    created_at: string;
}
export default function ShowDocument({ auth }: Props) {
    const { category, document } =
        usePage<PageProps<{ category: Category | null; document: Document }>>()
            .props;

    return (
        <AuthenticatedLayout auth={auth} title="Arsip Surat >> Lihat">
            <Head title="Arsip Surat" />
            <div className="bg-white shadow rounded-lg p-4 overflow-hidden">
                <table>
                    <tbody>
                        <tr>
                            <td className="font-bold p-2">Nomor Dokumen</td>
                            <td className="p-2">{document.document_number}</td>
                        </tr>
                        <tr>
                            <td className="font-bold p-2">Kategori</td>
                            <td className="p-2">
                                {category ? category.name : "-"}
                            </td>
                        </tr>
                        <tr>
                            <td className="font-bold p-2">Judul</td>
                            <td className="p-2">{document.title}</td>
                        </tr>
                        <tr>
                            <td className="font-bold p-2">Waktu Unggah</td>
                            <td className="p-2">
                                {new Date(document.created_at)
                                    .toLocaleString("id-ID", {
                                        year: "numeric",
                                        month: "2-digit",
                                        day: "2-digit",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })
                                    .replace(/\./g, ":")
                                    .replace(/\//g, "-")}
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div className="mt-4 w-full h-[600px] border rounded overflow-hidden">
                    {document.file ? (
                        <object
                            data={
                                typeof document.file === "string" &&
                                document.file.startsWith("http")
                                    ? document.file
                                    : `/storage/${document.file}`
                            }
                            type="application/pdf"
                            className="w-full h-full"
                        >
                            <p className="text-gray-500">
                                Browser Anda tidak mendukung menampilkan PDF.
                                Silakan{" "}
                                <a
                                    href={
                                        typeof document.file === "string" &&
                                        document.file.startsWith("http")
                                            ? document.file
                                            : `/storage/${document.file}`
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline"
                                >
                                    unduh dokumen
                                </a>{" "}
                                untuk membukanya.
                            </p>
                        </object>
                    ) : (
                        <p className="text-gray-500">
                            Tidak ada dokumen untuk ditampilkan.
                        </p>
                    )}
                </div>
                <div className="flex items-center gap-4 mt-5">
                    <Link href={route("documents.index")}>
                        <Button variant="soft" color="gray">
                            Kembali
                        </Button>
                    </Link>
                    <a
                        href={route("documents.download", document.id)}
                        className="inline-block"
                        rel="noopener noreferrer"
                    >
                        <Button color="yellow">Unduh</Button>
                    </a>

                    <Link href={route("documents.edit", document.id)}>
                        <Button color="blue">Edit/Ganti File</Button>
                    </Link>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
