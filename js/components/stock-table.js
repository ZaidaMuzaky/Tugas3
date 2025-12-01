/**
 * Stock Table Component
 * Komponen untuk menampilkan dan mengelola data stok bahan ajar
 * Fitur: Filter, Sort, CRUD, Status Badge
 */

Vue.component('ba-stock-table', {
    template: '#tpl-stock',
    
    props: {
        // Data stok dari parent
        items: {
            type: Array,
            required: true
        },
        // List UPBJJ untuk filter
        upbjjList: {
            type: Array,
            default: () => []
        },
        // List kategori untuk filter
        kategoriList: {
            type: Array,
            default: () => []
        }
    },
    
    data() {
        return {
            // Filter state
            filterUpbjj: '',
            filterKategori: '',
            filterStokStatus: '',  // '', 'aman', 'menipis', 'kosong'
            
            // Sort state
            sortBy: '',
            sortOrder: 'asc',
            
            // Edit state
            editingItem: null,
            editForm: {},
            
            // Add new item state
            showAddForm: false,
            newItem: this.getEmptyItem(),
            
            // Validation errors
            errors: {},
            
            // Hover state for tooltip
            hoveredItem: null
        };
    },
    
    computed: {
        /**
         * Computed property untuk kategori yang tersedia berdasarkan UPBJJ yang dipilih
         * Implementasi dependent options
         */
        availableKategori() {
            if (!this.filterUpbjj) {
                return [];
            }
            // Ambil kategori unik dari items yang sesuai dengan UPBJJ
            const kategoris = this.items
                .filter(item => item.upbjj === this.filterUpbjj)
                .map(item => item.kategori);
            return [...new Set(kategoris)];
        },
        
        /**
         * Computed property untuk data yang sudah difilter dan disort
         * Tidak perlu recompute kecuali data atau filter berubah
         */
        filteredAndSortedItems() {
            let result = [...this.items];
            
            // Filter berdasarkan UPBJJ
            if (this.filterUpbjj) {
                result = result.filter(item => item.upbjj === this.filterUpbjj);
            }
            
            // Filter berdasarkan kategori (hanya jika UPBJJ sudah dipilih)
            if (this.filterUpbjj && this.filterKategori) {
                result = result.filter(item => item.kategori === this.filterKategori);
            }
            
            // Filter berdasarkan status stok
            if (this.filterStokStatus) {
                result = result.filter(item => {
                    const status = this.getStockStatus(item).status;
                    return status === this.filterStokStatus;
                });
            }
            
            // Sorting
            if (this.sortBy) {
                result.sort((a, b) => {
                    let valA = a[this.sortBy];
                    let valB = b[this.sortBy];
                    
                    // Handle string comparison
                    if (typeof valA === 'string') {
                        valA = valA.toLowerCase();
                        valB = valB.toLowerCase();
                    }
                    
                    if (valA < valB) return this.sortOrder === 'asc' ? -1 : 1;
                    if (valA > valB) return this.sortOrder === 'asc' ? 1 : -1;
                    return 0;
                });
            }
            
            return result;
        },
        
        /**
         * Total items setelah filter
         */
        totalFiltered() {
            return this.filteredAndSortedItems.length;
        },
        
        /**
         * Check apakah ada filter aktif
         */
        hasActiveFilter() {
            return this.filterUpbjj || this.filterKategori || 
                   this.filterStokStatus;
        }
    },
    
    watch: {
        /**
         * Watcher untuk reset kategori ketika UPBJJ berubah
         */
        filterUpbjj(newVal) {
            // Reset kategori filter ketika UPBJJ berubah
            this.filterKategori = '';
            
            // Log untuk debugging
            console.log('UPBJJ filter changed to:', newVal);
        },
        
        /**
         * Watcher untuk memantau perubahan filter status stok
         */
        filterStokStatus(newVal) {
            console.log('Filter status stok changed to:', newVal);
        }
    },
    
    methods: {
        /**
         * Format harga ke Rupiah
         */
        formatCurrency(value) {
            return 'Rp ' + new Intl.NumberFormat('id-ID').format(value);
        },
        
        /**
         * Format qty dengan satuan
         */
        formatQty(value) {
            return value + ' buah';
        },
        
        /**
         * Get status stok berdasarkan qty dan safety
         * Menggunakan class Flowbite untuk styling badge
         */
        getStockStatus(item) {
            if (item.qty === 0) {
                return { status: 'kosong', label: 'Kosong', class: 'bg-red-100 text-red-800' };
            } else if (item.qty < item.safety) {
                return { status: 'menipis', label: 'Menipis', class: 'bg-yellow-100 text-yellow-800' };
            } else {
                return { status: 'aman', label: 'Aman', class: 'bg-green-100 text-green-800' };
            }
        },
        
        /**
         * Toggle sort
         */
        toggleSort(field) {
            if (this.sortBy === field) {
                this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
            } else {
                this.sortBy = field;
                this.sortOrder = 'asc';
            }
        },
        
        /**
         * Get sort icon
         */
        getSortIcon(field) {
            if (this.sortBy !== field) return '↕️';
            return this.sortOrder === 'asc' ? '↑' : '↓';
        },
        
        /**
         * Reset semua filter
         */
        resetFilters() {
            this.filterUpbjj = '';
            this.filterKategori = '';
            this.filterStokStatus = '';
            this.sortBy = '';
            this.sortOrder = 'asc';
        },
        
        /**
         * Get empty item template
         */
        getEmptyItem() {
            return {
                kode: '',
                judul: '',
                kategori: '',
                upbjj: '',
                lokasiRak: '',
                harga: 0,
                qty: 0,
                safety: 0,
                catatanHTML: ''
            };
        },
        
        /**
         * Validate form
         */
        validateForm(item) {
            this.errors = {};
            
            if (!item.kode || item.kode.trim() === '') {
                this.errors.kode = 'Kode mata kuliah wajib diisi';
            }
            
            if (!item.judul || item.judul.trim() === '') {
                this.errors.judul = 'Judul wajib diisi';
            }
            
            if (!item.kategori) {
                this.errors.kategori = 'Kategori wajib dipilih';
            }
            
            if (!item.upbjj) {
                this.errors.upbjj = 'UPBJJ wajib dipilih';
            }
            
            if (!item.lokasiRak || item.lokasiRak.trim() === '') {
                this.errors.lokasiRak = 'Lokasi rak wajib diisi';
            }
            
            if (item.harga <= 0) {
                this.errors.harga = 'Harga harus lebih dari 0';
            }
            
            if (item.qty < 0) {
                this.errors.qty = 'Jumlah stok tidak boleh negatif';
            }
            
            if (item.safety < 0) {
                this.errors.safety = 'Safety stock tidak boleh negatif';
            }
            
            return Object.keys(this.errors).length === 0;
        },
        
        /**
         * Start editing item
         */
        startEdit(item) {
            this.editingItem = item.kode;
            this.editForm = { ...item };
            this.errors = {};
        },
        
        /**
         * Cancel editing
         */
        cancelEdit() {
            this.editingItem = null;
            this.editForm = {};
            this.errors = {};
        },
        
        /**
         * Save edited item
         */
        saveEdit() {
            if (!this.validateForm(this.editForm)) {
                return;
            }
            
            this.$emit('update-item', this.editForm);
            this.cancelEdit();
        },
        
        /**
         * Handle keyboard events for edit form
         */
        handleEditKeydown(event) {
            if (event.key === 'Enter') {
                this.saveEdit();
            } else if (event.key === 'Escape') {
                this.cancelEdit();
            }
        },
        
        /**
         * Show add form
         */
        openAddForm() {
            this.showAddForm = true;
            this.newItem = this.getEmptyItem();
            this.errors = {};
        },
        
        /**
         * Close add form
         */
        closeAddForm() {
            this.showAddForm = false;
            this.newItem = this.getEmptyItem();
            this.errors = {};
        },
        
        /**
         * Add new item
         */
        addItem() {
            if (!this.validateForm(this.newItem)) {
                return;
            }
            
            // Check duplicate kode
            const exists = this.items.find(item => item.kode === this.newItem.kode);
            if (exists) {
                this.errors.kode = 'Kode mata kuliah sudah ada';
                return;
            }
            
            this.$emit('add-item', { ...this.newItem });
            this.closeAddForm();
        },
        
        /**
         * Handle keyboard events for add form
         */
        handleAddKeydown(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                this.addItem();
            } else if (event.key === 'Escape') {
                this.closeAddForm();
            }
        },
        
        /**
         * Delete item
         */
        deleteItem(item) {
            this.$emit('delete-item', item);
        },
        
        /**
         * Handle mouse hover for tooltip
         */
        showTooltip(item) {
            this.hoveredItem = item.kode;
        },
        
        /**
         * Hide tooltip
         */
        hideTooltip() {
            this.hoveredItem = null;
        }
    }
});
