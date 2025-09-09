import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

interface Auth {
    user: {
        name: string;
    };
}

interface Props {
    auth: Auth;
}

export default function About({ auth }: Props) {
    return (
        <AuthenticatedLayout auth={auth} title="Tentang Aplikasi">
            <Head title="Tentang Aplikasi" />

            <div className="bg-white shadow rounded-lg p-6 flex flex-col items-center">
                {/* Foto Profil */}
                <img
                    src="/foto_didin.png"
                    alt="Foto Didin"
                    className="
    w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-64 lg:h-64
    rounded-full object-cover mb-6
    border-4 border-blue-900 shadow-md
    transition duration-300 ease-in-out
    hover:scale-105 hover:shadow-xl hover:border-indigo-500 hover:bg-blue-100
    cursor-pointer
  "
                />

                {/* Tabel Identitas */}
                <div className="w-full md:w-1/2">
                    <table className="table-auto w-full border-collapse border border-gray-300 text-left">
                        <thead>
                            <tr>
                                <th
                                    colSpan={2}
                                    className="border border-gray-300 bg-gray-100 px-4 py-2 text-center text-lg font-semibold"
                                >
                                    Aplikasi ini dibuat oleh
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="border border-gray-300 px-4 py-2 font-medium">
                                    Nama
                                </td>
                                <td className="border border-gray-300 px-4 py-2">
                                    Iemaduddin (Didin)
                                </td>
                            </tr>
                            <tr>
                                <td className="border border-gray-300 px-4 py-2 font-medium">
                                    Prodi
                                </td>
                                <td className="border border-gray-300 px-4 py-2">
                                    D4 Teknik Informatika
                                </td>
                            </tr>
                            <tr>
                                <td className="border border-gray-300 px-4 py-2 font-medium">
                                    NIM
                                </td>
                                <td className="border border-gray-300 px-4 py-2">
                                    2141720055
                                </td>
                            </tr>
                            <tr>
                                <td className="border border-gray-300 px-4 py-2 font-medium">
                                    Tanggal
                                </td>
                                <td className="border border-gray-300 px-4 py-2">
                                    29 Agustuts 2025
                                </td>
                            </tr>
                            <tr>
                                <td className="border border-gray-300 px-4 py-2 font-medium">
                                    Link Github
                                </td>
                                <td className="border border-gray-300 px-4 py-2">
                                    <a
                                        href="https://github.com/Iemaduddin"
                                        target="_blank"
                                    >
                                        https://github.com/Iemaduddin
                                    </a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
