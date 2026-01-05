import type {User} from "#auth-utils";
import type {SummaryFile} from "#shared/types/db";

export function summaryFileAbilities() {
    const createSummaryFile = defineAbility((user: User) => {
        return !!(user && user.id)
    })
    const readOrUpdateOrDeleteSummaryFiles = defineAbility((user: User, summaries: SummaryFile[]) => {
        return !!(user && user.id) && summaries.filter(i => i.userId != user.id).length == 0
    })

    return {
        createSummaryFile,
        readOrUpdateOrDeleteSummaryFiles
    }
}