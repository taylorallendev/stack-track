"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { WalletIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "~/components/ui/dialog";
import { BankrollOnboarding } from "./bankroll-onboarding";
import { useRouter } from "next/navigation";

interface BankrollSetupButtonProps {
  variant?: "default" | "outline" | "secondary";
  size?: "default" | "sm" | "lg";
  className?: string;
}

export function BankrollSetupButton({
  variant = "default",
  size = "default",
  className = "gap-1",
}: BankrollSetupButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  const handleOnboardingSuccess = () => {
    setIsDialogOpen(false);
    router.refresh();
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className={className} variant={variant} size={size}>
          <WalletIcon className="mr-2 h-4 w-4" />
          Setup Bankroll
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Setup Your Bankroll</DialogTitle>
          <DialogDescription>
            Configure your poker bankroll to start tracking your sessions and
            progress.
          </DialogDescription>
        </DialogHeader>
        <BankrollOnboarding onSuccess={handleOnboardingSuccess} />
      </DialogContent>
    </Dialog>
  );
}
