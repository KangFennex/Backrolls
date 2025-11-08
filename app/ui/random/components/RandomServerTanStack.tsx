import RandomClientTanStack from './RandomClientTanStack';

export default function RandomServerTanStack() {
    // RandomClientTanStack now gets limit from URL params, so no need to pass it
    return <RandomClientTanStack />;
}