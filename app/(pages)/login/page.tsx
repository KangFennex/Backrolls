import PageContainer from "../../ui/shared/pageContainer";
import LoginForm from "../../ui/login/loginForm";

export default function Login() {
        return (
                <>
                        <PageContainer>
                                <div className="flex flex-col items-center pt-5 w-full">
                                        <LoginForm />
                                </div>
                        </PageContainer>
                </>
        )
}