import NextPrev from "../../common/ui/NextPrev"
import { useDeployPoAWizardStore } from "../config/store"

export default function Welcome() {
    const { goToNextStep, goToPreviousStep } = useDeployPoAWizardStore()

    return (
        <div>
            <h1>Welcome</h1>
            <NextPrev
                nextDisabled={false}
                prevHidden={false}
                onNext={goToNextStep}
                onPrev={goToPreviousStep}
            />
        </div>
    )
}
