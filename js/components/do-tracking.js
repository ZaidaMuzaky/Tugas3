/**
 * DO Tracking Component
 * Komponen untuk tracking status pengiriman Delivery Order
 * Fitur: Search, Add DO, Update Progress
 */

Vue.component('do-tracking', {
    template: '#tpl-tracking',
    
    props: {
        // Data tracking dari parent
        data: {
            type: Array,
            required: true
        },
        // List ekspedisi/pengiriman
        pengirimanList: {
            type: Array,
            default: () => []
        },
        // List paket bahan ajar
        paketList: {
            type: Array,
            default: () => []
        },
        // List stok untuk detail paket
        stokList: {
            type: Array,
            default: () => []
        }
    },
    
    data() {
        return {
            // Search state
            searchQuery: '',
            searchType: 'nomorDO', // 'nomorDO' atau 'nim'
            
            // Selected tracking for detail view
            selectedDO: null,
            
            // Add new DO form state
            showAddForm: false,
            newDO: this.getEmptyDO(),
            
            // Add progress form state
            showProgressForm: false,
            progressDO: null,
            newProgress: {
                keterangan: ''
            },
            
            // Validation errors
            errors: {}
        };
    },
    
    computed: {
        /**
         * Filter tracking berdasarkan search query
         */
        filteredTracking() {
            if (!this.searchQuery.trim()) {
                return this.data;
            }
            
            const query = this.searchQuery.toLowerCase().trim();
            
            return this.data.filter(item => {
                if (this.searchType === 'nomorDO') {
                    return item.nomorDO.toLowerCase().includes(query);
                } else {
                    return item.nim.toLowerCase().includes(query);
                }
            });
        },
        
        /**
         * Generate nomor DO otomatis
         */
        generatedDONumber() {
            const year = new Date().getFullYear();
            const lastDO = this.data
                .filter(d => d.nomorDO.startsWith(`DO${year}`))
                .sort((a, b) => b.nomorDO.localeCompare(a.nomorDO))[0];
            
            let sequence = 1;
            if (lastDO) {
                const lastSeq = parseInt(lastDO.nomorDO.split('-')[1]);
                sequence = lastSeq + 1;
            }
            
            return `DO${year}-${String(sequence).padStart(4, '0')}`;
        },
        
        /**
         * Get detail paket yang dipilih
         */
        selectedPaketDetail() {
            if (!this.newDO.paket) return null;
            
            const paket = this.paketList.find(p => p.kode === this.newDO.paket);
            if (!paket) return null;
            
            // Ambil detail item dari stok
            const items = paket.isi.map(kode => {
                const stok = this.stokList.find(s => s.kode === kode);
                return stok ? stok.judul : kode;
            });
            
            return {
                ...paket,
                itemDetails: items
            };
        },
        
        /**
         * Total harga berdasarkan paket yang dipilih
         */
        totalHarga() {
            if (!this.newDO.paket) return 0;
            const paket = this.paketList.find(p => p.kode === this.newDO.paket);
            return paket ? paket.harga : 0;
        }
    },
    
    watch: {
        /**
         * Watcher untuk update total harga ketika paket berubah
         */
        'newDO.paket'(newVal) {
            if (newVal) {
                const paket = this.paketList.find(p => p.kode === newVal);
                if (paket) {
                    this.newDO.total = paket.harga;
                }
            } else {
                this.newDO.total = 0;
            }
        },
        
        /**
         * Watcher untuk search query - log perubahan
         */
        searchQuery(newVal) {
            console.log('Search query changed:', newVal);
        }
    },
    
    methods: {
        /**
         * Format tanggal ke format Indonesia
         */
        formatDate(dateStr) {
            if (!dateStr) return '-';
            
            const date = new Date(dateStr);
            const options = { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
            };
            
            return date.toLocaleDateString('id-ID', options);
        },
        
        /**
         * Format datetime ke format Indonesia
         */
        formatDateTime(dateTimeStr) {
            if (!dateTimeStr) return '-';
            
            const date = new Date(dateTimeStr);
            const options = { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            };
            
            return date.toLocaleDateString('id-ID', options);
        },
        
        /**
         * Format harga ke Rupiah
         */
        formatCurrency(value) {
            return 'Rp ' + new Intl.NumberFormat('id-ID').format(value);
        },
        
        /**
         * Get nama ekspedisi dari kode
         */
        getEkspedisiNama(kode) {
            const ekspedisi = this.pengirimanList.find(p => p.kode === kode);
            return ekspedisi ? ekspedisi.nama : kode;
        },
        
        /**
         * Get status badge class - Flowbite classes
         */
        getStatusClass(status) {
            const statusMap = {
                'Dalam Perjalanan': 'bg-blue-100 text-blue-800',
                'Terkirim': 'bg-green-100 text-green-800',
                'Pending': 'bg-yellow-100 text-yellow-800',
                'Dibatalkan': 'bg-red-100 text-red-800'
            };
            return statusMap[status] || 'bg-gray-100 text-gray-800';
        },
        
        /**
         * Get paket nama dari kode
         */
        getPaketNama(kode) {
            const paket = this.paketList.find(p => p.kode === kode);
            return paket ? paket.nama : kode;
        },
        
        /**
         * Handle search keydown
         */
        handleSearchKeydown(event) {
            if (event.key === 'Enter') {
                // Submit pencarian (sudah otomatis dengan v-model)
                console.log('Search submitted:', this.searchQuery);
            } else if (event.key === 'Escape') {
                // Clear/reset pencarian
                this.clearSearch();
            }
        },
        
        /**
         * Clear search
         */
        clearSearch() {
            this.searchQuery = '';
            this.selectedDO = null;
        },
        
        /**
         * Select tracking for detail view
         */
        selectDO(item) {
            this.selectedDO = item;
        },
        
        /**
         * Close detail view
         */
        closeDetail() {
            this.selectedDO = null;
        },
        
        /**
         * Get empty DO template
         */
        getEmptyDO() {
            return {
                nomorDO: '',
                nim: '',
                nama: '',
                status: 'Pending',
                ekspedisi: '',
                tanggalKirim: this.getCurrentDate(),
                paket: '',
                total: 0,
                perjalanan: []
            };
        },
        
        /**
         * Get current date in YYYY-MM-DD format
         */
        getCurrentDate() {
            const now = new Date();
            return now.toISOString().split('T')[0];
        },
        
        /**
         * Get current datetime
         */
        getCurrentDateTime() {
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            
            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        },
        
        /**
         * Validate new DO form
         */
        validateDOForm() {
            this.errors = {};
            
            if (!this.newDO.nim || this.newDO.nim.trim() === '') {
                this.errors.nim = 'NIM wajib diisi';
            } else if (!/^\d{9,}$/.test(this.newDO.nim.trim())) {
                this.errors.nim = 'NIM harus minimal 9 digit angka';
            }
            
            if (!this.newDO.nama || this.newDO.nama.trim() === '') {
                this.errors.nama = 'Nama wajib diisi';
            }
            
            if (!this.newDO.ekspedisi) {
                this.errors.ekspedisi = 'Ekspedisi wajib dipilih';
            }
            
            if (!this.newDO.paket) {
                this.errors.paket = 'Paket bahan ajar wajib dipilih';
            }
            
            if (!this.newDO.tanggalKirim) {
                this.errors.tanggalKirim = 'Tanggal kirim wajib diisi';
            }
            
            return Object.keys(this.errors).length === 0;
        },
        
        /**
         * Open add DO form
         */
        openAddForm() {
            this.showAddForm = true;
            this.newDO = this.getEmptyDO();
            this.newDO.nomorDO = this.generatedDONumber;
            this.errors = {};
        },
        
        /**
         * Close add DO form
         */
        closeAddForm() {
            this.showAddForm = false;
            this.newDO = this.getEmptyDO();
            this.errors = {};
        },
        
        /**
         * Submit new DO
         */
        submitDO() {
            if (!this.validateDOForm()) {
                return;
            }
            
            // Add initial progress
            const newDOData = {
                ...this.newDO,
                nomorDO: this.generatedDONumber,
                perjalanan: [
                    {
                        waktu: this.getCurrentDateTime(),
                        keterangan: 'Pesanan diterima dan sedang diproses'
                    }
                ]
            };
            
            this.$emit('add-tracking', newDOData);
            this.closeAddForm();
        },
        
        /**
         * Handle add form keydown
         */
        handleAddKeydown(event) {
            if (event.key === 'Escape') {
                this.closeAddForm();
            }
        },
        
        /**
         * Open progress form
         */
        openProgressForm(item) {
            this.progressDO = item;
            this.showProgressForm = true;
            this.newProgress = { keterangan: '' };
            this.errors = {};
        },
        
        /**
         * Close progress form
         */
        closeProgressForm() {
            this.showProgressForm = false;
            this.progressDO = null;
            this.newProgress = { keterangan: '' };
            this.errors = {};
        },
        
        /**
         * Submit new progress
         */
        submitProgress() {
            if (!this.newProgress.keterangan || this.newProgress.keterangan.trim() === '') {
                this.errors.keterangan = 'Keterangan wajib diisi';
                return;
            }
            
            const progressData = {
                nomorDO: this.progressDO.nomorDO,
                progress: {
                    waktu: this.getCurrentDateTime(),
                    keterangan: this.newProgress.keterangan.trim()
                }
            };
            
            this.$emit('add-progress', progressData);
            this.closeProgressForm();
            
            // Refresh selected DO if it's the same
            if (this.selectedDO && this.selectedDO.nomorDO === this.progressDO.nomorDO) {
                // Data akan terupdate secara reaktif dari parent
            }
        },
        
        /**
         * Handle progress form keydown
         */
        handleProgressKeydown(event) {
            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                this.submitProgress();
            } else if (event.key === 'Escape') {
                this.closeProgressForm();
            }
        },
        
        /**
         * Update status DO
         */
        updateStatus(item, newStatus) {
            this.$emit('update-status', {
                nomorDO: item.nomorDO,
                status: newStatus
            });
        }
    }
});
