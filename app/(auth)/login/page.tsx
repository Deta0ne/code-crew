// app/(auth)/login/page.tsx
import AuthFlow from '@/components/features/auth/auth-flow';

export default function LoginPage() {
    return <AuthFlow initialStep="signin" />;
}
