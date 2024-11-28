export interface DocumentItemProps {
    id?: number;
    fileName: string;
    fileSize: string;
    onDelete: () => void;
    onView: () => void;
} 