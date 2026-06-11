import { PDFGenerator } from './pdf-generator.js';
import { UIManager } from './ui-manager.js';

document.addEventListener('DOMContentLoaded', () => {
    // --- STATE ---
    let imageFiles = []; // Holds the File objects in order
    let sortableInstance = null; // Holds the SortableJS instance
    const uiManager = new UIManager();

    // --- DOM ELEMENTS ---
    const elements = {
        uploadArea: document.getElementById('uploadArea'),
        fileInput: document.getElementById('fileInput'),
        controlsSection: document.getElementById('controlsSection'),
        imageGrid: document.getElementById('imageGrid'),
        imageCount: document.getElementById('imageCount'),
        convertButton: document.getElementById('convertButton'),
        loaderIcon: document.getElementById('loaderIcon'),
        convertButtonText: document.getElementById('convertButtonText'),
        loadingOverlay: document.getElementById('loadingOverlay'),
        loadingText: document.getElementById('loadingText'),
        qualitySelect: document.getElementById('qualitySelect'),
        pageSizeSelect: document.getElementById('pageSizeSelect'),
        marginSelect: document.getElementById('marginSelect'),
        fitSelect: document.getElementById('fitSelect')
    };

    // --- EVENT LISTENERS ---

    // 1. Upload Area Click
    elements.uploadArea.addEventListener('click', () => elements.fileInput.click());

    // 2. File Input Change
    elements.fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
        elements.fileInput.value = ''; // Reset for same-file uploads
    });

    // 3. Drag and Drop
    elements.uploadArea.addEventListener('dragenter', (e) => {
        e.preventDefault(); e.stopPropagation();
        uiManager.handleDragStyling(elements.uploadArea, true);
    });
    
    elements.uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault(); e.stopPropagation();
        uiManager.handleDragStyling(elements.uploadArea, true);
    });
    
    elements.uploadArea.addEventListener('dragleave', (e) => {
        e.preventDefault(); e.stopPropagation();
        uiManager.handleDragStyling(elements.uploadArea, false);
    });
    
    elements.uploadArea.addEventListener('drop', (e) => {
        e.preventDefault(); e.stopPropagation();
        uiManager.handleDragStyling(elements.uploadArea, false);
        handleFiles(e.dataTransfer.files);
    });

    // 4. Convert Button Click
    elements.convertButton.addEventListener('click', async () => {
        if (imageFiles.length === 0) {
            uiManager.showToast("Please add at least one image first.", "error");
            return;
        }

        const settings = {
            pageSize: elements.pageSizeSelect.value,
            margin: parseInt(elements.marginSelect.value, 10),
            quality: elements.qualitySelect.value,
            fit: elements.fitSelect.value,
        };

        try {
            uiManager.setLoadingState(true, "Initializing PDF...", elements);
            await PDFGenerator.generate(
                imageFiles, 
                settings, 
                (msg) => uiManager.setLoadingState(true, msg, elements)
            );
            uiManager.showToast("PDF generated successfully!", "success");
        } catch (error) {
            console.error(error);
            uiManager.showToast(error.message || "Failed to generate PDF.", "error");
        } finally {
            uiManager.setLoadingState(false, "", elements);
        }
    });
    
    // 5. Delete Image (Event Delegation)
    elements.imageGrid.addEventListener('click', (e) => {
        const deleteButton = e.target.closest('.delete-btn');
        if (deleteButton) {
            const card = deleteButton.closest('.image-card');
            const indexToDelete = parseInt(card.dataset.id, 10);
            
            if (!isNaN(indexToDelete)) {
                // Free memory for the object URL if it was still active, though we handle it on load
                imageFiles.splice(indexToDelete, 1);
                uiManager.showToast("Image removed.", "info");
                renderGrid(); // Re-render to update all
            }
        }
    });

    // --- FUNCTIONS ---

    // Handle incoming files (from drop or browse)
    function handleFiles(files) {
        const newImageFiles = [...files].filter(file => 
            file.type.startsWith('image/')
        );
        
        if (newImageFiles.length > 0) {
            // Optional: Filter out exact duplicates based on name, size, lastModified
            const uniqueNewFiles = newImageFiles.filter(newFile => {
                return !imageFiles.some(existingFile => 
                    existingFile.name === newFile.name && 
                    existingFile.size === newFile.size &&
                    existingFile.lastModified === newFile.lastModified
                );
            });

            if (uniqueNewFiles.length < newImageFiles.length) {
                uiManager.showToast("Skipped duplicate images.", "info");
            }

            if (uniqueNewFiles.length > 0) {
                imageFiles.push(...uniqueNewFiles);
                uiManager.showToast(`Added ${uniqueNewFiles.length} image(s).`, "success");
                renderGrid();
            }
        } else {
            uiManager.showToast("Please select valid image files (PNG, JPG, WEBP).", "error");
        }
    }

    // Initialize SortableJS
    function initSortable() {
        if (typeof Sortable === 'undefined') {
            console.warn("SortableJS not loaded yet.");
            return;
        }

        sortableInstance = new Sortable(elements.imageGrid, {
            animation: 150,
            ghostClass: 'sortable-ghost',
            dragClass: 'sortable-drag',
            onEnd: (evt) => {
                // Reorder the imageFiles array
                const [movedItem] = imageFiles.splice(evt.oldIndex, 1);
                imageFiles.splice(evt.newIndex, 0, movedItem);
                
                // Update DOM indices and page numbers
                uiManager.updateCardIndicesAndNumbers(elements.imageGrid);
            }
        });
    }

    // Wrapper to render grid
    function renderGrid() {
        uiManager.renderImageGrid(imageFiles, elements, sortableInstance, () => {
            initSortable();
        });
    }
});
