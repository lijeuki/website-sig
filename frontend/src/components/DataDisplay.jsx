// frontend/src/components/DataDisplay.jsx - Enhanced with Sort and Filter
import { useState, useEffect } from 'react';

const DataDisplay = () => {
    const [data, setData] = useState([]);
    const [rawResponse, setRawResponse] = useState(null); // Untuk debugging
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Sort and filter states
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [searchTerm, setSearchTerm] = useState('');
    const [clusterFilter, setClusterFilter] = useState('all');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                console.log("Fetching data from API...");

                const response = await fetch('http://localhost:5000/api/csvdata');

                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }

                const result = await response.json();

                // Save raw response for debugging
                setRawResponse(result);
                console.log("Raw API response:", result);

                if (result.data && Array.isArray(result.data)) {
                    console.log("CSV data loaded:", result.data.length, "records");

                    // Debugging 
                    if (result.data.length > 0) {
                        const item = result.data[0];
                        console.log("First data item:", item);
                        console.log("Keys:", Object.keys(item));

                        // Log each property and its value
                        Object.keys(item).forEach(key => {
                            console.log(`${key}: ${item[key]} (${typeof item[key]})`);
                        });
                    }

                    setData(result.data);
                } else {
                    console.error("Invalid data format:", result);
                    throw new Error('Invalid data format');
                }
            } catch (err) {
                setError(err.message);
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Get unique clusters from data
    const getUniqueClusters = () => {
        const clusters = new Set();
        data.forEach(item => {
            if (item.CLUSTER) {
                clusters.add(item.CLUSTER);
            }
        });
        return Array.from(clusters);
    };

    // Cluster name mapping
    const getClusterName = (cluster) => {
        switch (cluster) {
            case 'cluster_0': return 'Tinggi';
            case 'cluster_1': return 'Sedang';
            case 'cluster_2': return 'Rendah';
            default: return cluster;
        }
    };

    // Request sort on a column
    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    // Filter and sort data
    const getFilteredAndSortedData = () => {
        if (data.length === 0) return [];

        // Apply filters
        const filteredData = data.filter(item => {
            const nameMatch = item.KECAMATAN?.toLowerCase().includes(searchTerm.toLowerCase());
            const clusterMatch = clusterFilter === 'all' || item.CLUSTER === clusterFilter;
            return nameMatch && clusterMatch;
        });

        // If no sort config, return filtered data
        if (!sortConfig.key) return filteredData;

        // Apply sorting
        return [...filteredData].sort((a, b) => {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];

            // Handle sorting for numbers and strings
            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return sortConfig.direction === 'ascending'
                    ? aValue - bValue
                    : bValue - aValue;
            } else {
                // Handle string comparison or mixed types
                if (aValue < bValue) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            }
        });
    };

    // Create a table with dynamic columns based on the first item's keys
    const renderDynamicTable = () => {
        if (data.length === 0) return null;

        // Get all keys from the first item
        const firstItem = data[0];
        const keys = Object.keys(firstItem).filter(key => key !== '_id'); // Exclude _id

        // Get filtered and sorted data
        const processedData = getFilteredAndSortedData();

        return (
            <div className="overflow-x-auto bg-white rounded-lg shadow-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr className="bg-gradient-to-r from-green-600 to-green-700">
                            {keys.map(key => (
                                <th
                                    key={key}
                                    className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider cursor-pointer hover:bg-green-800 transition-colors duration-150"
                                    onClick={() => requestSort(key)}
                                >
                                    <div className="flex items-center space-x-1">
                                        <span>{key}</span>
                                        {sortConfig.key === key ? (
                                            <span className="inline-block ml-1">
                                                {sortConfig.direction === 'ascending'
                                                    ? <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                                    </svg>
                                                    : <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                }
                                            </span>
                                        ) : (
                                            <span className="opacity-0 group-hover:opacity-100 ml-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4" />
                                                </svg>
                                            </span>
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {processedData.length > 0 ? (
                            processedData.map((item, index) => (
                                <tr key={index} className={`transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-green-50`}>
                                    {keys.map(key => (
                                        <td
                                            key={`${index}-${key}`}
                                            className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700 border-b border-gray-200"
                                        >
                                            {key === 'CLUSTER' ? (
                                                <span
                                                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold
                                                        ${item[key] === 'cluster_0' ? 'bg-green-100 text-green-800 border border-green-200' :
                                                            item[key] === 'cluster_1' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                                                                item[key] === 'cluster_2' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                                                                    'bg-gray-100 text-gray-800 border border-gray-200'}`}
                                                >
                                                    {getClusterName(item[key])}
                                                </span>
                                            ) : key === 'KECAMATAN' ? (
                                                <span className="font-semibold text-gray-800">{item[key]}</span>
                                            ) : ['TOTAL RTH', 'LUAS KECAMATAN'].includes(key) ? (
                                                <span className="font-semibold">
                                                    {typeof item[key] === 'number' ? item[key].toFixed(2) : item[key]}
                                                </span>
                                            ) : (
                                                item[key] !== undefined && item[key] !== null ?
                                                    (typeof item[key] === 'number' ?
                                                        (key.includes('KEPADATAN') ? item[key].toFixed(4) : item[key].toFixed(2))
                                                        : item[key])
                                                    : '-'
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={keys.length} className="px-6 py-10 text-center text-base font-medium text-gray-500 bg-gray-50">
                                    <div className="flex flex-col items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span>Tidak ada data yang ditemukan</span>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        );
    };

    if (loading) return <div className="flex items-center justify-center h-full p-8">Loading data...</div>;
    if (error) return <div className="flex items-center justify-center h-full p-8 text-red-500">Error: {error}</div>;

    // Show raw JSON for debugging
    const showRawData = () => {
        return (
            <div className="mb-8 p-4 bg-gray-100 rounded-lg overflow-auto max-h-60">
                <h3 className="font-bold mb-2 text-lg">Raw Data (Debug):</h3>
                <pre className="text-xs">{JSON.stringify(rawResponse, null, 2)}</pre>
            </div>
        );
    };

    return (
        <div className="container mx-auto p-6">
            <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 mb-6">
                <h1 className="text-3xl font-bold text-green-700 mb-2">Data Ruang Terbuka Hijau Kota Bandung</h1>
                <p className="text-gray-600">Visualisasi data persebaran RTH di Kota Bandung untuk mendukung perencanaan pembangunan berkelanjutan</p>
            </div>

            {/* Debug information if needed - hidden by default */}
            {/* {showRawData()} */}

            {/* Filter Controls */}
            <div className="mb-6 bg-white p-6 rounded-lg shadow-lg border border-gray-200">
                <h2 className="text-lg font-bold text-green-700 mb-4">Filter Data</h2>
                <div className="flex flex-wrap gap-4 items-end">
                    <div className="w-full md:w-auto flex-grow">
                        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                            Nama Kecamatan
                        </label>
                        <input
                            type="text"
                            id="search"
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="Cari kecamatan..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="w-full md:w-auto md:min-w-[200px]">
                        <label htmlFor="cluster" className="block text-sm font-medium text-gray-700 mb-1">
                            Cluster
                        </label>
                        <select
                            id="cluster"
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            value={clusterFilter}
                            onChange={(e) => setClusterFilter(e.target.value)}
                        >
                            <option value="all">Semua Cluster</option>
                            {getUniqueClusters().map(cluster => (
                                <option key={cluster} value={cluster}>
                                    {getClusterName(cluster)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button
                        className="px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-md hover:bg-gray-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
                        onClick={() => {
                            setSearchTerm('');
                            setClusterFilter('all');
                        }}
                    >
                        Reset Filter
                    </button>

                    <div className="px-4 py-2 bg-green-600 text-white font-medium rounded-md">
                        {getFilteredAndSortedData().length} data ditemukan
                    </div>
                </div>
            </div>

            {/* Dynamic Table from data */}
            {renderDynamicTable()}
        </div>
    );
};

export default DataDisplay;