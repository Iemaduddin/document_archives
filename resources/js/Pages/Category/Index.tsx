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

interface Category {
    id: number;
    name: string;
    description: string;
}

export default function CategoriesManagement({ auth }: Props) {
    const { categories } =
        usePage<PageProps<{ categories: Category[] }>>().props;
    const [pending, setPending] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [filteredCategories, setFilteredCategories] = useState<Category[]>(
        []
    );
    useEffect(() => {
        const lowercasedSearch = search.toLowerCase();
        const filtered = categories.filter(
            (category) =>
                category.name.toLowerCase().includes(lowercasedSearch) ||
                category.description.toLowerCase().includes(lowercasedSearch)
        );
        setFilteredCategories(filtered);
    }, [search, categories]);

    const columns = [
        {
            name: "ID Kategori",
            selector: (row: Category) => row.id,
            sortable: true,
            width: "150px",
        },
        {
            name: "Nama Kategori",
            selector: (row: Category) => row.name,
            sortable: true,
        },
        {
            name: "Keterangan",
            selector: (row: Category) => row.description,
            sortable: true,
            wrap: true,
        },
        {
            name: "Aksi",
            cell: (row: Category) => {
                return (
                    <div className="flex justify-center items-center gap-2">
                        <AlertDialog.Root>
                            <AlertDialog.Trigger>
                                <Button color="red">Hapus</Button>
                            </AlertDialog.Trigger>

                            <AlertDialog.Content maxWidth="450px">
                                <AlertDialog.Title>
                                    Hapus Kategori
                                </AlertDialog.Title>
                                <AlertDialog.Description size="2">
                                    Apakah Anda yakin ingin menghapus kategori{" "}
                                    <strong>{row.name}</strong>? Tindakan ini
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
                        <Link href={route("categories.edit", row.id)}>
                            <Button color="blue">Edit</Button>
                        </Link>
                    </div>
                );
            },
            sortable: false,
        },
    ];

    const handleDelete = (id: string) => {
        setPending(true);
        router.delete(route("categories.destroy", id), {
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
                    Berikut ini adalah surat-surat yang telah terbit dan
                    diarsipkan. Klik "Lihat" pada kolom aksi untuk menampilkan
                    surat.
                </h2>
                {/* Flash message section */}
                <FlashMessage />
                <DataTable
                    columns={columns}
                    data={filteredCategories}
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
                    noDataComponent="Kategori tidak ditemukan"
                    subHeader
                    subHeaderComponent={
                        <div className="flex flex-col sm:flex-row items-center w-full gap-3">
                            {/* Label */}
                            <h5 className="text-md w-full sm:w-auto flex-shrink-0">
                                Cari Kategori
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
                        href="/categories/create"
                        className="bg-green-500 rounded-md flex items-center w-1/6 text-white font-semibold p-2 gap-3"
                    >
                        <Icon
                            icon="mdi:plus-circle-multiple-outline"
                            width={20}
                            height={20}
                        />
                        Tambah Kategori Baru
                    </Link>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
