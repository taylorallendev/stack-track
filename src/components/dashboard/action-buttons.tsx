"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { PlusCircle, MinusCircle } from "lucide-react";
import { BankrollSetupButton } from "./bankroll-setup-button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "~/components/ui/dialog";
import { BankrollTransactionForm } from "./bankroll-transaction-form";
import { useRouter } from "next/navigation";

interface ActionButtonsProps {
  needsBankrollSetup?: boolean;
}

export function ActionButtons({
  needsBankrollSetup = false,
}: ActionButtonsProps) {
  const [isDepositDialogOpen, setIsDepositDialogOpen] = useState(false);
  const [isWithdrawalDialogOpen, setIsWithdrawalDialogOpen] = useState(false);
  const router = useRouter();

  const handleTransactionSuccess = () => {
    setIsDepositDialogOpen(false);
    setIsWithdrawalDialogOpen(false);
    router.refresh();
  };

  return (
    <div className="space-y-4">
      {needsBankrollSetup ? (
        <BankrollSetupButton />
      ) : (
        <Button size="lg" className="w-full md:w-auto" asChild>
          <Link href="/sessions/new">Start Session</Link>
        </Button>
      )}

      {!needsBankrollSetup && (
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-2">
              <>
                {/* Deposit Dialog */}
                <Dialog
                  open={isDepositDialogOpen}
                  onOpenChange={setIsDepositDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Record Deposit
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Record Deposit</DialogTitle>
                      <DialogDescription>
                        Add funds to your poker bankroll.
                      </DialogDescription>
                    </DialogHeader>
                    <BankrollTransactionForm
                      type="deposit"
                      onSuccess={handleTransactionSuccess}
                    />
                  </DialogContent>
                </Dialog>

                {/* Withdrawal Dialog */}
                <Dialog
                  open={isWithdrawalDialogOpen}
                  onOpenChange={setIsWithdrawalDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <MinusCircle className="mr-2 h-4 w-4" />
                      Record Withdrawal
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Record Withdrawal</DialogTitle>
                      <DialogDescription>
                        Withdraw funds from your poker bankroll.
                      </DialogDescription>
                    </DialogHeader>
                    <BankrollTransactionForm
                      type="withdrawal"
                      onSuccess={handleTransactionSuccess}
                    />
                  </DialogContent>
                </Dialog>
              </>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
