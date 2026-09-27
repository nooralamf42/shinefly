"use client"

import { useOptimistic, useState, useTransition } from "react"
import { Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { deleteProduct, setInStock } from "@/app/admin/actions"

export function StockSwitch({ id, inStock }: { id: string; inStock: boolean }) {
  const [optimistic, setOptimistic] = useOptimistic(inStock)
  const [, startTransition] = useTransition()

  return (
    <Switch
      checked={optimistic}
      aria-label="In stock"
      onCheckedChange={(checked) =>
        startTransition(async () => {
          setOptimistic(checked)
          await setInStock(id, checked)
        })
      }
    />
  )
}

export function DeleteProductButton({ id, name }: { id: string; name: string }) {
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        render={<Button variant="ghost" size="icon" aria-label={`Delete ${name}`} />}
      >
        <Trash2 className="text-destructive" />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete “{name}”?</AlertDialogTitle>
          <AlertDialogDescription>This removes the product and its photo. It can’t be undone.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={pending}
            onClick={() =>
              startTransition(async () => {
                await deleteProduct(id)
                setOpen(false)
                toast.success("Product deleted")
              })
            }
          >
            {pending ? "Deleting…" : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
