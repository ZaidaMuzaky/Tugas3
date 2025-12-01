/**
 * App Modal Component
 * Komponen modal untuk konfirmasi dan form
 */

Vue.component('app-modal', {
    template: '#tpl-modal',
    
    props: {
        // Control modal visibility from parent
        show: {
            type: Boolean,
            default: false
        },
        // Modal title
        title: {
            type: String,
            default: 'Modal'
        },
        // Modal size: 'sm', 'md', 'lg'
        size: {
            type: String,
            default: 'md'
        },
        // Show close button
        showClose: {
            type: Boolean,
            default: true
        },
        // Close on overlay click
        closeOnOverlay: {
            type: Boolean,
            default: true
        },
        // Modal type: 'default', 'confirm', 'danger'
        type: {
            type: String,
            default: 'default'
        },
        // Confirm button text
        confirmText: {
            type: String,
            default: 'Konfirmasi'
        },
        // Cancel button text
        cancelText: {
            type: String,
            default: 'Batal'
        },
        // Show footer
        showFooter: {
            type: Boolean,
            default: true
        }
    },
    
    data() {
        return {
            isVisible: false
        };
    },
    
    computed: {
        /**
         * Get modal content classes based on size
         */
        modalContentClasses() {
            const sizeClasses = {
                'sm': 'max-width: 300px;',
                'md': 'max-width: 500px;',
                'lg': 'max-width: 800px;'
            };
            return sizeClasses[this.size] || sizeClasses['md'];
        },
        
        /**
         * Get confirm button classes based on type - Flowbite classes
         */
        confirmButtonClass() {
            if (this.type === 'danger') {
                return 'text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5';
            }
            return 'text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5';
        }
    },
    
    watch: {
        /**
         * Watch show prop to sync with internal state
         */
        show(newVal) {
            this.isVisible = newVal;
            
            if (newVal) {
                // Add event listener for ESC key
                document.addEventListener('keydown', this.handleKeydown);
                // Prevent body scroll
                document.body.style.overflow = 'hidden';
            } else {
                document.removeEventListener('keydown', this.handleKeydown);
                document.body.style.overflow = '';
            }
        }
    },
    
    methods: {
        /**
         * Close modal
         */
        close() {
            this.$emit('close');
            this.$emit('update:show', false);
        },
        
        /**
         * Handle overlay click
         */
        handleOverlayClick(event) {
            if (this.closeOnOverlay && event.target === event.currentTarget) {
                this.close();
            }
        },
        
        /**
         * Handle keyboard events
         */
        handleKeydown(event) {
            if (event.key === 'Escape') {
                this.close();
            }
        },
        
        /**
         * Handle confirm action
         */
        confirm() {
            this.$emit('confirm');
        },
        
        /**
         * Handle cancel action
         */
        cancel() {
            this.$emit('cancel');
            this.close();
        }
    },
    
    mounted() {
        if (this.show) {
            document.addEventListener('keydown', this.handleKeydown);
        }
    },
    
    beforeDestroy() {
        document.removeEventListener('keydown', this.handleKeydown);
        document.body.style.overflow = '';
    }
});
