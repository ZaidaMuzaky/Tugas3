/**
 * App.js - Main Vue Instance
 * SITTA - Sistem Informasi Tiras dan Transaksi Bahan Ajar
 * Universitas Terbuka
 */

// Initialize Vue App when DOM is ready
async function initApp() {
    // Fetch initial data
    let initialData = {};
    try {
        initialData = await ApiService.fetchAll();
        console.log('Data loaded successfully:', initialData);
    } catch (error) {
        console.error('Failed to load initial data:', error);
    }

    // Create Vue Instance
    new Vue({
        el: '#app',
        
        data: {
            // Current active tab
            tab: 'stok',
            
            // Application title
            appTitle: 'SITTA - Sistem Informasi Tiras dan Transaksi Bahan Ajar',
            
            // Data from JSON
            state: {
                upbjjList: initialData.upbjjList || [],
                kategoriList: initialData.kategoriList || [],
                pengirimanList: initialData.pengirimanList || [],
                paket: initialData.paket || [],
                stok: initialData.stok || [],
                tracking: initialData.tracking || []
            },
            
            // Modal state
            showModal: false,
            modalConfig: {
                title: '',
                message: '',
                type: 'default',
                onConfirm: null
            },
            
            // Loading state
            isLoading: false,
            
            // Notification state
            notification: {
                show: false,
                type: 'success',
                message: ''
            }
        },
        
        computed: {
            /**
             * Get current year for footer
             */
            currentYear() {
                return new Date().getFullYear();
            },
            
            /**
             * Count total stok items
             */
            totalStokItems() {
                return this.state.stok.length;
            },
            
            /**
             * Count low stock items
             */
            lowStockCount() {
                return this.state.stok.filter(item => item.qty < item.safety && item.qty > 0).length;
            },
            
            /**
             * Count empty stock items
             */
            emptyStockCount() {
                return this.state.stok.filter(item => item.qty === 0).length;
            },
            
            /**
             * Count total tracking items
             */
            totalTrackingItems() {
                return this.state.tracking.length;
            },
            
            /**
             * Count pending deliveries
             */
            pendingDeliveries() {
                return this.state.tracking.filter(item => item.status === 'Pending').length;
            },
            
            /**
             * Count in-progress deliveries
             */
            inProgressDeliveries() {
                return this.state.tracking.filter(item => item.status === 'Dalam Perjalanan').length;
            }
        },
        
        watch: {
            /**
             * Watch tab changes for logging/analytics
             */
            tab(newTab, oldTab) {
                console.log(`Tab changed from "${oldTab}" to "${newTab}"`);
            },
            
            /**
             * Watch stok changes for auto-save simulation
             */
            'state.stok': {
                handler(newStok) {
                    console.log('Stock data updated, items:', newStok.length);
                    // In production, this could trigger auto-save to backend
                },
                deep: true
            }
        },
        
        methods: {
            /**
             * Switch active tab
             */
            switchTab(tabName) {
                this.tab = tabName;
            },
            
            /**
             * Format currency to Rupiah
             */
            formatCurrency(value) {
                return 'Rp ' + new Intl.NumberFormat('id-ID').format(value);
            },
            
            /**
             * Format date to Indonesian format
             */
            formatDate(dateStr) {
                if (!dateStr) return '-';
                const date = new Date(dateStr);
                const options = { day: 'numeric', month: 'long', year: 'numeric' };
                return date.toLocaleDateString('id-ID', options);
            },
            
            // ============== STOCK HANDLERS ==============
            
            /**
             * Handle add new stock item
             */
            handleAddStokItem(newItem) {
                this.state.stok.push(newItem);
                this.showNotification('success', 'Bahan ajar berhasil ditambahkan!');
                console.log('New stock item added:', newItem);
            },
            
            /**
             * Handle update stock item
             */
            handleUpdateStokItem(updatedItem) {
                const index = this.state.stok.findIndex(item => item.kode === updatedItem.kode);
                if (index !== -1) {
                    // Use Vue.set for reactivity
                    Vue.set(this.state.stok, index, updatedItem);
                    this.showNotification('success', 'Bahan ajar berhasil diperbarui!');
                    console.log('Stock item updated:', updatedItem);
                }
            },
            
            /**
             * Handle delete stock item with confirmation
             */
            handleDeleteStokItem(item) {
                this.showConfirmModal(
                    'Hapus Bahan Ajar',
                    `Apakah Anda yakin ingin menghapus "${item.judul}" (${item.kode})?`,
                    'danger',
                    () => {
                        const index = this.state.stok.findIndex(s => s.kode === item.kode);
                        if (index !== -1) {
                            this.state.stok.splice(index, 1);
                            this.showNotification('success', 'Bahan ajar berhasil dihapus!');
                            console.log('Stock item deleted:', item.kode);
                        }
                        this.closeModal();
                    }
                );
            },
            
            // ============== TRACKING HANDLERS ==============
            
            /**
             * Handle add new tracking/DO
             */
            handleAddTracking(newTracking) {
                this.state.tracking.push(newTracking);
                this.showNotification('success', `Delivery Order ${newTracking.nomorDO} berhasil dibuat!`);
                console.log('New tracking added:', newTracking);
            },
            
            /**
             * Handle add progress to tracking
             */
            handleAddProgress(progressData) {
                const tracking = this.state.tracking.find(t => t.nomorDO === progressData.nomorDO);
                if (tracking) {
                    if (!tracking.perjalanan) {
                        tracking.perjalanan = [];
                    }
                    tracking.perjalanan.push(progressData.progress);
                    this.showNotification('success', 'Progress perjalanan berhasil ditambahkan!');
                    console.log('Progress added to:', progressData.nomorDO);
                }
            },
            
            /**
             * Handle update tracking status
             */
            handleUpdateTrackingStatus(statusData) {
                const tracking = this.state.tracking.find(t => t.nomorDO === statusData.nomorDO);
                if (tracking) {
                    tracking.status = statusData.status;
                    
                    // Add progress entry for status change
                    if (!tracking.perjalanan) {
                        tracking.perjalanan = [];
                    }
                    
                    const now = new Date();
                    const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
                    
                    tracking.perjalanan.push({
                        waktu: timestamp,
                        keterangan: `Status diubah menjadi: ${statusData.status}`
                    });
                    
                    this.showNotification('success', `Status ${statusData.nomorDO} berhasil diubah!`);
                    console.log('Tracking status updated:', statusData);
                }
            },
            
            // ============== ORDER HANDLERS ==============
            
            /**
             * Handle submit order
             */
            handleSubmitOrder(orderData) {
                console.log('Order submitted:', orderData);
                
                // Create new tracking from order
                const newTracking = {
                    nomorDO: this.generateDONumber(),
                    nim: orderData.nim,
                    nama: orderData.nama,
                    status: 'Pending',
                    ekspedisi: orderData.ekspedisiKode,
                    tanggalKirim: new Date().toISOString().split('T')[0],
                    paket: orderData.paketKode,
                    total: orderData.total,
                    perjalanan: [{
                        waktu: this.getCurrentDateTime(),
                        keterangan: 'Pesanan diterima dan sedang diproses'
                    }]
                };
                
                this.state.tracking.push(newTracking);
                this.showNotification('success', 'Pesanan berhasil dibuat!');
            },
            
            /**
             * Generate DO number
             */
            generateDONumber() {
                const year = new Date().getFullYear();
                const lastDO = this.state.tracking
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
             * Get current datetime string
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
            
            // ============== MODAL HANDLERS ==============
            
            /**
             * Show confirmation modal
             */
            showConfirmModal(title, message, type, onConfirm) {
                this.modalConfig = {
                    title,
                    message,
                    type,
                    onConfirm
                };
                this.showModal = true;
            },
            
            /**
             * Close modal
             */
            closeModal() {
                this.showModal = false;
                this.modalConfig = {
                    title: '',
                    message: '',
                    type: 'default',
                    onConfirm: null
                };
            },
            
            /**
             * Handle modal confirm
             */
            handleModalConfirm() {
                if (this.modalConfig.onConfirm) {
                    this.modalConfig.onConfirm();
                }
            },
            
            // ============== NOTIFICATION HANDLERS ==============
            
            /**
             * Show notification
             */
            showNotification(type, message) {
                this.notification = {
                    show: true,
                    type,
                    message
                };
                
                // Auto hide after 3 seconds
                setTimeout(() => {
                    this.notification.show = false;
                }, 3000);
            },
            
            /**
             * Hide notification
             */
            hideNotification() {
                this.notification.show = false;
            },
            
            // ============== NEW DO HANDLER ==============
            
            /**
             * Handle creating new DO from order form (triggered by @created event)
             */
            handleNewDO(orderData) {
                this.handleSubmitOrder(orderData);
            }
        },
        
        created() {
            console.log('SITTA App initialized');
            console.log('Vue version:', Vue.version);
        },
        
        mounted() {
            console.log('SITTA App mounted');
            console.log('Initial data loaded:');
            console.log('- UPBJJ:', this.state.upbjjList.length);
            console.log('- Kategori:', this.state.kategoriList.length);
            console.log('- Stok:', this.state.stok.length);
            console.log('- Tracking:', this.state.tracking.length);
        }
    });
}

// If DOMContentLoaded has already fired (scripts appended dynamically), run init immediately.
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    // DOM already ready
    initApp();
}
