export const up = async (knex) => {
  await knex.schema.createTable("users", (table) => {
    table.increments("id");
    table.text("email").notNullable().unique();
    table.text("passwordHash").notNullable();
    table.text("passwordSalt").notNullable();
    table.text("username").notNullable().unique();
    table.text("displayName").notNullable();
    table.timestamps(true, true, true);
  });
};

export const down = async (knex) => {
  await knex.schema.dropTable("users");
};
