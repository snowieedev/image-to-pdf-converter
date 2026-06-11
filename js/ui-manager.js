/**
 * UI Manager Module
 * Handles DOM manipulation, Toasts, Drag & Drop UI.
 */

export class UIManager {
    constructor() {
        this.toastContainer = this.createToastContainer();
    }

    /**
     * Initializes the Toast Container in the DOM
     */
    createToastContainer() {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.className = 'toast-container';
            document.body.appendChild(container);
        }
        return container;
    }

    /**
     * Shows a toast notification.
     * @param {string} message - The message to display.
     * @param {'success'|'error'|'info'} type - The type of toast.
     */
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;

        this.toastContainer.appendChild(toast);

        // Trigger animation
        setTimeout(() => toast.classList.add('show'), 10);

        // Remove after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300); // Wait for transition
        }, 3000);
    }

    /**
     * Toggles loading overlay.
     * @param {boolean} isLoading 
     * @param {string} message 
     * @param {Object} elements - DOM elements mapping
     */
    setLoadingState(isLoading, message = "Converting to PDF...", elements) {
        const { convertButton, convertButtonText, loaderIcon, loadingOverlay, loadingText } = elements;
        
        if (isLoading) {
            // Disable button
            convertButton.disabled = true;
            convertButtonText.textContent = message;
            loaderIcon.classList.remove('hidden');
            // Show overlay
            loadingText.textContent = message;
            loadingOverlay.classList.remove('hidden', 'opacity-0');
            loadingOverlay.classList.add('opacity-100');
        } else {
            // Enable button
            convertButton.disabled = false;
            convertButtonText.textContent = "Convert to PDF";
            loaderIcon.classList.add('hidden');
            // Hide overlay
            loadingOverlay.classList.remove('opacity-100');
            loadingOverlay.classList.add('hidden', 'opacity-0');
        }
    }

    /**
     * Updates the empty state visibility
     */
    toggleEmptyState(imageCount, elements) {
        const { controlsSection } = elements;
        if (imageCount === 0) {
            controlsSection.classList.add('hidden');
        } else {
            controlsSection.classList.remove('hidden');
        }
    }

    /**
     * Renders the image grid
     * @param {File[]} imageFiles 
     * @param {Object} elements 
     * @param {Sortable} sortableInstance 
     * @param {Function} initSortableCallback 
     */
    renderImageGrid(imageFiles, elements, sortableInstance, initSortableCallback) {
        const { imageGrid, imageCount } = elements;
        
        // Clear grid
        imageGrid.innerHTML = '';
        
        // Destroy old Sortable instance if it exists
        if (sortableInstance) {
            sortableInstance.destroy();
        }

        this.toggleEmptyState(imageFiles.length, elements);
        if (imageFiles.length === 0) return;
        
        imageCount.textContent = `${imageFiles.length} image${imageFiles.length > 1 ? 's' : ''} loaded`;

        // Create and append cards
        imageFiles.forEach((file, index) => {
            const card = document.createElement('div');
            card.className = 'image-card relative group bg-pastel-card backdrop-blur-lg border border-pastel-border rounded-2xl shadow-card overflow-hidden transition-all duration-300 hover:shadow-hover hover:-translate-y-1 animate-fadeIn cursor-move';
            card.style.animationDelay = `${index * 50}ms`;
            card.dataset.id = index; // Store array index

            // Create object URL (and ensure we revoke it later to avoid memory leaks)
            const previewUrl = URL.createObjectURL(file);

            card.innerHTML = `
                <!-- Page Number -->
                <div class="page-number absolute top-2 left-2 bg-pastel-primary/80 text-white text-xs font-bold px-2 py-1 rounded-full z-10 transition-all duration-300 group-hover:bg-pastel-primary shadow-sm">
                    Page ${index + 1}
                </div>
                
                <!-- Delete Button -->
                <button class="delete-btn absolute top-2 right-2 p-1.5 bg-red-500/80 text-white rounded-full z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100 hover:bg-red-600 cursor-pointer shadow-sm" aria-label="Delete image">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="pointer-events-none">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
                
                <!-- Image -->
                <img src="${previewUrl}" alt="${file.name}" class="w-full h-40 sm:h-48 object-cover transition-transform duration-300 group-hover:scale-105 pointer-events-none" onload="URL.revokeObjectURL(this.src)">
                
                <!-- Filename -->
                <div class="p-3 bg-white/50 backdrop-blur-sm absolute bottom-0 w-full">
                    <p class="text-sm text-pastel-text truncate pointer-events-none font-medium" title="${file.name}">${file.name}</p>
                </div>
            `;
            imageGrid.appendChild(card);
        });

        // Initialize SortableJS via callback
        if (initSortableCallback) {
            initSortableCallback();
        }
    }

    /**
     * Updates indices and page numbers after sorting
     * @param {HTMLElement} imageGrid 
     */
    updateCardIndicesAndNumbers(imageGrid) {
        const cards = imageGrid.querySelectorAll('.image-card');
        cards.forEach((card, index) => {
            card.dataset.id = index;
            card.querySelector('.page-number').textContent = `Page ${index + 1}`;
        });
    }

    /**
     * Drag over styling handler
     * @param {HTMLElement} uploadArea 
     * @param {boolean} isEntering 
     */
    handleDragStyling(uploadArea, isEntering) {
        if (isEntering) {
            uploadArea.classList.add('border-pastel-primary', 'bg-white/90');
        } else {
            uploadArea.classList.remove('border-pastel-primary', 'bg-white/90');
        }
    }
}
