/**
 * Order Form Component
 * Komponen untuk formulir pemesanan bahan ajar
 */

Vue.component('order-form', {
    template: '#tpl-order',
    
    props: {
        // List paket bahan ajar
        paket: {
            type: Array,
            default: () => []
        },
        // List ekspedisi
        ekspedisi: {
            type: Array,
            default: () => []
        },
        // List pengiriman untuk ekspedisi options
        pengirimanList: {
            type: Array,
            default: () => []
        }
    },
    
    data() {
        return {
            // Form data
            form: {
                nim: '',
                nama: '',
                alamat: '',
                telepon: '',
                email: '',
                paketKode: '',
                ekspedisiKode: '',
                catatan: ''
            },
            
            // Validation errors
            errors: {},
            
            // Form state
            isSubmitting: false,
            submitted: false,
            orderResult: null
        };
    },
    
    computed: {
        /**
         * Get selected paket detail
         */
        selectedPaket() {
            if (!this.form.paketKode) return null;
            return this.paket.find(p => p.kode === this.form.paketKode);
        },
        
        /**
         * Get selected ekspedisi detail
         */
        selectedEkspedisi() {
            if (!this.form.ekspedisiKode) return null;
            return this.pengirimanList.find(e => e.kode === this.form.ekspedisiKode);
        },
        
        /**
         * Calculate total harga
         */
        totalHarga() {
            let total = 0;
            if (this.selectedPaket) {
                total = this.selectedPaket.harga;
            }
            return total;
        },
        
        /**
         * Check if form is valid
         */
        isFormValid() {
            return Object.keys(this.errors).length === 0 &&
                   this.form.nim &&
                   this.form.nama &&
                   this.form.alamat &&
                   this.form.telepon &&
                   this.form.paketKode &&
                   this.form.ekspedisiKode;
        }
    },
    
    watch: {
        /**
         * Watch form changes for real-time validation
         */
        'form.nim'(val) {
            if (val && !/^\d{9,}$/.test(val)) {
                this.errors.nim = 'NIM harus minimal 9 digit angka';
            } else {
                delete this.errors.nim;
            }
        },
        
        /**
         * Watch email for validation
         */
        'form.email'(val) {
            if (val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
                this.errors.email = 'Format email tidak valid';
            } else {
                delete this.errors.email;
            }
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
         * Validate entire form
         */
        validateForm() {
            this.errors = {};
            
            if (!this.form.nim || this.form.nim.trim() === '') {
                this.errors.nim = 'NIM wajib diisi';
            } else if (!/^\d{9,}$/.test(this.form.nim.trim())) {
                this.errors.nim = 'NIM harus minimal 9 digit angka';
            }
            
            if (!this.form.nama || this.form.nama.trim() === '') {
                this.errors.nama = 'Nama lengkap wajib diisi';
            }
            
            if (!this.form.alamat || this.form.alamat.trim() === '') {
                this.errors.alamat = 'Alamat pengiriman wajib diisi';
            }
            
            if (!this.form.telepon || this.form.telepon.trim() === '') {
                this.errors.telepon = 'Nomor telepon wajib diisi';
            } else if (!/^[\d\-+]{10,15}$/.test(this.form.telepon.trim())) {
                this.errors.telepon = 'Format nomor telepon tidak valid';
            }
            
            if (this.form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email)) {
                this.errors.email = 'Format email tidak valid';
            }
            
            if (!this.form.paketKode) {
                this.errors.paketKode = 'Pilih paket bahan ajar';
            }
            
            if (!this.form.ekspedisiKode) {
                this.errors.ekspedisiKode = 'Pilih jenis pengiriman';
            }
            
            return Object.keys(this.errors).length === 0;
        },
        
        /**
         * Submit order
         */
        async submitOrder() {
            if (!this.validateForm()) {
                return;
            }
            
            this.isSubmitting = true;
            
            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                const orderData = {
                    ...this.form,
                    total: this.totalHarga,
                    tanggalPesan: new Date().toISOString(),
                    status: 'Pending'
                };
                
                this.$emit('submit-order', orderData);
                
                // Simpan data untuk ditampilkan di success message
                const paketNama = this.selectedPaket ? this.selectedPaket.nama : '';
                
                this.orderResult = {
                    success: true,
                    message: 'Pesanan berhasil disubmit! Tim kami akan segera memproses pesanan Anda.',
                    data: {
                        nim: this.form.nim,
                        nama: this.form.nama,
                        paket: paketNama,
                        total: this.totalHarga
                    }
                };
                
                this.submitted = true;
                
            } catch (error) {
                this.orderResult = {
                    success: false,
                    message: 'Terjadi kesalahan. Silakan coba lagi.'
                };
            } finally {
                this.isSubmitting = false;
            }
        },
        
        /**
         * Reset form
         */
        resetForm() {
            this.form = {
                nim: '',
                nama: '',
                alamat: '',
                telepon: '',
                email: '',
                paketKode: '',
                ekspedisiKode: '',
                catatan: ''
            };
            this.errors = {};
            this.submitted = false;
            this.orderResult = null;
        },
        
        /**
         * Handle form keydown
         */
        handleKeydown(event) {
            if (event.key === 'Enter' && event.ctrlKey) {
                this.submitOrder();
            }
        },
        
        /**
         * Create new order (after successful submission)
         */
        createNewOrder() {
            this.resetForm();
        }
    },
    
    mounted() {
        // Add keyboard listener
        document.addEventListener('keydown', this.handleKeydown);
    },
    
    beforeDestroy() {
        // Remove keyboard listener
        document.removeEventListener('keydown', this.handleKeydown);
    }
});
