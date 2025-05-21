// src/components/ExcelDataLoader.jsx (versi perbaikan)
import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios';

const ExcelDataLoader = ({ onDataLoaded }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [saveStatus, setSaveStatus] = useState(null);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setLoading(true);
        setError(null);
        setSaveStatus(null);

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = e.target.result;
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];

                // Pastikan angka dibaca dengan benar, paksa raw: true untuk mendapatkan nilai asli
                const jsonData = XLSX.utils.sheet_to_json(worksheet, {
                    defval: 0,
                    raw: true
                });

                console.log("Data Excel mentah:", jsonData);

                // Proses data untuk menangani format angka dengan benar
                const processedData = jsonData.map(row => {
                    // Buat objek baru dengan nilai default untuk setiap kolom
                    const processedRow = {
                        kecamatan: '',
                        luas_taman: 0,
                        luas_pemakaman: 0,
                        total_rth: 0,
                        luas_kecamatan: 0,
                        cluster: 'cluster_0'
                    };

                    // Cari kolom yang sesuai di Excel
                    Object.keys(row).forEach(key => {
                        let value = row[key];

                        // Deteksi kolom berdasarkan header
                        if (key.toUpperCase().includes('KECAMATAN') && !key.toUpperCase().includes('LUAS')) {
                            processedRow.kecamatan = String(value).trim();
                        }
                        else if (key.toUpperCase().includes('LUAS') && key.toUpperCase().includes('TAMAN')) {
                            // Pastikan nilai numerik
                            processedRow.luas_taman = parseFloat(String(value).replace(',', '.'));
                        }
                        else if (key.toUpperCase().includes('LUAS') && key.toUpperCase().includes('PEMAKAMAN')) {
                            processedRow.luas_pemakaman = parseFloat(String(value).replace(',', '.'));
                        }
                        else if (key.toUpperCase().includes('TOTAL') && key.toUpperCase().includes('RTH')) {
                            processedRow.total_rth = parseFloat(String(value).replace(',', '.'));
                        }
                        else if (key.toUpperCase().includes('LUAS') && key.toUpperCase().includes('KECAMATAN')) {
                            processedRow.luas_kecamatan = parseFloat(String(value).replace(',', '.'));
                        }
                        else if (key.toUpperCase().includes('CLUSTER')) {
                            processedRow.cluster = String(value).trim();
                        }
                    });

                    // Tambahkan log untuk debug
                    console.log("Row after processing:", processedRow);

                    return processedRow;
                });

                // Log untuk debugging
                console.log("Processed data:", processedData);

                // Format data untuk UI dengan indeks
                const uiData = processedData.map((item, index) => ({
                    id: index + 1,
                    ...item
                }));

                // Simpan ke database dan update UI
                saveToDatabase(processedData, uiData);
            } catch (error) {
                console.error("Error processing Excel file:", error);
                setError("Gagal memproses file Excel. Pastikan format file benar.");
                setLoading(false);
            }
        };

        reader.onerror = () => {
            setError("Gagal membaca file.");
            setLoading(false);
        };

        reader.readAsArrayBuffer(file);
    };

    const saveToDatabase = async (dbData, uiData) => {
        try {
            console.log("Data yang akan dikirim ke database:", dbData);

            const response = await axios.post('http://localhost:5000/api/rth-kecamatan/bulk', {
                data: dbData
            });

            setSaveStatus({
                success: true,
                message: `${response.data.count} data berhasil disimpan ke database`
            });

            // Panggil callback dengan data untuk UI
            onDataLoaded(uiData);

            setLoading(false);
        } catch (error) {
            console.error("Error saving to database:", error);
            setSaveStatus({
                success: false,
                message: `Gagal menyimpan ke database: ${error.response?.data?.message || error.message}`
            });

            // Tetap update UI meskipun gagal menyimpan ke database
            onDataLoaded(uiData);

            setLoading(false);
        }
    };

    return (
        <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                    Upload Data Excel RTH Kecamatan
                </label>
                {loading && <span className="text-sm text-blue-500">Memproses...</span>}
            </div>

            <input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileUpload}
                className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-green-50 file:text-green-700
          hover:file:bg-green-100"
            />

            {error && (
                <p className="mt-2 text-sm text-red-600">{error}</p>
            )}

            {saveStatus && (
                <div className={`mt-2 text-sm p-2 rounded ${saveStatus.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {saveStatus.message}
                </div>
            )}

            <p className="mt-1 text-sm text-gray-500">
                Format file Excel harus memiliki kolom: KECAMATAN, LUAS TAMAN, LUAS PEMAKAMAN, TOTAL RTH, LUAS KECAMATAN, dan CLUSTER
            </p>
        </div>
    );
};

export default ExcelDataLoader;