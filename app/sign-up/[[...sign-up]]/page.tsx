import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <SignUp 
        path="/sign-up" 
        routing="path"
        fallbackRedirectUrl="/company-setup"
      />
    </div>
  );
} 