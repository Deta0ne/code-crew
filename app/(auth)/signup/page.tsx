// app/(auth)/signup/page.tsx
import AuthFlow from '@/components/features/auth/auth-flow';

export default function SignupPage() {
    return <AuthFlow initialStep="signup" />;
}
