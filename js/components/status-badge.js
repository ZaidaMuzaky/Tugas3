/**
 * Status Badge Component
 * Komponen untuk menampilkan status dengan badge berwarna
 */

Vue.component('status-badge', {
    template: '#tpl-badge',
    
    props: {
        // Status value
        status: {
            type: String,
            required: true
        },
        // Badge type: 'stock' atau 'delivery'
        type: {
            type: String,
            default: 'stock'
        },
        // Show icon
        showIcon: {
            type: Boolean,
            default: true
        },
        // Tooltip text (for catatan)
        tooltip: {
            type: String,
            default: ''
        }
    },
    
    data() {
        return {
            showTooltip: false
        };
    },
    
    computed: {
        /**
         * Get badge configuration based on status and type
         */
        badgeConfig() {
            if (this.type === 'stock') {
                return this.getStockBadgeConfig();
            } else if (this.type === 'delivery') {
                return this.getDeliveryBadgeConfig();
            }
            return this.getDefaultBadgeConfig();
        },
        
        /**
         * Get CSS classes for badge - using Flowbite classes
         */
        badgeClasses() {
            return ['text-xs font-medium px-2.5 py-0.5 rounded', this.badgeConfig.class];
        },
        
        /**
         * Get badge label
         */
        badgeLabel() {
            return this.badgeConfig.label || this.status;
        }
    },
    
    methods: {
        /**
         * Get stock status badge configuration - Flowbite classes
         */
        getStockBadgeConfig() {
            const statusLower = this.status.toLowerCase();
            
            switch (statusLower) {
                case 'aman':
                    return {
                        label: 'Aman',
                        class: 'bg-green-100 text-green-800'
                    };
                case 'menipis':
                    return {
                        label: 'Menipis',
                        class: 'bg-yellow-100 text-yellow-800'
                    };
                case 'kosong':
                    return {
                        label: 'Kosong',
                        class: 'bg-red-100 text-red-800'
                    };
                default:
                    return this.getDefaultBadgeConfig();
            }
        },
        
        /**
         * Get delivery status badge configuration - Flowbite classes
         */
        getDeliveryBadgeConfig() {
            const statusLower = this.status.toLowerCase();
            
            switch (statusLower) {
                case 'terkirim':
                    return {
                        label: 'Terkirim',
                        class: 'bg-green-100 text-green-800'
                    };
                case 'dalam perjalanan':
                    return {
                        label: 'Dalam Perjalanan',
                        class: 'bg-blue-100 text-blue-800'
                    };
                case 'pending':
                    return {
                        label: 'Pending',
                        class: 'bg-yellow-100 text-yellow-800'
                    };
                case 'dibatalkan':
                    return {
                        label: 'Dibatalkan',
                        class: 'bg-red-100 text-red-800'
                    };
                default:
                    return this.getDefaultBadgeConfig();
            }
        },
        
        /**
         * Get default badge configuration
         */
        getDefaultBadgeConfig() {
            return {
                label: this.status,
                class: 'bg-gray-100 text-gray-800'
            };
        },
        
        /**
         * Handle mouse enter for tooltip
         */
        handleMouseEnter() {
            if (this.tooltip) {
                this.showTooltip = true;
            }
        },
        
        /**
         * Handle mouse leave for tooltip
         */
        handleMouseLeave() {
            this.showTooltip = false;
        }
    }
});
