import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { translateZodError } from "@/lib/utils/zod-intl";

export function useIntlZodResolver(schema: any) {
  const t = useTranslations();

  return async (values: any, context: any, options: any) => {
    const result = await zodResolver(schema)(values, context, options);

    if (!result.errors || Object.keys(result.errors).length === 0) {
      return result;
    }

    const parsed = schema.safeParse(values);

    if (!parsed.success) {
      const translated = translateZodError(parsed.error, t);

      return {
        values: {},
        errors: translated.reduce(
          (acc, curr) => {
            acc[curr.path] = {
              type: "manual",
              message: curr.message,
            };
            return acc;
          },
          {} as Record<string, any>
        ),
      };
    }

    return result;
  };
}
