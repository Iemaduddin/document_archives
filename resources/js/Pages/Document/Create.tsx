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
export default function CreateDocument({ auth }: Props) {
    const [pending, setPending] = useState(false);
    const { categories } =
        usePage<PageProps<{ categories: Category[] }>>().props;
    const [formData, setFormData] = useState<{
        category_id: number;
        document_number: string;
        title: string;
        file: File | null;
    }>({
        category_id: categories.length > 0 ? categories[0].id : 0,
        document_number: "",
        title: "",
        file: null,
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setPending(true);

        router.post(route("documents.store"), formData, {
            onSuccess: () => {
                setFormData({
                    category_id: categories.length > 0 ? categories[0].id : 0,
                    document_number: "",
                    title: "",
                    file: null,
                });
            },
            onFinish: () => setPending(false),
        });
    };

    return (
        <AuthenticatedLayout auth={auth} title="Arsip Surat >> Tambah">
            <Head title="Arsip Surat" />
            <div className="bg-white shadow rounded-lg p-4 overflow-hidden">
                <h2 className="text-md mb-5 font-medium">
                    Unggah surat yang telah terbit pada form ini untuk
                    diarsipkan.
                    <br />
                    Catatan:
                    <br />
                    <ul>
                        <li>Gunakan file berformat PDF.</li>
                    </ul>
                </h2>
                <form onSubmit={handleSubmit}>
                    <Flex direction="column" gap="3">
                        {/* Nomor Surat */}
                        <Flex align="center" gap="3">
                            <Text
                                as="label"
                                size="2"
                                weight="bold"
                                htmlFor="document_number"
                                className="w-40"
                            >
                                Nomor Surat
                            </Text>
                            <TextField.Root
                                id="document_number"
                                placeholder="Masukkan Nomor Surat"
                                name="document_number"
                                value={formData.document_number}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        document_number: e.target.value,
                                    }))
                                }
                                required
                                className="flex-1"
                            />
                        </Flex>
                        {/* Kategori */}
                        <Flex align="center" gap="3">
                            <Text
                                as="label"
                                size="2"
                                weight="bold"
                                htmlFor="category_id"
                                className="w-40"
                            >
                                Kategori
                            </Text>
                            <Select.Root
                                name="category_id"
                                value={formData.category_id.toString()}
                                onValueChange={(val) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        category_id: Number(val),
                                    }))
                                }
                                required
                            >
                                <Select.Trigger
                                    placeholder="Pilih Kategori"
                                    className="flex-1 w-full"
                                    id="category_id"
                                    style={{
                                        width: "87%",
                                    }}
                                />
                                <Select.Content className="w-full">
                                    {categories.map((category) => (
                                        <Select.Item
                                            key={category.id}
                                            value={category.id.toString()}
                                        >
                                            {category.name}
                                        </Select.Item>
                                    ))}
                                </Select.Content>
                            </Select.Root>
                        </Flex>

                        {/* Judul */}
                        <Flex align="center" gap="3">
                            <Text
                                as="label"
                                size="2"
                                weight="bold"
                                htmlFor="title"
                                className="w-40"
                            >
                                Judul
                            </Text>
                            <TextField.Root
                                id="title"
                                placeholder="Masukkan Judul"
                                name="title"
                                value={formData.title}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        title: e.target.value,
                                    }))
                                }
                                required
                                className="flex-1"
                            />
                        </Flex>
                        {/* File Surat (PDF) */}
                        <Flex align="center" gap="3">
                            <Text
                                as="label"
                                size="2"
                                weight="bold"
                                htmlFor="file"
                                className="w-40 me-5"
                            >
                                File Surat (PDF)
                            </Text>
                            <input
                                type="file"
                                accept=".pdf"
                                onChange={(e) => {
                                    if (
                                        e.target.files &&
                                        e.target.files.length > 0
                                    ) {
                                        setFormData((prev) => ({
                                            ...prev,
                                            file: e.target.files![0],
                                        }));
                                    }
                                }}
                                disabled={pending}
                                className="block w-full text-sm text-gray-600
                                                            file:mr-4 file:py-2 file:px-4
                                                            file:rounded file:border-0
                                                            file:text-sm file:font-semibold
                                                            file:bg-indigo-50 file:text-blue-700
                                                            hover:file:bg-indigo-100"
                            />
                        </Flex>
                    </Flex>

                    <hr className="my-4" />

                    <Flex gap="3" mt="4" justify="start">
                        <Link href={route("documents.index")}>
                            <Button variant="soft" color="gray">
                                Kembali
                            </Button>
                        </Link>
                        <Button type="submit" disabled={pending}>
                            {pending ? "Menyimpan..." : "Simpan"}
                        </Button>
                    </Flex>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
