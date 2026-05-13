import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function LogoutModal({ isOpen, onClose, onConfirm }: LogoutModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[425px] border-none p-8'>
        <DialogHeader className='flex flex-col items-center justify-center space-y-4'>
          <div className='p-4 bg-red-50 rounded-full'>
            <LogOut className='h-8 w-8 text-[#FE504E]' />
          </div>
          <DialogTitle className='text-2xl font-bold text-center text-[#292929]'>
            Confirm Logout
          </DialogTitle>
          <DialogDescription className='text-center text-lg text-gray-500'>
            Are you sure you want to log out? You will need to login again to
            access your dashboard.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className='flex sm:justify-center gap-4 mt-4'>
          <Button
            variant='outline'
            onClick={onClose}
            className='flex-1 py-6 border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl text-lg'
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className='flex-1 py-6 bg-[#FE504E] hover:bg-red-600 text-white rounded-xl text-lg'
          >
            Log Out
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
