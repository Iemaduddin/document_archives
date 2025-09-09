import React, { useEffect, useState } from "react";
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
import DataTable from "react-data-table-component";
import { Icon } from "@iconify/react/dist/iconify.js";
import { toast } from "react-toastify";
import DataTableStyles from "@/Components/DataTableStyles";
import FlashMessage from "@/Components/FlashMesage";

interface Auth {
    user: {
        name: string;
    };
}

interface Props {
    auth: Auth;
}

interface Document {
    id: number;
    category_id?: number | null;
    category?: {
        id: number;
        name: string;
        description?: string | null;
    } | null;
    document_number: string;
    title: string;
    file: File | string;
    created_at: string;
}

export default function DocumentsManagement({ auth }: Props) {
    const { documents } = usePage<PageProps<{ documents: Document[] }>>().props;
    const [pending, setPending] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
    useEffect(() => {
        const lowercasedSearch = search.toLowerCase();
        const filtered = documents.filter(
            (document) =>
                document.category?.name
                    .toLowerCase()
                    .includes(lowercasedSearch) ||
                document.document_number
                    .toLowerCase()
                    .includes(lowercasedSearch) ||
                document.title.toLowerCase().includes(lowercasedSearch)
        );
        setFilteredDocuments(filtered);
    }, [search, documents]);

    const columns = [
        {
            name: "Nomor Surat",
            selector: (row: Document) => row.document_number,
            sortable: true,
        },
        {
            name: "Kategori",
            selector: (row: Document) => row.category?.name || "-",
            sortable: true,
            wrap: true,
        },
        {
            name: "Judul",
            selector: (row: Document) => row.title,
            sortable: true,
            wrap: true,
        },
        {
            name: "Waktu Pengarsipan",
            selector: (row: Document) =>
                new Date(row.created_at)
                    .toLocaleString("id-ID", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                    })
                    .replace(/\./g, ":")
                    .replace(/\//g, "-"),
            sortable: true,
            wrap: true,
        },
        {
            name: "Aksi",
            cell: (row: Document) => {
                return (
                    <div className="flex flex-wrap gap-2 justify-start py-3">
                        <AlertDialog.Root>
                            <AlertDialog.Trigger>
                                <Button color="red">Hapus</Button>
                            </AlertDialog.Trigger>

                            <AlertDialog.Content maxWidth="450px">
                                <AlertDialog.Title>
                                    Hapus Arsip Surat
                                </AlertDialog.Title>
                                <AlertDialog.Description size="2">
                                    Apakah Anda yakin ingin menghapus arsip
                                    <strong>{row.title}</strong>? Tindakan ini
                                    tidak dapat dibatalkan.
                                </AlertDialog.Description>

                                <Flex gap="3" mt="4" justify="end">
                                    <AlertDialog.Cancel>
                                        <Button variant="soft" color="gray">
                                            Batal
                                        </Button>
                                    </AlertDialog.Cancel>
                                    <AlertDialog.Action>
                                        <Button
                                            variant="solid"
                                            color="red"
                                            onClick={() =>
                                                handleDelete(row.id.toString())
                                            }
                                        >
                                            Ya
                                        </Button>
                                    </AlertDialog.Action>
                                </Flex>
                            </AlertDialog.Content>
                        </AlertDialog.Root>
                        <a
                            href={route("documents.download", row.id)}
                            className="inline-block"
                            rel="noopener noreferrer"
                        >
                            <Button color="yellow">Unduh</Button>
                        </a>
                        <Link href={route("documents.show", row.id)}>
                            <Button color="purple">Lihat</Button>
                        </Link>
                    </div>
                );
            },
            sortable: false,
        },
    ];

    const handleDelete = (id: string) => {
        setPending(true);
        router.delete(route("documents.destroy", id), {
            onSuccess: () => {},
            onError: (errors) => {},
            onFinish: () => setPending(false),
        });
    };

    const handleSearch = () => {
        setSearch(searchInput);
    };
    return (
        <AuthenticatedLayout auth={auth} title="Kategori Surat">
            <Head title="Kategori Surat" />
            <div className="bg-white shadow rounded-lg p-4 overflow-hidden">
                <h2 className="text-md mb-5 font-medium">
                    Berikut ini adalah kategori yang bisa digunakan untuk
                    melabeli surat. Klik "Tambah" pada kolom aksi untuk
                    menambahkan kategori baru.
                </h2>
                {/* Flash message section */}
                <FlashMessage />
                <DataTable
                    columns={columns}
                    data={filteredDocuments}
                    pagination
                    paginationPerPage={rowsPerPage}
                    paginationRowsPerPageOptions={[5, 10, 15, 20, 50]}
                    onChangePage={(page) => setCurrentPage(page)}
                    onChangeRowsPerPage={(newPerPage, page) => {
                        setRowsPerPage(newPerPage);
                        setCurrentPage(page);
                    }}
                    highlightOnHover
                    striped
                    customStyles={DataTableStyles}
                    responsive
                    pointerOnHover
                    noDataComponent="Arsip surat tidak ditemukan"
                    subHeader
                    subHeaderComponent={
                        <div className="flex flex-col sm:flex-row items-center w-full gap-3">
                            {/* Label */}
                            <h5 className="text-md w-full sm:w-auto flex-shrink-0">
                                Cari Surat
                            </h5>

                            {/* Input */}
                            <TextField.Root
                                placeholder="Search...."
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") handleSearch();
                                }}
                                className="w-full pl-10 pr-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <TextField.Slot>
                                    <Icon
                                        icon="mdi:magnify"
                                        width={20}
                                        height={20}
                                    />
                                </TextField.Slot>
                            </TextField.Root>

                            {/* Button */}
                            <Button
                                color="blue"
                                onClick={() => setSearch(searchInput)}
                                className="w-full sm:w-auto"
                            >
                                Cari
                            </Button>
                        </div>
                    }
                    className="overflow-hidden"
                />
                <div className="mt-5">
                    <Link
                        href="/documents/create"
                        className="bg-green-500 rounded-md flex items-center w-1/6 text-white font-semibold p-2 gap-3"
                    >
                        <Icon
                            icon="mdi:plus-circle-multiple-outline"
                            width={20}
                            height={20}
                        />
                        Arsipkkan Surat...
                    </Link>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
