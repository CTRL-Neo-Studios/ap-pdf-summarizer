import type {User} from "#auth-utils";
import type {Summary} from "#shared/types/db";

export function summaryAbilities() {
    const createSummary = defineAbility((user: User) => {
        return !!(user && user.id)
    })
    const readOrUpdateOrDeleteSummary = defineAbility((user: User, summaries: Summary[]) => {
        return !!(user && user.id) && summaries.filter(i => i.userId != user.id).length == 0
    })

    return {
        createSummary,
        readOrUpdateOrDeleteSummary
    }
}