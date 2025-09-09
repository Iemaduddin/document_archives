"use client";
import { useEffect, useState } from "react";
import { usePage } from "@inertiajs/react";

import type { PageProps } from "@/types";
export default function FlashMessage() {
    const { flash } = usePage<PageProps>().props;
    const [visible, setVisible] = useState(true);

    // auto close dalam 5 detik
    useEffect(() => {
        if (flash.success || flash.error) {
            setVisible(true);
            const timer = setTimeout(() => setVisible(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    if (!visible || (!flash.success && !flash.error)) return null;

    return (
        <div
            className={`px-4 py-2 rounded-md shadow text-md flex items-center justify-between gap-3
          ${
              flash.success
                  ? "bg-green-100 text-green-700 border border-green-300"
                  : "bg-red-100 text-red-700 border border-red-300"
          }`}
        >
            <span>{flash.success || flash.error}</span>
        </div>
    );
}
