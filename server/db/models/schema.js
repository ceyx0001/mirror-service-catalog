import { pgTable, text, jsonb, varchar } from "drizzle-orm/pg-core";

const catalog = pgTable("catalog", {
  id: text('id').primaryKey(),
  profileName: varchar("profile_name", { length: 100 }).notNull(),
  url: varchar("post_link", { length: 100 }).notNull().unique(),
  items: jsonb("items")
    .default({
      icon: "",
      name: "",
      enchantMods: "",
      implicitMods: "",
      fracturedMods: "",
      craftedMods: "",
      crucibleMods: "",
    })
    .notNull(),
});

export default catalog;
