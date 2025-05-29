import { promises as fs } from 'fs';
import path from 'path';

const APP_DIR = path.join(process.cwd(), 'src/app');
const LOCALE_DIR = path.join(APP_DIR, '[locale]');

// Directories to preserve as route groups
const ROUTE_GROUPS = ['(top-funnel)', '(hotel-rp-pages)'];

// Files to exclude from moving
const EXCLUDE_FILES = [
    'layout.tsx',
    'globals.css',
    'not-found.tsx',
    'error.tsx',
    'global-error.tsx',
    'sitemap.ts'
];

async function moveToLocale() {
    try {
        // Create locale directory if it doesn't exist
        await fs.mkdir(LOCALE_DIR, { recursive: true });

        // Read all files and directories in app directory
        const entries = await fs.readdir(APP_DIR, { withFileTypes: true });

        for (const entry of entries) {
            const sourcePath = path.join(APP_DIR, entry.name);
            const targetPath = path.join(LOCALE_DIR, entry.name);

            // Skip if it's the locale directory itself or excluded files
            if (entry.name === '[locale]' || EXCLUDE_FILES.includes(entry.name)) {
                continue;
            }

            // If it's a route group, move its contents
            if (entry.isDirectory() && ROUTE_GROUPS.includes(entry.name)) {
                const groupDir = path.join(LOCALE_DIR, entry.name);
                await fs.mkdir(groupDir, { recursive: true });

                const groupEntries = await fs.readdir(sourcePath, { withFileTypes: true });
                for (const groupEntry of groupEntries) {
                    const groupSourcePath = path.join(sourcePath, groupEntry.name);
                    const groupTargetPath = path.join(groupDir, groupEntry.name);

                    if (groupEntry.isDirectory()) {
                        await fs.mkdir(groupTargetPath, { recursive: true });
                        await fs.cp(groupSourcePath, groupTargetPath, { recursive: true });
                    } else {
                        await fs.copyFile(groupSourcePath, groupTargetPath);
                    }
                }
            } else if (entry.isFile()) {
                // Move individual files
                await fs.copyFile(sourcePath, targetPath);
            } else if (entry.isDirectory()) {
                // Move other directories
                await fs.mkdir(targetPath, { recursive: true });
                await fs.cp(sourcePath, targetPath, { recursive: true });
            }
        }

        console.log('Successfully moved files to locale structure');
    } catch (error) {
        console.error('Error moving files:', error);
        process.exit(1);
    }
}

moveToLocale(); 