
"use client"

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Separator } from '@/components/ui/separator';

export default function SettingsPage() {
    const [remindersEnabled, setRemindersEnabled] = useState(true);
    const [hoursBefore, setHoursBefore] = useState(24);
    const { toast } = useToast();

    const handleSaveChanges = () => {
        console.log({
            remindersEnabled,
            hoursBefore
        });
        toast({
            title: "Settings Saved",
            description: "Your appointment reminder settings have been updated.",
        });
    };
    
    return (
        <div>
            <h1 className="text-3xl font-bold font-headline tracking-tight mb-8">
                Settings
            </h1>

            <Card>
                <CardHeader>
                    <CardTitle>Appointment Reminders</CardTitle>
                    <CardDescription>
                        Configure automated messages for upcoming appointments. These settings will apply to all reminders sent from the "Appointment Reminders" template.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between space-x-2 p-4 border rounded-lg">
                        <Label htmlFor="reminders-enabled" className="flex flex-col space-y-1">
                            <span>Enable Appointment Reminders</span>
                            <span className="font-normal leading-snug text-muted-foreground">
                                Automatically send reminders for scheduled appointments.
                            </span>
                        </Label>
                        <Switch
                            id="reminders-enabled"
                            checked={remindersEnabled}
                            onCheckedChange={setRemindersEnabled}
                        />
                    </div>

                    <div className="space-y-2 p-4 border rounded-lg">
                        <Label htmlFor="hours-before">Send Reminder Before Appointment</Label>
                         <div className="relative max-w-xs">
                            <Input
                                id="hours-before"
                                type="number"
                                value={hoursBefore}
                                onChange={(e) => setHoursBefore(Number(e.target.value))}
                                className="pr-16"
                                min="1"
                                disabled={!remindersEnabled}
                            />
                             <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted-foreground">
                                hours
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Define how many hours before the scheduled time the reminder should be sent.
                        </p>
                    </div>

                    <div className="pt-4">
                        <Button onClick={handleSaveChanges} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                            Save Changes
                        </Button>
                    </div>

                </CardContent>
            </Card>
        </div>
    );
}
