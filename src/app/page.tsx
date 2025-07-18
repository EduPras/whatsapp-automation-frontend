import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquareText } from 'lucide-react';

const GoogleIcon = () => (
  <svg role="img" viewBox="0 0 24 24" className="h-4 w-4 mr-2">
    <path
      fill="currentColor"
      d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.3 1.62-4.25 1.62-5.03 0-9.12-4.09-9.12-9.12s4.09-9.12 9.12-9.12c2.82 0 4.84 1.09 6.24 2.44l-2.5 2.52c-.81-.79-1.85-1.25-3.74-1.25-3.03 0-5.49 2.46-5.49 5.49s2.46 5.49 5.49 5.49c2.18 0 3.32-.94 3.48-2.68h-3.48z"
    ></path>
  </svg>
);

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="absolute top-8 left-8 flex items-center gap-2 text-lg font-semibold">
        <MessageSquareText className="h-6 w-6 text-primary" />
        <span className="font-headline">Scheduled Messenger</span>
      </div>
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline tracking-tight">Welcome Back</CardTitle>
          <CardDescription>Sign in to manage your message templates.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <Button asChild className="w-full" size="lg">
              <Link href="/templates">
                <GoogleIcon />
                Sign in with Google
              </Link>
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </CardContent>
      </Card>
      <footer className="absolute bottom-4 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Scheduled Messenger. All Rights Reserved.
      </footer>
    </div>
  );
}
