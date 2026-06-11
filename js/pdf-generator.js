/**
 * PDF Generator Module
 * Handles the logic for converting images to a PDF using jsPDF.
 */

export class PDFGenerator {
    /**
     * Converts a File object to a Base64 Data URL.
     * @param {File} file - The image file.
     * @returns {Promise<string>} - The data URL.
     */
    static fileToDataUrl(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    /**
     * Gets dimensions of an image from a Data URL.
     * @param {string} dataUrl - The image data URL.
     * @returns {Promise<{width: number, height: number}>} - The image dimensions.
     */
    static getImageDimensions(dataUrl) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve({ width: img.width, height: img.height });
            img.onerror = reject;
            img.src = dataUrl;
        });
    }

    /**
     * Generates and downloads a PDF from the provided images and settings.
     * @param {File[]} imageFiles - Array of image files.
     * @param {Object} settings - PDF settings (pageSize, margin, quality, fit).
     * @param {Function} updateProgress - Callback to update loading UI message.
     * @returns {Promise<void>}
     */
    static async generate(imageFiles, settings, updateProgress) {
        if (!imageFiles || imageFiles.length === 0) {
            throw new Error("No images provided for PDF generation.");
        }

        const { jsPDF } = window.jspdf;
        
        const compression = {
            'Standard': 'FAST',
            'High': 'MEDIUM', // jsPDF 'MEDIUM' is still very high quality
            'Ultra': 'NONE' // Lossless
        }[settings.quality] || 'MEDIUM';

        // Fix: Use 'let' instead of 'const' to allow re-assignment if the first image is landscape
        let doc = new jsPDF({
            orientation: 'p',
            unit: 'mm',
            format: settings.pageSize
        });

        try {
            for (let i = 0; i < imageFiles.length; i++) {
                updateProgress(`Processing image ${i + 1} of ${imageFiles.length}...`);
                
                const file = imageFiles[i];
                const dataUrl = await this.fileToDataUrl(file);
                const { width: imgWidth, height: imgHeight } = await this.getImageDimensions(dataUrl);

                // Get page dimensions
                const pageW = doc.internal.pageSize.getWidth();
                const pageH = doc.internal.pageSize.getHeight();
                
                // Determine orientation based on image
                const isImgLandscape = imgWidth > imgHeight;
                const isPageLandscape = pageW > pageH;

                let orientationChanged = false;

                if (isImgLandscape && !isPageLandscape) {
                    orientationChanged = true;
                } else if (!isImgLandscape && isPageLandscape) {
                    orientationChanged = true;
                }

                const targetOrientation = isImgLandscape ? 'l' : 'p';
                
                if (i > 0) {
                    // Add a new page with the correct orientation
                    doc.addPage(undefined, targetOrientation);
                } else if (orientationChanged) {
                    // For the first page, if orientation needs to change, re-initialize doc
                    if (targetOrientation === 'l') {
                        doc = new jsPDF({
                            orientation: 'l',
                            unit: 'mm',
                            format: settings.pageSize
                        });
                    }
                }
                
                // Get current page dimensions again (in case orientation changed)
                const currentPageW = doc.internal.pageSize.getWidth();
                const currentPageH = doc.internal.pageSize.getHeight();
                
                const effPageW = currentPageW - settings.margin * 2;
                const effPageH = currentPageH - settings.margin * 2;

                let finalImgW, finalImgH;

                if (settings.fit === 'original') {
                    // Use original dimensions (converted from px to mm)
                    // 1px = 0.264583 mm (at 96 DPI)
                    finalImgW = imgWidth * 0.264583;
                    finalImgH = imgHeight * 0.264583;
                } else {
                    // Auto-fit logic
                    const wRatio = effPageW / imgWidth;
                    const hRatio = effPageH / imgHeight;
                    const ratio = Math.min(wRatio, hRatio);

                    finalImgW = imgWidth * ratio;
                    finalImgH = imgHeight * ratio;
                }
                
                // Don't allow image to be larger than effective page
                if (finalImgW > effPageW) {
                    finalImgW = effPageW;
                    finalImgH = (effPageW / (imgWidth * 0.264583)) * (imgHeight * 0.264583);
                }
                if (finalImgH > effPageH) {
                    finalImgH = effPageH;
                    finalImgW = (effPageH / (imgHeight * 0.264583)) * (imgWidth * 0.264583);
                }

                // Center the image
                const posX = (currentPageW - finalImgW) / 2;
                const posY = (currentPageH - finalImgH) / 2;

                doc.addImage(
                    dataUrl,
                    'auto', // jsPDF will determine format (JPEG/PNG)
                    posX,
                    posY,
                    finalImgW,
                    finalImgH,
                    undefined, // alias
                    compression
                );
            }

            updateProgress("Saving PDF...");
            doc.save('Accurex-Converted.pdf');

        } catch (error) {
            console.error("Error generating PDF:", error);
            throw new Error("Failed to generate PDF. Check console for details.");
        }
    }
}
