"use client"
import { useEffect, useState } from "react";
import { columns } from "./columns";
import { DataHostTable } from "./datatable";
import axios from "axios";

export default function HostPage() {
    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/api/host");
                if (response.data.status && response.data.data.host) {
                    setTableData(response.data.data.host);
                } else {
                    setError("Format data tidak sesuai");
                }
            } catch (err) {
                console.error("Error:", err);
                setError("Gagal mengambil data dari API")
            } finally {
                setLoading(false)
            }
        };

        fetchData();
    }, []);

    const onVerify = async (idHost: number) => {
        console.log(idHost)
    }
    return (
        <div className="w-6/12">
            <DataHostTable columns={columns} data={tableData} onVerify={onVerify}/>
        </div>
    );
}