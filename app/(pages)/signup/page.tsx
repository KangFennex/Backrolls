import PageContainer from "../../ui/pageContainer";
import SignUpForm from "../../ui/signup/signUpForm";

export default function SignUp() {
        return (
                <>
                        <PageContainer>
                                <div className="flex flex-col items-center pt-5">
                                        <SignUpForm />
                                </div>
                        </PageContainer>
                </>
        )
}