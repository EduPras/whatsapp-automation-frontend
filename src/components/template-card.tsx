import { Pencil, Send, MoreVertical, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Template } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import { useTranslations } from 'next-intl';

interface TemplateCardProps {
  template: Template;
  onEdit: (template: Template) => void;
  onDelete: (templateId: string) => void;
}

export function TemplateCard({ template, onEdit, onDelete }: TemplateCardProps) {
  const t = useTranslations('TemplateCard');
  const tButtons = useTranslations('Buttons');
  
  return (
    <Card className="flex flex-col transition-all hover:shadow-lg">
       <CardHeader className="flex flex-row items-start justify-between">
        <div>
            <CardTitle className="font-headline">{template.title}</CardTitle>
            <CardDescription>
            {t('created', {timeAgo: formatDistanceToNow(template.createdAt, { addSuffix: true })})}
            </CardDescription>
        </div>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(template)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    {tButtons('edit')}
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href={`/templates/schedule?templateId=${template.id}`}>
                        <Send className="mr-2 h-4 w-4" />
                        {tButtons('schedule')}
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onDelete(template.id)} className="text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    {tButtons('delete')}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3">{template.content}</p>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
         <Button asChild size="sm" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link href={`/templates/schedule?templateId=${template.id}`}>
                <Send className="mr-2 h-4 w-4" />
                {t('schedule')}
            </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
