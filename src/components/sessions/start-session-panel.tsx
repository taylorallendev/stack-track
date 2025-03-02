"use client";

import type React from "react";
import { useEffect, useState } from "react";
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
import { getPokerSites, getGameTypes } from "~/server/actions/session";
import type { PokerSite, GameType } from "~/server/actions/session";

interface StartSessionPanelProps {
  onStartSession: (data: Partial<SessionData>) => void;
}

export function StartSessionPanel({ onStartSession }: StartSessionPanelProps) {
  const [stakes, setStakes] = useState("5NL");
  const [buyIn, setBuyIn] = useState("50");
  const [siteId, setSiteId] = useState("");
  const [gameTypeId, setGameTypeId] = useState("");
  const [notes, setNotes] = useState("");
  const [customStakes, setCustomStakes] = useState("");
  const [showCustomStakes, setShowCustomStakes] = useState(false);

  // State for DB data
  const [sites, setSites] = useState<PokerSite[]>([]);
  const [gameTypes, setGameTypes] = useState<GameType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchReferenceData() {
      try {
        setIsLoading(true);

        // Fetch sites and game types in parallel
        const [sitesData, gameTypesData] = await Promise.all([
          getPokerSites(),
          getGameTypes(),
        ]);

        setSites(sitesData);
        setGameTypes(gameTypesData);

        // Set default selections if data is available
        if (sitesData.length > 0 && sitesData[0]?.id) {
          setSiteId(sitesData[0].id);
        }

        if (gameTypesData.length > 0 && gameTypesData[0]?.id) {
          setGameTypeId(gameTypesData[0].id);
        }
      } catch (error) {
        console.error("Error fetching session reference data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    void fetchReferenceData();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Find the site name for display purposes
    const selectedSite = sites.find((site) => site.id === siteId);

    onStartSession({
      stakes: showCustomStakes ? customStakes : stakes,
      buyIn: Number.parseFloat(buyIn),
      site: selectedSite ? selectedSite.name : "Unknown",
      siteId,
      gameTypeId,
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
        {isLoading ? (
          <div className="space-y-4">
            <div className="h-10 animate-pulse rounded-md bg-muted" />
            <div className="h-10 animate-pulse rounded-md bg-muted" />
            <div className="h-10 animate-pulse rounded-md bg-muted" />
            <div className="h-20 animate-pulse rounded-md bg-muted" />
            <div className="h-10 animate-pulse rounded-md bg-muted" />
          </div>
        ) : (
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
                    <SelectItem value="100NL">100NL</SelectItem>
                    <SelectItem value="200NL">200NL</SelectItem>
                    <SelectItem value="400NL">400NL</SelectItem>
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
                <Select value={siteId} onValueChange={setSiteId}>
                  <SelectTrigger id="site">
                    <SelectValue placeholder="Select site" />
                  </SelectTrigger>
                  <SelectContent>
                    {sites.map((site) => (
                      <SelectItem key={site.id} value={site.id}>
                        {site.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gameType">Game Type</Label>
                <Select value={gameTypeId} onValueChange={setGameTypeId}>
                  <SelectTrigger id="gameType">
                    <SelectValue placeholder="Select game type" />
                  </SelectTrigger>
                  <SelectContent>
                    {gameTypes.map((gameType) => (
                      <SelectItem key={gameType.id} value={gameType.id}>
                        {gameType.name}
                      </SelectItem>
                    ))}
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
        )}
      </CardContent>
    </Card>
  );
}
