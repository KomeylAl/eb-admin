export function appendMediaRef(
  form: FormData,
  fileField: string,
  mediaIdField: string,
  value: unknown
) {
  if (!value) return;

  if (typeof value === "string") {
    form.append(mediaIdField, value);
    return;
  }

  if (typeof value === "object" && value !== null && "id" in value) {
    const id = (value as { id?: string }).id;
    if (id) {
      form.append(mediaIdField, id);
      return;
    }
  }

  if (value instanceof File) {
    form.append(fileField, value);
    return;
  }

  if (typeof FileList !== "undefined" && value instanceof FileList && value.length > 0) {
    form.append(fileField, value[0]);
    return;
  }

  if (Array.isArray(value) && value[0] instanceof File) {
    form.append(fileField, value[0]);
  }
}
