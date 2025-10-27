import PageContainer from "../../ui/pageContainer";
import SignUpForm from "../../ui/signup/signUpForm";

export default function SignUp() {
    return (
                <main className="flex items-center min-h-screen min-w-full flex-col p-6">
                        <PageContainer className="h-full">
                                <div className="flex flex-col items-center pt-5">
                                        <SignUpForm />
                                </div> 
                        </PageContainer>
                </main>
    )
}