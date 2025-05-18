// src/pages/DataPage.jsx
import React from 'react';

const DataPage = () => {
    // Data dummy, nantinya bisa diganti dengan data asli dari API
    const kecamatanData = [
        { id: 1, nama: 'Bandung Kulon', luas_rth: 125.5, persentase: 12.5 },
        { id: 2, nama: 'Babakan Ciparay', luas_rth: 87.2, persentase: 9.8 },
        { id: 3, nama: 'Bojongloa Kaler', luas_rth: 65.3, persentase: 8.3 },
        { id: 4, nama: 'Bojongloa Kidul', luas_rth: 92.1, persentase: 10.2 },
        { id: 5, nama: 'Astanaanyar', luas_rth: 56.7, persentase: 7.5 },
        { id: 6, nama: 'Regol', luas_rth: 78.9, persentase: 9.1 },
        { id: 7, nama: 'Lengkong', luas_rth: 103.2, persentase: 11.8 },
        { id: 8, nama: 'Bandung Kidul', luas_rth: 68.4, persentase: 8.7 },
    ];

    return (
        <div className="container mx-auto px-4 py-6">
            <h1 className="text-2xl font-bold mb-6">Data Ruang Terbuka Hijau Kota Bandung</h1>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4 border-b">
                    <h2 className="text-xl font-semibold">Statistik per Kecamatan</h2>
                    <p className="text-sm text-gray-600 mt-1">
                        Data luas dan persentase ruang terbuka hijau di setiap kecamatan Kota Bandung
                    </p>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kecamatan</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Luas RTH (ha)</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Persentase (%)</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {kecamatanData.map((kecamatan, index) => (
                                <tr key={kecamatan.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{kecamatan.nama}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{kecamatan.luas_rth}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{kecamatan.persentase}%</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="bg-gray-50">
                            <tr>
                                <td className="px-6 py-3 text-sm font-medium text-gray-900" colSpan="2">Total</td>
                                <td className="px-6 py-3 text-sm font-medium text-gray-900">
                                    {kecamatanData.reduce((sum, item) => sum + item.luas_rth, 0).toFixed(1)}
                                </td>
                                <td className="px-6 py-3 text-sm font-medium text-gray-900">
                                    {(kecamatanData.reduce((sum, item) => sum + item.persentase, 0) / kecamatanData.length).toFixed(1)}%
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-md p-4">
                    <h2 className="text-lg font-semibold mb-4">Jenis Ruang Terbuka Hijau</h2>
                    <ul className="space-y-2">
                        <li className="flex justify-between">
                            <span>Taman Kota</span>
                            <span className="font-medium">12 lokasi</span>
                        </li>
                        <li className="flex justify-between">
                            <span>Hutan Kota</span>
                            <span className="font-medium">5 lokasi</span>
                        </li>
                        <li className="flex justify-between">
                            <span>Jalur Hijau</span>
                            <span className="font-medium">23 lokasi</span>
                        </li>
                        <li className="flex justify-between">
                            <span>Sempadan Sungai</span>
                            <span className="font-medium">18 lokasi</span>
                        </li>
                        <li className="flex justify-between">
                            <span>RTH Pemakaman</span>
                            <span className="font-medium">15 lokasi</span>
                        </li>
                    </ul>
                </div>

                <div className="bg-white rounded-lg shadow-md p-4">
                    <h2 className="text-lg font-semibold mb-4">Informasi Tambahan</h2>
                    <p className="text-gray-700 mb-2">
                        Total luas RTH di Kota Bandung saat ini adalah 12.5% dari luas wilayah kota. Target yang
                        ditetapkan dalam rencana tata ruang kota adalah 30% sesuai dengan standar nasional.
                    </p>
                    <p className="text-gray-700">
                        Data ini diperbarui terakhir pada Mei 2025 berdasarkan hasil verifikasi lapangan dan
                        pemetaan terbaru.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DataPage;