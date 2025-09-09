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
import FlashMessage from "@/Components/FlashMesage";
interface Auth {
    user: {
        name: string;
    };
}

interface Props {
    auth: Auth;
}

type Category = {
    id: number;
    name: string;
    description?: string | null;
};
export default function EditCategory({ auth }: Props) {
    const [pending, setPending] = useState(false);
    const { category } = usePage<PageProps<{ category: Category }>>().props;
    const [formData, setFormData] = useState({
        name: category.name || "",
        description: category.description || "",
    });

    const handleUpdate = () => {
        setPending(true);

        router.put(route("categories.update", category.id), formData, {
            onSuccess: () => {
                setFormData({ name: "", description: "" });
            },
            onFinish: () => setPending(false),
        });
    };

    return (
        <AuthenticatedLayout auth={auth} title="Kategori Surat >> Tambah">
            <Head title="Kategori Surat" />
            <div className="bg-white shadow rounded-lg p-4 overflow-hidden">
                <h2 className="text-md mb-5 font-medium">
                    Tambahkan data kategori. Jika sudah selesai, jangan lupa
                    untuk mengklik tombol "Simpan"
                </h2>
                <FlashMessage />
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleUpdate();
                    }}
                >
                    <Flex direction="column" gap="3">
                        {/* ID */}
                        <Flex align="center" gap="3">
                            <Text
                                as="label"
                                size="2"
                                weight="bold"
                                htmlFor="id"
                                className="w-40"
                            >
                                ID (Auto Increment)
                            </Text>
                            <TextField.Root
                                id="id"
                                placeholder="Auto Generated"
                                value={category.id}
                                disabled
                                className="flex-1"
                            />
                        </Flex>

                        {/* Name */}
                        <Flex align="center" gap="3">
                            <Text
                                as="label"
                                size="2"
                                weight="bold"
                                htmlFor="name"
                                className="w-40"
                            >
                                Name
                            </Text>
                            <TextField.Root
                                id="name"
                                placeholder="Masukkan user name"
                                name="name"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        name: e.target.value,
                                    }))
                                }
                                required
                                className="flex-1"
                            />
                        </Flex>

                        {/* Keterangan */}
                        <Flex align="center" gap="3">
                            <Text
                                as="label"
                                size="2"
                                weight="bold"
                                htmlFor="description"
                                className="w-40"
                            >
                                Keterangan
                            </Text>
                            <TextArea
                                rows={5}
                                resize={"vertical"}
                                id="description"
                                placeholder="Masukkan description"
                                name="description"
                                value={formData.description || ""}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        description: e.target.value,
                                    }))
                                }
                                required
                                className="flex-1"
                            />
                        </Flex>
                    </Flex>

                    <hr className="my-4" />

                    <Flex gap="3" mt="4" justify="start">
                        <Link href={route("categories.index")}>
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
