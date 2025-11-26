import { trpc } from "../trpc";

export function useSubmitQuote() {
    return trpc.quotes.submit.useMutation();
}