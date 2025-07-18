import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import type { ScheduledMessage } from '@/lib/types';
import { formatDistanceToNow, format } from 'date-fns';
import { Calendar, Clock, CheckCircle, AlertCircle, Send } from 'lucide-react';

interface ScheduledMessageCardProps {
  message: ScheduledMessage;
}

const statusConfig = {
    scheduled: { icon: Clock, color: "bg-blue-500", label: "Scheduled" },
    sent: { icon: CheckCircle, color: "bg-green-500", label: "Sent" },
    failed: { icon: AlertCircle, color: "bg-red-500", label: "Failed" },
};


export function ScheduledMessageCard({ message }: ScheduledMessageCardProps) {
    const { icon: StatusIcon, color, label } = statusConfig[message.status];
  return (
    <Card className="flex flex-col transition-all hover:shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-4">
            <Avatar>
                <AvatarImage src={message.contact.avatarUrl} alt={message.contact.name} data-ai-hint="person avatar" />
                <AvatarFallback>{message.contact.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
                <CardTitle className="font-headline text-lg">{message.contact.name}</CardTitle>
                <CardDescription>{message.contact.email}</CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-4">{message.content}</p>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{format(message.scheduledAt, 'PPP')}</span>
        </div>
        <div className="w-full flex justify-between items-center">
            <div className="flex items-center gap-2">
                <StatusIcon className={`h-4 w-4 ${message.status === 'scheduled' ? 'text-primary' : message.status === 'sent' ? 'text-green-500' : 'text-destructive'}`} />
                <span>
                {message.status === 'scheduled' 
                    ? `Sends in ${formatDistanceToNow(message.scheduledAt)}`
                    : `Sent ${formatDistanceToNow(message.scheduledAt, { addSuffix: true })}`}
                </span>
            </div>
            {message.templateId && <Badge variant="outline">Template</Badge>}
        </div>
      </CardFooter>
    </Card>
  );
}
