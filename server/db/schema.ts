import {pgTable, timestamp, text, uuid, boolean, bigserial, json} from 'drizzle-orm/pg-core'
import {relations} from "drizzle-orm";
import type { ProfileMetadata, SummaryConfig } from '#shared/types/user'

// Tables

export const users = pgTable('users', {
    id: uuid().primaryKey().defaultRandom(),
    email: text().unique().notNull(),
    password: text().notNull(),
    admin: boolean().default(false),
    apiKey: text(),
    createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp({ withTimezone: true }).defaultNow().notNull().$onUpdateFn(() => new Date()),
})

export const profiles = pgTable('profiles', {
    id: uuid().primaryKey().defaultRandom(),
    username: text().notNull(),
    bio: text(),
    userId: uuid().notNull().references(() => users.id, {onDelete: 'cascade'}),
    metadata: json().$type<ProfileMetadata>(),
    createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp({ withTimezone: true }).defaultNow().notNull().$onUpdateFn(() => new Date()),
})

export const sessions = pgTable('sessions', {
    id: uuid().primaryKey().defaultRandom(),
    refreshToken: uuid().defaultRandom(),
    userId: uuid().notNull().references(() => users.id, {onDelete: 'cascade'}),
    createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
    expiresAt: timestamp({ withTimezone: true }).notNull()
})

export const summaries = pgTable('summaries', {
    id: uuid().primaryKey().defaultRandom(),
    userId: uuid().notNull().references(() => users.id, {onDelete: 'cascade'}),
    name: text().notNull().default('Untitled Summary'),
    prompt: text(),
    response: text(),
    config: json().$type<SummaryConfig>(),
    createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp({ withTimezone: true }).defaultNow().notNull().$onUpdateFn(() => new Date()),
})

export const files = pgTable('files', {
    id: uuid().primaryKey().defaultRandom(),
    userId: uuid().notNull().references(() => users.id, {onDelete: 'cascade'}),
    summaryId: uuid().notNull().references(() => summaries.id, {onDelete: 'cascade'}),
    blobPath: text().notNull(),
    createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp({ withTimezone: true }).defaultNow().notNull().$onUpdateFn(() => new Date()),
})

// Relations

export const usersRelations = relations(users, ({ many, one }) => ({
    profile: one(profiles),
    sessions: many(sessions),
    files: many(files)
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
    user: one(users, {
        fields: [sessions.userId],
        references: [users.id],
    })
}))

export const profilesRelations = relations(profiles, ({ one, many }) => ({
    user: one(users, {
        fields: [profiles.userId],
        references: [users.id],
    })
}))

export const summariesRelations = relations(summaries, ({many}) => ({
    files: many(files)
}))

export const filesRelations = relations(files, ({one}) => ({
    user: one(users, {
        fields: [files.userId],
        references: [users.id]
    }),
    summary: one(summaries, {
        fields: [files.summaryId],
        references: [summaries.id]
    })
}))
