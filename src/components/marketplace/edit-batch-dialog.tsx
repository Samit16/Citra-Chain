'use client';

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

interface EditBatchDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (batchId: string, quantity: number, pricePerKg: string) => Promise<void>;
    batch: {
        id: string;
        quantity: number;
        pricePerKg?: number;
    } | null;
}

export function EditBatchDialog({ isOpen, onClose, onSave, batch }: EditBatchDialogProps) {
    const [quantity, setQuantity] = useState<string>('');
    const [price, setPrice] = useState<string>('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (batch) {
            setQuantity(batch.quantity.toString());
            setPrice(batch.pricePerKg?.toString() || '');
        }
    }, [batch]);

    const handleSave = async () => {
        if (!batch) return;
        setIsSaving(true);
        try {
            await onSave(batch.id, Number(quantity), price);
            onClose();
        } catch (error) {
            console.error("Failed to save", error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Batch #{batch?.id}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="quantity" className="text-right">
                            Quantity (kg)
                        </Label>
                        <Input
                            id="quantity"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            className="col-span-3"
                            type="number"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="price" className="text-right">
                            Price (ETH)
                        </Label>
                        <Input
                            id="price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="col-span-3"
                            type="number"
                            step="0.0001"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={isSaving}>Cancel</Button>
                    <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
