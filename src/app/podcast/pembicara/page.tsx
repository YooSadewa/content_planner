"use client"
import { useEffect, useState } from "react";
import { columns } from "./columns";
import { DataSpeakerTable } from "./datatable";
import axios from "axios";

export default function PembicaraPage() {
    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/api/pembicara");
                if (response.data.status && response.data.data.pembicara) {
                    setTableData(response.data.data.pembicara);
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
            <DataSpeakerTable columns={columns} data={tableData} onVerify={onVerify}/>
        </div>
    );
}