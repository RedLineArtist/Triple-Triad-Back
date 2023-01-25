const hiddenFields = [
  "passwordHash",
  "passwordSalt",
  "email",
  "role",
  "createdAt",
  "updatedAt",
];

const filterDBResult = (rows) =>
  rows.map((row) =>
    Object.fromEntries(
      Object.entries(row)
        .filter(([field]) => !hiddenFields.includes(field))
        .map(([field, value]) => {
          if (
            value instanceof Date ||
            ["string", "number", "boolean"].includes(typeof value) ||
            !value
          ) {
            return [field, value];
          }

          if (Array.isArray(value)) {
            return [field, filterDBResult(value)];
          }

          return [field, ...filterDBResult([value])];
        })
    )
  );

export default filterDBResult;
