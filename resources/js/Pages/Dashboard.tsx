import React, { useEffect, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, usePage } from "@inertiajs/react";
import { PageProps } from "@/types";
import { Icon } from "@iconify/react/dist/iconify.js";
import Chart from "react-apexcharts";
import { Select } from "@radix-ui/themes";

interface Auth {
    user: {
        roles: any;
        name: string;
    };
}

interface Props {
    auth: Auth;
}
interface CategoryData {
    id: number;
    name: string;
    documents_count: number;
}

interface MonthlyDocument {
    name: string;
    data: [];
}
interface DashboardData {
    total_users: number;
    total_categories: number;
    total_documents: number;
    categories: CategoryData[];
    monthlyDocuments: MonthlyDocument[];
    [key: string]: unknown;
}

export default function Dashboard({ auth }: Props) {
    const { total_users, total_categories, total_documents, categories } =
        usePage<PageProps<DashboardData>>().props;
    // Data untuk chart kategori
    const categorySeries = categories?.map((cat) => cat.documents_count) || [];
    const categoryOptions: ApexCharts.ApexOptions = {
        chart: { type: "bar", height: 350 },
        xaxis: { categories: categories?.map((cat) => cat.name) || [] },
        dataLabels: { enabled: true },
        title: { text: "Jumlah Dokumen per Kategori", align: "center" },
        colors: categories?.map((_, idx) => {
            // ambil warna berbeda berdasarkan index
            const palette = [
                "#1E90FF", // DodgerBlue
                "#FF6347", // Tomato
                "#32CD32", // LimeGreen
                "#FFD700", // Gold
                "#8A2BE2", // BlueViolet
                "#FF1493", // DeepPink
                "#00CED1", // DarkTurquoise
                "#FF8C00", // DarkOrange
                "#20B2AA", // LightSeaGreen
                "#FF4500", // OrangeRed
                "#6A5ACD", // SlateBlue
                "#FF69B4", // HotPink
                "#3CB371", // MediumSeaGreen
                "#FFA500", // Orange
                "#7B68EE", // MediumSlateBlue
                "#DC143C", // Crimson
                "#40E0D0", // Turquoise
            ];
            return palette[idx % palette.length];
        }),
        plotOptions: {
            bar: {
                distributed: true, // penting agar tiap bar beda warna
            },
        },
        legend: { show: true },
        yaxis: {
            labels: {
                formatter: (val) => Math.round(val).toString(),
            },
            tickAmount: undefined,
        },
    };

    const months = [
        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Agustus",
        "September",
        "Oktober",
        "November",
        "Desember",
    ];

    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [monthlyDocuments, setMonthlyDocuments] = useState<any[]>([]);

    // ambil data dari API
    useEffect(() => {
        fetch(`/dashboard/documents/${selectedYear}`)
            .then((res) => res.json())
            .then((data) => setMonthlyDocuments(data))
            .catch((err) => console.error("Gagal fetch data:", err));
    }, [selectedYear]);

    const monthlyOptions: ApexCharts.ApexOptions = {
        chart: { type: "bar", stacked: true, height: 350 },
        plotOptions: { bar: { horizontal: false } },
        dataLabels: { enabled: true },
        title: {
            text: `Jumlah Dokumen per Bulan (${selectedYear})`,
            align: "center",
        },
        xaxis: { categories: months },
        colors: [
            "#1E90FF",
            "#FF6347",
            "#32CD32",
            "#FFD700",
            "#8A2BE2",
            "#FF1493",
            "#00CED1",
            "#FF8C00",
            "#20B2AA",
            "#FF4500",
            "#6A5ACD",
            "#FF69B4",
        ],
        yaxis: {
            labels: {
                formatter: (val: number) => Math.round(val).toString(),
            },
        },
        tooltip: { y: { formatter: (val: number) => val.toString() } },
    };

    return (
        <AuthenticatedLayout auth={auth} title="Dashboard">
            <Head title="Dashboard" />

            <div className="space-y-6">
                {/* Welcome Section */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Selamat Datang, {auth.user.name} 👋
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Berikut adalah ringkasan data persuratan pada sistem
                        Anda.
                    </p>
                </div>

                {/* Stats Cards */}
                <div
                    className={`grid grid-cols-1 sm:grid-cols-2 ${
                        auth.user.roles?.[0]?.name === "Super Admin"
                            ? "lg:grid-cols-3"
                            : "lg:grid-cols-2"
                    }  gap-4`}
                >
                    {auth.user.roles?.[0]?.name === "Super Admin" && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center">
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-blue-600">
                                    Jumlah Pengguna
                                </span>
                                <span className="text-2xl font-bold mt-1">
                                    {total_users}
                                </span>
                            </div>
                            <div className="ml-auto text-blue-600">
                                <Icon
                                    icon="mdi:account-multiple"
                                    className="w-12 h-12"
                                />
                            </div>
                        </div>
                    )}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center">
                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-green-600">
                                Jumlah Kategori Surat
                            </span>
                            <span className="text-2xl font-bold mt-1">
                                {total_categories}
                            </span>
                        </div>
                        <div className="ml-auto text-green-600">
                            <Icon
                                icon="mdi:file-document-box-multiple-outline"
                                className="w-12 h-12"
                            />
                        </div>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center">
                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-amber-600">
                                Jumlah Surat
                            </span>
                            <span className="text-2xl font-bold mt-1">
                                {total_documents}
                            </span>
                        </div>
                        <div className="ml-auto text-amber-600">
                            <Icon icon="mdi:document" className="w-12 h-12" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="space-y-6 mt-5">
                {/* Chart Jumlah Dokumen per Kategori */}
                <div className="bg-white p-4 rounded shadow">
                    <Chart
                        options={{
                            ...categoryOptions,
                            chart: {
                                ...categoryOptions.chart,
                                type: "bar",
                            },
                            title: {
                                ...categoryOptions.title,
                                align: "center",
                            },
                        }}
                        series={[{ name: "Dokumen", data: categorySeries }]}
                        type="bar"
                        height={350}
                    />
                </div>

                {/* Chart Jumlah Dokumen per Bulan */}
                <div className="bg-white p-4 rounded shadow">
                    <div className="flex items-center gap-2 mb-2">
                        <label className="font-semibold">Pilih Tahun:</label>
                        <Select.Root
                            size="2"
                            defaultValue={selectedYear.toString()}
                            onValueChange={(val) =>
                                setSelectedYear(parseInt(val))
                            }
                        >
                            <Select.Trigger />
                            <Select.Content position="popper" sideOffset={5}>
                                {Array.from(
                                    { length: 5 },
                                    (_, i) => new Date().getFullYear() - i
                                ).map((y) => (
                                    <Select.Item key={y} value={y.toString()}>
                                        {y}
                                    </Select.Item>
                                ))}
                            </Select.Content>
                        </Select.Root>
                    </div>

                    <Chart
                        options={monthlyOptions}
                        series={monthlyDocuments}
                        type="bar"
                        height={350}
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
