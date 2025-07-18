
import { Pencil, Send } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Template } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

interface TemplateCardProps {
  template: Template;
  onEdit: (template: Template) => void;
}

export function TemplateCard({ template, onEdit }: TemplateCardProps) {
  return (
    <Card className="flex flex-col transition-all hover:shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline">{template.title}</CardTitle>
        <CardDescription>
          Created {formatDistanceToNow(template.createdAt, { addSuffix: true })}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3">{template.content}</p>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button variant="outline" size="sm" className="w-full" onClick={() => onEdit(template)}>
          <Pencil className="mr-2 h-4 w-4" />
          Edit
        </Button>
        <Button asChild size="sm" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link href={`/templates/schedule?templateId=${template.id}`}>
                <Send className="mr-2 h-4 w-4" />
                Schedule
            </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
