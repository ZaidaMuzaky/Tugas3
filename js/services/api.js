/**
 * API Service - Data Access Layer
 * Menangani pengambilan data dari JSON file
 * SITTA - Universitas Terbuka
 */

const ApiService = {
    // Base path untuk data JSON
    basePath: './data/dataBahanAjar.json',
    
    // Cache data untuk menghindari multiple fetch
    cachedData: null,
    
    /**
     * Fetch semua data dari JSON file
     * @returns {Promise<Object>} Data bahan ajar
     */
    async fetchAll() {
        try {
            // Return cached data jika sudah ada
            if (this.cachedData) {
                return this.cachedData;
            }
            
            const response = await fetch(this.basePath);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const rawData = await response.json();
            
            // Konversi tracking dari nested object ke flat array
            const rawTracking = rawData.tracking || [];
            const flatTracking = rawTracking.map(item => {
                const nomorDO = Object.keys(item)[0];
                const trackingData = item[nomorDO];
                return {
                    nomorDO: nomorDO,
                    ...trackingData
                };
            });
            
            // Simpan data yang sudah diproses ke cache
            this.cachedData = {
                ...rawData,
                tracking: flatTracking
            };
            
            return this.cachedData;
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    },
    
    /**
     * Get daftar UPBJJ
     * @returns {Promise<Array>} List UPBJJ
     */
    async getUpbjjList() {
        const data = await this.fetchAll();
        return data.upbjjList || [];
    },
    
    /**
     * Get daftar kategori
     * @returns {Promise<Array>} List kategori
     */
    async getKategoriList() {
        const data = await this.fetchAll();
        return data.kategoriList || [];
    },
    
    /**
     * Get daftar pengiriman/ekspedisi
     * @returns {Promise<Array>} List pengiriman
     */
    async getPengirimanList() {
        const data = await this.fetchAll();
        return data.pengirimanList || [];
    },
    
    /**
     * Get daftar paket bahan ajar
     * @returns {Promise<Array>} List paket
     */
    async getPaketList() {
        const data = await this.fetchAll();
        return data.paket || [];
    },
    
    /**
     * Get daftar stok bahan ajar
     * @returns {Promise<Array>} List stok
     */
    async getStokList() {
        const data = await this.fetchAll();
        return data.stok || [];
    },
    
    /**
     * Get daftar tracking DO
     * Data sudah dikonversi ke flat array di fetchAll()
     * @returns {Promise<Array>} List tracking
     */
    async getTrackingList() {
        const data = await this.fetchAll();
        // Data tracking sudah dalam format flat array dari fetchAll()
        return data.tracking || [];
    },
    
    /**
     * Clear cache untuk refresh data
     */
    clearCache() {
        this.cachedData = null;
    },
    
    /**
     * Simulasi save data (karena menggunakan JSON static)
     * Di production, ini akan mengirim data ke backend
     * @param {string} type - Tipe data (stok/tracking)
     * @param {Object} data - Data yang akan disimpan
     */
    async saveData(type, data) {
        // Simulasi delay seperti API call
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log(`Data ${type} saved:`, data);
                resolve({ success: true, data });
            }, 300);
        });
    }
};

// Export untuk digunakan di komponen lain
window.ApiService = ApiService;
