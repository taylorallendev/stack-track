"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import type { SessionData } from "~/components/sessions/session-controls";

interface StartSessionPanelProps {
  onStartSession: (data: Partial<SessionData>) => void;
}

export function StartSessionPanel({ onStartSession }: StartSessionPanelProps) {
  const [stakes, setStakes] = useState("5NL");
  const [buyIn, setBuyIn] = useState("50");
  const [site, setSite] = useState("Bovada");
  const [notes, setNotes] = useState("");
  const [customStakes, setCustomStakes] = useState("");
  const [showCustomStakes, setShowCustomStakes] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStartSession({
      stakes: showCustomStakes ? customStakes : stakes,
      buyIn: Number.parseFloat(buyIn),
      site,
      notes,
    });
  };

  const handleStakesChange = (value: string) => {
    if (value === "Other") {
      setShowCustomStakes(true);
    } else {
      setShowCustomStakes(false);
      setStakes(value);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Start New Session</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="stakes">Stakes</Label>
              <Select
                value={showCustomStakes ? "Other" : stakes}
                onValueChange={handleStakesChange}
              >
                <SelectTrigger id="stakes">
                  <SelectValue placeholder="Select stakes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2NL">2NL</SelectItem>
                  <SelectItem value="5NL">5NL</SelectItem>
                  <SelectItem value="10NL">10NL</SelectItem>
                  <SelectItem value="25NL">25NL</SelectItem>
                  <SelectItem value="50NL">50NL</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              {showCustomStakes && (
                <Input
                  className="mt-2"
                  placeholder="Enter custom stakes"
                  value={customStakes}
                  onChange={(e) => setCustomStakes(e.target.value)}
                />
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="buy-in">Buy-In Amount ($)</Label>
              <Input
                id="buy-in"
                type="number"
                min="0"
                step="0.01"
                value={buyIn}
                onChange={(e) => setBuyIn(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="site">Site/Location</Label>
              <Select value={site} onValueChange={setSite}>
                <SelectTrigger id="site">
                  <SelectValue placeholder="Select site" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bovada">Bovada</SelectItem>
                  <SelectItem value="PokerStars">PokerStars</SelectItem>
                  <SelectItem value="PartyPoker">PartyPoker</SelectItem>
                  <SelectItem value="888Poker">888Poker</SelectItem>
                  <SelectItem value="GGPoker">GGPoker</SelectItem>
                  <SelectItem value="ACR">America&apos;s Cardroom</SelectItem>
                  <SelectItem value="Ignition">Ignition</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="notes">Session Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Enter session goals or context"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          <Button type="submit" size="lg" className="w-full">
            Start New Session
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
