// src/pages/DataPage.jsx - dengan perubahan warna cluster
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DataPage = () => {
    // State untuk menyimpan data
    const [kecamatanData, setKecamatanData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Ambil data dari database saat komponen dimuat
    useEffect(() => {
        fetchData();
    }, []);

    // Fungsi untuk mengambil data dari database
    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:5000/api/rth-kecamatan');

            // Format data dari database untuk UI
            const formattedData = response.data.map((item, index) => ({
                id: item._id,
                index: index + 1,
                kecamatan: item.kecamatan,
                luas_taman: item.luas_taman,
                luas_pemakaman: item.luas_pemakaman,
                total_rth: item.total_rth,
                luas_kecamatan: item.luas_kecamatan,
                cluster: item.cluster
            }));

            setKecamatanData(formattedData);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching data:", err);
            setError("Gagal mengambil data: " + (err.response?.data?.message || err.message));
            setLoading(false);
        }
    };

    // Hitung total dan rata-rata
    const totalLuasTaman = kecamatanData.reduce((sum, item) => sum + (item.luas_taman || 0), 0);
    const totalLuasPemakaman = kecamatanData.reduce((sum, item) => sum + (item.luas_pemakaman || 0), 0);
    const totalRth = kecamatanData.reduce((sum, item) => sum + (item.total_rth || 0), 0);
    const totalLuasKecamatan = kecamatanData.reduce((sum, item) => sum + (item.luas_kecamatan || 0), 0);

    // Hitung persentase RTH dari luas total kecamatan
    const persentaseRth = totalLuasKecamatan > 0 ? (totalRth / totalLuasKecamatan) * 100 : 0;

    // Cluster counts
    const clusterCounts = kecamatanData.reduce((counts, item) => {
        const cluster = item.cluster || 'undefined';
        counts[cluster] = (counts[cluster] || 0) + 1;
        return counts;
    }, {});

    // Urutan cluster yang diinginkan
    const orderedClusterKeys = ['cluster_0', 'cluster_1', 'cluster_2'].filter(cluster =>
        clusterCounts.hasOwnProperty(cluster)
    );

    // Tambahkan cluster lain yang mungkin ada tetapi tidak termasuk dalam urutan di atas
    Object.keys(clusterCounts).forEach(cluster => {
        if (!orderedClusterKeys.includes(cluster)) {
            orderedClusterKeys.push(cluster);
        }
    });

    // Fungsi untuk menentukan warna berdasarkan cluster
    const getClusterColor = (cluster) => {
        switch (cluster) {
            case 'cluster_0':
                return {
                    bg: 'bg-red-500',
                    bgLight: 'bg-red-100',
                    text: 'text-red-800'
                };
            case 'cluster_1':
                return {
                    bg: 'bg-yellow-500',
                    bgLight: 'bg-yellow-100',
                    text: 'text-yellow-800'
                };
            case 'cluster_2':
                return {
                    bg: 'bg-green-500',
                    bgLight: 'bg-green-100',
                    text: 'text-green-800'
                };
            default:
                return {
                    bg: 'bg-gray-500',
                    bgLight: 'bg-gray-100',
                    text: 'text-gray-800'
                };
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto"></div>
                <p className="mt-2">Loading data...</p>
            </div>
        </div>;
    }

    return (
        <div className="container mx-auto px-4 py-6">

            {/* Dashboard informasi */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-lg shadow-md p-4">
                    <h3 className="text-lg font-semibold mb-2 text-gray-700">Total RTH Publik</h3>
                    <p className="text-3xl font-bold text-green-600">{totalRth.toFixed(2)} ha</p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-4">
                    <h3 className="text-lg font-semibold mb-2 text-gray-700">Persentase RTH Publik</h3>
                    <p className="text-3xl font-bold text-blue-600">{persentaseRth.toFixed(2)}%</p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-4">
                    <h3 className="text-lg font-semibold mb-2 text-gray-700">Jumlah Kecamatan</h3>
                    <p className="text-3xl font-bold text-purple-600">{kecamatanData.length}</p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-4">
                    <h3 className="text-lg font-semibold mb-2 text-gray-700">Target RTH Publik</h3>
                    <div className="flex items-center justify-between">
                        <p className="text-3xl font-bold text-red-600">20%</p>
                        <div className="text-sm text-gray-500">
                            {persentaseRth < 20 ?
                                <span className="text-red-500">Belum tercapai</span> :
                                <span className="text-green-500">Tercapai</span>
                            }
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabel data RTH */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                <div className="p-4 border-b">
                    <h2 className="text-xl font-semibold">Data Ruang Terbuka Hijau Publik Kota Bandung</h2>
                    <p className="text-sm text-gray-600 mt-1">
                        Data luas taman, pemakaman dan ruang terbuka hijau di setiap kecamatan
                    </p>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kecamatan</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Luas Taman (ha)</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Luas Pemakaman (ha)</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total RTH (ha)</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Luas Kecamatan (ha)</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cluster</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {kecamatanData.map((data, index) => {
                                const clusterColor = getClusterColor(data.cluster);

                                return (
                                    <tr key={data.id || index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{data.kecamatan}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                            {typeof data.luas_taman === 'number' ? data.luas_taman.toFixed(3) : data.luas_taman}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                            {typeof data.luas_pemakaman === 'number' ? data.luas_pemakaman.toFixed(3) : data.luas_pemakaman}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                            {typeof data.total_rth === 'number' ? data.total_rth.toFixed(3) : data.total_rth}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                            {typeof data.luas_kecamatan === 'number' ? data.luas_kecamatan.toFixed(0) : data.luas_kecamatan}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                            <span className={`px-2 py-1 rounded-full text-xs ${clusterColor.bgLight} ${clusterColor.text}`}>
                                                {data.cluster}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                        <tfoot className="bg-gray-50">
                            <tr>
                                <td className="px-4 py-3 text-sm font-medium text-gray-900" colSpan="2">Total</td>
                                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                    {totalLuasTaman.toFixed(3)}
                                </td>
                                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                    {totalLuasPemakaman.toFixed(3)}
                                </td>
                                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                    {totalRth.toFixed(3)}
                                </td>
                                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                    {totalLuasKecamatan.toFixed(0)}
                                </td>
                                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                    -
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

            {/* Informasi tambahan */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-md p-4">
                    <h2 className="text-lg font-semibold mb-4">Distribusi RTH per Cluster</h2>
                    <div className="space-y-4">
                        {/* Menggunakan orderedClusterKeys untuk mengurutkan tampilan cluster */}
                        {orderedClusterKeys.map((cluster, index) => {
                            const clusterColor = getClusterColor(cluster);

                            return (
                                <div key={index} className="flex items-center">
                                    <div className={`w-3 h-3 rounded-full mr-2 ${clusterColor.bg}`}></div>
                                    <div className="flex-1">
                                        <div className="flex justify-between mb-1">
                                            <span className="text-sm font-medium text-gray-700">{cluster}</span>
                                            <span className="text-sm font-medium text-gray-700">{clusterCounts[cluster]} kecamatan</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div className={`h-2 rounded-full ${clusterColor.bg}`}
                                                style={{ width: `${(clusterCounts[cluster] / kecamatanData.length) * 100}%` }}>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-4">
                    <h2 className="text-lg font-semibold mb-4">Informasi RTH</h2>
                    <p className="text-gray-700 mb-4">
                        Total luas RTH Publik di Kota Bandung saat ini adalah {persentaseRth.toFixed(2)}% dari luas wilayah kota.
                        Target yang ditetapkan dalam rencana tata ruang kota adalah 20% sesuai dengan standar nasional.
                    </p>

                    <div className="bg-green-50 p-3 rounded-lg">
                        <h3 className="text-md font-semibold text-green-700 mb-2">Komposisi RTH</h3>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">Taman</span>
                            <span className="text-gray-800 font-medium">
                                {totalLuasTaman.toFixed(2)} ha
                                ({(totalRth > 0 ? (totalLuasTaman / totalRth * 100) : 0).toFixed(1)}%)
                            </span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Pemakaman</span>
                            <span className="text-gray-800 font-medium">
                                {totalLuasPemakaman.toFixed(2)} ha
                                ({(totalRth > 0 ? (totalLuasPemakaman / totalRth * 100) : 0).toFixed(1)}%)
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DataPage;